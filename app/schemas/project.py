from typing import Optional, List, Dict, Any
from pydantic import BaseModel, UUID4, Field
from datetime import datetime

from app.models.project import ProjectStatus, ProjectType


class ProjectBase(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None
    instructions: str
    project_type: ProjectType = ProjectType.CLASSIFICATION
    payment_per_response: float = Field(default=0.10, ge=0)
    max_responses_per_task: int = Field(default=3, ge=1)
    min_responses_per_task: int = Field(default=1, ge=1)
    consensus_threshold: float = Field(default=0.75, ge=0, le=1)
    enable_gold_standard: bool = True
    gold_standard_percentage: int = Field(default=10, ge=0, le=100)
    min_accuracy_threshold: float = Field(default=0.8, ge=0, le=1)
    enable_tiebreaker: bool = True
    use_private_workforce: bool = False
    require_qualification: bool = False
    qualification_requirements: Dict[str, Any] = {}
    tags: List[str] = []
    metadata: Dict[str, Any] = {}


class ProjectCreate(ProjectBase):
    team_ids: Optional[List[UUID4]] = []


class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    instructions: Optional[str] = None
    payment_per_response: Optional[float] = None
    max_responses_per_task: Optional[int] = None
    min_responses_per_task: Optional[int] = None
    consensus_threshold: Optional[float] = None
    enable_gold_standard: Optional[bool] = None
    gold_standard_percentage: Optional[int] = None
    min_accuracy_threshold: Optional[float] = None
    enable_tiebreaker: Optional[bool] = None
    use_private_workforce: Optional[bool] = None
    require_qualification: Optional[bool] = None
    qualification_requirements: Optional[Dict[str, Any]] = None
    tags: Optional[List[str]] = None
    metadata: Optional[Dict[str, Any]] = None
    custom_css: Optional[str] = None
    custom_javascript: Optional[str] = None
    theme_settings: Optional[Dict[str, Any]] = None


class ProjectInDBBase(ProjectBase):
    id: UUID4
    status: ProjectStatus
    organization_id: UUID4
    creator_id: UUID4
    total_tasks: int = 0
    completed_tasks: int = 0
    total_responses: int = 0
    average_completion_time: Optional[float] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class Project(ProjectInDBBase):
    pass


class ProjectWithStats(ProjectInDBBase):
    completion_rate: float = 0.0
    active_workers: int = 0
    pending_tasks: int = 0


class ProjectActionResponse(BaseModel):
    success: bool
    message: str
    project: Project