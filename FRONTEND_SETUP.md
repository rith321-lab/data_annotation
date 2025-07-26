# Verita AI Frontend Setup

The frontend has been successfully set up and connected to the backend!

## 🚀 Quick Start

### Prerequisites
- Backend API running at http://localhost:8000
- Node.js 18+ installed

### Running the Application

1. **Start the Backend** (if not already running):
```bash
cd /Users/rishi/verita-ai-backend
source venv/bin/activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

2. **Start the Frontend**:
```bash
cd /Users/rishi/verita-ai-backend
npm run dev
```

3. **Access the Application**:
- Frontend: http://localhost:3000
- Backend API Docs: http://localhost:8000/api/v1/docs

## 📱 Features Implemented

### ✅ Authentication System
- Login page with JWT authentication
- Registration page for new users
- Automatic token refresh
- Protected routes

### ✅ Project Management
- Projects listing page
- Project creation
- Project status management (launch, pause, resume)
- Progress tracking

### ✅ Navigation
- Responsive sidebar with collapsible design
- User profile display
- Quick access to main features

## 🔧 Architecture

### Frontend Stack
- **React 18** with TypeScript
- **Vite** for fast development
- **TailwindCSS** for styling
- **Zustand** for state management
- **React Query** for server state
- **React Router** for navigation
- **React Hook Form** with Zod validation

### API Integration
- Centralized API client (`src/api/client.ts`)
- Automatic token management
- Request/response interceptors
- Type-safe API calls

### State Management
- **Auth Store**: User authentication state
- **Project Store**: Projects data and operations
- Persistent token storage

## 🎨 UI Components
- Reused Surge AI Dashboard components
- Shadcn/ui component library
- Purple gradient theme matching Surge AI

## 📝 Default Credentials
For testing, you can register a new account or use:
- Email: test@verita.ai
- Password: TestPassword123!

## 🛠️ Next Steps

1. **Complete Task Management UI**
   - Task listing and filtering
   - Task assignment workflow
   - Response collection interface

2. **Implement Question Types**
   - Multiple choice
   - Text input
   - Image annotation
   - etc.

3. **Add Worker Dashboard**
   - Task queue
   - Earnings tracking
   - Performance metrics

4. **Analytics Dashboard**
   - Project statistics
   - Worker performance
   - Quality metrics

## 🐛 Troubleshooting

### CORS Issues
Make sure the backend `.env` file has:
```
BACKEND_CORS_ORIGINS=http://localhost:3000,http://localhost:8000
```

### Authentication Errors
- Check if the backend is running
- Verify the API URL in `vite.config.ts`
- Clear browser localStorage if needed

### Database Issues
- Ensure PostgreSQL is running
- Database `verita_ai` exists
- Run migrations if needed

## 📚 File Structure
```
/Users/rishi/verita-ai-backend/
├── src/
│   ├── api/          # API client
│   ├── components/   # React components
│   ├── layouts/      # Page layouts
│   ├── pages/        # Route pages
│   ├── stores/       # Zustand stores
│   └── styles/       # Global styles
├── app/              # Backend Python code
├── vite.config.ts    # Vite configuration
└── package.json      # Frontend dependencies
```