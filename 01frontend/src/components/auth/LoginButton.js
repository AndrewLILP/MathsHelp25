import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Button } from 'react-bootstrap';
import { FaSignInAlt } from 'react-icons/fa';

const LoginButton = ({ variant = "primary", size = "md", className = "" }) => {
  const { loginWithRedirect, isLoading } = useAuth0();

  const handleLogin = () => {
    loginWithRedirect({
      appState: {
        returnTo: window.location.pathname
      }
    });
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleLogin}
      disabled={isLoading}
      className={`d-flex align-items-center gap-2 ${className}`}
    >
      <FaSignInAlt />
      {isLoading ? 'Logging in...' : 'Log In'}
    </Button>
  );
};

export default LoginButton;