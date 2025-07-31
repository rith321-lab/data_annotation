"""
Team management service for handling team creation and memberships
"""
from typing import List, Optional
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException, status

from app.models.team import Team, TeamMember, TeamRole
from app.models.user import User


class TeamService:
    
    @staticmethod
    async def create_default_team(
        db: AsyncSession,
        organization_id: UUID,
        creator_id: UUID,
        team_name: str = "Default Team"
    ) -> Team:
        """
        Create a default team for new organizations with project creation permissions
        """
        # Create team
        team = Team(
            name=team_name,
            description="Default team with project creation permissions",
            organization_id=organization_id,
            can_create_projects=True,  # Allow project creation
            can_manage_workers=False
        )
        
        db.add(team)
        await db.flush()  # Get team ID
        
        # Add creator as team owner
        team_member = TeamMember(
            user_id=creator_id,
            team_id=team.id,
            role=TeamRole.OWNER
        )
        
        db.add(team_member)
        await db.commit()
        await db.refresh(team)
        
        return team
    
    @staticmethod
    async def add_user_to_team(
        db: AsyncSession,
        user_id: UUID,
        team_id: UUID,
        role: TeamRole = TeamRole.MEMBER
    ) -> TeamMember:
        """
        Add a user to a team with specified role
        """
        # Check if user already in team
        result = await db.execute(
            select(TeamMember).where(
                TeamMember.user_id == user_id,
                TeamMember.team_id == team_id
            )
        )
        
        existing_membership = result.scalar_one_or_none()
        if existing_membership:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User is already a member of this team"
            )
        
        # Create team membership
        team_member = TeamMember(
            user_id=user_id,
            team_id=team_id,
            role=role
        )
        
        db.add(team_member)
        await db.commit()
        await db.refresh(team_member)
        
        return team_member
    
    @staticmethod
    async def get_user_teams(db: AsyncSession, user_id: UUID) -> List[Team]:
        """
        Get all teams a user belongs to
        """
        result = await db.execute(
            select(Team)
            .join(TeamMember)
            .where(TeamMember.user_id == user_id)
        )
        
        return result.scalars().all()
    
    @staticmethod
    async def ensure_user_has_team(db: AsyncSession, user_id: UUID, organization_id: UUID) -> None:
        """
        Ensure user belongs to at least one team that can create projects.
        If not, create a default team and add them.
        """
        # Check if user has any team memberships with project creation rights
        result = await db.execute(
            select(Team.can_create_projects)
            .join(TeamMember)
            .where(
                TeamMember.user_id == user_id,
                Team.organization_id == organization_id
            )
        )
        
        team_permissions = result.scalars().all()
        
        # If user has no teams or no teams with project creation permissions
        if not team_permissions or not any(team_permissions):
            # Find or create a default team
            result = await db.execute(
                select(Team)
                .where(
                    Team.organization_id == organization_id,
                    Team.name == "Default Team",
                    Team.can_create_projects == True
                )
            )
            
            default_team = result.scalar_one_or_none()
            
            if not default_team:
                # Create default team
                default_team = Team(
                    name="Default Team",
                    description="Default team for organization members",
                    organization_id=organization_id,
                    can_create_projects=True,
                    can_manage_workers=False
                )
                db.add(default_team)
                await db.flush()
            
            # Add user to default team
            team_member = TeamMember(
                user_id=user_id,
                team_id=default_team.id,
                role=TeamRole.MEMBER
            )
            
            db.add(team_member)
            await db.commit()
    
    @staticmethod
    async def create_team(
        db: AsyncSession,
        team_data,
        organization_id: UUID,
        creator_id: UUID
    ) -> Team:
        """
        Create a new team and add creator as owner
        """
        # Create team
        team = Team(
            name=team_data.name,
            description=team_data.description,
            organization_id=organization_id,
            can_create_projects=team_data.can_create_projects,
            can_manage_workers=team_data.can_manage_workers,
            is_active=True
        )
        
        db.add(team)
        await db.flush()  # Get team ID
        
        # Add creator as team owner
        team_member = TeamMember(
            user_id=creator_id,
            team_id=team.id,
            role=TeamRole.OWNER
        )
        
        db.add(team_member)
        await db.commit()
        await db.refresh(team)
        
        return team 