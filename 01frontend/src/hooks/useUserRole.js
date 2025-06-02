// File: 01frontend/src/hooks/useUserRole.js
import { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

// Update the useUserRole hook to check Auth0 metadata
export const useUserRole = () => {
  const { user, isAuthenticated } = useAuth0();
  const [userRole, setUserRole] = useState(null);
  
  useEffect(() => {
    if (isAuthenticated && user) {
      // Check Auth0 app_metadata first
      const auth0Role = user['https://mathshelp25.com/role'] || user.app_metadata?.role;
      
      if (auth0Role) {
        setUserRole(auth0Role);
        // Store in localStorage as backup
        localStorage.setItem(`userRole_${user.sub}`, auth0Role);
      } else {
        // Fallback to stored role or default
        const storedRole = localStorage.getItem(`userRole_${user.sub}`);
        setUserRole(storedRole || 'student');
      }
    }
  }, [user, isAuthenticated]);

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
    return hasAnyRole(['teacher', 'student']);
  };

  const canViewAll = () => {
    return hasAnyRole(['teacher', 'student', 'admin']);
  };

  return {
    userRole,
    hasRole,
    hasAnyRole,
    canCreate,
    canManage,
    canRate,
    canViewAll,
    isTeacher: hasRole('teacher'),
    isStudent: hasRole('student'),
    isAdmin: hasRole('admin'),
    setUserRole // Allow manual role updates
  };
};