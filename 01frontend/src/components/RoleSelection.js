// File: 01frontend/src/components/RoleSelection.js
import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import { useAuth0 } from '@auth0/auth0-react';
import { FaChalkboardTeacher, FaUserGraduate, FaUserCog } from 'react-icons/fa';

const RoleSelection = ({ onRoleSelected }) => {
  const [selectedRole, setSelectedRole] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth0();

  const roles = [
    {
      value: 'teacher',
      title: 'Teacher',
      description: 'Create, share, and manage educational resources',
      icon: <FaChalkboardTeacher size={40} />
    },
    {
      value: 'student',
      title: 'Student',
      description: 'Access and rate educational materials',
      icon: <FaUserGraduate size={40} />
    },
    {
      value: 'admin',
      title: 'Administrator',
      description: 'Manage users and oversee platform content',
      icon: <FaUserCog size={40} />
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRole) return;

    setIsSubmitting(true);
    
    try {
      // Store role locally
      localStorage.setItem(`userRole_${user.sub}`, selectedRole);
      
      // Call the parent component's callback
      onRoleSelected(selectedRole);
      
      console.log(`Role selected for ${user.email}: ${selectedRole}`);
    } catch (error) {
      console.error('Error setting user role:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <Card className="shadow">
            <Card.Header className="bg-primary text-white text-center py-4">
              <h2 className="mb-0">Welcome to MathsHelp25!</h2>
              <p className="mb-0 mt-2">Please select your role to get started</p>
            </Card.Header>
            <Card.Body className="p-4">
              <Form onSubmit={handleSubmit}>
                <Row>
                  {roles.map((role) => (
                    <Col md={4} key={role.value} className="mb-3">
                      <Card 
                        className={`h-100 cursor-pointer border-2 ${
                          selectedRole === role.value ? 'border-primary bg-light' : 'border-light'
                        }`}
                        style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                        onClick={() => setSelectedRole(role.value)}
                      >
                        <Card.Body className="text-center p-4">
                          <div className="mb-3 text-primary">
                            {role.icon}
                          </div>
                          <h5 className="mb-2">{role.title}</h5>
                          <p className="text-muted small mb-3">{role.description}</p>
                          <Form.Check
                            type="radio"
                            id={role.value}
                            name="userRole"
                            value={role.value}
                            checked={selectedRole === role.value}
                            onChange={(e) => setSelectedRole(e.target.value)}
                            className="d-flex justify-content-center"
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
                    disabled={!selectedRole || isSubmitting}
                    style={{ minWidth: '200px' }}
                  >
                    {isSubmitting ? 'Setting up your account...' : 'Continue to MathsHelp25'}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default RoleSelection;