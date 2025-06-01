// File: 01frontend/src/pages/TopicDetailPage.js
// Interactive topic page with GeoGebra integration - FIXED ICONS

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Alert, Tabs, Tab, Badge } from 'react-bootstrap';
import { FaBook, FaPlay, FaUndo, FaExpand, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';

const TopicDetailPage = () => {
  const { topicId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const geogebraRef = useRef(null);
  const [topic, setTopic] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [geogebraApp, setGeogebraApp] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Check URL params for initial tab
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['overview', 'interactive', 'activities'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // Load topic data
  useEffect(() => {
    loadTopicData();
  }, [topicId]);

  // Initialize GeoGebra when interactive tab is selected
  useEffect(() => {
    if (activeTab === 'interactive' && topic && !geogebraApp) {
      // Load GeoGebra script first, then initialize
      loadGeoGebraScript().then(() => {
        initializeGeoGebra();
      });
    }
  }, [activeTab, topic, geogebraApp]);

  const loadGeoGebraScript = () => {
    return new Promise((resolve, reject) => {
      // Check if already loaded
      if (window.GGBApplet) {
        resolve();
        return;
      }

      // Create script element
      const script = document.createElement('script');
      script.src = 'https://cdn.geogebra.org/apps/deployggb.js';
      script.async = true;
      
      script.onload = () => {
        console.log('✅ GeoGebra script loaded');
        resolve();
      };

      script.onerror = () => {
        console.error('❌ Failed to load GeoGebra script');
        reject(new Error('Failed to load GeoGebra script'));
      };

      document.head.appendChild(script);
    });
  };

  const loadTopicData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load topic details
      const topicResponse = await apiService.getTopic(topicId);
      const topicData = topicResponse.data.data || topicResponse.data;
      setTopic(topicData);

      // Activities are included in the topic response
      if (topicData.activities) {
        setActivities(topicData.activities);
      } else {
        // Fallback: load activities separately
        try {
          const activitiesResponse = await apiService.getActivitiesByTopic(topicId);
          const activitiesData = activitiesResponse.data || activitiesResponse;
          setActivities(Array.isArray(activitiesData) ? activitiesData : []);
        } catch (actError) {
          console.log('Activities not loaded, using empty array');
          setActivities([]);
        }
      }

    } catch (error) {
      console.error('Error loading topic data:', error);
      setError('Failed to load topic information');
      // Mock data for development
      setTopic({
        _id: topicId,
        name: 'Quadratic Functions',
        description: 'Explore parabolas and quadratic relationships with interactive tools',
        difficulty: 'Developing',
        yearGroup: { name: 'Year 10', subject: { name: 'Mathematics' } },
        strand: 'Number and Algebra',
        estimatedDuration: 60,
        viewCount: 0,
        activityCount: 0
      });
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  const initializeGeoGebra = () => {
    if (!window.GGBApplet || geogebraApp) return;

    const parameters = {
      appName: "graphing",
      width: 800,
      height: 600,
      showToolBar: true,
      showAlgebraInput: true,
      showMenuBar: false,
      showResetIcon: true,
      enableLabelDrags: false,
      enableShiftDragZoom: true,
      enableRightClick: false,
      showZoomButtons: true,
      capturingThreshold: null,
      errorDialogsActive: false,
      useBrowserForJS: false
    };

    try {
      const applet = new window.GGBApplet(parameters, true);
      
      applet.inject(geogebraRef.current, () => {
        const ggbApp = window.ggbApplet;
        setGeogebraApp(ggbApp);
        
        // Create interactive demo based on topic
        if (topic?.name?.toLowerCase().includes('quadratic')) {
          setupQuadraticDemo(ggbApp);
        } else if (topic?.name?.toLowerCase().includes('linear')) {
          setupLinearDemo(ggbApp);
        } else if (topic?.name?.toLowerCase().includes('trigonometry') || topic?.name?.toLowerCase().includes('sine')) {
          setupTrigDemo(ggbApp);
        } else {
          setupDefaultDemo(ggbApp);
        }
      });
    } catch (error) {
      console.error('Error initializing GeoGebra:', error);
      setError('Failed to load interactive tool');
    }
  };

  const setupQuadraticDemo = (ggbApp) => {
    try {
      // Create sliders for a, b, c
      ggbApp.evalCommand('a = Slider[-5, 5, 0.1, 1, 150, false, true, false, false]');
      ggbApp.evalCommand('b = Slider[-10, 10, 0.1, 1, 150, false, true, false, false]');
      ggbApp.evalCommand('c = Slider[-10, 10, 0.1, 1, 150, false, true, false, false]');
      
      // Create the quadratic function
      ggbApp.evalCommand('f(x) = a * x^2 + b * x + c');
      
      // Set initial values
      ggbApp.setValue('a', 1);
      ggbApp.setValue('b', 0);
      ggbApp.setValue('c', 0);
      
      // Add vertex point
      ggbApp.evalCommand('V = Vertex(f)');
      
      // Set view
      ggbApp.setCoordSystem(-10, 10, -10, 10);
      
      console.log('✅ Quadratic demo initialized');
    } catch (error) {
      console.error('Error setting up quadratic demo:', error);
    }
  };

  const setupLinearDemo = (ggbApp) => {
    try {
      // Create sliders for m and b in y = mx + b
      ggbApp.evalCommand('m = Slider[-5, 5, 0.1, 1, 150, false, true, false, false]');
      ggbApp.evalCommand('b = Slider[-10, 10, 0.1, 1, 150, false, true, false, false]');
      
      // Create the linear function
      ggbApp.evalCommand('f(x) = m * x + b');
      
      // Set initial values
      ggbApp.setValue('m', 1);
      ggbApp.setValue('b', 0);
      
      // Set view
      ggbApp.setCoordSystem(-10, 10, -10, 10);
      
      console.log('✅ Linear demo initialized');
    } catch (error) {
      console.error('Error setting up linear demo:', error);
    }
  };

  const setupTrigDemo = (ggbApp) => {
    try {
      // Create sliders for A, B, C in y = A*sin(B*x + C)
      ggbApp.evalCommand('A = Slider[-3, 3, 0.1, 1, 150, false, true, false, false]');
      ggbApp.evalCommand('B = Slider[0.1, 3, 0.1, 1, 150, false, true, false, false]');
      ggbApp.evalCommand('C = Slider[-π, π, 0.1, 0, 150, false, true, false, false]');
      
      // Create the sine function
      ggbApp.evalCommand('f(x) = A * sin(B * x + C)');
      
      // Set initial values
      ggbApp.setValue('A', 1);
      ggbApp.setValue('B', 1);
      ggbApp.setValue('C', 0);
      
      // Set view for trig functions
      ggbApp.setCoordSystem(-2*Math.PI, 2*Math.PI, -3, 3);
      
      console.log('✅ Trigonometry demo initialized');
    } catch (error) {
      console.error('Error setting up trig demo:', error);
    }
  };

  const setupDefaultDemo = (ggbApp) => {
    try {
      // Create a simple polynomial with sliders
      ggbApp.evalCommand('a = Slider[-3, 3, 0.1, 1, 150, false, true, false, false]');
      ggbApp.evalCommand('b = Slider[-3, 3, 0.1, 1, 150, false, true, false, false]');
      
      // Create function based on topic name
      ggbApp.evalCommand('f(x) = a * x + b');
      
      ggbApp.setValue('a', 1);
      ggbApp.setValue('b', 0);
      
      ggbApp.setCoordSystem(-10, 10, -10, 10);
      
      console.log('✅ Default demo initialized');
    } catch (error) {
      console.error('Error setting up default demo:', error);
    }
  };

  const resetDemo = () => {
    if (geogebraApp) {
      geogebraApp.reset();
      // Reinitialize based on topic
      setTimeout(() => {
        if (topic?.name?.toLowerCase().includes('quadratic')) {
          setupQuadraticDemo(geogebraApp);
        } else if (topic?.name?.toLowerCase().includes('linear')) {
          setupLinearDemo(geogebraApp);
        } else if (topic?.name?.toLowerCase().includes('trigonometry')) {
          setupTrigDemo(geogebraApp);
        } else {
          setupDefaultDemo(geogebraApp);
        }
      }, 100);
    }
  };

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <div className="spinner-border" style={{ color: 'var(--mh-purple, #6f42c1)' }} />
        <p className="mt-3">Loading topic...</p>
      </Container>
    );
  }

  if (error && !topic) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">
          <h5>Error Loading Topic</h5>
          <p>{error}</p>
          <Button variant="outline-danger" onClick={() => navigate(-1)}>
            Go Back
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex align-items-center mb-3">
            <Button 
              variant="outline-secondary" 
              size="sm" 
              onClick={() => navigate(-1)}
              className="me-3"
            >
              <FaArrowLeft className="me-1" /> Back
            </Button>
            <div>
              <h1 style={{ color: 'var(--mh-black, #333)' }}>
                <FaBook className="me-2" style={{ color: 'var(--mh-purple, #6f42c1)' }} />
                {topic?.name}
              </h1>
              <p className="text-muted mb-0">
                {topic?.yearGroup?.subject?.name} • {topic?.yearGroup?.name}
                {topic?.difficulty && (
                  <Badge bg="info" className="ms-2">{topic.difficulty}</Badge>
                )}
              </p>
            </div>
          </div>
        </Col>
      </Row>

      {/* Content Tabs */}
      <Row>
        <Col>
          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
            className="mb-4"
          >
            {/* Overview Tab */}
            <Tab eventKey="overview" title="Overview">
              <Row>
                <Col lg={8}>
                  <Card className="border-0 shadow-sm">
                    <Card.Body>
                      <h5 className="text-primary mb-3">About This Topic</h5>
                      <p>{topic?.description || 'Explore this mathematical concept with interactive tools and activities.'}</p>
                      
                      <h6 className="mt-4 mb-3">Learning Objectives</h6>
                      {topic?.learningObjectives && topic.learningObjectives.length > 0 ? (
                        <ul>
                          {topic.learningObjectives.map((objective, index) => (
                            <li key={index}>{objective}</li>
                          ))}
                        </ul>
                      ) : (
                        <ul>
                          <li>Understand the key concepts and principles</li>
                          <li>Apply knowledge through interactive exploration</li>
                          <li>Solve problems using mathematical reasoning</li>
                          <li>Connect concepts to real-world applications</li>
                        </ul>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
                <Col lg={4}>
                  <Card className="border-0 shadow-sm">
                    <Card.Body>
                      <h6 className="text-primary mb-3">Quick Actions</h6>
                      <div className="d-grid gap-2">
                        <Button 
                          variant="primary" 
                          onClick={() => setActiveTab('interactive')}
                          style={{ backgroundColor: 'var(--mh-purple, #6f42c1)', borderColor: 'var(--mh-purple, #6f42c1)' }}
                        >
                          <FaPlay className="me-2" />
                          Try Interactive Tool
                        </Button>
                        <Button 
                          variant="outline-primary" 
                          onClick={() => setActiveTab('activities')}
                        >
                          <FaBook className="me-2" />
                          View Activities ({activities.length})
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Tab>

            {/* Interactive Tab */}
            <Tab eventKey="interactive" title="Interactive Tool">
              <Row>
                <Col>
                  <Card className="border-0 shadow-sm">
                    <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center" style={{ backgroundColor: 'var(--mh-purple, #6f42c1) !important' }}>
                      <h5 className="mb-0">Interactive {topic?.name} Explorer</h5>
                      <div>
                        <Button 
                          variant="outline-light" 
                          size="sm" 
                          onClick={resetDemo}
                          className="me-2"
                        >
                          <FaUndo className="me-1" />
                          Reset
                        </Button>
                        <Button 
                          variant="outline-light" 
                          size="sm"
                          onClick={() => {
                            if (geogebraRef.current) {
                              geogebraRef.current.requestFullscreen?.();
                            }
                          }}
                        >
                          <FaExpand className="me-1" />
                          Fullscreen
                        </Button>
                      </div>
                    </Card.Header>
                    <Card.Body className="p-0">
                      {/* GeoGebra Container */}
                      <div 
                        ref={geogebraRef} 
                        id="geogebra-container"
                        style={{ 
                          width: '100%', 
                          height: '600px',
                          border: 'none'
                        }}
                      />
                      
                      {/* Instructions */}
                      <div className="p-3 bg-light">
                        <h6 className="text-primary mb-2">How to Use:</h6>
                        <ul className="mb-0 small">
                          <li>Use the sliders to adjust parameters and see real-time changes</li>
                          <li>Drag points and explore different configurations</li>
                          <li>Use zoom and pan to examine details</li>
                          <li>Try different values and observe the patterns</li>
                        </ul>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Tab>

            {/* Activities Tab */}
            <Tab eventKey="activities" title={`Activities (${activities.length})`}>
              <Row>
                <Col>
                  {activities.length > 0 ? (
                    <div className="row">
                      {activities.map((activity) => (
                        <div key={activity._id} className="col-md-6 col-lg-4 mb-4">
                          <Card className="h-100 border-0 shadow-sm">
                            <Card.Body>
                              <h6 className="text-primary mb-2">{activity.title}</h6>
                              <p className="small text-muted mb-3">{activity.description}</p>
                              <div className="mb-2">
                                <Badge bg="secondary" className="me-1">{activity.activityType}</Badge>
                                <Badge bg="info">{activity.difficulty}</Badge>
                              </div>
                              <div className="small text-muted">
                                <div>⏱️ {activity.estimatedDuration} minutes</div>
                                <div>👥 {activity.classSize?.min}-{activity.classSize?.max} students</div>
                                <div>⭐ {activity.averageRating?.toFixed(1) || 'No ratings'}</div>
                              </div>
                            </Card.Body>
                          </Card>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <Alert variant="info">
                      <h6>No Activities Yet</h6>
                      <p>No activities have been created for this topic yet. Be the first to contribute!</p>
                      <Button variant="outline-info" onClick={() => navigate(`/create/activity?topicId=${topicId}`)}>
                        Create Activity
                      </Button>
                    </Alert>
                  )}
                </Col>
              </Row>
            </Tab>
          </Tabs>
        </Col>
      </Row>
    </Container>
  );
};

export default TopicDetailPage;