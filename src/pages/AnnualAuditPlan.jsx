import React, { useContext, useState } from 'react';
import { AuditContext } from '../context/AuditContext';
import { Calendar, Plus, CheckCircle, Clock, AlertTriangle, FileText, Download, Sliders, Search, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AuditDataUpload from '../components/AuditDataUpload';

const AnnualAuditPlan = () => {
  const { auditPlans, saveAuditPlan, businessUnits, currency, addNotification } = useContext(AuditContext);
  const navigate = useNavigate();

  const [filterDept, setFilterDept] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New & Edit Plan State
  const [editingPlanId, setEditingPlanId] = useState(null);
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

  const totalEstHours = auditPlans.reduce((acc, curr) => acc + (curr.plannedHours || curr.estimatedHours || 0), 0);
  const totalActHours = auditPlans.reduce((acc, curr) => acc + (curr.actualHours || 0), 0);
  const totalBudget = auditPlans.reduce((acc, curr) => acc + (curr.budget || 0), 0);

  const filteredPlans = auditPlans.filter(p => {
    const matchesDept = filterDept === 'All' || p.department === filterDept;
    const matchesStatus = filterStatus === 'All' || p.status === filterStatus;
    const term = searchTerm.toLowerCase();
    const matchesSearch = (p.auditName || p.title || '').toLowerCase().includes(term) || (p.leadAuditor || '').toLowerCase().includes(term);
    return matchesDept && matchesStatus && matchesSearch;
  });

  const handleStartEdit = (plan) => {
    setEditingPlanId(plan.id);
    setAuditName(plan.auditName || plan.title || '');
    setDepartment(plan.department || plan.businessUnit || 'Operations');
    setRiskRating(plan.riskRating || plan.priority || 'High');
    setFrequency(plan.frequency || 'Quarterly');
    setEstimatedHours(plan.plannedHours || plan.estimatedHours || plan.budgetHours || 300);
    setLeadAuditor(plan.leadAuditor || plan.owner || 'Senior Auditor');
    setPlannedStartDate(plan.startDate || plan.plannedStartDate || '2026-08-01');
    setPlannedEndDate(plan.endDate || plan.plannedEndDate || '2026-09-30');
    setBudget(plan.budget !== undefined && !isNaN(plan.budget) ? plan.budget : 15.0);
    setIsModalOpen(true);
  };

  const handleCreatePlan = (e) => {
    e.preventDefault();
    if (!auditName) return;
    
    if (editingPlanId) {
      const existingPlan = auditPlans.find(p => p.id === editingPlanId);
      if (existingPlan) {
        saveAuditPlan({
          ...existingPlan,
          auditName,
          department,
          riskRating,
          frequency,
          estimatedHours: parseInt(estimatedHours, 10),
          leadAuditor,
          plannedStartDate,
          plannedEndDate,
          budget: parseFloat(budget),
          isExisting: true
        });
        addNotification('Audit Plan Updated', `Audit Plan "${auditName}" successfully updated.`, 'success');
      }
    } else {
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
      addNotification('Audit Plan Created', `New plan "${auditName}" added to the 2026 Program.`, 'success');
    }
    
    setIsModalOpen(false);
    setAuditName('');
    setEditingPlanId(null);
  };

  const handleCaeApprove = (id) => {
    const plan = auditPlans.find(p => p.id === id);
    if (plan) {
      saveAuditPlan({ ...plan, status: 'CAE Approved', isExisting: true });
      addNotification('CAE Sign-Off Complete', `Audit Plan "${plan.auditName}" signed off by Chief Audit Executive. Pending Board Audit Committee approval.`, 'info');
    }
  };

  const handleBacApprove = (id) => {
    const plan = auditPlans.find(p => p.id === id);
    if (plan) {
      saveAuditPlan({ ...plan, status: 'BAC Approved', isExisting: true });
      addNotification('BAC Final Approval', `Audit Plan "${plan.auditName}" ratified and approved by ZPC Board Audit Committee.`, 'success');
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
          <h1 className="module-title">Annual Audit Plan</h1>
          <p className="module-subtitle">
            Replacing static Excel spreadsheets with a live, risk-weighted annual audit engagement schedule and budget tracker.
          </p>
        </div>
        <div className="header-actions">
          <AuditDataUpload targetModule="plans" buttonText="Batch Plans Ingestion" />
          <button onClick={() => navigate('/risk-scoring')} className="btn-secondary">
            <Sliders size={16} />
            <span>Risk-Based Prioritization Engine</span>
          </button>
          <button onClick={() => { setEditingPlanId(null); setAuditName(''); setIsModalOpen(true); }} className="btn-primary bg-[#C81E1E]">
            <Plus size={16} />
            <span>Create Annual Audit Plan</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid grid grid-cols-4 gap-[1.25rem] mb-[2rem]">
        <div className="glass-card bg-slate-900/85 p-[1.4rem]">
          <span className="card-title-sm">Annual Plan Completion %</span>
          <div className="flex items-baseline gap-[0.6rem] mt-[0.4rem]">
            <span className={`card-metric text-[2.2rem] ${completionPct >= 50 ? 'text-[#10B981]' : 'text-[#F59E0B]'}`}>
              {completionPct}%
            </span>
            <span className="text-[0.82rem] text-[var(--text-muted)]">({completedCount} / {totalPlans} audits)</span>
          </div>
          <div className="progress-container mt-[0.8rem]">
            <div className={`progress-fill ${completionPct >= 50 ? 'emerald' : 'amber'}`} style={{ width: `${completionPct}%` }} />
          </div>
        </div>

        <div className="glass-card bg-slate-900/85 p-[1.4rem]">
          <span className="card-title-sm">Total Planned vs Actual Hours</span>
          <div className="flex items-baseline gap-[0.6rem] mt-[0.4rem]">
            <span className="card-metric text-[2rem] text-[#3B82F6]">
              {totalActHours.toLocaleString()}
            </span>
            <span className="text-[0.82rem] text-[var(--text-muted)]">/ {totalEstHours.toLocaleString()} hrs</span>
          </div>
          <span className="text-[0.78rem] text-[var(--text-dim)] mt-[0.8rem] block">
            Variance: {(totalActHours - totalEstHours).toLocaleString()} hours
          </span>
        </div>

        <div className="glass-card bg-slate-900/85 p-[1.4rem]">
          <span className="card-title-sm">Total Audit Budget ({currency})</span>
          <div className="flex items-baseline gap-[0.6rem] mt-[0.4rem]">
            <span className="card-metric text-[2.2rem] text-[#fda4af]">
              {currency === 'NGN' ? `₦${totalBudget.toFixed(1)}M` : `$${(totalBudget * 0.65).toFixed(1)}K`}
            </span>
          </div>
          <span className="text-[0.78rem] text-[var(--text-dim)] mt-[0.8rem] block">
            Allocated across 12 ZPC Business Units
          </span>
        </div>

        <div className="glass-card bg-slate-900/85 p-[1.4rem]">
          <span className="card-title-sm">Active Engagements Status</span>
          <div className="flex items-center gap-[1.2rem] mt-[0.8rem]">
            <div>
              <span className="tabular-nums text-[1.5rem] font-[800] text-[#3B82F6]">{inProgressCount}</span>
              <span className="text-[0.75rem] text-[var(--text-muted)] block">In Progress</span>
            </div>
            <div>
              <span className="tabular-nums text-[1.5rem] font-[800] text-[#F59E0B]">{auditPlans.filter(p => p.status === 'Approved').length}</span>
              <span className="text-[0.75rem] text-[var(--text-muted)] block">Approved</span>
            </div>
            <div>
              <span className="tabular-nums text-[1.5rem] font-[800] text-[#EF4444]">{auditPlans.filter(p => p.status === 'Draft').length}</span>
              <span className="text-[0.75rem] text-[var(--text-muted)] block">Drafts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Old Filter Bar removed */}

      {/* Annual Plan Table */}
      <div className="glass-card bg-slate-900/85">
        <div className="section-header-bar">
          <div>
            <h3 className="section-title">Comprehensive Statutory & Internal Audit Plan</h3>
            <p className="section-subtitle">Risk-weighted schedule of audits across ZPC custodial operations</p>
          </div>
          <div className="flex gap-[0.8rem] items-center">
            <div className="relative">
              <Search size={16} className="absolute left-[12px] top-[10px] text-[var(--text-muted)]" />
              <input type="text" placeholder="Search Plans..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="form-input pl-[2.2rem] w-[220px]" />
            </div>
            <div className="relative">
              <button onClick={() => setShowFilter(!showFilter)} className="btn-secondary px-[0.8rem] py-[0.5rem]">
                <Filter size={16} /> Filter
              </button>
              {showFilter && (
                <div className="absolute right-0 top-[110%] bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[6px] p-[0.8rem] z-10 min-w-[220px] shadow-[0_4px_12px_rgba(0,0,0,0.2)]">
                  <label className="block text-[0.75rem] font-[600] mb-[0.4rem]">By Department</label>
                  <select value={filterDept} onChange={e => setFilterDept(e.target.value)} className="form-select w-full mb-[0.8rem]">
                    <option value="All">All Departments</option>
                    {businessUnits.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}
                  </select>
                  <label className="block text-[0.75rem] font-[600] mb-[0.4rem]">By Status</label>
                  <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="form-select w-full">
                    <option value="All">All Statuses</option>
                    <option value="Completed">Completed</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Approved">Approved</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
              )}
            </div>
          </div>
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
              {filteredPlans.length === 0 ? (
                <tr>
                  <td colSpan="11" className="text-center p-[2rem]">No matching items found</td>
                </tr>
              ) : (
              filteredPlans.map(plan => {
                const rating = plan.riskRating || plan.priority || 'High';
                const hrs = plan.plannedHours || plan.estimatedHours || plan.budgetHours || 180;
                const timeline = (plan.startDate || plan.plannedStartDate) ? `${plan.startDate || plan.plannedStartDate} ➔ ${plan.endDate || plan.plannedEndDate}` : plan.plannedQuarter || 'Q2 2026';
                const bdg = plan.budget !== undefined && !isNaN(plan.budget) ? plan.budget : 18;
                return (
                  <tr key={plan.id}>
                    <td className="tabular-nums font-[800] text-[#fda4af]">{plan.id}</td>
                    <td className="font-[700] max-w-[280px]">{plan.auditName || plan.title || 'Risk-Based Assurance Review'}</td>
                    <td>{plan.department || plan.businessUnit || 'Operations & Custody'}</td>
                    <td>
                      {rating === 'Critical' && <span className="badge-danger">Critical</span>}
                      {rating === 'High' && <span className="badge-warning">High</span>}
                      {rating === 'Medium' && <span className="badge-info">Medium</span>}
                      {(!rating || rating === 'Low') && <span className="badge-success">{rating || 'Low'}</span>}
                    </td>
                    <td className="tabular-nums">{plan.frequency || 'Annual'}</td>
                    <td className="tabular-nums font-[700]">{hrs} hrs</td>
                    <td className="text-[0.84rem]">{plan.leadAuditor || plan.owner || 'Lead Senior Auditor'}</td>
                    <td className="tabular-nums text-[0.78rem] text-[var(--text-muted)]">
                      {timeline}
                    </td>
                    <td className="tabular-nums font-[700] text-[#34d399]">
                      {currency === 'NGN' ? `₦${bdg}M` : `$${(bdg * 0.65).toFixed(1)}K`}
                    </td>
                    <td>
                      {plan.status === 'Completed' && <span className="badge-success">Completed</span>}
                      {(plan.status === 'In Progress' || plan.status === 'Active') && <span className="badge-info">In Progress</span>}
                      {plan.status === 'BAC Approved' && <span className="badge-success bg-[rgba(16,185,129,0.2)] border border-[rgba(16,185,129,0.4)]">✓ BAC Approved</span>}
                      {plan.status === 'CAE Approved' && <span className="badge-purple">CAE Signed-Off</span>}
                      {(plan.status === 'Draft' || (!plan.status || (plan.status !== 'Completed' && plan.status !== 'In Progress' && plan.status !== 'Active' && plan.status !== 'BAC Approved' && plan.status !== 'CAE Approved'))) && <span className="badge-chip bg-[rgba(255,255,255,0.08)] text-[#cbd5e1]">{plan.status || 'Draft'}</span>}
                    </td>
                    <td>
                      <div className="flex gap-[0.4rem]">
                        <button onClick={() => handleStartEdit(plan)} className="btn-secondary px-[0.65rem] py-[0.3rem] text-[0.75rem] text-[#60A5FA]">
                          Edit
                        </button>
                        {(plan.status === 'Draft' || !plan.status) && (
                          <button onClick={() => handleCaeApprove(plan.id)} className="btn-primary bg-[#C81E1E] px-[0.65rem] py-[0.3rem] text-[0.75rem] !bg-[rgba(139,92,246,0.2)] !text-[#C4B5FD]">
                            CAE Sign-Off
                          </button>
                        )}
                        {plan.status === 'CAE Approved' && (
                          <button onClick={() => handleBacApprove(plan.id)} className="btn-success px-[0.65rem] py-[0.3rem] text-[0.75rem]">
                            BAC Ratify
                          </button>
                        )}
                        {plan.status === 'BAC Approved' && (
                          <button onClick={() => handleStartFieldwork(plan.id)} className="btn-primary bg-[#C81E1E] px-[0.65rem] py-[0.3rem] text-[0.75rem]">
                            Launch Fieldwork
                          </button>
                        )}
                        <button onClick={() => navigate('/engagements', { state: { auditPlanRef: plan.id } })} className="btn-secondary px-[0.65rem] py-[0.3rem] text-[0.75rem]">
                          View Engagement
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              }))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Plan Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content max-w-[620px]">
            <div className="flex justify-between items-center mb-[1.4rem]">
              <h3 className="m-0 text-[1.25rem] font-[800]">{editingPlanId ? 'Edit Annual Audit Plan' : 'Create Annual Audit Plan Entry'}</h3>
              <button onClick={() => { setIsModalOpen(false); setEditingPlanId(null); }} className="bg-transparent border-none text-[var(--text-muted)] cursor-pointer">✕</button>
            </div>
            <form onSubmit={handleCreatePlan} className="flex flex-col gap-[1rem]">
              <div>
                <label className="block text-[0.8rem] font-[700] mb-[0.4rem] text-[var(--text-secondary)]">Audit Engagement Name</label>
                <input type="text" required placeholder="e.g. Q4 Custody Fee Revenue & Billing Reconciliation Audit" value={auditName} onChange={e => setAuditName(e.target.value)} className="form-input" />
              </div>
              <div className="grid grid-cols-2 gap-[1rem]">
                <div>
                  <label className="block text-[0.8rem] font-[700] mb-[0.4rem] text-[var(--text-secondary)]">Department</label>
                  <select value={department} onChange={e => setDepartment(e.target.value)} className="form-select">
                    {businessUnits.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[0.8rem] font-[700] mb-[0.4rem] text-[var(--text-secondary)]">Inherent Risk Rating</label>
                  <select value={riskRating} onChange={e => setRiskRating(e.target.value)} className="form-select">
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-[1rem]">
                <div>
                  <label className="block text-[0.8rem] font-[700] mb-[0.4rem] text-[var(--text-secondary)]">Frequency</label>
                  <select value={frequency} onChange={e => setFrequency(e.target.value)} className="form-select">
                    <option value="Monthly">Monthly</option>
                    <option value="Quarterly">Quarterly</option>
                    <option value="Semi-Annually">Semi-Annually</option>
                    <option value="Annually">Annually</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[0.8rem] font-[700] mb-[0.4rem] text-[var(--text-secondary)]">Est. Hours</label>
                  <input type="number" value={estimatedHours} onChange={e => setEstimatedHours(e.target.value)} className="form-input" />
                </div>
                <div>
                  <label className="block text-[0.8rem] font-[700] mb-[0.4rem] text-[var(--text-secondary)]">Budget (₦ Millions)</label>
                  <input type="number" step="0.1" value={budget} onChange={e => setBudget(e.target.value)} className="form-input" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-[1rem]">
                <div>
                  <label className="block text-[0.8rem] font-[700] mb-[0.4rem] text-[var(--text-secondary)]">Lead Auditor</label>
                  <input type="text" value={leadAuditor} onChange={e => setLeadAuditor(e.target.value)} className="form-input" />
                </div>
                <div>
                  <label className="block text-[0.8rem] font-[700] mb-[0.4rem] text-[var(--text-secondary)]">Start Date</label>
                  <input type="date" value={plannedStartDate} onChange={e => setPlannedStartDate(e.target.value)} className="form-input" />
                </div>
                <div>
                  <label className="block text-[0.8rem] font-[700] mb-[0.4rem] text-[var(--text-secondary)]">End Date</label>
                  <input type="date" value={plannedEndDate} onChange={e => setPlannedEndDate(e.target.value)} className="form-input" />
                </div>
              </div>
              <div className="flex justify-end gap-[0.85rem] mt-[1rem]">
                <button type="button" onClick={() => { setIsModalOpen(false); setEditingPlanId(null); }} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary bg-[#C81E1E]">{editingPlanId ? 'Save Changes' : 'Add to Annual Plan'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnnualAuditPlan;
