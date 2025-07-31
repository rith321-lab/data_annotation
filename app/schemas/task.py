from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime

from app.models.task import TaskStatus, TaskPriority


class TaskBase(BaseModel):
    external_id: Optional[str] = None
    data: Dict[str, Any]
    task_metadata: Optional[Dict[str, Any]] = {}
    priority: TaskPriority = TaskPriority.MEDIUM
    is_gold_standard: bool = False
    gold_standard_answers: Optional[Dict[str, Any]] = None
    preexisting_annotations: Optional[Dict[str, Any]] = None
    required_responses: int = Field(default=3, ge=1)
    batch_id: Optional[str] = None
    exclusive_worker_ids: Optional[List[str]] = None
    excluded_worker_ids: Optional[List[str]] = None
    expires_at: Optional[str] = None


class TaskCreate(TaskBase):
    pass


class TaskBulkCreate(BaseModel):
    tasks: List[TaskCreate]


class TaskUpdate(BaseModel):
    data: Optional[Dict[str, Any]] = None
    metadata: Optional[Dict[str, Any]] = None
    priority: Optional[TaskPriority] = None
    is_gold_standard: Optional[bool] = None
    gold_standard_answers: Optional[Dict[str, Any]] = None
    required_responses: Optional[int] = None
    expires_at: Optional[str] = None


class TaskInDBBase(TaskBase):
    id: str
    project_id: str
    status: TaskStatus
    completed_responses: int = 0
    consensus_score: Optional[float] = None
    average_time_taken: Optional[int] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class Task(TaskInDBBase):
    pass


class TaskWithResponses(TaskInDBBase):
    responses: List[Dict[str, Any]] = []
    completion_percentage: float = 0.0


class TaskStats(BaseModel):
    total_tasks: int
    pending_tasks: int
    in_progress_tasks: int
    completed_tasks: int
    needs_review_tasks: int
    rejected_tasks: int
    expired_tasks: int
    average_completion_time: Optional[float] = None
    average_consensus_score: Optional[float] = None