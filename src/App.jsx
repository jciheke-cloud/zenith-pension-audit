import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import NotificationDrawer from './components/NotificationDrawer';

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

const App = () => {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Topbar />
        <NotificationDrawer />
        <Routes>
          <Route path="/" element={<ExecutiveDashboard />} />
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
        </Routes>
      </div>
    </div>
  );
};

export default App;
