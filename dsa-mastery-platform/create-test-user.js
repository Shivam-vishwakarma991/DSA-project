const mongoose = require('mongoose');
const User = require('./server/src/models/User');
const bcrypt = require('bcryptjs');

async function createTestUser() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/dsa-mastery');
    console.log('✅ Connected to MongoDB');

    // Check if test user already exists
    const existingUser = await User.findOne({ email: 'test@example.com' });
    if (existingUser) {
      console.log('✅ Test user already exists:', existingUser.email);
      return;
    }

    // Create test user
    const hashedPassword = await bcrypt.hash('password123', 12);
    const testUser = new User({
      username: 'testuser',
      email: 'test@example.com',
      password: hashedPassword,
      fullName: 'Test User',
      role: 'student',
      stats: {
        totalSolved: 0,
        easySolved: 0,
        mediumSolved: 0,
        hardSolved: 0,
        streak: 0,
        longestStreak: 0,
        totalTimeSpent: 0,
        lastActiveDate: new Date()
      }
    });

    await testUser.save();
    console.log('✅ Test user created successfully:', testUser.email);
    console.log('📧 Email: test@example.com');
    console.log('🔑 Password: password123');

  } catch (error) {
    console.error('❌ Error creating test user:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

createTestUser();
