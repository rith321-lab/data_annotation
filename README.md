# Verita AI Backend

A powerful, scalable backend for human-in-the-loop data labeling and annotation, designed to compete with Surge AI. Built with FastAPI, PostgreSQL, and modern Python technologies.

## Features

### Core Functionality
- **Project Management**: Create and manage data labeling projects with customizable workflows
- **Task Management**: Bulk upload tasks via API or CSV, with support for batching and prioritization
- **Flexible Question Types**: 
  - Free response text
  - Multiple choice
  - Checkbox (multi-select)
  - Likert scales
  - Ranking/ordering
  - Text tagging/NER
  - Tree selection
  - File uploads
  - Interactive chatbots
  - Image/video/audio annotation
- **Quality Control**:
  - Gold standard tasks for accuracy measurement
  - Multi-worker consensus mechanisms
  - Tiebreaker support for disagreements
  - Worker performance tracking
- **Workforce Management**:
  - Internal, external, and crowdsourced workers
  - Team-based access control
  - Qualification requirements
  - Performance-based routing

### Technical Features
- **Authentication**: JWT-based auth with refresh tokens and API key support
- **Real-time Updates**: Webhook support for project events
- **Scalability**: Async architecture with Celery for background tasks
- **Monitoring**: Prometheus metrics and Sentry error tracking
- **Multi-tenancy**: Organization-based isolation
- **Billing**: Stripe integration for payments

## Tech Stack

- **Framework**: FastAPI (Python 3.11+)
- **Database**: PostgreSQL with AsyncPG
- **ORM**: SQLAlchemy 2.0 with async support
- **Authentication**: JWT (python-jose)
- **Task Queue**: Celery with Redis
- **File Storage**: AWS S3
- **Payments**: Stripe
- **Monitoring**: Prometheus + Sentry
- **Email**: SendGrid
- **SMS**: Twilio

## Installation

### Prerequisites
- Python 3.11+
- PostgreSQL 14+
- Redis 6+
- AWS S3 bucket (for file storage)

### Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd verita-ai-backend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Copy environment variables:
```bash
cp .env.example .env
```

5. Configure your `.env` file with your database credentials and other settings.

6. Create the database:
```bash
createdb verita_ai
```

7. Run migrations:
```bash
alembic upgrade head
```

8. Start the development server:
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## API Documentation

Once the server is running, you can access:
- Interactive API docs: http://localhost:8000/api/v1/docs
- Alternative API docs: http://localhost:8000/api/v1/redoc
- OpenAPI schema: http://localhost:8000/api/v1/openapi.json

## Project Structure

```
verita-ai-backend/
├── app/
│   ├── api/           # API endpoints
│   ├── core/          # Core functionality (config, security, deps)
│   ├── db/            # Database configuration
│   ├── models/        # SQLAlchemy models
│   ├── schemas/       # Pydantic schemas
│   ├── services/      # Business logic
│   └── main.py        # FastAPI app entry point
├── migrations/        # Alembic migrations
├── tests/            # Test suite
├── scripts/          # Utility scripts
└── requirements.txt  # Python dependencies
```

## Key API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login (returns JWT tokens)
- `POST /api/v1/auth/refresh` - Refresh access token

### Projects
- `GET /api/v1/projects` - List projects
- `POST /api/v1/projects` - Create project
- `GET /api/v1/projects/{id}` - Get project details
- `PUT /api/v1/projects/{id}` - Update project
- `DELETE /api/v1/projects/{id}` - Delete project
- `POST /api/v1/projects/{id}/launch` - Launch project
- `POST /api/v1/projects/{id}/pause` - Pause project
- `POST /api/v1/projects/{id}/questions` - Add questions

### Tasks
- `GET /api/v1/projects/{id}/tasks` - List project tasks
- `POST /api/v1/projects/{id}/tasks` - Create single task
- `POST /api/v1/projects/{id}/tasks/bulk` - Create multiple tasks
- `POST /api/v1/projects/{id}/tasks/csv` - Upload tasks via CSV
- `GET /api/v1/tasks/{id}` - Get task details
- `PUT /api/v1/tasks/{id}` - Update task
- `DELETE /api/v1/tasks/{id}` - Delete task

## Development

### Running Tests
```bash
pytest
```

### Code Formatting
```bash
black app/
flake8 app/
mypy app/
```

### Database Migrations
```bash
# Create a new migration
alembic revision --autogenerate -m "Description"

# Apply migrations
alembic upgrade head

# Rollback
alembic downgrade -1
```

## Deployment

### Docker
```bash
docker build -t verita-ai-backend .
docker run -p 8000:8000 --env-file .env verita-ai-backend
```

### Production Considerations
1. Use a production ASGI server (Gunicorn with Uvicorn workers)
2. Set up a reverse proxy (Nginx)
3. Configure SSL/TLS certificates
4. Set up monitoring and logging
5. Configure automatic backups
6. Use a CDN for static assets
7. Set up rate limiting and DDoS protection

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

Proprietary - All rights reserved by Verita AI

## Support

For support, email support@verita.ai