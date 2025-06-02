// File: 01frontend/src/components/AuthWrapper.js
import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Container, Spinner } from 'react-bootstrap';
import RoleSelection from './RoleSelection';

const AuthWrapper = ({ children }) => {
  const { isLoading, isAuthenticated, user, error } = useAuth0();
  const [userRole, setUserRole] = useState(null);
  const [isCheckingRole, setIsCheckingRole] = useState(true);

  useEffect(() => {
    if (isAuthenticated && user) {
      checkUserRole();
    } else {
      setIsCheckingRole(false);
    }
  }, [isAuthenticated, user]);

  const checkUserRole = async () => {
    try {
      // Check if user already has a role assigned
      const storedRole = localStorage.getItem(`userRole_${user.sub}`);
      
      if (storedRole) {
        setUserRole(storedRole);
      } else {
        // Check user metadata from Auth0
        const roleFromMetadata = user['https://mathshelp25.com/role'];
        if (roleFromMetadata) {
          setUserRole(roleFromMetadata);
          localStorage.setItem(`userRole_${user.sub}`, roleFromMetadata);
        }
      }
    } catch (error) {
      console.error('Error checking user role:', error);
    } finally {
      setIsCheckingRole(false);
    }
  };

  const handleRoleSelected = async (selectedRole) => {
    try {
      // Store role locally
      localStorage.setItem(`userRole_${user.sub}`, selectedRole);
      setUserRole(selectedRole);
      
      console.log(`Role selected for ${user.email}: ${selectedRole}`);
      
      // TODO: Call backend API to store role in database
      // await updateUserRole(selectedRole);
      
    } catch (error) {
      console.error('Error saving user role:', error);
    }
  };

  // Show loading spinner while checking authentication and role
  if (isLoading || isCheckingRole) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="text-center">
          <Spinner animation="border" variant="primary" size="lg" />
          <p className="mt-3 text-muted">Loading MathsHelp25...</p>
        </div>
      </Container>
    );
  }

  // Show error if authentication failed
  if (error) {
    return (
      <Container className="mt-5">
        <div className="alert alert-danger">
          <h4>Authentication Error</h4>
          <p>{error.message}</p>
          <button 
            className="btn btn-primary" 
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </Container>
    );
  }

  // Not authenticated - show the normal app (which includes login options)
  if (!isAuthenticated) {
    return children;
  }

  // Authenticated but no role selected - show role selection
  if (!userRole) {
    return <RoleSelection onRoleSelected={handleRoleSelected} />;
  }

  // Authenticated with role - show main app with role context
  return (
    <div data-user-role={userRole}>
      {children}
    </div>
  );
};

export default AuthWrapper;