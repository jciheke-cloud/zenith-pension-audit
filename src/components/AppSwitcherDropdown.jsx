import React, { useState, useRef, useEffect, useContext } from 'react';
import { AuditContext } from '../context/AuditContext';
import { LayoutGrid, Shield, ClipboardCheck, Lock, Settings, Check, Globe } from 'lucide-react';

const AppSwitcherDropdown = () => {
  const { currentUser, currentRole } = useContext(AuditContext);
  const [isOpen, setIsOpen] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  
  // Dynamic Netlify/AWS URL state (checks localStorage first, then env variable, then default)
  const [ermUrl, setErmUrl] = useState(() => {
    return localStorage.getItem('ZPC_ERM_URL_OVERRIDE') || import.meta.env.VITE_ERM_APP_URL || 'http://localhost:5173';
  });
  const [inputUrl, setInputUrl] = useState(ermUrl);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const dropdownRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setShowConfig(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSaveUrl = (e) => {
    e.preventDefault();
    let clean = inputUrl.trim();
    if (clean.endsWith('/')) clean = clean.slice(0, -1);
    setErmUrl(clean);
    localStorage.setItem('ZPC_ERM_URL_OVERRIDE', clean);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleSwitchToErm = () => {
    const targetBase = ermUrl || 'http://localhost:5173';
    const roleId = currentUser?.roleId || currentRole?.id || 'cae';
    const target = `${targetBase}/?sso_role=${encodeURIComponent(roleId)}&sso_token=riskintegra_auth_bridge&source=audit`;
    window.location.href = target;
  };

  const isNetlify = window.location.hostname.includes('netlify.app') || ermUrl.includes('netlify.app');

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (isOpen) setShowConfig(false);
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.45rem',
          background: isOpen ? 'rgba(200, 30, 30, 0.25)' : 'rgba(255, 255, 255, 0.05)',
          border: isOpen ? '1px solid #C81E1E' : '1px solid rgba(255, 255, 255, 0.14)',
          color: isOpen ? '#fda4af' : '#E2E8F0',
          padding: '0.45rem 0.8rem',
          borderRadius: '0.5rem',
          cursor: 'pointer',
          fontWeight: 700,
          fontSize: '0.82rem',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: isOpen ? '0 0 12px rgba(200, 30, 30, 0.4)' : 'none'
        }}
        title="Switch RiskINTEGRA Corporate Governance Applications"
      >
        <LayoutGrid size={16} />
        <span>Apps</span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 10px)',
          right: 0,
          width: '380px',
          background: '#0B1120',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          borderRadius: '1rem',
          padding: '1.1rem',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.85)',
          zIndex: 9999,
          backdropFilter: 'blur(24px)'
        }}>
          {/* Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBottom: '0.75rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            marginBottom: '0.75rem'
          }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              RiskINTEGRA Ecosystem Suite™
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {isNetlify && (
                <span style={{
                  fontSize: '0.62rem',
                  background: 'rgba(59, 130, 246, 0.15)',
                  color: '#60A5FA',
                  padding: '0.12rem 0.45rem',
                  borderRadius: '9999px',
                  border: '1px solid rgba(59, 130, 246, 0.35)',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px'
                }}>
                  <Globe size={10} /> NETLIFY BRIDGE
                </span>
              )}
              <button
                onClick={() => setShowConfig(!showConfig)}
                style={{
                  background: showConfig ? 'rgba(200, 30, 30, 0.2)' : 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: showConfig ? '#fda4af' : '#CBD5E1',
                  padding: '0.2rem 0.45rem',
                  borderRadius: '0.35rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  fontSize: '0.68rem',
                  fontWeight: 700
                }}
                title="Configure Netlify / AWS Companion App URL"
              >
                <Settings size={12} />
                <span>{showConfig ? 'Close' : 'Set Link'}</span>
              </button>
            </div>
          </div>

          {/* Interactive Netlify / AWS URL Configuration Section */}
          {showConfig && (
            <form onSubmit={handleSaveUrl} style={{
              background: 'rgba(15, 23, 42, 0.9)',
              padding: '0.85rem',
              borderRadius: '0.65rem',
              border: '1px solid rgba(59, 130, 246, 0.35)',
              marginBottom: '0.85rem'
            }}>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#60A5FA', marginBottom: '0.4rem' }}>
                🔗 PASTE NETLIFY / AWS ERM APP URL HERE:
              </label>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <input
                  type="text"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  placeholder="e.g. https://zpc-erm-demo.netlify.app"
                  style={{
                    flex: 1,
                    padding: '0.4rem 0.6rem',
                    background: '#090d16',
                    border: '1px solid #334155',
                    borderRadius: '0.35rem',
                    color: 'white',
                    fontSize: '0.75rem'
                  }}
                />
                <button
                  type="submit"
                  style={{
                    background: savedSuccess ? '#10B981' : '#3B82F6',
                    color: 'white',
                    border: 'none',
                    padding: '0.4rem 0.7rem',
                    borderRadius: '0.35rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontSize: '0.72rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}
                >
                  {savedSuccess ? <Check size={12} /> : null}
                  <span>{savedSuccess ? 'Saved!' : 'Link'}</span>
                </button>
              </div>
              <p style={{ margin: '0.45rem 0 0', fontSize: '0.66rem', color: '#94A3B8', lineHeight: 1.3 }}>
                When sharing on Netlify, paste your live ERM app URL here once so the bridge switches across domains seamlessly!
              </p>
            </form>
          )}

          {/* App List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {/* 1. ERM Suite (Clickable Switcher) */}
            <div
              onClick={handleSwitchToErm}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.85rem',
                padding: '0.85rem',
                borderRadius: '0.75rem',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(200, 30, 30, 0.15)';
                e.currentTarget.style.borderColor = 'rgba(200, 30, 30, 0.45)';
                e.currentTarget.style.transform = 'translateX(3px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.transform = 'translateX(0)';
              }}
            >
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                flexShrink: 0
              }}>
                <Shield size={20} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'white' }}>
                    RiskINTEGRA ERM
                  </span>
                  <ArrowRightIcon />
                </div>
                <p style={{ margin: '3px 0 0', fontSize: '0.72rem', color: '#94A3B8', lineHeight: 1.3 }}>
                  Enterprise Risk Register, KRIs, Loss Ledger & PenCom Capital Engine.
                </p>
                <div style={{ marginTop: '6px', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.68rem', color: '#60A5FA', fontWeight: 700 }}>
                  <span>Launch ERM with active role ➔</span>
                </div>
              </div>
            </div>

            {/* 2. Audit Suite (Current / Active) */}
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.85rem',
              padding: '0.85rem',
              borderRadius: '0.75rem',
              background: 'linear-gradient(135deg, rgba(200, 30, 30, 0.22) 0%, rgba(136, 19, 55, 0.3) 100%)',
              border: '1px solid #C81E1E',
              cursor: 'default',
              boxShadow: '0 4px 15px rgba(200, 30, 30, 0.25)'
            }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #C81E1E 0%, #991B1B 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                flexShrink: 0,
                boxShadow: '0 2px 8px rgba(200, 30, 30, 0.5)'
              }}>
                <ClipboardCheck size={20} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#ffe4e6' }}>
                    RiskINTEGRA Internal Audit
                  </span>
                  <span style={{ fontSize: '0.65rem', background: '#C81E1E', color: 'white', padding: '0.12rem 0.45rem', borderRadius: '4px', fontWeight: 800 }}>
                    CURRENT
                  </span>
                </div>
                <p style={{ margin: '3px 0 0', fontSize: '0.72rem', color: '#fda4af', lineHeight: 1.3 }}>
                  Risk-Based Audit Planning, Working Papers, Findings & Board Reports.
                </p>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div style={{
            marginTop: '0.85rem',
            paddingTop: '0.75rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.68rem',
            color: '#64748B'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Lock size={12} color="#34d399" />
              <span>Bi-directional SSO Gateway</span>
            </div>
            <span style={{ color: '#94A3B8', fontSize: '0.65rem', fontStyle: 'italic' }}>
              Target: {ermUrl.replace('http://', '').replace('https://', '').split('/')[0]}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

const ArrowRightIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 17l9.2-9.2M17 17V7H7" />
  </svg>
);

export default AppSwitcherDropdown;
