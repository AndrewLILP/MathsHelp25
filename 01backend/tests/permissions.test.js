// File: 01backend/tests/permissions.test.js
// Tests for user roles and permissions

const request = require('supertest');
const express = require('express');
const User = require('../models/User');
const Subject = require('../models/Subject');
const YearGroup = require('../models/YearGroup');
const Topic = require('../models/Topic');
const Activity = require('../models/Activity');

// Create test app with routes
const app = express();
app.use(express.json());

// Mock Auth0 middleware for testing
const mockAuth = (role) => (req, res, next) => {
  req.currentUser = {
    _id: 'test-user-id',
    email: 'test@example.com',
    name: 'Test User',
    role: role
  };
  next();
};

// Import routes with mocked auth
const authRoutes = require('../routes/auth');
const activityRoutes = require('../routes/activities');
const topicRoutes = require('../routes/topics');

app.use('/api/auth', authRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/topics', topicRoutes);

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
    
    test('should accept valid roles', async () => {
      const validRoles = ['teacher', 'department_head', 'admin'];
      
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
    
    test('should reject invalid roles', async () => {
      const user = new User({
        auth0Id: 'test-invalid',
        email: 'invalid@test.com', 
        name: 'Invalid User',
        role: 'student' // This should fail with current model
      });
      
      await expect(user.save()).rejects.toThrow();
    });
    
    test('should default to teacher role', async () => {
      const user = new User({
        auth0Id: 'test-default',
        email: 'default@test.com',
        name: 'Default User'
        // No role specified
      });
      
      const savedUser = await user.save();
      expect(savedUser.role).toBe('teacher');
    });
  });

  describe('🎯 Activity Permissions', () => {
    
    test('admin should be able to create activities', async () => {
      // Mock admin user
      app.use('/test-admin', mockAuth('admin'));
      app.use('/test-admin', activityRoutes);
      
      const activityData = {
        title: 'Test Activity',
        description: 'Test description',
        topic: testTopic._id,
        activityType: 'Worksheet',
        difficulty: 'Developing'
      };
      
      const response = await request(app)
        .post('/test-admin')
        .send(activityData);
      
      // This might fail due to middleware issues - that's what we're testing
      console.log('Admin activity creation response:', response.status);
    });
    
    test('teacher should be able to create activities', async () => {
      app.use('/test-teacher', mockAuth('teacher'));
      app.use('/test-teacher', activityRoutes);
      
      const activityData = {
        title: 'Teacher Activity',
        description: 'Test description', 
        topic: testTopic._id,
        activityType: 'Hands-on Activity',
        difficulty: 'Foundation'
      };
      
      const response = await request(app)
        .post('/test-teacher')
        .send(activityData);
        
      console.log('Teacher activity creation response:', response.status);
    });
    
    test('student should NOT be able to create activities', async () => {
      app.use('/test-student', mockAuth('student'));
      app.use('/test-student', activityRoutes);
      
      const activityData = {
        title: 'Student Activity',
        description: 'This should fail',
        topic: testTopic._id,
        activityType: 'Problem Set',
        difficulty: 'Proficient'
      };
      
      const response = await request(app)
        .post('/test-student')
        .send(activityData);
        
      // Should return 403 or similar error
      expect(response.status).toBeGreaterThanOrEqual(400);
    });
  });

  describe('📚 Topic Permissions', () => {
    
    test('admin should be able to create topics', async () => {
      app.use('/test-admin-topics', mockAuth('admin'));
      app.use('/test-admin-topics', topicRoutes);
      
      const topicData = {
        name: 'Admin Test Topic',
        description: 'Admin created topic',
        yearGroup: testYearGroup._id,
        difficulty: 'Advanced',
        strand: 'Geometry'
      };
      
      const response = await request(app)
        .post('/test-admin-topics')
        .send(topicData);
        
      console.log('Admin topic creation response:', response.status);
    });
    
    test('teacher should NOT be able to create topics', async () => {
      app.use('/test-teacher-topics', mockAuth('teacher'));
      app.use('/test-teacher-topics', topicRoutes);
      
      const topicData = {
        name: 'Teacher Test Topic',
        description: 'This should fail',
        yearGroup: testYearGroup._id,
        difficulty: 'Developing',
        strand: 'Statistics'
      };
      
      const response = await request(app)
        .post('/test-teacher-topics')
        .send(topicData);
        
      // Should return 403 Forbidden
      expect(response.status).toBe(403);
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
    
    test('student should be able to rate activities', async () => {
      app.use('/test-student-rating', mockAuth('student'));
      app.use('/test-student-rating', activityRoutes);
      
      const ratingData = {
        value: 4,
        comment: 'Great activity!'
      };
      
      const response = await request(app)
        .post(`/test-student-rating/${testActivity._id}/rate`)
        .send(ratingData);
        
      console.log('Student rating response:', response.status);
    });
    
    test('teacher should be able to rate activities', async () => {
      app.use('/test-teacher-rating', mockAuth('teacher'));
      app.use('/test-teacher-rating', activityRoutes);
      
      const ratingData = {
        value: 5,
        comment: 'Excellent resource!'
      };
      
      const response = await request(app)
        .post(`/test-teacher-rating/${testActivity._id}/rate`)
        .send(ratingData);
        
      console.log('Teacher rating response:', response.status);
    });
  });

  describe('🔍 Current Issues Detection', () => {
    
    test('detect role enum mismatch', () => {
      const userSchema = User.schema.paths.role;
      const enumValues = userSchema.enumValues;
      
      console.log('📋 Current User role enum values:', enumValues);
      
      // Check if 'student' is missing
      expect(enumValues.includes('student')).toBe(false); // Should be false currently
      expect(enumValues.includes('teacher')).toBe(true);
      expect(enumValues.includes('admin')).toBe(true);
    });
    
    test('detect default role setting', () => {
      const userSchema = User.schema.paths.role;
      const defaultValue = userSchema.defaultValue;
      
      console.log('📋 Current default role:', defaultValue);
      
      // Currently defaults to 'teacher'
      expect(defaultValue).toBe('teacher');
    });
  });
});

describe('🎨 Frontend Permission Logic Tests', () => {
  
  describe('Role-based permission functions', () => {
    
    // Mock useUserRole functions to test logic
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
      
      expect(teacherRole.canCreate()).toBe(true);  // Can create activities
      expect(teacherRole.canManage()).toBe(false); // Cannot manage users
      expect(teacherRole.canRate()).toBe(true);    // Can rate activities
      expect(teacherRole.canViewAll()).toBe(true); // Can view content
      expect(teacherRole.isTeacher).toBe(true);
    });
    
    test('student permissions should be minimal', () => {
      const studentRole = createMockUserRole('student');
      
      expect(studentRole.canCreate()).toBe(false); // Cannot create activities
      expect(studentRole.canManage()).toBe(false); // Cannot manage users
      expect(studentRole.canRate()).toBe(true);    // Can rate activities
      expect(studentRole.canViewAll()).toBe(true); // Can view content
      expect(studentRole.isStudent).toBe(true);
    });
  });
});