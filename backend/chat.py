from typing import Optional

import httpx
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel

import settings
from auth import UserInfo, current_user

router = APIRouter(prefix="/api", tags=["chat"])

SYSTEM_PROMPT = (
    "Bạn là trợ lý IELTS thân thiện trên website 'IELTS Speaking Wonderland'. "
    "Hãy trả lời ngắn gọn, súc tích và khích lệ người học bằng tiếng Việt."
)


class ChatRequest(BaseModel):
    message: str


class ChatResponse(BaseModel):
    response: str
    provider: str
    status: str = "success"


async def _ask_openai(client: httpx.AsyncClient, message: str) -> Optional[str]:
    res = await client.post(
        "https://api.openai.com/v1/chat/completions",
        headers={"Authorization": f"Bearer {settings.OPENAI_API_KEY}"},
        json={
            "model": settings.OPENAI_MODEL,
            "messages": [
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": message},
            ],
            "temperature": 0.7,
        },
    )
    res.raise_for_status()
    choices = res.json().get("choices") or []
    return choices[0]["message"]["content"].strip() if choices else None


async def _ask_gemini(client: httpx.AsyncClient, message: str) -> Optional[str]:
    res = await client.post(
        f"https://generativelanguage.googleapis.com/v1beta/models/{settings.GEMINI_MODEL}:generateContent",
        params={"key": settings.GEMINI_API_KEY},
        json={"contents": [{"parts": [{"text": f"{SYSTEM_PROMPT}\n\nNgười học hỏi: {message}"}]}]},
    )
    res.raise_for_status()
    candidates = res.json().get("candidates") or []
    parts = candidates[0].get("content", {}).get("parts", []) if candidates else []
    return parts[0]["text"].strip() if parts else None


# Tried in order; the first provider that answers wins
PROVIDERS = [
    ("OpenAI GPT", settings.OPENAI_API_KEY, _ask_openai),
    ("Google Gemini", settings.GEMINI_API_KEY, _ask_gemini),
]


@router.post("/chat", response_model=ChatResponse)
async def chat_with_ai(request: ChatRequest, _user: UserInfo = Depends(current_user)):
    message = request.message.strip()
    if not message:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Tin nhắn không được để trống")

    async with httpx.AsyncClient(timeout=30.0) as client:
        for name, key, ask in PROVIDERS:
            if not key:
                continue
            try:
                reply = await ask(client, message)
                if reply:
                    return ChatResponse(response=reply, provider=name)
            except Exception as e:
                print(f"{name} API error: {e}")

    raise HTTPException(
        status.HTTP_500_INTERNAL_SERVER_ERROR,
        "Không thể kết nối đến AI Chatbot Service. Vui lòng kiểm tra lại API key trong .env!",
    )
