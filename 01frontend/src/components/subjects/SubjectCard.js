// File: 01frontend/src/components/subjects/SubjectCard.js

import React from 'react';
import { Card, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { 
  FaCalculator, 
  FaShapes, 
  FaChartBar, 
  FaSquareRootAlt, 
  FaInfinity,
  FaBook
} from 'react-icons/fa';

const SubjectCard = ({ subject }) => {
  // Icon mapping based on subject iconType
  const getIcon = (iconType) => {
    const iconMap = {
      'calculator': FaCalculator,
      'geometry': FaShapes,
      'statistics': FaChartBar,
      'algebra': FaSquareRootAlt,
      'calculus': FaInfinity,
      'number-theory': FaBook,
      'applied-maths': FaCalculator,
      'reasoning': FaBook
    };
    
    const IconComponent = iconMap[iconType] || FaCalculator;
    return <IconComponent size={48} />;
  };

  // Category color mapping using our new color scheme
  const getCategoryColors = (category) => {
    const colorMap = {
      'Primary': {
        badge: 'var(--mh-sky-blue)',
        background: 'var(--mh-sky-blue-ultra-light)',
        border: 'var(--mh-sky-blue)',
        text: 'var(--mh-black)'
      },
      'Secondary': {
        badge: 'var(--mh-purple)',
        background: 'var(--mh-purple-ultra-light)', 
        border: 'var(--mh-purple)',
        text: 'white'
      },
      'Advanced': {
        badge: 'var(--mh-gold)',
        background: 'var(--mh-gold-ultra-light)',
        border: 'var(--mh-gold)',
        text: 'var(--mh-black)'
      }
    };
    return colorMap[category] || colorMap['Secondary'];
  };

  const colors = getCategoryColors(subject.category);

  return (
    <Card 
      as={Link} 
      to={`/subjects/${subject._id}`}
      className="h-100 text-decoration-none border-0 shadow-sm animate-scale-up"
      style={{ 
        borderLeft: `4px solid ${colors.border}`,
        background: `linear-gradient(135deg, ${colors.background}, white)`,
        transition: 'all 0.3s ease',
        cursor: 'pointer'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.boxShadow = `0 8px 25px ${colors.background}`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
      }}
    >
      <Card.Body className="text-center p-4">
        <div 
          className="mb-3 d-flex align-items-center justify-content-center rounded-circle mx-auto"
          style={{ 
            color: colors.border,
            width: '80px',
            height: '80px',
            backgroundColor: colors.background,
            border: `2px solid ${colors.border}`
          }}
        >
          {getIcon(subject.iconType)}
        </div>
        
        <Card.Title className="h5 mb-2" style={{ color: 'var(--mh-black)' }}>
          {subject.name}
        </Card.Title>
        
        <Badge 
          className="mb-3 px-3 py-2"
          style={{
            backgroundColor: colors.badge,
            color: colors.text,
            fontSize: '0.75rem',
            border: 'none'
          }}
        >
          {subject.category}
        </Badge>
        
        <Card.Text className="text-muted small mb-3" style={{ lineHeight: '1.4' }}>
          {subject.description}
        </Card.Text>
        
        <div className="d-flex justify-content-between text-muted small">
          <span className="d-flex align-items-center">
            <div 
              className="rounded-circle me-1"
              style={{
                width: '8px',
                height: '8px',
                backgroundColor: 'var(--mh-sky-blue)'
              }}
            ></div>
            <strong style={{ color: colors.border }}>{subject.totalTopics || 0}</strong> Topics
          </span>
          <span className="d-flex align-items-center">
            <div 
              className="rounded-circle me-1"
              style={{
                width: '8px',
                height: '8px',
                backgroundColor: 'var(--mh-gold)'
              }}
            ></div>
            <strong style={{ color: colors.border }}>{subject.totalActivities || 0}</strong> Activities
          </span>
        </div>
      </Card.Body>
    </Card>
  );
};

export default SubjectCard;