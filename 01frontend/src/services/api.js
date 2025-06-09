// File: 01frontend/src/services/api.js - FIXED AUTH TOKEN
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Create axios instance
const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Store the Auth0 token getter function
let getAuth0Token = null;

// Function to set the token getter (called by components with Auth0 access)
export const setAuth0TokenGetter = (tokenGetter) => {
  getAuth0Token = tokenGetter;
};

// Request interceptor for adding auth token
api.interceptors.request.use(
  async (config) => {
    // Get Auth0 token if available
    try {
      if (getAuth0Token) {
        const token = await getAuth0Token();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
          console.log('✅ Auth token added to request');
        } else {
          console.log('⚠️ No auth token available');
        }
      } else {
        console.log('⚠️ Auth token getter not set');
      }
    } catch (error) {
      console.log('❌ Error getting auth token:', error.message);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Mock data function for development
const getMockActivities = (topicId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          _id: '1',
          title: 'Balance Method for Linear Equations',
          description: 'Students use physical balance scales to understand the concept of maintaining equality when solving linear equations. This hands-on approach helps visualize algebraic operations.',
          activityType: 'Hands-on Activity',
          difficulty: 'Developing',
          estimatedDuration: 45,
          classSize: { min: 2, max: 30 },
          materialsNeeded: ['Balance scales', 'Algebra tiles', 'Worksheets'],
          learningOutcomes: [
            'Understand equality in equations',
            'Solve simple linear equations',
            'Connect physical actions to algebraic operations'
          ],
          keywords: ['linear equations', 'balance method', 'equality'],
          resources: [
            {
              title: 'Interactive Balance Tool',
              url: 'https://www.mathplayground.com/algebra_balance.html',
              type: 'Interactive',
              description: 'Online balance scale for practicing equation solving'
            }
          ],
          averageRating: 4.2,
          ratingCount: 18,
          viewCount: 156,
          createdBy: {
            name: 'Sarah Johnson',
            _id: 'teacher1'
          },
          topic: topicId,
          createdAt: new Date('2024-01-15')
        },
        {
          _id: '2',
          title: 'Quadratic Function Exploration',
          description: 'Interactive exploration of quadratic functions using graphing technology. Students investigate how parameters affect the shape and position of parabolas.',
          activityType: 'Digital Tool',
          difficulty: 'Proficient',
          estimatedDuration: 60,
          classSize: { min: 1, max: 25 },
          materialsNeeded: ['Computers/tablets', 'Graphing software', 'Student handout'],
          learningOutcomes: [
            'Understand quadratic function properties',
            'Analyze parameter effects on graphs',
            'Use technology for mathematical exploration'
          ],
          keywords: ['quadratic functions', 'parabolas', 'graphing', 'technology'],
          resources: [
            {
              title: 'Desmos Graphing Calculator',
              url: 'https://www.desmos.com/calculator',
              type: 'Website',
              description: 'Free online graphing calculator'
            },
            {
              title: 'Activity Worksheet',
              url: 'https://example.com/quadratic-worksheet.pdf',
              type: 'PDF',
              description: 'Student exploration guide'
            }
          ],
          averageRating: 4.7,
          ratingCount: 23,
          viewCount: 198,
          createdBy: {
            name: 'Michael Chen',
            _id: 'teacher2'
          },
          topic: topicId,
          createdAt: new Date('2024-02-03')
        },
        {
          _id: '3',
          title: 'Real-World Trigonometry',
          description: 'Students measure angles and distances around the school to solve real-world problems using trigonometric ratios. Includes finding building heights and distances.',
          activityType: 'Real-world Application',
          difficulty: 'Advanced',
          estimatedDuration: 90,
          classSize: { min: 3, max: 20 },
          materialsNeeded: ['Clinometers', 'Measuring tapes', 'Calculators', 'Recording sheets'],
          learningOutcomes: [
            'Apply trigonometric ratios to real problems',
            'Use measurement tools effectively',
            'Connect mathematics to practical situations'
          ],
          keywords: ['trigonometry', 'measurement', 'real-world', 'applications'],
          resources: [
            {
              title: 'DIY Clinometer Instructions',
              url: 'https://example.com/clinometer-diy.pdf',
              type: 'PDF',
              description: 'How to make simple angle measuring tools'
            }
          ],
          averageRating: 4.5,
          ratingCount: 12,
          viewCount: 87,
          createdBy: {
            name: 'Lisa Park',
            _id: 'teacher3'
          },
          topic: topicId,
          createdAt: new Date('2024-01-28')
        }
      ]);
    }, 500); // Simulate network delay
  });
};

// API functions
export const apiService = {
  // Subjects
  getSubjects: () => api.get('/subjects'),
  getSubject: (id) => api.get(`/subjects/${id}`),
  getSubjectCategories: () => api.get('/subjects/categories/list'),

  // Year Groups
  getYearGroups: (subjectId) => api.get(`/year-groups/subject/${subjectId}`),
  getAllYearGroups: () => api.get('/year-groups'),

  // Topics
  getTopics: (yearGroupId) => api.get(`/topics/year-group/${yearGroupId}`),
  getTopic: (id) => api.get(`/topics/${id}`),
  getPopularTopics: () => api.get('/topics/popular'),

  // Activities
  getActivities: (topicId) => api.get(`/activities/topic/${topicId}`),
  getActivity: (id) => api.get(`/activities/${id}`),
  getAllActivities: (params = {}) => api.get('/activities', { params }),
  createActivity: async (activityData) => {
    try {
      const response = await api.post('/activities', activityData);
      return response.data;
    } catch (error) {
      // Fallback to mock success if backend not ready
      console.log('Backend not ready, using mock success');
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ 
            success: true, 
            message: 'Activity created successfully (mock)',
            data: { id: Date.now(), ...activityData }
          });
        }, 1000);
      });
    }
  },
  
  // Additional activity methods needed by components
  getActivitiesByTopic: async (topicId) => {
    try {
      const response = await api.get(`/activities/topic/${topicId}`);
      // Support both data structures
      return response.data.data || response.data;
    } catch (error) {
      // Fallback to mock data if backend not ready
      console.log('Using mock data for activities');
      return getMockActivities(topicId);
    }
  },
  
  updateActivity: (activityId, activityData) => api.put(`/activities/${activityId}`, activityData),
  deleteActivity: (activityId) => api.delete(`/activities/${activityId}`),
  rateActivity: (activityId, rating) => api.post(`/activities/${activityId}/rate`, { rating }),

  // User endpoints - FIXED: Better error handling  
  updateUserRole: async (role) => {
    try {
      const response = await api.put('/auth/role', { role });
      return response;
    } catch (error) {
      console.error('❌ Role update failed:', error.response?.data || error.message);
      throw error;
    }
  },
  getUserProfile: () => api.get('/auth/me'),
  getUserStats: () => api.get('/auth/stats'),

  // Server health
  healthCheck: () => api.get('../'),
};

export default apiService;