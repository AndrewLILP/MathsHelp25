// File: 01frontend/src/hooks/useUserRole.test.js - FIXED WITH ACT()
// Fixed test expectations and wrapped state updates in act()

import { renderHook, act } from '@testing-library/react';
import { useUserRole } from './useUserRole';
import { useAuth0 } from '@auth0/auth0-react';

// Mock Auth0
jest.mock('@auth0/auth0-react');

describe('🔐 useUserRole Hook Tests', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
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
        isAuthenticated: true,
        isLoading: false
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
        isAuthenticated: true,
        isLoading: false
      });
      
      const { result } = renderHook(() => useUserRole());
      
      expect(result.current.userRole).toBe('teacher');
      expect(result.current.isTeacher).toBe(true);
      expect(result.current.canCreate()).toBe(true);
    });
    
    test('should default to student when no role found in Auth0', () => {
      const mockUser = {
        sub: 'auth0|test789',
        email: 'student@test.com'
        // No role in Auth0 metadata
      };
      
      useAuth0.mockReturnValue({
        user: mockUser,
        isAuthenticated: true,
        isLoading: false
      });
      
      const { result } = renderHook(() => useUserRole());
      
      expect(result.current.userRole).toBe('student');
      expect(result.current.isStudent).toBe(true);
      expect(result.current.canCreate()).toBe(false);
    });
    
    test('should default to student when no role found anywhere', () => {
      const mockUser = {
        sub: 'auth0|test000',
        email: 'newuser@test.com'
        // No role anywhere
      };
      
      useAuth0.mockReturnValue({
        user: mockUser,
        isAuthenticated: true,
        isLoading: false
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
        isAuthenticated: true,
        isLoading: false
      });
      
      const { result } = renderHook(() => useUserRole());
      
      expect(result.current.canCreate()).toBe(true);
      expect(result.current.canManage()).toBe(true);
      expect(result.current.canRate()).toBe(true);
      expect(result.current.canViewAll()).toBe(true);
      expect(result.current.canCreateActivities()).toBe(true);
      expect(result.current.canCreateTopics()).toBe(true);
      expect(result.current.canManageUsers()).toBe(true);
    });
    
    test('teacher should have limited permissions', () => {
      useAuth0.mockReturnValue({
        user: { 
          sub: 'auth0|teacher',
          'https://mathshelp25.com/role': 'teacher' 
        },
        isAuthenticated: true,
        isLoading: false
      });
      
      const { result } = renderHook(() => useUserRole());
      
      expect(result.current.canCreate()).toBe(true);          // Can create activities
      expect(result.current.canCreateActivities()).toBe(true); // Can create activities
      expect(result.current.canCreateTopics()).toBe(false);   // Cannot create topics
      expect(result.current.canManage()).toBe(false);         // Cannot manage system
      expect(result.current.canManageUsers()).toBe(false);    // Cannot manage users
      expect(result.current.canRate()).toBe(true);            // Can rate content
      expect(result.current.canViewAll()).toBe(true);         // Can view content
    });
    
    test('student should have minimal permissions', () => {
      useAuth0.mockReturnValue({
        user: { 
          sub: 'auth0|student',
          'https://mathshelp25.com/role': 'student' 
        },
        isAuthenticated: true,
        isLoading: false
      });
      
      const { result } = renderHook(() => useUserRole());
      
      expect(result.current.canCreate()).toBe(false);         // Cannot create
      expect(result.current.canCreateActivities()).toBe(false); // Cannot create activities
      expect(result.current.canCreateTopics()).toBe(false);   // Cannot create topics
      expect(result.current.canManage()).toBe(false);         // Cannot manage
      expect(result.current.canManageUsers()).toBe(false);    // Cannot manage users
      expect(result.current.canRate()).toBe(true);            // Can rate
      expect(result.current.canViewAll()).toBe(true);         // Can view
    });
  });

  describe('Role Helper Functions', () => {
    
    test('hasRole should work correctly', () => {
      useAuth0.mockReturnValue({
        user: { 
          sub: 'auth0|test',
          'https://mathshelp25.com/role': 'teacher' 
        },
        isAuthenticated: true,
        isLoading: false
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
        isAuthenticated: true,
        isLoading: false
      });
      
      const { result } = renderHook(() => useUserRole());
      
      expect(result.current.hasAnyRole(['teacher', 'admin'])).toBe(true);
      expect(result.current.hasAnyRole(['student'])).toBe(false);
      expect(result.current.hasAnyRole(['admin', 'student'])).toBe(false);
    });
  });

  describe('Role Priority from Auth0', () => {
    
    test('should prioritize custom claim over app_metadata', () => {
      const mockUser = {
        sub: 'auth0|priority-test',
        'https://mathshelp25.com/role': 'admin',  // Custom claim
        app_metadata: { role: 'teacher' }         // App metadata (should be ignored)
      };
      
      useAuth0.mockReturnValue({
        user: mockUser,
        isAuthenticated: true,
        isLoading: false
      });
      
      const { result } = renderHook(() => useUserRole());
      
      // Should use custom claim 'admin', not app_metadata 'teacher'
      expect(result.current.userRole).toBe('admin');
      expect(result.current.isAdmin).toBe(true);
    });
    
    test('should use app_metadata when custom claim missing', () => {
      const mockUser = {
        sub: 'auth0|fallback-test',
        app_metadata: { role: 'teacher' }  // Only app_metadata available
      };
      
      useAuth0.mockReturnValue({
        user: mockUser,
        isAuthenticated: true,
        isLoading: false
      });
      
      const { result } = renderHook(() => useUserRole());
      
      expect(result.current.userRole).toBe('teacher');
      expect(result.current.isTeacher).toBe(true);
    });
  });

  describe('Unauthenticated State', () => {
    
    test('should handle unauthenticated user', () => {
      useAuth0.mockReturnValue({
        user: null,
        isAuthenticated: false,
        isLoading: false
      });
      
      const { result } = renderHook(() => useUserRole());
      
      expect(result.current.userRole).toBe(null);
      expect(result.current.canCreate()).toBe(false);
      expect(result.current.canManage()).toBe(false);
      expect(result.current.canRate()).toBe(false);
    });
    
    test('should handle loading state', () => {
      useAuth0.mockReturnValue({
        user: null,
        isAuthenticated: false,
        isLoading: true
      });
      
      const { result } = renderHook(() => useUserRole());
      
      expect(result.current.isRoleLoading).toBe(true);
    });
  });

  describe('Role Update Function', () => {
    
    test('should update role manually', () => {
      useAuth0.mockReturnValue({
        user: { 
          sub: 'auth0|manual-test',
          'https://mathshelp25.com/role': 'student' 
        },
        isAuthenticated: true,
        isLoading: false
      });
      
      const { result } = renderHook(() => useUserRole());
      
      // Initial role
      expect(result.current.userRole).toBe('student');
      
      // Update role manually - WRAPPED IN ACT()
      act(() => {
        result.current.setUserRole('teacher');
      });
      
      // Should update (this is for role selection component)
      expect(result.current.userRole).toBe('teacher');
    });
    
    test('should reject invalid roles', () => {
      useAuth0.mockReturnValue({
        user: { 
          sub: 'auth0|invalid-test',
          'https://mathshelp25.com/role': 'student' 
        },
        isAuthenticated: true,
        isLoading: false
      });
      
      const { result } = renderHook(() => useUserRole());
      
      const initialRole = result.current.userRole;
      
      // Try to set invalid role - WRAPPED IN ACT()
      act(() => {
        result.current.setUserRole('invalid_role');
      });
      
      // Should remain unchanged
      expect(result.current.userRole).toBe(initialRole);
    });
  });
});