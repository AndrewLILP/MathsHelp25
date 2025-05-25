import React from 'react';
import { Card, Badge, Button } from 'react-bootstrap';
import { 
  FaClock, 
  FaUsers, 
  FaStar, 
  FaEye,
  FaExternalLinkAlt,
  FaBook,
  FaGamepad,
  FaVideo,
  FaHands,
  FaCalculator,
  FaClipboardCheck,
  FaTools,
  FaCubes,
  FaGlobe
} from 'react-icons/fa';

const ActivityCard = ({ activity }) => {
  // Get activity type icon
  const getActivityIcon = (type) => {
    const iconMap = {
      'Worksheet': FaBook,
      'Interactive Game': FaGamepad,
      'Video Tutorial': FaVideo,
      'Hands-on Activity': FaHands,
      'Problem Set': FaCalculator,
      'Assessment': FaClipboardCheck,
      'Digital Tool': FaTools,
      'Manipulative Activity': FaCubes,
      'Real-world Application': FaGlobe
    };
    
    const IconComponent = iconMap[type] || FaBook;
    return <IconComponent className="me-2" />;
  };

  // Get difficulty color
  const getDifficultyColor = (difficulty) => {
    const colorMap = {
      'Foundation': 'var(--mh-sky-blue)',
      'Developing': 'var(--mh-purple)', 
      'Proficient': 'var(--mh-gold)',
      'Advanced': 'var(--mh-black)'
    };
    return colorMap[difficulty] || 'var(--mh-purple)';
  };

  return (
    <Card 
      className="h-100 border-0 shadow-sm animate-scale-up"
      style={{ 
        transition: 'all 0.3s ease',
        cursor: 'pointer'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.boxShadow = '0 8px 25px rgba(111, 66, 193, 0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
      }}
    >
      <Card.Body className="p-4">
        {/* Header with type and difficulty */}
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div className="d-flex align-items-center text-muted small">
            {getActivityIcon(activity.activityType)}
            <span>{activity.activityType}</span>
          </div>
          <Badge 
            style={{
              backgroundColor: getDifficultyColor(activity.difficulty),
              color: activity.difficulty === 'Proficient' ? 'var(--mh-black)' : 'white'
            }}
          >
            {activity.difficulty}
          </Badge>
        </div>
        
        {/* Title */}
        <Card.Title className="h5 mb-2" style={{ color: 'var(--mh-black)' }}>
          {activity.title}
        </Card.Title>
        
        {/* Description */}
        <Card.Text className="text-muted mb-3" style={{ 
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          lineHeight: '1.4'
        }}>
          {activity.description}
        </Card.Text>
        
        {/* Quick stats */}
        <div className="d-flex justify-content-between align-items-center mb-3 text-muted small">
          <span>
            <FaClock className="me-1" style={{ color: 'var(--mh-sky-blue)' }} />
            {activity.estimatedDuration} min
          </span>
          <span>
            <FaUsers className="me-1" style={{ color: 'var(--mh-purple)' }} />
            {activity.classSize?.min}-{activity.classSize?.max}
          </span>
          <span>
            <FaEye className="me-1" style={{ color: 'var(--mh-gold)' }} />
            {activity.viewCount || 0}
          </span>
        </div>
        
        {/* Rating if available */}
        {activity.averageRating > 0 && (
          <div className="mb-3 d-flex align-items-center">
            <FaStar style={{ color: 'var(--mh-gold)' }} className="me-1" />
            <span className="small fw-bold me-2">{activity.averageRating.toFixed(1)}</span>
            <span className="small text-muted">({activity.ratingCount} ratings)</span>
          </div>
        )}
        
        {/* Resources count */}
        {activity.resources && activity.resources.length > 0 && (
          <div className="mb-3">
            <small className="text-muted">
              📎 {activity.resources.length} resource{activity.resources.length !== 1 ? 's' : ''} included
            </small>
          </div>
        )}
        
        {/* Action buttons */}
        <div className="d-flex gap-2">
          <Button 
            variant="primary" 
            size="sm"
            className="flex-grow-1"
            style={{ 
              backgroundColor: 'var(--mh-purple)', 
              borderColor: 'var(--mh-purple)' 
            }}
          >
            View Details
          </Button>
          {activity.resources && activity.resources.length > 0 && (
            <Button 
              variant="outline-primary" 
              size="sm"
              style={{ 
                borderColor: 'var(--mh-gold)', 
                color: 'var(--mh-gold)' 
              }}
            >
              <FaExternalLinkAlt />
            </Button>
          )}
        </div>
        
        {/* Created by */}
        <div className="mt-3 pt-2 border-top">
          <small className="text-muted">
            By {activity.createdBy?.name || 'Anonymous Teacher'}
          </small>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ActivityCard;