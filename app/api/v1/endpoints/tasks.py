from typing import Any, List, Optional, Dict
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status, Query, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
import csv
import io
import json

from app.core.deps import get_current_active_user, get_db
from app.models.user import User
from app.models.task import TaskStatus
from app.schemas.task import (
    Task, TaskCreate, TaskUpdate, TaskBulkCreate, TaskWithResponses, TaskStats
)
from app.services.task import TaskService
from app.services.project import ProjectService

router = APIRouter()


@router.post("/projects/{project_id}/tasks", response_model=Task)
async def create_task(
    project_id: UUID,
    task_in: TaskCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """Create a new task for a project"""
    # Check permissions using new permission system
    from app.core.permissions import can_create_task
    if not await can_create_task(db, current_user, str(project_id)):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions to create tasks. You must be in a team that allows project creation and the project must be in your organization."
        )
    
    task = await TaskService.create(db, obj_in=task_in, project_id=project_id)
    return task


@router.post("/projects/{project_id}/tasks/bulk", response_model=List[Task])
async def create_tasks_bulk(
    project_id: UUID,
    tasks_in: TaskBulkCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """Create multiple tasks for a project"""
    # Check permissions using new permission system
    from app.core.permissions import can_create_task
    if not await can_create_task(db, current_user, str(project_id)):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions to create tasks. You must be in a team that allows project creation and the project must be in your organization."
        )
    
    tasks = await TaskService.create_many(
        db, tasks_in=tasks_in.tasks, project_id=project_id
    )
    return tasks


@router.post("/projects/{project_id}/tasks/csv")
async def upload_tasks_csv(
    project_id: UUID,
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """Upload tasks via CSV file"""
    # Check permissions using new permission system
    from app.core.permissions import can_create_task
    if not await can_create_task(db, current_user, str(project_id)):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions to create tasks. You must be in a team that allows project creation and the project must be in your organization."
        )
    
    # Read CSV file
    content = await file.read()
    csv_reader = csv.DictReader(io.StringIO(content.decode('utf-8')))
    
    tasks_data = []
    for row in csv_reader:
        # Convert row to task data
        task_data = {
            "external_id": row.get("external_id"),
            "data": {k: v for k, v in row.items() if k != "external_id"},
            "metadata": {}
        }
        tasks_data.append(TaskCreate(**task_data))
    
    # Create tasks
    tasks = await TaskService.create_many(db, tasks_in=tasks_data, project_id=project_id)
    
    return {
        "message": f"Successfully created {len(tasks)} tasks",
        "task_count": len(tasks)
    }


@router.get("/projects/{project_id}/tasks", response_model=List[Task])
async def list_project_tasks(
    project_id: UUID,
    db: AsyncSession = Depends(get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, le=100),
    status: Optional[TaskStatus] = None,
    batch_id: Optional[str] = None,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """List all tasks for a project"""
    # Check project exists and user has access
    project = await ProjectService.get(db, project_id=project_id)
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    if project.organization_id != current_user.organization_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    tasks = await TaskService.list_project_tasks(
        db,
        project_id=project_id,
        skip=skip,
        limit=limit,
        status=status,
        batch_id=batch_id
    )
    return tasks


@router.get("/projects/{project_id}/tasks/stats", response_model=TaskStats)
async def get_project_task_stats(
    project_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """Get task statistics for a project"""
    # Check project exists and user has access
    project = await ProjectService.get(db, project_id=project_id)
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    if project.organization_id != current_user.organization_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    stats = await TaskService.get_project_stats(db, project_id=project_id)
    return stats


@router.get("/tasks/{task_id}", response_model=TaskWithResponses)
async def get_task(
    task_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """Get a specific task by ID"""
    task = await TaskService.get(db, task_id=task_id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    
    # Check user has access to the project
    project = await ProjectService.get(db, project_id=task.project_id)
    if project.organization_id != current_user.organization_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    # Calculate completion percentage
    completion_percentage = (
        task.completed_responses / task.required_responses * 100
        if task.required_responses > 0
        else 0
    )
    
    # Format responses
    responses_data = [
        {
            "id": str(r.id),
            "worker_id": str(r.worker_id),
            "created_at": r.created_at.isoformat(),
            "time_taken": r.time_taken,
            "quality_score": r.quality_score
        }
        for r in task.responses
    ]
    
    return TaskWithResponses(
        **task.__dict__,
        responses=responses_data,
        completion_percentage=completion_percentage
    )


@router.put("/tasks/{task_id}", response_model=Task)
async def update_task(
    task_id: UUID,
    task_in: TaskUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """Update a task"""
    task = await TaskService.get(db, task_id=task_id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    
    # Check user has access to the project
    project = await ProjectService.get(db, project_id=task.project_id)
    if project.organization_id != current_user.organization_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    task = await TaskService.update(db, db_obj=task, obj_in=task_in)
    return task


@router.post("/tasks/{task_id}/gold-standard", response_model=Task)
async def set_gold_standard(
    task_id: UUID,
    gold_answers: Dict[str, Any],
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """Set a task as gold standard with expected answers"""
    task = await TaskService.get(db, task_id=task_id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    
    # Check user has access to the project
    project = await ProjectService.get(db, project_id=task.project_id)
    if project.organization_id != current_user.organization_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    task = await TaskService.set_gold_standard(db, task=task, gold_answers=gold_answers)
    return task


@router.delete("/tasks/{task_id}")
async def delete_task(
    task_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """Delete a task"""
    task = await TaskService.get(db, task_id=task_id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    
    # Check user has access to the project
    project = await ProjectService.get(db, project_id=task.project_id)
    if project.organization_id != current_user.organization_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    await TaskService.delete(db, task)
    return {"message": "Task deleted successfully"}