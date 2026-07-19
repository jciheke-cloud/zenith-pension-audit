import React, { useState, useContext, useEffect } from 'react';
import { AuditContext } from '../context/AuditContext';
import { ForceChangePassword } from './ForceChangePassword';

const LoginScreen = () => {
  const { login, clientProfile, addToast } = useContext(AuditContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [challengeEmail, setChallengeEmail] = useState(null);

  useEffect(() => {
    if (sessionStorage.getItem('zpc_inactivity_logged_out') === 'true') {
      if (addToast) {
        addToast('⚠️ Session timed out due to 30 minutes of inactivity.', 'warning');
      }
      sessionStorage.removeItem('zpc_inactivity_logged_out');
    }
  }, [addToast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await login(email, password);
    if (result.challenge === 'NEW_PASSWORD_REQUIRED') {
      setChallengeEmail(email);
      setIsLoading(false);
      return;
    }
    if (!result.success) {
      setError(result.error);
    }
    setIsLoading(false);
  };

  if (challengeEmail) {
    return <ForceChangePassword email={challengeEmail} onComplete={() => setChallengeEmail(null)} />;
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(circle at 50% 0%, #3f0d16 0%, #0a0f1d 100%)',
      fontFamily: "'Inter', sans-serif",
      padding: '1rem'
    }}>
      <div className="glass-card" style={{
        width: '100%',
        maxWidth: '430px',
        padding: '2.5rem',
        borderTop: '4px solid #C81E1E',
        boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
        textAlign: 'center',
        background: 'rgba(15, 23, 42, 0.85)',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ color: 'white', fontSize: '1.8rem', fontWeight: '800', margin: '0 0 0.5rem 0', letterSpacing: '-0.5px' }}>
            Risk<span style={{ color: '#C81E1E' }}>INTEGRA</span> Audit™
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0, fontWeight: 600 }}>
            {clientProfile || 'Zenith Pension Custodian Limited (ZPC)'}
          </p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.35)',
            color: '#f87171',
            padding: '0.75rem',
            borderRadius: '6px',
            marginBottom: '1.5rem',
            fontSize: '0.85rem',
            textAlign: 'left'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} autoComplete="off" style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', textAlign: 'left' }}>
          <div>
            <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.4rem', fontWeight: '500' }}>
              Corporate Email / RBAC Role
            </label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter corporate email"
              required
              autoComplete="off"
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                background: 'rgba(0,0,0,0.25)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '6px',
                color: 'white',
                fontSize: '0.9rem',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.4rem', fontWeight: '500' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="new-password"
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                background: 'rgba(0,0,0,0.25)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '6px',
                color: 'white',
                fontSize: '0.9rem',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary"
            style={{
              width: '100%',
              padding: '0.85rem',
              marginTop: '0.5rem',
              fontSize: '0.95rem',
              fontWeight: '600',
              background: 'linear-gradient(135deg, #C81E1E 0%, #991B1B 100%)',
              border: 'none',
              borderRadius: '6px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.7 : 1,
              boxShadow: '0 4px 15px rgba(200, 30, 30, 0.4)'
            }}
          >
            {isLoading ? 'Authenticating...' : 'Secure Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginScreen;
