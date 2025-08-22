const User = require('../models/User');
const logger = require('../utils/logger');
const asyncHandler = require('../utils/asyncHandler');

// Mock data for now - in a real app, you'd have a Post model
const mockPosts = [
  {
    _id: '1',
    author: {
      _id: 'user1',
      username: 'alex_coder',
      avatar: 'https://ui-avatars.com/api/?name=Alex+Coder&background=7C3AED&color=fff',
      role: 'student'
    },
    title: 'Efficient solution for Two Sum problem',
    content: 'I found an interesting approach using HashMap that reduces time complexity to O(n). Here\'s my solution...',
    problemTitle: 'Two Sum',
    topic: 'Arrays',
    difficulty: 'Easy',
    likes: 24,
    comments: 8,
    isLiked: false,
    isBookmarked: false,
    createdAt: '2024-01-15T10:30:00Z',
    tags: ['arrays', 'hashmap', 'two-sum']
  },
  {
    _id: '2',
    author: {
      _id: 'user2',
      username: 'dsa_master',
      avatar: 'https://ui-avatars.com/api/?name=DSA+Master&background=10B981&color=fff',
      role: 'moderator'
    },
    title: 'Understanding Binary Tree Traversals',
    content: 'Let me explain the three main traversal methods: inorder, preorder, and postorder with clear examples...',
    problemTitle: 'Binary Tree Inorder Traversal',
    topic: 'Trees',
    difficulty: 'Medium',
    likes: 45,
    comments: 12,
    isLiked: true,
    isBookmarked: true,
    createdAt: '2024-01-14T15:20:00Z',
    tags: ['trees', 'traversal', 'recursion']
  }
];

// @desc    Get community posts
// @route   GET /api/community/posts
// @access  Public
exports.getPosts = asyncHandler(async (req, res) => {
  const { type, topic, difficulty, page = 1, limit = 10 } = req.query;

  // Mock filtering - in real app, you'd query the database
  let filteredPosts = mockPosts;

  if (type) {
    // Filter by post type
  }

  if (topic) {
    filteredPosts = filteredPosts.filter(post => post.topic === topic);
  }

  if (difficulty) {
    filteredPosts = filteredPosts.filter(post => post.difficulty === difficulty);
  }

  // Mock pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

  res.status(200).json({
    success: true,
    data: paginatedPosts,
    total: filteredPosts.length,
    page: parseInt(page),
    limit: parseInt(limit),
    pages: Math.ceil(filteredPosts.length / limit)
  });
});

// @desc    Create a new post
// @route   POST /api/community/posts
// @access  Private
exports.createPost = asyncHandler(async (req, res) => {
  const { title, content, type, problemTitle, topic, difficulty, tags } = req.body;

  // In a real app, you'd save this to the database
  const newPost = {
    _id: Date.now().toString(),
    author: {
      _id: req.user._id,
      username: req.user.username,
      avatar: req.user.avatar,
      role: req.user.role
    },
    title,
    content,
    type,
    problemTitle,
    topic,
    difficulty,
    likes: 0,
    comments: 0,
    isLiked: false,
    isBookmarked: false,
    createdAt: new Date().toISOString(),
    tags: tags || []
  };

  mockPosts.unshift(newPost);

  res.status(201).json({
    success: true,
    data: newPost
  });
});

// @desc    Toggle like on a post
// @route   POST /api/community/posts/:postId/like
// @access  Private
exports.toggleLike = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  // In a real app, you'd update the database
  const post = mockPosts.find(p => p._id === postId);
  if (!post) {
    return res.status(404).json({
      success: false,
      message: 'Post not found'
    });
  }

  // Toggle like
  if (post.isLiked) {
    post.likes -= 1;
    post.isLiked = false;
  } else {
    post.likes += 1;
    post.isLiked = true;
  }

  res.status(200).json({
    success: true,
    message: post.isLiked ? 'Post liked' : 'Post unliked'
  });
});

// @desc    Toggle bookmark on a post
// @route   POST /api/community/posts/:postId/bookmark
// @access  Private
exports.toggleBookmark = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  // In a real app, you'd update the database
  const post = mockPosts.find(p => p._id === postId);
  if (!post) {
    return res.status(404).json({
      success: false,
      message: 'Post not found'
    });
  }

  post.isBookmarked = !post.isBookmarked;

  res.status(200).json({
    success: true,
    message: post.isBookmarked ? 'Post bookmarked' : 'Post unbookmarked'
  });
});

// @desc    Get post comments
// @route   GET /api/community/posts/:postId/comments
// @access  Private
exports.getComments = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  // Mock comments - in real app, you'd query the database
  const comments = [
    {
      _id: '1',
      author: {
        _id: 'user1',
        username: 'alex_coder',
        avatar: 'https://ui-avatars.com/api/?name=Alex+Coder&background=7C3AED&color=fff'
      },
      content: 'Great solution! I used a similar approach.',
      createdAt: '2024-01-15T11:00:00Z'
    }
  ];

  res.status(200).json({
    success: true,
    data: comments
  });
});

// @desc    Add comment to a post
// @route   POST /api/community/posts/:postId/comments
// @access  Private
exports.addComment = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const { content } = req.body;

  // In a real app, you'd save this to the database
  const newComment = {
    _id: Date.now().toString(),
    author: {
      _id: req.user._id,
      username: req.user.username,
      avatar: req.user.avatar
    },
    content,
    createdAt: new Date().toISOString()
  };

  res.status(201).json({
    success: true,
    data: newComment
  });
});

// @desc    Get online members
// @route   GET /api/community/members/online
// @access  Public
exports.getOnlineMembers = asyncHandler(async (req, res) => {
  // In a real app, you'd query users who were active in the last 5 minutes
  const onlineMembers = await User.find({
    'stats.lastActiveDate': { $gte: new Date(Date.now() - 5 * 60 * 1000) }
  })
  .select('username avatar role stats')
  .limit(10);

  const formattedMembers = onlineMembers.map(member => ({
    _id: member._id,
    username: member.username,
    avatar: member.avatar,
    role: member.role,
    stats: {
      totalSolved: member.stats.totalSolved,
      streak: member.stats.streak
    },
    isOnline: true,
    lastActive: '2 min ago'
  }));

  res.status(200).json({
    success: true,
    data: formattedMembers
  });
});

// @desc    Get top contributors
// @route   GET /api/community/members/top
// @access  Public
exports.getTopContributors = asyncHandler(async (req, res) => {
  const { limit = 10 } = req.query;

  const topContributors = await User.find({ isActive: true })
    .select('username avatar role stats')
    .sort({ 'stats.totalSolved': -1, 'stats.streak': -1 })
    .limit(parseInt(limit));

  const formattedContributors = topContributors.map(member => ({
    _id: member._id,
    username: member.username,
    avatar: member.avatar,
    role: member.role,
    stats: {
      totalSolved: member.stats.totalSolved,
      streak: member.stats.streak
    },
    isOnline: false,
    lastActive: '1 hour ago'
  }));

  res.status(200).json({
    success: true,
    data: formattedContributors
  });
});

// @desc    Get community stats
// @route   GET /api/community/stats
// @access  Public
exports.getCommunityStats = asyncHandler(async (req, res) => {
  const totalMembers = await User.countDocuments({ isActive: true });
  const activeToday = await User.countDocuments({
    'stats.lastActiveDate': { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
  });

  // Mock stats - in real app, you'd calculate these from actual data
  const stats = {
    totalMembers,
    activeToday,
    postsToday: 23,
    solutionsShared: 156
  };

  res.status(200).json({
    success: true,
    data: stats
  });
});
