const express = require('express');
const { protect } = require('../middleware/auth');
const {
  getUserProgress,
  getTopicProgress,
  updateProblemProgress,
  getStreakInfo,
  getRecentActivity,
  getTopicStats,
  getAchievements,
} = require('../controllers/progressController');

const router = express.Router();

// All routes require authentication
router.use(protect);

// Get user's overall progress
router.get('/user', getUserProgress);

// Get progress for a specific topic
router.get('/topic/:topicId', getTopicProgress);

// Update problem progress
router.put('/problem/:problemId', updateProblemProgress);

// Get user's streak information
router.get('/streak', getStreakInfo);

// Get recent activity
router.get('/recent', getRecentActivity);

// Get topic completion stats
router.get('/topics', getTopicStats);

// Get achievements
router.get('/achievements', getAchievements);

module.exports = router;