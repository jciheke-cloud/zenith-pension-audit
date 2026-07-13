import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Database,
  Calendar,
  Sliders,
  Briefcase,
  FileText,
  FolderOpen,
  AlertOctagon,
  CheckSquare,
  ShieldCheck,
  Scale,
  Eye,
  FileCheck,
  Share2
} from 'lucide-react';
import { AuditContext } from '../context/AuditContext';

const Sidebar = () => {
  const { currentRole } = useContext(AuditContext);

  return (
    <aside className="sidebar">
      <div className="sidebar-header" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', paddingBottom: '1.2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <img src="/logo.png" alt="Zenith Pensions Logo" style={{ height: '32px' }} />
          <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.5px', color: 'white' }}>
            Risk<span style={{ color: '#C81E1E' }}>INTEGRA</span>
          </h2>
        </div>
        <span style={{ fontSize: '0.66rem', fontWeight: 700, color: '#fda4af', letterSpacing: '0.04em', marginTop: '4px', textTransform: 'uppercase' }}>
          Internal Audit Management™
        </span>
      </div>

      <nav className="sidebar-nav" style={{ padding: '0.4rem 0' }}>
        <div style={{ margin: '0.6rem 0 0.3rem', padding: '0 1rem', fontSize: '0.66rem', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          EXECUTIVE DASHBOARD
        </div>
        <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} end>
          <LayoutDashboard />
          <span>Executive Dashboard</span>
        </NavLink>

        <div style={{ margin: '1.1rem 0 0.3rem', padding: '0 1rem', fontSize: '0.66rem', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          FOUNDATION & PLANNING
        </div>
        <NavLink to="/master-data" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Database />
          <span>Master Data Foundation</span>
        </NavLink>
        <NavLink to="/annual-plan" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Calendar />
          <span>Annual Audit Planning</span>
        </NavLink>
        <NavLink to="/risk-scoring" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Sliders />
          <span>Risk-Based Planning Engine</span>
        </NavLink>

        <div style={{ margin: '1.1rem 0 0.3rem', padding: '0 1rem', fontSize: '0.66rem', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          ENGAGEMENT EXECUTION
        </div>
        <NavLink to="/engagements" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Briefcase />
          <span>Audit Engagements</span>
        </NavLink>
        <NavLink to="/programs" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <FileText />
          <span>Audit Programs Library</span>
        </NavLink>
        <NavLink to="/working-papers" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <FolderOpen />
          <span>Working Papers & Evidence</span>
        </NavLink>

        <div style={{ margin: '1.1rem 0 0.3rem', padding: '0 1rem', fontSize: '0.66rem', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          FINDINGS & REMEDIATION
        </div>
        <NavLink to="/findings" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <AlertOctagon />
          <span>Findings & 10×10 Matrix</span>
        </NavLink>
        <NavLink to="/action-tracker" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <CheckSquare />
          <span>Action Tracker (CAPs)</span>
        </NavLink>
        <NavLink to="/controls" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <ShieldCheck />
          <span>Internal Controls Assessment</span>
        </NavLink>

        <div style={{ margin: '1.1rem 0 0.3rem', padding: '0 1rem', fontSize: '0.66rem', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          OVERSIGHT & ASSURANCE
        </div>
        <NavLink to="/compliance-regulatory" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Scale />
          <span>Compliance & Regulatory</span>
        </NavLink>
        <NavLink to="/fraud-continuous" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Eye />
          <span>Fraud & Continuous Auditing</span>
        </NavLink>
        <NavLink to="/reports-committee" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <FileCheck />
          <span>Reports & Committee Portal</span>
        </NavLink>

        <div style={{ margin: '1.1rem 0 0.3rem', padding: '0 1rem', fontSize: '0.66rem', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          ECOSYSTEM INTEGRATION
        </div>
        <NavLink to="/erm-sync" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Share2 />
          <span style={{ color: '#fda4af', fontWeight: 800 }}>ERM Sync Bridge™</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <div style={{ marginBottom: '0.3rem', fontWeight: 700, color: '#E2E8F0' }}>
          Active Role: {currentRole?.badge || 'Chief Audit Executive'}
        </div>
        <span>Zenith Pension Custodian Ltd v3.1</span>
      </div>
    </aside>
  );
};

export default Sidebar;
