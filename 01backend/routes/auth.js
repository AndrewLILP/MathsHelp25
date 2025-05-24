const express = require('express');
const router = express.Router();
const { checkJwt, getOrCreateUser } = require('../middleware/noAuth');
const User = require('../models/User');

// @route   GET /api/auth/me
// @desc    Get current user profile (mock for testing)
// @access  Private
router.get('/me', checkJwt, getOrCreateUser, async (req, res) => {
  try {
    // Return mock user data for testing
    res.json({
      success: true,
      data: req.currentUser
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user profile',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
});

// @route   PUT /api/auth/profile
// @desc    Update user profile (mock for testing)
// @access  Private
router.put('/profile', checkJwt, getOrCreateUser, async (req, res) => {
  try {
    const { name, mathsSpecialties, yearGroups, preferences } = req.body;
    
    // Mock response for testing
    const updatedUser = {
      ...req.currentUser,
      name: name || req.currentUser.name,
      mathsSpecialties: mathsSpecialties || [],
      yearGroups: yearGroups || [],
      preferences: preferences || {}
    };

    res.json({
      success: true,
      data: updatedUser,
      message: 'Profile updated successfully (mock)'
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(400).json({
      success: false,
      message: 'Error updating profile',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
});

// @route   GET /api/auth/stats
// @desc    Get user statistics (mock for testing)
// @access  Private
router.get('/stats', checkJwt, getOrCreateUser, async (req, res) => {
  try {
    const stats = {
      contributedActivities: 5,
      ratingsGiven: 12,
      joinedDate: new Date('2024-01-01'),
      lastLogin: new Date(),
      role: 'teacher'
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user statistics'
    });
  }
});

// @route   DELETE /api/auth/account
// @desc    Deactivate user account (mock for testing)
// @access  Private
router.delete('/account', checkJwt, getOrCreateUser, async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Account deactivated successfully (mock)'
    });
  } catch (error) {
    console.error('Error deactivating account:', error);
    res.status(500).json({
      success: false,
      message: 'Error deactivating account'
    });
  }
});

module.exports = router;