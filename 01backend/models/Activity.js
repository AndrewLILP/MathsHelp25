// File: 01backend/models/Activity.js
const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxLength: 200
  },
  
  description: {
    type: String,
    required: true,
    maxLength: 1000
  },
  
  // Reference to topic
  topic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topic',
    required: true
  },
  
  // Who created this activity
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Activity type
  activityType: {
    type: String,
    enum: [
      'Worksheet',
      'Interactive Game',
      'Video Tutorial',
      'Hands-on Activity',
      'Problem Set',
      'Assessment',
      'Digital Tool',
      'Manipulative Activity',
      'Real-world Application'
    ],
    required: true
  },
  
  // Resource links and materials
  resources: [{
    title: {
      type: String,
      required: true,
      maxLength: 100
    },
    url: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['PDF', 'Website', 'Video', 'Interactive', 'Download', 'Other'],
      required: true
    },
    description: {
      type: String,
      maxLength: 200
    }
  }],
  
  // Source of the activity
  source: {
    type: String,
    enum: ['Internal', 'External', 'User Contributed'],
    required: true
  },
  
  // Difficulty and duration
  difficulty: {
    type: String,
    enum: ['Foundation', 'Developing', 'Proficient', 'Advanced'],
    required: true
  },
  
  estimatedDuration: {
    type: Number, // in minutes
    min: 5,
    max: 240,
    default: 30
  },
  
  // Class size recommendations
  classSize: {
    min: {
      type: Number,
      default: 1
    },
    max: {
      type: Number,
      default: 30
    }
  },
  
  // Materials needed
  materialsNeeded: [{
    type: String,
    trim: true,
    maxLength: 100
  }],
  
  // Learning outcomes
  learningOutcomes: [{
    type: String,
    trim: true,
    maxLength: 200
  }],
  
  // Keywords for search
  keywords: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  
  // Rating system
  ratings: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    value: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      maxLength: 300
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  
  ratingCount: {
    type: Number,
    default: 0
  },
  
  // Engagement metrics
  viewCount: {
    type: Number,
    default: 0
  },
  
  downloadCount: {
    type: Number,
    default: 0
  },
  
  bookmarkCount: {
    type: Number,
    default: 0
  },
  
  // Status and moderation
  status: {
    type: String,
    enum: ['Draft', 'Published', 'Under Review', 'Archived'],
    default: 'Published'
  },
  
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Moderation flags
  flagged: {
    type: Boolean,
    default: false
  },
  
  flagCount: {
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

// Indexes for performance
activitySchema.index({ topic: 1, status: 1 });
activitySchema.index({ createdBy: 1 });
activitySchema.index({ activityType: 1 });
activitySchema.index({ averageRating: -1 });
activitySchema.index({ keywords: 1 });
activitySchema.index({ createdAt: -1 });
activitySchema.index({ isActive: 1, status: 1 });

// Compound index for user ratings (prevent duplicate ratings)
activitySchema.index({ 'ratings.user': 1 }, { sparse: true });

module.exports = mongoose.model('Activity', activitySchema);