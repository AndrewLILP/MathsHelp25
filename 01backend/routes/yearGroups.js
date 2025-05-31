const express = require('express');
const router = express.Router();
const { optionalAuth, getOptionalUser, checkJwt, getOrCreateUser, requireRole } = require('../middleware/auth');
const YearGroup = require('../models/YearGroup');
const Subject = require('../models/Subject');
const Topic = require('../models/Topic');

// @route   GET /api/year-groups
// @desc    Get all year groups or by subject
// @access  Public
router.get('/', optionalAuth, getOptionalUser, async (req, res) => {
  try {
    const { subject, yearLevel } = req.query;
    
    const filter = { isActive: true };
    if (subject) filter.subject = subject;
    if (yearLevel) filter.yearLevel = yearLevel;

    const yearGroups = await YearGroup.find(filter)
      .populate('subject', 'name category colorTheme')
      .sort({ yearLevel: 1, displayOrder: 1 });

    res.json({
      success: true,
      data: yearGroups,
      count: yearGroups.length
    });
  } catch (error) {
    console.error('Error fetching year groups:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching year groups'
    });
  }
});

// @route   GET /api/year-groups/subject/:subjectId
// @desc    Get year groups for a specific subject
// @access  Public
router.get('/subject/:subjectId', optionalAuth, getOptionalUser, async (req, res) => {
  try {
    const yearGroups = await YearGroup.find({ 
      subject: req.params.subjectId, 
      isActive: true 
    })
    .populate('subject', 'name category')
    .sort({ yearLevel: 1 });

    if (yearGroups.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No year groups found for this subject'
      });
    }

    res.json({
      success: true,
      data: yearGroups,
      count: yearGroups.length
    });
  } catch (error) {
    console.error('Error fetching year groups by subject:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching year groups'
    });
  }
});

// @route   GET /api/year-groups/:id
// @desc    Get single year group by ID
// @access  Public
router.get('/:id', optionalAuth, getOptionalUser, async (req, res) => {
  try {
    const yearGroup = await YearGroup.findOne({ 
      _id: req.params.id, 
      isActive: true 
    }).populate('subject', 'name category colorTheme iconType');

    if (!yearGroup) {
      return res.status(404).json({
        success: false,
        message: 'Year group not found'
      });
    }

    // Get topics for this year group
    const topics = await Topic.find({ 
      yearGroup: yearGroup._id, 
      isActive: true 
    }).sort({ displayOrder: 1, name: 1 });

    res.json({
      success: true,
      data: {
        ...yearGroup.toObject(),
        topics
      }
    });
  } catch (error) {
    console.error('Error fetching year group:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching year group'
    });
  }
});

// @route   POST /api/year-groups
// @desc    Create new year group
// @access  Private (Admin/Department Head only)
router.post('/', checkJwt, getOrCreateUser, requireRole(['admin', 'department_head']), async (req, res) => {
  try {
    const { name, subject, yearLevel, ageRange, curriculum, description, displayOrder } = req.body;

    // Validate subject exists
    const subjectExists = await Subject.findById(subject);
    if (!subjectExists) {
      return res.status(400).json({
        success: false,
        message: 'Subject not found'
      });
    }

    // Check if year level already exists for this subject
    const existingYearGroup = await YearGroup.findOne({ subject, yearLevel });
    if (existingYearGroup) {
      return res.status(400).json({
        success: false,
        message: 'Year level already exists for this subject'
      });
    }

    const yearGroup = new YearGroup({
      name,
      subject,
      yearLevel,
      ageRange,
      curriculum,
      description,
      displayOrder: displayOrder || yearLevel
    });

    await yearGroup.save();

    // Populate the subject details
    await yearGroup.populate('subject', 'name category');

    res.status(201).json({
      success: true,
      data: yearGroup,
      message: 'Year group created successfully'
    });
  } catch (error) {
    console.error('Error creating year group:', error);
    res.status(400).json({
      success: false,
      message: 'Error creating year group',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
});

// @route   PUT /api/year-groups/:id
// @desc    Update year group
// @access  Private (Admin/Department Head only)
router.put('/:id', checkJwt, getOrCreateUser, requireRole(['admin', 'department_head']), async (req, res) => {
  try {
    const { name, yearLevel, ageRange, curriculum, description, displayOrder, isActive } = req.body;

    const yearGroup = await YearGroup.findById(req.params.id);
    if (!yearGroup) {
      return res.status(404).json({
        success: false,
        message: 'Year group not found'
      });
    }

    // Check for duplicate year level if changing
    if (yearLevel && yearLevel !== yearGroup.yearLevel) {
      const existingYearGroup = await YearGroup.findOne({ 
        subject: yearGroup.subject,
        yearLevel: yearLevel,
        _id: { $ne: req.params.id }
      });
      if (existingYearGroup) {
        return res.status(400).json({
          success: false,
          message: 'Year level already exists for this subject'
        });
      }
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (yearLevel !== undefined) updateData.yearLevel = yearLevel;
    if (ageRange !== undefined) updateData.ageRange = ageRange;
    if (curriculum !== undefined) updateData.curriculum = curriculum;
    if (description !== undefined) updateData.description = description;
    if (displayOrder !== undefined) updateData.displayOrder = displayOrder;
    if (isActive !== undefined) updateData.isActive = isActive;

    const updatedYearGroup = await YearGroup.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('subject', 'name category');

    res.json({
      success: true,
      data: updatedYearGroup,
      message: 'Year group updated successfully'
    });
  } catch (error) {
    console.error('Error updating year group:', error);
    res.status(400).json({
      success: false,
      message: 'Error updating year group',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
});

// @route   DELETE /api/year-groups/:id
// @desc    Soft delete year group
// @access  Private (Admin only)
router.delete('/:id', checkJwt, getOrCreateUser, requireRole(['admin']), async (req, res) => {
  try {
    const yearGroup = await YearGroup.findById(req.params.id);
    if (!yearGroup) {
      return res.status(404).json({
        success: false,
        message: 'Year group not found'
      });
    }

    // Soft delete
    yearGroup.isActive = false;
    await yearGroup.save();

    // Also deactivate related topics
    await Topic.updateMany(
      { yearGroup: req.params.id },
      { isActive: false }
    );

    res.json({
      success: true,
      message: 'Year group deactivated successfully'
    });
  } catch (error) {
    console.error('Error deleting year group:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting year group'
    });
  }
});

module.exports = router;