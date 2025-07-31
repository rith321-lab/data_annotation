from sqlalchemy import Column, String, Boolean, ForeignKey, Enum
from sqlalchemy.orm import relationship
import uuid
import enum

from app.db.base_class import Base


class TeamRole(str, enum.Enum):
    OWNER = "owner"
    ADMIN = "admin"
    MEMBER = "member"
    VIEWER = "viewer"


class Team(Base):
    __tablename__ = "teams"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    description = Column(String)
    
    # Organization
    organization_id = Column(String, ForeignKey("organizations.id"), nullable=False)
    organization = relationship("Organization", back_populates="teams")
    
    # Settings
    is_active = Column(Boolean, default=True)
    can_create_projects = Column(Boolean, default=True)
    can_manage_workers = Column(Boolean, default=False)
    
    # Relationships
    members = relationship("TeamMember", back_populates="team")
    projects = relationship("Project", secondary="project_teams", back_populates="teams")
    
    def __repr__(self):
        return f"<Team {self.name}>"


class TeamMember(Base):
    __tablename__ = "team_members"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    
    # User
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    user = relationship("User", back_populates="team_memberships")
    
    # Team
    team_id = Column(String, ForeignKey("teams.id"), nullable=False)
    team = relationship("Team", back_populates="members")
    
    # Role
    role = Column(Enum(TeamRole), default=TeamRole.MEMBER, nullable=False)
    
    def __repr__(self):
        return f"<TeamMember {self.user_id} in {self.team_id}>"