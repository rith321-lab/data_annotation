from sqlalchemy import Column, String, Integer, Float, ForeignKey, JSON, Index
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
import uuid

from app.db.base_class import Base


class Response(Base):
    __tablename__ = "responses"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    # Task relationship
    task_id = Column(UUID(as_uuid=True), ForeignKey("tasks.id"), nullable=False)
    task = relationship("Task", back_populates="responses")
    
    # Worker relationship
    worker_id = Column(UUID(as_uuid=True), ForeignKey("workers.id"), nullable=False)
    worker = relationship("Worker", back_populates="responses")
    
    # Response metadata
    time_taken = Column(Integer)  # In seconds
    ip_address = Column(String)
    user_agent = Column(String)
    
    # Quality metrics
    accuracy_score = Column(Float)  # For gold standard tasks
    consensus_score = Column(Float)  # Agreement with other workers
    quality_score = Column(Float)  # Overall quality metric
    
    # Payment
    payment_amount = Column(Float)
    payment_status = Column(String, default="pending")  # pending, paid, rejected
    payment_id = Column(String)  # External payment system ID
    
    # Metadata
    response_metadata = Column("metadata", JSON, default={})
    
    # Relationships
    response_values = relationship("ResponseValue", back_populates="response", cascade="all, delete-orphan")
    
    # Indexes
    __table_args__ = (
        Index('idx_task_worker', 'task_id', 'worker_id'),
        Index('idx_worker_created', 'worker_id', 'created_at'),
    )
    
    def __repr__(self):
        return f"<Response {self.id} for Task {self.task_id}>"


class ResponseValue(Base):
    __tablename__ = "response_values"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    # Response relationship
    response_id = Column(UUID(as_uuid=True), ForeignKey("responses.id"), nullable=False)
    response = relationship("Response", back_populates="response_values")
    
    # Question relationship
    question_id = Column(UUID(as_uuid=True), ForeignKey("questions.id"), nullable=False)
    question = relationship("Question", back_populates="response_values")
    
    # The actual answer value
    value = Column(JSON, nullable=False)
    # Can be: string, number, array (for checkbox/ranking), object (for complex types)
    
    # For text tagging and annotations
    annotations = Column(JSON)  # List of {start, end, label, text}
    
    # Confidence score (optional)
    confidence = Column(Float)
    
    def __repr__(self):
        return f"<ResponseValue for Question {self.question_id}>"