from sqlalchemy import Column, String, Boolean, Integer, ForeignKey, Enum, JSON
from sqlalchemy.orm import relationship
import uuid
import enum

from app.db.base_class import Base


class WebhookEventType(str, enum.Enum):
    PROJECT_CREATED = "project.created"
    PROJECT_LAUNCHED = "project.launched"
    PROJECT_PAUSED = "project.paused"
    PROJECT_COMPLETED = "project.completed"
    TASK_CREATED = "task.created"
    TASK_ASSIGNED = "task.assigned"
    TASK_COMPLETED = "task.completed"
    RESPONSE_SUBMITTED = "response.submitted"
    RESPONSE_APPROVED = "response.approved"
    RESPONSE_REJECTED = "response.rejected"
    WORKER_JOINED = "worker.joined"
    WORKER_SUSPENDED = "worker.suspended"
    PAYMENT_PROCESSED = "payment.processed"


class Webhook(Base):
    __tablename__ = "webhooks"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    
    # Organization
    organization_id = Column(String, ForeignKey("organizations.id"), nullable=False)
    organization = relationship("Organization", back_populates="webhooks")
    
    # Webhook configuration
    url = Column(String, nullable=False)
    secret = Column(String)  # For HMAC signature verification
    is_active = Column(Boolean, default=True)
    
    # Event subscriptions
    events = Column(JSON, default=[])  # List of WebhookEventType values
    
    # Headers to include
    custom_headers = Column(JSON, default={})
    
    # Retry configuration
    max_retries = Column(Integer, default=3)
    retry_delay = Column(Integer, default=60)  # Seconds
    
    # Statistics
    total_deliveries = Column(Integer, default=0)
    successful_deliveries = Column(Integer, default=0)
    failed_deliveries = Column(Integer, default=0)
    last_delivery_at = Column(String)  # ISO timestamp
    last_error = Column(String)
    
    # Relationships
    webhook_events = relationship("WebhookEvent", back_populates="webhook")
    
    def __repr__(self):
        return f"<Webhook {self.url}>"


class WebhookEvent(Base):
    __tablename__ = "webhook_events"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    
    # Webhook
    webhook_id = Column(String, ForeignKey("webhooks.id"), nullable=False)
    webhook = relationship("Webhook", back_populates="webhook_events")
    
    # Event details
    event_type = Column(Enum(WebhookEventType), nullable=False)
    payload = Column(JSON, nullable=False)
    
    # Related entities
    project_id = Column(String, ForeignKey("projects.id"))
    project = relationship("Project", back_populates="webhook_events")
    
    # Delivery status
    delivery_status = Column(String, default="pending")  # pending, delivered, failed
    attempts = Column(Integer, default=0)
    
    # Response details
    response_status_code = Column(Integer)
    response_body = Column(String)
    delivered_at = Column(String)  # ISO timestamp
    next_retry_at = Column(String)  # ISO timestamp
    
    def __repr__(self):
        return f"<WebhookEvent {self.event_type} -> {self.webhook_id}>"