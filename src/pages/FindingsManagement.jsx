import React, { useContext, useState } from 'react';
import { AuditContext } from '../context/AuditContext';
import { AlertOctagon, Plus, ShieldAlert, RefreshCw, CheckCircle, Search, Filter, Sliders, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FindingsManagement = () => {
  const { findings, saveFinding, businessUnits, addNotification } = useContext(AuditContext);
  const navigate = useNavigate();

  const [activeView, setActiveView] = useState('matrix'); // 'matrix' or 'list'
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBu, setFilterBu] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Finding Form State
  const [bu, setBu] = useState('Custody Operations');
  const [observation, setObservation] = useState('');
  const [rootCause, setRootCause] = useState('Process Failure / Lack of Automated Control');
  const [criteria, setCriteria] = useState('PenCom Guidelines Section 5.2 on 24-hr Cash Sweeping');
  const [riskImpact, setRiskImpact] = useState('Potential financial loss or SLA penalty from regulatory authority');
  const [likelihood, setLikelihood] = useState(8);
  const [impact, setImpact] = useState(9);
  const [mgmtResponse, setMgmtResponse] = useState('Management agrees with observation. Automated sweep patch scheduled for deployment.');
  const [actionOwner, setActionOwner] = useState('Dr. Ngozi Okafor (Head, Custody)');
  const [targetDate, setTargetDate] = useState('2026-08-30');

  const residualCalc = likelihood * impact; // out of 100
  let calculatedTier = 'Low';
  if (residualCalc >= 80) calculatedTier = 'Critical';
  else if (residualCalc >= 60) calculatedTier = 'High';
  else if (residualCalc >= 30) calculatedTier = 'Medium';

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
    setIsModalOpen(false);
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
            style={{
              background: cellBg,
              border: '1px solid rgba(255,255,255,0.08)',
              height: '38px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              borderRadius: '4px',
              cursor: matched.length > 0 ? 'pointer' : 'default'
            }}
            title={`Likelihood ${l} × Impact ${i} = Score ${score}${matched.length > 0 ? ` (${matched.length} findings)` : ''}`}
          >
            <span style={{ fontSize: '0.68rem', fontWeight: 800, color: matched.length > 0 ? 'white' : cellColor, opacity: matched.length > 0 ? 1 : 0.6 }}>
              {score}
            </span>
            {matched.length > 0 && (
              <div style={{
                position: 'absolute',
                top: '-5px',
                right: '-5px',
                background: '#C81E1E',
                color: 'white',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                fontSize: '0.65rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 8px #C81E1E'
              }}>
                {matched.length}
              </div>
            )}
          </div>
        );
      }
      gridRows.push(
        <div key={l} style={{ display: 'grid', gridTemplateColumns: '40px repeat(10, 1fr)', gap: '4px', alignItems: 'center' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textAlign: 'right', paddingRight: '8px' }}>L{l}</span>
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
          <button onClick={() => navigate('/action-tracker')} className="btn-secondary">
            <span>View CAP Tracker ({findings.filter(f => f.status !== 'Closed').length} Open) ➔</span>
          </button>
          <button onClick={() => setIsModalOpen(true)} className="btn-primary">
            <Plus size={16} />
            <span>Log New Audit Finding (10×10 Matrix)</span>
          </button>
        </div>
      </div>

      {/* View Switcher Pills */}
      <div className="nav-tab-container">
        <button onClick={() => setActiveView('matrix')} className={`nav-tab-btn ${activeView === 'matrix' ? 'active' : ''}`}>
          <Sliders size={16} />
          <span>10×10 Heat Map Matrix & Audit Rating Simulator</span>
        </button>
        <button onClick={() => setActiveView('list')} className={`nav-tab-btn ${activeView === 'list' ? 'active' : ''}`}>
          <AlertOctagon size={16} />
          <span>All Audit Findings Register ({findings.length} Total / {repeatCount} Repeat)</span>
        </button>
      </div>

      {/* Automated Audit Rating Banner */}
      <div className="glass-card" style={{ marginBottom: '1.75rem', borderLeft: `6px solid ${ratingColor}`, background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.8) 100%)' }}>
        <div className="flex-between" style={{ flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
            <Award size={40} color={ratingColor} />
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                System Automated Overall Audit Rating Generator
              </span>
              <h3 style={{ margin: '0.2rem 0', fontSize: '1.5rem', fontWeight: 800, color: ratingColor }}>
                {overallRating} Rating
              </h3>
              <p style={{ margin: 0, fontSize: '0.86rem', color: 'var(--text-secondary)', maxWidth: '650px' }}>
                {ratingDesc}
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Critical Tier (80-100)</span>
              <span className="tabular-nums" style={{ fontSize: '1.4rem', fontWeight: 800, color: '#EF4444' }}>{criticalCount}</span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>High Tier (60-79)</span>
              <span className="tabular-nums" style={{ fontSize: '1.4rem', fontWeight: 800, color: '#F59E0B' }}>{highCount}</span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Repeat Findings</span>
              <span className="tabular-nums" style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fcd34d' }}>{repeatCount}</span>
            </div>
          </div>
        </div>
      </div>

      {activeView === 'matrix' ? (
        <div className="app-grid" style={{ padding: 0, gap: '1.75rem' }}>
          {/* Left Side: The 10x10 Grid */}
          <div className="glass-card col-span-8">
            <div className="section-header-bar">
              <div>
                <h3 className="section-title">The 10×10 Risk Matrix Heat Map (100 Cell Coordinate Engine)</h3>
                <p className="section-subtitle">Y-Axis: Likelihood (1-10) | X-Axis: Impact / Financial Exposure (1-10)</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', paddingBottom: '1rem' }}>
              {renderMatrixGrid()}
              {/* X Axis Labels */}
              <div style={{ display: 'grid', gridTemplateColumns: '40px repeat(10, 1fr)', gap: '4px', marginTop: '4px' }}>
                <span />
                {[1,2,3,4,5,6,7,8,9,10].map(i => (
                  <span key={i} style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textAlign: 'center' }}>I{i}</span>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-around', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', fontSize: '0.78rem', fontWeight: 700 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#fca5a5' }}>
                <span style={{ width: '12px', height: '12px', background: 'rgba(239, 68, 68, 0.6)', borderRadius: '2px' }} />
                <span>Critical Priority (Score 80-100)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#fde047' }}>
                <span style={{ width: '12px', height: '12px', background: 'rgba(245, 158, 11, 0.6)', borderRadius: '2px' }} />
                <span>High Priority (Score 60-79)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#93c5fd' }}>
                <span style={{ width: '12px', height: '12px', background: 'rgba(59, 130, 246, 0.5)', borderRadius: '2px' }} />
                <span>Medium Priority (Score 30-59)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#34d399' }}>
                <span style={{ width: '12px', height: '12px', background: 'rgba(16, 185, 129, 0.4)', borderRadius: '2px' }} />
                <span>Low Priority (Score 1-29)</span>
              </div>
            </div>
          </div>

          {/* Right Side: Quick Calculator & Repeat Intelligence */}
          <div className="glass-card col-span-4" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <h3 className="section-title" style={{ marginBottom: '0.8rem' }}>10×10 Live Risk Calculator</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1.2rem' }}>
                Simulate any finding coordinate to test residual risk thresholds and automatic CAP SLA deadlines.
              </p>

              <div style={{ background: 'rgba(0,0,0,0.35)', padding: '1.2rem', borderRadius: 'var(--radius-md)', marginBottom: '1.2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>Likelihood Factor (1-10)</span>
                  <span className="tabular-nums" style={{ fontWeight: 800, color: '#fda4af' }}>{likelihood}</span>
                </div>
                <input type="range" min="1" max="10" value={likelihood} onChange={e => setLikelihood(parseInt(e.target.value, 10))} style={{ width: '100%', accentColor: '#C81E1E' }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', margin: '1rem 0 0.8rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>Impact / Financial Exposure (1-10)</span>
                  <span className="tabular-nums" style={{ fontWeight: 800, color: '#fcd34d' }}>{impact}</span>
                </div>
                <input type="range" min="1" max="10" value={impact} onChange={e => setImpact(parseInt(e.target.value, 10))} style={{ width: '100%', accentColor: '#F59E0B' }} />

                <div style={{ marginTop: '1.4rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 800, color: 'white' }}>Calculated Residual Risk:</span>
                  <span className="tabular-nums" style={{ fontSize: '1.5rem', fontWeight: 800, color: calculatedTier === 'Critical' ? '#EF4444' : calculatedTier === 'High' ? '#F59E0B' : '#10B981' }}>
                    {residualCalc} / 100 ({calculatedTier})
                  </span>
                </div>
              </div>
            </div>

            <div style={{ background: 'linear-gradient(135deg, rgba(200, 30, 30, 0.15), rgba(153, 27, 27, 0.25))', border: '1px solid rgba(200, 30, 30, 0.4)', padding: '1.1rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                <ShieldAlert size={18} color="#EF4444" />
                <h4 style={{ margin: 0, fontSize: '0.88rem', fontWeight: 800, color: 'white' }}>Repeat Finding Alert Engine</h4>
              </div>
              <p style={{ margin: 0, fontSize: '0.78rem', color: '#fda4af', lineHeight: '1.5' }}>
                Whenever a new finding is logged with observation terms matching previous cycles, RiskINTEGRA Audit™ flags it as a repeat occurrence and escalates residual risk by +15%.
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* List View */
        <div className="glass-card">
          <div className="filter-bar" style={{ background: 'transparent', padding: '0 0 1rem', borderBottom: '1px solid var(--border-color)', marginBottom: '1.2rem' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
              <input type="text" placeholder="Search finding number, observation detail, or action owner..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="form-input" style={{ paddingLeft: '2.4rem' }} />
            </div>
            <select value={filterBu} onChange={e => setFilterBu(e.target.value)} className="form-select" style={{ width: '220px' }}>
              <option value="All">All Business Units</option>
              {businessUnits.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}
            </select>
            <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)} className="form-select" style={{ width: '180px' }}>
              <option value="All">All Priorities</option>
              <option value="Critical">Critical (80+)</option>
              <option value="High">High (60-79)</option>
              <option value="Medium">Medium (30-59)</option>
              <option value="Low">Low (&lt;30)</option>
            </select>
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
                  <th>Management Action Owner</th>
                  <th>Target Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredFindings.map(f => (
                  <tr key={f.findingNumber}>
                    <td className="tabular-nums" style={{ fontWeight: 800, color: '#fda4af' }}>{f.findingNumber}</td>
                    <td style={{ maxWidth: '340px' }}>
                      <div style={{ fontWeight: 700, color: 'white', marginBottom: '0.2rem' }}>{f.observation}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Cause: {f.rootCause}</div>
                    </td>
                    <td>{f.businessUnit}</td>
                    <td className="tabular-nums" style={{ fontWeight: 800, fontSize: '0.95rem' }}>
                      L{f.likelihood} × I{f.impact} = <span style={{ color: f.residualRisk >= 80 ? '#EF4444' : f.residualRisk >= 60 ? '#F59E0B' : '#10B981' }}>{f.residualRisk}</span>
                    </td>
                    <td>
                      {f.priority === 'Critical' && <span className="badge-danger">🔴 Critical</span>}
                      {f.priority === 'High' && <span className="badge-warning">🟡 High</span>}
                      {f.priority === 'Medium' && <span className="badge-info">🔵 Medium</span>}
                      {f.priority === 'Low' && <span className="badge-success">🟢 Low</span>}
                    </td>
                    <td>
                      {f.isRepeat ? (
                        <span className="badge-chip-danger" title={f.repeatCycle}>⚠️ REPEAT ISSUE</span>
                      ) : (
                        <span className="badge-chip" style={{ background: 'rgba(255,255,255,0.06)' }}>New</span>
                      )}
                    </td>
                    <td style={{ fontSize: '0.84rem' }}>{f.actionOwner}</td>
                    <td className="tabular-nums" style={{ fontSize: '0.82rem' }}>{f.targetDate}</td>
                    <td>
                      {f.status === 'Open' && <span className="badge-danger">Open</span>}
                      {f.status === 'In Progress' && <span className="badge-warning">In Progress</span>}
                      {f.status === 'Awaiting Validation' && <span className="badge-info">Awaiting Validation</span>}
                      {f.status === 'Closed' && <span className="badge-success">Closed</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* New Finding Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '680px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.4rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>Log Audit Finding on 10×10 Risk Matrix</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>✕</button>
            </div>
            <form onSubmit={handleCreateFinding} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>Business Unit</label>
                  <select value={bu} onChange={e => setBu(e.target.value)} className="form-select">
                    {businessUnits.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>Action Owner (Head of Dept)</label>
                  <input type="text" value={actionOwner} onChange={e => setActionOwner(e.target.value)} className="form-input" required />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>Observation / Finding Headline</label>
                <input type="text" placeholder="e.g. Unreconciled Employer Pension Contribution Sweep Variance" value={observation} onChange={e => setObservation(e.target.value)} className="form-input" required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>Root Cause Detail</label>
                  <input type="text" value={rootCause} onChange={e => setRootCause(e.target.value)} className="form-input" required />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>Audit Criteria / SLA Reference</label>
                  <input type="text" value={criteria} onChange={e => setCriteria(e.target.value)} className="form-input" required />
                </div>
              </div>

              {/* 10x10 Matrix Sliders */}
              <div style={{ background: 'rgba(0,0,0,0.35)', padding: '1.1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <h4 style={{ margin: '0 0 0.8rem', fontSize: '0.88rem', fontWeight: 800, color: '#fda4af' }}>10×10 Matrix Residual Risk Calculation</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', alignItems: 'center' }}>
                  <div>
                    <div className="flex-between" style={{ marginBottom: '0.3rem' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>Likelihood (1-10):</span>
                      <span className="tabular-nums" style={{ fontWeight: 800, color: 'white' }}>{likelihood}</span>
                    </div>
                    <input type="range" min="1" max="10" value={likelihood} onChange={e => setLikelihood(e.target.value)} style={{ width: '100%', accentColor: '#C81E1E' }} />
                  </div>
                  <div>
                    <div className="flex-between" style={{ marginBottom: '0.3rem' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>Impact (1-10):</span>
                      <span className="tabular-nums" style={{ fontWeight: 800, color: 'white' }}>{impact}</span>
                    </div>
                    <input type="range" min="1" max="10" value={impact} onChange={e => setImpact(e.target.value)} style={{ width: '100%', accentColor: '#F59E0B' }} />
                  </div>
                </div>
                <div className="flex-between" style={{ marginTop: '0.8rem', paddingTop: '0.6rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>Calculated Residual Score:</span>
                  <span className="tabular-nums" style={{ fontSize: '1.25rem', fontWeight: 800, color: calculatedTier === 'Critical' ? '#EF4444' : calculatedTier === 'High' ? '#F59E0B' : '#10B981' }}>
                    {residualCalc}/100 ({calculatedTier} Tier)
                  </span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>Management Action Plan & Commitment</label>
                  <input type="text" value={mgmtResponse} onChange={e => setMgmtResponse(e.target.value)} className="form-input" required />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>CAP Target Date</label>
                  <input type="date" value={targetDate} onChange={e => setTargetDate(e.target.value)} className="form-input" required />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.85rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Save to Matrix & Sync ERM</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FindingsManagement;
