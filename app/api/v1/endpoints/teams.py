"""
Team management endpoints
"""
from typing import Any, List, Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.deps import get_current_active_user, get_db
from app.models.user import User
from app.models.team import Team, TeamMember, TeamRole
from app.schemas.team import (
    Team as TeamSchema, TeamCreate, TeamUpdate, TeamMemberCreate, 
    TeamMemberUpdate, TeamMember as TeamMemberSchema
)
from app.services.team import TeamService

router = APIRouter()


@router.get("/", response_model=List[TeamSchema])
async def list_organization_teams(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, le=100),
) -> Any:
    """List all teams in the user's organization"""
    if not current_user.organization_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User does not belong to an organization"
        )
    
    result = await db.execute(
        select(Team)
        .where(Team.organization_id == current_user.organization_id)
        .offset(skip)
        .limit(limit)
    )
    
    teams = result.scalars().all()
    return teams


@router.post("/", response_model=TeamSchema)
async def create_team(
    team_in: TeamCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """Create a new team"""
    if not current_user.organization_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User does not belong to an organization"
        )
    
    # Check if user has permission to create teams (must be OWNER or ADMIN)
    from app.core.permissions import can_manage_organization
    if not await can_manage_organization(db, current_user, str(current_user.organization_id)):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions to create teams"
        )
    
    team = await TeamService.create_team(
        db,
        team_data=team_in,
        organization_id=current_user.organization_id,
        creator_id=current_user.id
    )
    
    return team


@router.get("/{team_id}", response_model=TeamSchema)
async def get_team(
    team_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """Get team details"""
    result = await db.execute(
        select(Team).where(
            Team.id == team_id,
            Team.organization_id == current_user.organization_id
        )
    )
    
    team = result.scalar_one_or_none()
    if not team:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Team not found"
        )
    
    return team


@router.put("/{team_id}", response_model=TeamSchema)
async def update_team(
    team_id: UUID,
    team_in: TeamUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """Update team settings"""
    # Get team and verify ownership
    result = await db.execute(
        select(Team).where(
            Team.id == team_id,
            Team.organization_id == current_user.organization_id
        )
    )
    
    team = result.scalar_one_or_none()
    if not team:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Team not found"
        )
    
    # Check if user is team OWNER or organization admin
    result = await db.execute(
        select(TeamMember.role).where(
            TeamMember.team_id == team_id,
            TeamMember.user_id == current_user.id
        )
    )
    
    user_role = result.scalar_one_or_none()
    if user_role != TeamRole.OWNER:
        from app.core.permissions import can_manage_organization
        if not await can_manage_organization(db, current_user, str(current_user.organization_id)):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not enough permissions to update team"
            )
    
    # Update team
    for field, value in team_in.model_dump(exclude_unset=True).items():
        setattr(team, field, value)
    
    await db.commit()
    await db.refresh(team)
    
    return team


@router.delete("/{team_id}")
async def delete_team(
    team_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """Delete a team"""
    # Get team and verify ownership
    result = await db.execute(
        select(Team).where(
            Team.id == team_id,
            Team.organization_id == current_user.organization_id
        )
    )
    
    team = result.scalar_one_or_none()
    if not team:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Team not found"
        )
    
    # Prevent deletion of default teams
    if team.name in ["Default Team", "Organization Admins"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete default teams"
        )
    
    # Check permissions
    from app.core.permissions import can_manage_organization
    if not await can_manage_organization(db, current_user, str(current_user.organization_id)):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions to delete team"
        )
    
    await db.delete(team)
    await db.commit()
    
    return {"message": "Team deleted successfully"}


@router.get("/{team_id}/members", response_model=List[TeamMemberSchema])
async def list_team_members(
    team_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """List all members of a team"""
    # Verify team exists and user has access
    result = await db.execute(
        select(Team).where(
            Team.id == team_id,
            Team.organization_id == current_user.organization_id
        )
    )
    
    team = result.scalar_one_or_none()
    if not team:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Team not found"
        )
    
    result = await db.execute(
        select(TeamMember, User)
        .join(User)
        .where(TeamMember.team_id == team_id)
    )
    
    members = []
    for team_member, user in result.all():
        members.append({
            "id": str(team_member.id),
            "user_id": str(user.id),
            "team_id": str(team_id),
            "role": team_member.role,
            "user": {
                "id": str(user.id),
                "email": user.email,
                "full_name": user.full_name,
                "is_active": user.is_active
            }
        })
    
    return members


@router.post("/{team_id}/members", response_model=TeamMemberSchema)
async def add_team_member(
    team_id: UUID,
    member_data: TeamMemberCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """Add a user to a team"""
    # Verify team exists and user has access
    result = await db.execute(
        select(Team).where(
            Team.id == team_id,
            Team.organization_id == current_user.organization_id
        )
    )
    
    team = result.scalar_one_or_none()
    if not team:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Team not found"
        )
    
    # Check permissions - must be team OWNER/ADMIN or org admin
    result = await db.execute(
        select(TeamMember.role).where(
            TeamMember.team_id == team_id,
            TeamMember.user_id == current_user.id
        )
    )
    
    user_role = result.scalar_one_or_none()
    if user_role not in [TeamRole.OWNER, TeamRole.ADMIN]:
        from app.core.permissions import can_manage_organization
        if not await can_manage_organization(db, current_user, str(current_user.organization_id)):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not enough permissions to add team members"
            )
    
    # Add user to team
    team_member = await TeamService.add_user_to_team(
        db,
        user_id=member_data.user_id,
        team_id=team_id,
        role=member_data.role
    )
    
    return team_member


@router.put("/{team_id}/members/{member_id}", response_model=TeamMemberSchema)
async def update_team_member(
    team_id: UUID,
    member_id: UUID,
    member_data: TeamMemberUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """Update a team member's role"""
    # Get team member
    result = await db.execute(
        select(TeamMember, Team).join(Team).where(
            TeamMember.id == member_id,
            TeamMember.team_id == team_id,
            Team.organization_id == current_user.organization_id
        )
    )
    
    team_member_team = result.first()
    if not team_member_team:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Team member not found"
        )
    
    team_member, team = team_member_team
    
    # Check permissions
    result = await db.execute(
        select(TeamMember.role).where(
            TeamMember.team_id == team_id,
            TeamMember.user_id == current_user.id
        )
    )
    
    user_role = result.scalar_one_or_none()
    if user_role not in [TeamRole.OWNER, TeamRole.ADMIN]:
        from app.core.permissions import can_manage_organization
        if not await can_manage_organization(db, current_user, str(current_user.organization_id)):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not enough permissions to update team members"
            )
    
    # Update role
    team_member.role = member_data.role
    await db.commit()
    await db.refresh(team_member)
    
    return team_member


@router.delete("/{team_id}/members/{member_id}")
async def remove_team_member(
    team_id: UUID,
    member_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """Remove a user from a team"""
    # Get team member
    result = await db.execute(
        select(TeamMember, Team).join(Team).where(
            TeamMember.id == member_id,
            TeamMember.team_id == team_id,
            Team.organization_id == current_user.organization_id
        )
    )
    
    team_member_team = result.first()
    if not team_member_team:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Team member not found"
        )
    
    team_member, team = team_member_team
    
    # Check permissions
    result = await db.execute(
        select(TeamMember.role).where(
            TeamMember.team_id == team_id,
            TeamMember.user_id == current_user.id
        )
    )
    
    user_role = result.scalar_one_or_none()
    if user_role not in [TeamRole.OWNER, TeamRole.ADMIN]:
        from app.core.permissions import can_manage_organization
        if not await can_manage_organization(db, current_user, str(current_user.organization_id)):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not enough permissions to remove team members"
            )
    
    await db.delete(team_member)
    await db.commit()
    
    return {"message": "Team member removed successfully"} 