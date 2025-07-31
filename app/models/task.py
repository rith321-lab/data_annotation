from sqlalchemy import Column, String, Boolean, Integer, Float, ForeignKey, Enum, JSON, Index
from sqlalchemy.orm import relationship
import uuid
import enum

from app.db.base_class import Base


class TaskStatus(str, enum.Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    NEEDS_REVIEW = "needs_review"
    REJECTED = "rejected"
    EXPIRED = "expired"


class TaskPriority(str, enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class Task(Base):
    __tablename__ = "tasks"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    external_id = Column(String, unique=True, index=True)  # Customer-provided ID

    # Project relationship
    project_id = Column(String, ForeignKey("projects.id"), nullable=False)
    project = relationship("Project", back_populates="tasks")
    
    # Task data
    data = Column(JSON, nullable=False)  # The actual content to be annotated
    task_metadata = Column("metadata", JSON, default={})  # Additional metadata
    
    # Status and priority
    status = Column(Enum(TaskStatus), default=TaskStatus.PENDING, index=True)
    priority = Column(Enum(TaskPriority), default=TaskPriority.MEDIUM)
    
    # Gold standard
    is_gold_standard = Column(Boolean, default=False)
    gold_standard_answers = Column(JSON)  # Expected answers for gold standard
    
    # Pre-existing annotations
    preexisting_annotations = Column(JSON)  # Pre-filled answers
    
    # Completion tracking
    required_responses = Column(Integer, default=3)
    completed_responses = Column(Integer, default=0)
    consensus_score = Column(Float)
    
    # Assignment
    batch_id = Column(String, index=True)  # For grouping tasks
    exclusive_worker_ids = Column(JSON)  # List of worker IDs who can work on this
    excluded_worker_ids = Column(JSON)  # List of worker IDs who cannot work on this
    
    # Timing
    expires_at = Column(String)  # ISO timestamp
    average_time_taken = Column(Integer)  # In seconds
    
    # Relationships
    responses = relationship("Response", back_populates="task", cascade="all, delete-orphan")
    worker_assignments = relationship("WorkerAssignment", back_populates="task")
    
    # Create composite index for efficient querying
    __table_args__ = (
        Index('idx_project_status', 'project_id', 'status'),
        Index('idx_batch_status', 'batch_id', 'status'),
    )
    
    def __repr__(self):
        return f"<Task {self.id} for Project {self.project_id}>"