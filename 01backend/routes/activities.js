// File: 01backend/routes/activities.js - PERMISSION FIXED
// Added missing requireRole middleware to POST route

const express = require('express');
const router = express.Router();
const { optionalAuth, getOptionalUser, checkJwt, getOrCreateUser, requireRole } = require('../middleware/auth');
const Activity = require('../models/Activity');
const Topic = require('../models/Topic');
const User = require('../models/User');

// @route   GET /api/activities
// @desc    Get all activities with filtering
// @access  Public
router.get('/', optionalAuth, getOptionalUser, async (req, res) => {
  try {
    const { 
      topic, 
      activityType, 
      difficulty, 
      search, 
      sortBy = 'rating', 
      page = 1, 
      limit = 20 
    } = req.query;
    
    const filter = { 
      isActive: true, 
      status: 'Published' 
    };
    
    if (topic) filter.topic = topic;
    if (activityType) filter.activityType = activityType;
    if (difficulty) filter.difficulty = difficulty;
    
    // Search functionality
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { keywords: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Sorting options
    let sortOptions = {};
    switch (sortBy) {
      case 'rating':
        sortOptions = { averageRating: -1, ratingCount: -1 };
        break;
      case 'newest':
        sortOptions = { createdAt: -1 };
        break;
      case 'popular':
        sortOptions = { viewCount: -1, bookmarkCount: -1 };
        break;
      case 'title':
        sortOptions = { title: 1 };
        break;
      default:
        sortOptions = { averageRating: -1 };
    }

    const skip = (page - 1) * limit;
    
    const activities = await Activity.find(filter)
      .populate('topic', 'name yearGroup')
      .populate({
        path: 'topic',
        populate: {
          path: 'yearGroup',
          select: 'name yearLevel subject',
          populate: {
            path: 'subject',
            select: 'name category'
          }
        }
      })
      .populate('createdBy', 'name')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    const totalCount = await Activity.countDocuments(filter);

    res.json({
      success: true,
      data: activities,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching activities'
    });
  }
});

// @route   GET /api/activities/topic/:topicId
// @desc    Get activities for a specific topic
// @access  Public
router.get('/topic/:topicId', optionalAuth, getOptionalUser, async (req, res) => {
  try {
    const { activityType, difficulty, sortBy = 'rating' } = req.query;
    
    const filter = { 
      topic: req.params.topicId, 
      isActive: true,
      status: 'Published'
    };
    
    if (activityType) filter.activityType = activityType;
    if (difficulty) filter.difficulty = difficulty;

    let sortOptions = {};
    switch (sortBy) {
      case 'rating':
        sortOptions = { averageRating: -1, ratingCount: -1 };
        break;
      case 'newest':
        sortOptions = { createdAt: -1 };
        break;
      case 'duration':
        sortOptions = { estimatedDuration: 1 };
        break;
      default:
        sortOptions = { averageRating: -1 };
    }

    const activities = await Activity.find(filter)
      .populate('createdBy', 'name role')
      .populate('topic', 'name')
      .sort(sortOptions);

    res.json({
      success: true,
      data: activities,
      count: activities.length
    });
  } catch (error) {
    console.error('Error fetching activities by topic:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching activities'
    });
  }
});

// @route   GET /api/activities/:id
// @desc    Get single activity by ID
// @access  Public
router.get('/:id', optionalAuth, getOptionalUser, async (req, res) => {
  try {
    const activity = await Activity.findOne({ 
      _id: req.params.id, 
      isActive: true 
    })
    .populate('topic', 'name description yearGroup strand')
    .populate({
      path: 'topic',
      populate: {
        path: 'yearGroup',
        select: 'name yearLevel subject',
        populate: {
          path: 'subject',
          select: 'name category colorTheme'
        }
      }
    })
    .populate('createdBy', 'name role')
    .populate('ratings.user', 'name');

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found'
      });
    }

    // Update view count
    activity.viewCount += 1;
    activity.lastAccessedAt = new Date();
    await activity.save();

    res.json({
      success: true,
      data: activity
    });
  } catch (error) {
    console.error('Error fetching activity:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching activity'
    });
  }
});

// @route   POST /api/activities
// @desc    Create new activity
// @access  Private (Teachers and above)
// FIXED: Added requireRole middleware to enforce permissions
router.post('/', checkJwt, getOrCreateUser, requireRole(['teacher', 'admin']), async (req, res) => {
  try {
    const { 
      title, 
      description, 
      topic, 
      activityType, 
      resources,
      source,
      difficulty,
      estimatedDuration,
      classSize,
      materialsNeeded,
      learningOutcomes,
      keywords 
    } = req.body;

    // Validate topic exists
    const topicExists = await Topic.findById(topic);
    if (!topicExists) {
      return res.status(400).json({
        success: false,
        message: 'Topic not found'
      });
    }

    const activity = new Activity({
      title,
      description,
      topic,
      createdBy: req.currentUser._id,
      activityType,
      resources: resources || [],
      source: source || 'User Contributed',
      difficulty,
      estimatedDuration: estimatedDuration || 30,
      classSize: classSize || { min: 1, max: 30 },
      materialsNeeded: materialsNeeded || [],
      learningOutcomes: learningOutcomes || [],
      keywords: keywords || []
    });

    await activity.save();
    await activity.populate('topic', 'name');
    await activity.populate('createdBy', 'name');

    // Update user's contribution count
    await User.findByIdAndUpdate(
      req.currentUser._id,
      { $inc: { contributedActivities: 1 } }
    );

    // Update topic's activity count
    await Topic.findByIdAndUpdate(
      topic,
      { $inc: { activityCount: 1 } }
    );

    res.status(201).json({
      success: true,
      data: activity,
      message: 'Activity created successfully'
    });
  } catch (error) {
    console.error('Error creating activity:', error);
    res.status(400).json({
      success: false,
      message: 'Error creating activity',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
});

// @route   PUT /api/activities/:id
// @desc    Update activity
// @access  Private (Activity creator, Department Head, or Admin)
router.put('/:id', checkJwt, getOrCreateUser, async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);
    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found'
      });
    }

    // Check permissions
    const user = req.currentUser;
    const isCreator = activity.createdBy.toString() === user._id.toString();
    const hasAdminRights = ['admin', 'department_head'].includes(user.role);
    
    if (!isCreator && !hasAdminRights) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions to update this activity'
      });
    }

    const { 
      title, 
      description, 
      activityType, 
      resources,
      difficulty,
      estimatedDuration,
      classSize,
      materialsNeeded,
      learningOutcomes,
      keywords,
      status 
    } = req.body;

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (activityType !== undefined) updateData.activityType = activityType;
    if (resources !== undefined) updateData.resources = resources;
    if (difficulty !== undefined) updateData.difficulty = difficulty;
    if (estimatedDuration !== undefined) updateData.estimatedDuration = estimatedDuration;
    if (classSize !== undefined) updateData.classSize = classSize;
    if (materialsNeeded !== undefined) updateData.materialsNeeded = materialsNeeded;
    if (learningOutcomes !== undefined) updateData.learningOutcomes = learningOutcomes;
    if (keywords !== undefined) updateData.keywords = keywords;
    if (status !== undefined) updateData.status = status;

    const updatedActivity = await Activity.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )
    .populate('topic', 'name')
    .populate('createdBy', 'name');

    res.json({
      success: true,
      data: updatedActivity,
      message: 'Activity updated successfully'
    });
  } catch (error) {
    console.error('Error updating activity:', error);
    res.status(400).json({
      success: false,
      message: 'Error updating activity',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
});

// @route   POST /api/activities/:id/rate
// @desc    Rate an activity
// @access  Private (All authenticated users can rate)
router.post('/:id/rate', checkJwt, getOrCreateUser, async (req, res) => {
  try {
    const { value, comment } = req.body;
    const userId = req.currentUser._id;

    if (!value || value < 1 || value > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating value must be between 1 and 5'
      });
    }

    const activity = await Activity.findById(req.params.id);
    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found'
      });
    }

    // Check if user already rated this activity
    const existingRatingIndex = activity.ratings.findIndex(
      rating => rating.user.toString() === userId.toString()
    );

    if (existingRatingIndex > -1) {
      // Update existing rating
      activity.ratings[existingRatingIndex].value = value;
      activity.ratings[existingRatingIndex].comment = comment;
    } else {
      // Add new rating
      activity.ratings.push({
        user: userId,
        value,
        comment
      });
      activity.ratingCount += 1;
      
      // Update user's rating count
      await User.findByIdAndUpdate(
        userId,
        { $inc: { ratingsGiven: 1 } }
      );
    }

    // Recalculate average rating
    const totalRating = activity.ratings.reduce((sum, rating) => sum + rating.value, 0);
    activity.averageRating = totalRating / activity.ratings.length;

    await activity.save();

    res.json({
      success: true,
      data: {
        averageRating: activity.averageRating,
        ratingCount: activity.ratingCount,
        userRating: value
      },
      message: 'Rating submitted successfully'
    });
  } catch (error) {
    console.error('Error rating activity:', error);
    res.status(400).json({
      success: false,
      message: 'Error submitting rating'
    });
  }
});

// @route   DELETE /api/activities/:id
// @desc    Soft delete activity
// @access  Private (Activity creator, Department Head, or Admin)
router.delete('/:id', checkJwt, getOrCreateUser, async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);
    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found'
      });
    }

    // Check permissions
    const user = req.currentUser;
    const isCreator = activity.createdBy.toString() === user._id.toString();
    const hasAdminRights = ['admin', 'department_head'].includes(user.role);
    
    if (!isCreator && !hasAdminRights) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions to delete this activity'
      });
    }

    // Soft delete
    activity.isActive = false;
    await activity.save();

    // Update topic's activity count
    await Topic.findByIdAndUpdate(
      activity.topic,
      { $inc: { activityCount: -1 } }
    );

    res.json({
      success: true,
      message: 'Activity deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting activity:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting activity'
    });
  }
});

// @route   GET /api/activities/types/list
// @desc    Get list of activity types
// @access  Public
router.get('/types/list', async (req, res) => {
  try {
    const types = await Activity.distinct('activityType', { isActive: true });
    
    res.json({
      success: true,
      data: types
    });
  } catch (error) {
    console.error('Error fetching activity types:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching activity types'
    });
  }
});

// @route   GET /api/activities/user/:userId
// @desc    Get activities created by a specific user
// @access  Public
router.get('/user/:userId', optionalAuth, getOptionalUser, async (req, res) => {
  try {
    const { status = 'Published' } = req.query;
    
    const filter = { 
      createdBy: req.params.userId,
      isActive: true
    };
    
    if (status) filter.status = status;

    const activities = await Activity.find(filter)
      .populate('topic', 'name yearGroup')
      .populate({
        path: 'topic',
        populate: {
          path: 'yearGroup',
          select: 'name yearLevel'
        }
      })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: activities,
      count: activities.length
    });
  } catch (error) {
    console.error('Error fetching user activities:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user activities'
    });
  }
});

module.exports = router;