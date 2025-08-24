const axios = require('axios');

const API_BASE = 'http://localhost:5001/api';

// Test user credentials
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

async function getUserProgress() {
  try {
    console.log('📊 Fetching user progress...');
    const response = await axios.get(`${API_BASE}/progress/user`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ User progress fetched successfully');
    console.log('📈 Progress data:', JSON.stringify(response.data.data, null, 2));
    return response.data.data;
  } catch (error) {
    console.error('❌ Failed to fetch user progress:', error.response?.data || error.message);
    throw error;
  }
}

async function updateProblemProgress(problemId, status, timeSpent = 10) {
  try {
    console.log(`🔄 Updating problem ${problemId} to status: ${status}`);
    const response = await axios.put(`${API_BASE}/progress/problem/${problemId}`, {
      status,
      timeSpent,
      language: 'javascript',
      confidence: 3
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Progress updated successfully');
    console.log('📝 Updated progress:', JSON.stringify(response.data.data, null, 2));
    return response.data.data;
  } catch (error) {
    console.error('❌ Failed to update progress:', error.response?.data || error.message);
    throw error;
  }
}

async function getTopicProblems(slug) {
  try {
    console.log(`📚 Fetching problems for topic: ${slug}`);
    const response = await axios.get(`${API_BASE}/topics/${slug}/problems`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Topic problems fetched successfully');
    return response.data.data;
  } catch (error) {
    console.error('❌ Failed to fetch topic problems:', error.response?.data || error.message);
    throw error;
  }
}

async function testProgressFlow() {
  try {
    // Step 1: Login
    await login();
    
    // Step 2: Get initial progress
    console.log('\n=== INITIAL PROGRESS ===');
    const initialProgress = await getUserProgress();
    
    // Step 3: Get topic problems
    console.log('\n=== FETCHING TOPIC PROBLEMS ===');
    const problems = await getTopicProblems('arrays');
    console.log(`Found ${problems.length} problems in Arrays topic`);
    
    if (problems.length === 0) {
      console.log('❌ No problems found. Please seed the database first.');
      return;
    }
    
    // Step 4: Test progress updates
    console.log('\n=== TESTING PROGRESS UPDATES ===');
    const testProblem = problems[0];
    console.log(`Testing with problem: ${testProblem.title}`);
    
    // Test 1: Mark as attempted
    console.log('\n--- Test 1: Mark as attempted ---');
    const attemptedProgress = await updateProblemProgress(testProblem._id, 'attempted', 15);
    console.log(`Attempts count: ${attemptedProgress.attempts}`);
    
    // Test 2: Mark as completed
    console.log('\n--- Test 2: Mark as completed ---');
    const completedProgress = await updateProblemProgress(testProblem._id, 'completed', 25);
    console.log(`Attempts count: ${completedProgress.attempts}`);
    
    // Test 3: Check final progress
    console.log('\n=== FINAL PROGRESS ===');
    const finalProgress = await getUserProgress();
    
    // Test 4: Test another problem
    if (problems.length > 1) {
      console.log('\n--- Test 3: Another problem ---');
      const secondProblem = problems[1];
      console.log(`Testing with problem: ${secondProblem.title}`);
      await updateProblemProgress(secondProblem._id, 'attempted', 20);
    }
    
    console.log('\n✅ All tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testProgressFlow();
