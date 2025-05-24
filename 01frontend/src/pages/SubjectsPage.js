// src/pages/SubjectsPage.js

import React from 'react';
import { Container } from 'react-bootstrap';
import SubjectGrid from '../components/subjects/SubjectGrid';

const SubjectsPage = () => {
  return (
    <Container className="py-4">
      <SubjectGrid />
    </Container>
  );
};

export default SubjectsPage;