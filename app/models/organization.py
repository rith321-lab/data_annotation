from sqlalchemy import Column, String, Boolean, Integer, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
import uuid

from app.db.base_class import Base


class Organization(Base):
    __tablename__ = "organizations"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    slug = Column(String, unique=True, index=True, nullable=False)
    description = Column(String)
    
    # Billing information
    stripe_customer_id = Column(String, unique=True)
    subscription_tier = Column(String, default="free")  # free, starter, pro, enterprise
    subscription_status = Column(String, default="active")
    
    # Settings
    settings = Column(JSON, default={})
    max_projects = Column(Integer, default=5)
    max_tasks_per_month = Column(Integer, default=1000)
    max_workers = Column(Integer, default=10)
    
    # Features
    custom_branding = Column(Boolean, default=False)
    private_workforce = Column(Boolean, default=False)
    advanced_analytics = Column(Boolean, default=False)
    
    # Relationships
    users = relationship("User", back_populates="organization")
    teams = relationship("Team", back_populates="organization")
    projects = relationship("Project", back_populates="organization")
    webhooks = relationship("Webhook", back_populates="organization")
    
    def __repr__(self):
        return f"<Organization {self.name}>"