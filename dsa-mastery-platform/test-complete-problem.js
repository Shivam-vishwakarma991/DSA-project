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

async function testCompleteProblem() {
  try {
    // Step 1: Login
    await login();
    
    // Step 2: Get current progress
    console.log('\n=== CURRENT PROGRESS ===');
    const currentProgress = await getUserProgress();
    console.log('Current stats:', {
      completed: currentProgress.completionStats.completed,
      attempted: currentProgress.completionStats.attempted,
      total: currentProgress.completionStats.total
    });
    
    // Step 3: Get topic problems
    console.log('\n=== FETCHING TOPIC PROBLEMS ===');
    const problems = await getTopicProblems('arrays');
    console.log(`Found ${problems.length} problems in Arrays topic`);
    
    if (problems.length === 0) {
      console.log('❌ No problems found. Please seed the database first.');
      return;
    }
    
    // Step 4: Find a problem that's already attempted
    const attemptedProblems = problems.filter(p => {
      const progress = currentProgress.recentActivity.find(ra => ra.problemTitle === p.title);
      return progress && progress.status === 'attempted';
    });
    
    if (attemptedProblems.length === 0) {
      console.log('❌ No attempted problems found. Please attempt a problem first.');
      return;
    }
    
    const problemToComplete = attemptedProblems[0];
    console.log(`\n🎯 Completing problem: ${problemToComplete.title}`);
    
    // Step 5: Mark as completed
    console.log('\n--- Marking as completed ---');
    const completedProgress = await updateProblemProgress(problemToComplete._id, 'completed', 30);
    console.log(`✅ Problem completed! Attempts: ${completedProgress.attempts}`);
    
    // Step 6: Check final progress
    console.log('\n=== FINAL PROGRESS ===');
    const finalProgress = await getUserProgress();
    console.log('Final stats:', {
      completed: finalProgress.completionStats.completed,
      attempted: finalProgress.completionStats.attempted,
      total: finalProgress.completionStats.total,
      percentage: finalProgress.completionStats.percentage
    });
    
    console.log('\n🎉 Problem completion test successful!');
    console.log('📈 You should now see:');
    console.log('   - 1 completed problem');
    console.log('   - Updated completion percentage');
    console.log('   - Updated user stats');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testCompleteProblem();
