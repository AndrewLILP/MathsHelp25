import React from 'react';
import { Card, Badge, ProgressBar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { 
  FaClock, 
  FaEye, 
  FaStar, 
  FaBook,
  FaCalculator,
  FaRuler,
  FaChartBar,
  FaBrain
} from 'react-icons/fa';

const TopicCard = ({ topic }) => {
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

  return (
    <Card 
      as={Link} 
      to={`/topics/${topic._id}/activities`}
      className="h-100 text-decoration-none topic-card border-0 shadow-sm"
      style={{ 
        transition: 'all 0.3s ease',
        cursor: 'pointer'
      }}
    >
      <Card.Body className="p-4">
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
        <Card.Text className="text-muted mb-3">
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
        
        {/* Stats footer */}
        <div className="d-flex justify-content-between text-muted small">
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
          <div className="mt-2 d-flex align-items-center">
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