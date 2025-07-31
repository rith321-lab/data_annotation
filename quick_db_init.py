#!/usr/bin/env python3
"""
Quick database initialization for Verita AI
Creates minimal tables needed for authentication
"""

import sqlite3
import uuid
from passlib.context import CryptContext

# Create password context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_simple_db():
    """Create a simple SQLite database with essential tables"""
    print("Creating simple SQLite database...")
    
    # Connect to SQLite database
    conn = sqlite3.connect('verita_ai.db')
    cursor = conn.cursor()
    
    # Create organizations table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS organizations (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            slug TEXT UNIQUE,
            description TEXT,
            subscription_tier TEXT DEFAULT 'free',
            subscription_status TEXT DEFAULT 'active',
            settings TEXT DEFAULT '{}',
            max_projects INTEGER DEFAULT 5,
            max_tasks_per_month INTEGER DEFAULT 1000,
            max_workers INTEGER DEFAULT 10,
            custom_branding BOOLEAN DEFAULT 0,
            private_workforce BOOLEAN DEFAULT 0,
            advanced_analytics BOOLEAN DEFAULT 0
        )
    ''')
    
    # Create users table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            email TEXT UNIQUE NOT NULL,
            username TEXT UNIQUE NOT NULL,
            full_name TEXT,
            hashed_password TEXT NOT NULL,
            is_active BOOLEAN DEFAULT 1,
            is_superuser BOOLEAN DEFAULT 0,
            is_verified BOOLEAN DEFAULT 0,
            organization_id TEXT,
            last_login DATETIME,
            email_verified_at DATETIME,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (organization_id) REFERENCES organizations (id)
        )
    ''')
    
    # Create projects table (basic)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS projects (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            description TEXT,
            status TEXT DEFAULT 'active',
            organization_id TEXT,
            creator_id TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (organization_id) REFERENCES organizations (id),
            FOREIGN KEY (creator_id) REFERENCES users (id)
        )
    ''')
    
    # Create tasks table (basic)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS tasks (
            id TEXT PRIMARY KEY,
            project_id TEXT,
            title TEXT NOT NULL,
            description TEXT,
            status TEXT DEFAULT 'pending',
            priority TEXT DEFAULT 'medium',
            data TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (project_id) REFERENCES projects (id)
        )
    ''')
    
    # Default admin credentials
    admin_email = "admin@verita.ai"
    admin_password = "admin123"
    
    # Check if admin user exists
    cursor.execute('SELECT id FROM users WHERE email = ?', (admin_email,))
    existing_user = cursor.fetchone()
    
    if not existing_user:
        # Create default organization
        org_id = str(uuid.uuid4())
        cursor.execute('''
            INSERT INTO organizations (id, name, slug, description)
            VALUES (?, ?, ?, ?)
        ''', (org_id, "Verita AI", "verita-ai", "Default organization for Verita AI platform"))
        
        # Create admin user
        user_id = str(uuid.uuid4())
        hashed_password = get_password_hash(admin_password)
        
        cursor.execute('''
            INSERT INTO users (id, email, username, full_name, hashed_password, 
                             is_active, is_superuser, is_verified, organization_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (user_id, admin_email, "admin", "System Administrator",
              hashed_password, True, True, True, org_id))
        
        print(f"✅ Created admin user: {admin_email}")
        
        # Create a sample project
        project_id = str(uuid.uuid4())
        cursor.execute('''
            INSERT INTO projects (id, name, description, organization_id, creator_id)
            VALUES (?, ?, ?, ?, ?)
        ''', (project_id, "Sample Project", "A sample data annotation project", org_id, user_id))
        
        # Create sample tasks
        for i in range(5):
            task_id = str(uuid.uuid4())
            cursor.execute('''
                INSERT INTO tasks (id, project_id, title, description, status, priority)
                VALUES (?, ?, ?, ?, ?, ?)
            ''', (task_id, project_id, f"Sample Task {i+1}", 
                  f"This is a sample annotation task #{i+1}", 
                  'pending' if i < 3 else 'completed',
                  'high' if i == 0 else 'medium'))
        
        print("✅ Created sample project and tasks")
    else:
        print(f"ℹ️  Admin user already exists: {admin_email}")
    
    conn.commit()
    conn.close()
    
    print("🎉 Simple database initialization completed!")
    print(f"Database file: verita_ai.db")
    print(f"Admin login:")
    print(f"  Email: {admin_email}")
    print(f"  Password: {admin_password}")

if __name__ == "__main__":
    create_simple_db() 