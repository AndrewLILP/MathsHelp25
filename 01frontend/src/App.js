import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Auth0ProviderWithHistory from './auth/Auth0ProviderWithHistory';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import { useAuth0 } from '@auth0/auth0-react';

// Import Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function AppContent() {
  const { isLoading } = useAuth0();

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
      <Navigation />
      <Container className="mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/subjects" element={<div><h2>Subjects Coming Soon</h2></div>} />
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
          <AppContent />
        </div>
      </Auth0ProviderWithHistory>
    </Router>
  );
}

export default App;