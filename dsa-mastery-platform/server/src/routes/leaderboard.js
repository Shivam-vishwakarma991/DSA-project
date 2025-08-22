const express = require('express');
const { protect } = require('../middleware/auth');
const {
  getLeaderboard,
  getUserRank,
  getAchievements,
  getLeaderboardStats,
} = require('../controllers/leaderboardController');

const router = express.Router();

// Public routes
router.get('/', getLeaderboard);
router.get('/achievements', getAchievements);
router.get('/stats', getLeaderboardStats);

// Protected routes
router.use(protect);
router.get('/rank', getUserRank);

module.exports = router;
