const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  
  description: {
    type: String,
    required: true,
    maxLength: 500
  },
  
  // Icon identifier for UI
  iconType: {
    type: String,
    required: true,
    enum: [
      'calculator',
      'geometry',
      'statistics',
      'algebra',
      'calculus',
      'number-theory',
      'applied-maths',
      'reasoning'
    ]
  },
  
  // Color theme for the subject
  colorTheme: {
    type: String,
    default: '#6f42c1' // Purple default
  },
  
  // Subject categorization
  category: {
    type: String,
    enum: ['Primary', 'Secondary', 'Advanced'],
    required: true
  },
  
  // Display order
  displayOrder: {
    type: Number,
    default: 0
  },
  
  // Subject status
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Statistics
  totalTopics: {
    type: Number,
    default: 0
  },
  
  totalActivities: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes
subjectSchema.index({ category: 1, displayOrder: 1 });
subjectSchema.index({ isActive: 1 });

module.exports = mongoose.model('Subject', subjectSchema);