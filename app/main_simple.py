from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import List, Optional
import os
from dotenv import load_dotenv
import asyncpg
import asyncio
from datetime import datetime, timedelta
import jwt
from passlib.context import CryptContext
import uuid

# Load environment variables
load_dotenv()

# Security
SECRET_KEY = os.getenv("SECRET_KEY", "demo-secret-key-change-this-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Database
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://localhost/verita_ai")
# Remove +asyncpg suffix if present (asyncpg doesn't need it)
if "+asyncpg" in DATABASE_URL:
    DATABASE_URL = DATABASE_URL.replace("+asyncpg", "")

# Initialize FastAPI
app = FastAPI(
    title="Verita AI",
    version="1.0.0",
    description="Data Annotation Platform API",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000", 
        "http://localhost:3001", 
        "http://localhost:3002"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

# Pydantic models
class UserCreate(BaseModel):
    email: str
    password: str
    full_name: str

class UserLogin(BaseModel):
    username: str  # FastAPI OAuth2 expects 'username' field
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class User(BaseModel):
    id: str
    email: str
    full_name: str
    is_active: bool

class ProjectCreate(BaseModel):
    name: str
    description: str

class Project(BaseModel):
    id: str
    name: str
    description: str
    status: str
    created_at: datetime
    total_tasks: int = 0
    completed_tasks: int = 0

class TaskCreate(BaseModel):
    project_id: str
    data: dict
    instruction: str

class Task(BaseModel):
    id: str
    project_id: str
    data: dict
    instruction: str
    status: str
    created_at: datetime

# Database connection
async def get_db_connection():
    try:
        conn = await asyncpg.connect(DATABASE_URL)
        return conn
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database connection failed: {str(e)}")

# Authentication helpers
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except jwt.PyJWTError:
        raise credentials_exception
    
    conn = await get_db_connection()
    try:
        user = await conn.fetchrow("SELECT * FROM users WHERE email = $1", email)
        if user is None:
            raise credentials_exception
        return dict(user)
    finally:
        await conn.close()

# Initialize database tables
@app.on_event("startup")
async def startup_event():
    """Initialize database tables"""
    conn = await get_db_connection()
    try:
        # Create tables
        await conn.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                email VARCHAR UNIQUE NOT NULL,
                hashed_password VARCHAR NOT NULL,
                full_name VARCHAR NOT NULL,
                is_active BOOLEAN DEFAULT true,
                is_superuser BOOLEAN DEFAULT false,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        await conn.execute('''
            CREATE TABLE IF NOT EXISTS projects (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                name VARCHAR NOT NULL,
                description TEXT,
                status VARCHAR DEFAULT 'draft',
                owner_id UUID REFERENCES users(id),
                total_tasks INTEGER DEFAULT 0,
                completed_tasks INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        await conn.execute('''
            CREATE TABLE IF NOT EXISTS tasks (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                project_id UUID REFERENCES projects(id),
                data JSONB NOT NULL,
                instruction TEXT,
                status VARCHAR DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Create demo users if they don't exist
        demo_users = [
            ("admin@demo.com", "demo123", "Admin User", True),
            ("annotator@demo.com", "demo123", "Annotator User", False),
            ("client@demo.com", "demo123", "Client User", False),
        ]
        
        for email, password, name, is_superuser in demo_users:
            existing = await conn.fetchrow("SELECT id FROM users WHERE email = $1", email)
            if not existing:
                hashed_password = get_password_hash(password)
                await conn.execute(
                    "INSERT INTO users (email, hashed_password, full_name, is_superuser) VALUES ($1, $2, $3, $4)",
                    email, hashed_password, name, is_superuser
                )
        
        # Create demo projects
        admin_user = await conn.fetchrow("SELECT id FROM users WHERE email = 'admin@demo.com'")
        if admin_user:
            demo_projects = [
                ("E-commerce Product Classification", "Classify product images into categories", "active", 1000, 750),
                ("Medical Image Annotation", "Annotate medical images for ML training", "active", 500, 320),
                ("Text Sentiment Analysis", "Label text data for sentiment analysis", "paused", 2000, 1200),
            ]
            
            for name, desc, status, total, completed in demo_projects:
                existing = await conn.fetchrow("SELECT id FROM projects WHERE name = $1", name)
                if not existing:
                    await conn.execute(
                        "INSERT INTO projects (name, description, status, owner_id, total_tasks, completed_tasks) VALUES ($1, $2, $3, $4, $5, $6)",
                        name, desc, status, admin_user['id'], total, completed
                    )
        
        print("✅ Database initialized successfully!")
        
    except Exception as e:
        print(f"❌ Database initialization failed: {e}")
    finally:
        await conn.close()

# Routes
@app.get("/")
async def root():
    return {
        "message": "Welcome to Verita AI API",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# Authentication endpoints
@app.post("/api/v1/auth/register", response_model=Token)
async def register(user: UserCreate):
    conn = await get_db_connection()
    try:
        # Check if user exists
        existing = await conn.fetchrow("SELECT id FROM users WHERE email = $1", user.email)
        if existing:
            raise HTTPException(status_code=400, detail="Email already registered")
        
        # Create user
        hashed_password = get_password_hash(user.password)
        user_id = await conn.fetchval(
            "INSERT INTO users (email, hashed_password, full_name) VALUES ($1, $2, $3) RETURNING id",
            user.email, hashed_password, user.full_name
        )
        
        # Create token
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user.email}, expires_delta=access_token_expires
        )
        return {"access_token": access_token, "token_type": "bearer"}
        
    finally:
        await conn.close()

@app.post("/api/v1/auth/login", response_model=Token)
async def login(form_data: UserLogin):
    conn = await get_db_connection()
    try:
        user = await conn.fetchrow("SELECT * FROM users WHERE email = $1", form_data.username)
        if not user or not verify_password(form_data.password, user['hashed_password']):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user['email']}, expires_delta=access_token_expires
        )
        return {"access_token": access_token, "token_type": "bearer"}
        
    finally:
        await conn.close()

@app.get("/api/v1/auth/me", response_model=User)
async def read_users_me(current_user: dict = Depends(get_current_user)):
    return User(
        id=str(current_user['id']),
        email=current_user['email'],
        full_name=current_user['full_name'],
        is_active=current_user['is_active']
    )

# Project endpoints
@app.get("/api/v1/projects", response_model=List[Project])
async def get_projects(current_user: dict = Depends(get_current_user)):
    conn = await get_db_connection()
    try:
        projects = await conn.fetch("SELECT * FROM projects ORDER BY created_at DESC")
        return [
            Project(
                id=str(p['id']),
                name=p['name'],
                description=p['description'],
                status=p['status'],
                created_at=p['created_at'],
                total_tasks=p['total_tasks'],
                completed_tasks=p['completed_tasks']
            ) for p in projects
        ]
    finally:
        await conn.close()

@app.post("/api/v1/projects", response_model=Project)
async def create_project(project: ProjectCreate, current_user: dict = Depends(get_current_user)):
    conn = await get_db_connection()
    try:
        project_id = await conn.fetchval(
            "INSERT INTO projects (name, description, owner_id) VALUES ($1, $2, $3) RETURNING id",
            project.name, project.description, current_user['id']
        )
        
        # Fetch the created project
        new_project = await conn.fetchrow("SELECT * FROM projects WHERE id = $1", project_id)
        return Project(
            id=str(new_project['id']),
            name=new_project['name'],
            description=new_project['description'],
            status=new_project['status'],
            created_at=new_project['created_at'],
            total_tasks=new_project['total_tasks'],
            completed_tasks=new_project['completed_tasks']
        )
    finally:
        await conn.close()

@app.get("/api/v1/projects/{project_id}", response_model=Project)
async def get_project(project_id: str, current_user: dict = Depends(get_current_user)):
    conn = await get_db_connection()
    try:
        project = await conn.fetchrow("SELECT * FROM projects WHERE id = $1", project_id)
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
        
        return Project(
            id=str(project['id']),
            name=project['name'],
            description=project['description'],
            status=project['status'],
            created_at=project['created_at'],
            total_tasks=project['total_tasks'],
            completed_tasks=project['completed_tasks']
        )
    finally:
        await conn.close()

@app.post("/api/v1/projects/{project_id}/launch")
async def launch_project(project_id: str, current_user: dict = Depends(get_current_user)):
    conn = await get_db_connection()
    try:
        await conn.execute("UPDATE projects SET status = 'active' WHERE id = $1", project_id)
        return {"message": "Project launched successfully"}
    finally:
        await conn.close()

@app.post("/api/v1/projects/{project_id}/pause")
async def pause_project(project_id: str, current_user: dict = Depends(get_current_user)):
    conn = await get_db_connection()
    try:
        await conn.execute("UPDATE projects SET status = 'paused' WHERE id = $1", project_id)
        return {"message": "Project paused successfully"}
    finally:
        await conn.close()

# Task endpoints
@app.get("/api/v1/projects/{project_id}/tasks", response_model=List[Task])
async def get_project_tasks(project_id: str, current_user: dict = Depends(get_current_user)):
    conn = await get_db_connection()
    try:
        tasks = await conn.fetch("SELECT * FROM tasks WHERE project_id = $1 ORDER BY created_at DESC", project_id)
        return [
            Task(
                id=str(t['id']),
                project_id=str(t['project_id']),
                data=t['data'],
                instruction=t['instruction'],
                status=t['status'],
                created_at=t['created_at']
            ) for t in tasks
        ]
    finally:
        await conn.close()

@app.post("/api/v1/projects/{project_id}/tasks", response_model=Task)
async def create_task(project_id: str, task: TaskCreate, current_user: dict = Depends(get_current_user)):
    conn = await get_db_connection()
    try:
        task_id = await conn.fetchval(
            "INSERT INTO tasks (project_id, data, instruction) VALUES ($1, $2, $3) RETURNING id",
            project_id, task.data, task.instruction
        )
        
        # Update project task count
        await conn.execute("UPDATE projects SET total_tasks = total_tasks + 1 WHERE id = $1", project_id)
        
        # Fetch the created task
        new_task = await conn.fetchrow("SELECT * FROM tasks WHERE id = $1", task_id)
        return Task(
            id=str(new_task['id']),
            project_id=str(new_task['project_id']),
            data=new_task['data'],
            instruction=new_task['instruction'],
            status=new_task['status'],
            created_at=new_task['created_at']
        )
    finally:
        await conn.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)