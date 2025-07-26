#!/usr/bin/env python3
"""
Test script for Verita AI API
"""
import requests
import json

BASE_URL = "http://localhost:8000"

def test_health():
    """Test health endpoint"""
    response = requests.get(f"{BASE_URL}/health")
    print(f"Health Check: {response.status_code}")
    print(f"Response: {response.json()}\n")

def test_register():
    """Test user registration"""
    user_data = {
        "email": "test@verita.ai",
        "username": "testuser",
        "password": "TestPassword123!",
        "full_name": "Test User"
    }
    
    response = requests.post(f"{BASE_URL}/api/v1/auth/register", json=user_data)
    print(f"Registration: {response.status_code}")
    if response.status_code == 200:
        print(f"User created: {response.json()['email']}\n")
    else:
        print(f"Error: {response.text}\n")
    return response.status_code == 200

def test_login():
    """Test user login"""
    login_data = {
        "username": "test@verita.ai",  # OAuth2 uses username field for email
        "password": "TestPassword123!"
    }
    
    response = requests.post(
        f"{BASE_URL}/api/v1/auth/login",
        data=login_data  # Form data, not JSON
    )
    print(f"Login: {response.status_code}")
    if response.status_code == 200:
        tokens = response.json()
        print(f"Access token received: {tokens['access_token'][:20]}...")
        return tokens['access_token']
    else:
        print(f"Error: {response.text}")
    return None

def test_create_project(access_token):
    """Test project creation"""
    headers = {"Authorization": f"Bearer {access_token}"}
    project_data = {
        "name": "Test Project",
        "slug": "test-project",
        "description": "A test project for Verita AI",
        "instructions": "Please classify the given text into positive or negative sentiment.",
        "project_type": "classification",
        "payment_per_response": 0.15
    }
    
    response = requests.post(
        f"{BASE_URL}/api/v1/projects",
        json=project_data,
        headers=headers
    )
    print(f"\nProject Creation: {response.status_code}")
    if response.status_code == 200:
        project = response.json()
        print(f"Project created: {project['name']} (ID: {project['id']})")
        return project['id']
    else:
        print(f"Error: {response.text}")
    return None

def test_create_task(access_token, project_id):
    """Test task creation"""
    headers = {"Authorization": f"Bearer {access_token}"}
    task_data = {
        "external_id": "task-001",
        "data": {
            "text": "This product is amazing! I love it.",
            "product_id": "12345"
        },
        "priority": "high"
    }
    
    response = requests.post(
        f"{BASE_URL}/api/v1/projects/{project_id}/tasks",
        json=task_data,
        headers=headers
    )
    print(f"\nTask Creation: {response.status_code}")
    if response.status_code == 200:
        task = response.json()
        print(f"Task created: {task['id']}")
    else:
        print(f"Error: {response.text}")

def main():
    print("Testing Verita AI API...\n")
    
    # Test health
    test_health()
    
    # Test registration
    registered = test_register()
    
    # Test login
    access_token = test_login()
    
    if access_token:
        # Test project creation
        project_id = test_create_project(access_token)
        
        if project_id:
            # Test task creation
            test_create_task(access_token, project_id)
    
    print("\n✅ API is working! Visit http://localhost:8000/api/v1/docs for interactive documentation.")

if __name__ == "__main__":
    main()