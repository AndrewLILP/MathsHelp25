// File: 01frontend/src/App.js - UPDATED WITH AUTH TOKEN SETUP
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { useAuth0 } from '@auth0/auth0-react';
import Auth0ProviderWithHistory from './auth/Auth0ProviderWithHistory';
import AuthWrapper from './components/AuthWrapper';
import RoleBasedNavigation from './components/RoleBasedNavigation';
import Home from './pages/Home';
import SubjectsPage from './pages/SubjectsPage';
import SubjectDetailPage from './pages/SubjectDetailPage';
import TopicDetailPage from './pages/TopicDetailPage';
import ActivitiesPage from './pages/ActivitiesPage';
import CreateActivityPage from './pages/CreateActivityPage';
import { setAuth0TokenGetter } from './services/api';

// Import Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/colors.css';
import './App.css';

function AppContent() {
  const { isLoading, getAccessTokenSilently, isAuthenticated } = useAuth0();

  // Set up global Auth0 token getter for API calls
  useEffect(() => {
    if (isAuthenticated) {
      const tokenGetter = async () => {
        try {
          console.log('🔑 Getting Auth0 token globally...');
          const token = await getAccessTokenSilently({
            audience: process.env.REACT_APP_AUTH0_AUDIENCE,
            scope: 'openid profile email'
          });
          console.log('✅ Global Auth0 token obtained');
          return token;
        } catch (error) {
          console.error('❌ Failed to get global Auth0 token:', error);
          throw error;
        }
      };

      setAuth0TokenGetter(tokenGetter);
      console.log('🔧 Global Auth0 token getter configured');
    }
  }, [isAuthenticated, getAccessTokenSilently]);

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <RoleBasedNavigation />
      <Container className="mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/subjects" element={<SubjectsPage />} />
          <Route path="/subjects/:subjectId" element={<SubjectDetailPage />} />
          <Route path="/topics/:topicId" element={<TopicDetailPage />} />
          <Route path="/topics/:topicId/activities" element={<ActivitiesPage />} />
          <Route path="/create/activity" element={<CreateActivityPage />} />
          <Route path="/dashboard" element={<div><h2>Dashboard Coming Soon</h2></div>} />
          <Route path="/profile" element={<div><h2>Profile Coming Soon</h2></div>} />
        </Routes>
      </Container>
    </>
  );
}

function App() {
  return (
    <Router>
      <Auth0ProviderWithHistory>
        <div className="App">
          <AuthWrapper>
            <AppContent />
          </AuthWrapper>
        </div>
      </Auth0ProviderWithHistory>
    </Router>
  );
}

export default App;