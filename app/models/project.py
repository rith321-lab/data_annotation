from sqlalchemy import Column, String, Text, Boolean, Integer, Float, ForeignKey, Enum, JSON, Table
from sqlalchemy.orm import relationship
import uuid
import enum

from app.db.base_class import Base


class ProjectStatus(str, enum.Enum):
    DRAFT = "draft"
    ACTIVE = "active"
    PAUSED = "paused"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    ARCHIVED = "archived"


class ProjectType(str, enum.Enum):
    CLASSIFICATION = "classification"
    ANNOTATION = "annotation"
    TRANSCRIPTION = "transcription"
    COMPARISON = "comparison"
    RANKING = "ranking"
    MODERATION = "moderation"
    CAROUSEL = "carousel"  # Multi-round annotation
    CUSTOM = "custom"


# Association table for many-to-many relationship
project_teams = Table(
    'project_teams',
    Base.metadata,
    Column('project_id', String, ForeignKey('projects.id')),
    Column('team_id', String, ForeignKey('teams.id'))
)


class Project(Base):
    __tablename__ = "projects"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    slug = Column(String, unique=True, index=True, nullable=False)
    description = Column(Text)
    instructions = Column(Text, nullable=False)

    # Type and status
    project_type = Column(Enum(ProjectType), default=ProjectType.CLASSIFICATION)
    status = Column(Enum(ProjectStatus), default=ProjectStatus.DRAFT, index=True)

    # Organization and creator
    organization_id = Column(String, ForeignKey("organizations.id"), nullable=False)
    organization = relationship("Organization", back_populates="projects")

    creator_id = Column(String, ForeignKey("users.id"), nullable=False)
    creator = relationship("User", back_populates="created_projects")
    
    # Settings
    payment_per_response = Column(Float, default=0.10)
    max_responses_per_task = Column(Integer, default=3)
    min_responses_per_task = Column(Integer, default=1)
    consensus_threshold = Column(Float, default=0.75)
    
    # Quality control
    enable_gold_standard = Column(Boolean, default=True)
    gold_standard_percentage = Column(Integer, default=10)
    min_accuracy_threshold = Column(Float, default=0.8)
    enable_tiebreaker = Column(Boolean, default=True)
    
    # Workforce settings
    use_private_workforce = Column(Boolean, default=False)
    require_qualification = Column(Boolean, default=False)
    qualification_requirements = Column(JSON, default={})
    
    # UI customization
    custom_css = Column(Text)
    custom_javascript = Column(Text)
    theme_settings = Column(JSON, default={})
    
    # Metadata
    tags = Column(JSON, default=[])
    project_metadata = Column("metadata", JSON, default={})
    
    # Statistics
    total_tasks = Column(Integer, default=0)
    completed_tasks = Column(Integer, default=0)
    total_responses = Column(Integer, default=0)
    average_completion_time = Column(Float)
    
    # Relationships
    teams = relationship("Team", secondary=project_teams, back_populates="projects")
    questions = relationship("Question", back_populates="project", cascade="all, delete-orphan")
    tasks = relationship("Task", back_populates="project", cascade="all, delete-orphan")
    webhook_events = relationship("WebhookEvent", back_populates="project")
    
    def __repr__(self):
        return f"<Project {self.name}>"