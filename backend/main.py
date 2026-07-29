import os
import httpx
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI(
    title="IELTS Wonderland API",
    description="Backend API for IELTS Speaking Wonderland Chatbot (OpenAI GPT & Gemini AI) and Authentication",
    version="1.0.0"
)

# Enable CORS for Vercel Frontend and local testing
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request & Response Models
class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str
    provider: str = "openai"
    status: str = "success"

class LoginRequest(BaseModel):
    username: str
    password: str

class LoginResponse(BaseModel):
    success: bool
    message: str
    username: Optional[str] = None

# Sample Valid Users
VALID_USERS = {
    "lengocvananh": "181007",
    "admin": "123456",
    "hocvien1": "matkhau1",
    "hocvien2": "matkhau2",
    "giangvien": "gv2025",
    "nguyenan": "an123",
    "lethao": "thao321"
}

@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "IELTS Wonderland Backend API",
        "version": "1.0.0"
    }

@app.get("/api/health")
def health_check():
    return {"status": "healthy"}

@app.post("/api/login", response_model=LoginResponse)
def login(credentials: LoginRequest):
    username = credentials.username.strip()
    password = credentials.password.strip()

    if username in VALID_USERS and VALID_USERS[username] == password:
        return LoginResponse(
            success=True,
            message="Đăng nhập thành công!",
            username=username
        )
    else:
        return LoginResponse(
            success=False,
            message="Tài khoản hoặc mật khẩu không chính xác!"
        )

@app.post("/api/chat", response_model=ChatResponse)
async def chat_with_ai(request: ChatRequest):
    user_message = request.message.strip()
    if not user_message:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Tin nhắn không được để trống"
        )
    
    load_dotenv(override=True)
    openai_key = os.getenv("OPENAI_API_KEY", "").strip()
    gemini_key = os.getenv("GEMINI_API_KEY", "").strip()
    openai_model = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
    gemini_model = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")

    system_prompt = "Bạn là trợ lý IELTS thân thiện trên website 'IELTS Speaking Wonderland'. Hãy trả lời ngắn gọn, súc tích và khích lệ người học bằng tiếng Việt."

    async with httpx.AsyncClient(timeout=30.0) as client:
        # 1. Try OpenAI GPT API
        if openai_key:
            try:
                openai_url = "https://api.openai.com/v1/chat/completions"
                headers = {
                    "Authorization": f"Bearer {openai_key}",
                    "Content-Type": "application/json"
                }
                payload = {
                    "model": openai_model,
                    "messages": [
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_message}
                    ],
                    "temperature": 0.7
                }
                res = await client.post(openai_url, headers=headers, json=payload)
                if res.status_code == 200:
                    data = res.json()
                    choices = data.get("choices", [])
                    if choices and "message" in choices[0]:
                        reply = choices[0]["message"].get("content", "").strip()
                        if reply:
                            return ChatResponse(response=reply, provider="OpenAI GPT", status="success")
            except Exception as e:
                print(f"OpenAI API error: {e}, attempting Gemini fallback...")

        # 2. Try Gemini API as fallback
        if gemini_key:
            try:
                gemini_url = f"https://generativelanguage.googleapis.com/v1beta/models/{gemini_model}:generateContent?key={gemini_key}"
                payload = {
                    "contents": [{
                        "parts": [{
                            "text": f"{system_prompt}\n\nNgười học hỏi: {user_message}"
                        }]
                    }]
                }
                res = await client.post(gemini_url, json=payload)
                if res.status_code == 200:
                    data = res.json()
                    candidates = data.get("candidates", [])
                    if candidates and "content" in candidates[0]:
                        parts = candidates[0]["content"].get("parts", [])
                        if parts and "text" in parts[0]:
                            reply = parts[0]["text"].strip()
                            return ChatResponse(response=reply, provider="Google Gemini", status="success")
            except Exception as e:
                print(f"Gemini API error: {e}")

        # If both fail or no key works
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Không thể kết nối đến AI Chatbot Service. Vui lòng kiểm tra lại API key trong .env!"
        )
