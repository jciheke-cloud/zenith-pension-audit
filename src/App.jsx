import React, { useContext } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AuditContext } from './context/AuditContext';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import NotificationDrawer from './components/NotificationDrawer';
import LoginScreen from './components/LoginScreen';

import ToastContainer from './components/ToastContainer';

// Pages
import ExecutiveDashboard from './pages/ExecutiveDashboard';
import MasterData from './pages/MasterData';
import AnnualAuditPlan from './pages/AnnualAuditPlan';
import RiskBasedPlanning from './pages/RiskBasedPlanning';
import AuditEngagement from './pages/AuditEngagement';
import AuditPrograms from './pages/AuditPrograms';
import WorkingPapers from './pages/WorkingPapers';
import FindingsManagement from './pages/FindingsManagement';
import ActionTracking from './pages/ActionTracking';
import InternalControls from './pages/InternalControls';
import ComplianceAndRegulatory from './pages/ComplianceAndRegulatory';
import FraudAndContinuous from './pages/FraudAndContinuous';
import ReportsAndCommittee from './pages/ReportsAndCommittee';
import ErmSyncPage from './pages/ErmSyncPage';
import UserGuidePage from './pages/UserGuidePage';
import UserManagement from './pages/UserManagement';
import CbnDmoMacroTicker from './components/CbnDmoMacroTicker';
import PortalLanding from './pages/PortalLanding';
import useIdleTimeout from './hooks/useIdleTimeout';

const App = () => {
  const { isAuthenticated, loading, logoutUser } = useContext(AuditContext);
  const [showIdleModal, setShowIdleModal] = React.useState(false);
  const mainRef = React.useRef(null);
  const location = useLocation();

  useIdleTimeout(() => {
    if (isAuthenticated) {
      if (logoutUser) logoutUser();
      setShowIdleModal(true);
    }
  }, 15 * 60 * 1000);

  // Disable browser auto scroll restoration
  React.useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  // Reset scroll container to top on every route/hash navigation
  React.useEffect(() => {
    const scrollToTop = () => {
      if (mainRef.current) {
        mainRef.current.scrollTop = 0;
        try {
          mainRef.current.scrollTo(0, 0);
        } catch (e) {}
      }
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    scrollToTop();
    const rafId = requestAnimationFrame(scrollToTop);
    const timer1 = setTimeout(scrollToTop, 50);
    const timer2 = setTimeout(scrollToTop, 150);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [location.pathname, location.hash, location.key, location.search]);

  if (loading) {
    return (
      <div style={{ height: '100%', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-dark, #0f172a)', color: 'white', fontFamily: "'Inter', sans-serif" }}>
        Loading Internal Audit Suite...
      </div>
    );
  }

  const currentPath = window.location.pathname.toLowerCase();
  if (currentPath === '/portal' || currentPath === '/landing' || currentPath === '/portal/' || currentPath === '/landing/') {
    return <PortalLanding />;
  }

  if (!isAuthenticated) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', width: '100%' }}>
        <CbnDmoMacroTicker />
        <LoginScreen />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', width: '100%' }}>
      <CbnDmoMacroTicker />
      <div className="app-container" style={{ flex: 1 }}>
        <Sidebar />
        <div className="main-content" ref={mainRef} style={{ overflowY: 'auto' }}>
          <Topbar />
          <NotificationDrawer />
          <ToastContainer />
          <Routes>
            <Route path="/portal" element={<PortalLanding />} />
            <Route path="/" element={<ExecutiveDashboard />} />
            <Route path="/index.html" element={<ExecutiveDashboard />} />
            <Route path="/master-data" element={<MasterData />} />
            <Route path="/annual-plan" element={<AnnualAuditPlan />} />
            <Route path="/risk-scoring" element={<RiskBasedPlanning />} />
            <Route path="/engagements" element={<AuditEngagement />} />
            <Route path="/programs" element={<AuditPrograms />} />
            <Route path="/working-papers" element={<WorkingPapers />} />
            <Route path="/findings" element={<FindingsManagement />} />
            <Route path="/action-tracker" element={<ActionTracking />} />
            <Route path="/controls" element={<InternalControls />} />
            <Route path="/compliance-regulatory" element={<ComplianceAndRegulatory />} />
            <Route path="/fraud-continuous" element={<FraudAndContinuous />} />
            <Route path="/reports-committee" element={<ReportsAndCommittee />} />
            <Route path="/erm-sync" element={<ErmSyncPage />} />
            <Route path="/user-guide" element={<UserGuidePage />} />
            <Route path="/user-management" element={<UserManagement />} />
            <Route path="*" element={<ExecutiveDashboard />} />
          </Routes>
          <footer style={{
            textAlign: 'center',
            padding: '1.5rem 1rem 0.5rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
            marginTop: '2.5rem',
            fontSize: '0.78rem',
            color: '#94a3b8'
          }}>
            <div style={{ fontWeight: 700, color: '#E2E8F0', letterSpacing: '0.02em' }}>
              RiskINTEGRA Internal Audit™ - © 2026 Nay&JoeRiskAndTechConsulting • Licensed exclusively to Zenith Pension Custodian Limited
            </div>
            <div style={{ marginTop: '0.25rem', fontSize: '0.72rem', color: '#64748b' }}>
              Confidential Proprietary Software under Nigerian Copyright Act & Trade Secrets Law • PENCOM Section 63 & IIA Standards
            </div>
          </footer>
        </div>
      </div>

      {showIdleModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: '#0F172A', border: '1px solid #EF4444', borderRadius: '0.75rem', padding: '2rem', maxWidth: '460px', width: '100%', textAlign: 'center', boxShadow: '0 25px 50px -12px rgba(239, 68, 68, 0.25)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⏱️</div>
            <h3 style={{ color: 'white', fontWeight: 800, fontSize: '1.25rem', marginBottom: '0.5rem' }}>Audit Session Expired (SOC-2 Compliance)</h3>
            <p style={{ color: '#94A3B8', fontSize: '0.875rem', marginBottom: '1.5rem', lineHeight: '1.5' }}>
              You were logged out after 15 minutes of inactivity in accordance with IIA, ISO 27001, and PENCOM IT Security Policy. Please log in again to continue.
            </p>
            <button 
              onClick={() => { setShowIdleModal(false); window.location.reload(); }}
              style={{ padding: '0.75rem 1.5rem', borderRadius: '0.5rem', background: '#EF4444', color: 'white', border: 'none', fontWeight: 700, cursor: 'pointer', width: '100%' }}
            >
              Re-Authenticate / Log In
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
