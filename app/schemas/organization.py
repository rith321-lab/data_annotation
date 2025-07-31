from typing import Optional, List
from pydantic import BaseModel, UUID4, Field
from datetime import datetime


class OrganizationBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    slug: str = Field(..., min_length=1, max_length=50, pattern=r'^[a-z0-9-]+$')
    description: Optional[str] = Field(None, max_length=500)


class OrganizationCreate(OrganizationBase):
    pass


class OrganizationUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    # Settings
    max_projects: Optional[int] = Field(None, ge=1)
    max_tasks_per_month: Optional[int] = Field(None, ge=1)
    max_workers: Optional[int] = Field(None, ge=1)
    # Features
    custom_branding: Optional[bool] = None
    private_workforce: Optional[bool] = None
    advanced_analytics: Optional[bool] = None


class OrganizationInDBBase(OrganizationBase):
    id: UUID4
    stripe_customer_id: Optional[str] = None
    subscription_tier: str = "free"
    subscription_status: str = "active"
    max_projects: int = 5
    max_tasks_per_month: int = 1000
    max_workers: int = 10
    custom_branding: bool = False
    private_workforce: bool = False
    advanced_analytics: bool = False
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class Organization(OrganizationInDBBase):
    pass


class OrganizationWithStats(OrganizationInDBBase):
    user_count: int = 0
    project_count: int = 0
    active_projects: int = 0


class OrganizationInvite(BaseModel):
    email: str = Field(..., pattern=r'^[^@]+@[^@]+\.[^@]+$')
    role: str = Field(default="member", pattern=r'^(admin|member)$')


class OrganizationInviteResponse(BaseModel):
    success: bool
    message: str
    invited_email: str 