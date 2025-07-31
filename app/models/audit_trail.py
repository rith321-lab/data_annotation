from sqlalchemy import Column, String, DateTime, JSON, ForeignKey, Text, Integer, Boolean
from sqlalchemy.orm import relationship
from app.db.base_class import Base
import uuid
from datetime import datetime

class AuditTrail(Base):
    __tablename__ = "audit_trails"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    
    # What was changed
    entity_type = Column(String, nullable=False)  # 'task', 'response', 'project', etc.
    entity_id = Column(String, nullable=False)
    action = Column(String, nullable=False)  # 'create', 'update', 'delete', 'submit', etc.
    
    # Who made the change
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    user = relationship("User", back_populates="audit_trails")
    
    # When it happened
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # What changed
    changes = Column(JSON)  # Stores the diff of changes
    old_values = Column(JSON)  # Previous values
    new_values = Column(JSON)  # New values
    
    # Additional context
    ip_address = Column(String)
    user_agent = Column(Text)
    session_id = Column(String)
    
    # Version tracking
    version = Column(Integer, default=1)
    
    # Metadata
    metadata_json = Column("metadata", JSON)

class DataVersion(Base):
    __tablename__ = "data_versions"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    
    # Versioned entity
    entity_type = Column(String, nullable=False)
    entity_id = Column(String, nullable=False)
    version_number = Column(Integer, nullable=False)
    
    # Version data
    data = Column(JSON, nullable=False)  # Complete snapshot of the data
    
    # Version metadata
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    created_by_id = Column(String, ForeignKey("users.id"), nullable=False)
    created_by = relationship("User")
    
    # Version info
    comment = Column(Text)  # Optional comment about this version
    is_current = Column(Boolean, default=True)
    
    # Related audit trail entry
    audit_trail_id = Column(String, ForeignKey("audit_trails.id"))
    audit_trail = relationship("AuditTrail")