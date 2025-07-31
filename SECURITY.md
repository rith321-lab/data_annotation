# Security Guide

## 🔐 Before Deployment

### 1. Update Environment Variables
Before deploying to production, **ALWAYS** update these critical values in your `.env` file:

```bash
# Generate a new secret key (use `openssl rand -hex 32`)
SECRET_KEY=your-secure-secret-key-here

# Change the default superuser password
FIRST_SUPERUSER_PASSWORD=your-secure-password-here

# Update database credentials
DATABASE_URL=postgresql+asyncpg://your-user:your-password@your-host:5432/your-database
```

### 2. Generate Secure Secret Key
```bash
# Generate a secure secret key
openssl rand -hex 32
```

### 3. Environment Files
- ✅ `.env` - Contains your actual secrets (NEVER commit this)
- ✅ `.env.example` - Template file (safe to commit)
- ✅ All environment files are in `.gitignore`

### 4. Database Security
- Use strong passwords for database users
- Restrict database access to necessary IPs only
- Use SSL connections in production

### 5. Production Checklist
- [ ] Changed SECRET_KEY from default
- [ ] Changed FIRST_SUPERUSER_PASSWORD from "changethis"
- [ ] Updated database credentials
- [ ] Set DEBUG=False in production
- [ ] Configure proper CORS origins
- [ ] Use HTTPS in production
- [ ] Update AWS/API keys if using external services

## 🚨 Default Values to Change
These default values in your `.env` MUST be changed:
- `SECRET_KEY` - Used for JWT token signing
- `FIRST_SUPERUSER_PASSWORD=changethis` - Admin account password
- `AWS_ACCESS_KEY_ID=your-access-key` - Replace with real keys or remove
- Any placeholder values ending in `-key` or `your-*`

## 🛡️ Security Features Implemented
- JWT token authentication
- Password hashing with bcrypt
- Role-based access control (RBAC)
- Organization-based data isolation
- API key authentication for webhooks
- Input validation with Pydantic
- SQL injection protection via SQLAlchemy ORM 