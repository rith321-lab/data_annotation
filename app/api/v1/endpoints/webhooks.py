from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.session import get_db
from app.models.webhook import Webhook
from app.core.deps import get_current_user
from app.models.user import User
from pydantic import BaseModel, HttpUrl
from datetime import datetime
import httpx
import asyncio
import json

router = APIRouter()

class WebhookCreate(BaseModel):
    name: str
    url: HttpUrl
    events: List[str]  # ['task.completed', 'project.finished', 'worker.joined', etc.]
    headers: dict = {}
    active: bool = True

class WebhookUpdate(BaseModel):
    name: str = None
    url: HttpUrl = None
    events: List[str] = None
    headers: dict = None
    active: bool = None

class WebhookResponse(BaseModel):
    id: str
    name: str
    url: str
    events: List[str]
    headers: dict
    active: bool
    created_at: datetime
    last_triggered: datetime = None
    failure_count: int = 0

class WebhookTest(BaseModel):
    webhook_id: str
    test_payload: dict = None

@router.get("/webhooks", response_model=List[WebhookResponse])
async def list_webhooks(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    skip: int = 0,
    limit: int = 100
):
    """List all webhooks for the current user's organization"""
    result = await db.execute(
        select(Webhook)
        .where(Webhook.organization_id == current_user.organization_id)
        .offset(skip)
        .limit(limit)
    )
    webhooks = result.scalars().all()
    
    return [
        WebhookResponse(
            id=str(webhook.id),
            name=webhook.name,
            url=webhook.url,
            events=webhook.events,
            headers=webhook.headers or {},
            active=webhook.active,
            created_at=webhook.created_at,
            last_triggered=webhook.last_triggered,
            failure_count=webhook.failure_count
        )
        for webhook in webhooks
    ]

@router.post("/webhooks", response_model=WebhookResponse)
async def create_webhook(
    webhook_data: WebhookCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new webhook"""
    webhook = Webhook(
        name=webhook_data.name,
        url=str(webhook_data.url),
        events=webhook_data.events,
        headers=webhook_data.headers,
        active=webhook_data.active,
        organization_id=current_user.organization_id,
        created_by_id=current_user.id
    )
    
    db.add(webhook)
    await db.commit()
    await db.refresh(webhook)
    
    return WebhookResponse(
        id=str(webhook.id),
        name=webhook.name,
        url=webhook.url,
        events=webhook.events,
        headers=webhook.headers or {},
        active=webhook.active,
        created_at=webhook.created_at,
        failure_count=0
    )

@router.put("/webhooks/{webhook_id}", response_model=WebhookResponse)
async def update_webhook(
    webhook_id: str,
    webhook_update: WebhookUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update a webhook"""
    result = await db.execute(
        select(Webhook)
        .where(Webhook.id == webhook_id)
        .where(Webhook.organization_id == current_user.organization_id)
    )
    webhook = result.scalar_one_or_none()
    
    if not webhook:
        raise HTTPException(status_code=404, detail="Webhook not found")
    
    update_data = webhook_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        if value is not None:
            setattr(webhook, field, value)
    
    await db.commit()
    await db.refresh(webhook)
    
    return WebhookResponse(
        id=str(webhook.id),
        name=webhook.name,
        url=webhook.url,
        events=webhook.events,
        headers=webhook.headers or {},
        active=webhook.active,
        created_at=webhook.created_at,
        last_triggered=webhook.last_triggered,
        failure_count=webhook.failure_count
    )

@router.delete("/webhooks/{webhook_id}")
async def delete_webhook(
    webhook_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a webhook"""
    result = await db.execute(
        select(Webhook)
        .where(Webhook.id == webhook_id)
        .where(Webhook.organization_id == current_user.organization_id)
    )
    webhook = result.scalar_one_or_none()
    
    if not webhook:
        raise HTTPException(status_code=404, detail="Webhook not found")
    
    await db.delete(webhook)
    await db.commit()
    
    return {"message": "Webhook deleted successfully"}

@router.post("/webhooks/test")
async def test_webhook(
    test_data: WebhookTest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Test a webhook by sending a sample payload"""
    result = await db.execute(
        select(Webhook)
        .where(Webhook.id == test_data.webhook_id)
        .where(Webhook.organization_id == current_user.organization_id)
    )
    webhook = result.scalar_one_or_none()
    
    if not webhook:
        raise HTTPException(status_code=404, detail="Webhook not found")
    
    # Default test payload
    test_payload = test_data.test_payload or {
        "event": "webhook.test",
        "timestamp": datetime.utcnow().isoformat(),
        "data": {
            "message": "This is a test webhook from Verita AI",
            "webhook_id": str(webhook.id),
            "webhook_name": webhook.name
        }
    }
    
    # Send test webhook
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                webhook.url,
                json=test_payload,
                headers=webhook.headers or {},
                timeout=10.0
            )
            
            return {
                "success": response.is_success,
                "status_code": response.status_code,
                "response_body": response.text[:500] if response.text else None,
                "test_payload": test_payload
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "test_payload": test_payload
            }

# Webhook trigger function (to be called from other parts of the app)
async def trigger_webhooks(
    db: AsyncSession,
    organization_id: str,
    event: str,
    data: dict
):
    """Trigger all active webhooks for a specific event"""
    result = await db.execute(
        select(Webhook)
        .where(Webhook.organization_id == organization_id)
        .where(Webhook.active == True)
        .where(Webhook.events.contains([event]))
    )
    webhooks = result.scalars().all()
    
    if not webhooks:
        return
    
    payload = {
        "event": event,
        "timestamp": datetime.utcnow().isoformat(),
        "data": data
    }
    
    async def send_webhook(webhook: Webhook):
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(
                    webhook.url,
                    json=payload,
                    headers=webhook.headers or {},
                    timeout=10.0
                )
                
                if response.is_success:
                    webhook.last_triggered = datetime.utcnow()
                    webhook.failure_count = 0
                else:
                    webhook.failure_count += 1
                    if webhook.failure_count >= 5:
                        webhook.active = False  # Disable after 5 failures
                        
            except Exception as e:
                webhook.failure_count += 1
                if webhook.failure_count >= 5:
                    webhook.active = False
    
    # Send webhooks concurrently
    await asyncio.gather(*[send_webhook(webhook) for webhook in webhooks])
    await db.commit()