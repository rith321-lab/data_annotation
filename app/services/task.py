from typing import List, Optional, Dict, Any
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_
from sqlalchemy.orm import selectinload
from fastapi import HTTPException, status
import json

from app.models.task import Task, TaskStatus
from app.models.project import Project, ProjectStatus
from app.models.response import Response
from app.schemas.task import TaskCreate, TaskUpdate, TaskBulkCreate


class TaskService:
    
    @staticmethod
    async def create(
        db: AsyncSession,
        obj_in: TaskCreate,
        project_id: UUID
    ) -> Task:
        # Create task
        db_task = Task(
            **obj_in.model_dump(),
            project_id=project_id,
            status=TaskStatus.PENDING
        )
        
        db.add(db_task)
        
        # Update project task count
        result = await db.execute(
            select(Project).where(Project.id == project_id)
        )
        project = result.scalar_one()
        project.total_tasks += 1
        
        await db.commit()
        await db.refresh(db_task)
        return db_task
    
    @staticmethod
    async def create_many(
        db: AsyncSession,
        tasks_in: List[TaskCreate],
        project_id: UUID
    ) -> List[Task]:
        # Create all tasks
        db_tasks = []
        for task_in in tasks_in:
            db_task = Task(
                **task_in.model_dump(),
                project_id=project_id,
                status=TaskStatus.PENDING
            )
            db_tasks.append(db_task)
            db.add(db_task)
        
        # Update project task count
        result = await db.execute(
            select(Project).where(Project.id == project_id)
        )
        project = result.scalar_one()
        project.total_tasks += len(db_tasks)
        
        await db.commit()
        
        # Refresh all tasks
        for task in db_tasks:
            await db.refresh(task)
        
        return db_tasks
    
    @staticmethod
    async def get(db: AsyncSession, task_id: UUID) -> Optional[Task]:
        result = await db.execute(
            select(Task)
            .options(selectinload(Task.responses))
            .where(Task.id == task_id)
        )
        return result.scalar_one_or_none()
    
    @staticmethod
    async def get_by_external_id(
        db: AsyncSession,
        external_id: str,
        project_id: UUID
    ) -> Optional[Task]:
        result = await db.execute(
            select(Task).where(
                Task.external_id == external_id,
                Task.project_id == project_id
            )
        )
        return result.scalar_one_or_none()
    
    @staticmethod
    async def list_project_tasks(
        db: AsyncSession,
        project_id: UUID,
        skip: int = 0,
        limit: int = 100,
        status: Optional[TaskStatus] = None,
        batch_id: Optional[str] = None
    ) -> List[Task]:
        query = select(Task).where(Task.project_id == project_id)
        
        if status:
            query = query.where(Task.status == status)
        
        if batch_id:
            query = query.where(Task.batch_id == batch_id)
        
        query = query.offset(skip).limit(limit)
        result = await db.execute(query)
        return result.scalars().all()
    
    @staticmethod
    async def update(
        db: AsyncSession,
        db_obj: Task,
        obj_in: TaskUpdate
    ) -> Task:
        update_data = obj_in.model_dump(exclude_unset=True)
        
        for field, value in update_data.items():
            setattr(db_obj, field, value)
        
        await db.commit()
        await db.refresh(db_obj)
        return db_obj
    
    @staticmethod
    async def set_gold_standard(
        db: AsyncSession,
        task: Task,
        gold_answers: Dict[str, Any]
    ) -> Task:
        task.is_gold_standard = True
        task.gold_standard_answers = gold_answers
        
        await db.commit()
        await db.refresh(task)
        return task
    
    @staticmethod
    async def get_next_available_task(
        db: AsyncSession,
        project_id: UUID,
        worker_id: UUID,
        exclude_task_ids: Optional[List[UUID]] = None
    ) -> Optional[Task]:
        """Get next available task for a worker"""
        # Build query to find available tasks
        query = select(Task).where(
            and_(
                Task.project_id == project_id,
                Task.status == TaskStatus.PENDING,
                Task.completed_responses < Task.required_responses
            )
        )
        
        # Exclude specific tasks
        if exclude_task_ids:
            query = query.where(~Task.id.in_(exclude_task_ids))
        
        # Exclude tasks the worker has already worked on
        subquery = select(Response.task_id).where(Response.worker_id == worker_id)
        query = query.where(~Task.id.in_(subquery))
        
        # Order by priority and creation date
        query = query.order_by(Task.priority.desc(), Task.created_at)
        
        result = await db.execute(query.limit(1))
        return result.scalar_one_or_none()
    
    @staticmethod
    async def update_completion_status(
        db: AsyncSession,
        task: Task
    ) -> Task:
        """Update task status based on responses"""
        if task.completed_responses >= task.required_responses:
            task.status = TaskStatus.COMPLETED
            
            # Update project completed count
            result = await db.execute(
                select(Project).where(Project.id == task.project_id)
            )
            project = result.scalar_one()
            project.completed_tasks += 1
        
        await db.commit()
        await db.refresh(task)
        return task
    
    @staticmethod
    async def get_project_stats(
        db: AsyncSession,
        project_id: UUID
    ) -> Dict[str, Any]:
        """Get task statistics for a project"""
        # Count tasks by status
        result = await db.execute(
            select(
                Task.status,
                func.count(Task.id).label('count')
            )
            .where(Task.project_id == project_id)
            .group_by(Task.status)
        )
        
        status_counts = {row.status.value: row.count for row in result}
        
        # Calculate average completion time and consensus
        result = await db.execute(
            select(
                func.avg(Task.average_time_taken).label('avg_time'),
                func.avg(Task.consensus_score).label('avg_consensus')
            )
            .where(
                Task.project_id == project_id,
                Task.status == TaskStatus.COMPLETED
            )
        )
        row = result.one()
        
        return {
            "total_tasks": sum(status_counts.values()),
            "pending_tasks": status_counts.get(TaskStatus.PENDING.value, 0),
            "in_progress_tasks": status_counts.get(TaskStatus.IN_PROGRESS.value, 0),
            "completed_tasks": status_counts.get(TaskStatus.COMPLETED.value, 0),
            "needs_review_tasks": status_counts.get(TaskStatus.NEEDS_REVIEW.value, 0),
            "rejected_tasks": status_counts.get(TaskStatus.REJECTED.value, 0),
            "expired_tasks": status_counts.get(TaskStatus.EXPIRED.value, 0),
            "average_completion_time": row.avg_time,
            "average_consensus_score": row.avg_consensus
        }
    
    @staticmethod
    async def delete(db: AsyncSession, task: Task) -> None:
        # Update project task count
        result = await db.execute(
            select(Project).where(Project.id == task.project_id)
        )
        project = result.scalar_one()
        project.total_tasks -= 1
        if task.status == TaskStatus.COMPLETED:
            project.completed_tasks -= 1
        
        await db.delete(task)
        await db.commit()