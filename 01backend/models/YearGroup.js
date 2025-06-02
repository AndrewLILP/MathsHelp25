// File: 01backend/models/YearGroup.js

const mongoose = require('mongoose');

const yearGroupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  
  // Reference to subject
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true
  },
  
  // Year level (e.g., 1, 2, 3... 12)
  yearLevel: {
    type: Number,
    required: true,
    min: 1,
    max: 12
  },
  
  // Age range
  ageRange: {
    min: {
      type: Number,
      required: true
    },
    max: {
      type: Number,
      required: true
    }
  },
  
  // Curriculum information
  curriculum: {
    type: String,
    enum: ['Australian Curriculum', 'NSW Syllabus', 'Victorian Curriculum', 'Other'],
    default: 'Australian Curriculum'
  },
  
  description: {
    type: String,
    maxLength: 300
  },
  
  // Display order within subject
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
  topicCount: {
    type: Number,
    default: 0
  },
  
  activityCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Compound indexes
yearGroupSchema.index({ subject: 1, yearLevel: 1 });
yearGroupSchema.index({ subject: 1, displayOrder: 1 });
yearGroupSchema.index({ isActive: 1 });

// Ensure unique year level per subject
yearGroupSchema.index({ subject: 1, yearLevel: 1 }, { unique: true });

module.exports = mongoose.model('YearGroup', yearGroupSchema);