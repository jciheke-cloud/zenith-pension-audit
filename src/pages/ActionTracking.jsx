import React, { useContext, useState } from 'react';
import { AuditContext } from '../context/AuditContext';
import { CheckSquare, AlertTriangle, Clock, ShieldCheck, ArrowRight, RefreshCw, Send, Paperclip, CheckCircle2, FileCheck, Eye, Search, Filter } from 'lucide-react';
import AuditDataUpload from '../components/AuditDataUpload';
import TopScrollTableWrapper from '../components/TopScrollTableWrapper';

const ActionTracking = () => {
  const { findings: contextFindings, updateFindingStatus, addNotification, setFindings: setContextFindings } = useContext(AuditContext);
  const findings = contextFindings || [];
  const setFindings = setContextFindings;

  const [activeTab, setActiveTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('All');
  const [showFilter, setShowFilter] = useState(false);
  // Proof & Retest Modals
  const [proofModalCap, setProofModalCap] = useState(null);
  const [retestModalCap, setRetestModalCap] = useState(null);
  const [remediationProofNote, setRemediationProofNote] = useState('');
  const [auditorVerificationNote, setAuditorVerificationNote] = useState('');

  const openCount = findings.filter(f => f.status === 'Open').length;
  const inProgCount = findings.filter(f => f.status === 'In Progress').length;
  const awaitingCount = findings.filter(f => f.status === 'Awaiting Validation').length;
  const closedCount = findings.filter(f => f.status === 'Closed').length;
  const overdueCount = findings.filter(f => f.status === 'Overdue' || (f.status !== 'Closed' && f.targetDate < '2026-07-01')).length;

  const filteredCAPs = findings.filter(f => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Overdue') return f.status === 'Overdue' || (f.status !== 'Closed' && f.targetDate < '2026-07-01');
    return f.status === activeTab;
  }).filter(f => {
    const term = searchTerm.toLowerCase();
    const matchSearch = (f.findingNumber || f.id || '').toLowerCase().includes(term) || (f.observation || f.title || '').toLowerCase().includes(term) || (f.actionOwner || f.owner || '').toLowerCase().includes(term);
    const matchPriority = filterPriority === 'All' || (f.priority || 'Low') === filterPriority;
    return matchSearch && matchPriority;
  });

  const handleSendReminder = (finding) => {
    addNotification('Escalation Alert Sent', `Automated CAP overdue reminder sent to ${finding.actionOwner} and ZPC Executive Management.`, 'danger');
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await updateFindingStatus(id, newStatus);
      addNotification('Status Updated', `Finding moved to ${newStatus}.`, 'success');
    } catch (err) {
      addNotification('Error', 'Failed to update action tracking status.', 'danger');
    }
  };

  const handleSubmitProof = (e) => {
    e.preventDefault();
    if (proofModalCap) {
      handleUpdateStatus(proofModalCap.findingNumber || proofModalCap.id, 'Awaiting Validation');
      setProofModalCap(null);
      setRemediationProofNote('');
    }
  };

  const handlePassRetest = (e) => {
    e.preventDefault();
    if (retestModalCap) {
      handleUpdateStatus(retestModalCap.findingNumber || retestModalCap.id, 'Closed');
      setRetestModalCap(null);
      setAuditorVerificationNote('');
    }
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
        <div className="header-actions">
          <AuditDataUpload targetModule="findings" buttonText="Batch Import CAPs" />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid grid-cols-[repeat(auto-fit,minmax(210px,1fr))] gap-4 mb-7">
        <div className={`glass-card p-5 cursor-pointer border ${activeTab === 'All' ? 'border-[#C81E1E]' : 'border-[var(--border-color)]'}`} onClick={() => setActiveTab('All')}>
          <span className="card-title-sm">Total Logged CAPs</span>
          <span className="card-metric text-[1.8rem]">{findings.length}</span>
          <span className="text-[0.72rem] text-[var(--text-muted)] block mt-1">All audit observations</span>
        </div>

        <div className={`glass-card p-5 cursor-pointer border ${activeTab === 'Open' ? 'border-[#EF4444]' : 'border-[var(--border-color)]'}`} onClick={() => setActiveTab('Open')}>
          <span className="card-title-sm">Open CAPs</span>
          <span className="card-metric text-[1.8rem] text-[#EF4444]">{openCount}</span>
          <span className="text-[0.72rem] text-[#fca5a5] block mt-1">Action not started</span>
        </div>

        <div className={`glass-card p-5 cursor-pointer border ${activeTab === 'In Progress' ? 'border-[#F59E0B]' : 'border-[var(--border-color)]'}`} onClick={() => setActiveTab('In Progress')}>
          <span className="card-title-sm">In Progress</span>
          <span className="card-metric text-[1.8rem] text-[#F59E0B]">{inProgCount}</span>
          <span className="text-[0.72rem] text-[#fde047] block mt-1">Remediation underway</span>
        </div>

        <div className={`glass-card p-5 cursor-pointer border ${activeTab === 'Awaiting Validation' ? 'border-[#3B82F6]' : 'border-[var(--border-color)]'}`} onClick={() => setActiveTab('Awaiting Validation')}>
          <span className="card-title-sm">Awaiting Retesting</span>
          <span className="card-metric text-[1.8rem] text-[#3B82F6]">{awaitingCount}</span>
          <span className="text-[0.72rem] text-[#93c5fd] block mt-1">Needs audit verification</span>
        </div>

        <div className={`glass-card p-5 cursor-pointer border ${activeTab === 'Closed' ? 'border-[#10B981]' : 'border-[var(--border-color)]'}`} onClick={() => setActiveTab('Closed')}>
          <span className="card-title-sm">Closed & Verified</span>
          <span className="card-metric text-[1.8rem] text-[#10B981]">{closedCount}</span>
          <span className="text-[0.72rem] text-[#34d399] block mt-1">Successfully remediated</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="nav-tab-container flex-wrap">
        {['All', 'Open', 'In Progress', 'Awaiting Validation', 'Closed', 'Overdue'].map(t => {
          const count = t === 'All' ? findings.length : t === 'Open' ? openCount : t === 'In Progress' ? inProgCount : t === 'Awaiting Validation' ? awaitingCount : t === 'Closed' ? closedCount : overdueCount;
          const label = t === 'All' ? 'All Actions' : t;
          return (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`nav-tab-btn flex items-center gap-2 ${activeTab === t ? 'active' : ''}`}
              title={`Filter Corrective Action Plans by status: ${label} (${count} actions).`}
            >
              <span className="font-semibold">{label}</span>
              <span className="badge-chip bg-white/[0.12] text-[0.72rem] py-[0.15rem] px-[0.45rem] rounded-xl">
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
          <div className="flex gap-[0.8rem] items-center">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-[10px] text-[var(--text-muted)]" />
              <input type="text" placeholder="Search CAPs..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="form-input pl-[2.2rem] w-[220px]" />
            </div>
            <div className="relative">
              <button onClick={() => setShowFilter(!showFilter)} className="btn-secondary px-[0.8rem] py-2">
                <Filter size={16} /> Filter
              </button>
              {showFilter && (
                <div className="absolute right-0 top-[110%] bg-[var(--bg-card)] border border-[var(--border-color)] rounded-md p-[0.8rem] z-10 min-w-[180px] shadow-lg">
                  <label className="block text-[0.75rem] font-semibold mb-[0.4rem]">By Priority</label>
                  <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)} className="form-select w-full">
                    <option value="All">All Priorities</option>
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="data-table-container">
          <TopScrollTableWrapper>
<table className="data-table">
            <thead>
              <tr>
                <th>Finding Ref</th>
                <th>Observation Detail</th>
                <th>Priority</th>
                <th>Action Owner (Mgmt)</th>
                <th>Management Action Commitment</th>
                <th>Target & Aging</th>
                <th>Current Status</th>
                <th>Validation / Retest Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredCAPs.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center p-8">No matching items found</td>
                </tr>
              ) : (
              filteredCAPs.map(cap => {
                const isOverdue = cap.status !== 'Closed' && cap.targetDate < '2026-07-24';
                return (
                  <tr key={cap.findingNumber || cap.id}>
                    <td className="tabular-nums font-extrabold text-[#fda4af]">{cap.findingNumber || cap.id || 'FND-001'}</td>
                    <td className="font-bold max-w-[270px]">{cap.observation || cap.title || 'Substantive Control Verification'}</td>
                    <td>
                      {cap.priority === 'Critical' && <span className="badge-danger">Critical</span>}
                      {cap.priority === 'High' && <span className="badge-warning">High</span>}
                      {cap.priority === 'Medium' && <span className="badge-info">Medium</span>}
                      {(!cap.priority || cap.priority === 'Low') && <span className="badge-success">{cap.priority || 'Low'}</span>}
                    </td>
                    <td className="text-[0.84rem]">{cap.actionOwner || cap.owner || 'Head of Custody / Operations'}</td>
                    <td className="text-[0.82rem] text-[var(--text-secondary)] max-w-[300px]">{cap.managementResponse || cap.actionPlan || 'Automated verification and control testing committed by management.'}</td>
                    <td>
                      <div className="flex flex-col gap-[0.2rem]">
                        <span className="tabular-nums font-bold text-[0.82rem]">{cap.targetDate || cap.dueDate || '2026-09-30'}</span>
                        {isOverdue ? (
                          <span className="badge-chip-danger text-[0.68rem]">ΓÜá∩╕Å Overdue &gt; 24 Days</span>
                        ) : (
                          <span className="badge-chip-success text-[0.68rem]">Γ£ô On Schedule</span>
                        )}
                      </div>
                    </td>
                    <td>
                      {cap.status === 'Open' && <span className="badge-danger">Open</span>}
                      {cap.status === 'In Progress' && <span className="badge-warning">In Progress</span>}
                      {cap.status === 'Awaiting Validation' && <span className="badge-info">Awaiting Validation</span>}
                      {cap.status === 'Closed' && <span className="badge-success">Closed & Verified</span>}
                      {cap.status === 'Overdue' && <span className="badge-chip-danger">Overdue</span>}
                      {(!cap.status || (cap.status !== 'Open' && cap.status !== 'In Progress' && cap.status !== 'Awaiting Validation' && cap.status !== 'Closed' && cap.status !== 'Overdue')) && <span className="badge-warning">{cap.status || 'Open'}</span>}
                    </td>
                    <td>
                      <div className="flex gap-[0.4rem] flex-wrap">
                        {cap.status === 'Open' && (
                          <button onClick={() => handleUpdateStatus(cap.findingNumber || cap.id, 'In Progress')} className="btn-secondary px-[0.65rem] py-[0.3rem] text-[0.75rem]">
                            Start Work
                          </button>
                        )}
                        {cap.status === 'In Progress' && (
                          <button onClick={() => setProofModalCap(cap)} className="btn-primary px-[0.65rem] py-[0.3rem] text-[0.75rem]">
                            <Paperclip size={12} /> Submit Remediation Proof
                          </button>
                        )}
                        {cap.status === 'Awaiting Validation' && (
                          <>
                            <button onClick={() => setRetestModalCap(cap)} className="btn-success px-[0.65rem] py-[0.3rem] text-[0.75rem]">
                              <FileCheck size={12} /> Auditor Retest Sign-Off
                            </button>
                            <button onClick={() => handleUpdateStatus(cap.findingNumber || cap.id, 'In Progress')} className="btn-secondary px-[0.65rem] py-[0.3rem] text-[0.75rem]">
                              Γ£ò Reject & Rework
                            </button>
                          </>
                        )}
                        {(cap.status === 'Open' || cap.status === 'Overdue' || isOverdue) && (
                          <button onClick={() => handleSendReminder(cap)} className="btn-secondary px-[0.65rem] py-[0.3rem] text-[0.75rem] text-[#fca5a5]">
                            <Send size={12} /> Escalate
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              }))}
            </tbody>
          </table>
</TopScrollTableWrapper>
        </div>
      </div>

      {/* Proof Submission Modal */}
      {proofModalCap && (
        <div className="modal-overlay">
          <div className="modal-content max-w-[520px]">
            <div className="flex justify-between items-center mb-5">
              <h3 className="m-0 text-[1.15rem] font-extrabold">Submit Remediation Proof (Action Owner)</h3>
              <button onClick={() => setProofModalCap(null)} className="bg-transparent border-none text-[var(--text-muted)] cursor-pointer">Γ£ò</button>
            </div>
            <form onSubmit={handleSubmitProof} className="flex flex-col gap-4">
              <div>
                <label className="block text-[0.8rem] font-bold mb-[0.4rem] text-[var(--text-secondary)]">Finding Reference</label>
                <input type="text" disabled value={`${proofModalCap.findingNumber} - ${proofModalCap.observation}`} className="form-input opacity-80" />
              </div>
              <div>
                <label className="block text-[0.8rem] font-bold mb-[0.4rem] text-[var(--text-secondary)]">Action Owner Remediation Summary</label>
                <textarea 
                  required 
                  rows={3} 
                  value={remediationProofNote} 
                  onChange={e => setRemediationProofNote(e.target.value)} 
                  className="form-input" 
                  placeholder="Describe control changes, software patch deployed, or procedural update implemented..." 
                />
              </div>
              <div>
                <label className="block text-[0.8rem] font-bold mb-[0.4rem] text-[var(--text-secondary)]">Attach Evidence Document / System Screenshot</label>
                <input type="file" className="form-input p-[0.4rem]" />
              </div>
              <div className="flex justify-end gap-[0.85rem] mt-4">
                <button type="button" onClick={() => setProofModalCap(null)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Submit to Auditor for Retesting</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Auditor Verification Sign-Off Modal */}
      {retestModalCap && (
        <div className="modal-overlay">
          <div className="modal-content max-w-[540px]">
            <div className="flex justify-between items-center mb-5">
              <h3 className="m-0 text-[1.15rem] font-extrabold text-[#10B981]">Auditor Verification & Retest Sign-Off</h3>
              <button onClick={() => setRetestModalCap(null)} className="bg-transparent border-none text-[var(--text-muted)] cursor-pointer">Γ£ò</button>
            </div>
            <form onSubmit={handlePassRetest} className="flex flex-col gap-4">
              <div>
                <label className="block text-[0.8rem] font-bold mb-[0.4rem] text-[var(--text-secondary)]">Finding Reference</label>
                <input type="text" disabled value={`${retestModalCap.findingNumber} - ${retestModalCap.observation}`} className="form-input opacity-80" />
              </div>
              <div>
                <label className="block text-[0.8rem] font-bold mb-[0.4rem] text-[var(--text-secondary)]">Auditor Verification & Retesting Evaluation</label>
                <textarea 
                  required 
                  rows={3} 
                  value={auditorVerificationNote} 
                  onChange={e => setAuditorVerificationNote(e.target.value)} 
                  className="form-input" 
                  placeholder="Detail auditor retesting steps performed, sample verified, and confirmation of control effectiveness..." 
                />
              </div>
              <div className="bg-emerald-500/10 border border-emerald-500/30 p-[0.8rem] rounded-md text-[0.78rem] text-[#34d399]">
                Γ£ô Submitting this sign-off will permanently close Finding {retestModalCap.findingNumber} and log an immutable audit log entry.
              </div>
              <div className="flex justify-end gap-[0.85rem] mt-2">
                <button type="button" onClick={() => setRetestModalCap(null)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-success">Γ£ô Sign-Off & Close Finding</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActionTracking;
