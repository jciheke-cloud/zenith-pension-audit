import React, { useContext } from 'react';
import { AuditContext } from '../context/AuditContext';
import { X, Bell, AlertTriangle, ShieldCheck, Info } from 'lucide-react';

const NotificationDrawer = () => {
  const { notifications, drawerOpen, setDrawerOpen, markAllRead } = useContext(AuditContext);

  if (!drawerOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.7)',
      backdropFilter: 'blur(6px)',
      zIndex: 1050,
      display: 'flex',
      justifyContent: 'flex-end'
    }}>
      <div style={{
        width: '420px',
        height: '100vh',
        background: 'var(--bg-card-hover)',
        borderLeft: '1px solid var(--border-highlight)',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '-10px 0 30px rgba(0, 0, 0, 0.8)',
        animation: 'slideInRight 0.25s ease'
      }}>
        <div style={{
          padding: '1.5rem 1.6rem',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(0, 0, 0, 0.4)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Bell size={20} color="#C81E1E" />
            <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>Audit Alerts & ERM Sync Feed</h3>
          </div>
          <button
            onClick={() => setDrawerOpen(false)}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.3rem' }}
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: '0.8rem 1.6rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Total Alerts: {notifications.length}
          </span>
          <button
            onClick={markAllRead}
            style={{ background: 'transparent', border: 'none', color: '#fda4af', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
          >
            Mark all read ✓
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '1.2rem 1.4rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {notifications.map(n => {
            let bgColor = 'rgba(59, 130, 246, 0.1)';
            let borderColor = 'rgba(59, 130, 246, 0.3)';
            let icon = <Info size={16} color="#3B82F6" />;

            if (n.type === 'danger') {
              bgColor = 'rgba(239, 68, 68, 0.14)';
              borderColor = 'rgba(239, 68, 68, 0.4)';
              icon = <AlertTriangle size={16} color="#EF4444" />;
            } else if (n.type === 'warning') {
              bgColor = 'rgba(245, 158, 11, 0.12)';
              borderColor = 'rgba(245, 158, 11, 0.35)';
              icon = <AlertTriangle size={16} color="#F59E0B" />;
            } else if (n.type === 'success') {
              bgColor = 'rgba(16, 185, 129, 0.12)';
              borderColor = 'rgba(16, 185, 129, 0.35)';
              icon = <ShieldCheck size={16} color="#10B981" />;
            }

            return (
              <div
                key={n.id}
                style={{
                  background: bgColor,
                  border: `1px solid ${borderColor}`,
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem 1.15rem',
                  position: 'relative'
                }}
              >
                {!n.read && (
                  <span style={{ position: 'absolute', top: '12px', right: '12px', width: '8px', height: '8px', borderRadius: '50%', background: '#C81E1E', boxShadow: '0 0 6px #C81E1E' }} />
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                  {icon}
                  <span style={{ fontSize: '0.86rem', fontWeight: 700, color: 'white' }}>{n.title}</span>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.4', margin: '0 0 0.5rem' }}>
                  {n.message}
                </p>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textAlign: 'right' }}>
                  {n.time}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default NotificationDrawer;
