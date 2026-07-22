import React, { useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuditContext } from './context/AuditContext';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import NotificationDrawer from './components/NotificationDrawer';
import LoginScreen from './components/LoginScreen';
import LicenseGuard from './components/LicenseGuard';
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

const App = () => {
  const { isAuthenticated, loading } = useContext(AuditContext);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-dark, #0f172a)', color: 'white', fontFamily: "'Inter', sans-serif" }}>
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
      <LicenseGuard>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%' }}>
          <CbnDmoMacroTicker />
          <LoginScreen />
        </div>
      </LicenseGuard>
    );
  }

  return (
    <LicenseGuard>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%' }}>
        <CbnDmoMacroTicker />
        <div className="app-container" style={{ flex: 1 }}>
          <Sidebar />
          <div className="main-content">
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
                RiskINTEGRA Internal Audit™ - © 2026 NayandJoeRiskTechConsulting • Licensed exclusively to Zenith Pension Custodian Limited
              </div>
              <div style={{ marginTop: '0.25rem', fontSize: '0.72rem', color: '#64748b' }}>
                Confidential Proprietary Software under Nigerian Copyright Act & Trade Secrets Law • PENCOM Section 63 & IIA Standards
              </div>
            </footer>
          </div>
        </div>
      </div>
    </LicenseGuard>
  );
};

export default App;
