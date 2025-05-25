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

// Request interceptor for adding auth token (when we have real auth)
api.interceptors.request.use(
  (config) => {
    // Future: Add auth token here
    // const token = getToken();
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
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
  createActivity: (activityData) => api.post('/activities', activityData),

  // Server health
  healthCheck: () => api.get('../'),
};

export default apiService;