import React, { useContext, useState } from 'react';
import { AuditContext } from '../context/AuditContext';
import { Calendar, Plus, CheckCircle, Clock, AlertTriangle, FileText, Download, Sliders } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AnnualAuditPlan = () => {
  const { auditPlans, saveAuditPlan, businessUnits, currency, addNotification } = useContext(AuditContext);
  const navigate = useNavigate();

  const [filterDept, setFilterDept] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Plan State
  const [auditName, setAuditName] = useState('');
  const [department, setDepartment] = useState('Operations');
  const [riskRating, setRiskRating] = useState('High');
  const [frequency, setFrequency] = useState('Quarterly');
  const [estimatedHours, setEstimatedHours] = useState(300);
  const [leadAuditor, setLeadAuditor] = useState('Senior Auditor');
  const [plannedStartDate, setPlannedStartDate] = useState('2026-08-01');
  const [plannedEndDate, setPlannedEndDate] = useState('2026-09-30');
  const [budget, setBudget] = useState(15.0);

  // Calculations
  const totalPlans = auditPlans.length;
  const completedCount = auditPlans.filter(p => p.status === 'Completed').length;
  const inProgressCount = auditPlans.filter(p => p.status === 'In Progress').length;
  const completionPct = totalPlans > 0 ? Math.round((completedCount / totalPlans) * 100) : 0;

  const totalEstHours = auditPlans.reduce((acc, curr) => acc + (curr.estimatedHours || 0), 0);
  const totalActHours = auditPlans.reduce((acc, curr) => acc + (curr.actualHours || 0), 0);
  const totalBudget = auditPlans.reduce((acc, curr) => acc + (curr.budget || 0), 0);

  const filteredPlans = auditPlans.filter(p => {
    const matchesDept = filterDept === 'All' || p.department === filterDept;
    const matchesStatus = filterStatus === 'All' || p.status === filterStatus;
    return matchesDept && matchesStatus;
  });

  const handleCreatePlan = (e) => {
    e.preventDefault();
    if (!auditName) return;
    saveAuditPlan({
      auditName,
      department,
      riskRating,
      frequency,
      estimatedHours: parseInt(estimatedHours, 10),
      leadAuditor,
      teamMembers: ['Senior IT Auditor', 'QA Auditor'],
      plannedStartDate,
      plannedEndDate,
      budget: parseFloat(budget),
      status: 'Draft'
    });
    setIsModalOpen(false);
    setAuditName('');
  };

  const handleApprovePlan = (id) => {
    const plan = auditPlans.find(p => p.id === id);
    if (plan) {
      saveAuditPlan({ ...plan, status: 'Approved', isExisting: true });
      addNotification('Plan Approved', `Audit Plan "${plan.auditName}" approved by Chief Audit Executive.`, 'success');
    }
  };

  const handleStartFieldwork = (id) => {
    const plan = auditPlans.find(p => p.id === id);
    if (plan) {
      saveAuditPlan({ ...plan, status: 'In Progress', isExisting: true });
      addNotification('Fieldwork Commenced', `Audit engagement "${plan.auditName}" transitioned to In Progress.`, 'info');
    }
  };

  return (
    <div className="page-container">
      <div className="module-header">
        <div>
          <h1 className="module-title">Annual Audit Plan (2026 Audit Program)</h1>
          <p className="module-subtitle">
            Replacing static Excel spreadsheets with a live, risk-weighted annual audit engagement schedule and budget tracker.
          </p>
        </div>
        <div className="header-actions">
          <button onClick={() => navigate('/erm-sync')} className="btn-secondary" style={{ borderColor: '#10B981', color: '#6ee7b7' }} title="Download templates and batch import CSV annual engagements">
            <span>📦 Templates & Bulk CSV Upload</span>
          </button>
          <button onClick={() => navigate('/risk-scoring')} className="btn-secondary">
            <Sliders size={16} />
            <span>Risk-Based Prioritization Engine</span>
          </button>
          <button onClick={() => setIsModalOpen(true)} className="btn-primary">
            <Plus size={16} />
            <span>Create Annual Audit Plan</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem', marginBottom: '2rem' }}>
        <div className="glass-card" style={{ padding: '1.4rem' }}>
          <span className="card-title-sm">Annual Plan Completion %</span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.6rem', marginTop: '0.4rem' }}>
            <span className="card-metric" style={{ fontSize: '2.2rem', color: completionPct >= 50 ? '#10B981' : '#F59E0B' }}>
              {completionPct}%
            </span>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>({completedCount} / {totalPlans} audits)</span>
          </div>
          <div className="progress-container" style={{ marginTop: '0.8rem' }}>
            <div className={`progress-fill ${completionPct >= 50 ? 'emerald' : 'amber'}`} style={{ width: `${completionPct}%` }} />
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.4rem' }}>
          <span className="card-title-sm">Total Planned vs Actual Hours</span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.6rem', marginTop: '0.4rem' }}>
            <span className="card-metric" style={{ fontSize: '2rem', color: '#3B82F6' }}>
              {totalActHours.toLocaleString()}
            </span>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>/ {totalEstHours.toLocaleString()} hrs</span>
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '0.8rem', display: 'block' }}>
            Variance: {(totalActHours - totalEstHours).toLocaleString()} hours
          </span>
        </div>

        <div className="glass-card" style={{ padding: '1.4rem' }}>
          <span className="card-title-sm">Total Audit Budget ({currency})</span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.6rem', marginTop: '0.4rem' }}>
            <span className="card-metric" style={{ fontSize: '2.2rem', color: '#fda4af' }}>
              {currency === 'NGN' ? `₦${totalBudget.toFixed(1)}M` : `$${(totalBudget * 0.65).toFixed(1)}K`}
            </span>
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '0.8rem', display: 'block' }}>
            Allocated across 12 ZPC Business Units
          </span>
        </div>

        <div className="glass-card" style={{ padding: '1.4rem' }}>
          <span className="card-title-sm">Active Engagements Status</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', marginTop: '0.8rem' }}>
            <div>
              <span className="tabular-nums" style={{ fontSize: '1.5rem', fontWeight: 800, color: '#3B82F6' }}>{inProgressCount}</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>In Progress</span>
            </div>
            <div>
              <span className="tabular-nums" style={{ fontSize: '1.5rem', fontWeight: 800, color: '#F59E0B' }}>{auditPlans.filter(p => p.status === 'Approved').length}</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Approved</span>
            </div>
            <div>
              <span className="tabular-nums" style={{ fontSize: '1.5rem', fontWeight: 800, color: '#EF4444' }}>{auditPlans.filter(p => p.status === 'Draft').length}</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Drafts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Filter Department:</span>
          <select value={filterDept} onChange={e => setFilterDept(e.target.value)} className="form-select" style={{ width: '220px', padding: '0.5rem 0.8rem' }}>
            <option value="All">All Departments</option>
            {businessUnits.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Filter Status:</span>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="form-select" style={{ width: '180px', padding: '0.5rem 0.8rem' }}>
            <option value="All">All Statuses</option>
            <option value="Completed">Completed</option>
            <option value="In Progress">In Progress</option>
            <option value="Approved">Approved</option>
            <option value="Draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Annual Plan Table */}
      <div className="glass-card">
        <div className="section-header-bar">
          <div>
            <h3 className="section-title">2026 Comprehensive Statutory & Internal Audit Plan</h3>
            <p className="section-subtitle">Risk-weighted schedule of audits across ZPC custodial operations</p>
          </div>
          <span className="badge-chip-info">100% PenCom & IIA Standard Aligned</span>
        </div>

        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Audit ID</th>
                <th>Audit Engagement Name</th>
                <th>Department</th>
                <th>Risk Rating</th>
                <th>Frequency</th>
                <th>Est. Hours</th>
                <th>Lead Auditor</th>
                <th>Timeline</th>
                <th>Budget ({currency})</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPlans.map(plan => (
                <tr key={plan.id}>
                  <td className="tabular-nums" style={{ fontWeight: 800, color: '#fda4af' }}>{plan.id}</td>
                  <td style={{ fontWeight: 700, maxWidth: '280px' }}>{plan.auditName}</td>
                  <td>{plan.department}</td>
                  <td>
                    {plan.riskRating === 'Critical' && <span className="badge-danger">Critical</span>}
                    {plan.riskRating === 'High' && <span className="badge-warning">High</span>}
                    {plan.riskRating === 'Medium' && <span className="badge-info">Medium</span>}
                    {plan.riskRating === 'Low' && <span className="badge-success">Low</span>}
                  </td>
                  <td className="tabular-nums">{plan.frequency}</td>
                  <td className="tabular-nums" style={{ fontWeight: 700 }}>{plan.estimatedHours} hrs</td>
                  <td style={{ fontSize: '0.84rem' }}>{plan.leadAuditor}</td>
                  <td className="tabular-nums" style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {plan.plannedStartDate} ➔ {plan.plannedEndDate}
                  </td>
                  <td className="tabular-nums" style={{ fontWeight: 700, color: '#34d399' }}>
                    {currency === 'NGN' ? `₦${plan.budget}M` : `$${(plan.budget * 0.65).toFixed(1)}K`}
                  </td>
                  <td>
                    {plan.status === 'Completed' && <span className="badge-success">Completed</span>}
                    {plan.status === 'In Progress' && <span className="badge-info">In Progress</span>}
                    {plan.status === 'Approved' && <span className="badge-purple">Approved</span>}
                    {plan.status === 'Draft' && <span className="badge-chip" style={{ background: 'rgba(255,255,255,0.08)', color: '#cbd5e1' }}>Draft</span>}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      {plan.status === 'Draft' && (
                        <button onClick={() => handleApprovePlan(plan.id)} className="btn-success" style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem' }}>
                          Approve
                        </button>
                      )}
                      {plan.status === 'Approved' && (
                        <button onClick={() => handleStartFieldwork(plan.id)} className="btn-primary" style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem' }}>
                          Launch Fieldwork
                        </button>
                      )}
                      <button onClick={() => navigate('/engagements')} className="btn-secondary" style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem' }}>
                        Manage ➔
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Plan Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '620px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.4rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>Create Annual Audit Plan Entry</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>✕</button>
            </div>
            <form onSubmit={handleCreatePlan} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>Audit Engagement Name</label>
                <input type="text" required placeholder="e.g. Q4 Custody Fee Revenue & Billing Reconciliation Audit" value={auditName} onChange={e => setAuditName(e.target.value)} className="form-input" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>Department</label>
                  <select value={department} onChange={e => setDepartment(e.target.value)} className="form-select">
                    {businessUnits.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>Inherent Risk Rating</label>
                  <select value={riskRating} onChange={e => setRiskRating(e.target.value)} className="form-select">
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>Frequency</label>
                  <select value={frequency} onChange={e => setFrequency(e.target.value)} className="form-select">
                    <option value="Monthly">Monthly</option>
                    <option value="Quarterly">Quarterly</option>
                    <option value="Semi-Annually">Semi-Annually</option>
                    <option value="Annually">Annually</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>Est. Hours</label>
                  <input type="number" value={estimatedHours} onChange={e => setEstimatedHours(e.target.value)} className="form-input" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>Budget (₦ Millions)</label>
                  <input type="number" step="0.1" value={budget} onChange={e => setBudget(e.target.value)} className="form-input" />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>Lead Auditor</label>
                  <input type="text" value={leadAuditor} onChange={e => setLeadAuditor(e.target.value)} className="form-input" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>Start Date</label>
                  <input type="date" value={plannedStartDate} onChange={e => setPlannedStartDate(e.target.value)} className="form-input" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>End Date</label>
                  <input type="date" value={plannedEndDate} onChange={e => setPlannedEndDate(e.target.value)} className="form-input" />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.85rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Add to Annual Plan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnnualAuditPlan;
