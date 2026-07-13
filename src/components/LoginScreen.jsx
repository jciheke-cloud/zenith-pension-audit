import React, { useState, useContext } from 'react';
import { AuditContext } from '../context/AuditContext';

const LoginScreen = () => {
  const { loginWithMockAccount, mockUsersList, clientProfile } = useContext(AuditContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      const cleanEmail = email.trim().toLowerCase();
      // Match role ID or email prefix (e.g. 'cae', 'manager', 'cae@zpc.com')
      const foundUser = mockUsersList.find(u => {
        const prefix = u.roleId.toLowerCase();
        return cleanEmail === prefix || cleanEmail === `${prefix}@zpc.com` || cleanEmail === u.email.toLowerCase();
      });

      if (foundUser) {
        loginWithMockAccount(foundUser);
      } else {
        // Fallback or default if they type something else valid like admin@zpc.com
        if (cleanEmail === 'admin@zpc.com' || cleanEmail === 'admin') {
          loginWithMockAccount(mockUsersList[0]);
        } else {
          setError('Invalid username/email or password. Check the demo roles below.');
          setIsLoading(false);
        }
      }
    }, 450);
  };

  const handleSelectDemo = (roleId, pass) => {
    setEmail(`${roleId}@zpc.com`);
    setPassword(pass);
  };

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

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', textAlign: 'left' }}>
          <div>
            <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.4rem', fontWeight: '500' }}>
              Corporate Email / RBAC Role
            </label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g., cae@zpc.com"
              required
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

        {/* Tiny font demo account details exactly like ERM app */}
        <div style={{ marginTop: '1.8rem', paddingTop: '1.2rem', borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: '0.72rem', color: 'var(--text-muted)', textAlign: 'left' }}>
          <p style={{ margin: '0 0 0.6rem 0', fontWeight: '700', color: '#CBD5E1' }}>
            <strong>Demo RBAC Accounts (Click to fill):</strong>
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.55rem', lineHeight: '1.3' }}>
            <div 
              onClick={() => handleSelectDemo('cae', 'cae')}
              style={{ cursor: 'pointer', padding: '0.3rem', borderRadius: '4px', background: 'rgba(255,255,255,0.02)' }}
              title="Click to autofill CAE credentials"
            >
              <strong style={{ color: '#fda4af' }}>CAE (Chief Audit Exec)</strong><br/>
              <code>cae@zpc.com</code><br/>Pass: <code>cae</code>
            </div>

            <div 
              onClick={() => handleSelectDemo('manager', 'manager')}
              style={{ cursor: 'pointer', padding: '0.3rem', borderRadius: '4px', background: 'rgba(255,255,255,0.02)' }}
              title="Click to autofill Audit Manager credentials"
            >
              <strong style={{ color: '#60A5FA' }}>Audit Manager</strong><br/>
              <code>manager@zpc.com</code><br/>Pass: <code>manager</code>
            </div>

            <div 
              onClick={() => handleSelectDemo('senior', 'senior')}
              style={{ cursor: 'pointer', padding: '0.3rem', borderRadius: '4px', background: 'rgba(255,255,255,0.02)' }}
              title="Click to autofill Senior Auditor credentials"
            >
              <strong style={{ color: '#34d399' }}>Senior Auditor</strong><br/>
              <code>senior@zpc.com</code><br/>Pass: <code>senior</code>
            </div>

            <div 
              onClick={() => handleSelectDemo('qa', 'qa')}
              style={{ cursor: 'pointer', padding: '0.3rem', borderRadius: '4px', background: 'rgba(255,255,255,0.02)' }}
              title="Click to autofill QA Reviewer credentials"
            >
              <strong style={{ color: '#FBBF24' }}>QA Reviewer</strong><br/>
              <code>qa@zpc.com</code><br/>Pass: <code>qa</code>
            </div>

            <div 
              onClick={() => handleSelectDemo('owner', 'owner')}
              style={{ cursor: 'pointer', padding: '0.3rem', borderRadius: '4px', background: 'rgba(255,255,255,0.02)' }}
              title="Click to autofill Process Owner credentials"
            >
              <strong style={{ color: '#A855F7' }}>Process Owner / Head</strong><br/>
              <code>owner@zpc.com</code><br/>Pass: <code>owner</code>
            </div>

            <div 
              onClick={() => handleSelectDemo('committee', 'committee')}
              style={{ cursor: 'pointer', padding: '0.3rem', borderRadius: '4px', background: 'rgba(255,255,255,0.02)' }}
              title="Click to autofill Board Audit Committee credentials"
            >
              <strong style={{ color: '#FB7185' }}>Board Committee</strong><br/>
              <code>committee@zpc.com</code><br/>Pass: <code>committee</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
