// File: 01backend/models/Activity.js - UPDATED VERSION
// Fixed source field to have default value

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
    maxLength: 2000
  },
  
  // Topic this activity belongs to
  topic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topic',
    required: true
  },
  
  // User who created this activity
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Type of activity
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
  
  // Digital resources and links
  resources: [{
    title: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['PDF', 'Website', 'Video', 'Interactive', 'Download', 'Other'],
      default: 'Website'
    },
    description: {
      type: String,
      default: ''
    }
  }],
  
  // FIXED: Source of the activity with default value
  source: {
    type: String,
    default: 'User Contributed' // ADDED: Default value to prevent validation errors
  },
  
  // Activity metadata
  difficulty: {
    type: String,
    enum: ['Foundation', 'Developing', 'Proficient', 'Advanced'],
    required: true
  },
  
  estimatedDuration: {
    type: Number, // minutes
    min: 5,
    max: 240,
    default: 30
  },
  
  classSize: {
    min: {
      type: Number,
      min: 1,
      default: 1
    },
    max: {
      type: Number,
      min: 1,
      default: 30
    }
  },
  
  // Teaching materials
  materialsNeeded: [{
    type: String,
    trim: true
  }],
  
  learningOutcomes: [{
    type: String,
    trim: true
  }],
  
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
      min: 1,
      max: 5,
      required: true
    },
    comment: {
      type: String,
      maxLength: 500
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  averageRating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  
  ratingCount: {
    type: Number,
    default: 0
  },
  
  // Statistics
  viewCount: {
    type: Number,
    default: 0
  },
  
  bookmarkCount: {
    type: Number,
    default: 0
  },
  
  // Status and visibility
  status: {
    type: String,
    enum: ['Draft', 'Published', 'Archived'],
    default: 'Published'
  },
  
  isActive: {
    type: Boolean,
    default: true
  },
  
  lastAccessedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for better query performance
activitySchema.index({ topic: 1, isActive: 1 });
activitySchema.index({ createdBy: 1 });
activitySchema.index({ averageRating: -1 });
activitySchema.index({ viewCount: -1 });
activitySchema.index({ createdAt: -1 });
activitySchema.index({ keywords: 1 });
activitySchema.index({ difficulty: 1, activityType: 1 });

// Text search index
activitySchema.index({
  title: 'text',
  description: 'text',
  keywords: 'text'
});

module.exports = mongoose.model('Activity', activitySchema);