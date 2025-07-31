from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

from app.core.config import settings
from app.api.v1.api import api_router
from app.db.session import engine
from app.db import base

app = FastAPI(
    title="Verita AI",
    version="1.0.0",
    openapi_url=f"/api/v1/openapi.json",
    docs_url=f"/api/v1/docs",
    redoc_url=f"/api/v1/redoc"
)

# CORS middleware - allow frontend origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000", 
        "http://localhost:3001", 
        "http://localhost:3002"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API router
app.include_router(api_router, prefix="/api/v1")


@app.on_event("startup")
async def startup_event():
    """Initialize database tables"""
    async with engine.begin() as conn:
        await conn.run_sync(base.Base.metadata.create_all)


@app.get("/")
async def root():
    return {
        "message": "Welcome to Verita AI API",
        "version": "1.0.0",
        "docs": "/api/v1/docs"
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy"}