import React from 'react';
import { Container, Spinner } from 'react-bootstrap';
import { FaCalculator } from 'react-icons/fa';

const LoadingSpinner = () => {
  return (
    <Container 
      fluid 
      className="d-flex flex-column justify-content-center align-items-center"
      style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}
    >
      <div className="text-center">
        <FaCalculator size={48} className="text-primary mb-3" />
        <h4 className="text-primary mb-3">MathsHelp25</h4>
        <Spinner animation="border" role="status" className="text-primary">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="text-muted mt-2">Loading your mathematics resources...</p>
      </div>
    </Container>
  );
};

export default LoadingSpinner;