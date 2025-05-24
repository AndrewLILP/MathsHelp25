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
        background: 'linear-gradient(135deg, var(--mh-purple), var(--mh-purple-dark))',
        borderBottom: '3px solid var(--mh-gold)'
      }}
      variant="dark"
    >
      <Container>
        <Navbar.Brand 
          as={Link} 
          to="/" 
          className="d-flex align-items-center fw-bold"
          style={{ fontSize: '1.5rem' }}
        >
          <div 
            className="d-flex align-items-center justify-content-center me-3 rounded-circle"
            style={{
              width: '40px',
              height: '40px',
              background: 'var(--mh-gold)',
              color: 'var(--mh-black)'
            }}
          >
            <FaCalculator size={20} />
          </div>
          <span style={{ color: 'var(--mh-white)' }}>MathsHelp</span>
          <span style={{ color: 'var(--mh-gold)' }}>25</span>
          <Badge 
            className="ms-2"
            style={{
              backgroundColor: 'var(--mh-sky-blue)',
              color: 'var(--mh-black)',
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
              style={{ transition: 'all 0.3s ease' }}
              onMouseEnter={(e) => e.target.style.color = 'var(--mh-gold)'}
              onMouseLeave={(e) => e.target.style.color = 'white'}
            >
              <FaHome className="me-2" />
              Home
            </Nav.Link>
            
            <Nav.Link 
              as={Link} 
              to="/subjects" 
              className="text-white d-flex align-items-center px-3"
              style={{ transition: 'all 0.3s ease' }}
              onMouseEnter={(e) => e.target.style.color = 'var(--mh-sky-blue)'}
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
                style={{ transition: 'all 0.3s ease' }}
                onMouseEnter={(e) => e.target.style.color = 'var(--mh-gold)'}
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
                  style={{ transition: 'all 0.3s ease' }}
                  onMouseEnter={(e) => e.target.style.color = 'var(--mh-sky-blue)'}
                  onMouseLeave={(e) => e.target.style.color = 'white'}
                >
                  {user?.picture ? (
                    <img
                      src={user.picture}
                      alt={user.name}
                      className="rounded-circle me-2"
                      width="30"
                      height="30"
                      style={{ border: '2px solid var(--mh-gold)' }}
                    />
                  ) : (
                    <div 
                      className="rounded-circle me-2 d-flex align-items-center justify-content-center"
                      style={{
                        width: '30px',
                        height: '30px',
                        backgroundColor: 'var(--mh-gold)',
                        color: 'var(--mh-black)'
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
                    border: '2px solid var(--mh-gold)',
                    color: 'var(--mh-gold)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'var(--mh-gold)';
                    e.target.style.color = 'var(--mh-black)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.color = 'var(--mh-gold)';
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
                  backgroundColor: 'var(--mh-gold)',
                  border: '2px solid var(--mh-gold)',
                  color: 'var(--mh-black)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'var(--mh-sky-blue)';
                  e.target.style.borderColor = 'var(--mh-sky-blue)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'var(--mh-gold)';
                  e.target.style.borderColor = 'var(--mh-gold)';
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