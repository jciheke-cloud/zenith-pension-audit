import React, { useState, useContext, useEffect } from 'react';
import { AuditContext } from '../context/AuditContext';
import { ForceChangePassword } from './ForceChangePassword';

const LoginScreen = () => {
  const { login, clientProfile, addToast, triggerPasswordReset, completePasswordReset } = useContext(AuditContext);
  
  // Login Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [challengeEmail, setChallengeEmail] = useState(null);

  // Forgot Password Wizard States
  const [isResetMode, setIsResetMode] = useState(false);
  const [resetStep, setResetStep] = useState(1); // 1 = request code, 2 = submit code & new pass
  const [resetEmail, setResetEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newResetPassword, setNewResetPassword] = useState('');
  const [confirmNewResetPassword, setConfirmNewResetPassword] = useState('');
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');

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

  const handleRequestCode = async (e) => {
    e.preventDefault();
    setResetError('');
    setIsLoading(true);
    const res = await triggerPasswordReset(resetEmail);
    if (res.success) {
      setResetStep(2);
      setResetSuccess(`Verification code sent successfully to ${resetEmail}.`);
    } else {
      setResetError(res.error);
    }
    setIsLoading(false);
  };

  const handleConfirmReset = async (e) => {
    e.preventDefault();
    setResetError('');
    if (newResetPassword !== confirmNewResetPassword) {
      setResetError("Passwords do not match.");
      return;
    }
    if (newResetPassword.length < 8) {
      setResetError("New password must be at least 8 characters long.");
      return;
    }

    setIsLoading(true);
    const res = await completePasswordReset(resetEmail, resetCode, newResetPassword);
    if (res.success) {
      if (addToast) {
        addToast('🔐 Password updated successfully! You can now log in.', 'success');
      }
      setIsResetMode(false);
      setResetStep(1);
      setPassword('');
      setResetError('');
      setResetSuccess('');
    } else {
      setResetError(res.error);
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

        {/* FORGOT PASSWORD FLOW */}
        {isResetMode ? (
          <div>
            <h3 style={{ color: 'white', fontSize: '1.1rem', fontWeight: 700, margin: '0 0 1rem 0' }}>
              🔑 Reset Account Password
            </h3>

            {resetError && (
              <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', padding: '0.75rem', borderRadius: '6px', marginBottom: '1.5rem', fontSize: '0.82rem', textAlign: 'left' }}>
                {resetError}
              </div>
            )}
            {resetSuccess && (
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#34d399', padding: '0.75rem', borderRadius: '6px', marginBottom: '1.5rem', fontSize: '0.82rem', textAlign: 'left' }}>
                {resetSuccess}
              </div>
            )}

            {resetStep === 1 ? (
              <form onSubmit={handleRequestCode} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', textAlign: 'left' }}>
                <div>
                  <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.4rem', fontWeight: '500' }}>Corporate Email / username</label>
                  <input 
                    type="email" 
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="Enter your registered email"
                    required
                    style={{ width: '100%', padding: '0.75rem 1rem', background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '6px', color: 'white', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
                <button type="submit" disabled={isLoading} className="btn-primary" style={{ width: '100%', padding: '0.85rem', fontWeight: '600', background: 'linear-gradient(135deg, #C81E1E 0%, #991B1B 100%)', border: 'none', borderRadius: '6px', cursor: isLoading ? 'not-allowed' : 'pointer' }}>
                  {isLoading ? 'Sending code...' : 'Request Verification Code'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleConfirmReset} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', textAlign: 'left' }}>
                <div>
                  <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.4rem', fontWeight: '500' }}>Verification Code</label>
                  <input 
                    type="text" 
                    value={resetCode}
                    onChange={(e) => setResetCode(e.target.value)}
                    placeholder="Enter 6-digit code"
                    required
                    style={{ width: '100%', padding: '0.75rem 1rem', background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '6px', color: 'white', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.4rem', fontWeight: '500' }}>New Password</label>
                  <div style={{ position: 'relative' }}>
                    <input 
                      type={showResetPassword ? "text" : "password"} 
                      value={newResetPassword}
                      onChange={(e) => setNewResetPassword(e.target.value)}
                      placeholder="Minimum 8 characters"
                      required
                      style={{ width: '100%', padding: '0.75rem 2.2rem 0.75rem 1rem', background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '6px', color: 'white', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                    />
                    <button type="button" onClick={() => setShowResetPassword(!showResetPassword)} style={{ position: 'absolute', right: '0.8rem', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}>
                      {showResetPassword ? '👁' : '👁️‍🗨️'}
                    </button>
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.4rem', fontWeight: '500' }}>Confirm New Password</label>
                  <input 
                    type="password" 
                    value={confirmNewResetPassword}
                    onChange={(e) => setConfirmNewResetPassword(e.target.value)}
                    placeholder="Confirm password"
                    required
                    style={{ width: '100%', padding: '0.75rem 1rem', background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '6px', color: 'white', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
                <button type="submit" disabled={isLoading} className="btn-primary" style={{ width: '100%', padding: '0.85rem', fontWeight: '600', background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', border: 'none', borderRadius: '6px', cursor: isLoading ? 'not-allowed' : 'pointer' }}>
                  {isLoading ? 'Updating password...' : 'Complete Reset & Login'}
                </button>
              </form>
            )}

            <button type="button" onClick={() => { setIsResetMode(false); setResetError(''); setResetSuccess(''); }} style={{ background: 'transparent', border: 'none', color: '#60A5FA', fontSize: '0.8rem', cursor: 'pointer', marginTop: '1.2rem', textDecoration: 'underline' }}>
              Back to Secure Login
            </button>
          </div>
        ) : (
          /* STANDARD LOGIN FLOW */
          <div>
            {error && (
              <div style={{ background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.35)', color: '#f87171', padding: '0.75rem', borderRadius: '6px', marginBottom: '1.5rem', fontSize: '0.85rem', textAlign: 'left' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} autoComplete="off" style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', textAlign: 'left' }}>
              <div>
                <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.4rem', fontWeight: '500' }}>Corporate Email / RBAC Role</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter corporate email"
                  required
                  autoComplete="off"
                  style={{ width: '100%', padding: '0.75rem 1rem', background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '6px', color: 'white', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <label style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: '500' }}>Password</label>
                  <button type="button" onClick={() => { setIsResetMode(true); setResetEmail(email); }} style={{ background: 'transparent', border: 'none', color: '#60A5FA', fontSize: '0.78rem', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}>
                    Forgot Password?
                  </button>
                </div>
                <div style={{ position: 'relative' }}>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    autoComplete="new-password"
                    style={{ width: '100%', padding: '0.75rem 2.2rem 0.75rem 1rem', background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '6px', color: 'white', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '0.8rem', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}>
                    {showPassword ? '👁' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>
              
              <button 
                type="submit" 
                disabled={isLoading}
                className="btn-primary"
                style={{ width: '100%', padding: '0.85rem', marginTop: '0.5rem', fontSize: '0.95rem', fontWeight: '600', background: 'linear-gradient(135deg, #C81E1E 0%, #991B1B 100%)', border: 'none', borderRadius: '6px', cursor: isLoading ? 'not-allowed' : 'pointer', opacity: isLoading ? 0.7 : 1, boxShadow: '0 4px 15px rgba(200, 30, 30, 0.4)' }}
              >
                {isLoading ? 'Authenticating...' : 'Secure Login'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginScreen;
