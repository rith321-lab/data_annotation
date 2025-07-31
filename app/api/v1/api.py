from fastapi import APIRouter

from app.api.v1.endpoints import auth, users, projects, tasks, webhooks, ai_suggestions, audit, organizations, teams

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(organizations.router, prefix="/organizations", tags=["organizations"])
api_router.include_router(teams.router, prefix="/teams", tags=["teams"])
api_router.include_router(projects.router, prefix="/projects", tags=["projects"])
api_router.include_router(tasks.router, tags=["tasks"])
api_router.include_router(webhooks.router, prefix="/webhooks", tags=["webhooks"])
api_router.include_router(ai_suggestions.router, prefix="/ai", tags=["ai"])
api_router.include_router(audit.router, prefix="/audit", tags=["audit"])