// File: 01backend/routes/subjects.js

const express = require('express');
const router = express.Router();
const { optionalAuth, getOptionalUser, checkJwt, getOrCreateUser, requireRole } = require('../middleware/auth');
const Subject = require('../models/Subject');
const YearGroup = require('../models/YearGroup');

// @route   GET /api/subjects
// @desc    Get all active subjects
// @access  Public
router.get('/', optionalAuth, getOptionalUser, async (req, res) => {
  try {
    const { category } = req.query;
    
    const filter = { isActive: true };
    if (category) {
      filter.category = category;
    }

    const subjects = await Subject.find(filter)
      .sort({ category: 1, displayOrder: 1, name: 1 });

    res.json({
      success: true,
      data: subjects,
      count: subjects.length
    });
  } catch (error) {
    console.error('Error fetching subjects:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching subjects'
    });
  }
});

// @route   GET /api/subjects/:id
// @desc    Get single subject by ID
// @access  Public
router.get('/:id', optionalAuth, getOptionalUser, async (req, res) => {
  try {
    const subject = await Subject.findOne({ 
      _id: req.params.id, 
      isActive: true 
    });

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found'
      });
    }

    // Get year groups for this subject
    const yearGroups = await YearGroup.find({ 
      subject: subject._id, 
      isActive: true 
    }).sort({ yearLevel: 1 });

    res.json({
      success: true,
      data: {
        ...subject.toObject(),
        yearGroups
      }
    });
  } catch (error) {
    console.error('Error fetching subject:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching subject'
    });
  }
});

// @route   POST /api/subjects
// @desc    Create new subject
// @access  Private (Admin/Department Head only)
router.post('/', checkJwt, getOrCreateUser, requireRole(['admin', 'department_head']), async (req, res) => {
  try {
    const { name, description, iconType, colorTheme, category, displayOrder } = req.body;

    // Check if subject already exists
    const existingSubject = await Subject.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    if (existingSubject) {
      return res.status(400).json({
        success: false,
        message: 'Subject with this name already exists'
      });
    }

    const subject = new Subject({
      name,
      description,
      iconType,
      colorTheme,
      category,
      displayOrder: displayOrder || 0
    });

    await subject.save();

    res.status(201).json({
      success: true,
      data: subject,
      message: 'Subject created successfully'
    });
  } catch (error) {
    console.error('Error creating subject:', error);
    res.status(400).json({
      success: false,
      message: 'Error creating subject',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
});

// @route   PUT /api/subjects/:id
// @desc    Update subject
// @access  Private (Admin/Department Head only)
router.put('/:id', checkJwt, getOrCreateUser, requireRole(['admin', 'department_head']), async (req, res) => {
  try {
    const { name, description, iconType, colorTheme, category, displayOrder, isActive } = req.body;

    const subject = await Subject.findById(req.params.id);
    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found'
      });
    }

    // Check for duplicate name if name is being changed
    if (name && name !== subject.name) {
      const existingSubject = await Subject.findOne({ 
        name: { $regex: new RegExp(`^${name}$`, 'i') },
        _id: { $ne: req.params.id }
      });
      if (existingSubject) {
        return res.status(400).json({
          success: false,
          message: 'Subject with this name already exists'
        });
      }
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (iconType !== undefined) updateData.iconType = iconType;
    if (colorTheme !== undefined) updateData.colorTheme = colorTheme;
    if (category !== undefined) updateData.category = category;
    if (displayOrder !== undefined) updateData.displayOrder = displayOrder;
    if (isActive !== undefined) updateData.isActive = isActive;

    const updatedSubject = await Subject.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: updatedSubject,
      message: 'Subject updated successfully'
    });
  } catch (error) {
    console.error('Error updating subject:', error);
    res.status(400).json({
      success: false,
      message: 'Error updating subject',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
});

// @route   DELETE /api/subjects/:id
// @desc    Soft delete subject (set isActive to false)
// @access  Private (Admin only)
router.delete('/:id', checkJwt, getOrCreateUser, requireRole(['admin']), async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found'
      });
    }

    // Soft delete - set isActive to false
    subject.isActive = false;
    await subject.save();

    // Also deactivate related year groups
    await YearGroup.updateMany(
      { subject: req.params.id },
      { isActive: false }
    );

    res.json({
      success: true,
      message: 'Subject deactivated successfully'
    });
  } catch (error) {
    console.error('Error deleting subject:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting subject'
    });
  }
});

// @route   GET /api/subjects/categories/list
// @desc    Get list of subject categories
// @access  Public
router.get('/categories/list', async (req, res) => {
  try {
    const categories = await Subject.distinct('category', { isActive: true });
    
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching categories'
    });
  }
});

module.exports = router;