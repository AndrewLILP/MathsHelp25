
// File: 01backend/models/User.js

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // Auth0 user ID
  auth0Id: {
    type: String,
    required: true,
    unique: true
  },
  
  // Basic user information
  name: {
    type: String,
    required: true,
    trim: true,
    maxLength: 100
  },
  
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  
  profileImage: {
    type: String,
    default: ''
  },
  
  // Role-based access
  role: {
    type: String,
    enum: ['teacher', 'department_head', 'admin'],
    default: 'teacher'
  },
  
  // Teaching specialties within mathematics
  mathsSpecialties: [{
    type: String,
    enum: [
      'Primary Mathematics',
      'Algebra',
      'Geometry',
      'Statistics',
      'Calculus',
      'Trigonometry',
      'Number Theory',
      'Applied Mathematics',
      'Mathematical Reasoning'
    ]
  }],
  
  // Year groups they teach
  yearGroups: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'YearGroup'
  }],
  
  // User preferences
  preferences: {
    emailNotifications: {
      type: Boolean,
      default: true
    },
    resourceUpdates: {
      type: Boolean,
      default: true
    }
  },
  
  // Statistics
  contributedActivities: {
    type: Number,
    default: 0
  },
  
  ratingsGiven: {
    type: Number,
    default: 0
  },
  
  // Account status
  isActive: {
    type: Boolean,
    default: true
  },
  
  lastLoginAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for better performance
userSchema.index({ auth0Id: 1 });
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });

module.exports = mongoose.model('User', userSchema);