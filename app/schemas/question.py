from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field

from app.models.question import QuestionType


class QuestionOption(BaseModel):
    value: str
    label: str
    description: Optional[str] = None


class QuestionBase(BaseModel):
    question_type: QuestionType
    order: int = Field(ge=0)
    identifier: str
    label: str
    description: Optional[str] = None
    placeholder: Optional[str] = None
    required: bool = True
    min_length: Optional[int] = Field(None, ge=0)
    max_length: Optional[int] = Field(None, ge=1)
    min_selections: Optional[int] = Field(None, ge=0)
    max_selections: Optional[int] = Field(None, ge=1)
    regex_pattern: Optional[str] = None
    regex_error_message: Optional[str] = None
    options: Optional[List[QuestionOption]] = None
    show_if: Optional[Dict[str, Any]] = None
    settings: Dict[str, Any] = {}


class QuestionCreate(QuestionBase):
    pass


class QuestionUpdate(BaseModel):
    order: Optional[int] = None
    label: Optional[str] = None
    description: Optional[str] = None
    placeholder: Optional[str] = None
    required: Optional[bool] = None
    min_length: Optional[int] = None
    max_length: Optional[int] = None
    min_selections: Optional[int] = None
    max_selections: Optional[int] = None
    regex_pattern: Optional[str] = None
    regex_error_message: Optional[str] = None
    options: Optional[List[QuestionOption]] = None
    show_if: Optional[Dict[str, Any]] = None
    settings: Optional[Dict[str, Any]] = None


class QuestionInDBBase(QuestionBase):
    id: str
    project_id: str
    
    class Config:
        from_attributes = True


class Question(QuestionInDBBase):
    pass