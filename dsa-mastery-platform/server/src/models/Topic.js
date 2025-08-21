const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Topic title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters'],
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [500, 'Description cannot exceed 500 characters'],
  },
  icon: {
    type: String,
    default: 'default-icon',
  },
  order: {
    type: Number,
    required: true,
    min: 0,
  },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner',
  },
  totalProblems: {
    type: Number,
    default: 0,
  },
  estimatedHours: {
    type: Number,
    default: 10,
  },
  prerequisites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topic',
  }],
  resources: [{
    type: {
      type: String,
      enum: ['video', 'article', 'book', 'course'],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
    author: String,
    duration: Number, // in minutes for videos
  }],
  tags: [String],
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
topicSchema.index({ slug: 1 });
topicSchema.index({ order: 1 });
topicSchema.index({ isActive: 1 });

// Virtual for problems
topicSchema.virtual('problems', {
  ref: 'Problem',
  localField: '_id',
  foreignField: 'topicId',
});

// Pre-save hook to generate slug
topicSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-');
  }
  next();
});

module.exports = mongoose.model('Topic', topicSchema);