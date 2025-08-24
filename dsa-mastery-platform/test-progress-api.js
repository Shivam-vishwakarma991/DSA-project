const axios = require('axios');

const API_BASE = 'http://localhost:5001/api';

// Test user credentials - you'll need to update these with actual user credentials
const testUser = {
  email: 'test@example.com',
  password: 'password123'
};

let authToken = null;

async function login() {
  try {
    console.log('🔐 Logging in...');
    const response = await axios.post(`${API_BASE}/auth/login`, testUser);
    authToken = response.data.data.token;
    console.log('✅ Login successful');
    return authToken;
  } catch (error) {
    console.error('❌ Login failed:', error.response?.data || error.message);
    throw error;
  }
}

async function testProgressAPI() {
  try {
    // Step 1: Login
    await login();
    
    // Step 2: Test getUserProgress API
    console.log('\n📊 Testing getUserProgress API...');
    const progressResponse = await axios.get(`${API_BASE}/progress/user`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    console.log('✅ getUserProgress response:');
    console.log(JSON.stringify(progressResponse.data, null, 2));
    
    // Step 3: Test getTopicDetailedProgress API
    console.log('\n📚 Testing getTopicDetailedProgress API...');
    const topicProgressResponse = await axios.get(`${API_BASE}/progress/topic/arrays/detailed`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    console.log('✅ getTopicDetailedProgress response:');
    console.log(JSON.stringify(topicProgressResponse.data, null, 2));
    
    // Step 4: Test getRecentActivity API
    console.log('\n🕒 Testing getRecentActivity API...');
    const recentActivityResponse = await axios.get(`${API_BASE}/progress/recent`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    console.log('✅ getRecentActivity response:');
    console.log(JSON.stringify(recentActivityResponse.data, null, 2));
    
  } catch (error) {
    console.error('❌ API test failed:', error.response?.data || error.message);
  }
}

// Run the test
testProgressAPI();
