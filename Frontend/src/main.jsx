import React from 'react';
import { createRoot } from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import App from './App';
import './index.css'; // Assuming you have a CSS file for global styles

const root = createRoot(document.getElementById('root'));


root.render(
<Auth0Provider
    domain="dev-5ksdh2n8szt212rv.us.auth0.com"
    clientId="tYLLotI1L7cYjz0urzvGd9l0LsRpFpaI"
    authorizationParams={{
      redirect_uri: window.location.origin
    }}
  >
    <App />
  </Auth0Provider>,
);