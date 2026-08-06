import React, { useState } from 'react';
import { BookOpen, ShieldCheck, Layers, Users, Key, ExternalLink, Search, CheckCircle2, ChevronRight, HelpCircle, FileText, Share2, Wrench } from 'lucide-react';

const UserGuidePage = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <BookOpen size={16} /> },
    { id: 'roles', label: 'Access & Roles', icon: <Key size={16} /> },
    { id: 'planning', label: 'Audit Planning', icon: <Layers size={16} /> },
    { id: 'execution', label: 'Audit Execution', icon: <ShieldCheck size={16} /> },
    { id: 'findings', label: 'Findings & Actions', icon: <CheckCircle2 size={16} /> },
    { id: 'evidence', label: 'Working Papers', icon: <FileText size={16} /> },
    { id: 'reporting', label: 'Reports & Committees', icon: <Share2 size={16} /> },
    { id: 'integration', label: 'ERM Integration', icon: <ExternalLink size={16} /> }
  ];

  const content = {
    overview: {
      title: "Internal Audit Suite Overview",
      body: "Welcome to the RiskINTEGRA Internal Audit User Guide. This application modernizes the audit process by shifting from manual, periodic checks to a continuous, proactive approach. It helps your team plan, execute, and report on audit engagements seamlessly while ensuring compliance with institutional standards."
    },
    roles: {
      title: "Secure Access & Roles",
      body: "The platform provides tailored views based on your responsibilities to ensure focus and security. \n\n• Chief Audit Executive (CAE): Full oversight, final approvals, and reporting.\n• Audit Manager: Project scheduling, team assignment, and review of fieldwork.\n• Field Auditor: Executes testing, attaches evidence, and logs findings.\n• Process Owner (Auditee): Views assigned issues and updates corrective actions.\n\nYour interface automatically adapts to provide the exact tools you need."
    },
    planning: {
      title: "Audit Planning & Prioritization",
      body: "Effective auditing starts with smart planning. \n\n• Master Data: A complete catalog of all departments and processes available for audit.\n• Risk-Based Engine: Automatically ranks which areas need auditing most urgently based on their current risk scores.\n• Annual Plan: Schedule engagements across the year, assign team leads, and allocate budgeted hours."
    },
    execution: {
      title: "Audit Execution & Programs",
      body: "Conduct your audits with structured, standardized tools. \n\n• Audit Engagements: Track the lifecycle of an active audit from planning through fieldwork to final sign-off.\n• Audit Programs: Utilize step-by-step checklists to test specific processes. Mark steps as passed or log exceptions directly if an issue is found."
    },
    findings: {
      title: "Findings & Action Plans",
      body: "When an issue is discovered during an audit, it is tracked from identification to resolution. \n\n• Findings Dashboard: Log issues and categorize them by severity (Critical, High, Medium, Low).\n• Action Tracker: Assign remediation tasks to department heads, set deadlines, and monitor their progress until the issue is fully resolved."
    },
    evidence: {
      title: "Working Papers & Evidence",
      body: "Maintain a secure, organized trail of documentation. \n\nThe Working Papers module acts as a digital binder. Auditors can upload documents, reconciliation statements, and screenshots as proof of their testing. Once complete, these papers go through a structured electronic approval process (Auditor → Manager → Executive)."
    },
    reporting: {
      title: "Reports & Committees",
      body: "Communicate results effectively to leadership. \n\nThe platform includes tools to instantly generate presentation-ready reports for Board and Audit Committee meetings. These reports summarize completed audits, highlight critical findings, and track the overall health of the control environment."
    },
    integration: {
      title: "ERM Integration",
      body: "The Audit app works hand-in-hand with the Enterprise Risk Management (ERM) platform. \n\nThis continuous connection ensures that auditors are instantly aware of newly logged risks, operational losses, or control failures in the ERM system, allowing them to adjust their audit focus dynamically."
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', color: '#F8FAFC' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: '0 0 0.5rem', color: '#fda4af' }}>
          Internal Audit User Guide
        </h1>
        <p style={{ color: '#94A3B8', fontSize: '1rem', margin: 0 }}>
          A straightforward guide to planning, executing, and reporting on audit engagements.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '0.85rem 1rem', borderRadius: '0.5rem',
                background: activeTab === tab.id ? 'rgba(200, 30, 30, 0.15)' : 'transparent',
                color: activeTab === tab.id ? '#fda4af' : '#CBD5E1',
                border: activeTab === tab.id ? '1px solid rgba(200, 30, 30, 0.3)' : '1px solid transparent',
                cursor: 'pointer', textAlign: 'left', fontSize: '0.9rem', fontWeight: activeTab === tab.id ? 700 : 500,
                transition: 'all 0.2s'
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        <div>
          <div style={{ background: '#0B1120', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '1rem', padding: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white', marginTop: 0, marginBottom: '1rem' }}>
              {content[activeTab].title}
            </h2>
            <div style={{ whiteSpace: 'pre-line', lineHeight: 1.8, fontSize: '0.95rem', color: '#E2E8F0' }}>
              {content[activeTab].body}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserGuidePage;
