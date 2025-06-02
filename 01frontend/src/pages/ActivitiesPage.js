//01frontend/src/pages/ActivitiesPage.js

import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Button, Alert, Spinner, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { 
  FaArrowLeft, 
  FaPlus, 
  FaBook, 
  FaClock, 
  FaGraduationCap,
  FaFilter,
  FaSort
} from 'react-icons/fa';
import ActivityCard from '../components/activities/ActivityCard';
import ActivityForm from '../components/activities/ActivityForm';
import { apiService } from '../services/api';

const ActivitiesPage = () => {
  const { topicId } = useParams();
  const { isAuthenticated } = useAuth0();
  
  const [topic, setTopic] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchTopicAndActivities = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch topic details and activities in parallel
      const [topicResponse, activitiesResponse] = await Promise.all([
        apiService.getTopic(topicId),
        apiService.getActivities(topicId)
      ]);
      
      setTopic(topicResponse.data.data);
      setActivities(activitiesResponse.data.data);
      setError(null);
    } catch (err) {
      setError('Failed to load activities. Please try again.');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  }, [topicId]);

  useEffect(() => {
    fetchTopicAndActivities();
  }, [fetchTopicAndActivities]);

  const handleActivityCreated = () => {
    setShowForm(false);
    fetchTopicAndActivities(); // Refresh the activities list
  };

  if (loading) {
    return (
      <Container className="py-4">
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3 text-muted">Loading activities...</p>
        </div>
      </Container>
    );
  }

  if (error || !topic) {
    return (
      <Container className="py-4">
        <Alert variant="danger" className="text-center">
          <Alert.Heading>Unable to Load Activities</Alert.Heading>
          <p>{error || 'Topic not found.'}</p>
          <Button variant="outline-danger" onClick={fetchTopicAndActivities}>
            Try Again
          </Button>
        </Alert>
      </Container>
    );
  }

  if (showForm) {
    return (
      <Container className="py-4">
        <ActivityForm
          topicId={topicId}
          topicInfo={topic}
          onCancel={() => setShowForm(false)}
          onSuccess={handleActivityCreated}
        />
      </Container>
    );
  }

  return (
    <Container className="py-4">
      {/* Back navigation */}
      <div className="mb-3">
        <Button 
          as={Link} 
          to={`/subjects/${topic.yearGroup?.subject?._id}`} 
          variant="outline-primary" 
          size="sm"
        >
          <FaArrowLeft className="me-2" />
          Back to {topic.yearGroup?.subject?.name} Topics
        </Button>
      </div>

      {/* Topic header */}
      <div 
        className="mb-4 p-4 rounded text-white"
        style={{ 
          background: `linear-gradient(135deg, #6f42c1, #5a359e)`,
          border: `3px solid #ffd700`
        }}
      >
        <Row className="align-items-center">
          <Col md={8}>
            <div className="d-flex align-items-center mb-2">
              <Badge 
                className="me-2"
                style={{
                  backgroundColor: '#87ceeb',
                  color: '#1a1a1a'
                }}
              >
                {topic.strand}
              </Badge>
              <Badge 
                style={{
                  backgroundColor: '#ffd700',
                  color: '#1a1a1a'
                }}
              >
                {topic.difficulty}
              </Badge>
            </div>
            
            <h1 className="mb-2">{topic.name}</h1>
            <p className="mb-3 opacity-90">{topic.description}</p>
            
            <div className="d-flex flex-wrap gap-3 text-sm">
              <span>
                <FaGraduationCap className="me-1" />
                {topic.yearGroup?.name}
              </span>
              <span>
                <FaClock className="me-1" />
                {topic.estimatedDuration} minutes
              </span>
              <span>
                <FaBook className="me-1" />
                {activities.length} activities
              </span>
            </div>
          </Col>
          
          <Col md={4} className="text-center">
            {isAuthenticated && (
              <Button
                variant="light"
                size="lg"
                onClick={() => setShowForm(true)}
                className="fw-bold"
                style={{
                  backgroundColor: '#ffd700',
                  color: '#1a1a1a',
                  border: 'none'
                }}
              >
                <FaPlus className="me-2" />
                Add Activity
              </Button>
            )}
          </Col>
        </Row>
      </div>

      {/* Learning objectives */}
      {topic.learningObjectives && topic.learningObjectives.length > 0 && (
        <div className="mb-4 p-3 rounded" style={{ backgroundColor: 'rgba(135, 206, 235, 0.1)' }}>
          <h6 style={{ color: '#6f42c1' }}>Learning Objectives</h6>
          <ul className="mb-0">
            {topic.learningObjectives.map((objective, index) => (
              <li key={index} className="text-muted">{objective}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Activities section */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 style={{ color: '#6f42c1' }}>Teaching Activities</h3>
          <p className="text-muted mb-0">
            {activities.length} activity{activities.length !== 1 ? 'ies' : 'y'} available for this topic
          </p>
        </div>
        
        {/* Future: Add sorting and filtering buttons */}
        {activities.length > 0 && (
          <div className="d-flex gap-2">
            <Button variant="outline-secondary" size="sm">
              <FaFilter className="me-1" />
              Filter
            </Button>
            <Button variant="outline-secondary" size="sm">
              <FaSort className="me-1" />
              Sort
            </Button>
          </div>
        )}
      </div>

      {/* Activities grid */}
      {activities.length === 0 ? (
        <Alert variant="info" className="text-center py-5">
          <div className="mb-3">
            <FaBook size={48} style={{ color: '#87ceeb' }} />
          </div>
          <h5>No Activities Yet</h5>
          <p className="mb-3">
            Be the first to contribute an activity for "{topic.name}"! 
            Help fellow teachers by sharing your best teaching resources.
          </p>
          {isAuthenticated ? (
            <Button 
              variant="primary"
              onClick={() => setShowForm(true)}
              style={{ 
                backgroundColor: '#6f42c1', 
                borderColor: '#6f42c1' 
              }}
            >
              <FaPlus className="me-2" />
              Create First Activity
            </Button>
          ) : (
            <p className="text-muted">Log in to contribute activities</p>
          )}
        </Alert>
      ) : (
        <>
          <Row className="g-4">
            {activities.map(activity => (
              <Col key={activity._id} sm={6} lg={4}>
                <ActivityCard activity={activity} />
              </Col>
            ))}
          </Row>
          
          {/* Summary stats */}
          <div className="mt-5 p-4 rounded" style={{ backgroundColor: '#e9ecef' }}>
            <Row className="text-center">
              <Col md={3}>
                <h4 style={{ color: '#6f42c1' }}>{activities.length}</h4>
                <small className="text-muted">Activities</small>
              </Col>
              <Col md={3}>
                <h4 style={{ color: '#87ceeb' }}>
                  {activities.filter(a => a.averageRating > 0).length}
                </h4>
                <small className="text-muted">Rated</small>
              </Col>
              <Col md={3}>
                <h4 style={{ color: '#ffd700' }}>
                  {Math.round(activities.reduce((sum, a) => sum + (a.estimatedDuration || 0), 0) / 60)}h
                </h4>
                <small className="text-muted">Total Time</small>
              </Col>
              <Col md={3}>
                <h4 style={{ color: '#1a1a1a' }}>
                  {activities.reduce((sum, a) => sum + (a.resources?.length || 0), 0)}
                </h4>
                <small className="text-muted">Resources</small>
              </Col>
            </Row>
          </div>
        </>
      )}
    </Container>
  );
};

export default ActivitiesPage;