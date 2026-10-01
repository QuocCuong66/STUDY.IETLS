from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import settings
from auth import router as auth_router
from chat import router as chat_router

app = FastAPI(
    title="IELTS Wonderland API",
    description="Backend API for IELTS Speaking Wonderland: Firebase session auth and AI chatbot (OpenAI GPT & Gemini)",
    version="2.0.0",
)

# Credentials (cookies) require explicit origins, never "*"
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_origin_regex=settings.LOCAL_ORIGIN_REGEX,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type"],
)

app.include_router(auth_router)
app.include_router(chat_router)


@app.get("/")
def read_root():
    return {"status": "online", "service": "IELTS Wonderland Backend API", "version": app.version}


@app.get("/api/health")
def health_check():
    return {"status": "healthy"}
