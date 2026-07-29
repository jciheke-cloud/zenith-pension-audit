import { useEffect, useState, useRef } from 'react';

/**
 * ⏱️ useIdleTimeout.js — Automatic 15-Minute Session Inactivity Lock (Audit Suite)
 *
 * Monitors auditor interaction across mouse, keyboard, touch, and scroll events.
 * Automatically terminates inactive audit sessions after 15 minutes in accordance
 * with SOC-2 Type II, ISO 27001, and PENCOM IT Security standards.
 */
export const useIdleTimeout = (onTimeout, timeoutMs = 15 * 60 * 1000) => {
  const [isIdle, setIsIdle] = useState(false);
  const timerRef = useRef(null);

  const resetTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setIsIdle(true);
      if (onTimeout) onTimeout();
    }, timeoutMs);
  };

  useEffect(() => {
    const events = ['mousemove', 'keydown', 'touchstart', 'scroll', 'click'];
    
    const handleActivity = () => {
      if (isIdle) setIsIdle(false);
      resetTimer();
    };

    events.forEach(event => window.addEventListener(event, handleActivity));
    resetTimer(); // Start initial timer

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      events.forEach(event => window.removeEventListener(event, handleActivity));
    };
  }, [timeoutMs, isIdle]);

  return { isIdle, resetTimer };
};

export default useIdleTimeout;
