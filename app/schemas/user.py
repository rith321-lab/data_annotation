from typing import Optional
from pydantic import BaseModel, EmailStr
from datetime import datetime


class UserBase(BaseModel):
    email: EmailStr
    username: str
    full_name: Optional[str] = None
    is_active: bool = True
    is_superuser: bool = False
    is_verified: bool = False


class UserCreate(UserBase):
    password: str


class UserUpdate(UserBase):
    password: Optional[str] = None
    email: Optional[EmailStr] = None
    username: Optional[str] = None


class UserInDBBase(UserBase):
    id: str
    organization_id: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    last_login: Optional[datetime] = None
    email_verified_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class User(UserInDBBase):
    pass


class UserInDB(UserInDBBase):
    hashed_password: str