const Topic = require('../models/Topic');
const Problem = require('../models/Problem');
const asyncHandler = require('../utils/asyncHandler');
const { MESSAGES, DEFAULT_PAGE_SIZE } = require('../config/constants');

// @desc    Get all topics
// @route   GET /api/topics
// @access  Public
exports.getTopics = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || DEFAULT_PAGE_SIZE;
  const sort = req.query.sort || 'order';

  const query = { isActive: true };

  const topics = await Topic.find(query)
    .sort(sort)
    .limit(limit)
    .skip((page - 1) * limit)
    .populate('prerequisites', 'title slug');

  const total = await Topic.countDocuments(query);

  res.status(200).json({
    success: true,
    data: topics,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

// @desc    Get single topic by slug
// @route   GET /api/topics/:slug
// @access  Public
exports.getTopic = asyncHandler(async (req, res) => {
  const topic = await Topic.findOne({ 
    slug: req.params.slug,
    isActive: true 
  })
    .populate('prerequisites', 'title slug')
    .populate({
      path: 'problems',
      select: 'title difficulty order tags',
      options: { sort: 'order' },
    });

  if (!topic) {
    return res.status(404).json({
      success: false,
      message: 'Topic not found',
    });
  }

  res.status(200).json({
    success: true,
    data: topic,
  });
});

// @desc    Create new topic
// @route   POST /api/topics
// @access  Private/Admin
exports.createTopic = asyncHandler(async (req, res) => {
  const { problems, ...topicData } = req.body;
  
  // Create the topic
  const topic = await Topic.create(topicData);

  // Create problems if provided
  if (problems && Array.isArray(problems) && problems.length > 0) {
    const problemsToCreate = problems.map(problem => {
      // Remove temporary ID and other fields that shouldn't be in new problems
      const { _id, id, createdAt, updatedAt, ...cleanProblem } = problem;
      return {
        ...cleanProblem,
        topicId: topic._id,
        isActive: true
      };
    });
    
    await Problem.insertMany(problemsToCreate);
    
    // Update topic with totalProblems count
    topic.totalProblems = problems.length;
    await topic.save();
  }

  // Fetch the topic with populated problems
  const populatedTopic = await Topic.findById(topic._id).populate('problems');

  res.status(201).json({
    success: true,
    message: MESSAGES.CRUD.CREATE_SUCCESS,
    data: populatedTopic,
  });
});

// @desc    Update topic
// @route   PUT /api/topics/:id
// @access  Private/Admin
exports.updateTopic = asyncHandler(async (req, res) => {
  const { problems, ...topicData } = req.body;
  
  // Update the topic
  const topic = await Topic.findByIdAndUpdate(
    req.params.id,
    topicData,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!topic) {
    return res.status(404).json({
      success: false,
      message: MESSAGES.CRUD.NOT_FOUND,
    });
  }

  // Handle problems update if provided
  if (problems && Array.isArray(problems)) {
    // Remove temporary IDs and update existing problems
    const problemsToUpdate = problems.filter(p => !p._id.startsWith('temp_'));
    const problemsToCreate = problems.filter(p => p._id.startsWith('temp_'));
    
    // Update existing problems
    for (const problem of problemsToUpdate) {
      await Problem.findByIdAndUpdate(problem._id, problem, { new: true });
    }
    
    // Create new problems
    if (problemsToCreate.length > 0) {
      const newProblems = problemsToCreate.map(problem => {
        // Remove temporary ID and other fields that shouldn't be in new problems
        const { _id, id, createdAt, updatedAt, ...cleanProblem } = problem;
        return {
          ...cleanProblem,
          topicId: topic._id,
          isActive: true
        };
      });
      
      await Problem.insertMany(newProblems);
    }
    
    // Update topic with totalProblems count
    topic.totalProblems = problems.length;
    await topic.save();
  }

  // Fetch the topic with populated problems
  const populatedTopic = await Topic.findById(topic._id).populate('problems');

  res.status(200).json({
    success: true,
    message: MESSAGES.CRUD.UPDATE_SUCCESS,
    data: populatedTopic,
  });
});

// @desc    Delete topic
// @route   DELETE /api/topics/:id
// @access  Private/Admin
exports.deleteTopic = asyncHandler(async (req, res) => {
  const topic = await Topic.findById(req.params.id);

  if (!topic) {
    return res.status(404).json({
      success: false,
      message: MESSAGES.CRUD.NOT_FOUND,
    });
  }

  // Soft delete
  topic.isActive = false;
  await topic.save();

  res.status(200).json({
    success: true,
    message: MESSAGES.CRUD.DELETE_SUCCESS,
  });
});

// @desc    Get problems for a topic
// @route   GET /api/topics/:slug/problems
// @access  Public
exports.getTopicProblems = asyncHandler(async (req, res) => {
  const topic = await Topic.findOne({ slug: req.params.slug });

  if (!topic) {
    return res.status(404).json({
      success: false,
      message: 'Topic not found',
    });
  }

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || DEFAULT_PAGE_SIZE;
  const difficulty = req.query.difficulty;

  const query = { 
    topicId: topic._id,
    isActive: true,
    ...(difficulty && { difficulty }),
  };

  const problems = await Problem.find(query)
    .sort('order')
    .limit(limit)
    .skip((page - 1) * limit)
    .select('-__v');

  const total = await Problem.countDocuments(query);

  // Get user progress if authenticated
  let progressMap = {};
  if (req.user) {
    const Progress = require('../models/Progress');
    const userProgress = await Progress.find({
      userId: req.user._id,
      topicId: topic._id,
    }).select('problemId status');

    progressMap = userProgress.reduce((acc, prog) => {
      acc[prog.problemId] = prog.status;
      return acc;
    }, {});
  }

  const problemsWithProgress = problems.map(problem => ({
    ...problem.toObject(),
    userStatus: progressMap[problem._id] || 'pending',
  }));

  res.status(200).json({
    success: true,
    data: problemsWithProgress,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

// @desc    Get resources for a topic
// @route   GET /api/topics/:slug/resources
// @access  Public
exports.getTopicResources = asyncHandler(async (req, res) => {
  const topic = await Topic.findOne({ 
    slug: req.params.slug,
    isActive: true 
  }).select('resources title');

  if (!topic) {
    return res.status(404).json({
      success: false,
      message: 'Topic not found',
    });
  }

  res.status(200).json({
    success: true,
    data: {
      topic: topic.title,
      resources: topic.resources,
    },
  });
});
