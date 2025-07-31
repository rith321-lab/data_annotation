#!/usr/bin/env python3
"""
Simple script to test the backend endpoints
"""
import requests
import json
import sys

BASE_URL = "http://localhost:8000"

def test_health():
    """Test health endpoint"""
    try:
        response = requests.get(f"{BASE_URL}/health", timeout=5)
        print(f"✅ Health check: {response.json()}")
        return True
    except Exception as e:
        print(f"❌ Health check failed: {e}")
        return False

def test_root():
    """Test root endpoint"""
    try:
        response = requests.get(f"{BASE_URL}/", timeout=5)
        print(f"✅ Root endpoint: {response.json()}")
        return True
    except Exception as e:
        print(f"❌ Root endpoint failed: {e}")
        return False

def test_auth():
    """Test authentication"""
    try:
        # Test login with demo credentials
        login_data = {
            "username": "admin@demo.com",
            "password": "demo123"
        }
        response = requests.post(f"{BASE_URL}/api/v1/auth/login", json=login_data, timeout=10)
        
        if response.status_code == 200:
            token_data = response.json()
            print(f"✅ Login successful: Got access token")
            
            # Test protected endpoint
            headers = {"Authorization": f"Bearer {token_data['access_token']}"}
            me_response = requests.get(f"{BASE_URL}/api/v1/auth/me", headers=headers, timeout=5)
            
            if me_response.status_code == 200:
                user_data = me_response.json()
                print(f"✅ User info: {user_data['email']} ({user_data['full_name']})")
                return True
            else:
                print(f"❌ User info failed: {me_response.status_code}")
                return False
        else:
            print(f"❌ Login failed: {response.status_code} - {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Auth test failed: {e}")
        return False

def test_projects():
    """Test projects endpoint"""
    try:
        # Login first
        login_data = {
            "username": "admin@demo.com", 
            "password": "demo123"
        }
        response = requests.post(f"{BASE_URL}/api/v1/auth/login", json=login_data, timeout=10)
        token = response.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        # Get projects
        projects_response = requests.get(f"{BASE_URL}/api/v1/projects", headers=headers, timeout=5)
        
        if projects_response.status_code == 200:
            projects = projects_response.json()
            print(f"✅ Projects endpoint: Found {len(projects)} projects")
            for project in projects[:2]:  # Show first 2
                print(f"   - {project['name']} ({project['status']})")
            return True
        else:
            print(f"❌ Projects failed: {projects_response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Projects test failed: {e}")
        return False

def main():
    """Run all tests"""
    print("🚀 Testing Verita AI Backend...")
    print("=" * 50)
    
    tests = [
        ("Health Check", test_health),
        ("Root Endpoint", test_root),
        ("Authentication", test_auth),
        ("Projects API", test_projects),
    ]
    
    passed = 0
    total = len(tests)
    
    for test_name, test_func in tests:
        print(f"\n🧪 Testing {test_name}...")
        if test_func():
            passed += 1
        print()
    
    print("=" * 50)
    print(f"📊 Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! Backend is working correctly.")
        print("🔑 Demo credentials: admin@demo.com / demo123")
        print("📚 API Docs: http://localhost:8000/docs")
        return 0
    else:
        print("⚠️  Some tests failed. Check the backend server.")
        return 1

if __name__ == "__main__":
    sys.exit(main())