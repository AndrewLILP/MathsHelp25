// File: 01frontend/src/components/RoleBasedNavigation.js
import React from 'react';
import { Navbar, Nav, NavDropdown, Container, Badge } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useAuth0 } from '@auth0/auth0-react';
import { useUserRole } from '../hooks/useUserRole';
import LoginButton from './auth/LoginButton';
import LogoutButton from './auth/LogoutButton';
import { 
  FaHome, 
  FaBook, 
  FaPlus, 
  FaChartBar, 
  FaUsers, 
  FaCog, 
  FaUserCircle,
  FaStar 
} from 'react-icons/fa';

const RoleBasedNavigation = () => {
  const { isAuthenticated, user } = useAuth0();
  const { userRole, isTeacher, isStudent, isAdmin } = useUserRole();

  const getRoleColor = (role) => {
    switch(role) {
      case 'teacher': return 'success';
      case 'student': return 'info';
      case 'admin': return 'danger';
      default: return 'secondary';
    }
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="shadow">
      <Container>
        <LinkContainer to="/">
          <Navbar.Brand className="fw-bold">
            📚 MathsHelp25
          </Navbar.Brand>
        </LinkContainer>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {/* Home - Available to everyone */}
            <LinkContainer to="/">
              <Nav.Link>
                <FaHome className="me-1" />
                Home
              </Nav.Link>
            </LinkContainer>

            {/* Subjects - Available to authenticated users */}
            {isAuthenticated && (
              <LinkContainer to="/subjects">
                <Nav.Link>
                  <FaBook className="me-1" />
                  Subjects
                </Nav.Link>
              </LinkContainer>
            )}

            {/* Teacher-specific navigation */}
            {isTeacher && (
              <>
                <NavDropdown 
                  title={
                    <>
                      <FaPlus className="me-1" />
                      Create
                    </>
                  } 
                  id="teacher-dropdown"
                >
                  <LinkContainer to="/create/activity">
                    <NavDropdown.Item>
                      <FaPlus className="me-2" />
                      New Activity
                    </NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/create/resource">
                    <NavDropdown.Item>
                      <FaBook className="me-2" />
                      New Resource
                    </NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Divider />
                  <LinkContainer to="/my-contributions">
                    <NavDropdown.Item>
                      <FaStar className="me-2" />
                      My Contributions
                    </NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>

                <LinkContainer to="/teacher-dashboard">
                  <Nav.Link>
                    <FaChartBar className="me-1" />
                    Dashboard
                  </Nav.Link>
                </LinkContainer>
              </>
            )}

            {/* Student-specific navigation */}
            {isStudent && (
              <>
                <LinkContainer to="/my-favorites">
                  <Nav.Link>
                    <FaStar className="me-1" />
                    Favorites
                  </Nav.Link>
                </LinkContainer>

                <LinkContainer to="/student-progress">
                  <Nav.Link>
                    <FaChartBar className="me-1" />
                    Progress
                  </Nav.Link>
                </LinkContainer>
              </>
            )}

            {/* Admin-specific navigation */}
            {isAdmin && (
              <NavDropdown 
                title={
                  <>
                    <FaCog className="me-1" />
                    Admin
                  </>
                } 
                id="admin-dropdown"
              >
                <LinkContainer to="/admin/users">
                  <NavDropdown.Item>
                    <FaUsers className="me-2" />
                    Manage Users
                  </NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to="/admin/content">
                  <NavDropdown.Item>
                    <FaBook className="me-2" />
                    Manage Content
                  </NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to="/admin/analytics">
                  <NavDropdown.Item>
                    <FaChartBar className="me-2" />
                    Analytics
                  </NavDropdown.Item>
                </LinkContainer>
                <NavDropdown.Divider />
                <LinkContainer to="/admin/settings">
                  <NavDropdown.Item>
                    <FaCog className="me-2" />
                    System Settings
                  </NavDropdown.Item>
                </LinkContainer>
              </NavDropdown>
            )}
          </Nav>

          {/* Right side navigation */}
          <Nav>
            {isAuthenticated ? (
              <>
                {/* User dropdown with role badge */}
                <NavDropdown 
                  title={
                    <span className="d-flex align-items-center">
                      <FaUserCircle className="me-2" />
                      {user?.name || user?.email}
                      {userRole && (
                        <Badge 
                          bg={getRoleColor(userRole)} 
                          className="ms-2 text-capitalize"
                        >
                          {userRole}
                        </Badge>
                      )}
                    </span>
                  } 
                  id="user-dropdown"
                  align="end"
                >
                  <LinkContainer to="/profile">
                    <NavDropdown.Item>
                      <FaUserCircle className="me-2" />
                      Profile
                    </NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/settings">
                    <NavDropdown.Item>
                      <FaCog className="me-2" />
                      Settings
                    </NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Divider />
                  <NavDropdown.Item as="div" className="p-0">
                    <div className="px-3 py-2">
                      <LogoutButton />
                    </div>
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <LoginButton />
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default RoleBasedNavigation;