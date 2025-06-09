// File: 01backend/models/User.js - FINAL VERSION
// Fixed duplicate index warnings

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // Auth0 user ID
  auth0Id: {
    type: String,
    required: true,
    unique: true
    // REMOVED: index: true (causing duplicate with schema.index below)
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
    // REMOVED: index: true (causing duplicate with schema.index below)
  },
  
  profileImage: {
    type: String,
    default: ''
  },
  
  // FIXED: Role-based access with student added and proper default
  role: {
    type: String,
    enum: ['student', 'teacher', 'department_head', 'admin'], // Added 'student'
    default: 'student' // CHANGED: Most users should start as students
  },
  
  // Teaching specialties within mathematics (only for teachers)
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
  
  // Year groups they teach (only for teachers)
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

// FIXED: Indexes for better performance (removed duplicates)
userSchema.index({ auth0Id: 1 });
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });

// ADDED: Middleware to clean up role-specific fields
userSchema.pre('save', function(next) {
  // If user is not a teacher, clear teaching-specific fields
  if (this.role === 'student') {
    this.mathsSpecialties = [];
    this.yearGroups = [];
  }
  next();
});

module.exports = mongoose.model('User', userSchema);