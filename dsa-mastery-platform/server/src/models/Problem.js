const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
  topicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topic',
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Problem title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters'],
  },
  description: {
    type: String,
    required: [true, 'Problem description is required'],
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: [true, 'Difficulty level is required'],
  },
  order: {
    type: Number,
    required: true,
    min: 0,
  },
  tags: [{
    type: String,
    lowercase: true,
    trim: true,
  }],
  companies: [{
    type: String,
    trim: true,
  }],
  frequency: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  links: {
    leetcode: {
      type: String,
      validate: {
        validator: function(v) {
          return !v || v.startsWith('https://leetcode.com/');
        },
        message: 'Invalid LeetCode URL',
      },
    },
    codeforces: {
      type: String,
      validate: {
        validator: function(v) {
          return !v || v.startsWith('https://codeforces.com/');
        },
        message: 'Invalid Codeforces URL',
      },
    },
    youtube: {
      type: String,
      validate: {
        validator: function(v) {
          return !v || v.includes('youtube.com/') || v.includes('youtu.be/');
        },
        message: 'Invalid YouTube URL',
      },
    },
    article: String,
    solution: String,
    editorial: String,
  },
  hints: [{
    type: String,
    maxlength: 500,
  }],
  estimatedTime: {
    type: Number,
    default: 30, // in minutes
    min: 5,
    max: 180,
  },
  concepts: [{
    type: String,
    trim: true,
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Indexes
problemSchema.index({ topicId: 1, order: 1 });
problemSchema.index({ difficulty: 1 });
problemSchema.index({ tags: 1 });
problemSchema.index({ companies: 1 });

// Update topic's total problems count
problemSchema.post('save', async function() {
  const Topic = mongoose.model('Topic');
  const count = await mongoose.model('Problem').countDocuments({ 
    topicId: this.topicId,
    isActive: true 
  });
  await Topic.findByIdAndUpdate(this.topicId, { totalProblems: count });
});

module.exports = mongoose.model('Problem', problemSchema);
