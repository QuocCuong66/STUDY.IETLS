import json
import os
import time
from datetime import timedelta
from typing import Optional

import firebase_admin
from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from firebase_admin import auth as fb_auth, credentials
from pydantic import BaseModel

import settings

router = APIRouter(prefix="/api", tags=["auth"])

# An ID token may only be exchanged for a session cookie shortly after sign-in
MAX_AUTH_AGE_SECONDS = 5 * 60
# Tolerates the server clock running slightly behind Google's ("Token used too early")
CLOCK_SKEW_SECONDS = 10


def _load_credential() -> Optional[credentials.Certificate]:
    raw = settings.FIREBASE_SERVICE_ACCOUNT
    if raw:
        try:
            return credentials.Certificate(json.loads(raw))
        except json.JSONDecodeError:
            # Never log the value itself: it is a private key
            raise ValueError(f"FIREBASE_SERVICE_ACCOUNT is not valid JSON "
                             f"(starts with {raw[:1]!r}, length {len(raw)}); paste the whole key file content")
    key_file = next((f for f in settings.FIREBASE_KEY_FILES if f.exists()), None)
    if key_file:
        return credentials.Certificate(str(key_file))
    if os.getenv("GOOGLE_APPLICATION_CREDENTIALS"):
        return None  # firebase_admin loads it itself
    raise ValueError("No Firebase key found: set FIREBASE_SERVICE_ACCOUNT or add a key file at "
                     + " or ".join(str(f) for f in settings.FIREBASE_KEY_FILES))


def _firebase_app() -> firebase_admin.App:
    try:
        return firebase_admin.get_app()
    except ValueError:
        pass
    try:
        return firebase_admin.initialize_app(_load_credential())
    except Exception as e:
        print(f"Firebase init error: {e}")
        raise HTTPException(status.HTTP_503_SERVICE_UNAVAILABLE, "Máy chủ chưa cấu hình Firebase")


class SessionRequest(BaseModel):
    idToken: str
    remember: bool = False


class UserInfo(BaseModel):
    uid: str
    email: Optional[str] = None
    name: Optional[str] = None


def current_user(request: Request) -> UserInfo:
    cookie = request.cookies.get(settings.SESSION_COOKIE_NAME)
    if not cookie:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Bạn chưa đăng nhập")
    try:
        claims = fb_auth.verify_session_cookie(cookie, check_revoked=True, app=_firebase_app(),
                                               clock_skew_seconds=CLOCK_SKEW_SECONDS)
    except HTTPException:
        raise
    except Exception as e:
        print(f"Session cookie rejected: {e}")
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Phiên đăng nhập đã hết hạn")
    return UserInfo(uid=claims["uid"], email=claims.get("email"), name=claims.get("name"))


@router.post("/session", response_model=UserInfo)
def create_session(body: SessionRequest, response: Response):
    app = _firebase_app()
    try:
        claims = fb_auth.verify_id_token(body.idToken, app=app, clock_skew_seconds=CLOCK_SKEW_SECONDS)
    except Exception as e:
        print(f"ID token rejected: {e}")
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Token đăng nhập không hợp lệ")
    if time.time() - claims["auth_time"] > MAX_AUTH_AGE_SECONDS:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Vui lòng đăng nhập lại")

    days = settings.SESSION_DAYS_REMEMBER if body.remember else settings.SESSION_DAYS_DEFAULT
    expires_in = timedelta(days=days)
    cookie = fb_auth.create_session_cookie(body.idToken, expires_in=expires_in, app=app)
    response.set_cookie(
        settings.SESSION_COOKIE_NAME,
        cookie,
        # Without max_age the cookie is dropped when the browser closes
        max_age=int(expires_in.total_seconds()) if body.remember else None,
        httponly=True,
        secure=settings.SESSION_COOKIE_SECURE,
        samesite="lax",
        path="/",
    )
    return UserInfo(uid=claims["uid"], email=claims.get("email"), name=claims.get("name"))


@router.get("/me", response_model=UserInfo)
def me(user: UserInfo = Depends(current_user)):
    return user


@router.post("/logout")
def logout(request: Request, response: Response):
    cookie = request.cookies.get(settings.SESSION_COOKIE_NAME)
    if cookie:
        try:
            app = _firebase_app()
            claims = fb_auth.verify_session_cookie(cookie, app=app)
            fb_auth.revoke_refresh_tokens(claims["sub"], app=app)
        except Exception:
            pass  # Cookie is cleared below regardless
    response.delete_cookie(settings.SESSION_COOKIE_NAME, path="/")
    return {"success": True}
