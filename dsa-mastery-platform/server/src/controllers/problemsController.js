const Problem = require('../models/Problem');
const asyncHandler = require('../utils/asyncHandler');
const { MESSAGES, DEFAULT_PAGE_SIZE } = require('../config/constants');

// @desc    Get all problems
// @route   GET /api/topics/problems/all
// @access  Public
exports.getProblems = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || DEFAULT_PAGE_SIZE;
  const { difficulty, tags, company, search } = req.query;

  const query = { isActive: true };

  if (difficulty) query.difficulty = difficulty;
  if (tags) query.tags = { $in: tags.split(',') };
  if (company) query.companies = { $regex: company, $options: 'i' };
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  const problems = await Problem.find(query)
    .populate('topicId', 'title slug')
    .sort('-createdAt')
    .limit(limit)
    .skip((page - 1) * limit);

  const total = await Problem.countDocuments(query);

  res.status(200).json({
    success: true,
    data: problems,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

// @desc    Get single problem
// @route   GET /api/topics/problems/:id
// @access  Public
exports.getProblem = asyncHandler(async (req, res) => {
  const problem = await Problem.findById(req.params.id)
    .populate('topicId', 'title slug');

  if (!problem) {
    return res.status(404).json({
      success: false,
      message: 'Problem not found',
    });
  }

  // Get user progress if authenticated
  let userProgress = null;
  if (req.user) {
    const Progress = require('../models/Progress');
    userProgress = await Progress.findOne({
      userId: req.user._id,
      problemId: problem._id,
    });
  }

  res.status(200).json({
    success: true,
    data: {
      problem,
      userProgress,
    },
  });
});

// @desc    Create new problem
// @route   POST /api/topics/problems
// @access  Private/Admin/Moderator
exports.createProblem = asyncHandler(async (req, res) => {
  const problem = await Problem.create(req.body);

  res.status(201).json({
    success: true,
    message: MESSAGES.CRUD.CREATE_SUCCESS,
    data: problem,
  });
});

// @desc    Update problem
// @route   PUT /api/topics/problems/:id
// @access  Private/Admin/Moderator
exports.updateProblem = asyncHandler(async (req, res) => {
  const problem = await Problem.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!problem) {
    return res.status(404).json({
      success: false,
      message: MESSAGES.CRUD.NOT_FOUND,
    });
  }

  res.status(200).json({
    success: true,
    message: MESSAGES.CRUD.UPDATE_SUCCESS,
    data: problem,
  });
});

// @desc    Delete problem
// @route   DELETE /api/topics/problems/:id
// @access  Private/Admin
exports.deleteProblem = asyncHandler(async (req, res) => {
  const problem = await Problem.findById(req.params.id);

  if (!problem) {
    return res.status(404).json({
      success: false,
      message: MESSAGES.CRUD.NOT_FOUND,
    });
  }

  // Soft delete
  problem.isActive = false;
  await problem.save();

  res.status(200).json({
    success: true,
    message: MESSAGES.CRUD.DELETE_SUCCESS,
  });
});