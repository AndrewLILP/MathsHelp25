// File: 01frontend/src/components/topics/TopicCard.js
// Complete TopicCard with interactive GeoGebra features added

import React from 'react';
import { Card, Badge, ProgressBar, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaClock, 
  FaEye, 
  FaStar, 
  FaBook,
  FaCalculator,
  FaRuler,
  FaChartBar,
  FaBrain,
  FaPlay,
  FaExternalLinkAlt
} from 'react-icons/fa';

const TopicCard = ({ topic, showInteractiveButton = true }) => {
  const navigate = useNavigate();

  // Get strand icon
  const getStrandIcon = (strand) => {
    const iconMap = {
      'Number and Algebra': FaCalculator,
      'Measurement and Geometry': FaRuler,
      'Statistics and Probability': FaChartBar,
      'Mathematical Reasoning': FaBrain,
      'Problem Solving': FaBook
    };
    
    const IconComponent = iconMap[strand] || FaBook;
    return <IconComponent className="me-2" />;
  };

  // Get difficulty color
  const getDifficultyColor = (difficulty) => {
    const colorMap = {
      'Foundation': 'success',
      'Developing': 'primary', 
      'Proficient': 'warning',
      'Advanced': 'danger'
    };
    return colorMap[difficulty] || 'secondary';
  };

  // Get difficulty progress value
  const getDifficultyProgress = (difficulty) => {
    const progressMap = {
      'Foundation': 25,
      'Developing': 50,
      'Proficient': 75,
      'Advanced': 100
    };
    return progressMap[difficulty] || 0;
  };

  // Check if topic has interactive potential
  const hasInteractiveDemo = (topicName) => {
    const name = topicName.toLowerCase();
    return name.includes('quadratic') || 
           name.includes('linear') || 
           name.includes('trigonometry') || 
           name.includes('sine') || 
           name.includes('cosine') || 
           name.includes('circle') || 
           name.includes('geometry');
  };

  // Handle interactive tool navigation
  const handleInteractiveClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/topics/${topic._id}?tab=interactive`);
  };

  // Handle activities navigation
  const handleActivitiesClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/topics/${topic._id}/activities`);
  };

  // Handle card click - go to topic detail page
  const handleCardClick = (e) => {
    e.preventDefault();
    navigate(`/topics/${topic._id}`);
  };

  return (
    <Card 
      className="h-100 text-decoration-none topic-card border-0 shadow-sm"
      style={{ 
        transition: 'all 0.3s ease',
        cursor: 'pointer'
      }}
      onClick={handleCardClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
      }}
    >
      <Card.Body className="p-4 d-flex flex-column">
        {/* Header with strand and difficulty */}
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div className="d-flex align-items-center text-primary small">
            {getStrandIcon(topic.strand)}
            <span>{topic.strand}</span>
          </div>
          <Badge bg={getDifficultyColor(topic.difficulty)}>
            {topic.difficulty}
          </Badge>
        </div>
        
        {/* Topic title */}
        <Card.Title className="h5 mb-2 text-dark">
          {topic.name}
        </Card.Title>
        
        {/* Description */}
        <Card.Text className="text-muted mb-3 flex-grow-1">
          {topic.description}
        </Card.Text>
        
        {/* Learning objectives */}
        {topic.learningObjectives && topic.learningObjectives.length > 0 && (
          <div className="mb-3">
            <h6 className="small text-uppercase text-muted mb-2">Learning Objectives</h6>
            <ul className="small text-muted mb-0 ps-3">
              {topic.learningObjectives.slice(0, 2).map((objective, index) => (
                <li key={index}>{objective}</li>
              ))}
              {topic.learningObjectives.length > 2 && (
                <li className="text-primary">+{topic.learningObjectives.length - 2} more...</li>
              )}
            </ul>
          </div>
        )}
        
        {/* Difficulty progress bar */}
        <div className="mb-3">
          <div className="d-flex justify-content-between align-items-center mb-1">
            <span className="small text-muted">Difficulty Level</span>
            <span className="small fw-bold">{topic.difficulty}</span>
          </div>
          <ProgressBar 
            variant={getDifficultyColor(topic.difficulty)}
            now={getDifficultyProgress(topic.difficulty)}
            style={{ height: '4px' }}
          />
        </div>
        
        {/* Interactive Demo Indicator */}
        {hasInteractiveDemo(topic.name) && (
          <div className="mb-3">
            <Badge bg="info" className="d-flex align-items-center justify-content-center py-2">
              <FaPlay className="me-2" style={{ fontSize: '0.8em' }} />
              Interactive Demo Available
            </Badge>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="mt-auto">
          <div className="d-grid gap-2">
            {/* Interactive Tool Button */}
            {showInteractiveButton && hasInteractiveDemo(topic.name) && (
              <Button
                variant="primary"
                size="sm"
                onClick={handleInteractiveClick}
                className="d-flex align-items-center justify-content-center"
                style={{ 
                  backgroundColor: 'var(--mh-purple, #6f42c1)', 
                  borderColor: 'var(--mh-purple, #6f42c1)' 
                }}
              >
                <FaPlay className="me-2" />
                Try Interactive Tool
              </Button>
            )}
            
            {/* View Activities Button */}
            <Button
              variant="outline-primary"
              size="sm"
              onClick={handleActivitiesClick}
              className="d-flex align-items-center justify-content-center"
            >
              <FaBook className="me-2" />
              View Activities ({topic.activityCount || 0})
            </Button>
            
            {/* View Topic Detail Button */}
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={handleCardClick}
              className="d-flex align-items-center justify-content-center"
            >
              <FaExternalLinkAlt className="me-2" />
              Topic Details
            </Button>
          </div>
        </div>
        
        {/* Stats footer */}
        <div className="d-flex justify-content-between text-muted small mt-3 pt-3 border-top">
          <span>
            <FaClock className="me-1" />
            {topic.estimatedDuration || 60} min
          </span>
          <span>
            <FaBook className="me-1" />
            {topic.activityCount || 0} activities
          </span>
          <span>
            <FaEye className="me-1" />
            {topic.viewCount || 0} views
          </span>
        </div>
        
        {/* Rating if available */}
        {topic.averageRating > 0 && (
          <div className="mt-2 d-flex align-items-center justify-content-center">
            <FaStar className="text-warning me-1" />
            <span className="small">
              {topic.averageRating.toFixed(1)} ({topic.totalRatings} ratings)
            </span>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default TopicCard;