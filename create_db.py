#!/usr/bin/env python3
"""
Database initialization script for Verita AI
Creates all tables and initial data
"""

import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import create_engine

from app.core.config import settings
from app.db.base import Base
from app.models.user import User
from app.models.organization import Organization
from app.core.security import get_password_hash

async def create_tables():
    """Create all database tables"""
    print("Creating database tables...")
    
    # Create async engine
    engine = create_async_engine(settings.DATABASE_URL, echo=True)
    
    async with engine.begin() as conn:
        # Create all tables
        await conn.run_sync(Base.metadata.create_all)
    
    await engine.dispose()
    print("✅ Database tables created successfully!")

async def create_initial_data():
    """Create initial data including admin user"""
    print("Creating initial data...")
    
    from app.db.session import AsyncSessionLocal
    
    async with AsyncSessionLocal() as session:
        # Check if admin user already exists
        from sqlalchemy import select
        result = await session.execute(
            select(User).where(User.email == settings.FIRST_SUPERUSER_EMAIL)
        )
        existing_user = result.scalar_one_or_none()
        
        if not existing_user:
            # Create default organization
            org = Organization(
                name="Verita AI",
                description="Default organization for Verita AI platform"
            )
            session.add(org)
            await session.flush()  # Get the org ID
            
            # Create admin user
            admin_user = User(
                email=settings.FIRST_SUPERUSER_EMAIL,
                username="admin",
                full_name="System Administrator",
                hashed_password=get_password_hash(settings.FIRST_SUPERUSER_PASSWORD),
                is_active=True,
                is_superuser=True,
                is_verified=True,
                organization_id=org.id
            )
            session.add(admin_user)
            
            await session.commit()
            print(f"✅ Created admin user: {settings.FIRST_SUPERUSER_EMAIL}")
        else:
            print(f"ℹ️  Admin user already exists: {settings.FIRST_SUPERUSER_EMAIL}")

async def main():
    """Main initialization function"""
    print("🚀 Initializing Verita AI Database...")
    print(f"Database URL: {settings.DATABASE_URL}")
    
    try:
        await create_tables()
        await create_initial_data()
        print("🎉 Database initialization completed successfully!")
        print(f"You can now login with:")
        print(f"  Email: {settings.FIRST_SUPERUSER_EMAIL}")
        print(f"  Password: {settings.FIRST_SUPERUSER_PASSWORD}")
        
    except Exception as e:
        print(f"❌ Error during database initialization: {e}")
        raise

if __name__ == "__main__":
    asyncio.run(main())
