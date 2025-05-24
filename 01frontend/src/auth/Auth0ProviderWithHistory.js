import React from 'react';
import { Auth0Provider } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';

const Auth0ProviderWithHistory = ({ children }) => {
  const navigate = useNavigate();
  
  const domain = process.env.REACT_APP_AUTH0_DOMAIN;
  const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;
  const audience = process.env.REACT_APP_AUTH0_AUDIENCE;

  const onRedirectCallback = (appState) => {
    navigate(appState?.returnTo || window.location.pathname);
  };

  if (!(domain && clientId)) {
    return (
      <div className="alert alert-danger">
        <h4>Configuration Error</h4>
        <p>Auth0 configuration is missing. Please check your environment variables:</p>
        <ul>
          <li>REACT_APP_AUTH0_DOMAIN</li>
          <li>REACT_APP_AUTH0_CLIENT_ID</li>
          <li>REACT_APP_AUTH0_AUDIENCE (optional)</li>
        </ul>
      </div>
    );
  }

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: audience,
        scope: "openid profile email"
      }}
      onRedirectCallback={onRedirectCallback}
    >
      {children}
    </Auth0Provider>
  );
};

export default Auth0ProviderWithHistory;