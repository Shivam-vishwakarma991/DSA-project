const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  problemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem',
    required: true,
  },
  topicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topic',
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'attempted', 'completed', 'revisit'],
    default: 'pending',
  },
  notes: {
    type: String,
    maxlength: 2000,
  },
  code: {
    type: String,
  },
  language: {
    type: String,
    enum: ['javascript', 'python', 'java', 'cpp', 'go', 'rust'],
    default: 'javascript',
  },
  timeSpent: {
    type: Number,
    default: 0, // in minutes
  },
  attempts: {
    type: Number,
    default: 0,
  },
  lastAttemptDate: {
    type: Date,
    default: Date.now,
  },
  completedDate: {
    type: Date,
  },
  confidence: {
    type: Number,
    min: 1,
    max: 5,
    default: 3,
  },
  isBookmarked: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// Compound index for unique user-problem combination
progressSchema.index({ userId: 1, problemId: 1 }, { unique: true });
progressSchema.index({ userId: 1, status: 1 });
progressSchema.index({ userId: 1, topicId: 1 });

// Update user stats on progress change
progressSchema.post('save', async function() {
  const User = mongoose.model('User');
  const Problem = mongoose.model('Problem');
  
  if (this.status === 'completed') {
    const problem = await Problem.findById(this.problemId);
    const user = await User.findById(this.userId);
    
    if (problem && user) {
      // Update solved count based on difficulty
      const difficultyMap = {
        'Easy': 'easySolved',
        'Medium': 'mediumSolved',
        'Hard': 'hardSolved',
      };
      
      const difficultyField = difficultyMap[problem.difficulty];
      
      await User.findByIdAndUpdate(this.userId, {
        $inc: {
          'stats.totalSolved': 1,
          [`stats.${difficultyField}`]: 1,
          'stats.totalTimeSpent': this.timeSpent || 0,
        },
        'stats.lastActiveDate': new Date(),
      });
      
      // Update streak
      await updateUserStreak(this.userId);
    }
  }
});

// Helper function to update user streak
async function updateUserStreak(userId) {
  const User = mongoose.model('User');
  const user = await User.findById(userId);
  
  if (!user) return;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const lastActive = new Date(user.stats.lastActiveDate);
  lastActive.setHours(0, 0, 0, 0);
  
  const daysDiff = Math.floor((today - lastActive) / (1000 * 60 * 60 * 24));
  
  if (daysDiff === 0) {
    // Same day, no streak update needed
    return;
  } else if (daysDiff === 1) {
    // Consecutive day, increment streak
    user.stats.streak += 1;
    if (user.stats.streak > user.stats.longestStreak) {
      user.stats.longestStreak = user.stats.streak;
    }
  } else {
    // Streak broken, reset to 1
    user.stats.streak = 1;
  }
  
  await user.save();
}

module.exports = mongoose.model('Progress', progressSchema);