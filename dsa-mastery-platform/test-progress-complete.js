const axios = require('axios');

const API_BASE = 'http://localhost:5001/api';

// Test user credentials - update these with actual user credentials
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
    console.log(`✅ Found ${response.data.data.length} problems`);
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

async function getStreak() {
  try {
    console.log('🔥 Fetching streak info...');
    const response = await axios.get(`${API_BASE}/progress/streak`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Streak info fetched successfully');
    return response.data.data;
  } catch (error) {
    console.error('❌ Failed to fetch streak:', error.response?.data || error.message);
    throw error;
  }
}

async function getRecentActivity() {
  try {
    console.log('🕒 Fetching recent activity...');
    const response = await axios.get(`${API_BASE}/progress/recent`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Recent activity fetched successfully');
    return response.data.data;
  } catch (error) {
    console.error('❌ Failed to fetch recent activity:', error.response?.data || error.message);
    throw error;
  }
}

async function testCompleteProgressFlow() {
  try {
    console.log('🚀 Starting complete progress flow test...\n');
    
    // Step 1: Login
    await login();
    
    // Step 2: Get current progress
    console.log('\n=== CURRENT PROGRESS ===');
    const currentProgress = await getUserProgress();
    console.log('Current progress:', JSON.stringify(currentProgress, null, 2));
    
    // Step 3: Get streak info
    console.log('\n=== CURRENT STREAK ===');
    const currentStreak = await getStreak();
    console.log('Current streak:', JSON.stringify(currentStreak, null, 2));
    
    // Step 4: Get recent activity
    console.log('\n=== CURRENT RECENT ACTIVITY ===');
    const currentActivity = await getRecentActivity();
    console.log('Recent activity:', JSON.stringify(currentActivity, null, 2));
    
    // Step 5: Get topic problems
    console.log('\n=== FETCHING TOPIC PROBLEMS ===');
    const problems = await getTopicProblems('arrays');
    
    if (problems.length === 0) {
      console.log('❌ No problems found. Please seed the database first.');
      return;
    }
    
    // Step 6: Create test progress for first 3 problems
    console.log('\n=== CREATING TEST PROGRESS ===');
    const testProblems = problems.slice(0, 3);
    
    for (let i = 0; i < testProblems.length; i++) {
      const problem = testProblems[i];
      const status = i === 0 ? 'completed' : 'attempted';
      const timeSpent = (i + 1) * 10;
      
      console.log(`\n--- Creating progress for: ${problem.title} ---`);
      console.log(`Status: ${status}, Time: ${timeSpent} minutes`);
      
      await updateProblemProgress(problem._id, status, timeSpent);
      
      // Wait a bit between updates
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // Step 7: Check final progress
    console.log('\n=== FINAL PROGRESS ===');
    const finalProgress = await getUserProgress();
    console.log('Final progress:', JSON.stringify(finalProgress, null, 2));
    
    // Step 8: Check final streak
    console.log('\n=== FINAL STREAK ===');
    const finalStreak = await getStreak();
    console.log('Final streak:', JSON.stringify(finalStreak, null, 2));
    
    // Step 9: Check final recent activity
    console.log('\n=== FINAL RECENT ACTIVITY ===');
    const finalActivity = await getRecentActivity();
    console.log('Final recent activity:', JSON.stringify(finalActivity, null, 2));
    
    console.log('\n🎉 Complete progress flow test successful!');
    console.log('📈 Summary:');
    console.log(`   - Completion Stats: ${finalProgress.completionStats.completed} completed, ${finalProgress.completionStats.attempted} attempted`);
    console.log(`   - User Stats: ${finalProgress.userStats.totalSolved} total solved, ${finalProgress.userStats.streak} day streak`);
    console.log(`   - Recent Activity: ${finalActivity.length} activities`);
    console.log(`   - Topic Progress: ${finalProgress.topicProgress.length} topics with progress`);
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testCompleteProgressFlow();
