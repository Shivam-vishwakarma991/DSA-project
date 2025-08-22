const axios = require('axios');

const API_URL = 'http://localhost:5003/api';

async function testAuth() {
  try {
    console.log('Testing authentication endpoints...\n');

    // Test registration
    console.log('1. Testing registration...');
    const registerResponse = await axios.post(`${API_URL}/auth/register`, {
      fullName: 'Test User',
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    });
    console.log('✅ Registration successful:', registerResponse.data.success);

    // Test login
    console.log('\n2. Testing login...');
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      email: 'test@example.com',
      password: 'password123'
    });
    console.log('✅ Login successful:', loginResponse.data.success);
    
    const { token, refreshToken } = loginResponse.data;

    // Test protected endpoint
    console.log('\n3. Testing protected endpoint...');
    const userResponse = await axios.get(`${API_URL}/users/profile`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('✅ Protected endpoint successful:', userResponse.data.success);

    // Test refresh token
    console.log('\n4. Testing refresh token...');
    const refreshResponse = await axios.post(`${API_URL}/auth/refresh`, {
      refreshToken
    });
    console.log('✅ Refresh token successful:', refreshResponse.data.success);

    // Test logout
    console.log('\n5. Testing logout...');
    const logoutResponse = await axios.post(`${API_URL}/auth/logout`, {
      refreshToken
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('✅ Logout successful:', logoutResponse.data.success);

    console.log('\n🎉 All authentication tests passed!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testAuth();
