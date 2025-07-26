# Verita AI Debug & QA Agents

A collection of specialized debugging and QA agents for the Verita AI platform. Each agent has specific responsibilities and expertise.

## 🤖 Available Agents

### 1. Frontend Debug Agent (`frontend_debug_agent.py`)
- Specializes in React/TypeScript issues
- Checks component rendering problems
- Validates imports and dependencies
- Monitors browser console errors

### 2. Backend API Agent (`backend_api_agent.py`)
- Tests API endpoints
- Validates request/response formats
- Checks authentication flows
- Monitors database queries

### 3. Integration Test Agent (`integration_test_agent.py`)
- Tests frontend-backend communication
- Validates CORS settings
- Checks token refresh mechanisms
- Tests data flow end-to-end

### 4. Performance Monitor Agent (`performance_monitor_agent.py`)
- Monitors API response times
- Checks database query performance
- Tracks frontend bundle size
- Identifies memory leaks

### 5. Security Audit Agent (`security_audit_agent.py`)
- Validates JWT implementation
- Checks for SQL injection vulnerabilities
- Tests authentication boundaries
- Audits API permissions

### 6. Database Health Agent (`database_health_agent.py`)
- Checks database connections
- Validates schema integrity
- Monitors query performance
- Tests migrations

### 7. Error Recovery Agent (`error_recovery_agent.py`)
- Automatically fixes common issues
- Restarts failed services
- Clears problematic caches
- Resets corrupted states

## 🚀 Usage

Run all agents:
```bash
python debug_agents/run_all_agents.py
```

Run specific agent:
```bash
python debug_agents/frontend_debug_agent.py
```

## 📊 Output

Agents generate reports in `debug_agents/reports/` directory with findings and recommendations.