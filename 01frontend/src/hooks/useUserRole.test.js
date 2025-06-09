// File: 01frontend/src/hooks/useUserRole.test.js
// Tests for useUserRole hook

import { renderHook } from '@testing-library/react';
import { useUserRole } from './useUserRole';
import { useAuth0 } from '@auth0/auth0-react';

// Mock Auth0
jest.mock('@auth0/auth0-react');

// Mock localStorage
const mockLocalStorage = (() => {
  let store = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    removeItem: jest.fn((key) => {
      delete store[key];
    })
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
});

describe('🔐 useUserRole Hook Tests', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.clear();
  });

  describe('Role Detection from Auth0', () => {
    
    test('should detect admin role from Auth0 metadata', () => {
      const mockUser = {
        sub: 'auth0|test123',
        email: 'admin@test.com',
        'https://mathshelp25.com/role': 'admin'
      };
      
      useAuth0.mockReturnValue({
        user: mockUser,
        isAuthenticated: true
      });
      
      const { result } = renderHook(() => useUserRole());
      
      expect(result.current.userRole).toBe('admin');
      expect(result.current.isAdmin).toBe(true);
      expect(result.current.canManage()).toBe(true);
    });
    
    test('should detect teacher role from app_metadata', () => {
      const mockUser = {
        sub: 'auth0|test456',
        email: 'teacher@test.com',
        app_metadata: { role: 'teacher' }
      };
      
      useAuth0.mockReturnValue({
        user: mockUser,
        isAuthenticated: true
      });
      
      const { result } = renderHook(() => useUserRole());
      
      expect(result.current.userRole).toBe('teacher');
      expect(result.current.isTeacher).toBe(true);
      expect(result.current.canCreate()).toBe(true);
    });
    
    test('should fallback to localStorage when Auth0 role missing', () => {
      const mockUser = {
        sub: 'auth0|test789',
        email: 'student@test.com'
        // No role in Auth0 metadata
      };
      
      // Set localStorage role
      mockLocalStorage.setItem('userRole_auth0|test789', 'student');
      
      useAuth0.mockReturnValue({
        user: mockUser,
        isAuthenticated: true
      });
      
      const { result } = renderHook(() => useUserRole());
      
      expect(result.current.userRole).toBe('student');
      expect(result.current.isStudent).toBe(true);
      expect(result.current.canCreate()).toBe(false);
    });
    
    test('should default to student when no role found', () => {
      const mockUser = {
        sub: 'auth0|test000',
        email: 'newuser@test.com'
        // No role anywhere
      };
      
      useAuth0.mockReturnValue({
        user: mockUser,
        isAuthenticated: true
      });
      
      const { result } = renderHook(() => useUserRole());
      
      expect(result.current.userRole).toBe('student');
    });
  });

  describe('Permission Functions', () => {
    
    test('admin should have all permissions', () => {
      useAuth0.mockReturnValue({
        user: { 
          sub: 'auth0|admin',
          'https://mathshelp25.com/role': 'admin' 
        },
        isAuthenticated: true
      });
      
      const { result } = renderHook(() => useUserRole());
      
      expect(result.current.canCreate()).toBe(true);
      expect(result.current.canManage()).toBe(true);
      expect(result.current.canRate()).toBe(true);
      expect(result.current.canViewAll()).toBe(true);
    });
    
    test('teacher should have limited permissions', () => {
      useAuth0.mockReturnValue({
        user: { 
          sub: 'auth0|teacher',
          'https://mathshelp25.com/role': 'teacher' 
        },
        isAuthenticated: true
      });
      
      const { result } = renderHook(() => useUserRole());
      
      expect(result.current.canCreate()).toBe(true);  // Can create activities
      expect(result.current.canManage()).toBe(false); // Cannot manage system
      expect(result.current.canRate()).toBe(true);    // Can rate content
      expect(result.current.canViewAll()).toBe(true); // Can view content
    });
    
    test('student should have minimal permissions', () => {
      useAuth0.mockReturnValue({
        user: { 
          sub: 'auth0|student',
          'https://mathshelp25.com/role': 'student' 
        },
        isAuthenticated: true
      });
      
      const { result } = renderHook(() => useUserRole());
      
      expect(result.current.canCreate()).toBe(false); // Cannot create
      expect(result.current.canManage()).toBe(false); // Cannot manage
      expect(result.current.canRate()).toBe(true);    // Can rate
      expect(result.current.canViewAll()).toBe(true); // Can view
    });
  });

  describe('Role Helper Functions', () => {
    
    test('hasRole should work correctly', () => {
      useAuth0.mockReturnValue({
        user: { 
          sub: 'auth0|test',
          'https://mathshelp25.com/role': 'teacher' 
        },
        isAuthenticated: true
      });
      
      const { result } = renderHook(() => useUserRole());
      
      expect(result.current.hasRole('teacher')).toBe(true);
      expect(result.current.hasRole('admin')).toBe(false);
      expect(result.current.hasRole('student')).toBe(false);
    });
    
    test('hasAnyRole should work correctly', () => {
      useAuth0.mockReturnValue({
        user: { 
          sub: 'auth0|test',
          'https://mathshelp25.com/role': 'teacher' 
        },
        isAuthenticated: true
      });
      
      const { result } = renderHook(() => useUserRole());
      
      expect(result.current.hasAnyRole(['teacher', 'admin'])).toBe(true);
      expect(result.current.hasAnyRole(['student'])).toBe(false);
      expect(result.current.hasAnyRole(['admin', 'student'])).toBe(false);
    });
  });

  describe('LocalStorage Sync Issues', () => {
    
    test('should identify localStorage vs Auth0 inconsistency', () => {
      const mockUser = {
        sub: 'auth0|conflict',
        'https://mathshelp25.com/role': 'admin'
      };
      
      // localStorage has different role
      mockLocalStorage.setItem('userRole_auth0|conflict', 'student');
      
      useAuth0.mockReturnValue({
        user: mockUser,
        isAuthenticated: true
      });
      
      const { result } = renderHook(() => useUserRole());
      
      // Should prioritize Auth0 over localStorage
      expect(result.current.userRole).toBe('admin');
      
      // Check that localStorage was updated
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'userRole_auth0|conflict', 
        'admin'
      );
    });
  });

  describe('Unauthenticated State', () => {
    
    test('should handle unauthenticated user', () => {
      useAuth0.mockReturnValue({
        user: null,
        isAuthenticated: false
      });
      
      const { result } = renderHook(() => useUserRole());
      
      expect(result.current.userRole).toBe(null);
      expect(result.current.canCreate()).toBe(false);
      expect(result.current.canManage()).toBe(false);
    });
  });
});