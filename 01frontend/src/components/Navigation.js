import React from 'react';
import { Navbar, Nav, Container, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { FaCalculator, FaHome, FaUser, FaBook, FaChartBar } from 'react-icons/fa';

const Navigation = () => {
  const { isAuthenticated, user, loginWithRedirect, logout } = useAuth0();

  return (
    <Navbar 
      className="shadow-sm"
      expand="lg"
      style={{
        background: 'linear-gradient(135deg, #6f42c1, #5a359e)',
        borderBottom: '3px solid #ffd700'
      }}
      variant="dark"
    >
      <Container>
        <Navbar.Brand 
          as={Link} 
          to="/" 
          className="d-flex align-items-center fw-bold text-white"
          style={{ fontSize: '1.5rem', textDecoration: 'none' }}
        >
          <div 
            className="d-flex align-items-center justify-content-center me-3 rounded-circle"
            style={{
              width: '40px',
              height: '40px',
              background: '#ffd700',
              color: '#1a1a1a'
            }}
          >
            <FaCalculator size={20} />
          </div>
          <span style={{ color: 'white' }}>MathsHelp</span>
          <span style={{ color: '#ffd700' }}>25</span>
          <Badge 
            className="ms-2"
            style={{
              backgroundColor: '#87ceeb',
              color: '#1a1a1a',
              fontSize: '0.6rem'
            }}
          >
            Beta
          </Badge>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link 
              as={Link} 
              to="/" 
              className="text-white d-flex align-items-center px-3"
              style={{ 
                transition: 'all 0.3s ease',
                textDecoration: 'none'
              }}
              onMouseEnter={(e) => e.target.style.color = '#ffd700'}
              onMouseLeave={(e) => e.target.style.color = 'white'}
            >
              <FaHome className="me-2" />
              Home
            </Nav.Link>
            
            <Nav.Link 
              as={Link} 
              to="/subjects" 
              className="text-white d-flex align-items-center px-3"
              style={{ 
                transition: 'all 0.3s ease',
                textDecoration: 'none'
              }}
              onMouseEnter={(e) => e.target.style.color = '#87ceeb'}
              onMouseLeave={(e) => e.target.style.color = 'white'}
            >
              <FaBook className="me-2" />
              Browse Subjects
            </Nav.Link>

            {isAuthenticated && (
              <Nav.Link 
                as={Link} 
                to="/dashboard" 
                className="text-white d-flex align-items-center px-3"
                style={{ 
                  transition: 'all 0.3s ease',
                  textDecoration: 'none'
                }}
                onMouseEnter={(e) => e.target.style.color = '#ffd700'}
                onMouseLeave={(e) => e.target.style.color = 'white'}
              >
                <FaChartBar className="me-2" />
                Dashboard
              </Nav.Link>
            )}
          </Nav>

          <Nav className="align-items-center">
            {isAuthenticated ? (
              <>
                <Nav.Link 
                  as={Link} 
                  to="/profile" 
                  className="d-flex align-items-center me-3 text-white"
                  style={{ 
                    transition: 'all 0.3s ease',
                    textDecoration: 'none'
                  }}
                  onMouseEnter={(e) => e.target.style.color = '#87ceeb'}
                  onMouseLeave={(e) => e.target.style.color = 'white'}
                >
                  {user?.picture ? (
                    <img
                      src={user.picture}
                      alt={user.name}
                      className="rounded-circle me-2"
                      width="30"
                      height="30"
                      style={{ border: '2px solid #ffd700' }}
                    />
                  ) : (
                    <div 
                      className="rounded-circle me-2 d-flex align-items-center justify-content-center"
                      style={{
                        width: '30px',
                        height: '30px',
                        backgroundColor: '#ffd700',
                        color: '#1a1a1a'
                      }}
                    >
                      <FaUser size={14} />
                    </div>
                  )}
                  <span className="d-none d-md-inline">
                    {user?.name || 'Profile'}
                  </span>
                </Nav.Link>
                <button 
                  className="btn btn-sm"
                  style={{
                    backgroundColor: 'transparent',
                    border: '2px solid #ffd700',
                    color: '#ffd700',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#ffd700';
                    e.target.style.color = '#1a1a1a';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.color = '#ffd700';
                  }}
                  onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                >
                  Logout
                </button>
              </>
            ) : (
              <button 
                className="btn btn-sm fw-bold"
                style={{
                  backgroundColor: '#ffd700',
                  border: '2px solid #ffd700',
                  color: '#1a1a1a',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#87ceeb';
                  e.target.style.borderColor = '#87ceeb';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#ffd700';
                  e.target.style.borderColor = '#ffd700';
                }}
                onClick={() => loginWithRedirect()}
              >
                Login
              </button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;