#!/usr/bin/env python3
"""
Create a complete database with all tables matching the models
"""

import asyncio
import uuid
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from passlib.context import CryptContext

from app.db.base import Base
from app.models.user import User
from app.models.organization import Organization
from app.models.project import Project, ProjectStatus, ProjectType
from app.models.task import Task, TaskStatus

# Database URL
DATABASE_URL = "sqlite+aiosqlite:///./verita_ai.db"

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

async def create_database():
    """Create all tables and sample data"""
    print("🔧 Creating complete database with all tables...")
    
    # Create engine
    engine = create_async_engine(DATABASE_URL, echo=False)
    
    # Create all tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
    
    print("✅ Created all database tables")
    
    # Create session
    async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    
    async with async_session() as session:
        # Create organization
        org_id = str(uuid.uuid4())
        organization = Organization(
            id=org_id,
            name="Verita AI",
            slug="verita-ai",
            description="Default organization for Verita AI platform"
        )
        session.add(organization)
        await session.flush()
        
        # Create admin user
        user_id = str(uuid.uuid4())
        hashed_password = pwd_context.hash("admin123")
        admin_user = User(
            id=user_id,
            email="admin@verita.ai",
            username="admin",
            full_name="Admin User",
            hashed_password=hashed_password,
            is_active=True,
            is_superuser=True,
            organization_id=org_id
        )
        session.add(admin_user)
        await session.flush()
        
        # Create sample project
        project_id = str(uuid.uuid4())
        project = Project(
            id=project_id,
            name="Image Classification Project",
            slug="image-classification-demo",
            description="Demo project for image classification tasks",
            instructions="Please classify the images according to the given categories.",
            project_type=ProjectType.CLASSIFICATION,
            status=ProjectStatus.ACTIVE,
            organization_id=org_id,
            creator_id=user_id,
            total_tasks=3,
            completed_tasks=0
        )
        session.add(project)
        await session.flush()
        
        # Create sample tasks
        tasks_data = [
            {
                "name": "Classify Cat Image",
                "data": {
                    "image_url": "https://example.com/cat.jpg",
                    "question": "What animal is in this image?",
                    "options": ["Cat", "Dog", "Bird", "Other"]
                }
            },
            {
                "name": "Classify Dog Image", 
                "data": {
                    "image_url": "https://example.com/dog.jpg",
                    "question": "What animal is in this image?",
                    "options": ["Cat", "Dog", "Bird", "Other"]
                }
            },
            {
                "name": "Classify Bird Image",
                "data": {
                    "image_url": "https://example.com/bird.jpg", 
                    "question": "What animal is in this image?",
                    "options": ["Cat", "Dog", "Bird", "Other"]
                }
            }
        ]
        
        for i, task_data in enumerate(tasks_data):
            task = Task(
                id=str(uuid.uuid4()),
                project_id=project_id,
                data=task_data["data"],
                status=TaskStatus.PENDING,
                task_metadata={"name": task_data["name"]}
            )
            session.add(task)
        
        await session.commit()
        print("✅ Created sample data")
    
    await engine.dispose()
    print("🎉 Database creation completed!")
    print(f"Database file: verita_ai.db")
    print(f"Admin login:")
    print(f"  Email: admin@verita.ai")
    print(f"  Password: admin123")

if __name__ == "__main__":
    asyncio.run(create_database())
