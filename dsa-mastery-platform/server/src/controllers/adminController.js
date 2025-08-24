const User = require('../models/User');
const Progress = require('../models/Progress');
const Topic = require('../models/Topic');
const Problem = require('../models/Problem');
const logger = require('../utils/logger');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get admin dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private (Admin only)
exports.getAdminDashboard = asyncHandler(async (req, res) => {
  // Total users
  const totalUsers = await User.countDocuments();
  const activeUsers = await User.countDocuments({ 
    'stats.lastActiveDate': { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } 
  });

  // Total problems and topics
  const totalProblems = await Problem.countDocuments();
  const totalTopics = await Topic.countDocuments();

  // Platform usage statistics
  const totalProgressRecords = await Progress.countDocuments();
  const completedProblems = await Progress.countDocuments({ status: 'completed' });
  const attemptedProblems = await Progress.countDocuments({ status: 'attempted' });

  // User engagement metrics
  const userStats = await User.aggregate([
    {
      $group: {
        _id: null,
        avgProblemsSolved: { $avg: '$stats.totalSolved' },
        avgStreak: { $avg: '$stats.streak' },
        avgTimeSpent: { $avg: '$stats.totalTimeSpent' },
        totalTimeSpent: { $sum: '$stats.totalTimeSpent' }
      }
    }
  ]);

  // Recent user registrations
  const recentUsers = await User.find()
    .select('username email fullName role stats.lastActiveDate createdAt')
    .sort({ createdAt: -1 })
    .limit(10);

  // Most active users
  const mostActiveUsers = await User.find()
    .select('username email fullName stats.totalSolved stats.streak')
    .sort({ 'stats.totalSolved': -1 })
    .limit(10);

  // Topic popularity
  const topicPopularity = await Progress.aggregate([
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
        totalAttempts: { $sum: 1 },
        completedCount: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } }
      }
    },
    {
      $addFields: {
        completionRate: { $multiply: [{ $divide: ['$completedCount', '$totalAttempts'] }, 100] }
      }
    },
    { $sort: { totalAttempts: -1 } },
    { $limit: 10 }
  ]);

  // Daily activity for the last 30 days
  const dailyActivity = await Progress.aggregate([
    {
      $match: {
        updatedAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
      }
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$updatedAt' } },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  res.status(200).json({
    success: true,
    data: {
      overview: {
        totalUsers,
        activeUsers,
        totalProblems,
        totalTopics,
        totalProgressRecords,
        completedProblems,
        attemptedProblems
      },
      userMetrics: userStats[0] || {
        avgProblemsSolved: 0,
        avgStreak: 0,
        avgTimeSpent: 0,
        totalTimeSpent: 0
      },
      recentUsers,
      mostActiveUsers,
      topicPopularity,
      dailyActivity
    }
  });
});

// @desc    Get all users with their statistics
// @route   GET /api/admin/users
// @access  Private (Admin only)
exports.getAllUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, search = '', role = '', sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

  const query = {};
  if (search) {
    query.$or = [
      { username: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { fullName: { $regex: search, $options: 'i' } }
    ];
  }
  if (role) {
    query.role = role;
  }

  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

  const users = await User.find(query)
    .select('-password')
    .sort(sortOptions)
    .limit(parseInt(limit))
    .skip((parseInt(page) - 1) * parseInt(limit));

  const totalUsers = await User.countDocuments(query);

  res.status(200).json({
    success: true,
    data: {
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalUsers,
        pages: Math.ceil(totalUsers / parseInt(limit))
      }
    }
  });
});

// @desc    Get user details with activity
// @route   GET /api/admin/users/:userId
// @access  Private (Admin only)
exports.getUserDetails = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId).select('-password');
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  // Get user's progress statistics
  const progressStats = await Progress.aggregate([
    { $match: { userId: user._id } },
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
    { $match: { userId: user._id } },
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
  const recentActivity = await Progress.find({ userId: user._id })
    .populate('problemId', 'title difficulty')
    .populate('topicId', 'title')
    .sort({ updatedAt: -1 })
    .limit(20);

  // Get activity timeline (last 30 days)
  const activityTimeline = await Progress.aggregate([
    { $match: { userId: user._id } },
    {
      $match: {
        updatedAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
      }
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$updatedAt' } },
        problemsSolved: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
        problemsAttempted: { $sum: { $cond: [{ $eq: ['$status', 'attempted'] }, 1, 0] } },
        timeSpent: { $sum: '$timeSpent' }
      }
    },
    { $sort: { _id: 1 } }
  ]);

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
      user,
      progress: {
        total: stats.totalProblems,
        completed: stats.completedProblems,
        attempted: stats.attemptedProblems,
        percentage: stats.totalProblems > 0 ? Math.round((stats.completedProblems / stats.totalProblems) * 100) : 0,
        totalTimeSpent: stats.totalTimeSpent,
        avgConfidence: Math.round(stats.avgConfidence || 0)
      },
      topicProgress,
      recentActivity: recentActivity.map(activity => ({
        _id: activity._id,
        problemTitle: activity.problemId?.title,
        problemDifficulty: activity.problemId?.difficulty,
        topic: activity.topicId?.title,
        status: activity.status,
        date: activity.updatedAt,
        timeSpent: activity.timeSpent,
        confidence: activity.confidence
      })),
      activityTimeline
    }
  });
});

// @desc    Update user role
// @route   PUT /api/admin/users/:userId/role
// @access  Private (Admin only)
exports.updateUserRole = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { role } = req.body;

  if (!['student', 'moderator', 'admin'].includes(role)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid role. Must be student, moderator, or admin'
    });
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { role },
    { new: true, runValidators: true }
  ).select('-password');

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Delete user
// @route   DELETE /api/admin/users/:userId
// @access  Private (Admin only)
exports.deleteUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  // Delete user's progress records
  await Progress.deleteMany({ userId });

  // Delete user
  const user = await User.findByIdAndDelete(userId);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  res.status(200).json({
    success: true,
    message: 'User and all associated data deleted successfully'
  });
});

// @desc    Get platform analytics
// @route   GET /api/admin/analytics
// @access  Private (Admin only)
exports.getPlatformAnalytics = asyncHandler(async (req, res) => {
  const { period = '30' } = req.query; // days
  const startDate = new Date(Date.now() - parseInt(period) * 24 * 60 * 60 * 1000);

  // User growth
  const userGrowth = await User.aggregate([
    {
      $match: { createdAt: { $gte: startDate } }
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        newUsers: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  // Problem solving activity
  const problemActivity = await Progress.aggregate([
    {
      $match: { updatedAt: { $gte: startDate } }
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$updatedAt' } },
        problemsSolved: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
        problemsAttempted: { $sum: { $cond: [{ $eq: ['$status', 'attempted'] }, 1, 0] } },
        totalTimeSpent: { $sum: '$timeSpent' }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  // Topic engagement
  const topicEngagement = await Progress.aggregate([
    {
      $match: { updatedAt: { $gte: startDate } }
    },
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
        totalActivity: { $sum: 1 },
        completedCount: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
        avgTimeSpent: { $avg: '$timeSpent' }
      }
    },
    {
      $addFields: {
        completionRate: { $multiply: [{ $divide: ['$completedCount', '$totalActivity'] }, 100] }
      }
    },
    { $sort: { totalActivity: -1 } },
    { $limit: 10 }
  ]);

  // Difficulty distribution
  const difficultyDistribution = await Progress.aggregate([
    {
      $match: { updatedAt: { $gte: startDate } }
    },
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
        totalAttempts: { $sum: 1 },
        completedCount: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
        avgTimeSpent: { $avg: '$timeSpent' }
      }
    },
    {
      $addFields: {
        completionRate: { $multiply: [{ $divide: ['$completedCount', '$totalAttempts'] }, 100] }
      }
    }
  ]);

  res.status(200).json({
    success: true,
    data: {
      userGrowth,
      problemActivity,
      topicEngagement,
      difficultyDistribution
    }
  });
});
