import React, { useState, useRef, useEffect, useContext } from 'react';
import { AuditContext } from '../context/AuditContext';
import { LayoutGrid, Shield, ClipboardCheck, Lock, Settings, Check, Globe } from 'lucide-react';

const AppSwitcherDropdown = () => {
  const { currentUser, currentRole } = useContext(AuditContext);
  const [isOpen, setIsOpen] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  
  // Dynamic Companion App URL state (AWS Cloud & Enterprise environment)
  const [ermUrl, setErmUrl] = useState(() => {
    const fromStorage = localStorage.getItem('ZPC_ERM_URL_OVERRIDE');
    if (fromStorage) return fromStorage;
    return import.meta.env.VITE_ERM_APP_URL || '/';
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
    // Clear any stale local storage override that points to audit-portal
    const stored = localStorage.getItem('ZPC_ERM_URL_OVERRIDE');
    if (stored && (stored.includes('audit-portal') || stored.includes('localhost'))) {
      localStorage.removeItem('ZPC_ERM_URL_OVERRIDE');
    }

    let targetBase = '/';
    if (window.location.pathname.includes('/audit-portal')) {
      targetBase = window.location.origin + '/';
    } else if (ermUrl && !ermUrl.includes('audit-portal')) {
      targetBase = ermUrl;
    }
    if (!targetBase.endsWith('/')) targetBase += '/';
    
    let targetRole = 'maker';
    try {
      const session = JSON.parse(localStorage.getItem('zpc_auth_session') || sessionStorage.getItem('zpc_auth_session') || '{}');
      if (session?.user?.role) {
        targetRole = session.user.role;
      } else {
        const roleId = (currentUser?.roleId || currentRole?.id || '').toLowerCase();
        if (roleId.includes('admin')) targetRole = 'admin';
        else if (roleId.includes('audit') || roleId.includes('cae')) targetRole = 'auditor';
        else if (roleId.includes('exec') || roleId.includes('viewer') || roleId.includes('cro')) targetRole = 'executive';
        else if (roleId.includes('owner') || roleId.includes('manager') || roleId.includes('maker')) targetRole = 'maker';
      }
    } catch (e) {
      const roleId = (currentUser?.roleId || currentRole?.id || '').toLowerCase();
      if (roleId.includes('admin')) targetRole = 'admin';
      else if (roleId.includes('audit') || roleId.includes('cae')) targetRole = 'auditor';
      else if (roleId.includes('exec') || roleId.includes('viewer') || roleId.includes('cro')) targetRole = 'executive';
      else if (roleId.includes('owner') || roleId.includes('manager') || roleId.includes('maker')) targetRole = 'maker';
    }
    
    const target = `${targetBase}?sso_role=${encodeURIComponent(targetRole)}&sso_user=${encodeURIComponent(currentUser?.email || '')}&sso_token=riskintegra_auth_bridge&source=audit#/`;
    window.location.href = target;
  };

  const isRemote = true; // Always active cloud bridge on AWS / GitHub resources

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
          gap: '0.35rem',
          background: isOpen ? 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)' : 'linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%)',
          border: '1px solid #60A5FA',
          color: '#FFFFFF',
          padding: '0.28rem 0.62rem',
          borderRadius: '0.45rem',
          cursor: 'pointer',
          fontWeight: 800,
          fontSize: '0.74rem',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: isOpen ? '0 0 14px rgba(59, 130, 246, 0.65)' : '0 3px 10px rgba(59, 130, 246, 0.4)',
          letterSpacing: '0.01em'
        }}
        title="Switch RiskINTEGRA Corporate Governance Applications"
      >
        <LayoutGrid size={14} />
        <span>Switch App</span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 8px)',
          right: 0,
          width: '330px',
          background: '#0B1120',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          borderRadius: '0.85rem',
          padding: '0.85rem',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.85)',
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
              {isRemote && (
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
                  <Globe size={10} /> CLOUD BRIDGE
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
                title="Configure Companion ERM App URL"
              >
                <Settings size={12} />
                <span>{showConfig ? 'Close' : 'Set Link'}</span>
              </button>
            </div>
          </div>

          {/* Interactive Companion App URL Configuration Section */}
          {showConfig && (
            <form onSubmit={handleSaveUrl} style={{
              background: 'rgba(15, 23, 42, 0.9)',
              padding: '0.85rem',
              borderRadius: '0.65rem',
              border: '1px solid rgba(59, 130, 246, 0.35)',
              marginBottom: '0.85rem'
            }}>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#60A5FA', marginBottom: '0.4rem' }}>
                🔗 PASTE COMPANION ERM APP URL HERE:
              </label>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <input
                  type="text"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  placeholder="e.g. https://zpc-erm.zenithcustodian.com"
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
                When accessing across remote servers or cloud environments, paste your live ERM app URL here once so the bridge switches across domains seamlessly!
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
                    RiskINTEGRA ERM Suite
                  </span>
                  <span style={{ fontSize: '0.65rem', background: 'rgba(59, 130, 246, 0.2)', border: '1px solid #3B82F6', color: '#60A5FA', padding: '0.12rem 0.45rem', borderRadius: '4px', fontWeight: 800 }}>
                    PARTNER APP
                  </span>
                </div>
                <p style={{ margin: '3px 0 8px', fontSize: '0.72rem', color: '#94A3B8', lineHeight: 1.3 }}>
                  Enterprise Risk Register, KRIs, Loss Ledger & PenCom Capital Engine.
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSwitchToErm();
                  }}
                  style={{
                    background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                    color: 'white',
                    border: '1px solid #60A5FA',
                    padding: '0.42rem 0.85rem',
                    borderRadius: '0.45rem',
                    fontWeight: 800,
                    fontSize: '0.74rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    boxShadow: '0 3px 10px rgba(37, 99, 235, 0.4)'
                  }}
                >
                  <span>Launch ERM Suite (Active Role)</span>
                  <span>➔</span>
                </button>
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
