import React, { useState, useContext } from 'react';
import { AuditContext } from '../context/AuditContext';

export const ForceChangePassword = ({ email, onComplete }) => {
  const { completeNewPassword } = useContext(AuditContext);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setLoading(true);
    setError('');
    
    const res = await completeNewPassword(newPassword);
    if (res?.success) {
      onComplete(res.user);
    } else {
      setError(res?.error || "Failed to set new password. Please verify requirements.");
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
      fontFamily: "'Inter', sans-serif"
    }}>
      <div style={{
        background: 'rgba(30, 41, 59, 0.7)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '2.5rem',
        borderRadius: '1rem',
        width: '100%',
        maxWidth: '440px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🔐</div>
          <h2 style={{ color: 'white', fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>
            Mandatory Password Change
          </h2>
          <p style={{ color: '#94A3B8', fontSize: '0.88rem', marginTop: '0.5rem' }}>
            Enterprise Identity Policy requires you to update your initial password for <strong>{email}</strong> before proceeding.
          </p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#F87171',
            padding: '0.75rem',
            borderRadius: '0.5rem',
            fontSize: '0.82rem',
            marginBottom: '1.5rem',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', color: '#CBD5E1', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.4rem' }}>
              New Permanent Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimum 8 characters..."
                style={{
                  width: '100%',
                  padding: '0.75rem 2.2rem 0.75rem 0.75rem',
                  borderRadius: '0.5rem',
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: 'white',
                  fontSize: '0.9rem',
                  boxSizing: 'border-box'
                }}
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)} 
                style={{ position: 'absolute', right: '0.8rem', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}
              >
                {showPassword ? '👁' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', color: '#CBD5E1', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.4rem' }}>
              Confirm Permanent Password
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password..."
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                background: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: 'white',
                fontSize: '0.9rem',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: '0.5rem',
              padding: '0.85rem',
              borderRadius: '0.5rem',
              border: 'none',
              background: loading ? '#475569' : 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              color: 'white',
              fontWeight: 700,
              fontSize: '0.95rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
            }}
          >
            {loading ? 'Securing Session & Upgrading Claims...' : 'Save & Enter Portal ➔'}
          </button>
        </form>
      </div>
    </div>
  );
};
