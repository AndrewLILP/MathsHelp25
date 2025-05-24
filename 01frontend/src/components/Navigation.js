import React from 'react';
import { Navbar, Container } from 'react-bootstrap';
import { useAuth0 } from '@auth0/auth0-react';

const Navigation = () => {
  const { isAuthenticated, user, loginWithRedirect, logout } = useAuth0();

  return (
    <Navbar bg="primary" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand href="/">
          MathsHelp25
        </Navbar.Brand>
        
        <div className="ms-auto">
          {isAuthenticated ? (
            <div className="d-flex align-items-center gap-3">
              <span className="text-light">Hello, {user?.name}</span>
              <button 
                className="btn btn-outline-light btn-sm" 
                onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
              >
                Logout
              </button>
            </div>
          ) : (
            <button 
              className="btn btn-light btn-sm" 
              onClick={() => loginWithRedirect()}
            >
              Login
            </button>
          )}
        </div>
      </Container>
    </Navbar>
  );
};

export default Navigation;