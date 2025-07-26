#!/usr/bin/env python3
"""Initialize database tables"""
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import create_engine
from app.models.user import Base as UserBase
from app.models.organization import Base as OrgBase
from app.models.project import Base as ProjectBase
from app.models.task import Base as TaskBase
from app.models.question import Base as QuestionBase
from app.models.response import Base as ResponseBase
from app.models.worker import Base as WorkerBase
from app.models.webhook import Base as WebhookBase
from app.core.config import settings

# Create engine
engine = create_engine(settings.SYNC_DATABASE_URL)

# Create all tables
print("Creating database tables...")
UserBase.metadata.create_all(bind=engine)
OrgBase.metadata.create_all(bind=engine)
ProjectBase.metadata.create_all(bind=engine)
TaskBase.metadata.create_all(bind=engine)
QuestionBase.metadata.create_all(bind=engine)
ResponseBase.metadata.create_all(bind=engine)
WorkerBase.metadata.create_all(bind=engine)
WebhookBase.metadata.create_all(bind=engine)

print("✅ Database tables created successfully!")
print("You can now register and login through the frontend.")