// File: 01frontend/src/pages/SubjectDetailPage.js

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Badge, Spinner, Alert, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaGraduationCap, FaBook, FaUsers } from 'react-icons/fa';
import TopicGrid from '../components/topics/TopicGrid';
import { apiService } from '../services/api';

const SubjectDetailPage = () => {
  const { subjectId } = useParams();
  const [subject, setSubject] = useState(null);
  const [yearGroups, setYearGroups] = useState([]);
  const [selectedYearGroup, setSelectedYearGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSubjectData();
  }, [subjectId]);

  useEffect(() => {
    if (yearGroups.length > 0 && !selectedYearGroup) {
      setSelectedYearGroup(yearGroups[0]);
    }
  }, [yearGroups, selectedYearGroup]);

  const fetchSubjectData = async () => {
    try {
      setLoading(true);
      
      // Fetch subject details and year groups in parallel
      const [subjectResponse, yearGroupsResponse] = await Promise.all([
        apiService.getSubject(subjectId),
        apiService.getYearGroups(subjectId)
      ]);
      
      setSubject(subjectResponse.data.data);
      setYearGroups(yearGroupsResponse.data.data);
      setError(null);
    } catch (err) {
      setError('Failed to load subject details. Please try again.');
      console.error('Error fetching subject data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="py-4">
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3 text-muted">Loading subject details...</p>
        </div>
      </Container>
    );
  }

  if (error || !subject) {
    return (
      <Container className="py-4">
        <Alert variant="danger" className="text-center">
          <Alert.Heading>Unable to Load Subject</Alert.Heading>
          <p>{error || 'Subject not found.'}</p>
          <div className="d-flex gap-2 justify-content-center">
            <Button variant="outline-danger" onClick={fetchSubjectData}>
              Try Again
            </Button>
            <Button as={Link} to="/subjects" variant="primary">
              Back to Subjects
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      {/* Back button */}
      <div className="mb-3">
        <Button as={Link} to="/subjects" variant="outline-primary" size="sm">
          <FaArrowLeft className="me-2" />
          Back to Subjects
        </Button>
      </div>

      {/* Subject header */}
      <div 
        className="mb-4 p-4 rounded text-white"
        style={{ backgroundColor: subject.colorTheme || '#6f42c1' }}
      >
        <Row className="align-items-center">
          <Col md={8}>
            <h1 className="mb-2">{subject.name}</h1>
            <p className="mb-3 opacity-90">{subject.description}</p>
            <Badge bg="light" text="dark" className="me-2">
              {subject.category}
            </Badge>
            <Badge bg="dark" className="me-2">
              {yearGroups.length} Year Groups
            </Badge>
            <Badge bg="warning" text="dark">
              {subject.totalActivities || 0} Activities
            </Badge>
          </Col>
          <Col md={4} className="text-center">
            <div className="bg-white bg-opacity-20 p-3 rounded">
              <FaBook size={48} className="mb-2" />
              <h4>{subject.totalTopics || 0}</h4>
              <small>Topics Available</small>
            </div>
          </Col>
        </Row>
      </div>

      {/* Year Groups Navigation */}
      {yearGroups.length > 0 && (
        <div className="mb-4">
          <h5 className="mb-3">
            <FaGraduationCap className="me-2" />
            Select Year Group
          </h5>
          <Row className="g-3">
            {yearGroups.map(yearGroup => (
              <Col key={yearGroup._id} sm={6} md={4} lg={3}>
                <Card
                  className={`text-center border-2 cursor-pointer ${
                    selectedYearGroup?._id === yearGroup._id 
                      ? 'border-primary bg-primary text-white' 
                      : 'border-light'
                  }`}
                  style={{ 
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => setSelectedYearGroup(yearGroup)}
                >
                  <Card.Body className="py-3">
                    <h6 className="mb-1">{yearGroup.name}</h6>
                    <small className={selectedYearGroup?._id === yearGroup._id ? 'opacity-90' : 'text-muted'}>
                      Ages {yearGroup.ageRange.min}-{yearGroup.ageRange.max}
                    </small>
                    <div className="mt-2">
                      <small>
                        <FaUsers className="me-1" />
                        {yearGroup.topicCount || 0} topics
                      </small>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      )}

      {/* Topics Grid */}
      {selectedYearGroup ? (
        <TopicGrid 
          yearGroupId={selectedYearGroup._id}
          subjectInfo={subject}
        />
      ) : (
        <Alert variant="info" className="text-center">
          <h5>No Year Groups Available</h5>
          <p>This subject doesn't have any year groups set up yet.</p>
        </Alert>
      )}
    </Container>
  );
};

export default SubjectDetailPage;