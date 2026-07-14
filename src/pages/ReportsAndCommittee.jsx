import React, { useContext, useState } from 'react';
import { AuditContext } from '../context/AuditContext';
import { FileCheck, Download, Award, ShieldCheck, CheckCircle, FileText, Share2, Layers, AlertOctagon } from 'lucide-react';

const ReportsAndCommittee = () => {
  const { auditPlans, findings, clientProfile, currency, addNotification } = useContext(AuditContext);
  const [activeTab, setActiveTab] = useState('generator'); // 'generator' or 'portal'
  const [selectedAuditId, setSelectedAuditId] = useState(auditPlans[0]?.id || 'PLAN-2026-01');
  const [reportType, setReportType] = useState('Final Audit Report & Management Letter');
  const [isGenerating, setIsGenerating] = useState(false);
  const [committeeSignOffs, setCommitteeSignOffs] = useState({
    q1Pack: true,
    q2Pack: false,
    ermLinkage: true
  });

  const selectedPlan = auditPlans.find(p => p.id === selectedAuditId) || auditPlans[0];
  const linkedFindings = findings.filter(f => f.businessUnit.includes(selectedPlan.department.split(' ')[0]) || f.findingNumber === 'FND-2026-001');

  const handleGenerateReport = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      addNotification('Report Generated & Exported', `${reportType} for "${selectedPlan.auditName}" compiled successfully with 10×10 matrix tables.`, 'success');
    }, 800);
  };

  const handleSignOff = (packKey, label) => {
    setCommitteeSignOffs(prev => ({ ...prev, [packKey]: true }));
    addNotification('Audit Committee Sign-Off Recorded', `${label} formally approved by Chairman, Board Audit Committee.`, 'success');
  };

  return (
    <div className="page-container">
      <div className="module-header">
        <div>
          <h1 className="module-title">Reports & Audit Committee Portal</h1>
          <p className="module-subtitle">
            Automated generation of statutory internal audit reports, executive management letters, and dedicated Board Audit Committee sign-off portal.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="nav-tab-container" style={{ flexWrap: 'wrap' }}>
        <button
          onClick={() => setActiveTab('generator')}
          className={`nav-tab-btn ${activeTab === 'generator' ? 'active' : ''}`}
          style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}
          title="Compile formal executive audit report packs, rating summaries, and management letters."
        >
          <FileText size={16} />
          <span style={{ fontWeight: 600 }}>Automated Audit Report Generator</span>
        </button>
        <button
          onClick={() => setActiveTab('portal')}
          className={`nav-tab-btn ${activeTab === 'portal' ? 'active' : ''}`}
          style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}
          title="Access high-level Board Audit Committee (BAC) oversight metrics, quarterly packs, and resolution tracking."
        >
          <FileCheck size={16} />
          <span style={{ fontWeight: 600 }}>Board Audit Committee Portal</span>
        </button>
      </div>

      {activeTab === 'generator' ? (
        <div className="app-grid" style={{ padding: 0, gap: '1.75rem' }}>
          {/* Left: Generator Configuration */}
          <div className="glass-card col-span-5">
            <h3 className="section-title" style={{ marginBottom: '1rem' }}>Configure & Compile Audit Report Pack</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>Select Completed Audit Engagement</label>
                <select value={selectedAuditId} onChange={e => setSelectedAuditId(e.target.value)} className="form-select" style={{ width: '100%', padding: '0.6rem 0.8rem' }}>
                  {auditPlans.map(p => (
                    <option key={p.id} value={p.id}>[{p.id}] {p.auditName}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>Report Template Type</label>
                <select value={reportType} onChange={e => setReportType(e.target.value)} className="form-select" style={{ width: '100%', padding: '0.6rem 0.8rem' }}>
                  <option value="Final Audit Report & Management Letter">Final Audit Report & Management Letter</option>
                  <option value="Executive Summary Briefing Pack">Executive Summary Briefing Pack</option>
                  <option value="Board Audit Committee Quarterly Compilation">Board Audit Committee Quarterly Compilation</option>
                  <option value="PenCom Statutory Internal Audit Return (Form IA-01)">PenCom Statutory Internal Audit Return (Form IA-01)</option>
                  <option value="Continuous Auditing Exception Feed Summary">Continuous Auditing Exception Feed Summary</option>
                </select>
              </div>

              <div style={{ background: 'rgba(18, 26, 41, 0.65)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fda4af', display: 'block', marginBottom: '0.4rem' }}>Included Document Sections:</span>
                <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                  <li>Executive Summary & Overall Audit Rating ({selectedPlan.auditRating || 'Satisfactory'})</li>
                  <li>Scope, Objectives & PenCom Regulatory Standards Assessed</li>
                  <li>Summary of 10×10 Risk Matrix Findings ({linkedFindings.length} Observations)</li>
                  <li>Management Corrective Action Plan (CAP) Tracker & Target Dates</li>
                  <li>RiskINTEGRA ERM Synchronized Residual Risk Score Adjustments</li>
                </ul>
              </div>

              <button
                onClick={handleGenerateReport}
                disabled={isGenerating}
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: '0.8rem', fontSize: '0.95rem' }}
              >
                {isGenerating ? 'Compiling Document Pack...' : 'Generate & Download Audit Report Pack (.pdf / .docx) ➔'}
              </button>
            </div>
          </div>

          {/* Right: Live Report Preview */}
          <div className="glass-card col-span-7" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderTop: '1px solid rgba(148, 163, 184, 0.38)' }}>
            <div className="flex-between" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.8rem', marginBottom: '1.2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span className="badge-danger">LIVE PREVIEW</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>{reportType}</span>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>ZPC Institutional Template v3.1</span>
            </div>

            <div style={{ background: 'rgba(18, 26, 41, 0.85)', padding: '2rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', color: 'white', minHeight: '480px', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div style={{ textAlign: 'center', borderBottom: '2px solid #C81E1E', paddingBottom: '1rem' }}>
                <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900, letterSpacing: '-0.5px' }}>{clientProfile.toUpperCase()}</h2>
                <h3 style={{ margin: '0.4rem 0 0', fontSize: '1.1rem', color: '#fda4af' }}>INTERNAL AUDIT DEPARTMENT</h3>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{reportType.toUpperCase()}</span>
              </div>

              <div>
                <h4 style={{ margin: '0 0 0.3rem', fontSize: '1rem', color: '#60a5fa' }}>1. ENGAGEMENT OVERVIEW: {selectedPlan.auditName.toUpperCase()}</h4>
                <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                  An internal audit review of <strong>{selectedPlan.department}</strong> was conducted covering the period of {selectedPlan.plannedStartDate} to {selectedPlan.plannedEndDate}. The review evaluated adherence to PenCom statutory guidelines on pension asset custody and internal cash sweeping SLAs.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '1.5rem', background: 'rgba(30, 41, 59, 0.6)', padding: '1rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>OVERALL AUDIT RATING</span>
                  <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#10B981' }}>{selectedPlan.auditRating || 'SATISFACTORY'}</span>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>TOTAL FINDINGS LOGGED</span>
                  <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#F59E0B' }}>{linkedFindings.length} Observations</span>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>ERM SYNC STATUS</span>
                  <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#34d399' }}>Linked to Risk Register</span>
                </div>
              </div>

              <div>
                <h4 style={{ margin: '0 0 0.4rem', fontSize: '1rem', color: '#60a5fa' }}>2. KEY OBSERVATIONS & 10×10 RISK EVALUATION</h4>
                {linkedFindings.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {linkedFindings.slice(0, 3).map(f => (
                      <div key={f.findingNumber} style={{ padding: '0.7rem', background: 'rgba(255,255,255,0.04)', borderRadius: '4px', borderLeft: f.priority === 'Critical' ? '3px solid #EF4444' : '3px solid #F59E0B' }}>
                        <div className="flex-between">
                          <span style={{ fontSize: '0.84rem', fontWeight: 700, color: 'white' }}>[{f.findingNumber}] {f.observation}</span>
                          <span className={f.priority === 'Critical' ? 'badge-danger' : 'badge-warning'}>{f.priority} (L{f.likelihood}×I{f.impact}={f.residualRisk})</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>No high risk observations recorded for this engagement.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Board Committee Portal */
        <div className="app-grid" style={{ padding: 0, gap: '1.75rem' }}>
          <div className="glass-card col-span-8">
            <div className="section-header-bar">
              <div>
                <h3 className="section-title">Board Audit Committee Executive Summary & Sign-Off Pack</h3>
                <p className="section-subtitle">Formal oversight actions required by ZPC Board Audit Committee members</p>
              </div>
              <span className="badge-chip-purple">Q2 2026 Audit Cycle Portal</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div style={{ background: 'rgba(18, 26, 41, 0.65)', padding: '1.4rem', borderRadius: 'var(--radius-md)', borderTop: '1px solid var(--border-color)', borderRight: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', borderLeft: '4px solid #10B981' }}>
                <div className="flex-between" style={{ marginBottom: '0.6rem' }}>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: 'white' }}>Q1 2026 Comprehensive Board Audit Pack</h4>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Submitted by Chief Audit Executive on May 10, 2026</span>
                  </div>
                  {committeeSignOffs.q1Pack ? (
                    <span className="badge-success">✓ Signed-Off by Board</span>
                  ) : (
                    <button onClick={() => handleSignOff('q1Pack', 'Q1 2026 Board Audit Pack')} className="btn-success">Sign-Off Pack</button>
                  )}
                </div>
                <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', margin: 0 }}>
                  Contains 4 completed audit engagements, 12 management action plans, and confirmation of 100% compliance with PenCom cash sweeping mandates across Q1 operations.
                </p>
              </div>

              <div style={{ background: 'rgba(18, 26, 41, 0.65)', padding: '1.4rem', borderRadius: 'var(--radius-md)', borderTop: '1px solid var(--border-color)', borderRight: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', borderLeft: '4px solid #F59E0B' }}>
                <div className="flex-between" style={{ marginBottom: '0.6rem' }}>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: 'white' }}>Q2 2026 Mid-Year Audit Progress Report & High-Risk CAP Escalations</h4>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Pending final committee review</span>
                  </div>
                  {committeeSignOffs.q2Pack ? (
                    <span className="badge-success">✓ Signed-Off by Board</span>
                  ) : (
                    <button onClick={() => handleSignOff('q2Pack', 'Q2 2026 Mid-Year Progress Report')} className="btn-primary">Approve & Sign-Off ➔</button>
                  )}
                </div>
                <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', margin: 0 }}>
                  Highlights 2 recurring repeat findings in Custody Cash Sweeping and Information Security. Recommends immediate board escalation to Head of ICT for CAP enforcement.
                </p>
              </div>

              <div style={{ background: 'rgba(18, 26, 41, 0.65)', padding: '1.4rem', borderRadius: 'var(--radius-md)', borderTop: '1px solid var(--border-color)', borderRight: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', borderLeft: '4px solid #3B82F6' }}>
                <div className="flex-between" style={{ marginBottom: '0.6rem' }}>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: 'white' }}>RiskINTEGRA ERM & Audit Ecosystem Alignment Certificate</h4>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Confirming cross-module sync between Audit Universe & ERM Risk Register</span>
                  </div>
                  <span className="badge-success">✓ Synchronized</span>
                </div>
                <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', margin: 0 }}>
                  Confirms that all 14 audit universe processes and their 10×10 residual risk scores are actively streaming data into the Zenith Pension Custodian ERM application.
                </p>
              </div>
            </div>
          </div>

          <div className="glass-card col-span-4">
            <h3 className="section-title" style={{ marginBottom: '0.8rem' }}>Committee Governance KPIs</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
              <div className="flex-between" style={{ padding: '0.85rem', background: 'rgba(18, 26, 41, 0.65)', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Statutory Meetings Held (2026)</span>
                <span className="tabular-nums" style={{ fontSize: '1.2rem', fontWeight: 800, color: '#34d399' }}>2 / 4 Quarterly</span>
              </div>
              <div className="flex-between" style={{ padding: '0.85rem', background: 'rgba(18, 26, 41, 0.65)', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Charter Compliance Status</span>
                <span className="badge-success">100% Compliant</span>
              </div>
              <div className="flex-between" style={{ padding: '0.85rem', background: 'rgba(18, 26, 41, 0.65)', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>PenCom Statutory Return Status</span>
                <span className="badge-purple">Form IA-01 Submitted</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsAndCommittee;
