from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from prometheus_fastapi_instrumentator import Instrumentator
import sentry_sdk
from sentry_sdk.integrations.asgi import SentryAsgiMiddleware

from app.core.config import settings
from app.api.v1.api import api_router
from app.db.session import engine
from app.db import base

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs",
    redoc_url=f"{settings.API_V1_STR}/redoc"
)

# Sentry initialization
if settings.SENTRY_DSN and settings.SENTRY_DSN != "your-sentry-dsn":
    sentry_sdk.init(dsn=settings.SENTRY_DSN, traces_sample_rate=0.1)
    app.add_middleware(SentryAsgiMiddleware)

# CORS middleware
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# Trusted host middleware
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["*.verita.ai", "localhost", "127.0.0.1"]
)

# Prometheus metrics
Instrumentator().instrument(app).expose(app)

# Include API router
app.include_router(api_router, prefix=settings.API_V1_STR)


@app.on_event("startup")
async def startup_event():
    """Initialize database tables"""
    async with engine.begin() as conn:
        await conn.run_sync(base.Base.metadata.create_all)


@app.get("/")
async def root():
    return {
        "message": "Welcome to Verita AI API",
        "version": settings.VERSION,
        "docs": f"{settings.API_V1_STR}/docs"
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy"}