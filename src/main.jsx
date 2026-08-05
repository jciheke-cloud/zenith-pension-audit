import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import './index.css';
import './App.css';
import App from './App.jsx';
import { AuditProvider } from './context/AuditContext';
import LicenseGuard from './components/LicenseGuard';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient();

// Institutional DevTools Security Notice
if (typeof window !== 'undefined') {
  console.log(
    '%c==============================================================================\n' +
    '© 2026 RiskINTEGRA™ - ZENITH PENSION CUSTODIAN LIMITED\n' +
    'CONFIDENTIAL & PROPRIETARY INSTITUTIONAL AUDIT SOFTWARE\n' +
    '------------------------------------------------------------------------------\n' +
    'WARNING: This software and its underlying continuous auditing models,\n' +
    'risk-based scoring algorithms, and PENCOM statutory compliance ledgers are\n' +
    'protected under the Nigerian Copyright Act and trade secret conventions.\n' +
    'Any unauthorized inspection, reverse-engineering, or redistribution is strictly monitored.\n' +
    '==============================================================================',
    'color: #C81E1E; font-weight: bold; font-family: monospace; font-size: 11px;'
  );
  console.log(
    '%c🛑 STOP! SECURITY INSTRUCTION FOR INSTITUTIONAL USERS:\n' +
    'If someone instructed you to copy and paste scripts or commands into this browser console, DO NOT PROCEED. ' +
    'Pasting code here can compromise your institutional credentials and expose confidential PENCOM audit ledgers.',
    'color: #EF4444; font-weight: bold; font-size: 13px; background: #0f172a; padding: 8px; border-radius: 4px; border: 1px solid #ef4444;'
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <HashRouter>
        <LicenseGuard>
          <AuditProvider>
            <App />
          </AuditProvider>
        </LicenseGuard>
      </HashRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>
);

