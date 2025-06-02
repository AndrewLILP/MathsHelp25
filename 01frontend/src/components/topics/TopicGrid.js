// File: //01frontend/src/components/topics/TopicGrid.js

import React, { useState, useEffect } from 'react';
import { Row, Col, Spinner, Alert, ButtonGroup, Button, Form } from 'react-bootstrap';
import TopicCard from './TopicCard';
import { apiService } from '../../services/api';

const TopicGrid = ({ yearGroupId, subjectInfo }) => {
  const [topics, setTopics] = useState([]);
  const [filteredTopics, setFilteredTopics] = useState([]);
  const [selectedStrand, setSelectedStrand] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get unique strands and difficulties from topics
  const strands = ['All', ...new Set(topics.map(topic => topic.strand))];
  const difficulties = ['All', 'Foundation', 'Developing', 'Proficient', 'Advanced'];

  useEffect(() => {
    if (yearGroupId) {
      fetchTopics();
    }
  }, [yearGroupId]);

  useEffect(() => {
    filterTopics();
  }, [topics, selectedStrand, selectedDifficulty]);

  const fetchTopics = async () => {
    try {
      setLoading(true);
      const response = await apiService.getTopics(yearGroupId);
      setTopics(response.data.data);
      setError(null);
    } catch (err) {
      setError('Failed to load topics. Please try again.');
      console.error('Error fetching topics:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterTopics = () => {
    let filtered = topics;
    
    if (selectedStrand !== 'All') {
      filtered = filtered.filter(topic => topic.strand === selectedStrand);
    }
    
    if (selectedDifficulty !== 'All') {
      filtered = filtered.filter(topic => topic.difficulty === selectedDifficulty);
    }
    
    setFilteredTopics(filtered);
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3 text-muted">Loading topics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="text-center">
        <Alert.Heading>Unable to Load Topics</Alert.Heading>
        <p>{error}</p>
        <Button variant="outline-danger" onClick={fetchTopics}>
          Try Again
        </Button>
      </Alert>
    );
  }

  return (
    <div>
      {/* Header with subject info */}
      {subjectInfo && (
        <div className="mb-4 p-4 rounded" style={{ backgroundColor: subjectInfo.colorTheme + '15' }}>
          <div className="d-flex align-items-center mb-2">
            <div 
              className="rounded-circle d-flex align-items-center justify-content-center me-3"
              style={{ 
                width: '60px', 
                height: '60px', 
                backgroundColor: subjectInfo.colorTheme,
                color: 'white'
              }}
            >
              <span className="h4 mb-0">{subjectInfo.name.charAt(0)}</span>
            </div>
            <div>
              <h2 className="mb-1">{subjectInfo.name} Topics</h2>
              <p className="text-muted mb-0">
                {filteredTopics.length} topic{filteredTopics.length !== 1 ? 's' : ''} available
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="d-flex flex-wrap gap-3 mb-4">
        <div>
          <Form.Label className="small text-muted mb-1">Mathematical Strand</Form.Label>
          <ButtonGroup size="sm">
            {strands.map(strand => (
              <Button
                key={strand}
                variant={selectedStrand === strand ? 'primary' : 'outline-primary'}
                onClick={() => setSelectedStrand(strand)}
              >
                {strand === 'All' ? 'All Strands' : strand}
              </Button>
            ))}
          </ButtonGroup>
        </div>
        
        <div>
          <Form.Label className="small text-muted mb-1">Difficulty Level</Form.Label>
          <ButtonGroup size="sm">
            {difficulties.map(difficulty => (
              <Button
                key={difficulty}
                variant={selectedDifficulty === difficulty ? 'success' : 'outline-success'}
                onClick={() => setSelectedDifficulty(difficulty)}
              >
                {difficulty === 'All' ? 'All Levels' : difficulty}
              </Button>
            ))}
          </ButtonGroup>
        </div>
      </div>

      {/* Topic Grid */}
      {filteredTopics.length === 0 ? (
        <Alert variant="info" className="text-center">
          <h5>No topics found</h5>
          <p>
            {topics.length === 0 
              ? 'No topics have been added to this year group yet.' 
              : 'No topics match the selected filters. Try adjusting your filters.'
            }
          </p>
        </Alert>
      ) : (
        <Row className="g-4">
          {filteredTopics.map(topic => (
            <Col key={topic._id} sm={6} lg={4} xl={4}>
              <TopicCard topic={topic} />
            </Col>
          ))}
        </Row>
      )}

      {/* Summary Stats */}
      {filteredTopics.length > 0 && (
        <div className="mt-5 p-4 bg-light rounded">
          <Row className="text-center">
            <Col md={3}>
              <h4 className="text-primary">{filteredTopics.length}</h4>
              <small className="text-muted">Topics</small>
            </Col>
            <Col md={3}>
              <h4 className="text-success">
                {filteredTopics.reduce((sum, topic) => sum + (topic.activityCount || 0), 0)}
              </h4>
              <small className="text-muted">Activities</small>
            </Col>
            <Col md={3}>
              <h4 className="text-warning">
                {Math.round(filteredTopics.reduce((sum, topic) => sum + (topic.estimatedDuration || 60), 0) / 60)}h
              </h4>
              <small className="text-muted">Est. Duration</small>
            </Col>
            <Col md={3}>
              <h4 className="text-info">
                {filteredTopics.reduce((sum, topic) => sum + (topic.viewCount || 0), 0)}
              </h4>
              <small className="text-muted">Total Views</small>
            </Col>
          </Row>
        </div>
      )}
    </div>
  );
};

export default TopicGrid;