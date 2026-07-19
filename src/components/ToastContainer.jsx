import React, { useContext } from 'react';
import { AuditContext } from '../context/AuditContext';

const ToastContainer = () => {
  const { toasts, removeToast } = useContext(AuditContext);

  if (!toasts || toasts.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '1.5rem',
      right: '1.5rem',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
      maxWidth: '380px',
      width: 'calc(100vw - 3rem)',
      pointerEvents: 'none'
    }}>
      {toasts.map((t) => {
        let borderColor = 'rgba(16, 185, 129, 0.5)';
        let bgColor = 'rgba(16, 185, 129, 0.12)';
        let icon = '✓';
        let titleColor = '#34D399';

        if (t.type === 'warning') {
          borderColor = 'rgba(245, 158, 11, 0.5)';
          bgColor = 'rgba(245, 158, 11, 0.12)';
          icon = '⚠️';
          titleColor = '#FBBF24';
        } else if (t.type === 'danger' || t.type === 'error' || t.type === 'crisis') {
          borderColor = 'rgba(239, 68, 68, 0.6)';
          bgColor = 'rgba(239, 68, 68, 0.18)';
          icon = '🚨';
          titleColor = '#F87171';
        } else if (t.type === 'info') {
          borderColor = 'rgba(59, 130, 246, 0.5)';
          bgColor = 'rgba(59, 130, 246, 0.12)';
          icon = 'ℹ️';
          titleColor = '#60A5FA';
        }

        return (
          <div
            key={t.id}
            style={{
              pointerEvents: 'auto',
              background: 'rgba(17, 24, 39, 0.95)',
              backdropFilter: 'blur(12px)',
              border: `1px solid ${borderColor}`,
              borderRadius: '0.75rem',
              padding: '0.85rem 1rem',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              animation: 'slideInRight 0.3s ease-out'
            }}
          >
            <div style={{
              width: '1.75rem',
              height: '1.75rem',
              borderRadius: '0.5rem',
              background: bgColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1rem',
              flexShrink: 0,
              marginTop: '0.1rem'
            }}>
              {icon}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: titleColor, marginBottom: '0.2rem' }}>
                {t.title || (t.type === 'danger' ? 'System Escalation Alert' : t.type.toUpperCase())}
              </div>
              <p style={{ fontSize: '0.82rem', color: '#E5E7EB', margin: 0, lineHeight: '1.4', wordBreak: 'break-word' }}>
                {t.message}
              </p>
            </div>

            <button
              onClick={() => removeToast(t.id)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#9CA3AF',
                cursor: 'pointer',
                fontSize: '1.1rem',
                padding: '0 0.2rem',
                lineHeight: 1
              }}
              title="Dismiss toast"
            >
              ×
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default ToastContainer;
