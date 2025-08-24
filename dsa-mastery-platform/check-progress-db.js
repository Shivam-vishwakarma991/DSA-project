const mongoose = require('mongoose');
const Progress = require('./server/src/models/Progress');
const User = require('./server/src/models/User');

async function checkProgressDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/dsa-mastery');
    console.log('✅ Connected to MongoDB');

    // Check all users
    console.log('\n👥 Checking users...');
    const users = await User.find({});
    console.log(`Found ${users.length} users:`);
    users.forEach(user => {
      console.log(`  - ${user.email} (${user.username}) - ID: ${user._id}`);
      console.log(`    Stats: ${JSON.stringify(user.stats)}`);
    });

    // Check all progress records
    console.log('\n📊 Checking progress records...');
    const allProgress = await Progress.find({});
    console.log(`Found ${allProgress.length} progress records:`);
    
    if (allProgress.length === 0) {
      console.log('❌ No progress records found in database!');
      return;
    }

    allProgress.forEach(progress => {
      console.log(`  - User: ${progress.userId}`);
      console.log(`    Problem: ${progress.problemId}`);
      console.log(`    Status: ${progress.status}`);
      console.log(`    Time Spent: ${progress.timeSpent} minutes`);
      console.log(`    Attempts: ${progress.attempts}`);
      console.log(`    Last Attempt: ${progress.lastAttemptDate}`);
      console.log('    ---');
    });

    // Check progress by user
    if (users.length > 0) {
      const firstUser = users[0];
      console.log(`\n🔍 Checking progress for user: ${firstUser.email}`);
      
      const userProgress = await Progress.find({ userId: firstUser._id });
      console.log(`Found ${userProgress.length} progress records for this user`);
      
      if (userProgress.length > 0) {
        console.log('Progress details:');
        userProgress.forEach(progress => {
          console.log(`  - Problem: ${progress.problemId}`);
          console.log(`    Status: ${progress.status}`);
          console.log(`    Time: ${progress.timeSpent} min`);
          console.log(`    Attempts: ${progress.attempts}`);
        });
      }
    }

    // Test aggregation
    console.log('\n📈 Testing aggregation...');
    if (users.length > 0) {
      const firstUser = users[0];
      const progressStats = await Progress.aggregate([
        { $match: { userId: firstUser._id } },
        {
          $group: {
            _id: null,
            totalProblems: { $sum: 1 },
            completedProblems: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
            attemptedProblems: { $sum: { $cond: [{ $eq: ['$status', 'attempted'] }, 1, 0] } },
            totalTimeSpent: { $sum: '$timeSpent' },
            avgConfidence: { $avg: '$confidence' }
          }
        }
      ]);
      
      console.log('Aggregation results:', progressStats);
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

checkProgressDatabase();
