"""
Permission helper functions for role-based access control
"""
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException, status

from app.models.user import User
from app.models.team import Team, TeamMember, TeamRole
from app.models.project import Project


async def can_create_project(db: AsyncSession, user: User) -> bool:
    """
    Check if user can create projects.
    Rules:
    - User must be active
    - User must belong to an organization
    - User must be in a team that allows project creation OR be superuser
    """
    if not user.is_active:
        return False
    
    if not user.organization_id:
        return False
    
    # Superusers can always create projects
    if user.is_superuser:
        return True
    
    # Check team memberships for project creation permission
    result = await db.execute(
        select(Team.can_create_projects)
        .join(TeamMember)
        .where(
            TeamMember.user_id == user.id,
            TeamMember.role.in_([TeamRole.OWNER, TeamRole.ADMIN, TeamRole.MEMBER])
        )
    )
    
    team_permissions = result.scalars().all()
    
    # If user is in any team that allows project creation
    return any(team_permissions) if team_permissions else False


async def can_create_task(db: AsyncSession, user: User, project_id: str) -> bool:
    """
    Check if user can create tasks in a project.
    Rules:
    - User must be active
    - Project must be in user's organization
    - User must have project creation permissions (same as project creation)
    """
    if not user.is_active:
        return False
    
    # Get project to verify organization
    result = await db.execute(
        select(Project).where(Project.id == project_id)
    )
    project = result.scalar_one_or_none()
    
    if not project:
        return False
    
    # Project must be in user's organization
    if project.organization_id != user.organization_id:
        return False
    
    # Use same permissions as project creation
    return await can_create_project(db, user)


async def can_delete_project(db: AsyncSession, user: User, project_id: str) -> bool:
    """
    Check if user can delete a project.
    Rules:
    - Superusers can delete any project regardless of organization
    - Regular users can only delete projects in their organization if they're OWNER/ADMIN
    """
    if not user.is_active:
        return False
    
    # Superusers can delete any project
    if user.is_superuser:
        return True
    
    # Get project to verify organization
    result = await db.execute(
        select(Project).where(Project.id == project_id)
    )
    project = result.scalar_one_or_none()
    
    if not project:
        return False
    
    # Project must be in user's organization for non-superusers
    if project.organization_id != user.organization_id:
        return False
    
    # Check if user is OWNER or ADMIN in any team
    result = await db.execute(
        select(TeamMember.role)
        .join(Team)
        .where(
            TeamMember.user_id == user.id,
            Team.organization_id == user.organization_id,
            TeamMember.role.in_([TeamRole.OWNER, TeamRole.ADMIN])
        )
    )
    
    roles = result.scalars().all()
    return len(roles) > 0


async def can_manage_organization(db: AsyncSession, user: User, organization_id: str) -> bool:
    """
    Check if user can manage organization settings.
    Rules:
    - User must be in the organization
    - User must be OWNER in any team OR be superuser
    """
    if not user.is_active:
        return False
    
    # Superusers can manage any organization
    if user.is_superuser:
        return True
    
    # User must be in the target organization
    if str(user.organization_id) != organization_id:
        return False
    
    # Check if user is OWNER in any team
    result = await db.execute(
        select(TeamMember.role)
        .join(Team)
        .where(
            TeamMember.user_id == user.id,
            Team.organization_id == user.organization_id,
            TeamMember.role == TeamRole.OWNER
        )
    )
    
    roles = result.scalars().all()
    return len(roles) > 0


def require_permission(permission_func):
    """Decorator to require specific permissions"""
    def decorator(func):
        async def wrapper(*args, **kwargs):
            # Extract common parameters
            db = kwargs.get('db')
            current_user = kwargs.get('current_user')
            
            if not db or not current_user:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Missing required parameters for permission check"
                )
            
            # Check permission
            has_permission = await permission_func(db, current_user, **kwargs)
            
            if not has_permission:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Not enough permissions to perform this action"
                )
            
            return await func(*args, **kwargs)
        return wrapper
    return decorator 