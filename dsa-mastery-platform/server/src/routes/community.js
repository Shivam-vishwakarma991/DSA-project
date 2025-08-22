const express = require('express');
const { protect } = require('../middleware/auth');
const {
  getPosts,
  createPost,
  toggleLike,
  toggleBookmark,
  getComments,
  addComment,
  getOnlineMembers,
  getTopContributors,
  getCommunityStats,
} = require('../controllers/communityController');

const router = express.Router();

// Public routes
router.get('/posts', getPosts);
router.get('/members/online', getOnlineMembers);
router.get('/members/top', getTopContributors);
router.get('/stats', getCommunityStats);

// Protected routes
router.use(protect);

router.post('/posts', createPost);
router.post('/posts/:postId/like', toggleLike);
router.post('/posts/:postId/bookmark', toggleBookmark);
router.get('/posts/:postId/comments', getComments);
router.post('/posts/:postId/comments', addComment);

module.exports = router;
