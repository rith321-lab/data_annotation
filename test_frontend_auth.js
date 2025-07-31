// Simple test to verify frontend auth flow
const API_BASE = 'http://localhost:8000';

async function testAuthFlow() {
  console.log('🧪 Testing Frontend Auth Flow...');
  
  try {
    // 1. Test login
    console.log('1. Testing login...');
    const loginResponse = await fetch(`${API_BASE}/api/v1/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'admin@demo.com',
        password: 'demo123'
      })
    });

    if (!loginResponse.ok) {
      throw new Error(`Login failed: ${loginResponse.status}`);
    }

    const loginData = await loginResponse.json();
    console.log('✅ Login successful, token:', loginData.access_token.substring(0, 20) + '...');

    // 2. Test authenticated request
    console.log('2. Testing authenticated projects request...');
    const projectsResponse = await fetch(`${API_BASE}/api/v1/projects`, {
      headers: {
        'Authorization': `Bearer ${loginData.access_token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!projectsResponse.ok) {
      throw new Error(`Projects request failed: ${projectsResponse.status}`);
    }

    const projectsData = await projectsResponse.json();
    console.log('✅ Projects request successful, found', projectsData.length, 'projects');
    console.log('Projects:', projectsData.map(p => ({ name: p.name, status: p.status })));

    // 3. Test user info
    console.log('3. Testing user info request...');
    const userResponse = await fetch(`${API_BASE}/api/v1/auth/me`, {
      headers: {
        'Authorization': `Bearer ${loginData.access_token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!userResponse.ok) {
      throw new Error(`User info request failed: ${userResponse.status}`);
    }

    const userData = await userResponse.json();
    console.log('✅ User info request successful:', userData);

    console.log('🎉 All authentication tests passed!');
    
  } catch (error) {
    console.error('❌ Authentication test failed:', error);
  }
}

// Run the test
testAuthFlow();