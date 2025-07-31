# Verita AI - Quick Start Guide

## Prerequisites

1. **Python 3.8+** - Check with `python3 --version`
2. **Node.js 16+** - Download from [nodejs.org](https://nodejs.org/)
3. **Git** - For cloning the repository

## Quick Start

### Option 1: One-Command Setup (Recommended)

Simply run:

```bash
python3 start_verita_ai.py
```

This script will:
- ✅ Create a Python virtual environment
- ✅ Install all Python dependencies
- ✅ Install all Node.js dependencies
- ✅ Initialize the SQLite database
- ✅ Start the backend server
- ✅ Start the frontend development server

### Option 2: Manual Setup

If you prefer to run steps manually:

1. **Create and activate virtual environment:**
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. **Install Python dependencies:**
   ```bash
   pip install fastapi uvicorn[standard] pydantic pydantic-settings sqlalchemy aiosqlite
   pip install python-jose[cryptography] passlib[bcrypt] python-multipart python-dotenv
   ```

3. **Install Node.js dependencies:**
   ```bash
   npm install
   ```

4. **Initialize the database:**
   ```bash
   python quick_db_init.py
   ```

5. **Start the backend:**
   ```bash
   python run_simple_backend.py
   ```

6. **Start the frontend (in a new terminal):**
   ```bash
   npm run dev
   ```

## Access Points

Once running, you can access:

- 🎨 **Frontend**: http://localhost:5173
- 🚀 **Backend API**: http://localhost:8000
- 📚 **API Documentation**: http://localhost:8000/docs

## Default Credentials

- **Email**: admin@verita.ai
- **Password**: admin123

## Troubleshooting

### Port Already in Use
If you get a "port already in use" error:
```bash
# Kill processes on port 8000 (backend)
lsof -ti:8000 | xargs kill -9

# Kill processes on port 5173 (frontend)
lsof -ti:5173 | xargs kill -9
```

### Python Dependencies Issues
If you encounter issues with Python dependencies:
```bash
# Use the minimal requirements file
pip install -r requirements-minimal.txt
```

### Database Issues
If you need to reset the database:
```bash
rm verita_ai.db
python quick_db_init.py
```

## Stopping the Application

Press `Ctrl+C` in the terminal where you ran the start script to stop all services.

## Features

This is a data annotation platform with:
- 📊 Project management
- 📝 Task creation and assignment
- 👥 User management
- 🔐 JWT-based authentication
- 📱 Responsive UI
- 🚀 Real-time updates

## Development

The codebase is organized as:
- `app/` - Backend FastAPI application
- `src/` - Frontend React application
- `verita_ai.db` - SQLite database (created on first run)

Happy coding! 🎉 