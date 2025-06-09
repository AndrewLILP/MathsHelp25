// File: 01frontend/src/hooks/useUserRole.js - FIXED VERSION
// Removed localStorage dependency, using Auth0 as single source of truth

import { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

export const useUserRole = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [userRole, setUserRole] = useState(null);
  const [isRoleLoading, setIsRoleLoading] = useState(true);
  
  useEffect(() => {
    if (isAuthenticated && user) {
      determineUserRole();
    } else {
      setUserRole(null);
      setIsRoleLoading(false);
    }
  }, [user, isAuthenticated]);

  const determineUserRole = () => {
    console.log('🔍 Determining user role from Auth0...');
    
    try {
      // FIXED: Use Auth0 as single source of truth
      // Priority order:
      // 1. Custom claim in JWT
      // 2. app_metadata
      // 3. Default to 'student'
      
      const auth0Role = user['https://mathshelp25.com/role'] || 
                       user.app_metadata?.role;
      
      if (auth0Role && ['student', 'teacher', 'admin'].includes(auth0Role)) {
        console.log('📋 Found role in Auth0 metadata:', auth0Role);
        setUserRole(auth0Role);
      } else {
        console.log('📋 No role found in Auth0, defaulting to student');
        setUserRole('student');
      }
    } catch (error) {
      console.error('❌ Error determining user role:', error);
      setUserRole('student'); // Safe default
    } finally {
      setIsRoleLoading(false);
    }
  };

  // Helper functions for role-based permissions
  const hasRole = (role) => {
    return userRole === role;
  };

  const hasAnyRole = (roles) => {
    return roles.includes(userRole);
  };

  const canCreate = () => {
    return hasAnyRole(['teacher', 'admin']);
  };

  const canManage = () => {
    return hasRole('admin');
  };

  const canRate = () => {
    return hasAnyRole(['teacher', 'student', 'admin']);
  };

  const canViewAll = () => {
    return hasAnyRole(['teacher', 'student', 'admin']);
  };

  // ADDED: More granular permissions
  const canCreateActivities = () => {
    return hasAnyRole(['teacher', 'admin']);
  };

  const canCreateTopics = () => {
    return hasRole('admin');
  };

  const canManageUsers = () => {
    return hasRole('admin');
  };

  const canModerateContent = () => {
    return hasRole('admin');
  };

  const canEditOthersContent = () => {
    return hasRole('admin');
  };

  // FIXED: Manual role update function for role selection
  const updateUserRole = (newRole) => {
    console.log('📋 Manually updating user role to:', newRole);
    
    if (['student', 'teacher', 'admin'].includes(newRole)) {
      setUserRole(newRole);
      
      // TODO: Call backend API to update role in database
      // This should trigger an Auth0 metadata update
      console.log('⚠️ TODO: Update role in backend and Auth0 metadata');
    } else {
      console.error('❌ Invalid role:', newRole);
    }
  };

  return {
    userRole,
    isRoleLoading: isRoleLoading || isLoading,
    
    // Role checking functions
    hasRole,
    hasAnyRole,
    
    // Permission functions
    canCreate,
    canManage,
    canRate,
    canViewAll,
    canCreateActivities,
    canCreateTopics,
    canManageUsers,
    canModerateContent,
    canEditOthersContent,
    
    // Role boolean helpers
    isTeacher: hasRole('teacher'),
    isStudent: hasRole('student'),
    isAdmin: hasRole('admin'),
    
    // Role management
    setUserRole: updateUserRole // For manual updates (role selection)
  };
};