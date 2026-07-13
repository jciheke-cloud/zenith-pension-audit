import React, { useContext, useState } from 'react';
import { AuditContext } from '../context/AuditContext';
import { Bell, Shield, UserCheck } from 'lucide-react';

const Topbar = () => {
  const {
    clientProfile,
    setClientProfile,
    currency,
    toggleCurrency,
    currentRole,
    switchRole,
    rolesList,
    notifications,
    setDrawerOpen
  } = useContext(AuditContext);

  const [editingProfile, setEditingProfile] = useState(false);
  const [profileInput, setProfileInput] = useState(clientProfile);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (profileInput.trim()) {
      setClientProfile(profileInput.trim());
    }
    setEditingProfile(false);
  };

  return (
    <header style={{
      height: '70px',
      background: 'var(--bg-header)',
      borderBottom: '1px solid var(--border-color)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 2.5rem',
      position: 'sticky',
      top: 0,
      zIndex: 40,
      backdropFilter: 'blur(20px)'
    }}>
      {/* Left side: Client Profile & Brand Badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        <span style={{ fontWeight: 800, fontSize: '1.15rem', background: 'linear-gradient(90deg, #ffe4e6 0%, #fda4af 60%, #C81E1E 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          🛡️ Zenith Pension Custodian™
        </span>
        <span style={{ color: 'var(--text-muted)' }}>|</span>
        {editingProfile ? (
          <form onSubmit={handleSaveProfile} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <input
              type="text"
              value={profileInput}
              onChange={e => setProfileInput(e.target.value)}
              autoFocus
              style={{
                background: '#1E293B',
                border: '1px solid rgba(200, 30, 30, 0.45)',
                color: 'white',
                padding: '0.35rem 0.65rem',
                borderRadius: '0.4rem',
                fontSize: '0.85rem',
                width: '300px'
              }}
            />
            <button type="submit" className="btn-primary" style={{ padding: '0.35rem 0.65rem' }}>✓</button>
          </form>
        ) : (
          <div
            onClick={() => setEditingProfile(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            title="Click to customize Client/Bank Name"
          >
            <span style={{ color: 'var(--text-main)', fontWeight: 700, fontSize: '1.05rem', letterSpacing: '-0.2px' }}>
              {clientProfile}
            </span>
            <span style={{ fontSize: '0.75rem', color: '#fda4af' }}>✏️</span>
          </div>
        )}
        <span className="badge badge-success" style={{ background: 'rgba(225, 29, 72, 0.2)', border: '1px solid rgba(200, 30, 30, 0.35)', color: '#fda4af' }}>License: PENCOM/PFC/004</span>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.35)', padding: '0.35rem 0.75rem', borderRadius: '0.5rem', fontSize: '0.75rem', fontWeight: 700, color: '#34d399' }}>
          <Shield size={14} />
          <span>RiskINTEGRA ERM Sync: ACTIVE</span>
        </div>
      </div>

      {/* Right side controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
        {/* Currency Selector */}
        <button
          onClick={toggleCurrency}
          style={{
            padding: '0.45rem 0.75rem',
            borderRadius: '0.5rem',
            border: '1px solid rgba(200, 30, 30, 0.45)',
            background: 'linear-gradient(135deg, rgba(200, 30, 30, 0.25) 0%, rgba(159, 18, 57, 0.35) 100%)',
            color: 'white',
            fontWeight: 800,
            cursor: 'pointer',
            fontSize: '0.82rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            boxShadow: '0 0 10px rgba(200, 30, 30, 0.3)',
            transition: 'all 0.2s'
          }}
          title="Click to switch global reporting currency"
        >
          <span>💱</span>
          <span style={{ color: '#fda4af', fontWeight: 800 }}>{currency}</span>
        </button>

        {/* Multi-Role Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255, 255, 255, 0.04)', border: '1px solid var(--border-color)', padding: '0.3rem 0.7rem', borderRadius: '0.5rem' }}>
          <UserCheck size={16} color="#fda4af" />
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Role:</span>
          <select
            value={currentRole?.id}
            onChange={e => switchRole(e.target.value)}
            style={{
              background: 'transparent',
              color: 'white',
              border: 'none',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            {rolesList.map(r => (
              <option key={r.id} value={r.id} style={{ background: '#0F172A', color: 'white' }}>
                {r.name}
              </option>
            ))}
          </select>
        </div>

        {/* Notification Bell */}
        <button
          onClick={() => setDrawerOpen(true)}
          style={{
            position: 'relative',
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            color: 'var(--text-main)',
            padding: '0.5rem 0.8rem',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            fontSize: '0.9rem',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title="Notifications & Alerts"
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '-5px',
              right: '-5px',
              background: '#C81E1E',
              color: 'white',
              fontSize: '0.65rem',
              fontWeight: 800,
              padding: '0.12rem 0.4rem',
              borderRadius: '9999px',
              boxShadow: '0 0 8px rgba(200, 30, 30, 0.8)'
            }}>
              {unreadCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};

export default Topbar;
