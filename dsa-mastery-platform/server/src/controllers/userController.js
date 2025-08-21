const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const { MESSAGES } = require('../config/constants');
const cloudinary = require('../utils/cloudinary');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
exports.getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .select('-password -refreshTokens');

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = asyncHandler(async (req, res) => {
  const fieldsToUpdate = {
    fullName: req.body.fullName,
    username: req.body.username,
    email: req.body.email,
  };

  // Remove undefined fields
  Object.keys(fieldsToUpdate).forEach(key => 
    fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
  );

  const user = await User.findByIdAndUpdate(
    req.user._id,
    fieldsToUpdate,
    {
      new: true,
      runValidators: true,
    }
  ).select('-password -refreshTokens');

  res.status(200).json({
    success: true,
    message: MESSAGES.CRUD.UPDATE_SUCCESS,
    data: user,
  });
});

// @desc    Update user preferences
// @route   PUT /api/users/preferences
// @access  Private
exports.updatePreferences = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { preferences: req.body },
    {
      new: true,
      runValidators: true,
    }
  ).select('preferences');

  res.status(200).json({
    success: true,
    message: 'Preferences updated successfully',
    data: user.preferences,
  });
});

// @desc    Upload user avatar
// @route   POST /api/users/avatar
// @access  Private
exports.uploadAvatar = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'Please upload an image',
    });
  }

  // Upload to cloudinary or save locally
  const avatarUrl = `/uploads/avatars/${req.file.filename}`;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { avatar: avatarUrl },
    { new: true }
  ).select('avatar');

  res.status(200).json({
    success: true,
    message: 'Avatar uploaded successfully',
    data: avatarUrl,
  });
});

// @desc    Get public user profile
// @route   GET /api/users/:username
// @access  Public
exports.getPublicProfile = asyncHandler(async (req, res) => {
  const user = await User.findOne({ 
    username: req.params.username,
    isActive: true,
  }).select('username fullName avatar stats createdAt');

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  // Get additional public stats
  const Progress = require('../models/Progress');
  const recentActivity = await Progress.find({ userId: user._id })
    .populate('problemId', 'title difficulty')
    .sort('-updatedAt')
    .limit(5)
    .select('status completedDate problemId');

  res.status(200).json({
    success: true,
    data: {
      user,
      recentActivity,
    },
  });
});

// @desc    Delete user account
// @route   DELETE /api/users/account
// @access  Private
exports.deleteAccount = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  // Soft delete
  user.isActive = false;
  user.email = `deleted_${user._id}_${user.email}`;
  user.username = `deleted_${user._id}_${user.username}`;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Account deleted successfully',
  });
});