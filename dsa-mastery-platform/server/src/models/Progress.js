const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  problemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem',
    required: true,
  },
  topicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topic',
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'attempted', 'completed', 'revisit'],
    default: 'pending',
  },
  notes: {
    type: String,
    maxlength: 2000,
  },
  code: {
    type: String,
  },
  language: {
    type: String,
    enum: ['javascript', 'python', 'java', 'cpp', 'go', 'rust'],
    default: 'javascript',
  },
  timeSpent: {
    type: Number,
    default: 0, // in minutes
  },
  attempts: {
    type: Number,
    default: 0,
  },
  lastAttemptDate: {
    type: Date,
    default: Date.now,
  },
  completedDate: {
    type: Date,
  },
  confidence: {
    type: Number,
    min: 1,
    max: 5,
    default: 3,
  },
  isBookmarked: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// Compound index for unique user-problem combination
progressSchema.index({ userId: 1, problemId: 1 }, { unique: true });
progressSchema.index({ userId: 1, status: 1 });
progressSchema.index({ userId: 1, topicId: 1 });

module.exports = mongoose.model('Progress', progressSchema);