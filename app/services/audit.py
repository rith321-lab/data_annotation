"""
Audit trail and data versioning service
Tracks all changes and maintains version history
"""
from typing import Any, Dict, Optional, List
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from app.models.audit_trail import AuditTrail, DataVersion
from app.models.user import User
import json
from deepdiff import DeepDiff
import uuid

class AuditService:
    """Service for managing audit trails and data versioning"""
    
    def __init__(self, db: AsyncSession, current_user: User, request_metadata: Dict[str, Any] = None):
        self.db = db
        self.current_user = current_user
        self.request_metadata = request_metadata or {}
    
    async def log_action(
        self,
        entity_type: str,
        entity_id: str,
        action: str,
        old_values: Optional[Dict[str, Any]] = None,
        new_values: Optional[Dict[str, Any]] = None,
        metadata: Optional[Dict[str, Any]] = None
    ) -> AuditTrail:
        """
        Log an action in the audit trail
        
        Args:
            entity_type: Type of entity (e.g., 'task', 'response', 'project')
            entity_id: ID of the entity
            action: Action performed (e.g., 'create', 'update', 'delete')
            old_values: Previous state (for updates)
            new_values: New state
            metadata: Additional context
            
        Returns:
            Created audit trail entry
        """
        
        # Calculate changes diff if both old and new values provided
        changes = None
        if old_values and new_values:
            diff = DeepDiff(old_values, new_values, ignore_order=True)
            changes = diff.to_dict() if diff else {}
        
        # Get current version number
        version = await self._get_next_version_number(entity_type, entity_id)
        
        audit_entry = AuditTrail(
            entity_type=entity_type,
            entity_id=entity_id,
            action=action,
            user_id=self.current_user.id,
            changes=changes,
            old_values=old_values,
            new_values=new_values,
            ip_address=self.request_metadata.get('ip_address'),
            user_agent=self.request_metadata.get('user_agent'),
            session_id=self.request_metadata.get('session_id'),
            version=version,
            metadata_json=metadata
        )
        
        self.db.add(audit_entry)
        
        # Create version snapshot if it's a significant change
        if action in ['create', 'update', 'submit'] and new_values:
            await self._create_version(
                entity_type=entity_type,
                entity_id=entity_id,
                data=new_values,
                version_number=version,
                audit_trail_id=audit_entry.id,
                comment=metadata.get('comment') if metadata else None
            )
        
        await self.db.commit()
        return audit_entry
    
    async def _get_next_version_number(self, entity_type: str, entity_id: str) -> int:
        """Get the next version number for an entity"""
        result = await self.db.execute(
            select(DataVersion.version_number)
            .where(and_(
                DataVersion.entity_type == entity_type,
                DataVersion.entity_id == entity_id
            ))
            .order_by(DataVersion.version_number.desc())
            .limit(1)
        )
        current_version = result.scalar_one_or_none()
        return (current_version or 0) + 1
    
    async def _create_version(
        self,
        entity_type: str,
        entity_id: str,
        data: Dict[str, Any],
        version_number: int,
        audit_trail_id: str,
        comment: Optional[str] = None
    ) -> DataVersion:
        """Create a new version snapshot"""
        
        # Mark previous versions as not current
        await self.db.execute(
            select(DataVersion)
            .where(and_(
                DataVersion.entity_type == entity_type,
                DataVersion.entity_id == entity_id,
                DataVersion.is_current == True
            ))
            .execution_options(synchronize_session="fetch")
        )
        
        # Create new version
        version = DataVersion(
            entity_type=entity_type,
            entity_id=entity_id,
            version_number=version_number,
            data=data,
            created_by_id=self.current_user.id,
            comment=comment,
            is_current=True,
            audit_trail_id=audit_trail_id
        )
        
        self.db.add(version)
        return version
    
    async def get_audit_trail(
        self,
        entity_type: Optional[str] = None,
        entity_id: Optional[str] = None,
        user_id: Optional[str] = None,
        action: Optional[str] = None,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None,
        limit: int = 100,
        offset: int = 0
    ) -> List[AuditTrail]:
        """
        Retrieve audit trail entries with filters
        
        Args:
            entity_type: Filter by entity type
            entity_id: Filter by specific entity
            user_id: Filter by user who made changes
            action: Filter by action type
            start_date: Filter by date range start
            end_date: Filter by date range end
            limit: Maximum number of results
            offset: Pagination offset
            
        Returns:
            List of audit trail entries
        """
        
        query = select(AuditTrail).order_by(AuditTrail.timestamp.desc())
        
        # Apply filters
        conditions = []
        if entity_type:
            conditions.append(AuditTrail.entity_type == entity_type)
        if entity_id:
            conditions.append(AuditTrail.entity_id == entity_id)
        if user_id:
            conditions.append(AuditTrail.user_id == user_id)
        if action:
            conditions.append(AuditTrail.action == action)
        if start_date:
            conditions.append(AuditTrail.timestamp >= start_date)
        if end_date:
            conditions.append(AuditTrail.timestamp <= end_date)
        
        if conditions:
            query = query.where(and_(*conditions))
        
        query = query.limit(limit).offset(offset)
        
        result = await self.db.execute(query)
        return result.scalars().all()
    
    async def get_version_history(
        self,
        entity_type: str,
        entity_id: str
    ) -> List[DataVersion]:
        """Get all versions of an entity"""
        
        result = await self.db.execute(
            select(DataVersion)
            .where(and_(
                DataVersion.entity_type == entity_type,
                DataVersion.entity_id == entity_id
            ))
            .order_by(DataVersion.version_number.desc())
        )
        
        return result.scalars().all()
    
    async def get_version(
        self,
        entity_type: str,
        entity_id: str,
        version_number: int
    ) -> Optional[DataVersion]:
        """Get a specific version of an entity"""
        
        result = await self.db.execute(
            select(DataVersion)
            .where(and_(
                DataVersion.entity_type == entity_type,
                DataVersion.entity_id == entity_id,
                DataVersion.version_number == version_number
            ))
        )
        
        return result.scalar_one_or_none()
    
    async def revert_to_version(
        self,
        entity_type: str,
        entity_id: str,
        version_number: int,
        reason: str
    ) -> DataVersion:
        """Revert an entity to a previous version"""
        
        # Get the version to revert to
        old_version = await self.get_version(entity_type, entity_id, version_number)
        if not old_version:
            raise ValueError(f"Version {version_number} not found")
        
        # Log the revert action
        await self.log_action(
            entity_type=entity_type,
            entity_id=entity_id,
            action='revert',
            new_values=old_version.data,
            metadata={
                'reason': reason,
                'reverted_to_version': version_number
            }
        )
        
        return old_version
    
    async def compare_versions(
        self,
        entity_type: str,
        entity_id: str,
        version1: int,
        version2: int
    ) -> Dict[str, Any]:
        """Compare two versions of an entity"""
        
        v1 = await self.get_version(entity_type, entity_id, version1)
        v2 = await self.get_version(entity_type, entity_id, version2)
        
        if not v1 or not v2:
            raise ValueError("One or both versions not found")
        
        diff = DeepDiff(v1.data, v2.data, ignore_order=True)
        
        return {
            'version1': {
                'number': v1.version_number,
                'created_at': v1.created_at.isoformat(),
                'created_by': v1.created_by.username
            },
            'version2': {
                'number': v2.version_number,
                'created_at': v2.created_at.isoformat(),
                'created_by': v2.created_by.username
            },
            'differences': diff.to_dict() if diff else {}
        }

# Helper function to create audit service instance
async def get_audit_service(
    db: AsyncSession,
    current_user: User,
    request_metadata: Optional[Dict[str, Any]] = None
) -> AuditService:
    """Create an audit service instance"""
    return AuditService(db, current_user, request_metadata)