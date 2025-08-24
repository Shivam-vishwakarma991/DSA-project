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
    return response.data.data;
  } catch (error) {
    console.error('❌ Failed to update progress:', error.response?.data || error.message);
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
    return response.data.data;
  } catch (error) {
    console.error('❌ Failed to fetch user progress:', error.response?.data || error.message);
    throw error;
  }
}

async function createTestProgress() {
  try {
    // Step 1: Login
    await login();
    
    // Step 2: Get current progress
    console.log('\n=== CURRENT PROGRESS ===');
    const currentProgress = await getUserProgress();
    console.log('Current progress:', JSON.stringify(currentProgress, null, 2));
    
    // Step 3: Get topic problems
    console.log('\n=== FETCHING TOPIC PROBLEMS ===');
    const problems = await getTopicProblems('arrays');
    console.log(`Found ${problems.length} problems in Arrays topic`);
    
    if (problems.length === 0) {
      console.log('❌ No problems found. Please seed the database first.');
      return;
    }
    
    // Step 4: Create test progress for first 3 problems
    console.log('\n=== CREATING TEST PROGRESS ===');
    const testProblems = problems.slice(0, 3);
    
    for (let i = 0; i < testProblems.length; i++) {
      const problem = testProblems[i];
      const status = i === 0 ? 'completed' : 'attempted';
      const timeSpent = (i + 1) * 10;
      
      console.log(`\n--- Creating progress for: ${problem.title} ---`);
      console.log(`Status: ${status}, Time: ${timeSpent} minutes`);
      
      await updateProblemProgress(problem._id, status, timeSpent);
    }
    
    // Step 5: Check final progress
    console.log('\n=== FINAL PROGRESS ===');
    const finalProgress = await getUserProgress();
    console.log('Final progress:', JSON.stringify(finalProgress, null, 2));
    
    console.log('\n🎉 Test progress creation successful!');
    console.log('📈 You should now see:');
    console.log(`   - ${finalProgress.completionStats.completed} completed problems`);
    console.log(`   - ${finalProgress.completionStats.attempted} attempted problems`);
    console.log(`   - ${finalProgress.completionStats.total} total problems`);
    console.log(`   - ${finalProgress.completionStats.percentage}% completion rate`);
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
createTestProgress();
