from typing import List, Optional
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload
from fastapi import HTTPException, status

from app.models.project import Project, ProjectStatus
from app.models.team import Team
from app.models.question import Question
from app.schemas.project import ProjectCreate, ProjectUpdate
from app.schemas.question import QuestionCreate


class ProjectService:
    
    @staticmethod
    async def create(
        db: AsyncSession,
        obj_in: ProjectCreate,
        creator_id: UUID,
        organization_id: UUID
    ) -> Project:
        # Check if slug is unique
        result = await db.execute(
            select(Project).where(Project.slug == obj_in.slug)
        )
        if result.scalar_one_or_none():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Project with this slug already exists"
            )
        
        # Create project
        project_data = obj_in.model_dump(exclude={"team_ids"})
        
        # Handle metadata field mapping (metadata -> project_metadata)  
        if "metadata" in project_data:
            project_data["project_metadata"] = project_data.pop("metadata")
        
        db_project = Project(
            **project_data,
            creator_id=creator_id,
            organization_id=organization_id,
            status=ProjectStatus.DRAFT
        )
        
        # Add teams if provided
        if obj_in.team_ids:
            result = await db.execute(
                select(Team).where(
                    Team.id.in_(obj_in.team_ids),
                    Team.organization_id == organization_id
                )
            )
            teams = result.scalars().all()
            db_project.teams = teams
        
        db.add(db_project)
        await db.commit()
        await db.refresh(db_project)
        return db_project
    
    @staticmethod
    async def get(db: AsyncSession, project_id: UUID) -> Optional[Project]:
        result = await db.execute(
            select(Project)
            .options(selectinload(Project.questions))
            .where(Project.id == project_id)
        )
        return result.scalar_one_or_none()
    
    @staticmethod
    async def get_by_slug(db: AsyncSession, slug: str) -> Optional[Project]:
        result = await db.execute(
            select(Project)
            .options(selectinload(Project.questions))
            .where(Project.slug == slug)
        )
        return result.scalar_one_or_none()
    
    @staticmethod
    async def list_organization_projects(
        db: AsyncSession,
        organization_id: UUID,
        skip: int = 0,
        limit: int = 100,
        status: Optional[ProjectStatus] = None
    ) -> List[Project]:
        query = select(Project).where(Project.organization_id == organization_id)
        
        if status:
            query = query.where(Project.status == status)
        
        query = query.offset(skip).limit(limit)
        result = await db.execute(query)
        return result.scalars().all()
    
    @staticmethod
    async def update(
        db: AsyncSession,
        db_obj: Project,
        obj_in: ProjectUpdate
    ) -> Project:
        update_data = obj_in.model_dump(exclude_unset=True)
        
        # Handle metadata field mapping (metadata -> project_metadata)
        if "metadata" in update_data:
            update_data["project_metadata"] = update_data.pop("metadata")
        
        for field, value in update_data.items():
            setattr(db_obj, field, value)
        
        await db.commit()
        await db.refresh(db_obj)
        return db_obj
    
    @staticmethod
    async def launch(db: AsyncSession, project: Project) -> Project:
        if project.status != ProjectStatus.DRAFT:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Only draft projects can be launched"
            )
        
        # Validate project has questions
        if not project.questions:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Project must have at least one question"
            )
        
        project.status = ProjectStatus.ACTIVE
        await db.commit()
        await db.refresh(project)
        return project
    
    @staticmethod
    async def pause(db: AsyncSession, project: Project) -> Project:
        if project.status != ProjectStatus.ACTIVE:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Only active projects can be paused"
            )
        
        project.status = ProjectStatus.PAUSED
        await db.commit()
        await db.refresh(project)
        return project
    
    @staticmethod
    async def resume(db: AsyncSession, project: Project) -> Project:
        if project.status != ProjectStatus.PAUSED:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Only paused projects can be resumed"
            )
        
        project.status = ProjectStatus.ACTIVE
        await db.commit()
        await db.refresh(project)
        return project
    
    @staticmethod
    async def complete(db: AsyncSession, project: Project) -> Project:
        if project.status not in [ProjectStatus.ACTIVE, ProjectStatus.PAUSED]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Project must be active or paused to complete"
            )
        
        project.status = ProjectStatus.COMPLETED
        await db.commit()
        await db.refresh(project)
        return project
    
    @staticmethod
    async def cancel(db: AsyncSession, project: Project) -> Project:
        if project.status == ProjectStatus.COMPLETED:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Completed projects cannot be cancelled"
            )
        
        project.status = ProjectStatus.CANCELLED
        await db.commit()
        await db.refresh(project)
        return project
    
    @staticmethod
    async def delete(db: AsyncSession, project: Project) -> None:
        await db.delete(project)
        await db.commit()
    
    @staticmethod
    async def add_question(
        db: AsyncSession,
        project: Project,
        question_in: QuestionCreate
    ) -> Question:
        # Check if identifier is unique within project
        result = await db.execute(
            select(Question).where(
                Question.project_id == project.id,
                Question.identifier == question_in.identifier
            )
        )
        if result.scalar_one_or_none():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Question with this identifier already exists in project"
            )
        
        db_question = Question(
            **question_in.model_dump(),
            project_id=project.id
        )
        db.add(db_question)
        await db.commit()
        await db.refresh(db_question)
        return db_question