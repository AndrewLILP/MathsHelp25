// /Users/andrewleary/Documents/CS-Capstone-Github/MathsHelp25/01frontend/src/components/activities/ActivityForm.js


import React, { useState } from 'react';
import { 
  Form, 
  Row, 
  Col, 
  Button, 
  Card, 
  Alert,
  InputGroup,
} from 'react-bootstrap';
import { FaPlus, FaTrash, FaSave, FaTimes } from 'react-icons/fa';
import { apiService } from '../../services/api';

const ActivityForm = ({ topicId, topicInfo, onCancel, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    activityType: 'Hands-on Activity',
    difficulty: 'Developing',
    estimatedDuration: 45,
    classSize: { min: 2, max: 30 },
    materialsNeeded: [''],
    learningOutcomes: [''],
    keywords: [''],
    resources: [{ title: '', url: '', type: 'Website', description: '' }]
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const activityTypes = [
    'Worksheet',
    'Interactive Game', 
    'Video Tutorial',
    'Hands-on Activity',
    'Problem Set',
    'Assessment',
    'Digital Tool',
    'Manipulative Activity',
    'Real-world Application'
  ];

  const difficulties = ['Foundation', 'Developing', 'Proficient', 'Advanced'];
  const resourceTypes = ['PDF', 'Website', 'Video', 'Interactive', 'Download', 'Other'];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleClassSizeChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      classSize: {
        ...prev.classSize,
        [field]: parseInt(value) || 1
      }
    }));
  };

  const handleArrayChange = (field, index, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleResourceChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      resources: prev.resources.map((resource, i) => 
        i === index ? { ...resource, [field]: value } : resource
      )
    }));
  };

  const addResource = () => {
    setFormData(prev => ({
      ...prev,
      resources: [...prev.resources, { title: '', url: '', type: 'Website', description: '' }]
    }));
  };

  const removeResource = (index) => {
    setFormData(prev => ({
      ...prev,
      resources: prev.resources.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Clean up the data
      const cleanData = {
        ...formData,
        topic: topicId,
        materialsNeeded: formData.materialsNeeded.filter(item => item.trim()),
        learningOutcomes: formData.learningOutcomes.filter(item => item.trim()),
        keywords: formData.keywords.filter(item => item.trim()),
        resources: formData.resources.filter(resource => 
          resource.title.trim() && resource.url.trim()
        )
      };

      await apiService.createActivity(cleanData);
      onSuccess?.();
    } catch (err) {
      setError('Failed to create activity. Please try again.');
      console.error('Error creating activity:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-0 shadow">
      <Card.Header className="bg-mh-purple text-white">
        <h5 className="mb-0">Create New Activity</h5>
        {topicInfo && (
          <small className="opacity-75">
            For: {topicInfo.name} ({topicInfo.yearGroup?.name})
          </small>
        )}
      </Card.Header>
      
      <Card.Body className="p-4">
        {error && (
          <Alert variant="danger" className="mb-4">
            {error}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          {/* Basic Information */}
          <Row className="mb-4">
            <Col>
              <h6 className="text-mh-purple mb-3">Basic Information</h6>
              
              <Form.Group className="mb-3">
                <Form.Label>Activity Title *</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="e.g., Solving Linear Equations with Balance Method"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Description *</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe the activity, its purpose, and how students will engage..."
                  required
                />
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Activity Type</Form.Label>
                    <Form.Select
                      value={formData.activityType}
                      onChange={(e) => handleInputChange('activityType', e.target.value)}
                    >
                      {activityTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Difficulty Level</Form.Label>
                    <Form.Select
                      value={formData.difficulty}
                      onChange={(e) => handleInputChange('difficulty', e.target.value)}
                    >
                      {difficulties.map(diff => (
                        <option key={diff} value={diff}>{diff}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Duration (minutes)</Form.Label>
                    <Form.Control
                      type="number"
                      value={formData.estimatedDuration}
                      onChange={(e) => handleInputChange('estimatedDuration', parseInt(e.target.value))}
                      min="5"
                      max="240"
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Min Class Size</Form.Label>
                    <Form.Control
                      type="number"
                      value={formData.classSize.min}
                      onChange={(e) => handleClassSizeChange('min', e.target.value)}
                      min="1"
                      max="50"
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Max Class Size</Form.Label>
                    <Form.Control
                      type="number"
                      value={formData.classSize.max}
                      onChange={(e) => handleClassSizeChange('max', e.target.value)}
                      min="1"
                      max="50"
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Col>
          </Row>

          {/* Materials Needed */}
          <Row className="mb-4">
            <Col>
              <h6 className="text-mh-purple mb-3">Materials Needed</h6>
              {formData.materialsNeeded.map((material, index) => (
                <InputGroup className="mb-2" key={index}>
                  <Form.Control
                    type="text"
                    value={material}
                    onChange={(e) => handleArrayChange('materialsNeeded', index, e.target.value)}
                    placeholder="e.g., Balance scales, Algebra tiles"
                  />
                  <Button
                    variant="outline-danger"
                    onClick={() => removeArrayItem('materialsNeeded', index)}
                    disabled={formData.materialsNeeded.length === 1}
                  >
                    <FaTrash />
                  </Button>
                </InputGroup>
              ))}
              <Button 
                variant="outline-primary" 
                size="sm"
                onClick={() => addArrayItem('materialsNeeded')}
              >
                <FaPlus className="me-1" /> Add Material
              </Button>
            </Col>
          </Row>

          {/* Learning Outcomes */}
          <Row className="mb-4">
            <Col>
              <h6 className="text-mh-purple mb-3">Learning Outcomes</h6>
              {formData.learningOutcomes.map((outcome, index) => (
                <InputGroup className="mb-2" key={index}>
                  <Form.Control
                    type="text"
                    value={outcome}
                    onChange={(e) => handleArrayChange('learningOutcomes', index, e.target.value)}
                    placeholder="e.g., Students can solve simple linear equations"
                  />
                  <Button
                    variant="outline-danger"
                    onClick={() => removeArrayItem('learningOutcomes', index)}
                    disabled={formData.learningOutcomes.length === 1}
                  >
                    <FaTrash />
                  </Button>
                </InputGroup>
              ))}
              <Button 
                variant="outline-primary" 
                size="sm"
                onClick={() => addArrayItem('learningOutcomes')}
              >
                <FaPlus className="me-1" /> Add Outcome
              </Button>
            </Col>
          </Row>

          {/* Keywords */}
          <Row className="mb-4">
            <Col>
              <h6 className="text-mh-purple mb-3">Keywords (for search)</h6>
              {formData.keywords.map((keyword, index) => (
                <InputGroup className="mb-2" key={index}>
                  <Form.Control
                    type="text"
                    value={keyword}
                    onChange={(e) => handleArrayChange('keywords', index, e.target.value)}
                    placeholder="e.g., linear equations, balance method"
                  />
                  <Button
                    variant="outline-danger"
                    onClick={() => removeArrayItem('keywords', index)}
                    disabled={formData.keywords.length === 1}
                  >
                    <FaTrash />
                  </Button>
                </InputGroup>
              ))}
              <Button 
                variant="outline-primary" 
                size="sm"
                onClick={() => addArrayItem('keywords')}
              >
                <FaPlus className="me-1" /> Add Keyword
              </Button>
            </Col>
          </Row>

          {/* Resources */}
          <Row className="mb-4">
            <Col>
              <h6 className="text-mh-purple mb-3">Digital Resources & Links</h6>
              {formData.resources.map((resource, index) => (
                <Card key={index} className="mb-3 border-light">
                  <Card.Body className="p-3">
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-2">
                          <Form.Label className="small">Resource Title</Form.Label>
                          <Form.Control
                            type="text"
                            value={resource.title}
                            onChange={(e) => handleResourceChange(index, 'title', e.target.value)}
                            placeholder="e.g., Interactive Balance Tool"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-2">
                          <Form.Label className="small">Type</Form.Label>
                          <Form.Select
                            value={resource.type}
                            onChange={(e) => handleResourceChange(index, 'type', e.target.value)}
                          >
                            {resourceTypes.map(type => (
                              <option key={type} value={type}>{type}</option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Form.Group className="mb-2">
                      <Form.Label className="small">URL</Form.Label>
                      <Form.Control
                        type="url"
                        value={resource.url}
                        onChange={(e) => handleResourceChange(index, 'url', e.target.value)}
                        placeholder="https://example.com/resource"
                      />
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Label className="small">Description</Form.Label>
                      <Form.Control
                        type="text"
                        value={resource.description}
                        onChange={(e) => handleResourceChange(index, 'description', e.target.value)}
                        placeholder="Brief description of this resource"
                      />
                    </Form.Group>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => removeResource(index)}
                      disabled={formData.resources.length === 1}
                    >
                      <FaTrash className="me-1" /> Remove Resource
                    </Button>
                  </Card.Body>
                </Card>
              ))}
              <Button 
                variant="outline-primary" 
                size="sm"
                onClick={addResource}
              >
                <FaPlus className="me-1" /> Add Resource
              </Button>
            </Col>
          </Row>

          {/* Submit Buttons */}
          <Row>
            <Col className="d-flex justify-content-end gap-2">
              <Button 
                variant="outline-secondary" 
                onClick={onCancel}
                disabled={loading}
              >
                <FaTimes className="me-1" /> Cancel
              </Button>
              <Button 
                type="submit" 
                variant="primary"
                disabled={loading || !formData.title || !formData.description}
                style={{ backgroundColor: 'var(--mh-purple)', borderColor: 'var(--mh-purple)' }}
              >
                {loading ? 'Creating...' : (
                  <>
                    <FaSave className="me-1" /> Create Activity
                  </>
                )}
              </Button>
            </Col>
          </Row>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default ActivityForm;