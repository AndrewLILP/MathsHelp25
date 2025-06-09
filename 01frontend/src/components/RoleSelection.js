// File: 01frontend/src/components/RoleSelection.js - FIXED VERSION
// Removed localStorage, added backend API call

import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert } from 'react-bootstrap';
import { useUserRole } from '../hooks/useUserRole';
import { useAuth0 } from '@auth0/auth0-react';
import apiService from '../services/api';

const RoleSelection = ({ onRoleSelected }) => {
  const { setUserRole, userRole } = useUserRole();
  const { user } = useAuth0();
  const [selectedRole, setSelectedRole] = useState(userRole || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const roleDescriptions = {
    student: {
      title: 'Student',
      description: 'Access learning materials, view activities, and rate content.',
      permissions: ['View all content', 'Rate activities', 'Track progress'],
      icon: '🎓'
    },
    teacher: {
      title: 'Teacher',
      description: 'Create and share teaching activities with the community.',
      permissions: ['Create activities', 'Share resources', 'View analytics', 'All student permissions'],
      icon: '👩‍🏫'
    },
    admin: {
      title: 'Administrator',
      description: 'Manage platform content, users, and system settings.',
      permissions: ['Manage all content', 'User management', 'System analytics', 'All teacher permissions'],
      icon: '⚙️'
    }
  };

  const handleRoleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedRole) {
      setError('Please select a role to continue.');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      console.log('🔄 Updating user role to:', selectedRole);
      
      // Call backend API to update role
      const response = await apiService.updateUserRole(selectedRole);
      
      if (response.data && response.data.success) {
        // Update local role state
        setUserRole(selectedRole);
        setSuccess(`Role updated to ${roleDescriptions[selectedRole].title} successfully!`);
        
        // Notify parent component
        if (onRoleSelected) {
          onRoleSelected(selectedRole);
        }
        
        console.log('✅ Role update successful');
        
        // Auto-continue after success
        setTimeout(() => {
          if (onRoleSelected) {
            onRoleSelected(selectedRole);
          }
        }, 1500);
        
      } else {
        throw new Error(response.data?.message || 'Failed to update role');
      }
      
    } catch (error) {
      console.error('❌ Error updating role:', error);
      setError(
        error.response?.data?.message || 
        error.message || 
        'Failed to update role. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col lg={10} xl={8}>
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-primary text-white text-center py-4">
              <h2 className="mb-2">👋 Welcome to MathsHelp25</h2>
              <p className="mb-0">
                Hello <strong>{user?.name || user?.email}</strong>! Please select your role to get started.
              </p>
            </Card.Header>
            
            <Card.Body className="p-4">
              {error && (
                <Alert variant="danger" dismissible onClose={() => setError('')}>
                  <strong>Error:</strong> {error}
                </Alert>
              )}
              
              {success && (
                <Alert variant="success" dismissible onClose={() => setSuccess('')}>
                  <strong>Success:</strong> {success}
                </Alert>
              )}

              <Form onSubmit={handleRoleSubmit}>
                <Row className="g-4 mb-4">
                  {Object.entries(roleDescriptions).map(([role, info]) => (
                    <Col md={4} key={role}>
                      <Card 
                        className={`h-100 role-card ${selectedRole === role ? 'border-primary bg-light' : 'border-secondary'}`}
                        style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                        onClick={() => setSelectedRole(role)}
                      >
                        <Card.Body className="text-center p-4">
                          <div className="display-4 mb-3">{info.icon}</div>
                          <h5 className="card-title text-primary mb-3">{info.title}</h5>
                          <p className="card-text text-muted mb-3">{info.description}</p>
                          
                          <div className="text-start">
                            <h6 className="text-success mb-2">Permissions:</h6>
                            <ul className="list-unstyled small">
                              {info.permissions.map((permission, index) => (
                                <li key={index} className="mb-1">
                                  <i className="text-success me-2">✓</i>
                                  {permission}
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <Form.Check
                            type="radio"
                            name="roleSelection"
                            id={`role-${role}`}
                            label={`Select ${info.title}`}
                            checked={selectedRole === role}
                            onChange={() => setSelectedRole(role)}
                            className="mt-3"
                          />
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>

                <div className="text-center mt-4">
                  <Button 
                    type="submit" 
                    variant="primary" 
                    size="lg"
                    disabled={!selectedRole || isLoading}
                    className="px-5"
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Setting up your account...
                      </>
                    ) : (
                      <>
                        Continue as {selectedRole ? roleDescriptions[selectedRole].title : 'Selected Role'}
                        <i className="ms-2">→</i>
                      </>
                    )}
                  </Button>
                </div>

                <div className="text-center mt-3">
                  <small className="text-muted">
                    Don't worry - you can change your role later in your profile settings.
                  </small>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <style jsx>{`
        .role-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        
        .role-card.border-primary {
          border-width: 2px !important;
        }
      `}</style>
    </Container>
  );
};

export default RoleSelection;