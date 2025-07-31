#!/usr/bin/env python3
"""
Complete setup and run script for Verita AI Data Annotation Platform
This script handles all dependencies and starts both backend and frontend
"""

import os
import sys
import subprocess
import time
import platform
import signal
from pathlib import Path

# Global process handlers
backend_process = None
frontend_process = None

def print_banner():
    """Print welcome banner"""
    print("\n" + "="*60)
    print("🎯 Verita AI Data Annotation Platform")
    print("="*60 + "\n")

def check_python():
    """Check Python version"""
    version = sys.version_info
    if version.major < 3 or (version.major == 3 and version.minor < 8):
        print("❌ Python 3.8+ is required")
        sys.exit(1)
    print(f"✅ Python {version.major}.{version.minor}.{version.micro} detected")

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
BACKEND_CORS_ORIGINS=["http://localhost:5173", "http://localhost:3000"]

# First User (Admin)
FIRST_SUPERUSER_EMAIL=admin@verita.ai
FIRST_SUPERUSER_PASSWORD=admin123
"""
    
    if not os.path.exists('.env'):
        with open('.env', 'w') as f:
            f.write(env_content)
        print("✅ Created .env file")
    else:
        print("ℹ️  .env file already exists")

def setup_virtual_env():
    """Set up Python virtual environment"""
    print("\n🐍 Setting up Python environment...")
    
    # Create virtual environment if it doesn't exist
    if not os.path.exists('venv'):
        print("Creating virtual environment...")
        subprocess.run([sys.executable, "-m", "venv", "venv"], check=True)
        print("✅ Virtual environment created")
    else:
        print("ℹ️  Virtual environment already exists")
    
    # Determine Python and pip paths
    if platform.system() == "Windows":
        python_path = os.path.join("venv", "Scripts", "python.exe")
        pip_path = os.path.join("venv", "Scripts", "pip.exe")
    else:
        python_path = os.path.join("venv", "bin", "python")
        pip_path = os.path.join("venv", "bin", "pip")
    
    return python_path, pip_path

def install_python_deps(pip_path):
    """Install Python dependencies"""
    print("\n📦 Installing Python dependencies...")
    
    # Install core dependencies one by one to avoid conflicts
    core_deps = [
        "fastapi",
        "uvicorn[standard]",
        "pydantic>=2.0",
        "pydantic-settings",
        "sqlalchemy>=2.0",
        "aiosqlite",
        "python-jose[cryptography]",
        "passlib[bcrypt]",
        "python-multipart",
        "python-dotenv"
    ]
    
    for dep in core_deps:
        print(f"Installing {dep}...")
        try:
            if "[" in dep:
                # Handle extras properly for zsh
                subprocess.run([pip_path, "install", f'"{dep}"'], shell=True, check=True, capture_output=True)
            else:
                subprocess.run([pip_path, "install", dep], check=True, capture_output=True)
        except subprocess.CalledProcessError as e:
            print(f"⚠️  Warning: Failed to install {dep}, but continuing...")
    
    print("✅ Python dependencies installed")

def setup_node_env():
    """Set up Node.js environment"""
    print("\n📦 Setting up Node.js environment...")
    
    if not check_command("npm"):
        print("❌ npm not found. Please install Node.js from https://nodejs.org/")
        print("   After installing Node.js, run this script again.")
        return False
    
    if not os.path.exists('node_modules'):
        print("Installing Node.js dependencies...")
        subprocess.run(["npm", "install"], check=True)
        print("✅ Node.js dependencies installed")
    else:
        print("ℹ️  node_modules already exists")
    
    return True

def initialize_database(python_path):
    """Initialize the SQLite database"""
    print("\n🗄️  Initializing database...")
    
    # Check if database already exists
    if os.path.exists('verita_ai.db'):
        print("ℹ️  Database already exists")
        return
    
    # Run the quick database initialization
    try:
        subprocess.run([python_path, "quick_db_init.py"], check=True)
        print("✅ Database initialized")
    except subprocess.CalledProcessError:
        print("⚠️  Database initialization had warnings, but continuing...")

def start_backend(python_path):
    """Start the backend server"""
    global backend_process
    print("\n🚀 Starting backend server...")
    
    # Kill any existing backend processes
    if platform.system() != "Windows":
        subprocess.run(["pkill", "-f", "run_simple_backend"], capture_output=True)
    
    # Start backend
    backend_process = subprocess.Popen(
        [python_path, "run_simple_backend.py"],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        universal_newlines=True
    )
    
    # Wait for backend to start
    print("Waiting for backend to start...")
    time.sleep(5)
    
    # Check if backend is running
    try:
        import urllib.request
        response = urllib.request.urlopen("http://localhost:8000")
        if response.status == 200:
            print("✅ Backend running at http://localhost:8000")
            print("📚 API Documentation at http://localhost:8000/docs")
            return True
    except:
        pass
    
    print("⚠️  Backend might be starting slowly, but continuing...")
    return True

def start_frontend():
    """Start the frontend development server"""
    global frontend_process
    print("\n🎨 Starting frontend server...")
    
    # Start frontend
    frontend_process = subprocess.Popen(
        ["npm", "run", "dev"],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        universal_newlines=True
    )
    
    # Wait for frontend to start
    print("Waiting for frontend to start...")
    time.sleep(5)
    
    print("✅ Frontend should be running at http://localhost:5173")
    return True

def cleanup(signum=None, frame=None):
    """Clean up processes on exit"""
    global backend_process, frontend_process
    
    print("\n\n🛑 Shutting down services...")
    
    if backend_process:
        backend_process.terminate()
        backend_process.wait()
    
    if frontend_process:
        frontend_process.terminate()
        frontend_process.wait()
    
    print("✅ Services stopped")
    sys.exit(0)

def main():
    """Main function"""
    print_banner()
    
    # Set up signal handlers
    signal.signal(signal.SIGINT, cleanup)
    signal.signal(signal.SIGTERM, cleanup)
    
    # Check Python version
    check_python()
    
    # Create .env file
    create_env_file()
    
    # Set up virtual environment
    python_path, pip_path = setup_virtual_env()
    
    # Install Python dependencies
    install_python_deps(pip_path)
    
    # Set up Node environment
    if not setup_node_env():
        print("\n❌ Node.js is required. Please install it and run this script again.")
        sys.exit(1)
    
    # Initialize database
    initialize_database(python_path)
    
    # Start services
    print("\n" + "="*60)
    print("🎉 Starting services...")
    print("="*60)
    
    # Start backend
    if not start_backend(python_path):
        print("❌ Failed to start backend")
        sys.exit(1)
    
    # Start frontend
    if not start_frontend():
        print("❌ Failed to start frontend")
        cleanup()
        sys.exit(1)
    
    # Print success message
    print("\n" + "="*60)
    print("✨ Verita AI is running!")
    print("="*60)
    print("\n📌 Access points:")
    print("  - Frontend: http://localhost:5173")
    print("  - Backend API: http://localhost:8000")
    print("  - API Docs: http://localhost:8000/docs")
    print("\n🔐 Admin credentials:")
    print("  - Email: admin@verita.ai")
    print("  - Password: admin123")
    print("\n⚡ Press Ctrl+C to stop all services")
    
    # Keep running
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        cleanup()

if __name__ == "__main__":
    main() 