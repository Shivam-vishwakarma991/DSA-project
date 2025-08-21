const express = require('express');
const router = express.Router();
const {
  getUserProgress,
  updateProgress,
  getStats,
  getStreak,
  getLeaderboard,
  resetProgress,
  getActivityHeatmap,
} = require('../controllers/progressController');
const { protect } = require('../middleware/auth');
const {
  validateProgress,
  validateMongoId,
  handleValidationErrors,
} = require('../middleware/validation');

// All routes require authentication
router.use(protect);

// Progress routes
router.get('/', getUserProgress);
router.post('/update', validateProgress, handleValidationErrors, updateProgress);
router.get('/stats', getStats);
router.get('/streak', getStreak);
router.get('/activity', getActivityHeatmap);
router.delete('/reset/:problemId', validateMongoId('problemId'), handleValidationErrors, resetProgress);

// Public leaderboard
router.get('/leaderboard', getLeaderboard);

module.exports = router;