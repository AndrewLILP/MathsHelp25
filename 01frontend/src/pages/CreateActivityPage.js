// File: 01frontend/src/pages/CreateActivityPage.js
// Enhanced version that handles subjects with no topics

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert, Form, Badge } from 'react-bootstrap';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { FaBook, FaArrowLeft, FaSearch, FaPlus, FaExclamationTriangle } from 'react-icons/fa';
import { useUserRole } from '../hooks/useUserRole';
import ActivityForm from '../components/activities/ActivityForm';
import { apiService } from '../services/api';

const CreateActivityPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const { userRole, canCreate, isLoading: roleLoading } = useUserRole();
  
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [yearGroups, setYearGroups] = useState([]);
  const [topics, setTopics] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedYearGroup, setSelectedYearGroup] = useState(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('topic-selection'); // 'topic-selection' or 'activity-form'
  const [error, setError] = useState(null);

  // Set up Auth0 token for API calls
  useEffect(() => {
    window.getAuth0Token = async () => {
      try {
        return await getAccessTokenSilently({
          audience: process.env.REACT_APP_AUTH0_AUDIENCE
        });
      } catch (error) {
        console.log('Error getting token:', error);
        return null;
      }
    };
  }, [getAccessTokenSilently]);

  // Check if topic ID is provided in URL params
  useEffect(() => {
    const topicId = searchParams.get('topicId');
    if (topicId) {
      loadTopicById(topicId);
    } else {
      loadSubjects();
    }
  }, [searchParams]);

  const loadTopicById = async (topicId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getTopic(topicId);
      const topicData = response.data.data || response.data;
      setSelectedTopic(topicData);
      setStep('activity-form');
    } catch (error) {
      console.error('Error loading topic:', error);
      setError('Failed to load topic. Please try selecting a topic manually.');
      setStep('topic-selection');
      loadSubjects();
    } finally {
      setLoading(false);
    }
  };

  const loadSubjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getSubjects();
      const subjectsData = response.data.data || response.data || [];
      setSubjects(subjectsData);
    } catch (error) {
      console.error('Error loading subjects:', error);
      setError('Failed to load subjects. Using fallback data.');
      // Fallback to mock data for development
      setSubjects([
        { _id: '1', name: 'Mathematics', description: 'Core mathematics topics' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const loadYearGroups = async (subjectId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getYearGroups(subjectId);
      const yearGroupsData = response.data.data || response.data || [];
      setYearGroups(yearGroupsData);
      setTopics([]); // Reset topics when year groups change
    } catch (error) {
      console.error('Error loading year groups:', error);
      setError('Failed to load year groups.');
      setYearGroups([]);
    } finally {
      setLoading(false);
    }
  };

  const loadTopics = async (yearGroupId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getTopics(yearGroupId);
      const topicsData = response.data.data || response.data || [];
      setTopics(topicsData);
    } catch (error) {
      console.error('Error loading topics:', error);
      setError('Failed to load topics.');
      setTopics([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubjectSelect = (subjectId) => {
    const subject = subjects.find(s => s._id === subjectId);
    setSelectedSubject(subject);
    setSelectedYearGroup(null);
    setYearGroups([]);
    setTopics([]);
    if (subjectId) {
      loadYearGroups(subjectId);
    }
  };

  const handleYearGroupSelect = (yearGroupId) => {
    const yearGroup = yearGroups.find(y => y._id === yearGroupId);
    setSelectedYearGroup(yearGroup);
    setTopics([]);
    if (yearGroupId) {
      loadTopics(yearGroupId);
    }
  };

  const handleActivityCreated = () => {
    alert('Activity created successfully!');
    navigate('/dashboard');
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const handleTopicSelect = (topic) => {
    setSelectedTopic(topic);
    setStep('activity-form');
  };

  const createNewTopic = () => {
    // For now, show instructions to admin
    alert('Contact your administrator to add new topics to this year group.');
  };

  // Show loading state
  if (roleLoading || loading) {
    return (
      <Container className="mt-5 text-center">
        <div className="spinner-border" style={{ color: 'var(--mh-purple)' }} />
        <p className="mt-3">
          {roleLoading ? 'Loading user permissions...' : 'Loading content...'}
        </p>
      </Container>
    );
  }

  // Show auth error
  if (!isAuthenticated) {
    return (
      <Container className="mt-5">
        <Alert variant="warning">
          <Alert.Heading>Authentication Required</Alert.Heading>
          <p>You need to be logged in to create activities.</p>
        </Alert>
      </Container>
    );
  }

  // Show permission error
  if (!canCreate) {
    return (
      <Container className="mt-5">
        <Alert variant="warning">
          <Alert.Heading>Permission Denied</Alert.Heading>
          <p>You need teacher or admin privileges to create activities.</p>
          <p className="text-muted">Current role: {userRole || 'none'}</p>
          <Button variant="outline-primary" onClick={() => navigate('/')}>
            Go Home
          </Button>
        </Alert>
      </Container>
    );
  }

  // Topic Selection Step
  if (step === 'topic-selection') {
    return (
      <Container className="mt-4">
        <Row className="mb-4">
          <Col>
            <div className="d-flex align-items-center mb-3">
              <Button 
                variant="outline-secondary" 
                size="sm" 
                onClick={handleCancel}
                className="me-3"
              >
                <FaArrowLeft className="me-1" /> Back
              </Button>
              <div>
                <h2 style={{ color: 'var(--mh-black)' }}>
                  <FaBook className="me-2" style={{ color: 'var(--mh-purple)' }} />
                  Create New Activity
                </h2>
                <p className="text-muted mb-0">
                  First, select the topic for your activity
                </p>
              </div>
            </div>
          </Col>
        </Row>

        {error && (
          <Row className="mb-3">
            <Col>
              <Alert variant="warning" dismissible onClose={() => setError(null)}>
                {error}
              </Alert>
            </Col>
          </Row>
        )}

        <Row>
          <Col lg={8}>
            <Card className="border-0 shadow">
              <Card.Header className="bg-mh-purple text-white">
                <h5 className="mb-0">
                  <FaSearch className="me-2" />
                  Select Topic
                </h5>
              </Card.Header>
              <Card.Body>
                {/* Subject Selection */}
                <Form.Group className="mb-3">
                  <Form.Label>Subject</Form.Label>
                  <Form.Select 
                    value={selectedSubject?._id || ''}
                    onChange={(e) => handleSubjectSelect(e.target.value)}
                  >
                    <option value="">Choose a subject...</option>
                    {subjects.map(subject => (
                      <option key={subject._id} value={subject._id}>
                        {subject.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                {/* Year Group Selection */}
                {selectedSubject && (
                  <Form.Group className="mb-3">
                    <Form.Label>
                      Year Group 
                      {yearGroups.length > 0 && (
                        <Badge bg="secondary" className="ms-2">{yearGroups.length} available</Badge>
                      )}
                    </Form.Label>
                    <Form.Select 
                      value={selectedYearGroup?._id || ''}
                      onChange={(e) => handleYearGroupSelect(e.target.value)}
                    >
                      <option value="">Choose a year group...</option>
                      {yearGroups.map(year => (
                        <option key={year._id} value={year._id}>
                          {year.name}
                        </option>
                      ))}
                    </Form.Select>
                    {yearGroups.length === 0 && selectedSubject && (
                      <Form.Text className="text-muted">
                        No year groups found for {selectedSubject.name}
                      </Form.Text>
                    )}
                  </Form.Group>
                )}

                {/* Topic Selection */}
                {selectedYearGroup && (
                  <div>
                    <Form.Label>
                      Topic 
                      {topics.length > 0 && (
                        <Badge bg="success" className="ms-2">{topics.length} available</Badge>
                      )}
                    </Form.Label>
                    
                    {topics.length > 0 ? (
                      <div className="row">
                        {topics.map(topic => (
                          <div key={topic._id} className="col-md-6 mb-3">
                            <Card 
                              className="h-100 border-light cursor-pointer"
                              style={{ cursor: 'pointer' }}
                              onClick={() => handleTopicSelect(topic)}
                            >
                              <Card.Body className="p-3">
                                <h6 className="text-mh-purple mb-2">{topic.name}</h6>
                                <p className="small text-muted mb-0">
                                  {topic.description || 'No description available'}
                                </p>
                                <div className="mt-2">
                                  <Badge bg="info" className="me-1">{topic.difficulty || 'General'}</Badge>
                                  <Badge bg="secondary">{topic.activityCount || 0} activities</Badge>
                                </div>
                              </Card.Body>
                            </Card>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <Alert variant="warning" className="mt-2">
                        <FaExclamationTriangle className="me-2" />
                        <strong>No topics found for {selectedYearGroup.name}</strong>
                        <p className="mb-2 mt-2">
                          This year group doesn't have any topics yet. Topics need to be created 
                          before activities can be added.
                        </p>
                        <Button 
                          variant="outline-warning" 
                          size="sm"
                          onClick={createNewTopic}
                        >
                          <FaPlus className="me-1" />
                          Request New Topic
                        </Button>
                      </Alert>
                    )}
                  </div>
                )}

                {selectedYearGroup && topics.length === 0 && (
                  <Alert variant="info" className="mt-3">
                    <strong>Need help?</strong>
                    <p className="mb-0 mt-1">
                      If you can't find the topic you're looking for, contact your administrator 
                      to add new topics to the curriculum structure.
                    </p>
                  </Alert>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  // Activity Form Step
  return (
    <Container className="mt-4">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex align-items-center mb-3">
            <Button 
              variant="outline-secondary" 
              size="sm" 
              onClick={() => setStep('topic-selection')}
              className="me-3"
            >
              <FaArrowLeft className="me-1" /> Change Topic
            </Button>
            <div>
              <h2 style={{ color: 'var(--mh-black)' }}>
                <FaBook className="me-2" style={{ color: 'var(--mh-purple)' }} />
                Create New Activity
              </h2>
              <p className="text-muted mb-0">
                Share your teaching expertise with the MathsHelp25 community
              </p>
            </div>
          </div>
        </Col>
      </Row>

      {/* Selected Topic Display */}
      <Row className="mb-4">
        <Col lg={8}>
          <Alert variant="info" className="border-0" style={{ backgroundColor: '#e8f4fd' }}>
            <div>
              <strong>Creating activity for:</strong> {selectedTopic?.name}
              <br />
              <small className="text-muted">
                {selectedSubject?.name || 'Mathematics'} • {selectedYearGroup?.name}
              </small>
            </div>
          </Alert>
        </Col>
      </Row>

      {/* Activity Form */}
      <Row>
        <Col>
          <ActivityForm
            topicId={selectedTopic?._id}
            topicInfo={selectedTopic}
            onCancel={handleCancel}
            onSuccess={handleActivityCreated}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default CreateActivityPage;