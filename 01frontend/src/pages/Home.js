// File: 01frontend/src/pages/Home.js

import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useAuth0 } from '@auth0/auth0-react';
import { FaBook, FaUsers, FaStar, FaChartLine } from 'react-icons/fa';
import LoginButton from '../components/auth/LoginButton';

const Home = () => {
  const { isAuthenticated } = useAuth0();

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-primary text-white py-5 mb-5 rounded">
        <Container>
          <Row className="align-items-center">
            <Col lg={8}>
              <h1 className="display-4 fw-bold mb-3">
                Welcome to MathsHelp25
              </h1>
              <p className="lead mb-4">
                Discover, share, and rate amazing mathematics teaching resources. 
                Connect with fellow educators and find inspiration for your next lesson.
              </p>
              <div className="d-flex gap-3">
                {isAuthenticated ? (
                  <LinkContainer to="/subjects">
                    <Button variant="light" size="lg">
                      <FaBook className="me-2" />
                      Browse Resources
                    </Button>
                  </LinkContainer>
                ) : (
                  <LoginButton variant="light" size="lg" />
                )}
                <LinkContainer to="/subjects">
                  <Button variant="outline-light" size="lg">
                    Explore Subjects
                  </Button>
                </LinkContainer>
              </div>
            </Col>
            <Col lg={4} className="text-center">
              <div className="bg-white bg-opacity-10 p-4 rounded">
                <h3 className="h4 mb-3">Quick Stats</h3>
                <div className="row text-center">
                  <div className="col-6">
                    <h4 className="fw-bold">5</h4>
                    <small>Subjects</small>
                  </div>
                  <div className="col-6">
                    <h4 className="fw-bold">20</h4>
                    <small>Year Groups</small>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Features Section */}
      <Container>
        <Row className="mb-5">
          <Col className="text-center">
            <h2 className="mb-4">Why Choose MathsHelp25?</h2>
            <p className="text-muted lead">
              Built by teachers, for teachers. Everything you need to enhance your mathematics teaching.
            </p>
          </Col>
        </Row>

        <Row className="g-4 mb-5">
          <Col md={6} lg={3}>
            <Card className="h-100 text-center border-0 shadow-sm">
              <Card.Body>
                <FaBook size={48} className="text-primary mb-3" />
                <Card.Title>Rich Resources</Card.Title>
                <Card.Text className="text-muted">
                  Access worksheets, activities, games, and assessments across all mathematics topics.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6} lg={3}>
            <Card className="h-100 text-center border-0 shadow-sm">
              <Card.Body>
                <FaUsers size={48} className="text-success mb-3" />
                <Card.Title>Teacher Community</Card.Title>
                <Card.Text className="text-muted">
                  Connect with mathematics educators and share your best teaching ideas.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6} lg={3}>
            <Card className="h-100 text-center border-0 shadow-sm">
              <Card.Body>
                <FaStar size={48} className="text-warning mb-3" />
                <Card.Title>Quality Ratings</Card.Title>
                <Card.Text className="text-muted">
                  Find the best resources through community ratings and reviews.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6} lg={3}>
            <Card className="h-100 text-center border-0 shadow-sm">
              <Card.Body>
                <FaChartLine size={48} className="text-info mb-3" />
                <Card.Title>Easy Organization</Card.Title>
                <Card.Text className="text-muted">
                  Browse by subject, year level, and difficulty to find exactly what you need.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Call to Action */}
        <Row>
          <Col className="text-center">
            <Card className="bg-light border-0">
              <Card.Body className="py-5">
                <h3 className="mb-3">Ready to Get Started?</h3>
                <p className="text-muted mb-4">
                  Join our community of mathematics educators and start sharing resources today.
                </p>
                {!isAuthenticated && (
                  <LoginButton variant="primary" size="lg" />
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Home;