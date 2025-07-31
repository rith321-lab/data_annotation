from typing import Any, List, Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, distinct

from app.core.deps import get_current_active_user, get_db
from app.models.user import User
from app.models.project import Project as ProjectModel, ProjectStatus
from app.models.worker import WorkerAssignment
from app.schemas.project import (
    Project, ProjectCreate, ProjectUpdate, ProjectWithStats, ProjectActionResponse
)
from app.schemas.question import Question, QuestionCreate
from app.services.project import ProjectService

router = APIRouter()


@router.post("/", response_model=Project)
async def create_project(
    project_in: ProjectCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """Create a new project"""
    if not current_user.organization_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You must create or join an organization before creating projects. Please go to the Organization page to create one."
        )
    
    # Check permissions using new permission system
    from app.core.permissions import can_create_project
    if not await can_create_project(db, current_user):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have permission to create projects. You must be a member of a team that allows project creation."
        )
    
    project = await ProjectService.create(
        db,
        obj_in=project_in,
        creator_id=current_user.id,
        organization_id=current_user.organization_id
    )
    return project


@router.get("/", response_model=List[Project])
async def list_projects(
    db: AsyncSession = Depends(get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, le=100),
    status: Optional[ProjectStatus] = None,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """List all projects in the user's organization"""
    if not current_user.organization_id:
        return []
    
    projects = await ProjectService.list_organization_projects(
        db,
        organization_id=current_user.organization_id,
        skip=skip,
        limit=limit,
        status=status
    )
    return projects


@router.get("/{project_id}", response_model=ProjectWithStats)
async def get_project(
    project_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """Get a specific project by ID"""
    project = await ProjectService.get(db, project_id=project_id)
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    # Check if user has access
    if project.organization_id != current_user.organization_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    # Calculate additional stats
    pending_tasks = project.total_tasks - project.completed_tasks
    completion_rate = (
        project.completed_tasks / project.total_tasks
        if project.total_tasks > 0
        else 0.0
    )
    
    # Calculate active workers (workers with active assignments for this project)
    active_workers_result = await db.execute(
        select(func.count(distinct(WorkerAssignment.worker_id)))
        .join(WorkerAssignment.task)
        .where(
            WorkerAssignment.task.has(project_id=project_id),
            WorkerAssignment.status.in_(["assigned", "in_progress"])
        )
    )
    active_workers = active_workers_result.scalar() or 0
    
    return ProjectWithStats(
        **project.__dict__,
        completion_rate=completion_rate,
        pending_tasks=pending_tasks,
        active_workers=active_workers
    )


@router.put("/{project_id}", response_model=Project)
async def update_project(
    project_id: UUID,
    project_in: ProjectUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """Update a project"""
    project = await ProjectService.get(db, project_id=project_id)
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    # Check permissions
    if project.organization_id != current_user.organization_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    project = await ProjectService.update(db, db_obj=project, obj_in=project_in)
    return project


@router.delete("/{project_id}")
async def delete_project(
    project_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """Delete a project"""
    project = await ProjectService.get(db, project_id=project_id)
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    # Check permissions using new permission system
    from app.core.permissions import can_delete_project
    if not await can_delete_project(db, current_user, str(project_id)):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions. Superusers can delete any project, regular users can only delete projects in their organization if they're team OWNER/ADMIN."
        )
    
    await ProjectService.delete(db, project)
    return {"message": "Project deleted successfully"}


@router.post("/{project_id}/launch", response_model=ProjectActionResponse)
async def launch_project(
    project_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """Launch a project"""
    project = await ProjectService.get(db, project_id=project_id)
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    # Check permissions
    if project.organization_id != current_user.organization_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    project = await ProjectService.launch(db, project)
    return ProjectActionResponse(
        success=True,
        message="Project launched successfully",
        project=project
    )


@router.post("/{project_id}/pause", response_model=ProjectActionResponse)
async def pause_project(
    project_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """Pause a project"""
    project = await ProjectService.get(db, project_id=project_id)
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    # Check permissions
    if project.organization_id != current_user.organization_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    project = await ProjectService.pause(db, project)
    return ProjectActionResponse(
        success=True,
        message="Project paused successfully",
        project=project
    )


@router.post("/{project_id}/resume", response_model=ProjectActionResponse)
async def resume_project(
    project_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """Resume a paused project"""
    project = await ProjectService.get(db, project_id=project_id)
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    # Check permissions
    if project.organization_id != current_user.organization_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    project = await ProjectService.resume(db, project)
    return ProjectActionResponse(
        success=True,
        message="Project resumed successfully",
        project=project
    )


@router.post("/{project_id}/complete", response_model=ProjectActionResponse)
async def complete_project(
    project_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """Mark a project as completed"""
    project = await ProjectService.get(db, project_id=project_id)
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    # Check permissions
    if project.organization_id != current_user.organization_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    project = await ProjectService.complete(db, project)
    return ProjectActionResponse(
        success=True,
        message="Project completed successfully",
        project=project
    )


@router.post("/{project_id}/cancel", response_model=ProjectActionResponse)
async def cancel_project(
    project_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """Cancel a project"""
    project = await ProjectService.get(db, project_id=project_id)
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    # Check permissions
    if project.organization_id != current_user.organization_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    project = await ProjectService.cancel(db, project)
    return ProjectActionResponse(
        success=True,
        message="Project cancelled successfully",
        project=project
    )


@router.post("/{project_id}/questions", response_model=Question)
async def add_question(
    project_id: UUID,
    question_in: QuestionCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """Add a question to a project"""
    project = await ProjectService.get(db, project_id=project_id)
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    # Check permissions
    if project.organization_id != current_user.organization_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    # Check if project is in draft status
    if project.status != ProjectStatus.DRAFT:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Questions can only be added to draft projects"
        )
    
    question = await ProjectService.add_question(db, project, question_in)
    return question