import pytest
from fastapi.testclient import TestClient
from app import app

client = TestClient(app)

def test_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "running"

def test_register_and_login():
    email = "testuser@example.com"
    password = "testpass123"
    # Register
    response = client.post("/register", json={"email": email, "password": password})
    assert response.status_code in [200, 400]  # 400 if already registered
    # Login
    response = client.post("/token", json={"email": email, "password": password})
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data

def test_upload_no_token():
    with open("test_api.py", "rb") as f:
        response = client.post("/upload", files={"file": ("test_api.py", f, "text/plain")})
    assert response.status_code == 401

def test_logout():
    response = client.post("/logout")
    assert response.status_code == 200
    assert response.json()["message"] == "Logged out successfully. Please clear your token on the frontend."
