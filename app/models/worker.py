from sqlalchemy import Column, String, Boolean, Integer, Float, ForeignKey, Enum, JSON, Index
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
import uuid
import enum

from app.db.base_class import Base


class WorkerStatus(str, enum.Enum):
    ACTIVE = "active"
    SUSPENDED = "suspended"
    BANNED = "banned"
    PENDING = "pending"


class WorkerType(str, enum.Enum):
    INTERNAL = "internal"  # Company employees
    EXTERNAL = "external"  # Freelancers/contractors
    CROWDSOURCED = "crowdsourced"  # Public workforce


class Worker(Base):
    __tablename__ = "workers"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    # User relationship (optional - for internal workers)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), unique=True)
    user = relationship("User", back_populates="worker_profile")
    
    # Worker details
    worker_type = Column(Enum(WorkerType), default=WorkerType.CROWDSOURCED)
    status = Column(Enum(WorkerStatus), default=WorkerStatus.PENDING)
    
    # Profile
    display_name = Column(String)
    email = Column(String, unique=True, index=True)
    phone_number = Column(String)
    country = Column(String)
    languages = Column(JSON, default=[])  # List of language codes
    
    # Qualifications
    qualifications = Column(JSON, default={})  # Key-value pairs of qualifications
    test_scores = Column(JSON, default={})  # Test results
    certifications = Column(JSON, default=[])  # List of certifications
    
    # Performance metrics
    total_tasks_completed = Column(Integer, default=0)
    accuracy_rate = Column(Float, default=0.0)
    average_time_per_task = Column(Float)
    rejection_rate = Column(Float, default=0.0)
    
    # Quality scores
    overall_quality_score = Column(Float, default=0.0)
    consistency_score = Column(Float, default=0.0)
    speed_score = Column(Float, default=0.0)
    
    # Payment information
    payment_method = Column(String)  # stripe, paypal, bank_transfer
    payment_details = Column(JSON)  # Encrypted payment details
    total_earnings = Column(Float, default=0.0)
    pending_payments = Column(Float, default=0.0)
    
    # Availability
    is_available = Column(Boolean, default=True)
    max_tasks_per_day = Column(Integer, default=100)
    preferred_task_types = Column(JSON, default=[])
    blocked_project_ids = Column(JSON, default=[])
    
    # Relationships
    responses = relationship("Response", back_populates="worker")
    assignments = relationship("WorkerAssignment", back_populates="worker")
    
    # Indexes
    __table_args__ = (
        Index('idx_worker_status_type', 'status', 'worker_type'),
        Index('idx_worker_quality', 'overall_quality_score', 'status'),
    )
    
    def __repr__(self):
        return f"<Worker {self.email}>"


class WorkerAssignment(Base):
    __tablename__ = "worker_assignments"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    # Worker and Task
    worker_id = Column(UUID(as_uuid=True), ForeignKey("workers.id"), nullable=False)
    worker = relationship("Worker", back_populates="assignments")
    
    task_id = Column(UUID(as_uuid=True), ForeignKey("tasks.id"), nullable=False)
    task = relationship("Task", back_populates="worker_assignments")
    
    # Assignment details
    assigned_at = Column(String)  # ISO timestamp
    expires_at = Column(String)  # ISO timestamp
    completed_at = Column(String)  # ISO timestamp
    
    # Status
    status = Column(String, default="assigned")  # assigned, in_progress, completed, expired
    
    # Unique constraint to prevent duplicate assignments
    __table_args__ = (
        Index('idx_worker_task_unique', 'worker_id', 'task_id', unique=True),
    )
    
    def __repr__(self):
        return f"<WorkerAssignment {self.worker_id} -> {self.task_id}>"