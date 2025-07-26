"""
AI-powered auto-labeling suggestion service
Provides intelligent suggestions for various annotation types
"""
import asyncio
from typing import List, Dict, Any, Optional
from datetime import datetime
import numpy as np
from fastapi import HTTPException
import httpx
import json

class AISuggestionService:
    """Service for generating AI-powered labeling suggestions"""
    
    def __init__(self):
        self.confidence_threshold = 0.7
        self.model_endpoints = {
            "text_classification": "http://localhost:8001/classify",
            "image_classification": "http://localhost:8002/classify",
            "ner": "http://localhost:8003/extract",
            "sentiment": "http://localhost:8004/analyze"
        }
        
    async def get_suggestions(
        self,
        task_type: str,
        data: Dict[str, Any],
        options: Optional[List[str]] = None
    ) -> Dict[str, Any]:
        """
        Get AI suggestions for a specific task
        
        Args:
            task_type: Type of annotation task
            data: Input data for analysis
            options: Available options for classification tasks
            
        Returns:
            Dictionary with suggestions and confidence scores
        """
        
        try:
            if task_type == "text_classification":
                return await self._get_text_classification_suggestion(data, options)
            elif task_type == "image_classification":
                return await self._get_image_classification_suggestion(data, options)
            elif task_type == "sentiment_analysis":
                return await self._get_sentiment_suggestion(data)
            elif task_type == "named_entity_recognition":
                return await self._get_ner_suggestion(data)
            elif task_type == "multiple_choice":
                return await self._get_multiple_choice_suggestion(data, options)
            else:
                return {"suggestions": [], "confidence": 0, "error": "Unsupported task type"}
                
        except Exception as e:
            return {"suggestions": [], "confidence": 0, "error": str(e)}
    
    async def _get_text_classification_suggestion(
        self, 
        data: Dict[str, Any], 
        options: List[str]
    ) -> Dict[str, Any]:
        """Generate suggestions for text classification"""
        
        # Simulate AI model prediction
        # In production, this would call a real ML model
        text = data.get("text", "")
        
        # Simple keyword-based mock classification
        suggestions = []
        confidence_scores = []
        
        # Mock logic for demonstration
        keywords = {
            "positive": ["good", "great", "excellent", "amazing", "love"],
            "negative": ["bad", "terrible", "awful", "hate", "worst"],
            "neutral": ["okay", "fine", "average", "normal"]
        }
        
        text_lower = text.lower()
        scores = {}
        
        for category, words in keywords.items():
            score = sum(1 for word in words if word in text_lower)
            if category in [opt.lower() for opt in options]:
                scores[category] = score
        
        if scores:
            best_category = max(scores, key=scores.get)
            confidence = min(0.95, 0.6 + (scores[best_category] * 0.1))
            
            # Find the matching option (case-insensitive)
            for option in options:
                if option.lower() == best_category:
                    suggestions.append({
                        "label": option,
                        "confidence": confidence,
                        "explanation": f"Text contains {scores[best_category]} indicator(s) for {best_category}"
                    })
                    break
        
        return {
            "suggestions": suggestions,
            "confidence": suggestions[0]["confidence"] if suggestions else 0,
            "model": "text-classifier-v1",
            "timestamp": datetime.utcnow().isoformat()
        }
    
    async def _get_image_classification_suggestion(
        self,
        data: Dict[str, Any],
        options: List[str]
    ) -> Dict[str, Any]:
        """Generate suggestions for image classification"""
        
        # Mock image classification
        # In production, this would use a real CV model
        image_url = data.get("imageUrl", "")
        
        # Simulate different confidence levels
        mock_predictions = [
            {"label": options[0] if options else "Unknown", "confidence": 0.85},
            {"label": options[1] if len(options) > 1 else "Unknown", "confidence": 0.12},
        ]
        
        suggestions = [
            {
                "label": pred["label"],
                "confidence": pred["confidence"],
                "explanation": f"Visual features match {pred['label']} with {pred['confidence']*100:.1f}% confidence"
            }
            for pred in mock_predictions if pred["confidence"] > 0.1
        ]
        
        return {
            "suggestions": suggestions,
            "confidence": suggestions[0]["confidence"] if suggestions else 0,
            "model": "image-classifier-v1",
            "timestamp": datetime.utcnow().isoformat()
        }
    
    async def _get_sentiment_suggestion(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Generate sentiment analysis suggestions"""
        
        text = data.get("text", "")
        
        # Mock sentiment analysis
        positive_words = ["good", "great", "excellent", "love", "amazing", "wonderful"]
        negative_words = ["bad", "terrible", "hate", "awful", "horrible", "worst"]
        
        text_lower = text.lower()
        pos_count = sum(1 for word in positive_words if word in text_lower)
        neg_count = sum(1 for word in negative_words if word in text_lower)
        
        if pos_count > neg_count:
            sentiment = "positive"
            confidence = min(0.95, 0.6 + (pos_count * 0.1))
        elif neg_count > pos_count:
            sentiment = "negative"
            confidence = min(0.95, 0.6 + (neg_count * 0.1))
        else:
            sentiment = "neutral"
            confidence = 0.7
        
        return {
            "suggestions": [{
                "label": sentiment,
                "confidence": confidence,
                "scores": {
                    "positive": pos_count / max(1, len(text.split())),
                    "negative": neg_count / max(1, len(text.split())),
                    "neutral": 1 - (pos_count + neg_count) / max(1, len(text.split()))
                }
            }],
            "confidence": confidence,
            "model": "sentiment-analyzer-v1",
            "timestamp": datetime.utcnow().isoformat()
        }
    
    async def _get_ner_suggestion(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Generate named entity recognition suggestions"""
        
        text = data.get("text", "")
        
        # Mock NER detection
        # In production, use spaCy, transformers, or similar
        entities = []
        
        # Simple pattern matching for demonstration
        import re
        
        # Find potential person names (capitalized words)
        person_pattern = r'\b[A-Z][a-z]+ [A-Z][a-z]+\b'
        for match in re.finditer(person_pattern, text):
            entities.append({
                "text": match.group(),
                "type": "PERSON",
                "start": match.start(),
                "end": match.end(),
                "confidence": 0.8
            })
        
        # Find potential organizations
        org_keywords = ["Inc", "Corp", "LLC", "Company", "Corporation"]
        for keyword in org_keywords:
            pattern = rf'\b[\w\s]+\s{keyword}\b'
            for match in re.finditer(pattern, text):
                entities.append({
                    "text": match.group(),
                    "type": "ORGANIZATION",
                    "start": match.start(),
                    "end": match.end(),
                    "confidence": 0.75
                })
        
        # Find dates
        date_pattern = r'\b\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b'
        for match in re.finditer(date_pattern, text):
            entities.append({
                "text": match.group(),
                "type": "DATE",
                "start": match.start(),
                "end": match.end(),
                "confidence": 0.9
            })
        
        return {
            "suggestions": entities,
            "confidence": np.mean([e["confidence"] for e in entities]) if entities else 0,
            "model": "ner-extractor-v1",
            "timestamp": datetime.utcnow().isoformat()
        }
    
    async def _get_multiple_choice_suggestion(
        self,
        data: Dict[str, Any],
        options: List[str]
    ) -> Dict[str, Any]:
        """Generate suggestions for multiple choice questions"""
        
        question = data.get("question", "")
        context = data.get("context", "")
        
        # Mock multiple choice analysis
        # Score each option based on relevance
        suggestions = []
        
        for option in options:
            # Simple scoring based on word overlap
            option_words = set(option.lower().split())
            context_words = set(context.lower().split())
            question_words = set(question.lower().split())
            
            overlap_score = len(option_words & (context_words | question_words))
            confidence = min(0.9, 0.3 + (overlap_score * 0.1))
            
            if confidence > 0.4:
                suggestions.append({
                    "label": option,
                    "confidence": confidence,
                    "explanation": f"Option relevance score: {overlap_score}"
                })
        
        # Sort by confidence
        suggestions.sort(key=lambda x: x["confidence"], reverse=True)
        
        return {
            "suggestions": suggestions[:3],  # Top 3 suggestions
            "confidence": suggestions[0]["confidence"] if suggestions else 0,
            "model": "choice-analyzer-v1",
            "timestamp": datetime.utcnow().isoformat()
        }
    
    async def train_from_feedback(
        self,
        task_type: str,
        data: Dict[str, Any],
        suggestion: str,
        actual_label: str,
        was_helpful: bool
    ) -> Dict[str, Any]:
        """
        Learn from user feedback to improve suggestions
        
        Args:
            task_type: Type of annotation task
            data: Original input data
            suggestion: The suggestion that was provided
            actual_label: The label the user actually selected
            was_helpful: Whether the suggestion was helpful
            
        Returns:
            Confirmation of feedback recording
        """
        
        feedback_record = {
            "task_type": task_type,
            "data_hash": hash(json.dumps(data, sort_keys=True)),
            "suggestion": suggestion,
            "actual_label": actual_label,
            "was_helpful": was_helpful,
            "timestamp": datetime.utcnow().isoformat()
        }
        
        # In production, this would:
        # 1. Store feedback in database
        # 2. Periodically retrain models
        # 3. Update confidence thresholds
        
        return {
            "status": "feedback_recorded",
            "message": "Thank you for improving our AI suggestions!",
            "feedback_id": f"fb_{hash(str(feedback_record))}"
        }

# Singleton instance
ai_suggestion_service = AISuggestionService()