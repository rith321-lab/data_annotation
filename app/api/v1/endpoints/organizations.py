from typing import Any, List, Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import get_current_active_user, get_db
from app.models.user import User
from app.schemas.organization import (
    Organization, OrganizationCreate, OrganizationUpdate, 
    OrganizationWithStats, OrganizationInvite, OrganizationInviteResponse
)
from app.schemas.team import TeamInvite, TeamInviteResponse
from app.schemas.user import User as UserSchema
from app.services.organization import OrganizationService
from app.services.user import UserService

router = APIRouter()


@router.post("/", response_model=Organization)
async def create_organization(
    organization_in: OrganizationCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Create a new organization.
    The current user becomes the organization owner.
    """
    organization = await OrganizationService.create(
        db,
        obj_in=organization_in,
        creator_id=current_user.id
    )
    return organization


@router.get("/me", response_model=OrganizationWithStats)
async def get_my_organization(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """Get the current user's organization with statistics"""
    if not current_user.organization_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User does not belong to an organization"
        )
    
    organization_data = await OrganizationService.get_with_stats(
        db, organization_id=current_user.organization_id
    )
    
    if not organization_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Organization not found"
        )
    
    return OrganizationWithStats(**organization_data)


@router.put("/me", response_model=Organization)
async def update_my_organization(
    organization_in: OrganizationUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """Update the current user's organization"""
    if not current_user.organization_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User does not belong to an organization"
        )
    
    organization = await OrganizationService.get(db, organization_id=current_user.organization_id)
    if not organization:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Organization not found"
        )
    
    organization = await OrganizationService.update(
        db, db_obj=organization, obj_in=organization_in
    )
    return organization


@router.get("/members", response_model=List[UserSchema])
async def list_organization_members(
    db: AsyncSession = Depends(get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, le=100),
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """List all members of the current user's organization"""
    if not current_user.organization_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User does not belong to an organization"
        )
    
    members = await OrganizationService.get_organization_members(
        db,
        organization_id=current_user.organization_id,
        skip=skip,
        limit=limit
    )
    return members


@router.post("/invite", response_model=TeamInviteResponse)
async def invite_user_to_organization(
    invite_data: TeamInvite,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Invite a user to join the organization by adding them to a specific team.
    For this demo, we'll just add them directly if they exist.
    In production, this would send an email invitation.
    """
    if not current_user.organization_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User does not belong to an organization"
        )
    
    # Verify team exists and belongs to user's organization
    from sqlalchemy import select
    from app.models.team import Team
    
    result = await db.execute(
        select(Team).where(
            Team.id == invite_data.team_id,
            Team.organization_id == current_user.organization_id
        )
    )
    
    team = result.scalar_one_or_none()
    if not team:
        return TeamInviteResponse(
            success=False,
            message="Team not found or you don't have access to it",
            invited_email=invite_data.email
        )
    
    # Find user by email
    user = await UserService.get_by_email(db, email=invite_data.email)
    if not user:
        return TeamInviteResponse(
            success=False,
            message="User with this email does not exist",
            invited_email=invite_data.email,
            team_name=team.name
        )
    
    if user.organization_id and user.organization_id != current_user.organization_id:
        return TeamInviteResponse(
            success=False,
            message="User already belongs to a different organization",
            invited_email=invite_data.email,
            team_name=team.name
        )
    
    # Add user to organization if not already a member
    try:
        if not user.organization_id:
            await OrganizationService.add_user_to_organization(
                db,
                organization_id=current_user.organization_id,
                user_id=user.id
            )
        
        # Add user to team
        from app.services.team import TeamService
        await TeamService.add_user_to_team(
            db,
            user_id=user.id,
            team_id=invite_data.team_id,
            role=invite_data.role
        )
        
        return TeamInviteResponse(
            success=True,
            message=f"User {invite_data.email} has been added to team {team.name}",
            invited_email=invite_data.email,
            team_name=team.name
        )
    
    except HTTPException as e:
        return TeamInviteResponse(
            success=False,
            message=e.detail,
            invited_email=invite_data.email,
            team_name=team.name
        )


@router.delete("/members/{user_id}")
async def remove_member_from_organization(
    user_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """Remove a member from the organization"""
    if not current_user.organization_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User does not belong to an organization"
        )
    
    # Prevent self-removal
    if user_id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot remove yourself from the organization"
        )
    
    await OrganizationService.remove_user_from_organization(
        db,
        organization_id=current_user.organization_id,
        user_id=user_id,
        requesting_user_id=current_user.id
    )
    
    return {"message": "User successfully removed from organization"}


@router.get("/{organization_id}", response_model=Organization)
async def get_organization_by_id(
    organization_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """Get organization by ID (for admin/superuser only)"""
    organization = await OrganizationService.get(db, organization_id=organization_id)
    if not organization:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Organization not found"
        )
    
    # Only allow access to own organization or if superuser
    if not current_user.is_superuser and current_user.organization_id != organization_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    return organization 