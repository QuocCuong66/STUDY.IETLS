import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).parent / ".env")
load_dotenv()


def _env(key: str, default: str = "") -> str:
    return os.getenv(key, default).strip()


# AI providers
OPENAI_API_KEY = _env("OPENAI_API_KEY")
OPENAI_MODEL = _env("OPENAI_MODEL", "gpt-4o-mini")
GEMINI_API_KEY = _env("GEMINI_API_KEY")
GEMINI_MODEL = _env("GEMINI_MODEL", "gemini-2.5-flash")

# Firebase service account, first match wins:
# 1. JSON content in the FIREBASE_SERVICE_ACCOUNT env var
# 2. Render Secret File named firebase-service-account.json
# 3. Key file next to this module (local, gitignored)
FIREBASE_SERVICE_ACCOUNT = _env("FIREBASE_SERVICE_ACCOUNT")
FIREBASE_KEY_FILES = [
    Path("/etc/secrets/firebase-service-account.json"),
    Path(__file__).parent / "firebase-service-account.json",
]

# Session cookie
SESSION_COOKIE_NAME = "session"
SESSION_COOKIE_SECURE = _env("SESSION_COOKIE_SECURE", "true").lower() != "false"
SESSION_DAYS_REMEMBER = 14  # Firebase allows at most 14 days
SESSION_DAYS_DEFAULT = 1

# CORS: comma-separated extra origins. Production goes through the Vercel proxy (same origin),
# so this is only needed when the frontend calls the backend directly.
ALLOWED_ORIGINS = [o.strip() for o in _env("ALLOWED_ORIGINS").split(",") if o.strip()]
LOCAL_ORIGIN_REGEX = r"http://(localhost|127\.0\.0\.1)(:\d+)?"
