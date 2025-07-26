from sqlalchemy import Boolean, Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
import uuid

from app.db.base_class import Base


class User(Base):
    __tablename__ = "users"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)
    is_verified = Column(Boolean, default=False)
    
    # Organization relationship
    organization_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id"))
    organization = relationship("Organization", back_populates="users")
    
    # Created projects
    created_projects = relationship("Project", back_populates="creator")
    
    # Team memberships
    team_memberships = relationship("TeamMember", back_populates="user")
    
    # Worker profile (if applicable)
    worker_profile = relationship("Worker", back_populates="user", uselist=False)
    
    # API keys
    api_keys = relationship("APIKey", back_populates="user")
    
    # Audit fields
    last_login = Column(DateTime(timezone=True))
    email_verified_at = Column(DateTime(timezone=True))
    
    def __repr__(self):
        return f"<User {self.email}>"