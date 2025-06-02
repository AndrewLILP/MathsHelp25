// File:  01frontend/src/components/subjects/SubjectGrid.js

import React, { useState, useEffect } from 'react';
import { Row, Col, Spinner, Alert, ButtonGroup, Button } from 'react-bootstrap';
import SubjectCard from './SubjectCard';
import { apiService } from '../../services/api';

const SubjectGrid = () => {
  const [subjects, setSubjects] = useState([]);
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSubjects();
    fetchCategories();
  }, []);

  useEffect(() => {
    filterSubjects();
  }, [subjects, selectedCategory]);

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const response = await apiService.getSubjects();
      setSubjects(response.data.data);
      setError(null);
    } catch (err) {
      setError('Failed to load subjects. Please check if the backend server is running.');
      console.error('Error fetching subjects:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await apiService.getSubjectCategories();
      setCategories(['All', ...response.data.data]);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setCategories(['All']); // Fallback
    }
  };

  const filterSubjects = () => {
    if (selectedCategory === 'All') {
      setFilteredSubjects(subjects);
    } else {
      setFilteredSubjects(subjects.filter(subject => subject.category === selectedCategory));
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3 text-muted">Loading mathematics subjects...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="text-center">
        <Alert.Heading>Unable to Load Subjects</Alert.Heading>
        <p>{error}</p>
        <Button variant="outline-danger" onClick={fetchSubjects}>
          Try Again
        </Button>
      </Alert>
    );
  }

  return (
    <div>
      {/* Category Filter */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Mathematics Subjects</h2>
          <p className="text-muted">
            Explore {filteredSubjects.length} subject{filteredSubjects.length !== 1 ? 's' : ''} 
            {selectedCategory !== 'All' && ` in ${selectedCategory}`}
          </p>
        </div>
        
        <ButtonGroup>
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'primary' : 'outline-primary'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </ButtonGroup>
      </div>

      {/* Subject Grid */}
      {filteredSubjects.length === 0 ? (
        <Alert variant="info" className="text-center">
          <h5>No subjects found</h5>
          <p>No subjects match the selected category. Try selecting a different category.</p>
        </Alert>
      ) : (
        <Row className="g-4">
          {filteredSubjects.map(subject => (
            <Col key={subject._id} sm={6} lg={4} xl={3}>
              <SubjectCard subject={subject} />
            </Col>
          ))}
        </Row>
      )}

      {/* Summary Stats */}
      {filteredSubjects.length > 0 && (
        <div className="mt-5 p-4 bg-light rounded">
          <Row className="text-center">
            <Col md={4}>
              <h4 className="text-primary">{filteredSubjects.length}</h4>
              <small className="text-muted">Subjects Available</small>
            </Col>
            <Col md={4}>
              <h4 className="text-success">
                {filteredSubjects.reduce((sum, subject) => sum + (subject.totalTopics || 0), 0)}
              </h4>
              <small className="text-muted">Total Topics</small>
            </Col>
            <Col md={4}>
              <h4 className="text-warning">
                {filteredSubjects.reduce((sum, subject) => sum + (subject.totalActivities || 0), 0)}
              </h4>
              <small className="text-muted">Total Activities</small>
            </Col>
          </Row>
        </div>
      )}
    </div>
  );
};

export default SubjectGrid;