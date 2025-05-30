// File: 01backend/routes/auth.js
// Complete auth routes file with proper Auth0 JWT integration

const express = require('express');
const router = express.Router();
const { checkJwt, getOrCreateUser } = require('../middleware/auth');
const User = require('../models/User');

// @route   GET /api/auth/me
// @desc    Get current user profile
// @access  Private
router.get('/me', checkJwt, getOrCreateUser, async (req, res) => {
  try {
    const user = await User.findById(req.currentUser._id)
      .populate('yearGroups', 'name yearLevel')
      .select('-auth0Id'); // Don't send Auth0 ID to frontend

    res.json({
      success: true,
      data: user
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
// @desc    Update user profile
// @access  Private
router.put('/profile', checkJwt, getOrCreateUser, async (req, res) => {
  try {
    const { name, mathsSpecialties, yearGroups, preferences } = req.body;
    
    const updateData = {};
    if (name) updateData.name = name;
    if (mathsSpecialties) updateData.mathsSpecialties = mathsSpecialties;
    if (yearGroups) updateData.yearGroups = yearGroups;
    if (preferences) updateData.preferences = preferences;

    const user = await User.findByIdAndUpdate(
      req.currentUser._id,
      updateData,
      { new: true, runValidators: true }
    ).populate('yearGroups', 'name yearLevel');

    res.json({
      success: true,
      data: user,
      message: 'Profile updated successfully'
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

// @route   PUT /api/auth/role
// @desc    Update user role (for role selection)
// @access  Private
router.put('/role', checkJwt, getOrCreateUser, async (req, res) => {
  try {
    const { role } = req.body;
    
    // Validate role
    const validRoles = ['teacher', 'student', 'admin'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be: teacher, student, or admin'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.currentUser._id,
      { role },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: { role: user.role },
      message: 'Role updated successfully'
    });
  } catch (error) {
    console.error('Error updating role:', error);
    res.status(400).json({
      success: false,
      message: 'Error updating role',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
});

// @route   GET /api/auth/stats
// @desc    Get user statistics
// @access  Private
router.get('/stats', checkJwt, getOrCreateUser, async (req, res) => {
  try {
    const user = req.currentUser;
    
    const stats = {
      contributedActivities: user.contributedActivities,
      ratingsGiven: user.ratingsGiven,
      joinedDate: user.createdAt,
      lastLogin: user.lastLoginAt,
      role: user.role
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
// @desc    Deactivate user account
// @access  Private
router.delete('/account', checkJwt, getOrCreateUser, async (req, res) => {
  try {
    await User.findByIdAndUpdate(
      req.currentUser._id,
      { isActive: false },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Account deactivated successfully'
    });
  } catch (error) {
    console.error('Error deactivating account:', error);
    res.status(500).json({
      success: false,
      message: 'Error deactivating account'
    });
  }
});

// @route   GET /api/auth/verify
// @desc    Verify token and get basic user info (useful for frontend)
// @access  Private
router.get('/verify', checkJwt, getOrCreateUser, async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        id: req.currentUser._id,
        name: req.currentUser.name,
        email: req.currentUser.email,
        role: req.currentUser.role,
        isActive: req.currentUser.isActive
      },
      message: 'Token verified successfully'
    });
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying token'
    });
  }
});

module.exports = router;