from typing import List, Optional, Union
from pydantic_settings import BaseSettings
from pydantic import AnyHttpUrl, validator


class Settings(BaseSettings):
    # API Settings
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "Verita AI"
    VERSION: str = "1.0.0"
    DEBUG: bool = False
    
    # Database
    DATABASE_URL: str
    SYNC_DATABASE_URL: str
    
    # Security
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"
    
    # Celery
    CELERY_BROKER_URL: str = "redis://localhost:6379/1"
    CELERY_RESULT_BACKEND: str = "redis://localhost:6379/2"
    
    # CORS
    BACKEND_CORS_ORIGINS_STR: str = "http://localhost:3000,http://localhost:8000"
    
    @property
    def BACKEND_CORS_ORIGINS(self) -> List[str]:
        """Parse CORS origins from string - supports both comma-separated and JSON array formats"""
        value = self.BACKEND_CORS_ORIGINS_STR
        
        if not value:
            return []
            
        # Handle JSON array format: ["url1", "url2"]
        if value.strip().startswith('[') and value.strip().endswith(']'):
            import json
            try:
                origins = json.loads(value)
                return [str(origin).rstrip('/') for origin in origins]
            except json.JSONDecodeError:
                pass
        
        # Handle comma-separated format: url1,url2
        origins = [url.strip().rstrip('/') for url in value.split(',') if url.strip()]
        return origins
    
    # AWS S3
    AWS_ACCESS_KEY_ID: Optional[str] = None
    AWS_SECRET_ACCESS_KEY: Optional[str] = None
    AWS_REGION: str = "us-east-1"
    S3_BUCKET_NAME: Optional[str] = None
    
    # Email
    SENDGRID_API_KEY: Optional[str] = None
    EMAIL_FROM: str = "noreply@verita.ai"
    EMAIL_FROM_NAME: str = "Verita AI"
    
    # SMS
    TWILIO_ACCOUNT_SID: Optional[str] = None
    TWILIO_AUTH_TOKEN: Optional[str] = None
    TWILIO_PHONE_NUMBER: Optional[str] = None
    
    # Stripe
    STRIPE_SECRET_KEY: Optional[str] = None
    STRIPE_WEBHOOK_SECRET: Optional[str] = None
    
    # Monitoring
    SENTRY_DSN: Optional[str] = None
    
    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = 60
    
    # Worker Settings
    MAX_WORKERS_PER_TASK: int = 3
    CONSENSUS_THRESHOLD: float = 0.75
    GOLD_STANDARD_PERCENTAGE: int = 10
    
    # First User (Admin)
    FIRST_SUPERUSER_EMAIL: str = "admin@verita.ai"
    FIRST_SUPERUSER_PASSWORD: str = "changethis"
    
    class Config:
        env_file = ".env"
        case_sensitive = True
        extra = "ignore"


settings = Settings()