import os
import pytest
from fastapi.testclient import TestClient
from backend.main import app, VALID_USERS

client = TestClient(app)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"
    assert "IELTS Wonderland" in data["service"]

def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}

def test_login_success():
    response = client.post("/api/login", json={"username": "admin", "password": "123456"})
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["username"] == "admin"
    assert "thành công" in data["message"]

def test_login_failure():
    response = client.post("/api/login", json={"username": "admin", "password": "wrongpassword"})
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is False
    assert data["username"] is None
    assert "không chính xác" in data["message"]

def test_register_success():
    new_user = "student_test_99"
    response = client.post("/api/register", json={"username": new_user, "password": "securepass123"})
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "thành công" in data["message"]

    # Verify user can login now
    login_resp = client.post("/api/login", json={"username": new_user, "password": "securepass123"})
    assert login_resp.json()["success"] is True

def test_register_duplicate():
    response = client.post("/api/register", json={"username": "admin", "password": "123"})
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is False
    assert "đã tồn tại" in data["message"]

def test_register_empty():
    response = client.post("/api/register", json={"username": "   ", "password": ""})
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is False
    assert "không được để trống" in data["message"]

def test_chat_empty_message():
    response = client.post("/api/chat", json={"message": "   "})
    assert response.status_code == 400
    assert "không được để trống" in response.json()["detail"]

def test_chat_no_api_keys(monkeypatch):
    monkeypatch.setenv("OPENAI_API_KEY", "")
    monkeypatch.setenv("GEMINI_API_KEY", "")
    response = client.post("/api/chat", json={"message": "Xin chào AI"})
    assert response.status_code == 500
    assert "Không thể kết nối đến AI Chatbot Service" in response.json()["detail"]
