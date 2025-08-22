const User = require('../models/User');
const logger = require('../utils/logger');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get leaderboard
// @route   GET /api/leaderboard
// @access  Public
exports.getLeaderboard = asyncHandler(async (req, res) => {
  const { period = 'all-time', category = 'problems', limit = 10, page = 1 } = req.query;

  // Build sort criteria based on category
  let sortCriteria = {};
  switch (category) {
    case 'problems':
      sortCriteria = { 'stats.totalSolved': -1 };
      break;
    case 'streak':
      sortCriteria = { 'stats.streak': -1 };
      break;
    case 'accuracy':
      // You'd need to calculate accuracy from progress data
      sortCriteria = { 'stats.totalSolved': -1 };
      break;
    case 'time':
      sortCriteria = { 'stats.totalTimeSpent': -1 };
      break;
    default:
      sortCriteria = { 'stats.totalSolved': -1 };
  }

  // Add secondary sort criteria
  sortCriteria['stats.longestStreak'] = -1;

  const users = await User.find({ isActive: true })
    .select('username avatar role stats')
    .sort(sortCriteria)
    .limit(parseInt(limit))
    .skip((parseInt(page) - 1) * parseInt(limit));

  const total = await User.countDocuments({ isActive: true });

  // Calculate ranks and format data
  const leaderboard = users.map((user, index) => {
    const rank = (parseInt(page) - 1) * parseInt(limit) + index + 1;
    
    return {
      _id: user._id,
      rank,
      username: user.username,
      avatar: user.avatar,
      role: user.role,
      stats: {
        totalSolved: user.stats.totalSolved,
        easySolved: user.stats.easySolved,
        mediumSolved: user.stats.mediumSolved,
        hardSolved: user.stats.hardSolved,
        streak: user.stats.streak,
        longestStreak: user.stats.longestStreak,
        totalTimeSpent: user.stats.totalTimeSpent,
        accuracy: 85 // Mock accuracy - would need to calculate from progress data
      },
      achievements: getAchievementsForUser(user.stats),
      isCurrentUser: req.user ? user._id.toString() === req.user._id.toString() : false
    };
  });

  res.status(200).json({
    success: true,
    data: leaderboard,
    total,
    page: parseInt(page),
    limit: parseInt(limit),
    pages: Math.ceil(total / parseInt(limit))
  });
});

// @desc    Get user's rank
// @route   GET /api/leaderboard/rank
// @access  Private
exports.getUserRank = asyncHandler(async (req, res) => {
  const { period = 'all-time', category = 'problems' } = req.query;

  // Build sort criteria based on category
  let sortCriteria = {};
  switch (category) {
    case 'problems':
      sortCriteria = { 'stats.totalSolved': -1 };
      break;
    case 'streak':
      sortCriteria = { 'stats.streak': -1 };
      break;
    case 'accuracy':
      sortCriteria = { 'stats.totalSolved': -1 };
      break;
    case 'time':
      sortCriteria = { 'stats.totalTimeSpent': -1 };
      break;
    default:
      sortCriteria = { 'stats.totalSolved': -1 };
  }

  // Count users with better stats than current user
  let rankQuery = { isActive: true };
  
  switch (category) {
    case 'problems':
      rankQuery['stats.totalSolved'] = { $gt: req.user.stats.totalSolved };
      break;
    case 'streak':
      rankQuery['stats.streak'] = { $gt: req.user.stats.streak };
      break;
    case 'time':
      rankQuery['stats.totalTimeSpent'] = { $gt: req.user.stats.totalTimeSpent };
      break;
    default:
      rankQuery['stats.totalSolved'] = { $gt: req.user.stats.totalSolved };
  }

  const rank = await User.countDocuments(rankQuery) + 1;
  const total = await User.countDocuments({ isActive: true });

  res.status(200).json({
    success: true,
    data: {
      rank,
      total
    }
  });
});

// @desc    Get achievements
// @route   GET /api/leaderboard/achievements
// @access  Public
exports.getAchievements = asyncHandler(async (req, res) => {
  // Mock achievements - in real app, you'd have an achievements system
  const achievements = [
    {
      name: 'First Problem',
      description: 'Solved your first problem',
      icon: '🎯',
      unlocked: true
    },
    {
      name: 'Getting Started',
      description: 'Solved 10 problems',
      icon: '🚀',
      unlocked: true
    },
    {
      name: 'Problem Solver',
      description: 'Solved 50 problems',
      icon: '🏆',
      unlocked: false
    },
    {
      name: 'Century Club',
      description: 'Solved 100 problems',
      icon: '💎',
      unlocked: false
    },
    {
      name: 'Week Warrior',
      description: 'Maintained a 7-day streak',
      icon: '🔥',
      unlocked: true
    },
    {
      name: 'Monthly Master',
      description: 'Maintained a 30-day streak',
      icon: '👑',
      unlocked: false
    }
  ];

  res.status(200).json({
    success: true,
    data: achievements
  });
});

// @desc    Get leaderboard stats
// @route   GET /api/leaderboard/stats
// @access  Public
exports.getLeaderboardStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments({ isActive: true });
  const activeUsers = await User.countDocuments({
    'stats.lastActiveDate': { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
  });

  // Get top performers
  const topPerformer = await User.findOne({ isActive: true })
    .select('username stats')
    .sort({ 'stats.totalSolved': -1 });

  const longestStreak = await User.findOne({ isActive: true })
    .select('username stats')
    .sort({ 'stats.longestStreak': -1 });

  const stats = {
    totalUsers,
    activeUsers,
    topPerformer: {
      username: topPerformer?.username,
      problemsSolved: topPerformer?.stats.totalSolved || 0
    },
    longestStreak: {
      username: longestStreak?.username,
      streak: longestStreak?.stats.longestStreak || 0
    }
  };

  res.status(200).json({
    success: true,
    data: stats
  });
});

// Helper function to get achievements for a user
function getAchievementsForUser(stats) {
  const achievements = [];

  if (stats.totalSolved >= 1) {
    achievements.push('First Problem');
  }
  if (stats.totalSolved >= 10) {
    achievements.push('Getting Started');
  }
  if (stats.totalSolved >= 50) {
    achievements.push('Problem Solver');
  }
  if (stats.totalSolved >= 100) {
    achievements.push('Century Club');
  }
  if (stats.streak >= 7) {
    achievements.push('Week Warrior');
  }
  if (stats.streak >= 30) {
    achievements.push('Monthly Master');
  }

  return achievements;
}
