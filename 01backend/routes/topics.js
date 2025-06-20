// File: 01backend/routes/topics.js
// Complete topics routes with GeoGebra interactive configuration support

const express = require('express');
const router = express.Router();
const { optionalAuth, getOptionalUser, checkJwt, getOrCreateUser, requireRole } = require('../middleware/auth');
const Topic = require('../models/Topic');
const YearGroup = require('../models/YearGroup');
const Activity = require('../models/Activity');

// @route   GET /api/topics
// @desc    Get all topics with filtering options
// @access  Public
router.get('/', optionalAuth, getOptionalUser, async (req, res) => {
  try {
    const { yearGroup, strand, difficulty, search } = req.query;
    
    const filter = { isActive: true };
    if (yearGroup) filter.yearGroup = yearGroup;
    if (strand) filter.strand = strand;
    if (difficulty) filter.difficulty = difficulty;
    
    // Search in name, description, and keywords
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { keywords: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const topics = await Topic.find(filter)
      .populate('yearGroup', 'name yearLevel subject')
      .populate({
        path: 'yearGroup',
        populate: {
          path: 'subject',
          select: 'name category colorTheme'
        }
      })
      .sort({ displayOrder: 1, name: 1 });

    res.json({
      success: true,
      data: topics,
      count: topics.length
    });
  } catch (error) {
    console.error('Error fetching topics:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching topics'
    });
  }
});

// @route   GET /api/topics/year-group/:yearGroupId
// @desc    Get topics for a specific year group
// @access  Public
router.get('/year-group/:yearGroupId', optionalAuth, getOptionalUser, async (req, res) => {
  try {
    const { strand, difficulty } = req.query;
    
    const filter = { 
      yearGroup: req.params.yearGroupId, 
      isActive: true 
    };
    if (strand) filter.strand = strand;
    if (difficulty) filter.difficulty = difficulty;

    const topics = await Topic.find(filter)
      .populate('yearGroup', 'name yearLevel')
      .sort({ displayOrder: 1, strand: 1, difficulty: 1 });

    res.json({
      success: true,
      data: topics,
      count: topics.length
    });
  } catch (error) {
    console.error('Error fetching topics by year group:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching topics'
    });
  }
});

// @route   GET /api/topics/:id
// @desc    Get single topic by ID with activities
// @access  Public
router.get('/:id', optionalAuth, getOptionalUser, async (req, res) => {
  try {
    const topic = await Topic.findOne({ 
      _id: req.params.id, 
      isActive: true 
    })
    .populate('yearGroup', 'name yearLevel subject')
    .populate({
      path: 'yearGroup',
      populate: {
        path: 'subject',
        select: 'name category colorTheme iconType'
      }
    })
    .populate('prerequisites', 'name difficulty');

    if (!topic) {
      return res.status(404).json({
        success: false,
        message: 'Topic not found'
      });
    }

    // Get activities for this topic
    const activities = await Activity.find({ 
      topic: topic._id, 
      isActive: true,
      status: 'Published'
    })
    .populate('createdBy', 'name')
    .sort({ averageRating: -1, createdAt: -1 });

    // Update view count
    topic.viewCount += 1;
    topic.lastAccessedAt = new Date();
    await topic.save();

    res.json({
      success: true,
      data: {
        ...topic.toObject(),
        activities
      }
    });
  } catch (error) {
    console.error('Error fetching topic:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching topic'
    });
  }
});

// @route   POST /api/topics
// @desc    Create new topic
// @access  Private (Teachers and above)
router.post('/', checkJwt, getOrCreateUser, async (req, res) => {
  try {
    const { 
      name, 
      description, 
      yearGroup, 
      difficulty, 
      strand, 
      learningObjectives,
      prerequisites,
      estimatedDuration,
      keywords,
      displayOrder 
    } = req.body;

    // Validate year group exists
    const yearGroupExists = await YearGroup.findById(yearGroup);
    if (!yearGroupExists) {
      return res.status(400).json({
        success: false,
        message: 'Year group not found'
      });
    }

    // Validate prerequisites exist if provided
    if (prerequisites && prerequisites.length > 0) {
      const prereqCount = await Topic.countDocuments({ 
        _id: { $in: prerequisites },
        isActive: true 
      });
      if (prereqCount !== prerequisites.length) {
        return res.status(400).json({
          success: false,
          message: 'One or more prerequisite topics not found'
        });
      }
    }

    const topic = new Topic({
      name,
      description,
      yearGroup,
      difficulty,
      strand,
      learningObjectives: learningObjectives || [],
      prerequisites: prerequisites || [],
      estimatedDuration: estimatedDuration || 60,
      keywords: keywords || [],
      displayOrder: displayOrder || 0
    });

    await topic.save();
    await topic.populate('yearGroup', 'name yearLevel');

    res.status(201).json({
      success: true,
      data: topic,
      message: 'Topic created successfully'
    });
  } catch (error) {
    console.error('Error creating topic:', error);
    res.status(400).json({
      success: false,
      message: 'Error creating topic',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
});

// @route   PUT /api/topics/:id
// @desc    Update topic
// @access  Private (Topic creator, Department Head, or Admin)
router.put('/:id', checkJwt, getOrCreateUser, async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.id);
    if (!topic) {
      return res.status(404).json({
        success: false,
        message: 'Topic not found'
      });
    }

    // Check permissions - only allow certain roles or topic creator
    const user = req.currentUser;
    if (!['admin', 'department_head'].includes(user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions to update this topic'
      });
    }

    const { 
      name, 
      description, 
      difficulty, 
      strand, 
      learningObjectives,
      prerequisites,
      estimatedDuration,
      keywords,
      displayOrder,
      isActive 
    } = req.body;

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (difficulty !== undefined) updateData.difficulty = difficulty;
    if (strand !== undefined) updateData.strand = strand;
    if (learningObjectives !== undefined) updateData.learningObjectives = learningObjectives;
    if (prerequisites !== undefined) updateData.prerequisites = prerequisites;
    if (estimatedDuration !== undefined) updateData.estimatedDuration = estimatedDuration;
    if (keywords !== undefined) updateData.keywords = keywords;
    if (displayOrder !== undefined) updateData.displayOrder = displayOrder;
    if (isActive !== undefined) updateData.isActive = isActive;

    const updatedTopic = await Topic.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('yearGroup', 'name yearLevel');

    res.json({
      success: true,
      data: updatedTopic,
      message: 'Topic updated successfully'
    });
  } catch (error) {
    console.error('Error updating topic:', error);
    res.status(400).json({
      success: false,
      message: 'Error updating topic',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
});

// @route   DELETE /api/topics/:id
// @desc    Soft delete topic
// @access  Private (Admin/Department Head only)
router.delete('/:id', checkJwt, getOrCreateUser, requireRole(['admin', 'department_head']), async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.id);
    if (!topic) {
      return res.status(404).json({
        success: false,
        message: 'Topic not found'
      });
    }

    // Soft delete
    topic.isActive = false;
    await topic.save();

    // Also deactivate related activities
    await Activity.updateMany(
      { topic: req.params.id },
      { isActive: false }
    );

    res.json({
      success: true,
      message: 'Topic deactivated successfully'
    });
  } catch (error) {
    console.error('Error deleting topic:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting topic'
    });
  }
});

// @route   GET /api/topics/strands/list
// @desc    Get list of available strands
// @access  Public
router.get('/strands/list', async (req, res) => {
  try {
    const strands = await Topic.distinct('strand', { isActive: true });
    
    res.json({
      success: true,
      data: strands
    });
  } catch (error) {
    console.error('Error fetching strands:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching strands'
    });
  }
});

// @route   GET /api/topics/popular
// @desc    Get popular topics (by view count and rating)
// @access  Public
router.get('/popular', optionalAuth, getOptionalUser, async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    const topics = await Topic.find({ isActive: true })
      .populate('yearGroup', 'name yearLevel subject')
      .populate({
        path: 'yearGroup',
        populate: {
          path: 'subject',
          select: 'name category'
        }
      })
      .sort({ averageRating: -1, viewCount: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: topics,
      count: topics.length
    });
  } catch (error) {
    console.error('Error fetching popular topics:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching popular topics',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
});

// @route   GET /api/topics/:id/interactive-config
// @desc    Get interactive tool configuration for a topic
// @access  Public
router.get('/:id/interactive-config', optionalAuth, getOptionalUser, async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.id);
    
    if (!topic) {
      return res.status(404).json({
        success: false,
        message: 'Topic not found'
      });
    }

    const config = getInteractiveConfig(topic.name);
    
    res.json({
      success: true,
      data: config
    });
  } catch (error) {
    console.error('Error fetching interactive config:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching interactive configuration'
    });
  }
});

// Helper function to determine interactive tool configuration based on topic name
function getInteractiveConfig(topicName) {
  const name = topicName.toLowerCase();
  
  if (name.includes('quadratic')) {
    return {
      type: 'quadratic',
      title: 'Quadratic Functions Explorer',
      description: 'Explore how coefficients affect parabolas: y = ax² + bx + c',
      geogebraApp: 'graphing',
      hasSliders: true,
      parameters: ['a', 'b', 'c'],
      defaultFunction: 'f(x) = a*x^2 + b*x + c',
      instructions: [
        'Adjust slider "a" to change the width and direction of the parabola',
        'Adjust slider "b" to shift the parabola horizontally',
        'Adjust slider "c" to shift the parabola vertically',
        'Watch how the vertex point moves as you change the parameters'
      ]
    };
  }
  
  if (name.includes('linear')) {
    return {
      type: 'linear',
      title: 'Linear Functions Explorer',
      description: 'Understand slope and y-intercept: y = mx + b',
      geogebraApp: 'graphing',
      hasSliders: true,
      parameters: ['m', 'b'],
      defaultFunction: 'f(x) = m*x + b',
      instructions: [
        'Adjust slider "m" to change the slope of the line',
        'Adjust slider "b" to change the y-intercept',
        'Notice how slope affects the steepness of the line',
        'Observe the y-intercept as the point where the line crosses the y-axis'
      ]
    };
  }

  if (name.includes('trigonometry') || name.includes('sine') || name.includes('cosine')) {
    return {
      type: 'trigonometric',
      title: 'Trigonometric Functions Explorer',
      description: 'Explore amplitude, frequency, and phase: y = A*sin(Bx + C)',
      geogebraApp: 'graphing',
      hasSliders: true,
      parameters: ['A', 'B', 'C'],
      defaultFunction: 'f(x) = A*sin(B*x + C)',
      instructions: [
        'Adjust "A" to change the amplitude (height) of the wave',
        'Adjust "B" to change the frequency (how compressed the wave is)',
        'Adjust "C" to shift the wave horizontally (phase shift)',
        'Compare with the basic sine function to see the differences'
      ]
    };
  }

  if (name.includes('circle') || name.includes('geometry')) {
    return {
      type: 'geometry',
      title: 'Geometric Explorer',
      description: 'Explore geometric shapes and relationships',
      geogebraApp: 'geometry',
      hasSliders: true,
      parameters: ['r'],
      defaultFunction: 'Circle with radius r',
      instructions: [
        'Adjust "r" to change the radius of the circle',
        'Drag points around the circle to explore relationships',
        'Use tools to measure angles and distances',
        'Observe geometric properties and theorems'
      ]
    };
  }

  // Default configuration for any other topics
  return {
    type: 'general',
    title: 'Mathematical Explorer',
    description: 'Interactive mathematical visualization',
    geogebraApp: 'graphing',
    hasSliders: true,
    parameters: ['a', 'b'],
    defaultFunction: 'f(x) = a*x + b',
    instructions: [
      'Use the sliders to adjust parameters',
      'Explore how changes affect the mathematical relationships',
      'Try different values and observe patterns',
      'Use the tools to investigate mathematical properties'
    ]
  };
}

module.exports = router;