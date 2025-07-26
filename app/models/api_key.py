from sqlalchemy import Column, String, Boolean, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
import uuid

from app.db.base_class import Base


class APIKey(Base):
    __tablename__ = "api_keys"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    # User relationship
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    user = relationship("User", back_populates="api_keys")
    
    # Key details
    name = Column(String, nullable=False)
    key_hash = Column(String, nullable=False, unique=True)  # Hashed API key
    key_prefix = Column(String, nullable=False)  # First 8 chars for identification
    
    # Permissions
    scopes = Column(JSON, default=[])  # List of allowed scopes
    
    # Status
    is_active = Column(Boolean, default=True)
    last_used_at = Column(String)  # ISO timestamp
    expires_at = Column(String)  # ISO timestamp
    
    # Rate limiting
    rate_limit_per_minute = Column(String)
    rate_limit_per_hour = Column(String)
    
    def __repr__(self):
        return f"<APIKey {self.name} for User {self.user_id}>"