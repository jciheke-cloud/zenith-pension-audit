import React, { useContext, useState } from 'react';
import { AuditContext } from '../context/AuditContext';
import { AlertOctagon, Plus, ShieldAlert, RefreshCw, CheckCircle, Search, Filter, Sliders, Award, Edit2, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AuditDataUpload from '../components/AuditDataUpload';
import ConfirmModal from '../components/ConfirmModal';

const FindingsManagement = () => {
  const { findings, saveFinding, setFindings, businessUnits, addNotification, checkRbacPermission, verifyRbacOrAlert } = useContext(AuditContext);
  const navigate = useNavigate();

  const [activeView, setActiveView] = useState('matrix'); // 'matrix' or 'list'
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBu, setFilterBu] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFindingId, setEditingFindingId] = useState(null);
  const [confirmData, setConfirmData] = useState({ isOpen: false, onConfirm: null, title: '', message: '' });

  // New & Edit Finding Form State
  const [bu, setBu] = useState('Custody Operations');
  const [observation, setObservation] = useState('');
  const [rootCause, setRootCause] = useState('Process Failure / Lack of Automated Control');
  const [criteria, setCriteria] = useState('PenCom Guidelines Section 5.2 on 24-hr Cash Sweeping');
  const [riskImpact, setRiskImpact] = useState('Potential financial loss or SLA penalty from regulatory authority');
  const [likelihood, setLikelihood] = useState(8);
  const [impact, setImpact] = useState(9);
  const [mgmtResponse, setMgmtResponse] = useState('Management agrees with observation. Automated sweep patch scheduled for deployment.');
  const [actionOwner, setActionOwner] = useState('Head of Custody Operations');
  const [targetDate, setTargetDate] = useState('2026-08-30');

  const residualCalc = likelihood * impact; // out of 100
  let calculatedTier = 'Low';
  if (residualCalc >= 80) calculatedTier = 'Critical';
  else if (residualCalc >= 60) calculatedTier = 'High';
  else if (residualCalc >= 30) calculatedTier = 'Medium';

  const handleStartEditFinding = (f) => {
    if (!verifyRbacOrAlert('edit', 'findings')) return;
    setEditingFindingId(f.id);
    setBu(f.businessUnit || 'Custody Operations');
    setObservation(f.observation || '');
    setRootCause(f.rootCause || 'Process Failure / Lack of Automated Control');
    setCriteria(f.criteria || 'PenCom Guidelines Section 5.2 on 24-hr Cash Sweeping');
    setRiskImpact(f.riskImpact || 'Potential financial loss or SLA penalty from regulatory authority');
    setLikelihood(f.likelihood || 8);
    setImpact(f.impact || 9);
    setMgmtResponse(f.managementResponse || '');
    setActionOwner(f.actionOwner || 'Head of Custody Operations');
    setTargetDate(f.targetDate || '2026-08-30');
    setIsModalOpen(true);
  };

  const handleDeleteFinding = (fId, fNum) => {
    if (!verifyRbacOrAlert('delete', 'findings')) return;
    setConfirmData({
      isOpen: true,
      title: 'Delete Finding',
      message: `Are you sure you want to delete finding "${fNum}"?`,
      onConfirm: () => {
        setFindings(prev => prev.filter(item => item.id !== fId));
        addNotification('Finding Deleted', `Finding "${fNum}" removed successfully.`, 'info');
      }
    });
  };

  const filteredFindings = findings.filter(f => {
    const matchesSearch = f.observation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          f.findingNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          f.actionOwner?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBu = filterBu === 'All' || f.businessUnit === filterBu;
    const matchesPriority = filterPriority === 'All' || f.priority === filterPriority;
    return matchesSearch && matchesBu && matchesPriority;
  });

  const handleCreateFinding = (e) => {
    e.preventDefault();
    if (!observation) return;
    if (editingFindingId) {
      if (!verifyRbacOrAlert('edit', 'findings')) return;
      const f = findings.find(x => x.id === editingFindingId);
      saveFinding({
        ...f,
        isExisting: true,
        businessUnit: bu,
        observation,
        rootCause,
        criteria,
        riskImpact,
        likelihood: parseInt(likelihood, 10),
        impact: parseInt(impact, 10),
        managementResponse: mgmtResponse,
        actionOwner,
        targetDate,
      });
      addNotification('Finding Updated', `Finding updated successfully.`, 'success');
    } else {
      saveFinding({
        businessUnit: bu,
        observation,
        rootCause,
        criteria,
        riskImpact,
        likelihood: parseInt(likelihood, 10),
        impact: parseInt(impact, 10),
        managementResponse: mgmtResponse,
        actionOwner,
        targetDate,
        status: 'Open'
      });
    }
    setIsModalOpen(false);
    setEditingFindingId(null);
    setObservation('');
  };

  // Automated Audit Rating logic across current findings
  const totalFindings = findings.length;
  const criticalCount = findings.filter(f => f.priority === 'Critical').length;
  const highCount = findings.filter(f => f.priority === 'High').length;
  const repeatCount = findings.filter(f => f.isRepeat).length;

  let overallRating = 'Satisfactory';
  let ratingColor = '#10B981';
  let ratingDesc = 'Controls are generally effective with minor procedural enhancements required.';
  if (criticalCount >= 2 || (criticalCount === 1 && highCount >= 3) || repeatCount >= 3) {
    overallRating = 'Unsatisfactory';
    ratingColor = '#EF4444';
    ratingDesc = 'Significant internal control deficiencies, recurring breakdowns, or critical regulatory breaches identified.';
  } else if (criticalCount === 1 || highCount >= 2) {
    overallRating = 'Needs Improvement';
    ratingColor = '#F59E0B';
    ratingDesc = 'Controls require strengthening in high-exposure areas to mitigate moderate operational risk.';
  }

  // Generate 10x10 Matrix Grid points
  const renderMatrixGrid = () => {
    const gridRows = [];
    for (let l = 10; l >= 1; l--) {
      const cols = [];
      for (let i = 1; i <= 10; i++) {
        const score = l * i;
        let cellBg = 'rgba(16, 185, 129, 0.18)';
        let cellColor = '#34d399';
        if (score >= 80) { cellBg = 'rgba(239, 68, 68, 0.45)'; cellColor = '#fca5a5'; }
        else if (score >= 60) { cellBg = 'rgba(245, 158, 11, 0.4)'; cellColor = '#fde047'; }
        else if (score >= 30) { cellBg = 'rgba(59, 130, 246, 0.28)'; cellColor = '#93c5fd'; }

        // Find matching findings for this exact likelihood / impact coordinate
        const matched = findings.filter(f => f.likelihood === l && f.impact === i);

        cols.push(
          <div
            key={`${l}-${i}`}
            className={`border border-white/10 h-[38px] flex items-center justify-center relative rounded ${matched.length > 0 ? 'cursor-pointer' : 'cursor-default'}`}
            style={{
              background: cellBg,
            }}
            title={`Likelihood ${l} × Impact ${i} = Score ${score}${matched.length > 0 ? ` (${matched.length} findings)` : ''}`}
          >
            <span className={`text-[0.68rem] font-extrabold ${matched.length > 0 ? 'text-white opacity-100' : 'opacity-60'}`} style={{ color: matched.length > 0 ? undefined : cellColor }}>
              {score}
            </span>
            {matched.length > 0 && (
              <div className="absolute -top-[5px] -right-[5px] bg-[#C81E1E] text-white w-[18px] h-[18px] rounded-full text-[0.65rem] font-extrabold flex items-center justify-center shadow-[0_0_8px_#C81E1E]">
                {matched.length}
              </div>
            )}
          </div>
        );
      }
      gridRows.push(
        <div key={l} className="grid grid-cols-[40px_repeat(10,1fr)] gap-1 items-center">
          <span className="text-[0.75rem] font-extrabold text-[var(--text-muted)] text-right pr-2">L{l}</span>
          {cols}
        </div>
      );
    }
    return gridRows;
  };

  return (
    <div className="page-container">
      <div className="module-header">
        <div>
          <h1 className="module-title">Findings Management & 10×10 Risk Methodology Matrix</h1>
          <p className="module-subtitle">
            Evaluating audit observations on the institutional 10×10 Risk Matrix (`Likelihood 1-10 × Impact 1-10 = Residual Risk 1-100`) and monitoring repeat occurrences.
          </p>
        </div>
        <div className="header-actions">
          <AuditDataUpload targetModule="findings" buttonText="Batch Findings Ingestion" />
          <button onClick={() => navigate('/action-tracker')} className="btn-secondary">
            <span>View CAP Tracker ({findings.filter(f => f.status !== 'Closed').length} Open) ➔</span>
          </button>
          <button onClick={() => setIsModalOpen(true)} className="btn-primary bg-[#C81E1E] hover:bg-red-800 text-white">
            <Plus size={16} />
            <span>Log New Audit Finding (10×10 Matrix)</span>
          </button>
        </div>
      </div>

      {/* View Switcher Pills */}
      <div className="nav-tab-container flex-wrap">
        <button
          onClick={() => setActiveView('matrix')}
          className={`nav-tab-btn flex items-center gap-[0.6rem] ${activeView === 'matrix' ? 'active' : ''}`}
          title="Switch to the 10×10 Likelihood vs. Impact visual heatmap grid and institutional rating simulator."
        >
          <Sliders size={16} />
          <span className="font-semibold">10×10 Heat Map Matrix Simulator</span>
        </button>
        <button
          onClick={() => setActiveView('list')}
          className={`nav-tab-btn flex items-center gap-[0.6rem] ${activeView === 'list' ? 'active' : ''}`}
          title={`Switch to the detailed tabular findings ledger. Shows all ${findings.length} logged observations including ${repeatCount} repeat findings.`}
        >
          <AlertOctagon size={16} />
          <span className="font-semibold">Audit Findings Register</span>
          <span className="badge-chip bg-[rgba(255,255,255,0.12)] text-[0.72rem] py-[0.15rem] px-2 rounded-xl">
            {findings.length} Total / {repeatCount} Repeat
          </span>
        </button>
      </div>

      {/* Automated Audit Rating Banner */}
      <div className="glass-card bg-slate-900/85 mb-7 bg-gradient-to-br from-slate-900/90 to-slate-800/80" style={{ borderLeft: `6px solid ${ratingColor}` }}>
        <div className="flex-between flex-wrap gap-4">
          <div className="flex items-center gap-[1.2rem]">
            <Award size={40} color={ratingColor} />
            <div>
              <span className="text-[0.75rem] font-extrabold text-[var(--text-muted)] uppercase tracking-[0.05em]">
                System Automated Overall Audit Rating Generator
              </span>
              <h3 className="my-[0.2rem] text-2xl font-extrabold" style={{ color: ratingColor }}>
                {overallRating} Rating
              </h3>
              <p className="m-0 text-[0.86rem] text-[var(--text-secondary)] max-w-[650px]">
                {ratingDesc}
              </p>
            </div>
          </div>
          <div className="flex gap-6">
            <div className="text-right">
              <span className="text-[0.75rem] text-[var(--text-muted)] block">Critical Tier (80-100)</span>
              <span className="tabular-nums text-[1.4rem] font-extrabold text-[#EF4444]">{criticalCount}</span>
            </div>
            <div className="text-right">
              <span className="text-[0.75rem] text-[var(--text-muted)] block">High Tier (60-79)</span>
              <span className="tabular-nums text-[1.4rem] font-extrabold text-[#F59E0B]">{highCount}</span>
            </div>
            <div className="text-right">
              <span className="text-[0.75rem] text-[var(--text-muted)] block">Repeat Findings</span>
              <span className="tabular-nums text-[1.4rem] font-extrabold text-[#fcd34d]">{repeatCount}</span>
            </div>
          </div>
        </div>
      </div>

      {activeView === 'matrix' ? (
        <div className="app-grid p-0 gap-7">
          {/* Left Side: The 10x10 Grid */}
          <div className="glass-card bg-slate-900/85 col-span-8">
            <div className="section-header-bar">
              <div>
                <h3 className="section-title">The 10×10 Risk Matrix Heat Map (100 Cell Coordinate Engine)</h3>
                <p className="section-subtitle">Y-Axis: Likelihood (1-10) | X-Axis: Impact / Financial Exposure (1-10)</p>
              </div>
            </div>

            <div className="flex flex-col gap-1 pb-4">
              {renderMatrixGrid()}
              {/* X Axis Labels */}
              <div className="grid grid-cols-[40px_repeat(10,1fr)] gap-1 mt-1">
                <span />
                {[1,2,3,4,5,6,7,8,9,10].map(i => (
                  <span key={i} className="text-[0.75rem] font-extrabold text-[var(--text-muted)] text-center">I{i}</span>
                ))}
              </div>
            </div>

            <div className="flex justify-around pt-4 border-t border-[var(--border-color)] text-[0.78rem] font-bold">
              <div className="flex items-center gap-[0.4rem] text-[#fca5a5]">
                <span className="w-[12px] h-[12px] bg-[rgba(239,68,68,0.6)] rounded-sm" />
                <span>Critical Priority (Score 80-100)</span>
              </div>
              <div className="flex items-center gap-[0.4rem] text-[#fde047]">
                <span className="w-[12px] h-[12px] bg-[rgba(245,158,11,0.6)] rounded-sm" />
                <span>High Priority (Score 60-79)</span>
              </div>
              <div className="flex items-center gap-[0.4rem] text-[#93c5fd]">
                <span className="w-[12px] h-[12px] bg-[rgba(59,130,246,0.5)] rounded-sm" />
                <span>Medium Priority (Score 30-59)</span>
              </div>
              <div className="flex items-center gap-[0.4rem] text-[#34d399]">
                <span className="w-[12px] h-[12px] bg-[rgba(16,185,129,0.4)] rounded-sm" />
                <span>Low Priority (Score 1-29)</span>
              </div>
            </div>
          </div>

          {/* Right Side: Quick Calculator & Repeat Intelligence */}
          <div className="glass-card bg-slate-900/85 col-span-4 flex flex-col justify-between">
            <div>
              <h3 className="section-title mb-[0.8rem]">10×10 Live Risk Calculator</h3>
              <p className="text-[0.8rem] text-[var(--text-secondary)] mb-[1.2rem]">
                Simulate any finding coordinate to test residual risk thresholds and automatic CAP SLA deadlines.
              </p>

              <div className="bg-[rgba(18,26,41,0.65)] p-[1.2rem] rounded-[var(--radius-md)] mb-[1.2rem] border border-[var(--border-color)] border-t-[rgba(148,163,184,0.38)]">
                <div className="flex justify-between mb-[0.8rem]">
                  <span className="font-bold text-[0.85rem]">Likelihood Factor (1-10)</span>
                  <span className="tabular-nums font-extrabold text-[#fda4af]">{likelihood}</span>
                </div>
                <input type="range" min="1" max="10" value={likelihood} onChange={e => setLikelihood(parseInt(e.target.value, 10))} className="w-full accent-[#C81E1E]" />

                <div className="flex justify-between my-[0.8rem] mt-4">
                  <span className="font-bold text-[0.85rem]">Impact / Financial Exposure (1-10)</span>
                  <span className="tabular-nums font-extrabold text-[#fcd34d]">{impact}</span>
                </div>
                <input type="range" min="1" max="10" value={impact} onChange={e => setImpact(parseInt(e.target.value, 10))} className="w-full accent-[#F59E0B]" />

                <div className="mt-[1.4rem] pt-4 border-t border-[var(--border-color)] flex justify-between items-center">
                  <span className="font-extrabold text-white">Calculated Residual Risk:</span>
                  <span className="tabular-nums text-[1.5rem] font-extrabold" style={{ color: calculatedTier === 'Critical' ? '#EF4444' : calculatedTier === 'High' ? '#F59E0B' : '#10B981' }}>
                    {residualCalc} / 100 ({calculatedTier})
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[rgba(200,30,30,0.15)] to-[rgba(153,27,27,0.25)] border border-[rgba(200,30,30,0.4)] p-[1.1rem] rounded-[var(--radius-md)]">
              <div className="flex items-center gap-2 mb-[0.4rem]">
                <ShieldAlert size={18} color="#EF4444" />
                <h4 className="m-0 text-[0.88rem] font-extrabold text-white">Repeat Finding Alert Engine</h4>
              </div>
              <p className="m-0 text-[0.78rem] text-[#fda4af] leading-[1.5]">
                Whenever a new finding is logged with observation terms matching previous cycles, RiskINTEGRA Audit™ flags it as a repeat occurrence and escalates residual risk by +15%.
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* List View */
        <div className="glass-card bg-slate-900/85">
          <div className="filter-bar bg-transparent p-0 pb-4 border-b border-[var(--border-color)] mb-[1.2rem] flex flex-col gap-4">
            <div className="flex gap-2 w-full">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-[12px] top-[12px] text-[var(--text-muted)]" />
                <input type="text" placeholder="Search finding number, observation detail, or action owner..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="form-input pl-[2.4rem]" />
              </div>
              <button onClick={() => setShowFilters(!showFilters)} className="btn-secondary p-[0.55rem]">
                <Filter size={16} />
              </button>
            </div>
            {showFilters && (
              <div className="flex gap-4 w-full flex-wrap">
                <select value={filterBu} onChange={e => setFilterBu(e.target.value)} className="form-select w-[220px]">
                  <option value="All">All Business Units</option>
                  {businessUnits.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}
                </select>
                <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)} className="form-select w-[180px]">
                  <option value="All">All Priorities</option>
                  <option value="Critical">Critical (80+)</option>
                  <option value="High">High (60-79)</option>
                  <option value="Medium">Medium (30-59)</option>
                  <option value="Low">Low (&lt;30)</option>
                </select>
              </div>
            )}
          </div>

          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Finding Ref #</th>
                  <th>Observation & Root Cause Detail</th>
                  <th>Business Unit</th>
                  <th>10×10 Score (L×I)</th>
                  <th>Priority Tier</th>
                  <th>Repeat Flag</th>
                  <th>Regulatory Breach</th>
                  <th>Management Action Owner</th>
                  <th>Target Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFindings.length === 0 ? (
                  <tr>
                    <td colSpan="11" className="text-center p-8 text-[var(--text-muted)]">No matching items found</td>
                  </tr>
                ) : filteredFindings.map(f => (
                  <tr key={f.findingNumber || f.id}>
                    <td className="tabular-nums font-extrabold text-[#fda4af]">{f.findingNumber || f.id || 'FND-001'}</td>
                    <td className="max-w-[340px]">
                      <div className="font-bold text-white mb-[0.2rem]">{f.observation || f.title || 'Control Observation'}</div>
                      <div className="text-[0.75rem] text-[var(--text-muted)]">Cause: {f.rootCause || 'Identified during substantive testing'}</div>
                    </td>
                    <td>{f.businessUnit || f.department || 'Operations'}</td>
                    <td className="tabular-nums font-extrabold text-[0.95rem]">
                      L{f.likelihood || 5} × I{f.impact || 6} = <span style={{ color: (f.residualRisk || 50) >= 80 ? '#EF4444' : (f.residualRisk || 50) >= 60 ? '#F59E0B' : '#10B981' }}>{f.residualRisk || (f.likelihood || 5) * (f.impact || 6)}</span>
                    </td>
                    <td>
                      {f.priority === 'Critical' && <span className="badge-danger">🔴 Critical</span>}
                      {f.priority === 'High' && <span className="badge-warning">🟡 High</span>}
                      {f.priority === 'Medium' && <span className="badge-info">🔵 Medium</span>}
                      {(!f.priority || f.priority === 'Low') && <span className="badge-success">🟢 {f.priority || 'Low'}</span>}
                    </td>
                    <td>
                      {f.isRepeat ? (
                        <span className="badge-chip-danger" title={f.repeatCycle}>⚠️ REPEAT ISSUE</span>
                      ) : (
                        <span className="badge-chip bg-[rgba(255,255,255,0.06)]">New</span>
                      )}
                    </td>
                    <td>
                      {f.regulatoryBreach ? (
                        <span className="badge-chip-danger bg-[rgba(239,68,68,0.2)] text-[#fca5a5]">⚖️ {f.regulatoryBreach}</span>
                      ) : (
                        <span className="text-[0.75rem] text-[var(--text-muted)]">None</span>
                      )}
                    </td>
                    <td className="text-[0.84rem]">{f.actionOwner || f.owner || 'Head of Department / ERM Liaison'}</td>
                    <td className="tabular-nums text-[0.82rem]">{f.targetDate || f.dueDate || '2026-09-30'}</td>
                    <td>
                      {f.status === 'Open' && <span className="badge-danger">Open</span>}
                      {f.status === 'In Progress' && <span className="badge-warning">In Progress</span>}
                      {f.status === 'Awaiting Validation' && <span className="badge-info">Awaiting Validation</span>}
                      {f.status === 'Closed' && <span className="badge-success">Closed</span>}
                      {(!f.status || (f.status !== 'Open' && f.status !== 'In Progress' && f.status !== 'Awaiting Validation' && f.status !== 'Closed')) && <span className="badge-warning">{f.status || 'Open'}</span>}
                    </td>
                    <td>
                      <div className="flex gap-[0.4rem]">
                        <button
                          onClick={() => handleStartEditFinding(f)}
                          className={`btn-secondary px-2 py-[0.35rem] ${checkRbacPermission('edit', 'findings') ? 'bg-blue-500/15 text-blue-400' : 'bg-white/5 text-[var(--text-muted)]'}`}
                          title={checkRbacPermission('edit', 'findings') ? "Edit Finding (✏️)" : "🔒 RBAC Restricted"}
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => handleDeleteFinding(f.id, f.findingNumber || f.observation)}
                          className={`btn-secondary px-2 py-[0.35rem] ${checkRbacPermission('delete', 'findings') ? 'bg-red-500/15 text-red-400' : 'bg-white/5 text-[var(--text-muted)]'}`}
                          title={checkRbacPermission('delete', 'findings') ? "Delete Finding (🗑️)" : "🔒 RBAC Restricted"}
                        >
                          <Trash2 size={13} />
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

      {/* New / Edit Finding Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content max-w-[680px]">
            <div className="flex justify-between items-center mb-[1.4rem]">
              <h3 className="m-0 text-[1.25rem] font-extrabold">{editingFindingId ? 'Edit Audit Finding' : 'Log Audit Finding on 10×10 Risk Matrix'}</h3>
              <button onClick={() => { setIsModalOpen(false); setEditingFindingId(null); }} className="bg-transparent border-none text-[var(--text-muted)] cursor-pointer">✕</button>
            </div>
            <form onSubmit={handleCreateFinding} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[0.8rem] font-bold mb-[0.4rem] text-[var(--text-secondary)]">Function / Area (Dynamic)</label>
                  <input list="buList" type="text" value={bu} onChange={e => setBu(e.target.value)} className="form-input" required placeholder="e.g. Settlement Operations" />
                  <datalist id="buList">
                    {businessUnits.map(b => <option key={b.id} value={b.name} />)}
                  </datalist>
                </div>
                <div>
                  <label className="block text-[0.8rem] font-bold mb-[0.4rem] text-[var(--text-secondary)]">Action Owner (Head of Dept)</label>
                  <input type="text" value={actionOwner} onChange={e => setActionOwner(e.target.value)} className="form-input" required />
                </div>
              </div>
              <div>
                <label className="block text-[0.8rem] font-bold mb-[0.4rem] text-[var(--text-secondary)]">Observation / Finding Headline</label>
                <input type="text" placeholder="e.g. Unreconciled Employer Pension Contribution Sweep Variance" value={observation} onChange={e => setObservation(e.target.value)} className="form-input" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[0.8rem] font-bold mb-[0.4rem] text-[var(--text-secondary)]">Root Cause Detail</label>
                  <input type="text" value={rootCause} onChange={e => setRootCause(e.target.value)} className="form-input" required />
                </div>
                <div>
                  <label className="block text-[0.8rem] font-bold mb-[0.4rem] text-[var(--text-secondary)]">Audit Criteria / SLA Reference</label>
                  <input type="text" value={criteria} onChange={e => setCriteria(e.target.value)} className="form-input" required />
                </div>
              </div>

              {/* 10x10 Matrix Sliders */}
              <div className="bg-[rgba(18,26,41,0.65)] p-[1.1rem] rounded-[var(--radius-md)] border border-[var(--border-color)] border-t-[rgba(148,163,184,0.38)]">
                <h4 className="m-0 mb-[0.8rem] text-[0.88rem] font-extrabold text-[#fda4af]">10×10 Matrix Residual Risk Calculation</h4>
                <div className="grid grid-cols-2 gap-6 items-center">
                  <div>
                    <div className="flex-between mb-[0.3rem]">
                      <span className="text-[0.8rem] font-bold">Likelihood (1-10):</span>
                      <span className="tabular-nums font-extrabold text-white">{likelihood}</span>
                    </div>
                    <input type="range" min="1" max="10" value={likelihood} onChange={e => setLikelihood(e.target.value)} className="w-full accent-[#C81E1E]" />
                  </div>
                  <div>
                    <div className="flex-between mb-[0.3rem]">
                      <span className="text-[0.8rem] font-bold">Impact (1-10):</span>
                      <span className="tabular-nums font-extrabold text-white">{impact}</span>
                    </div>
                    <input type="range" min="1" max="10" value={impact} onChange={e => setImpact(e.target.value)} className="w-full accent-[#F59E0B]" />
                  </div>
                </div>
                <div className="flex-between mt-[0.8rem] pt-[0.6rem] border-t border-white/10">
                  <span className="text-[0.85rem] font-bold">Calculated Residual Score:</span>
                  <span className="tabular-nums text-[1.25rem] font-extrabold" style={{ color: calculatedTier === 'Critical' ? '#EF4444' : calculatedTier === 'High' ? '#F59E0B' : '#10B981' }}>
                    {residualCalc}/100 ({calculatedTier} Tier)
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-[2fr_1fr] gap-4">
                <div>
                  <label className="block text-[0.8rem] font-bold mb-[0.4rem] text-[var(--text-secondary)]">Management Action Plan & Commitment</label>
                  <input type="text" value={mgmtResponse} onChange={e => setMgmtResponse(e.target.value)} className="form-input" required />
                </div>
                <div>
                  <label className="block text-[0.8rem] font-bold mb-[0.4rem] text-[var(--text-secondary)]">CAP Target Date</label>
                  <input type="date" value={targetDate} onChange={e => setTargetDate(e.target.value)} className="form-input" required />
                </div>
              </div>

              <div className="flex justify-end gap-[0.85rem] mt-4">
                <button type="button" onClick={() => { setIsModalOpen(false); setEditingFindingId(null); }} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary bg-[#C81E1E] hover:bg-red-800 text-white">{editingFindingId ? 'Save Changes & Sync ERM' : 'Save to Matrix & Sync ERM'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
      <ConfirmModal 
        isOpen={confirmData.isOpen} 
        onClose={() => setConfirmData(prev => ({ ...prev, isOpen: false }))} 
        onConfirm={confirmData.onConfirm} 
        title={confirmData.title} 
        message={confirmData.message} 
      />
    </div>
  );
};

export default FindingsManagement;
