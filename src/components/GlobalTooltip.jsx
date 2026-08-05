import React, { useState, useEffect } from 'react';

const GlobalTooltip = () => {
  const [tooltip, setTooltip] = useState({ visible: false, text: '', x: 0, y: 0 });

  useEffect(() => {
    const handleMouseOver = (e) => {
      const target = e.target.closest('[data-tooltip]');
      if (target) {
        const isNavItem = target.classList.contains('nav-item');
        if (isNavItem) {
          const sidebar = target.closest('.sidebar');
          if (sidebar && !sidebar.classList.contains('collapsed')) {
            setTooltip(prev => prev.visible ? { ...prev, visible: false } : prev);
            return;
          }
        }
        
        const rect = target.getBoundingClientRect();
        setTooltip({
          visible: true,
          text: target.getAttribute('data-tooltip'),
          x: rect.right + 12,
          y: rect.top + rect.height / 2
        });
      } else {
        setTooltip((prev) => prev.visible ? { ...prev, visible: false } : prev);
      }
    };
    
    document.addEventListener('mouseover', handleMouseOver);
    return () => document.removeEventListener('mouseover', handleMouseOver);
  }, []);

  if (!tooltip.visible) return null;

  return (
    <div style={{
      position: 'fixed',
      left: tooltip.x,
      top: tooltip.y,
      transform: 'translateY(-50%)',
      padding: '6px 12px',
      background: '#1e293b',
      border: '1px solid #334155',
      color: '#f8fafc',
      borderRadius: '6px',
      fontSize: '0.75rem',
      fontWeight: 600,
      whiteSpace: 'nowrap',
      zIndex: 999999,
      boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
      pointerEvents: 'none'
    }}>
      {tooltip.text}
      <div style={{
        position: 'absolute',
        left: '-5px',
        top: '50%',
        transform: 'translateY(-50%)',
        borderWidth: '5px 5px 5px 0',
        borderStyle: 'solid',
        borderColor: 'transparent #334155 transparent transparent'
      }} />
    </div>
  );
};

export default GlobalTooltip;
