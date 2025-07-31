from sqlalchemy import Column, String, Text, Boolean, Integer, ForeignKey, Enum, JSON
from sqlalchemy.orm import relationship
import uuid
import enum

from app.db.base_class import Base


class QuestionType(str, enum.Enum):
    FREE_RESPONSE = "free_response"
    MULTIPLE_CHOICE = "multiple_choice"
    CHECKBOX = "checkbox"
    LIKERT = "likert"
    RANKING = "ranking"
    TEXT_TAGGING = "text_tagging"
    TREE_SELECTION = "tree_selection"
    FILE_UPLOAD = "file_upload"
    CHATBOT = "chatbot"
    IMAGE_ANNOTATION = "image_annotation"
    VIDEO_ANNOTATION = "video_annotation"
    AUDIO_TRANSCRIPTION = "audio_transcription"


class Question(Base):
    __tablename__ = "questions"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    
    # Project relationship
    project_id = Column(String, ForeignKey("projects.id"), nullable=False)
    project = relationship("Project", back_populates="questions")
    
    # Question details
    question_type = Column(Enum(QuestionType), nullable=False)
    order = Column(Integer, nullable=False)  # Display order
    identifier = Column(String, nullable=False)  # Unique within project
    
    # Content
    label = Column(String, nullable=False)  # The question text
    description = Column(Text)  # Additional instructions
    placeholder = Column(String)  # Placeholder text for inputs
    
    # Validation
    required = Column(Boolean, default=True)
    min_length = Column(Integer)  # For text responses
    max_length = Column(Integer)  # For text responses
    min_selections = Column(Integer)  # For checkbox
    max_selections = Column(Integer)  # For checkbox
    regex_pattern = Column(String)  # For validation
    regex_error_message = Column(String)
    
    # Options (for multiple choice, checkbox, etc.)
    options = Column(JSON)  # List of {value, label, description}
    
    # Conditional logic
    show_if = Column(JSON)  # Conditions for showing this question
    
    # Settings for specific question types
    settings = Column(JSON, default={})
    # For likert: scale_min, scale_max, scale_labels
    # For ranking: allow_ties
    # For text_tagging: entity_types
    # For tree_selection: tree_data
    # For file_upload: allowed_types, max_size
    # For chatbot: endpoint_url, initial_message
    
    # Relationships
    response_values = relationship("ResponseValue", back_populates="question")
    
    def __repr__(self):
        return f"<Question {self.identifier} in Project {self.project_id}>"