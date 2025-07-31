from typing import Optional, List
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, update
from sqlalchemy.orm import selectinload
from fastapi import HTTPException, status

from app.models.organization import Organization
from app.models.user import User
from app.models.project import Project
from app.schemas.organization import OrganizationCreate, OrganizationUpdate


class OrganizationService:
    
    @staticmethod
    async def create(
        db: AsyncSession,
        obj_in: OrganizationCreate,
        creator_id: UUID
    ) -> Organization:
        """Create a new organization and assign the creator as owner"""
        
        # Check if slug is unique
        result = await db.execute(
            select(Organization).where(Organization.slug == obj_in.slug)
        )
        if result.scalar_one_or_none():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Organization with this slug already exists"
            )
        
        # Check if user already belongs to an organization
        result = await db.execute(
            select(User).where(User.id == creator_id)
        )
        user = result.scalar_one_or_none()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        if user.organization_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User already belongs to an organization"
            )
        
        # Create organization
        db_organization = Organization(**obj_in.model_dump())
        db.add(db_organization)
        await db.flush()  # Get the ID without committing
        
        # Assign user to organization
        await db.execute(
            update(User)
            .where(User.id == creator_id)
            .values(organization_id=db_organization.id)
        )
        
        # Create default team with project creation permissions
        from app.services.team import TeamService
        await TeamService.create_default_team(
            db,
            organization_id=db_organization.id,
            creator_id=creator_id,
            team_name="Organization Admins"
        )
        
        await db.commit()
        await db.refresh(db_organization)
        return db_organization
    
    @staticmethod
    async def get(db: AsyncSession, organization_id: UUID) -> Optional[Organization]:
        """Get organization by ID"""
        result = await db.execute(
            select(Organization).where(Organization.id == organization_id)
        )
        return result.scalar_one_or_none()
    
    @staticmethod
    async def get_by_slug(db: AsyncSession, slug: str) -> Optional[Organization]:
        """Get organization by slug"""
        result = await db.execute(
            select(Organization).where(Organization.slug == slug)
        )
        return result.scalar_one_or_none()
    
    @staticmethod
    async def get_user_organization(db: AsyncSession, user_id: UUID) -> Optional[Organization]:
        """Get the organization that a user belongs to"""
        result = await db.execute(
            select(Organization)
            .join(User)
            .where(User.id == user_id)
        )
        return result.scalar_one_or_none()
    
    @staticmethod
    async def update(
        db: AsyncSession,
        db_obj: Organization,
        obj_in: OrganizationUpdate
    ) -> Organization:
        """Update organization"""
        update_data = obj_in.model_dump(exclude_unset=True)
        
        # If updating slug, check uniqueness
        if "slug" in update_data:
            result = await db.execute(
                select(Organization).where(
                    Organization.slug == update_data["slug"],
                    Organization.id != db_obj.id
                )
            )
            if result.scalar_one_or_none():
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Organization with this slug already exists"
                )
        
        for field, value in update_data.items():
            setattr(db_obj, field, value)
        
        await db.commit()
        await db.refresh(db_obj)
        return db_obj
    
    @staticmethod
    async def get_with_stats(db: AsyncSession, organization_id: UUID) -> Optional[dict]:
        """Get organization with usage statistics"""
        # Get organization
        org_result = await db.execute(
            select(Organization).where(Organization.id == organization_id)
        )
        organization = org_result.scalar_one_or_none()
        
        if not organization:
            return None
        
        # Get user count
        user_count_result = await db.execute(
            select(func.count(User.id)).where(User.organization_id == organization_id)
        )
        user_count = user_count_result.scalar() or 0
        
        # Get project count
        project_count_result = await db.execute(
            select(func.count(Project.id)).where(Project.organization_id == organization_id)
        )
        project_count = project_count_result.scalar() or 0
        
        # Get active projects count
        active_projects_result = await db.execute(
            select(func.count(Project.id)).where(
                Project.organization_id == organization_id,
                Project.status == "active"
            )
        )
        active_projects = active_projects_result.scalar() or 0
        
        # Convert to dict safely, excluding SQLAlchemy metadata
        org_dict = {
            "id": organization.id,
            "name": organization.name,
            "slug": organization.slug,
            "description": organization.description,
            "stripe_customer_id": organization.stripe_customer_id,
            "subscription_tier": organization.subscription_tier,
            "subscription_status": organization.subscription_status,
            "max_projects": organization.max_projects,
            "max_tasks_per_month": organization.max_tasks_per_month,
            "max_workers": organization.max_workers,
            "custom_branding": organization.custom_branding,
            "private_workforce": organization.private_workforce,
            "advanced_analytics": organization.advanced_analytics,
            "created_at": organization.created_at,
            "updated_at": organization.updated_at,
            "user_count": user_count,
            "project_count": project_count,
            "active_projects": active_projects
        }
        return org_dict
    
    @staticmethod
    async def add_user_to_organization(
        db: AsyncSession,
        organization_id: UUID,
        user_id: UUID
    ) -> bool:
        """Add a user to an organization"""
        
        # Check if organization exists
        org_result = await db.execute(
            select(Organization).where(Organization.id == organization_id)
        )
        organization = org_result.scalar_one_or_none()
        if not organization:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Organization not found"
            )
        
        # Check if user exists and doesn't already belong to an org
        user_result = await db.execute(
            select(User).where(User.id == user_id)
        )
        user = user_result.scalar_one_or_none()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        if user.organization_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User already belongs to an organization"
            )
        
        # Add user to organization
        await db.execute(
            update(User)
            .where(User.id == user_id)
            .values(organization_id=organization_id)
        )
        
        await db.commit()
        return True
    
    @staticmethod
    async def get_organization_members(
        db: AsyncSession,
        organization_id: UUID,
        skip: int = 0,
        limit: int = 100
    ) -> List[User]:
        """Get all members of an organization"""
        result = await db.execute(
            select(User)
            .where(User.organization_id == organization_id)
            .offset(skip)
            .limit(limit)
        )
        return list(result.scalars().all())
    
    @staticmethod
    async def remove_user_from_organization(
        db: AsyncSession,
        organization_id: UUID,
        user_id: UUID,
        requesting_user_id: UUID
    ) -> bool:
        """Remove a user from an organization (admin only)"""
        
        # Check if requesting user is in the same org (basic permission check)
        requesting_user_result = await db.execute(
            select(User).where(User.id == requesting_user_id)
        )
        requesting_user = requesting_user_result.scalar_one_or_none()
        
        if not requesting_user or requesting_user.organization_id != organization_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not enough permissions"
            )
        
        # Remove user from organization
        await db.execute(
            update(User)
            .where(User.id == user_id, User.organization_id == organization_id)
            .values(organization_id=None)
        )
        
        await db.commit()
        return True 