"""
Team management schemas
"""
from typing import Optional, List
from pydantic import BaseModel, UUID4, Field
from datetime import datetime

from app.models.team import TeamRole


class TeamBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    can_create_projects: bool = True
    can_manage_workers: bool = False


class TeamCreate(TeamBase):
    pass


class TeamUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    can_create_projects: Optional[bool] = None
    can_manage_workers: Optional[bool] = None
    is_active: Optional[bool] = None


class TeamInDBBase(TeamBase):
    id: UUID4
    organization_id: UUID4
    is_active: bool = True
    
    class Config:
        from_attributes = True


class Team(TeamInDBBase):
    pass


class TeamMemberBase(BaseModel):
    role: TeamRole = TeamRole.MEMBER


class TeamMemberCreate(TeamMemberBase):
    user_id: UUID4


class TeamMemberUpdate(BaseModel):
    role: TeamRole


class TeamMemberInDBBase(TeamMemberBase):
    id: UUID4
    user_id: UUID4
    team_id: UUID4
    
    class Config:
        from_attributes = True


class TeamMember(TeamMemberInDBBase):
    user: Optional[dict] = None


class TeamWithMembers(Team):
    members: List[TeamMember] = []


class TeamInvite(BaseModel):
    email: str = Field(..., pattern=r'^[^@]+@[^@]+\.[^@]+$')
    team_id: UUID4
    role: TeamRole = TeamRole.MEMBER


class TeamInviteResponse(BaseModel):
    success: bool
    message: str
    invited_email: str
    team_name: Optional[str] = None 