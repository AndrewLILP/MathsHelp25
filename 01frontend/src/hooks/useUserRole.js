// File: src/hooks/useUserRole.js
import { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

export const useUserRole = () => {
  const { user, isAuthenticated } = useAuth0();
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated && user) {
      // Check localStorage for user role
      const storedRole = localStorage.getItem(`userRole_${user.sub}`);
      
      // Check Auth0 user metadata (if available)
      const metadataRole = user['https://mathshelp25.com/role'];
      
      const role = storedRole || metadataRole;
      setUserRole(role);
    }
    setIsLoading(false);
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
    isLoading,
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