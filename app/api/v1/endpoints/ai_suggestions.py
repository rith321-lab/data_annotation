from typing import Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from app.core.deps import get_current_user
from app.models.user import User
from app.services.ai_suggestions import ai_suggestion_service

router = APIRouter()

class SuggestionRequest(BaseModel):
    task_type: str
    data: Dict[str, Any]
    options: Optional[list[str]] = None

class FeedbackRequest(BaseModel):
    task_type: str
    data: Dict[str, Any]
    suggestion: str
    actual_label: str
    was_helpful: bool

@router.post("/suggest")
async def get_ai_suggestion(
    request: SuggestionRequest,
    current_user: User = Depends(get_current_user)
):
    """Get AI-powered suggestions for annotation tasks"""
    
    suggestions = await ai_suggestion_service.get_suggestions(
        task_type=request.task_type,
        data=request.data,
        options=request.options
    )
    
    return suggestions

@router.post("/feedback")
async def submit_suggestion_feedback(
    request: FeedbackRequest,
    current_user: User = Depends(get_current_user)
):
    """Submit feedback on AI suggestions to improve the model"""
    
    result = await ai_suggestion_service.train_from_feedback(
        task_type=request.task_type,
        data=request.data,
        suggestion=request.suggestion,
        actual_label=request.actual_label,
        was_helpful=request.was_helpful
    )
    
    return result

@router.get("/stats")
async def get_suggestion_stats(
    current_user: User = Depends(get_current_user)
):
    """Get statistics about AI suggestion performance"""
    
    # Mock statistics for demonstration
    return {
        "total_suggestions": 15234,
        "suggestions_accepted": 12876,
        "acceptance_rate": 0.845,
        "average_confidence": 0.782,
        "models": {
            "text_classification": {
                "version": "v1.2.3",
                "accuracy": 0.867,
                "last_updated": "2024-01-26"
            },
            "image_classification": {
                "version": "v2.1.0",
                "accuracy": 0.912,
                "last_updated": "2024-01-25"
            },
            "sentiment_analysis": {
                "version": "v1.0.5",
                "accuracy": 0.834,
                "last_updated": "2024-01-20"
            },
            "ner": {
                "version": "v3.0.1",
                "accuracy": 0.798,
                "last_updated": "2024-01-22"
            }
        }
    }