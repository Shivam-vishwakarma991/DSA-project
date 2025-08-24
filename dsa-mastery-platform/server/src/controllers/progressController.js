const Progress = require('../models/Progress');
const User = require('../models/User');
const Topic = require('../models/Topic');
const Problem = require('../models/Problem');
const logger = require('../utils/logger');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get user's overall progress
// @route   GET /api/progress/user
// @access  Private
exports.getUserProgress = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  // Get user's progress statistics
  const progressStats = await Progress.aggregate([
    { $match: { userId: req.user._id } },
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

  // Get topic progress
  const topicProgress = await Progress.aggregate([
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

  // Get recent activity
  const recentActivity = await Progress.find({ userId: req.user._id })
    .populate('problemId', 'title')
    .populate('topicId', 'title')
    .sort({ updatedAt: -1 })
    .limit(10);

  const stats = progressStats[0] || {
    totalProblems: 0,
    completedProblems: 0,
    attemptedProblems: 0,
    totalTimeSpent: 0,
    avgConfidence: 0
  };

  res.status(200).json({
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
      userStats: req.user.stats
    }
  });
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
  const updateData = req.body;

  // Find or create progress record
  let progress = await Progress.findOne({ userId, problemId });
  
  if (!progress) {
    // Get problem and topic info
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({
        success: false,
        message: 'Problem not found'
      });
    }

    progress = new Progress({
      userId,
      problemId,
      topicId: problem.topicId,
      status: updateData.status,
      notes: updateData.notes,
      code: updateData.code,
      language: updateData.language,
      timeSpent: updateData.timeSpent,
      confidence: updateData.confidence,
      isBookmarked: updateData.isBookmarked || false
    });
  } else {
    // Update existing progress
    Object.assign(progress, updateData);
  }

  await progress.save();

  // Update user stats if problem is completed
  if (updateData.status === 'completed' && progress.status !== 'completed') {
    const user = await User.findById(userId);
    const problem = await Problem.findById(problemId);
    
    if (user && problem) {
      user.stats.totalSolved += 1;
      user.stats.totalTimeSpent += updateData.timeSpent || 0;
      
      // Update difficulty-specific stats
      switch (problem.difficulty.toLowerCase()) {
        case 'easy':
          user.stats.easySolved += 1;
          break;
        case 'medium':
          user.stats.mediumSolved += 1;
          break;
        case 'hard':
          user.stats.hardSolved += 1;
          break;
      }
      
      await user.save();
    }
  }

  res.status(200).json({
    success: true,
    data: progress
  });
});

// @desc    Get user's streak information
// @route   GET /api/progress/streak
// @access  Private
exports.getStreakInfo = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  
  // Calculate streak info (this is a simplified version)
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