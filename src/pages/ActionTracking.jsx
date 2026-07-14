import React, { useContext, useState } from 'react';
import { AuditContext } from '../context/AuditContext';
import { CheckSquare, AlertTriangle, Clock, ShieldCheck, ArrowRight, RefreshCw, Send } from 'lucide-react';

const ActionTracking = () => {
  const { findings, updateFindingStatus, addNotification } = useContext(AuditContext);
  const [activeTab, setActiveTab] = useState('All'); // 'All', 'Open', 'In Progress', 'Awaiting Validation', 'Closed', 'Overdue'

  const openCount = findings.filter(f => f.status === 'Open').length;
  const inProgCount = findings.filter(f => f.status === 'In Progress').length;
  const awaitingCount = findings.filter(f => f.status === 'Awaiting Validation').length;
  const closedCount = findings.filter(f => f.status === 'Closed').length;
  const overdueCount = findings.filter(f => f.status === 'Overdue' || (f.status !== 'Closed' && f.targetDate < '2026-07-01')).length;

  const filteredCAPs = findings.filter(f => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Overdue') return f.status === 'Overdue' || (f.status !== 'Closed' && f.targetDate < '2026-07-01');
    return f.status === activeTab;
  });

  const handleSendReminder = (finding) => {
    addNotification('Escalation Alert Sent', `Automated CAP overdue reminder sent to ${finding.actionOwner} and ZPC Executive Management.`, 'danger');
  };

  return (
    <div className="page-container">
      <div className="module-header">
        <div>
          <h1 className="module-title">Corrective Action Tracking (CAP Tracker)</h1>
          <p className="module-subtitle">
            Lifecycle monitoring of management commitments, automated reminder escalations, and audit retesting sign-offs.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
        <div className="glass-card" style={{ padding: '1.2rem', cursor: 'pointer', border: activeTab === 'All' ? '1px solid #C81E1E' : '1px solid var(--border-color)' }} onClick={() => setActiveTab('All')}>
          <span className="card-title-sm">Total Logged CAPs</span>
          <span className="card-metric" style={{ fontSize: '1.8rem' }}>{findings.length}</span>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.3rem' }}>All audit observations</span>
        </div>

        <div className="glass-card" style={{ padding: '1.2rem', cursor: 'pointer', border: activeTab === 'Open' ? '1px solid #EF4444' : '1px solid var(--border-color)' }} onClick={() => setActiveTab('Open')}>
          <span className="card-title-sm">Open CAPs</span>
          <span className="card-metric" style={{ fontSize: '1.8rem', color: '#EF4444' }}>{openCount}</span>
          <span style={{ fontSize: '0.72rem', color: '#fca5a5', display: 'block', marginTop: '0.3rem' }}>Action not started</span>
        </div>

        <div className="glass-card" style={{ padding: '1.2rem', cursor: 'pointer', border: activeTab === 'In Progress' ? '1px solid #F59E0B' : '1px solid var(--border-color)' }} onClick={() => setActiveTab('In Progress')}>
          <span className="card-title-sm">In Progress</span>
          <span className="card-metric" style={{ fontSize: '1.8rem', color: '#F59E0B' }}>{inProgCount}</span>
          <span style={{ fontSize: '0.72rem', color: '#fde047', display: 'block', marginTop: '0.3rem' }}>Remediation underway</span>
        </div>

        <div className="glass-card" style={{ padding: '1.2rem', cursor: 'pointer', border: activeTab === 'Awaiting Validation' ? '1px solid #3B82F6' : '1px solid var(--border-color)' }} onClick={() => setActiveTab('Awaiting Validation')}>
          <span className="card-title-sm">Awaiting Retesting</span>
          <span className="card-metric" style={{ fontSize: '1.8rem', color: '#3B82F6' }}>{awaitingCount}</span>
          <span style={{ fontSize: '0.72rem', color: '#93c5fd', display: 'block', marginTop: '0.3rem' }}>Needs audit verification</span>
        </div>

        <div className="glass-card" style={{ padding: '1.2rem', cursor: 'pointer', border: activeTab === 'Closed' ? '1px solid #10B981' : '1px solid var(--border-color)' }} onClick={() => setActiveTab('Closed')}>
          <span className="card-title-sm">Closed & Verified</span>
          <span className="card-metric" style={{ fontSize: '1.8rem', color: '#10B981' }}>{closedCount}</span>
          <span style={{ fontSize: '0.72rem', color: '#34d399', display: 'block', marginTop: '0.3rem' }}>Successfully remediated</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="nav-tab-container" style={{ flexWrap: 'wrap' }}>
        {['All', 'Open', 'In Progress', 'Awaiting Validation', 'Closed', 'Overdue'].map(t => {
          const count = t === 'All' ? findings.length : t === 'Open' ? openCount : t === 'In Progress' ? inProgCount : t === 'Awaiting Validation' ? awaitingCount : t === 'Closed' ? closedCount : overdueCount;
          const label = t === 'All' ? 'All Actions' : t;
          return (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`nav-tab-btn ${activeTab === t ? 'active' : ''}`}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              title={`Filter Corrective Action Plans by status: ${label} (${count} actions).`}
            >
              <span style={{ fontWeight: 600 }}>{label}</span>
              <span className="badge-chip" style={{ background: 'rgba(255, 255, 255, 0.12)', fontSize: '0.72rem', padding: '0.15rem 0.45rem', borderRadius: '12px' }}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* CAP Table */}
      <div className="glass-card">
        <div className="section-header-bar">
          <div>
            <h3 className="section-title">Management Corrective Action Register</h3>
            <p className="section-subtitle">Retesting verification workflows and automated escalation tracking</p>
          </div>
        </div>

        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Finding Ref</th>
                <th>Observation Detail</th>
                <th>Priority</th>
                <th>Action Owner (Mgmt)</th>
                <th>Management Action Commitment</th>
                <th>Target Date</th>
                <th>Current Status</th>
                <th>Validation / Retest Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredCAPs.map(cap => (
                <tr key={cap.findingNumber || cap.id}>
                  <td className="tabular-nums" style={{ fontWeight: 800, color: '#fda4af' }}>{cap.findingNumber || cap.id || 'FND-001'}</td>
                  <td style={{ fontWeight: 700, maxWidth: '280px' }}>{cap.observation || cap.title || 'Substantive Control Verification'}</td>
                  <td>
                    {cap.priority === 'Critical' && <span className="badge-danger">Critical</span>}
                    {cap.priority === 'High' && <span className="badge-warning">High</span>}
                    {cap.priority === 'Medium' && <span className="badge-info">Medium</span>}
                    {(!cap.priority || cap.priority === 'Low') && <span className="badge-success">{cap.priority || 'Low'}</span>}
                  </td>
                  <td style={{ fontSize: '0.84rem' }}>{cap.actionOwner || cap.owner || 'Head of Custody / Operations'}</td>
                  <td style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', maxWidth: '320px' }}>{cap.managementResponse || cap.actionPlan || 'Automated verification and control testing committed by management.'}</td>
                  <td className="tabular-nums" style={{ fontWeight: 700 }}>{cap.targetDate || cap.dueDate || '2026-09-30'}</td>
                  <td>
                    {cap.status === 'Open' && <span className="badge-danger">Open</span>}
                    {cap.status === 'In Progress' && <span className="badge-warning">In Progress</span>}
                    {cap.status === 'Awaiting Validation' && <span className="badge-info">Awaiting Validation</span>}
                    {cap.status === 'Closed' && <span className="badge-success">Closed</span>}
                    {cap.status === 'Overdue' && <span className="badge-chip-danger">Overdue</span>}
                    {(!cap.status || (cap.status !== 'Open' && cap.status !== 'In Progress' && cap.status !== 'Awaiting Validation' && cap.status !== 'Closed' && cap.status !== 'Overdue')) && <span className="badge-warning">{cap.status || 'Open'}</span>}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                      {cap.status === 'Open' && (
                        <button onClick={() => updateFindingStatus(cap.findingNumber, 'In Progress')} className="btn-secondary" style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem' }}>
                          Start Work
                        </button>
                      )}
                      {cap.status === 'In Progress' && (
                        <button onClick={() => updateFindingStatus(cap.findingNumber, 'Awaiting Validation')} className="btn-primary" style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem' }}>
                          Submit for Retest
                        </button>
                      )}
                      {cap.status === 'Awaiting Validation' && (
                        <>
                          <button onClick={() => updateFindingStatus(cap.findingNumber, 'Closed')} className="btn-success" style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem' }}>
                            ✓ Pass Retest (Close)
                          </button>
                          <button onClick={() => updateFindingStatus(cap.findingNumber, 'In Progress')} className="btn-secondary" style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem' }}>
                            ✕ Fail Retest
                          </button>
                        </>
                      )}
                      {(cap.status === 'Open' || cap.status === 'Overdue') && (
                        <button onClick={() => handleSendReminder(cap)} className="btn-secondary" style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem', color: '#fca5a5' }}>
                          <Send size={12} /> Escalate
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ActionTracking;
