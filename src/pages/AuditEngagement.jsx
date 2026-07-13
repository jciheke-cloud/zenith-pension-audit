import React, { useContext, useState } from 'react';
import { AuditContext } from '../context/AuditContext';
import { Briefcase, CheckCircle, AlertOctagon, FileText, Users, Clock, ShieldCheck, Plus, CheckSquare, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AuditEngagement = () => {
  const { auditPlans, auditPrograms, setAuditPrograms, addWorkingPaper, addNotification } = useContext(AuditContext);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('planning'); // 'planning', 'execution', 'qa_review'
  const [selectedPlanId, setSelectedPlanId] = useState(auditPlans[0]?.id || 'PLAN-2026-01');

  const selectedPlan = auditPlans.find(p => p.id === selectedPlanId) || auditPlans[0];

  // Review Notes State
  const [reviewNotes, setReviewNotes] = useState([
    { id: 'rn-1', author: 'Chief Audit Executive (CAE)', text: 'Verify that all PenCom Section 5.2 custody asset confirmation certificates are cross-checked against CBN RTGS statements.', status: 'Cleared', date: '2026-07-10' },
    { id: 'rn-2', author: 'Lead Reviewer', text: 'Procedure 3 in custody reconciliation requires deeper sample testing—expand sample size from 25 to 50 transactions.', status: 'Open', date: '2026-07-12' }
  ]);
  const [newNoteText, setNewNoteText] = useState('');

  // Working paper upload simulation in engagement
  const [isWpModalOpen, setIsWpModalOpen] = useState(false);
  const [wpTitle, setWpTitle] = useState('');
  const [wpType, setWpType] = useState('Excel Workbook (.xlsx)');

  const handleAddReviewNote = (e) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    setReviewNotes(prev => [
      { id: `rn-${Date.now()}`, author: 'Current Auditor', text: newNoteText.trim(), status: 'Open', date: new Date().toISOString().split('T')[0] },
      ...prev
    ]);
    setNewNoteText('');
    addNotification('Review Note Logged', 'Senior Reviewer added a QA note requiring fieldwork follow-up.', 'warning');
  };

  const handleToggleProcedureStatus = (programId, procId) => {
    setAuditPrograms(prev => prev.map(prog => {
      if (prog.id !== programId) return prog;
      const updatedProcs = prog.procedures?.map(proc => {
        if (proc.id !== procId) return proc;
        const nextStatus = proc.status === 'Passed' ? 'Failed' : proc.status === 'Failed' ? 'In Progress' : 'Passed';
        return { ...proc, status: nextStatus };
      });
      return { ...prog, procedures: updatedProcs };
    }));
    addNotification('Procedure Status Updated', 'Audit program testing procedure result recorded.', 'info');
  };

  const handleUploadEngagementWp = (e) => {
    e.preventDefault();
    if (!wpTitle) return;
    addWorkingPaper({
      title: wpTitle,
      fileName: `${wpTitle.toLowerCase().replace(/\s+/g, '_')}.xlsx`,
      fileType: wpType,
      linkedAudit: selectedPlan.auditName,
      uploadedBy: selectedPlan.leadAuditor
    });
    setIsWpModalOpen(false);
    setWpTitle('');
  };

  return (
    <div className="page-container">
      <div className="module-header">
        <div>
          <h1 className="module-title">Audit Engagement Execution Lifecycle</h1>
          <p className="module-subtitle">
            End-to-end digital management of ZPC audit field work across Planning, Fieldwork Testing, and Quality Assurance review.
          </p>
        </div>
        <div className="header-actions">
          <select
            value={selectedPlanId}
            onChange={e => setSelectedPlanId(e.target.value)}
            className="form-select"
            style={{ minWidth: '280px', padding: '0.5rem 0.8rem', fontWeight: 700 }}
          >
            {auditPlans.map(p => (
              <option key={p.id} value={p.id}>[{p.id}] {p.auditName}</option>
            ))}
          </select>
          <button onClick={() => navigate('/findings')} className="btn-primary">
            <AlertOctagon size={16} />
            <span>Log Engagement Finding</span>
          </button>
        </div>
      </div>

      {/* Engagement Summary Banner */}
      <div className="glass-card" style={{ marginBottom: '1.75rem', borderLeft: '4px solid #C81E1E' }}>
        <div className="flex-between" style={{ flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span className="badge-chip-info" style={{ marginBottom: '0.4rem', display: 'inline-block' }}>{selectedPlan.department}</span>
            <h2 style={{ margin: '0 0 0.4rem', fontSize: '1.35rem', fontWeight: 800 }}>{selectedPlan.auditName}</h2>
            <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              <span>Lead Auditor: <strong style={{ color: 'white' }}>{selectedPlan.leadAuditor}</strong></span>
              <span>Team: <strong style={{ color: 'white' }}>{(selectedPlan.teamMembers || ['Senior IT Auditor', 'QA Auditor']).join(', ')}</strong></span>
              <span>Timeline: <strong style={{ color: 'white' }}>{selectedPlan.plannedStartDate} to {selectedPlan.plannedEndDate}</strong></span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Engagement Budget</span>
              <span className="tabular-nums" style={{ fontSize: '1.3rem', fontWeight: 800, color: '#34d399' }}>₦{selectedPlan.budget}M</span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Fieldwork Progress</span>
              <span className="badge-purple" style={{ fontSize: '0.85rem' }}>{selectedPlan.status}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Engagement Stage Navigation Tabs */}
      <div className="nav-tab-container">
        <button onClick={() => setActiveTab('planning')} className={`nav-tab-btn ${activeTab === 'planning' ? 'active' : ''}`}>
          <Briefcase size={16} />
          <span>Stage 1: Planning & Scope Definition</span>
        </button>
        <button onClick={() => setActiveTab('execution')} className={`nav-tab-btn ${activeTab === 'execution' ? 'active' : ''}`}>
          <CheckSquare size={16} />
          <span>Stage 2: Fieldwork Execution & Program Testing ({auditPrograms[0]?.procedures?.length || 4} Procedures)</span>
        </button>
        <button onClick={() => setActiveTab('qa_review')} className={`nav-tab-btn ${activeTab === 'qa_review' ? 'active' : ''}`}>
          <ShieldCheck size={16} />
          <span>Stage 3: Supervisor Review Notes & Quality Assurance ({reviewNotes.length})</span>
        </button>
      </div>

      {/* Stage 1: Planning */}
      {activeTab === 'planning' && (
        <div className="app-grid" style={{ padding: 0, gap: '1.5rem' }}>
          <div className="glass-card col-span-6">
            <h3 className="section-title" style={{ marginBottom: '0.8rem' }}>Engagement Scope & Objectives</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              To conduct a comprehensive, independent evaluation of the operational effectiveness and regulatory compliance of ZPC's <strong>{selectedPlan.department}</strong>. Specifically assessing whether all client pension contributions swept from employers are reconciled within the statutory 24-hour SLA window mandated by the National Pension Commission (PenCom).
            </p>
            <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#fda4af', margin: '1rem 0 0.4rem' }}>Audit Criteria & Regulatory Standards</h4>
            <ul style={{ paddingLeft: '1.2rem', margin: 0, color: 'var(--text-secondary)', fontSize: '0.86rem', lineHeight: '1.6' }}>
              <li>National Pension Commission (PenCom) Guidelines on Custody of Pension Assets (2023 Revision).</li>
              <li>Central Bank of Nigeria (CBN) Real-Time Gross Settlement (RTGS) reconciliation mandates.</li>
              <li>IIA Global Internal Audit Standards (2024 Edition) - Performance & Assurance domains.</li>
              <li>ZPC Internal Operations Policy Manual - Custody Account Sweeping Section 4.2.</li>
            </ul>
          </div>

          <div className="glass-card col-span-6">
            <h3 className="section-title" style={{ marginBottom: '0.8rem' }}>Pre-Engagement Risk Assessment & Team Allocation</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div className="flex-between" style={{ padding: '0.7rem', background: 'rgba(0,0,0,0.3)', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ fontSize: '0.86rem', fontWeight: 600 }}>Inherent Risk Rating:</span>
                <span className="badge-danger">{selectedPlan.riskRating} Risk</span>
              </div>
              <div className="flex-between" style={{ padding: '0.7rem', background: 'rgba(0,0,0,0.3)', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ fontSize: '0.86rem', fontWeight: 600 }}>Fraud Risk Susceptibility:</span>
                <span className="badge-warning">High (Custody Cash Handling)</span>
              </div>
              <div className="flex-between" style={{ padding: '0.7rem', background: 'rgba(0,0,0,0.3)', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ fontSize: '0.86rem', fontWeight: 600 }}>Estimated Fieldwork Hours:</span>
                <span className="tabular-nums" style={{ fontWeight: 800 }}>{selectedPlan.estimatedHours} Hours</span>
              </div>
              <div style={{ padding: '0.7rem', background: 'rgba(0,0,0,0.3)', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ fontSize: '0.86rem', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>Assigned Engagement Team:</span>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span className="badge-chip-purple">Lead: {selectedPlan.leadAuditor}</span>
                  {(selectedPlan.teamMembers || ['Senior IT Auditor', 'QA Auditor']).map((m, i) => (
                    <span key={i} className="badge-chip" style={{ background: 'rgba(255,255,255,0.06)' }}>Auditor: {m}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stage 2: Execution / Fieldwork */}
      {activeTab === 'execution' && (
        <div className="glass-card">
          <div className="section-header-bar">
            <div>
              <h3 className="section-title">Audit Program Procedures & Testing Checklist</h3>
              <p className="section-subtitle">Executing step-by-step procedures, sampling, and linking working paper evidence</p>
            </div>
            <button onClick={() => setIsWpModalOpen(true)} className="btn-secondary">
              <Plus size={16} />
              <span>Attach Working Paper Evidence</span>
            </button>
          </div>

          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Ref #</th>
                  <th>Audit Procedure Description</th>
                  <th>Sample Size</th>
                  <th>Assigned Auditor</th>
                  <th>Testing Result Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {(auditPrograms[0]?.procedures || []).map(proc => (
                  <tr key={proc.id}>
                    <td className="tabular-nums" style={{ fontWeight: 800, color: '#3B82F6' }}>{proc.ref}</td>
                    <td style={{ fontWeight: 600, maxWidth: '420px' }}>{proc.step}</td>
                    <td className="tabular-nums">{proc.sampleSize}</td>
                    <td style={{ fontSize: '0.84rem' }}>{proc.assignedTo}</td>
                    <td>
                      {proc.status === 'Passed' && <span className="badge-success">Passed / Satisfactory</span>}
                      {proc.status === 'Failed' && <span className="badge-danger">Failed / Exception</span>}
                      {proc.status === 'In Progress' && <span className="badge-info">In Progress</span>}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button
                          onClick={() => handleToggleProcedureStatus(auditPrograms[0].id, proc.id)}
                          className="btn-secondary"
                          style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem' }}
                        >
                          Toggle Result ➔
                        </button>
                        <button onClick={() => navigate('/working-papers')} className="btn-secondary" style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem' }}>
                          Evidence
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Stage 3: QA & Review Notes */}
      {activeTab === 'qa_review' && (
        <div className="app-grid" style={{ padding: 0, gap: '1.5rem' }}>
          <div className="glass-card col-span-7">
            <div className="section-header-bar">
              <div>
                <h3 className="section-title">Supervisor & Quality Assurance Review Notes</h3>
                <p className="section-subtitle">Formal supervisory review queries and fieldwork clearance tracker</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {reviewNotes.map(note => (
                <div key={note.id} style={{ background: 'rgba(0,0,0,0.35)', padding: '1.1rem', borderRadius: 'var(--radius-md)', borderLeft: note.status === 'Open' ? '4px solid #F59E0B' : '4px solid #10B981' }}>
                  <div className="flex-between" style={{ marginBottom: '0.4rem' }}>
                    <span style={{ fontWeight: 800, fontSize: '0.9rem', color: 'white' }}>{note.author}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{note.date}</span>
                      <span className={note.status === 'Open' ? 'badge-warning' : 'badge-success'}>{note.status}</span>
                    </div>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                    {note.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card col-span-5">
            <h3 className="section-title" style={{ marginBottom: '0.8rem' }}>Log New QA Review Note</h3>
            <form onSubmit={handleAddReviewNote} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>Note Detail / Query for Fieldwork Team</label>
                <textarea
                  rows={4}
                  placeholder="Enter supervisory observation, sampling expansion request, or evidence clarification query..."
                  value={newNoteText}
                  onChange={e => setNewNoteText(e.target.value)}
                  className="form-input"
                  style={{ width: '100%', resize: 'vertical' }}
                  required
                />
              </div>
              <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                Post Review Note ➔
              </button>
            </form>

            <div style={{ marginTop: '2rem', padding: '1.2rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.35)', borderRadius: 'var(--radius-md)' }}>
              <h4 style={{ margin: '0 0 0.4rem', fontSize: '0.92rem', fontWeight: 800, color: '#34d399' }}>Fieldwork Sign-Off & Report Generation</h4>
              <p style={{ margin: '0 0 0.85rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Once all review notes are cleared and working papers verified, the Chief Audit Executive can sign off on the engagement and generate the draft report.
              </p>
              <button onClick={() => navigate('/reports-committee')} className="btn-success" style={{ width: '100%', justifyContent: 'center' }}>
                Proceed to Draft Report Sign-Off ➔
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WP Modal */}
      {isWpModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '520px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.4rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>Upload Working Paper Evidence</h3>
              <button onClick={() => setIsWpModalOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>✕</button>
            </div>
            <form onSubmit={handleUploadEngagementWp} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>Working Paper Title</label>
                <input type="text" required placeholder="e.g. Q1 Custody Fee Sweep Reconciliation Spreadsheet" value={wpTitle} onChange={e => setWpTitle(e.target.value)} className="form-input" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>Evidence File Type</label>
                <select value={wpType} onChange={e => setWpType(e.target.value)} className="form-select">
                  <option value="Excel Workbook (.xlsx)">Excel Workbook (.xlsx)</option>
                  <option value="Word Document (.docx)">Word Document (.docx)</option>
                  <option value="PDF Document (.pdf)">PDF Document (.pdf)</option>
                  <option value="Bank RTGS Statement (.pdf)">Bank RTGS Statement (.pdf)</option>
                  <option value="SWIFT Log Snapshot (.png)">SWIFT Log Snapshot (.png)</option>
                </select>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.85rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setIsWpModalOpen(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Attach Evidence</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditEngagement;
