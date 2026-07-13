import React, { useContext, useState } from 'react';
import { AuditContext } from '../context/AuditContext';
import { Shield, Lock, UserCheck, KeyRound, CheckCircle, ArrowRight, Building2, User } from 'lucide-react';

const LoginScreen = () => {
  const { mockUsersList, loginWithMockAccount, clientProfile } = useContext(AuditContext);
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeTab, setActiveTab] = useState('mock-grid'); // 'mock-grid' or 'manual'
  const [emailInput, setEmailInput] = useState('cae@zenithcustodian.com');
  const [passwordInput, setPasswordInput] = useState('zenith2026');
  const [errorMessage, setErrorMessage] = useState('');

  const handleQuickLogin = (user) => {
    loginWithMockAccount(user);
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    const foundUser = mockUsersList.find(
      u => u.email.toLowerCase() === emailInput.trim().toLowerCase() || u.roleId === emailInput.trim().toLowerCase()
    );
    if (foundUser) {
      if (passwordInput === 'zenith2026' || passwordInput.length > 3) {
        loginWithMockAccount(foundUser);
      } else {
        setErrorMessage('Invalid executive PIN or password. Default test password is "zenith2026".');
      }
    } else {
      setErrorMessage(`No mock account found for "${emailInput}". Please select an executive from the Mock Grid.`);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      background: 'radial-gradient(circle at 50% 15%, rgba(200, 30, 30, 0.15) 0%, rgba(10, 15, 26, 0.96) 55%, #050811 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      position: 'relative',
      overflow: 'hidden',
      color: '#E2E8F0'
    }}>
      {/* Background architectural glow & subtle grid */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
        backgroundSize: '32px 32px',
        pointerEvents: 'none',
        zIndex: 1
      }} />

      <div style={{
        position: 'relative',
        zIndex: 10,
        maxWidth: '1120px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        {/* Institutional Branding Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.2rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.65rem',
            background: 'rgba(200, 30, 30, 0.12)',
            border: '1px solid rgba(200, 30, 30, 0.45)',
            padding: '0.4rem 1.2rem',
            borderRadius: '9999px',
            marginBottom: '1rem',
            boxShadow: '0 0 20px rgba(200, 30, 30, 0.25)'
          }}>
            <Shield size={16} color="#fda4af" />
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#ffe4e6', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              RiskINTEGRA Internal Audit Suite™ | Regulatory Gateway
            </span>
          </div>

          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 900,
            letterSpacing: '-1px',
            margin: '0.3rem 0',
            background: 'linear-gradient(90deg, #ffffff 0%, #ffe4e6 50%, #fda4af 80%, #C81E1E 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.7rem'
          }}>
            {clientProfile}
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '1rem', maxWidth: '640px', margin: '0.5rem auto 0', lineHeight: 1.6 }}>
            Digitized Risk-Based Internal Audit Ecosystem governed by IIA Global Standards & PENCOM Custodial Mandate. Select an executive role below to authenticate.
          </p>
        </div>

        {/* Tab Selector */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          background: 'rgba(15, 23, 42, 0.8)',
          padding: '0.35rem',
          borderRadius: '0.75rem',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          marginBottom: '2rem',
          backdropFilter: 'blur(10px)'
        }}>
          <button
            onClick={() => setActiveTab('mock-grid')}
            style={{
              padding: '0.6rem 1.5rem',
              borderRadius: '0.5rem',
              background: activeTab === 'mock-grid' ? 'linear-gradient(135deg, #C81E1E 0%, #9f1239 100%)' : 'transparent',
              color: activeTab === 'mock-grid' ? 'white' : '#94A3B8',
              fontWeight: 800,
              fontSize: '0.85rem',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: activeTab === 'mock-grid' ? '0 4px 12px rgba(200, 30, 30, 0.4)' : 'none',
              transition: 'all 0.2s'
            }}
          >
            <UserCheck size={16} />
            <span>Select Mock Executive Role (Instant Login)</span>
          </button>
          <button
            onClick={() => setActiveTab('manual')}
            style={{
              padding: '0.6rem 1.5rem',
              borderRadius: '0.5rem',
              background: activeTab === 'manual' ? 'linear-gradient(135deg, #C81E1E 0%, #9f1239 100%)' : 'transparent',
              color: activeTab === 'manual' ? 'white' : '#94A3B8',
              fontWeight: 800,
              fontSize: '0.85rem',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: activeTab === 'manual' ? '0 4px 12px rgba(200, 30, 30, 0.4)' : 'none',
              transition: 'all 0.2s'
            }}
          >
            <KeyRound size={16} />
            <span>Manual Credentials Login</span>
          </button>
        </div>

        {/* Tab 1: Mock Accounts Grid */}
        {activeTab === 'mock-grid' && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(330px, 1fr))',
            gap: '1.25rem',
            width: '100%',
            marginBottom: '2rem'
          }}>
            {mockUsersList.map((user) => (
              <div
                key={user.id}
                onClick={() => handleQuickLogin(user)}
                style={{
                  background: 'rgba(15, 23, 42, 0.75)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '1rem',
                  padding: '1.4rem',
                  cursor: 'pointer',
                  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative',
                  overflow: 'hidden',
                  backdropFilter: 'blur(12px)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.borderColor = 'rgba(200, 30, 30, 0.6)';
                  e.currentTarget.style.boxShadow = '0 12px 28px rgba(200, 30, 30, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* Top User Info */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      <div style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #C81E1E 0%, #881337 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.15rem',
                        fontWeight: 900,
                        color: 'white',
                        boxShadow: '0 4px 12px rgba(200, 30, 30, 0.4)',
                        border: '1px solid rgba(255, 255, 255, 0.2)'
                      }}>
                        {user.avatar}
                      </div>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#F8FAFC' }}>
                          {user.name}
                        </h3>
                        <span style={{ fontSize: '0.78rem', color: '#94A3B8', fontFamily: 'monospace' }}>
                          {user.email}
                        </span>
                      </div>
                    </div>
                    <span style={{
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      padding: '0.2rem 0.6rem',
                      borderRadius: '9999px',
                      background: 'rgba(16, 185, 129, 0.15)',
                      color: '#34d399',
                      border: '1px solid rgba(16, 185, 129, 0.35)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34d399' }} />
                      Online
                    </span>
                  </div>

                  <div style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    borderRadius: '0.65rem',
                    padding: '0.75rem',
                    marginBottom: '1.1rem'
                  }}>
                    <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Active Role Title:
                    </div>
                    <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#fda4af', marginTop: '2px' }}>
                      {user.title}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#CBD5E1', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Building2 size={13} color="#94A3B8" />
                      <span>{user.department}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Action */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '0.75rem',
                  borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                  color: '#fda4af',
                  fontWeight: 800,
                  fontSize: '0.82rem'
                }}>
                  <span>Quick Authenticate as {user.roleId.toUpperCase()}</span>
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: 'rgba(200, 30, 30, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <ArrowRight size={15} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Manual Login Form */}
        {activeTab === 'manual' && (
          <div style={{
            background: 'rgba(15, 23, 42, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '1.25rem',
            padding: '2.5rem',
            maxWidth: '480px',
            width: '100%',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(16px)',
            marginBottom: '2rem'
          }}>
            <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.4rem', fontWeight: 800, color: 'white', textAlign: 'center' }}>
              Executive Access Verification
            </h3>
            <p style={{ color: '#94A3B8', fontSize: '0.85rem', textAlign: 'center', marginBottom: '1.8rem' }}>
              Enter your ZPC institutional email or role ID (`cae`, `manager`, `senior`, `qa`, `owner`, `erm`, `committee`).
            </p>

            {errorMessage && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                color: '#f87171',
                padding: '0.75rem 1rem',
                borderRadius: '0.5rem',
                fontSize: '0.82rem',
                marginBottom: '1.2rem',
                fontWeight: 600
              }}>
                ⚠️ {errorMessage}
              </div>
            )}

            <form onSubmit={handleManualSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#CBD5E1', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                  Institutional Email or Role ID
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    value={emailInput}
                    onChange={e => setEmailInput(e.target.value)}
                    placeholder="e.g., cae@zenithcustodian.com"
                    style={{
                      width: '100%',
                      background: '#090D16',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '0.5rem',
                      padding: '0.75rem 0.75rem 0.75rem 2.4rem',
                      color: 'white',
                      fontSize: '0.92rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#CBD5E1', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                  Secure PIN / Password (Default: zenith2026)
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="password"
                    value={passwordInput}
                    onChange={e => setPasswordInput(e.target.value)}
                    placeholder="••••••••••"
                    style={{
                      width: '100%',
                      background: '#090D16',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '0.5rem',
                      padding: '0.75rem 0.75rem 0.75rem 2.4rem',
                      color: 'white',
                      fontSize: '0.92rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              <button
                type="submit"
                style={{
                  background: 'linear-gradient(135deg, #C81E1E 0%, #881337 100%)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '0.5rem',
                  padding: '0.85rem',
                  color: 'white',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  boxShadow: '0 6px 20px rgba(200, 30, 30, 0.4)',
                  transition: 'all 0.2s',
                  marginTop: '0.5rem'
                }}
              >
                Authenticate Executive Account ➔
              </button>
            </form>
          </div>
        )}

        {/* Footer Security Note */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1.5rem',
          fontSize: '0.78rem',
          color: '#64748B',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          paddingTop: '1.5rem',
          width: '100%',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <CheckCircle size={14} color="#34d399" />
            <span>256-Bit SSL Encrypted Vault</span>
          </span>
          <span>•</span>
          <span>PENCOM PFC Mandate & IIA Global Standards Compliant</span>
          <span>•</span>
          <span>Active Session Timeout: 60 Minutes</span>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
