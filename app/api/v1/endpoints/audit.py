"""
Audit trail and version history API endpoints
"""
from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.core import deps
from app.models.user import User
from app.models.audit_trail import AuditTrail, DataVersion
from app.services.audit import AuditService, get_audit_service
from pydantic import BaseModel, UUID4

router = APIRouter()

class AuditEntryResponse(BaseModel):
    id: UUID4
    entity_type: str
    entity_id: UUID4
    action: str
    user_id: UUID4
    user_name: str
    timestamp: datetime
    changes: Optional[dict] = None
    version: int
    metadata: Optional[dict] = None

class VersionResponse(BaseModel):
    id: UUID4
    entity_type: str
    entity_id: UUID4
    version_number: int
    created_at: datetime
    created_by_id: UUID4
    created_by_name: str
    comment: Optional[str] = None
    is_current: bool
    data: dict

class VersionComparisonResponse(BaseModel):
    version1: dict
    version2: dict
    differences: dict

@router.get("/trail", response_model=List[AuditEntryResponse])
async def get_audit_trail(
    entity_type: Optional[str] = Query(None, description="Filter by entity type"),
    entity_id: Optional[str] = Query(None, description="Filter by entity ID"),
    action: Optional[str] = Query(None, description="Filter by action"),
    user_id: Optional[str] = Query(None, description="Filter by user ID"),
    start_date: Optional[datetime] = Query(None, description="Start date for filtering"),
    end_date: Optional[datetime] = Query(None, description="End date for filtering"),
    limit: int = Query(100, description="Maximum number of results"),
    offset: int = Query(0, description="Pagination offset"),
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
):
    """
    Retrieve audit trail entries with optional filters
    """
    audit_service = await get_audit_service(db, current_user)
    
    entries = await audit_service.get_audit_trail(
        entity_type=entity_type,
        entity_id=entity_id,
        user_id=user_id,
        action=action,
        start_date=start_date,
        end_date=end_date,
        limit=limit,
        offset=offset
    )
    
    # Convert to response format
    response = []
    for entry in entries:
        response.append(AuditEntryResponse(
            id=entry.id,
            entity_type=entry.entity_type,
            entity_id=entry.entity_id,
            action=entry.action,
            user_id=entry.user_id,
            user_name=entry.user.username if entry.user else "Unknown",
            timestamp=entry.timestamp,
            changes=entry.changes,
            version=entry.version,
            metadata=entry.metadata_json
        ))
    
    return response

@router.get("/versions/{entity_type}/{entity_id}", response_model=List[VersionResponse])
async def get_version_history(
    entity_type: str,
    entity_id: str,
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
):
    """
    Get all versions of a specific entity
    """
    audit_service = await get_audit_service(db, current_user)
    
    versions = await audit_service.get_version_history(entity_type, entity_id)
    
    # Convert to response format
    response = []
    for version in versions:
        response.append(VersionResponse(
            id=version.id,
            entity_type=version.entity_type,
            entity_id=version.entity_id,
            version_number=version.version_number,
            created_at=version.created_at,
            created_by_id=version.created_by_id,
            created_by_name=version.created_by.username if version.created_by else "Unknown",
            comment=version.comment,
            is_current=version.is_current,
            data=version.data
        ))
    
    return response

@router.get("/versions/{entity_type}/{entity_id}/{version_number}", response_model=VersionResponse)
async def get_specific_version(
    entity_type: str,
    entity_id: str,
    version_number: int,
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
):
    """
    Get a specific version of an entity
    """
    audit_service = await get_audit_service(db, current_user)
    
    version = await audit_service.get_version(entity_type, entity_id, version_number)
    
    if not version:
        raise HTTPException(status_code=404, detail="Version not found")
    
    return VersionResponse(
        id=version.id,
        entity_type=version.entity_type,
        entity_id=version.entity_id,
        version_number=version.version_number,
        created_at=version.created_at,
        created_by_id=version.created_by_id,
        created_by_name=version.created_by.username if version.created_by else "Unknown",
        comment=version.comment,
        is_current=version.is_current,
        data=version.data
    )

@router.post("/versions/{entity_type}/{entity_id}/compare", response_model=VersionComparisonResponse)
async def compare_versions(
    entity_type: str,
    entity_id: str,
    version1: int = Query(..., description="First version number"),
    version2: int = Query(..., description="Second version number"),
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
):
    """
    Compare two versions of an entity
    """
    audit_service = await get_audit_service(db, current_user)
    
    try:
        comparison = await audit_service.compare_versions(
            entity_type, entity_id, version1, version2
        )
        return comparison
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

class RevertRequest(BaseModel):
    reason: str

@router.post("/versions/{entity_type}/{entity_id}/revert/{version_number}")
async def revert_to_version(
    entity_type: str,
    entity_id: str,
    version_number: int,
    request: RevertRequest,
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
):
    """
    Revert an entity to a previous version
    """
    audit_service = await get_audit_service(db, current_user)
    
    try:
        version = await audit_service.revert_to_version(
            entity_type, entity_id, version_number, request.reason
        )
        return {
            "message": f"Successfully reverted to version {version_number}",
            "version": version.version_number,
            "data": version.data
        }
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.get("/activity/recent")
async def get_recent_activity(
    limit: int = Query(50, description="Maximum number of results"),
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
):
    """
    Get recent activity across all entities
    """
    audit_service = await get_audit_service(db, current_user)
    
    # Get recent audit entries
    entries = await audit_service.get_audit_trail(limit=limit)
    
    # Format for activity feed
    activities = []
    for entry in entries:
        activity = {
            "id": str(entry.id),
            "type": entry.action,
            "entity_type": entry.entity_type,
            "entity_id": str(entry.entity_id),
            "user": {
                "id": str(entry.user_id),
                "name": entry.user.username if entry.user else "Unknown"
            },
            "timestamp": entry.timestamp.isoformat(),
            "description": f"{entry.user.username if entry.user else 'Someone'} {entry.action} {entry.entity_type}",
            "changes": entry.changes
        }
        activities.append(activity)
    
    return activities