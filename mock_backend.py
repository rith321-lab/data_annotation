#!/usr/bin/env python3
"""Mock backend for Verita AI - just for testing frontend"""
from fastapi import FastAPI, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime, timedelta
import jwt
import uvicorn

app = FastAPI(title="Verita AI Mock Backend")

# CORS - allow frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mock database
users = {}
SECRET_KEY = "mock-secret-key"

class UserRegister(BaseModel):
    username: str
    email: str
    password: str
    full_name: str

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

@app.get("/")
def root():
    return {"message": "Verita AI Mock Backend", "status": "running"}

@app.post("/api/v1/auth/register")
def register(user: UserRegister):
    if user.email in users:
        raise HTTPException(status_code=400, detail="User already exists")
    
    users[user.email] = {
        "username": user.username,
        "email": user.email,
        "password": user.password,  # In real app, hash this!
        "full_name": user.full_name,
        "id": f"user-{len(users)+1}",
        "created_at": datetime.now().isoformat()
    }
    
    return {
        "id": users[user.email]["id"],
        "username": user.username,
        "email": user.email,
        "full_name": user.full_name,
        "is_active": True,
        "is_superuser": False,
        "is_verified": False,
        "organization_id": None,
        "created_at": users[user.email]["created_at"],
        "updated_at": None,
        "last_login": None,
        "email_verified_at": None
    }

@app.post("/api/v1/auth/login", response_model=Token)
def login(username: str = Form(...), password: str = Form(...)):
    # Check if user exists
    if username not in users:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    user = users[username]
    if user["password"] != password:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Create tokens
    access_token = jwt.encode({
        "sub": user["id"],
        "exp": datetime.utcnow() + timedelta(minutes=30)
    }, SECRET_KEY, algorithm="HS256")
    
    refresh_token = jwt.encode({
        "sub": user["id"],
        "exp": datetime.utcnow() + timedelta(days=7),
        "type": "refresh"
    }, SECRET_KEY, algorithm="HS256")
    
    return Token(access_token=access_token, refresh_token=refresh_token)

@app.get("/api/v1/health")
def health():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

if __name__ == "__main__":
    print("Starting Verita AI Mock Backend on http://localhost:8000")
    print("This is a mock backend for testing only!")
    print("Frontend should connect from http://localhost:3000")
    uvicorn.run(app, host="0.0.0.0", port=8000)