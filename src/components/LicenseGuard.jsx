import React, { useState, useEffect } from 'react';

const AUTHORIZED_DOMAINS = [
  'localhost',
  '127.0.0.1',
  'zpc-audit.netlify.app',
  'zpc-audit-demo.netlify.app',
  'audit.zenithcustodian.com',
  'zpc-audit.com',
  'zenithcustodian.com'
];

const VALID_LICENSE_KEYS = [
  'RISKINTEGRA-ZPC-2026-ENTERPRISE-PROD',
  'RISKINTEGRA-AUDIT-EXPRESS-2026',
  'ZPC-PENCOM-SECTION63-VALIDATED'
];

const LicenseGuard = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState(true);
  const [licenseInput, setLicenseInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    // 1. Inject Console Legal Watermark for Internal Audit Engine
    const legalNotice = `
==============================================================================
© 2026 RiskINTEGRA Internal Audit™ - ZENITH PENSION CUSTODIAN LIMITED
CONFIDENTIAL & PROPRIETARY INSTITUTIONAL SOFTWARE
------------------------------------------------------------------------------
WARNING: This software and its underlying continuous auditing models, risk-based
scoring algorithms, and PENCOM/CBN compliance ledgers are protected under the
Nigerian Copyright Act and international trade secret conventions.
Any unauthorized inspection, reverse-engineering, or redistribution is strictly monitored.
==============================================================================
    `;
    console.log(`%c${legalNotice}`, 'color: #C81E1E; font-weight: bold; font-size: 11px; background: #0f172a; padding: 6px;');

    // 2. Domain & License Key Verification
    const currentHost = window.location.hostname;
    const storedKey = localStorage.getItem('RISKINTEGRA_AUDIT_LICENSE_KEY') || localStorage.getItem('RISKINTEGRA_LICENSE_KEY');

    const domainValid = AUTHORIZED_DOMAINS.some(domain => 
      currentHost === domain || currentHost.endsWith(`.${domain}`) || currentHost.includes('netlify.app')
    );

    const licenseValid = storedKey && VALID_LICENSE_KEYS.includes(storedKey);

    if (!domainValid && !licenseValid) {
      setIsAuthorized(false);
    } else {
      setIsAuthorized(true);
    }
  }, []);

  const handleActivateLicense = (e) => {
    e.preventDefault();
    if (VALID_LICENSE_KEYS.includes(licenseInput.trim())) {
      localStorage.setItem('RISKINTEGRA_AUDIT_LICENSE_KEY', licenseInput.trim());
      localStorage.setItem('RISKINTEGRA_LICENSE_KEY', licenseInput.trim());
      setIsAuthorized(true);
      setErrorMsg('');
    } else {
      setErrorMsg('Invalid Cryptographic License Key. Please contact RiskINTEGRA™ Licensing Operations.');
    }
  };

  if (!isAuthorized) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'radial-gradient(circle at center, #1e1b4b 0%, #090d16 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        color: 'white',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        <div style={{
          background: 'rgba(15, 23, 42, 0.95)',
          border: '2px solid #C81E1E',
          borderRadius: '1.2rem',
          padding: '2.5rem',
          maxWidth: '560px',
          boxShadow: '0 25px 50px -12px rgba(200, 30, 30, 0.4)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛡️</div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fda4af', marginBottom: '0.75rem' }}>
            Intellectual Property & Domain Protection Triggered
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#CBD5E1', lineHeight: '1.6', marginBottom: '1.5rem' }}>
            This deployment of <strong>RiskINTEGRA Internal Audit™</strong> is running on an unauthorized domain (`{window.location.hostname}`). To protect institutional intellectual property under Nigerian Trade Secrets Law and Section 63 PRA 2014, execution has been suspended.
          </p>

          <form onSubmit={handleActivateLicense} style={{ textAlign: 'left', background: 'rgba(0,0,0,0.3)', padding: '1.25rem', borderRadius: '0.6rem', border: '1px solid rgba(255,255,255,0.08)' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94A3B8', marginBottom: '0.5rem' }}>
              ENTER INSTITUTIONAL LICENSE KEY (OR ENTERPRISE OVERRIDE):
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input 
                type="text" 
                value={licenseInput}
                onChange={(e) => setLicenseInput(e.target.value)}
                placeholder="e.g. RISKINTEGRA-ZPC-2026-ENTERPRISE-PROD"
                style={{
                  flex: 1,
                  padding: '0.6rem 0.8rem',
                  background: '#090d16',
                  border: '1px solid #334155',
                  borderRadius: '4px',
                  color: 'white',
                  fontSize: '0.85rem'
                }}
              />
              <button 
                type="submit"
                style={{
                  background: 'linear-gradient(135deg, #C81E1E, #991B1B)',
                  color: 'white',
                  border: 'none',
                  padding: '0.6rem 1.25rem',
                  borderRadius: '4px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontSize: '0.85rem'
                }}
              >
                Activate →
              </button>
            </div>
            {errorMsg && (
              <div style={{ color: '#fda4af', fontSize: '0.8rem', marginTop: '0.6rem', fontWeight: 500 }}>
                ⚠️ {errorMsg}
              </div>
            )}
            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.75rem' }}>
              💡 Authorized Demo Key: <code>RISKINTEGRA-ZPC-2026-ENTERPRISE-PROD</code>
            </div>
          </form>

          <div style={{ marginTop: '1.5rem', fontSize: '0.72rem', color: '#64748b', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem' }}>
            © 2026 RiskINTEGRA Internal Audit™ - Zenith Pension Custodian Limited. All rights reserved under Nigerian Copyright Act.
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default LicenseGuard;
