const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./auth');
const topicsRoutes = require('./topics');
const progressRoutes = require('./progress');
const userRoutes = require('./users');
const communityRoutes = require('./community');
const leaderboardRoutes = require('./leaderboard');

// Mount routes
router.use('/auth', authRoutes);
router.use('/topics', topicsRoutes);
router.use('/progress', progressRoutes);
router.use('/users', userRoutes);
router.use('/community', communityRoutes);
router.use('/leaderboard', leaderboardRoutes);

// API info endpoint
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'DSA Mastery API v1.0',
    endpoints: {
      auth: '/api/auth',
      topics: '/api/topics',
      progress: '/api/progress',
      users: '/api/users',
      community: '/api/community',
      leaderboard: '/api/leaderboard',
    },
    documentation: '/api/docs',
  });
});

module.exports = router;