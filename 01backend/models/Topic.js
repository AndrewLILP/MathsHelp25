const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxLength: 150
  },
  
  description: {
    type: String,
    required: true,
    maxLength: 500
  },
  
  // Reference to year group
  yearGroup: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'YearGroup',
    required: true
  },
  
  // Topic difficulty level
  difficulty: {
    type: String,
    enum: ['Foundation', 'Developing', 'Proficient', 'Advanced'],
    required: true
  },
  
  // Mathematical strand/content area
  strand: {
    type: String,
    enum: [
      'Number and Algebra',
      'Measurement and Geometry',
      'Statistics and Probability',
      'Mathematical Reasoning',
      'Problem Solving'
    ],
    required: true
  },
  
  // Key learning objectives
  learningObjectives: [{
    type: String,
    trim: true,
    maxLength: 200
  }],
  
  // Prerequisites (other topics)
  prerequisites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topic'
  }],
  
  // Estimated duration (in minutes)
  estimatedDuration: {
    type: Number,
    min: 15,
    max: 180,
    default: 60
  },
  
  // Keywords for search
  keywords: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  
  // Display order within year group
  displayOrder: {
    type: Number,
    default: 0
  },
  
  // Status
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Statistics
  activityCount: {
    type: Number,
    default: 0
  },
  
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  
  totalRatings: {
    type: Number,
    default: 0
  },
  
  // Engagement metrics
  viewCount: {
    type: Number,
    default: 0
  },
  
  lastAccessedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes
topicSchema.index({ yearGroup: 1, displayOrder: 1 });
topicSchema.index({ strand: 1, difficulty: 1 });
topicSchema.index({ keywords: 1 });
topicSchema.index({ isActive: 1 });
topicSchema.index({ averageRating: -1 });

module.exports = mongoose.model('Topic', topicSchema);