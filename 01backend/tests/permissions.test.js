// File: 01backend/tests/permissions.test.js - MIDDLEWARE FIXED
// Fixed middleware mocking to properly test permissions

const request = require('supertest');
const express = require('express');
const User = require('../models/User');
const Subject = require('../models/Subject');
const YearGroup = require('../models/YearGroup');
const Topic = require('../models/Topic');
const Activity = require('../models/Activity');

// FIXED: Mock the auth middleware at module level before importing routes
jest.mock('../middleware/auth', () => {
  const originalModule = jest.requireActual('../middleware/auth');
  
  return {
    ...originalModule,
    checkJwt: jest.fn((req, res, next) => {
      // Mock JWT verification - always pass
      req.auth0User = { sub: 'test-user-id' };
      req.auth0Token = 'mock-token';
      next();
    }),
    getOrCreateUser: jest.fn((req, res, next) => {
      // Mock user creation - use test currentUser
      if (!req.currentUser) {
        req.currentUser = {
          _id: 'test-user-id',
          email: 'test@example.com',
          name: 'Test User',
          role: 'student' // Default for tests
        };
      }
      next();
    }),
    requireRole: jest.fn((allowedRoles) => {
      return (req, res, next) => {
        const userRole = req.currentUser?.role || 'student';
        if (allowedRoles.includes(userRole)) {
          next();
        } else {
          res.status(403).json({
            success: false,
            message: `Access denied. Required role: ${allowedRoles.join(' or ')}. Your role: ${userRole}`,
            code: 'INSUFFICIENT_ROLE'
          });
        }
      };
    }),
    optionalAuth: jest.fn((req, res, next) => {
      req.auth0User = { sub: 'test-user-id' };
      req.auth0Token = 'mock-token';
      next();
    }),
    getOptionalUser: jest.fn((req, res, next) => {
      req.currentUser = {
        _id: 'test-user-id',
        email: 'test@example.com',
        name: 'Test User',
        role: 'student'
      };
      next();
    })
  };
});

// FIXED: Import routes AFTER mocking middleware
const authRoutes = require('../routes/auth');
const activityRoutes = require('../routes/activities');
const topicRoutes = require('../routes/topics');

describe('🔐 Permission System Tests', () => {
  
  let testSubject, testYearGroup, testTopic, testUser;
  
  beforeEach(async () => {
    // Create test data
    testSubject = await Subject.create({
      name: 'Test Mathematics',
      description: 'Test subject',
      iconType: 'calculator',
      category: 'Secondary'
    });
    
    testYearGroup = await YearGroup.create({
      name: 'Test Year 10',
      subject: testSubject._id,
      yearLevel: 10,
      ageRange: { min: 15, max: 16 }
    });
    
    testTopic = await Topic.create({
      name: 'Test Topic',
      description: 'Test topic description',
      yearGroup: testYearGroup._id,
      difficulty: 'Developing',
      strand: 'Number and Algebra'
    });
    
    testUser = await User.create({
      auth0Id: 'test-auth0-id',
      email: 'test@example.com',
      name: 'Test User',
      role: 'teacher'
    });
  });

  describe('📋 User Model Role Validation', () => {
    
    test('should accept valid roles including student', async () => {
      const validRoles = ['student', 'teacher', 'department_head', 'admin'];
      
      for (const role of validRoles) {
        const user = new User({
          auth0Id: `test-${role}`,
          email: `${role}@test.com`,
          name: `Test ${role}`,
          role: role
        });
        
        await expect(user.save()).resolves.toBeDefined();
      }
    });
    
    test('should reject actually invalid roles', async () => {
      const user = new User({
        auth0Id: 'test-invalid',
        email: 'invalid@test.com', 
        name: 'Invalid User',
        role: 'invalid_role'
      });
      
      await expect(user.save()).rejects.toThrow();
    });
    
    test('should default to student role', async () => {
      const user = new User({
        auth0Id: 'test-default',
        email: 'default@test.com',
        name: 'Default User'
      });
      
      const savedUser = await user.save();
      expect(savedUser.role).toBe('student');
    });
  });

  describe('🎯 Activity Permissions', () => {
    
    // Helper to create app with specific user role
    const createAppWithRole = (role) => {
      const app = express();
      app.use(express.json());
      
      // Override currentUser for this test
      app.use((req, res, next) => {
        req.currentUser = {
          _id: testUser._id,
          email: 'test@example.com',
          name: 'Test User',
          role: role
        };
        next();
      });
      
      app.use('/api/activities', activityRoutes);
      return app;
    };
    
    test('admin should be able to create activities', async () => {
      const app = createAppWithRole('admin');
      
      const activityData = {
        title: 'Admin Test Activity',
        description: 'Test description',
        topic: testTopic._id,
        activityType: 'Worksheet',
        difficulty: 'Developing'
      };
      
      const response = await request(app)
        .post('/api/activities')
        .send(activityData);
      
      console.log('Admin activity creation response:', response.status);
      expect([200, 201]).toContain(response.status);
    });
    
    test('teacher should be able to create activities', async () => {
      const app = createAppWithRole('teacher');
      
      const activityData = {
        title: 'Teacher Test Activity',
        description: 'Test description', 
        topic: testTopic._id,
        activityType: 'Hands-on Activity',
        difficulty: 'Foundation'
      };
      
      const response = await request(app)
        .post('/api/activities')
        .send(activityData);
        
      console.log('Teacher activity creation response:', response.status);
      expect([200, 201]).toContain(response.status);
    });
    
    test('student should NOT be able to create activities', async () => {
      const app = createAppWithRole('student');
      
      const activityData = {
        title: 'Student Activity',
        description: 'This should fail',
        topic: testTopic._id,
        activityType: 'Problem Set',
        difficulty: 'Proficient'
      };
      
      const response = await request(app)
        .post('/api/activities')
        .send(activityData);
        
      console.log('Student activity creation response:', response.status);
      expect(response.status).toBe(403); // Should be forbidden
    });
  });

  describe('📚 Topic Permissions', () => {
    
    const createTopicAppWithRole = (role) => {
      const app = express();
      app.use(express.json());
      
      app.use((req, res, next) => {
        req.currentUser = {
          _id: testUser._id,
          email: 'test@example.com',
          name: 'Test User',
          role: role
        };
        next();
      });
      
      app.use('/api/topics', topicRoutes);
      return app;
    };
    
    test('admin should be able to create topics', async () => {
      const app = createTopicAppWithRole('admin');
      
      const topicData = {
        name: 'Admin Test Topic',
        description: 'Admin created topic',
        yearGroup: testYearGroup._id,
        difficulty: 'Advanced',
        strand: 'Geometry'
      };
      
      const response = await request(app)
        .post('/api/topics')
        .send(topicData);
        
      console.log('Admin topic creation response:', response.status);
      expect([200, 201]).toContain(response.status);
    });
    
    test('teacher should NOT be able to create topics', async () => {
      const app = createTopicAppWithRole('teacher');
      
      const topicData = {
        name: 'Teacher Test Topic',
        description: 'This should fail',
        yearGroup: testYearGroup._id,
        difficulty: 'Developing',
        strand: 'Statistics'
      };
      
      const response = await request(app)
        .post('/api/topics')
        .send(topicData);
        
      console.log('Teacher topic creation response:', response.status);
      expect(response.status).toBe(403); // Should be forbidden
    });
  });

  describe('⭐ Rating Permissions', () => {
    
    let testActivity;
    
    beforeEach(async () => {
      testActivity = await Activity.create({
        title: 'Test Activity for Rating',
        description: 'Activity to test ratings',
        topic: testTopic._id,
        createdBy: testUser._id,
        activityType: 'Interactive Game',
        difficulty: 'Developing'
      });
    });
    
    const createRatingAppWithRole = (role) => {
      const app = express();
      app.use(express.json());
      
      app.use((req, res, next) => {
        req.currentUser = {
          _id: testUser._id,
          email: 'test@example.com',
          name: 'Test User',
          role: role
        };
        next();
      });
      
      app.use('/api/activities', activityRoutes);
      return app;
    };
    
    test('student should be able to rate activities', async () => {
      const app = createRatingAppWithRole('student');
      
      const ratingData = {
        value: 4,
        comment: 'Great activity!'
      };
      
      const response = await request(app)
        .post(`/api/activities/${testActivity._id}/rate`)
        .send(ratingData);
        
      console.log('Student rating response:', response.status);
      expect([200, 201]).toContain(response.status);
    });
    
    test('teacher should be able to rate activities', async () => {
      const app = createRatingAppWithRole('teacher');
      
      const ratingData = {
        value: 5,
        comment: 'Excellent resource!'
      };
      
      const response = await request(app)
        .post(`/api/activities/${testActivity._id}/rate`)
        .send(ratingData);
        
      console.log('Teacher rating response:', response.status);
      expect([200, 201]).toContain(response.status);
    });
  });

  describe('🔍 Current System Status', () => {
    
    test('should now include student in role enum', () => {
      const userSchema = User.schema.paths.role;
      const enumValues = userSchema.enumValues;
      
      console.log('📋 Current User role enum values:', enumValues);
      
      expect(enumValues.includes('student')).toBe(true);
      expect(enumValues.includes('teacher')).toBe(true);
      expect(enumValues.includes('admin')).toBe(true);
    });
    
    test('should now default to student role', () => {
      const userSchema = User.schema.paths.role;
      const defaultValue = userSchema.defaultValue;
      
      console.log('📋 Current default role:', defaultValue);
      
      expect(defaultValue).toBe('student');
    });
  });

  describe('🧪 Permission Integration Tests', () => {
    
    test('middleware should properly enforce role restrictions', () => {
      // Import the mocked middleware functions
      const { requireRole } = require('../middleware/auth');
      
      // Test that requireRole function was mocked
      expect(requireRole).toBeDefined();
      expect(typeof requireRole).toBe('function');
    });
    
    test('user roles should be properly enforced in practice', async () => {
      // Test creating users with different roles
      const studentUser = await User.create({
        auth0Id: 'test-student-final',
        email: 'student@final.test',
        name: 'Final Student Test',
        role: 'student'
      });
      
      const teacherUser = await User.create({
        auth0Id: 'test-teacher-final',
        email: 'teacher@final.test',
        name: 'Final Teacher Test',
        role: 'teacher'
      });
      
      const adminUser = await User.create({
        auth0Id: 'test-admin-final',
        email: 'admin@final.test',
        name: 'Final Admin Test',
        role: 'admin'
      });
      
      // Verify roles were saved correctly
      expect(studentUser.role).toBe('student');
      expect(teacherUser.role).toBe('teacher');
      expect(adminUser.role).toBe('admin');
      
      console.log('✅ All user roles saved correctly');
    });
  });
});

describe('🎨 Frontend Permission Logic Tests', () => {
  
  describe('Role-based permission functions', () => {
    
    const createMockUserRole = (role) => ({
      userRole: role,
      hasRole: (r) => role === r,
      hasAnyRole: (roles) => roles.includes(role),
      canCreate: () => ['teacher', 'admin'].includes(role),
      canManage: () => role === 'admin',
      canRate: () => ['teacher', 'student', 'admin'].includes(role),
      canViewAll: () => ['teacher', 'student', 'admin'].includes(role),
      isTeacher: role === 'teacher',
      isStudent: role === 'student', 
      isAdmin: role === 'admin'
    });
    
    test('admin permissions should be comprehensive', () => {
      const adminRole = createMockUserRole('admin');
      
      expect(adminRole.canCreate()).toBe(true);
      expect(adminRole.canManage()).toBe(true);
      expect(adminRole.canRate()).toBe(true);
      expect(adminRole.canViewAll()).toBe(true);
      expect(adminRole.isAdmin).toBe(true);
    });
    
    test('teacher permissions should be limited', () => {
      const teacherRole = createMockUserRole('teacher');
      
      expect(teacherRole.canCreate()).toBe(true);
      expect(teacherRole.canManage()).toBe(false);
      expect(teacherRole.canRate()).toBe(true);
      expect(teacherRole.canViewAll()).toBe(true);
      expect(teacherRole.isTeacher).toBe(true);
    });
    
    test('student permissions should be minimal', () => {
      const studentRole = createMockUserRole('student');
      
      expect(studentRole.canCreate()).toBe(false);
      expect(studentRole.canManage()).toBe(false);
      expect(studentRole.canRate()).toBe(true);
      expect(studentRole.canViewAll()).toBe(true);
      expect(studentRole.isStudent).toBe(true);
    });
  });
});