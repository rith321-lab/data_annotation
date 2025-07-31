#!/usr/bin/env python3
"""Simple backend runner with SQLite support"""
import os
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Set minimal environment variables
os.environ["DATABASE_URL"] = "sqlite+aiosqlite:///./verita_ai.db"
os.environ["SYNC_DATABASE_URL"] = "sqlite:///./verita_ai.db"
os.environ["SECRET_KEY"] = "your-secret-key-here-change-this-in-production"
os.environ["FIRST_SUPERUSER_EMAIL"] = "admin@verita.ai"
os.environ["FIRST_SUPERUSER_PASSWORD"] = "admin123"

from app.api.v1.api import api_router
from app.core.config import settings

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware - CRITICAL for frontend to work
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API router
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {"message": "Verita AI Backend API", "docs": "/docs", "status": "running"}

if __name__ == "__main__":
    print("🚀 Starting Verita AI Backend on http://localhost:8000")
    print("📚 API Documentation: http://localhost:8000/docs")
    print("🎨 Frontend should connect from http://localhost:5173")
    print("🗄️  Using SQLite database: verita_ai.db")
    uvicorn.run("run_backend_sqlite:app", host="0.0.0.0", port=8000, reload=True) 