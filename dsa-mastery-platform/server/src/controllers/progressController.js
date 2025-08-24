const Progress = require('../models/Progress');
const User = require('../models/User');
const Topic = require('../models/Topic');
const Problem = require('../models/Problem');
const mongoose = require('mongoose');
const logger = require('../utils/logger');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get user's overall progress
// @route   GET /api/progress/user
// @access  Private
exports.getUserProgress = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  console.log('🔍 Getting progress for user:', userId);

  // Get user's progress statistics
  const progressStats = await Progress.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
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

  console.log('📊 Progress stats:', progressStats);

  // Get topic progress
  const topicProgress = await Progress.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    {
      $lookup: {
        from: 'topics',
        localField: 'topicId',
        foreignField: '_id',
        as: 'topic'
      }
    },
    { $unwind: '$topic' },
    {
      $group: {
        _id: '$topicId',
        topicName: { $first: '$topic.title' },
        topicSlug: { $first: '$topic.slug' },
        total: { $sum: 1 },
        completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
        attempted: { $sum: { $cond: [{ $eq: ['$status', 'attempted'] }, 1, 0] } }
      }
    },
    {
      $addFields: {
        percentage: { $multiply: [{ $divide: ['$completed', '$total'] }, 100] }
      }
    }
  ]);

  console.log('📚 Topic progress:', topicProgress);

  // Get recent activity
  const recentActivity = await Progress.find({ userId: new mongoose.Types.ObjectId(userId) })
    .populate('problemId', 'title')
    .populate('topicId', 'title')
    .sort({ updatedAt: -1 })
    .limit(10);

  console.log('🕒 Recent activity count:', recentActivity.length);

  const stats = progressStats[0] || {
    totalProblems: 0,
    completedProblems: 0,
    attemptedProblems: 0,
    totalTimeSpent: 0,
    avgConfidence: 0
  };

  // Get fresh user data to ensure we have the latest stats
  const user = await User.findById(userId);
  const userStats = user ? user.stats : {
    totalSolved: 0,
    easySolved: 0,
    mediumSolved: 0,
    hardSolved: 0,
    streak: 0,
    longestStreak: 0,
    totalTimeSpent: 0,
    lastActiveDate: new Date()
  };

  const response = {
    success: true,
    data: {
      completionStats: {
        total: stats.totalProblems,
        completed: stats.completedProblems,
        attempted: stats.attemptedProblems,
        percentage: stats.totalProblems > 0 ? Math.round((stats.completedProblems / stats.totalProblems) * 100) : 0
      },
      topicProgress,
      recentActivity: recentActivity.map(activity => ({
        _id: activity._id,
        problemTitle: activity.problemId?.title,
        topic: activity.topicId?.title,
        status: activity.status,
        date: activity.updatedAt,
        timeSpent: activity.timeSpent
      })),
      userStats
    }
  };

  console.log('📤 Sending response:', JSON.stringify(response, null, 2));
  res.status(200).json(response);
});

// @desc    Get progress for a specific topic
// @route   GET /api/progress/topic/:topicId
// @access  Private
exports.getTopicProgress = asyncHandler(async (req, res) => {
  const { topicId } = req.params;
  const userId = req.user.id;

  const progress = await Progress.find({ userId, topicId })
    .populate('problemId', 'title difficulty')
    .sort({ 'problemId.order': 1 });

  res.status(200).json({
    success: true,
    data: progress
  });
});

// @desc    Update problem progress
// @route   PUT /api/progress/problem/:problemId
// @access  Private
exports.updateProblemProgress = asyncHandler(async (req, res) => {
  const { problemId } = req.params;
  const userId = req.user.id;
  const { status, notes, code, language, timeSpent, confidence, isBookmarked } = req.body;

  console.log('🔄 Updating progress for problem:', problemId);
  console.log('📊 Update data:', { status, timeSpent, userId });

  // Find or create progress record
  let progress = await Progress.findOne({ userId: new mongoose.Types.ObjectId(userId), problemId });
  
  if (!progress) {
    // Create new progress record
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ success: false, message: 'Problem not found' });
    }

    progress = new Progress({
      userId: new mongoose.Types.ObjectId(userId),
      problemId,
      topicId: problem.topicId,
      status: status || 'pending',
      notes,
      code,
      language: language || 'javascript',
      timeSpent: timeSpent || 0,
      attempts: 1,
      confidence: confidence || 3,
      isBookmarked: isBookmarked || false,
      lastAttemptDate: new Date(),
    });

    if (status === 'completed') {
      progress.completedDate = new Date();
    }
  } else {
    // Update existing progress record
    progress.status = status || progress.status;
    progress.notes = notes !== undefined ? notes : progress.notes;
    progress.code = code !== undefined ? code : progress.code;
    progress.language = language || progress.language;
    progress.timeSpent = timeSpent !== undefined ? timeSpent : progress.timeSpent;
    progress.confidence = confidence !== undefined ? confidence : progress.confidence;
    progress.isBookmarked = isBookmarked !== undefined ? isBookmarked : progress.isBookmarked;
    progress.lastAttemptDate = new Date();
    progress.attempts += 1;

    if (status === 'completed' && progress.status !== 'completed') {
      progress.completedDate = new Date();
    }
  }

  await progress.save();
  console.log('✅ Progress saved:', progress._id);

  // Update user stats
  await updateUserStats(userId);

  // Populate problem and topic details
  await progress.populate('problemId', 'title difficulty');
  await progress.populate('topicId', 'title');

  res.status(200).json({
    success: true,
    data: progress
  });
});

// Helper function to update user stats
async function updateUserStats(userId) {
  try {
    console.log('📊 Updating user stats for:', userId);
    
    // Get user's progress statistics
    const progressStats = await Progress.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          totalSolved: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
          totalTimeSpent: { $sum: '$timeSpent' },
          totalAttempts: { $sum: '$attempts' }
        }
      }
    ]);

    // Get difficulty breakdown
    const difficultyStats = await Progress.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId), status: 'completed' } },
      {
        $lookup: {
          from: 'problems',
          localField: 'problemId',
          foreignField: '_id',
          as: 'problem'
        }
      },
      { $unwind: '$problem' },
      {
        $group: {
          _id: '$problem.difficulty',
          count: { $sum: 1 }
        }
      }
    ]);

    // Calculate streak
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const recentActivity = await Progress.find({
      userId: new mongoose.Types.ObjectId(userId),
      lastAttemptDate: { $gte: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000) } // Last 30 days
    }).sort({ lastAttemptDate: -1 });

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    let lastDate = null;

    for (let i = 0; i < recentActivity.length; i++) {
      const activityDate = new Date(recentActivity[i].lastAttemptDate);
      activityDate.setHours(0, 0, 0, 0);
      
      if (!lastDate) {
        lastDate = activityDate;
        tempStreak = 1;
      } else {
        const diffDays = Math.floor((lastDate - activityDate) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          tempStreak++;
        } else if (diffDays > 1) {
          break;
        }
        lastDate = activityDate;
      }
    }

    // Check if today's activity continues the streak
    const todayActivity = recentActivity.find(activity => {
      const activityDate = new Date(activity.lastAttemptDate);
      activityDate.setHours(0, 0, 0, 0);
      return activityDate.getTime() === today.getTime();
    });

    if (todayActivity) {
      currentStreak = tempStreak;
    }

    // Calculate longest streak from all time
    const allActivity = await Progress.find({
      userId: new mongoose.Types.ObjectId(userId)
    }).sort({ lastAttemptDate: -1 });

    let maxStreak = 0;
    let currentMaxStreak = 0;
    let lastMaxDate = null;

    for (let i = 0; i < allActivity.length; i++) {
      const activityDate = new Date(allActivity[i].lastAttemptDate);
      activityDate.setHours(0, 0, 0, 0);
      
      if (!lastMaxDate) {
        lastMaxDate = activityDate;
        currentMaxStreak = 1;
      } else {
        const diffDays = Math.floor((lastMaxDate - activityDate) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          currentMaxStreak++;
        } else if (diffDays > 1) {
          maxStreak = Math.max(maxStreak, currentMaxStreak);
          currentMaxStreak = 1;
        }
        lastMaxDate = activityDate;
      }
    }
    maxStreak = Math.max(maxStreak, currentMaxStreak);
    longestStreak = maxStreak;

    // Prepare stats object
    const stats = {
      totalSolved: progressStats[0]?.totalSolved || 0,
      easySolved: difficultyStats.find(s => s._id === 'easy')?.count || 0,
      mediumSolved: difficultyStats.find(s => s._id === 'medium')?.count || 0,
      hardSolved: difficultyStats.find(s => s._id === 'hard')?.count || 0,
      streak: currentStreak,
      longestStreak: longestStreak,
      totalTimeSpent: progressStats[0]?.totalTimeSpent || 0,
      lastActiveDate: new Date()
    };

    // Update user document
    await User.findByIdAndUpdate(userId, { stats });
    
    console.log('✅ User stats updated:', stats);
    return stats;
  } catch (error) {
    console.error('❌ Error updating user stats:', error);
    throw error;
  }
}

// @desc    Get user's streak information
// @route   GET /api/progress/streak
// @access  Private
exports.getStreakInfo = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  
  // Calculate streak info
  const streakInfo = {
    current: user.stats.streak,
    longest: user.stats.longestStreak,
    lastActiveDate: user.stats.lastActiveDate,
    streakDates: [], // Would need to calculate from activity history
    gapDays: 0
  };

  res.status(200).json({
    success: true,
    data: streakInfo
  });
});

// @desc    Get recent activity
// @route   GET /api/progress/recent
// @access  Private
exports.getRecentActivity = asyncHandler(async (req, res) => {
  const { limit = 10 } = req.query;
  const userId = req.user.id;

  const recentActivity = await Progress.find({ userId })
    .populate('problemId', 'title')
    .populate('topicId', 'title')
    .sort({ updatedAt: -1 })
    .limit(parseInt(limit));

  res.status(200).json({
    success: true,
    data: recentActivity.map(activity => ({
      _id: activity._id,
      problemTitle: activity.problemId?.title,
      topic: activity.topicId?.title,
      status: activity.status,
      date: activity.updatedAt,
      timeSpent: activity.timeSpent
    }))
  });
});

// @desc    Get topic completion stats
// @route   GET /api/progress/topics
// @access  Private
exports.getTopicStats = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const topicStats = await Progress.aggregate([
    { $match: { userId: req.user._id } },
    {
      $lookup: {
        from: 'topics',
        localField: 'topicId',
        foreignField: '_id',
        as: 'topic'
      }
    },
    { $unwind: '$topic' },
    {
      $group: {
        _id: '$topicId',
        topicName: { $first: '$topic.title' },
        topicSlug: { $first: '$topic.slug' },
        total: { $sum: 1 },
        completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
        attempted: { $sum: { $cond: [{ $eq: ['$status', 'attempted'] }, 1, 0] } }
      }
    },
    {
      $addFields: {
        percentage: { $multiply: [{ $divide: ['$completed', '$total'] }, 100] }
      }
    }
  ]);

  res.status(200).json({
    success: true,
    data: topicStats
  });
});

// @desc    Get specific topic progress with problem details
// @route   GET /api/progress/topic/:slug/detailed
// @access  Private
exports.getTopicDetailedProgress = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const userId = req.user.id;

  // Get topic
  const topic = await Topic.findOne({ slug });
  if (!topic) {
    return res.status(404).json({
      success: false,
      message: 'Topic not found'
    });
  }

  // Get all problems for this topic
  const problems = await Problem.find({ topicId: topic._id }).sort({ order: 1 });

  // Get user's progress for this topic
  const userProgress = await Progress.find({ 
    userId: req.user._id, 
    topicId: topic._id 
  });

  // Create a map of problem progress
  const progressMap = {};
  userProgress.forEach(progress => {
    progressMap[progress.problemId.toString()] = progress;
  });

  // Combine problems with progress
  const problemsWithProgress = problems.map(problem => ({
    ...problem.toObject(),
    userProgress: progressMap[problem._id.toString()] || null,
    userStatus: progressMap[problem._id.toString()]?.status || 'pending'
  }));

  // Calculate topic progress
  const completedCount = userProgress.filter(p => p.status === 'completed').length;
  const attemptedCount = userProgress.filter(p => p.status === 'attempted').length;
  const totalProblems = problems.length;
  const progressPercentage = totalProblems > 0 ? (completedCount / totalProblems) * 100 : 0;

  res.status(200).json({
    success: true,
    data: {
      topic,
      problems: problemsWithProgress,
      progress: {
        total: totalProblems,
        completed: completedCount,
        attempted: attemptedCount,
        pending: totalProblems - completedCount - attemptedCount,
        percentage: Math.round(progressPercentage)
      }
    }
  });
});

// @desc    Get achievements
// @route   GET /api/progress/achievements
// @access  Private
exports.getAchievements = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  const achievements = [];

  // Check for various achievements
  if (user.stats.totalSolved >= 1) {
    achievements.push({ name: 'First Problem', description: 'Solved your first problem', unlocked: true });
  }
  if (user.stats.totalSolved >= 10) {
    achievements.push({ name: 'Getting Started', description: 'Solved 10 problems', unlocked: true });
  }
  if (user.stats.totalSolved >= 50) {
    achievements.push({ name: 'Problem Solver', description: 'Solved 50 problems', unlocked: true });
  }
  if (user.stats.totalSolved >= 100) {
    achievements.push({ name: 'Century Club', description: 'Solved 100 problems', unlocked: true });
  }
  if (user.stats.streak >= 7) {
    achievements.push({ name: 'Week Warrior', description: 'Maintained a 7-day streak', unlocked: true });
  }
  if (user.stats.streak >= 30) {
    achievements.push({ name: 'Monthly Master', description: 'Maintained a 30-day streak', unlocked: true });
  }

  res.status(200).json({
    success: true,
    data: achievements
  });
});