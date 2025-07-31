#!/usr/bin/env python3
"""Very simple backend runner"""
import os
import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sqlite3
import json
from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import jwt

# Simple configuration
SECRET_KEY = "your-secret-key-here"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Create FastAPI app
app = FastAPI(
    title="Verita AI Backend",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class LoginRequest(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class User(BaseModel):
    id: str
    email: str
    username: str
    full_name: str | None = None
    is_active: bool = True

# Database helper
def get_db():
    conn = sqlite3.connect('verita_ai.db')
    conn.row_factory = sqlite3.Row
    return conn

# Authentication helpers
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# Routes
@app.get("/")
def root():
    return {
        "message": "Verita AI Backend API",
        "docs": "/docs",
        "status": "running",
        "version": "1.0.0"
    }

@app.post("/api/v1/auth/login", response_model=Token)
def login(request: LoginRequest):
    conn = get_db()
    cursor = conn.cursor()
    
    # Find user by email
    cursor.execute("SELECT * FROM users WHERE email = ?", (request.email,))
    user = cursor.fetchone()
    conn.close()
    
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Verify password
    if not verify_password(request.password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Create token
    access_token = create_access_token(data={"sub": user["email"]})
    
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/api/v1/auth/me", response_model=User)
def get_current_user():
    # For demo purposes, return a dummy user
    return User(
        id="1",
        email="admin@verita.ai",
        username="admin",
        full_name="System Administrator"
    )

@app.get("/api/v1/projects")
def get_projects():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM projects")
    projects = []
    for row in cursor.fetchall():
        project = dict(row)
        projects.append(project)
    conn.close()
    return {"projects": projects, "total": len(projects)}

@app.get("/api/v1/tasks")
def get_tasks():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM tasks")
    tasks = []
    for row in cursor.fetchall():
        task = dict(row)
        tasks.append(task)
    conn.close()
    return {"tasks": tasks, "total": len(tasks)}

@app.get("/api/v1/users")
def get_users():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT id, email, username, full_name, is_active FROM users")
    users = []
    for row in cursor.fetchall():
        user = dict(row)
        users.append(user)
    conn.close()
    return {"users": users, "total": len(users)}

if __name__ == "__main__":
    print("🚀 Starting Verita AI Simple Backend on http://localhost:8000")
    print("📚 API Documentation: http://localhost:8000/docs")
    print("🎨 Frontend should connect from http://localhost:5173")
    print("🗄️  Using SQLite database: verita_ai.db")
    print("\n🔐 Admin credentials:")
    print("  Email: admin@verita.ai")
    print("  Password: admin123")
    uvicorn.run("run_simple_backend:app", host="0.0.0.0", port=8000, reload=True) 