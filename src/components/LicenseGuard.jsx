import React, { useState, useEffect } from 'react';

const LicenseGuard = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState(true);
  const [checking, setChecking] = useState(true);
  const [licenseFile, setLicenseFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  let API_BASE_URL = import.meta.env.VITE_API_URL || 'https://uhzosq0g0i.execute-api.eu-west-1.amazonaws.com/prod/api';
  if (API_BASE_URL.endsWith('/')) API_BASE_URL = API_BASE_URL.slice(0, -1);
  if (!API_BASE_URL.endsWith('/api')) API_BASE_URL = `${API_BASE_URL}/api`;

  useEffect(() => {
    const checkLicense = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/license/status`);
        if (response.ok) {
          setIsAuthorized(true);
        } else {
          setIsAuthorized(false);
        }
      } catch (err) {
        // If API fails or is unreachable, default to unauthorized to enforce security
        console.error("License check failed:", err);
        setIsAuthorized(false);
      } finally {
        setChecking(false);
      }
    };
    checkLicense();
  }, [API_BASE_URL]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setLicenseFile(e.target.files[0]);
    }
  };

  const handleUploadLicense = async (e) => {
    e.preventDefault();
    if (!licenseFile) {
      setErrorMsg('Please select a riskintegra.lic file to upload.');
      return;
    }

    setUploading(true);
    setErrorMsg('');

    try {
      const text = await licenseFile.text();
      let parsedLicense;
      try {
        parsedLicense = JSON.parse(text);
      } catch (e) {
        throw new Error("Invalid license file format (not JSON).");
      }

      const response = await fetch(`${API_BASE_URL}/license/upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(parsedLicense)
      });

      if (response.ok) {
        setIsAuthorized(true);
        window.location.reload(); // Reload to refresh contexts
      } else {
        const data = await response.json();
        setErrorMsg(data.error || 'Cryptographic validation failed. License tampered or expired.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to upload and validate license.');
    } finally {
      setUploading(false);
    }
  };

  if (checking) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a', color: 'white' }}>
        Verifying Cryptographic License Integrity...
      </div>
    );
  }

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
            System Locked - License Required
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#CBD5E1', lineHeight: '1.6', marginBottom: '1.5rem' }}>
            <strong>RiskINTEGRA Internal Audit™</strong> requires a cryptographically signed license to operate. Your license is currently missing, invalid, or expired.
          </p>

          <form onSubmit={handleUploadLicense} style={{ textAlign: 'left', background: 'rgba(0,0,0,0.3)', padding: '1.25rem', borderRadius: '0.6rem', border: '1px solid rgba(255,255,255,0.08)' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94A3B8', marginBottom: '0.5rem' }}>
              UPLOAD riskintegra.lic FILE:
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input 
                type="file" 
                accept=".lic,.json"
                onChange={handleFileChange}
                style={{
                  padding: '0.6rem',
                  background: '#090d16',
                  border: '1px solid #334155',
                  borderRadius: '4px',
                  color: 'white',
                  fontSize: '0.85rem'
                }}
              />
              <button 
                type="submit"
                disabled={uploading}
                style={{
                  background: uploading ? '#475569' : 'linear-gradient(135deg, #C81E1E, #991B1B)',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem',
                  borderRadius: '4px',
                  fontWeight: 700,
                  cursor: uploading ? 'not-allowed' : 'pointer',
                  fontSize: '0.9rem',
                  textAlign: 'center'
                }}
              >
                {uploading ? 'Validating Signature...' : 'Activate System'}
              </button>
            </div>
            {errorMsg && (
              <div style={{ color: '#fda4af', fontSize: '0.85rem', marginTop: '1rem', fontWeight: 500, padding: '0.5rem', background: 'rgba(200, 30, 30, 0.1)', borderRadius: '4px', border: '1px solid rgba(200, 30, 30, 0.3)' }}>
                ⚠️ {errorMsg}
              </div>
            )}
          </form>

          <div style={{ marginTop: '1.5rem', fontSize: '0.72rem', color: '#64748b', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem' }}>
            © 2026 RiskINTEGRA Internal Audit™. All rights reserved under Nigerian Copyright Act.
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default LicenseGuard;
