const Progress = require('../models/Progress');
const Problem = require('../models/Problem');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const { MESSAGES, DEFAULT_PAGE_SIZE } = require('../config/constants');
const { calculatePercentage, formatDuration } = require('../utils/helpers');

// @desc    Get user progress
// @route   GET /api/progress
// @access  Private
exports.getUserProgress = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || DEFAULT_PAGE_SIZE;
  const { status, topicId } = req.query;

  const query = { userId: req.user._id };

  if (status) query.status = status;
  if (topicId) query.topicId = topicId;

  const progress = await Progress.find(query)
    .populate('problemId', 'title difficulty tags')
    .populate('topicId', 'title slug')
    .sort('-updatedAt')
    .limit(limit)
    .skip((page - 1) * limit);

  const total = await Progress.countDocuments(query);

  res.status(200).json({
    success: true,
    data: progress,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

// @desc    Update progress
// @route   POST /api/progress/update
// @access  Private
exports.updateProgress = asyncHandler(async (req, res) => {
  const { problemId, status, timeSpent, confidence, notes } = req.body;

  let progress = await Progress.findOne({
    userId: req.user._id,
    problemId,
  });

  if (progress) {
    // Update existing progress
    progress.status = status;
    progress.timeSpent = timeSpent || progress.timeSpent;
    progress.confidence = confidence || progress.confidence;
    progress.notes = notes || progress.notes;
    progress.attempts += 1;
    progress.lastAttempted = new Date();
  } else {
    // Create new progress
    progress = await Progress.create({
      userId: req.user._id,
      problemId,
      status,
      timeSpent,
      confidence,
      notes,
      attempts: 1,
      firstAttempted: new Date(),
      lastAttempted: new Date(),
    });
  }

  await progress.save();

  // Update user stats
  await updateUserStats(req.user._id, status);

  res.status(200).json({
    success: true,
    message: 'Progress updated successfully',
    data: progress,
  });
});

// @desc    Get user stats
// @route   GET /api/progress/stats
// @access  Private
exports.getStats = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  
  const totalProblems = await Problem.countDocuments({ isActive: true });
  const completedProblems = await Progress.countDocuments({
    userId: req.user._id,
    status: 'completed',
  });

  const stats = {
    totalSolved: user.stats.totalSolved,
    easySolved: user.stats.easySolved,
    mediumSolved: user.stats.mediumSolved,
    hardSolved: user.stats.hardSolved,
    streak: user.stats.streak,
    longestStreak: user.stats.longestStreak,
    totalTimeSpent: formatDuration(user.stats.totalTimeSpent),
    completionRate: calculatePercentage(completedProblems, totalProblems),
    rank: await calculateUserRank(req.user._id),
  };

  res.status(200).json({
    success: true,
    data: stats,
  });
});

// @desc    Get user streak
// @route   GET /api/progress/streak
// @access  Private
exports.getStreak = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  res.status(200).json({
    success: true,
    data: {
      currentStreak: user.stats.streak,
      longestStreak: user.stats.longestStreak,
      lastActiveDate: user.stats.lastActiveDate,
    },
  });
});

// @desc    Get leaderboard
// @route   GET /api/progress/leaderboard
// @access  Public
exports.getLeaderboard = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;

  const users = await User.find({ isActive: true })
    .select('username fullName avatar stats')
    .sort({ 'stats.totalSolved': -1, 'stats.longestStreak': -1 })
    .limit(limit)
    .skip((page - 1) * limit);

  const total = await User.countDocuments({ isActive: true });

  res.status(200).json({
    success: true,
    data: users,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

// @desc    Reset progress for a problem
// @route   DELETE /api/progress/reset/:problemId
// @access  Private
exports.resetProgress = asyncHandler(async (req, res) => {
  const progress = await Progress.findOneAndDelete({
    userId: req.user._id,
    problemId: req.params.problemId,
  });

  if (!progress) {
    return res.status(404).json({
      success: false,
      message: 'Progress not found',
    });
  }

  res.status(200).json({
    success: true,
    message: 'Progress reset successfully',
  });
});

// @desc    Get activity heatmap
// @route   GET /api/progress/activity
// @access  Private
exports.getActivityHeatmap = asyncHandler(async (req, res) => {
  const days = parseInt(req.query.days) || 365;
  const endDate = new Date();
  const startDate = new Date(endDate.getTime() - (days * 24 * 60 * 60 * 1000));

  const activity = await Progress.aggregate([
    {
      $match: {
        userId: req.user._id,
        lastAttempted: { $gte: startDate, $lte: endDate },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$lastAttempted' },
        },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);

  res.status(200).json({
    success: true,
    data: activity,
  });
});

// Helper function to update user stats
const updateUserStats = async (userId, status) => {
  const user = await User.findById(userId);
  
  if (status === 'completed') {
    user.stats.totalSolved += 1;
    // Update difficulty-specific stats based on problem difficulty
    // This would need to be implemented based on the problem difficulty
  }

  user.stats.lastActiveDate = new Date();
  await user.save();
};

// Helper function to calculate user rank
const calculateUserRank = async (userId) => {
  const user = await User.findById(userId);
  const rank = await User.countDocuments({
    'stats.totalSolved': { $gt: user.stats.totalSolved },
  });
  return rank + 1;
};