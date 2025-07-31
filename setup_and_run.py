#!/usr/bin/env python3
"""
Setup and run script for Verita AI Data Annotation Platform
This script will help you set up and run both backend and frontend
"""

import os
import sys
import subprocess
import time
import json
from pathlib import Path

def check_command(command):
    """Check if a command is available"""
    try:
        subprocess.run([command, "--version"], capture_output=True, check=True)
        return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        return False

def create_env_file():
    """Create .env file if it doesn't exist"""
    env_content = """# API Settings
API_V1_STR=/api/v1
PROJECT_NAME=Verita AI
VERSION=1.0.0
DEBUG=True

# Database - Using SQLite for simplicity
DATABASE_URL=sqlite+aiosqlite:///./verita_ai.db
SYNC_DATABASE_URL=sqlite:///./verita_ai.db

# Security
SECRET_KEY=your-secret-key-here-change-this-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# Redis (optional for local development)
REDIS_URL=redis://localhost:6379/0

# CORS
BACKEND_CORS_ORIGINS=["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173", "http://127.0.0.1:3000"]

# First User (Admin)
FIRST_SUPERUSER_EMAIL=admin@verita.ai
FIRST_SUPERUSER_PASSWORD=admin123

# Rate Limiting
RATE_LIMIT_PER_MINUTE=60

# Worker Settings
MAX_WORKERS_PER_TASK=3
CONSENSUS_THRESHOLD=0.75
GOLD_STANDARD_PERCENTAGE=10
"""
    
    if not os.path.exists('.env'):
        with open('.env', 'w') as f:
            f.write(env_content)
        print("✅ Created .env file")
    else:
        print("ℹ️  .env file already exists")

def setup_python_env():
    """Set up Python environment"""
    print("\n🐍 Setting up Python environment...")
    
    # Check if virtual environment exists
    if not os.path.exists('venv'):
        print("Creating virtual environment...")
        subprocess.run([sys.executable, "-m", "venv", "venv"], check=True)
    
    # Determine pip path
    pip_path = "venv/bin/pip" if os.name != 'nt' else "venv\\Scripts\\pip"
    
    # Install requirements
    print("Installing Python dependencies...")
    subprocess.run([pip_path, "install", "-r", "requirements.txt"], check=True)
    
    # Install additional SQLite support
    subprocess.run([pip_path, "install", "aiosqlite"], check=True)
    
    print("✅ Python environment ready")

def setup_node_env():
    """Set up Node.js environment"""
    print("\n📦 Setting up Node.js environment...")
    
    if not check_command("npm"):
        print("❌ npm not found. Please install Node.js first.")
        print("Visit: https://nodejs.org/")
        return False
    
    if not os.path.exists('node_modules'):
        print("Installing Node.js dependencies...")
        subprocess.run(["npm", "install"], check=True)
    else:
        print("ℹ️  node_modules already exists")
    
    print("✅ Node.js environment ready")
    return True

def initialize_database():
    """Initialize the database"""
    print("\n🗄️  Initializing database...")
    
    # Run the simple database initialization
    python_path = "venv/bin/python" if os.name != 'nt' else "venv\\Scripts\\python"
    subprocess.run([python_path, "simple_db_init.py"], check=True)
    
    print("✅ Database initialized")

def start_backend():
    """Start the backend server"""
    print("\n🚀 Starting backend server...")
    python_path = "venv/bin/python" if os.name != 'nt' else "venv\\Scripts\\python"
    
    # Start backend in a subprocess
    backend_process = subprocess.Popen(
        [python_path, "run_backend.py"],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        universal_newlines=True
    )
    
    # Wait for backend to start
    time.sleep(3)
    
    print("✅ Backend running at http://localhost:8000")
    print("📚 API Documentation at http://localhost:8000/docs")
    
    return backend_process

def start_frontend():
    """Start the frontend development server"""
    print("\n🎨 Starting frontend server...")
    
    # Start frontend in a subprocess
    frontend_process = subprocess.Popen(
        ["npm", "run", "dev"],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        universal_newlines=True
    )
    
    # Wait for frontend to start
    time.sleep(5)
    
    print("✅ Frontend running at http://localhost:5173")
    
    return frontend_process

def main():
    """Main setup and run function"""
    print("🎯 Verita AI Data Annotation Platform Setup")
    print("=" * 50)
    
    # Create .env file
    create_env_file()
    
    # Setup Python environment
    setup_python_env()
    
    # Setup Node environment
    if not setup_node_env():
        sys.exit(1)
    
    # Initialize database
    initialize_database()
    
    print("\n" + "=" * 50)
    print("🎉 Setup complete! Starting services...")
    print("=" * 50)
    
    # Start backend
    backend_process = start_backend()
    
    # Start frontend
    frontend_process = start_frontend()
    
    print("\n" + "=" * 50)
    print("✨ Verita AI is running!")
    print("=" * 50)
    print("\n📌 Access points:")
    print("  - Frontend: http://localhost:5173")
    print("  - Backend API: http://localhost:8000")
    print("  - API Docs: http://localhost:8000/docs")
    print("\n🔐 Admin credentials:")
    print("  - Email: admin@verita.ai")
    print("  - Password: admin123")
    print("\n⚡ Press Ctrl+C to stop all services")
    
    try:
        # Keep the script running
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n\n🛑 Shutting down services...")
        backend_process.terminate()
        frontend_process.terminate()
        print("✅ Services stopped")

if __name__ == "__main__":
    main() 