// File: 01frontend/src/components/auth/LogoutButton.js
import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Button } from 'react-bootstrap';
import { FaSignOutAlt } from 'react-icons/fa';

const LogoutButton = ({ variant = "outline-light", size = "sm", className = "" }) => {
  const { logout, isLoading, user } = useAuth0();

  const handleLogout = () => {
    // Clear user role from localStorage
    if (user) {
      localStorage.removeItem(`userRole_${user.sub}`);
    }
    
    logout({ 
      logoutParams: { 
        returnTo: window.location.origin 
      } 
    });
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleLogout}
      disabled={isLoading}
      className={`d-flex align-items-center gap-2 ${className}`}
    >
      <FaSignOutAlt />
      {isLoading ? 'Logging out...' : 'Log Out'}
    </Button>
  );
};

export default LogoutButton;