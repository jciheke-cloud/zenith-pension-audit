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
  Share2,
  BookOpen
} from 'lucide-react';
import { AuditContext } from '../context/AuditContext';

const Sidebar = () => {
  const { currentRole } = useContext(AuditContext);
  const roleId = currentRole?.id || 'cae';

  // Role categorization flags
  const isExecutive = roleId === 'cae' || roleId === 'manager';
  const isBoard = roleId === 'committee';
  const isOwner = roleId === 'owner';
  const isQa = roleId === 'qa';
  const isSenior = roleId === 'senior';
  const isErm = roleId === 'erm';

  // Role Banner configuration
  const roleBanners = {
    cae: { title: '👑 EXECUTIVE AUTHORITY', subtitle: 'Full Read/Write & Board Sign-Off', bg: 'linear-gradient(135deg, rgba(200, 30, 30, 0.3) 0%, rgba(159, 18, 57, 0.4) 100%)', border: '#C81E1E' },
    manager: { title: '🎯 MANAGEMENT OVERSIGHT', subtitle: 'Audit Plan & Team Administration', bg: 'linear-gradient(135deg, rgba(59, 130, 246, 0.25) 0%, rgba(30, 64, 175, 0.35) 100%)', border: '#3B82F6' },
    senior: { title: '📋 FIELDWORK EXECUTION', subtitle: 'Audit Testing & Evidence Capture', bg: 'linear-gradient(135deg, rgba(16, 185, 129, 0.25) 0%, rgba(6, 95, 70, 0.35) 100%)', border: '#10B981' },
    qa: { title: '🔍 METHODOLOGY & QA', subtitle: 'Working Paper & Evidence Validation', bg: 'linear-gradient(135deg, rgba(245, 158, 11, 0.25) 0%, rgba(180, 83, 9, 0.35) 100%)', border: '#F59E0B' },
    owner: { title: '🏢 AUDITEE / PROCESS OWNER', subtitle: 'CAP Remediation & Finding Response', bg: 'linear-gradient(135deg, rgba(168, 85, 247, 0.25) 0%, rgba(107, 33, 168, 0.35) 100%)', border: '#A855F7' },
    erm: { title: '🌐 ERM RISK ECOSYSTEM', subtitle: 'KRI Telemetry & Risk Linkage Sync', bg: 'linear-gradient(135deg, rgba(14, 165, 233, 0.25) 0%, rgba(3, 105, 161, 0.35) 100%)', border: '#0EA5E9' },
    committee: { title: '🏛️ BOARD & COMMITTEE PORTAL', subtitle: 'Executive Oversight & Read-Only Pack', bg: 'linear-gradient(135deg, rgba(244, 63, 94, 0.25) 0%, rgba(190, 18, 60, 0.35) 100%)', border: '#F43F5E' }
  };

  const activeBanner = roleBanners[roleId] || roleBanners.cae;

  return (
    <aside className="sidebar">
      <div className="sidebar-header" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', paddingBottom: '0.8rem' }}>
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

      {/* Role View Badge Banner */}
      <div style={{
        margin: '0 12px 10px',
        padding: '8px 10px',
        background: activeBanner.bg,
        borderLeft: `3px solid ${activeBanner.border}`,
        borderRadius: '6px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
      }}>
        <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'white', letterSpacing: '0.03em' }}>
          {activeBanner.title}
        </div>
        <div style={{ fontSize: '0.62rem', fontWeight: 600, color: '#E2E8F0', marginTop: '2px' }}>
          {activeBanner.subtitle}
        </div>
      </div>

      <nav className="sidebar-nav" style={{ padding: '0.2rem 0' }}>
        <div style={{ margin: '0.6rem 0 0.3rem', padding: '0 1rem', fontSize: '0.66rem', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          EXECUTIVE DASHBOARD
        </div>
        <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} end>
          <LayoutDashboard />
          <span>{isBoard ? 'Board Overview Dashboard' : isOwner ? 'Process Owner Dashboard' : 'Executive Dashboard'}</span>
        </NavLink>

        {/* FOUNDATION & PLANNING - Seen by Executive, Senior, ERM, Board */}
        {(isExecutive || isSenior || isErm || isBoard) && (
          <>
            <div style={{ margin: '1.1rem 0 0.3rem', padding: '0 1rem', fontSize: '0.66rem', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              FOUNDATION & PLANNING
            </div>
            {(isExecutive || isSenior) && (
              <NavLink to="/master-data" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <Database />
                <span>Master Data Foundation</span>
              </NavLink>
            )}
            {(isExecutive || isSenior || isBoard || isErm) && (
              <NavLink to="/annual-plan" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <Calendar />
                <span>Annual Audit Planning</span>
              </NavLink>
            )}
            {(isExecutive || isErm || isSenior) && (
              <NavLink to="/risk-scoring" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <Sliders />
                <span>Risk-Based Planning Engine</span>
              </NavLink>
            )}
          </>
        )}

        {/* ENGAGEMENT EXECUTION - Seen by Executive, Senior, QA */}
        {(isExecutive || isSenior || isQa) && (
          <>
            <div style={{ margin: '1.1rem 0 0.3rem', padding: '0 1rem', fontSize: '0.66rem', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              ENGAGEMENT EXECUTION
            </div>
            <NavLink to="/engagements" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <Briefcase />
              <span>Audit Engagements</span>
            </NavLink>
            {(isExecutive || isSenior) && (
              <NavLink to="/programs" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <FileText />
                <span>Audit Programs Library</span>
              </NavLink>
            )}
            <NavLink to="/working-papers" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <FolderOpen />
              <span>Working Papers & Evidence</span>
            </NavLink>
          </>
        )}

        {/* FINDINGS & REMEDIATION - Seen by All Roles (Core for Auditee Owner & Board) */}
        <div style={{ margin: '1.1rem 0 0.3rem', padding: '0 1rem', fontSize: '0.66rem', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          FINDINGS & REMEDIATION
        </div>
        <NavLink to="/findings" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <AlertOctagon />
          <span>Findings & 10×10 Matrix</span>
        </NavLink>
        {(isExecutive || isSenior || isOwner || isQa) && (
          <NavLink to="/action-tracker" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <CheckSquare />
            <span>Action Tracker (CAPs)</span>
          </NavLink>
        )}
        {(isExecutive || isSenior || isQa || isOwner) && (
          <NavLink to="/controls" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <ShieldCheck />
            <span>Internal Controls Assessment</span>
          </NavLink>
        )}

        {/* OVERSIGHT & ASSURANCE - Seen by Executive, ERM, QA, Senior, Board */}
        {(isExecutive || isErm || isQa || isSenior || isBoard) && (
          <>
            <div style={{ margin: '1.1rem 0 0.3rem', padding: '0 1rem', fontSize: '0.66rem', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              OVERSIGHT & ASSURANCE
            </div>
            {(isExecutive || isErm || isSenior) && (
              <NavLink to="/compliance-regulatory" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <Scale />
                <span>Compliance & Regulatory</span>
              </NavLink>
            )}
            {(isExecutive || isSenior || isErm || isQa) && (
              <NavLink to="/fraud-continuous" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <Eye />
                <span>Fraud & Continuous Auditing</span>
              </NavLink>
            )}
            {(isExecutive || isQa || isBoard) && (
              <NavLink to="/reports-committee" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <FileCheck />
                <span>Reports & Committee Portal</span>
              </NavLink>
            )}
          </>
        )}

        {/* ECOSYSTEM & HELP - Seen by All */}
        <div style={{ margin: '1.1rem 0 0.3rem', padding: '0 1rem', fontSize: '0.66rem', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          ECOSYSTEM & HELP
        </div>
        {(isExecutive || isErm || isBoard || isSenior) && (
          <NavLink to="/erm-sync" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Share2 />
            <span style={{ color: '#fda4af', fontWeight: 800 }}>ERM Sync Bridge™</span>
          </NavLink>
        )}
        <NavLink to="/user-guide" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <BookOpen />
          <span style={{ color: '#38BDF8', fontWeight: 700 }}>User Guide & Manual</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer" style={{
        fontSize: '0.75rem',
        lineHeight: '1.5',
        padding: '14px 18px',
        fontWeight: '700',
        color: '#E2E8F0',
        textAlign: 'center',
        flexShrink: 0,
        borderTop: '1px solid rgba(255,255,255,0.05)',
        background: 'rgba(0,0,0,0.2)'
      }}>
        <div style={{ marginBottom: '0.3rem', fontWeight: 700, color: activeBanner.border }}>
          View Role: {currentRole?.name || 'Chief Audit Executive'}
        </div>
        RiskINTEGRA Internal Audit™<br />
        <span style={{ fontSize: '0.7rem', fontWeight: '600', color: '#94a3b8' }}>© 2026 NayandJoeRiskTechConsulting</span>
      </div>
    </aside>
  );
};

export default Sidebar;
