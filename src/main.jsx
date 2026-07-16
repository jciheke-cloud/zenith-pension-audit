import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import './index.css';
import './App.css';
import App from './App.jsx';
import { AuditProvider } from './context/AuditContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <AuditProvider>
        <App />
      </AuditProvider>
    </HashRouter>
  </StrictMode>
);
