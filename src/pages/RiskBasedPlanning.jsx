import React, { useContext, useState } from 'react';
import { AuditContext } from '../context/AuditContext';
import { Sliders, RefreshCw, CheckCircle, ShieldAlert, AlertTriangle, Layers, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RiskBasedPlanning = () => {
  const { auditUniverse, scoringWeights, setScoringWeights, calculateOverallScore, getAuditPriorityLabel, addNotification } = useContext(AuditContext);
  const navigate = useNavigate();

  const [tempWeights, setTempWeights] = useState({ ...scoringWeights });
  const [filterPriority, setFilterPriority] = useState('All');

  const totalWeight = tempWeights.inherentRisk + tempWeights.financialExposure + tempWeights.regulatoryImpact +
                      tempWeights.previousFindings + tempWeights.fraudExposure + tempWeights.itDependency;

  const handleWeightChange = (factor, value) => {
    const val = parseInt(value, 10) || 0;
    setTempWeights(prev => ({ ...prev, [factor]: val }));
  };

  const applyWeights = () => {
    if (totalWeight !== 100) {
      alert('Total weights must sum strictly to 100% before applying.');
      return;
    }
    setScoringWeights(tempWeights);
    addNotification('Risk Scoring Model Updated', 'Auditable universe priorities recalculated using new factor weights.', 'success');
  };

  const resetWeights = () => {
    const defaults = {
      inherentRisk: 25,
      financialExposure: 20,
      regulatoryImpact: 20,
      previousFindings: 15,
      fraudExposure: 10,
      itDependency: 10
    };
    setTempWeights(defaults);
    setScoringWeights(defaults);
    addNotification('Weights Reset', 'Risk-Based Planning weights reset to IIA / PenCom statutory defaults.', 'info');
  };

  // Sort and filter universe by calculated score descending
  const scoredUniverse = auditUniverse.map(u => {
    const score = calculateOverallScore(u);
    const priority = getAuditPriorityLabel(score);
    return { ...u, calculatedScore: score, priority };
  }).sort((a, b) => b.calculatedScore - a.calculatedScore);

  const filteredUniverse = scoredUniverse.filter(u => {
    if (filterPriority === 'All') return true;
    return u.priority === filterPriority;
  });

  return (
    <div className="page-container">
      <div className="module-header">
        <div>
          <h1 className="module-title">Risk-Based Audit Planning & Scoring Engine</h1>
          <p className="module-subtitle">
            One of the most powerful modules in RiskINTEGRA Audit™. Every auditable unit receives a weighted 6-factor score determining audit priority.
          </p>
        </div>
        <div className="header-actions">
          <button onClick={resetWeights} className="btn-secondary">
            <RefreshCw size={16} />
            <span>Reset Default Weights</span>
          </button>
          <button onClick={applyWeights} className="btn-primary" disabled={totalWeight !== 100}>
            <Sliders size={16} />
            <span>Apply Weights ({totalWeight}%)</span>
          </button>
        </div>
      </div>

      {/* Interactive Weight Sliders Panel */}
      <div className="glass-card" style={{ marginBottom: '2rem' }}>
        <div className="section-header-bar">
          <div>
            <h3 className="section-title">Risk Factor Weighting Calibration (Must Sum to 100%)</h3>
            <p className="section-subtitle">Adjusting these weights dynamically recalculates the Overall Audit Priority for every auditable unit across ZPC</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>Total Weight Sum:</span>
            <span className={`tabular-nums ${totalWeight === 100 ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '1rem', padding: '0.35rem 0.85rem' }}>
              {totalWeight}%
            </span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginTop: '1.2rem' }}>
          <div style={{ background: 'rgba(0,0,0,0.35)', padding: '1.1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
              <span style={{ fontWeight: 700, fontSize: '0.88rem', color: '#fda4af' }}>Inherent Risk Factor</span>
              <span className="tabular-nums" style={{ fontWeight: 800, color: 'white' }}>{tempWeights.inherentRisk}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              value={tempWeights.inherentRisk}
              onChange={e => handleWeightChange('inherentRisk', e.target.value)}
              style={{ width: '100%', accentColor: '#C81E1E', cursor: 'pointer' }}
            />
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.3rem' }}>
              Core operational volatility and complexity of the process
            </span>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.35)', padding: '1.1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
              <span style={{ fontWeight: 700, fontSize: '0.88rem', color: '#fcd34d' }}>Financial Exposure</span>
              <span className="tabular-nums" style={{ fontWeight: 800, color: 'white' }}>{tempWeights.financialExposure}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              value={tempWeights.financialExposure}
              onChange={e => handleWeightChange('financialExposure', e.target.value)}
              style={{ width: '100%', accentColor: '#F59E0B', cursor: 'pointer' }}
            />
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.3rem' }}>
              Direct monetary assets handled or potential SLA penalty loss
            </span>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.35)', padding: '1.1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
              <span style={{ fontWeight: 700, fontSize: '0.88rem', color: '#60a5fa' }}>Regulatory Impact</span>
              <span className="tabular-nums" style={{ fontWeight: 800, color: 'white' }}>{tempWeights.regulatoryImpact}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              value={tempWeights.regulatoryImpact}
              onChange={e => handleWeightChange('regulatoryImpact', e.target.value)}
              style={{ width: '100%', accentColor: '#3B82F6', cursor: 'pointer' }}
            />
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.3rem' }}>
              PenCom & CBN regulatory examination scrutiny and compliance mandates
            </span>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.35)', padding: '1.1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
              <span style={{ fontWeight: 700, fontSize: '0.88rem', color: '#34d399' }}>Previous Findings</span>
              <span className="tabular-nums" style={{ fontWeight: 800, color: 'white' }}>{tempWeights.previousFindings}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              value={tempWeights.previousFindings}
              onChange={e => handleWeightChange('previousFindings', e.target.value)}
              style={{ width: '100%', accentColor: '#10B981', cursor: 'pointer' }}
            />
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.3rem' }}>
              Historical audit deficiencies and repeat audit issue frequency
            </span>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.35)', padding: '1.1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
              <span style={{ fontWeight: 700, fontSize: '0.88rem', color: '#a78bfa' }}>Fraud Exposure</span>
              <span className="tabular-nums" style={{ fontWeight: 800, color: 'white' }}>{tempWeights.fraudExposure}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              value={tempWeights.fraudExposure}
              onChange={e => handleWeightChange('fraudExposure', e.target.value)}
              style={{ width: '100%', accentColor: '#8B5CF6', cursor: 'pointer' }}
            />
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.3rem' }}>
              Susceptibility to misappropriation, collusion, or external cyber fraud
            </span>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.35)', padding: '1.1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
              <span style={{ fontWeight: 700, fontSize: '0.88rem', color: '#cbd5e1' }}>IT Dependency</span>
              <span className="tabular-nums" style={{ fontWeight: 800, color: 'white' }}>{tempWeights.itDependency}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              value={tempWeights.itDependency}
              onChange={e => handleWeightChange('itDependency', e.target.value)}
              style={{ width: '100%', accentColor: '#94a3b8', cursor: 'pointer' }}
            />
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.3rem' }}>
              Reliance on core custody systems, SWIFT gateways, and automated APIs
            </span>
          </div>
        </div>
      </div>

      {/* Filter Priority Bar */}
      <div className="filter-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Filter Calculated Priority:</span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {['All', 'High', 'Medium', 'Low'].map(p => (
              <button
                key={p}
                onClick={() => setFilterPriority(p)}
                style={{
                  padding: '0.45rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  border: filterPriority === p ? '1px solid var(--accent-primary)' : '1px solid var(--border-color)',
                  background: filterPriority === p ? 'linear-gradient(135deg, #C81E1E, #991B1B)' : 'rgba(0,0,0,0.4)',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  cursor: 'pointer'
                }}
              >
                {p === 'All' ? 'All Units' : `${p} Priority`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Scored Universe Matrix Table */}
      <div className="glass-card">
        <div className="section-header-bar">
          <div>
            <h3 className="section-title">Weighted Audit Universe Scoring Matrix</h3>
            <p className="section-subtitle">Real-time prioritized ranking of all auditable processes across Zenith Pension Custodian</p>
          </div>
          <span className="badge-chip-info">Scored on 1-10 Composite Scale</span>
        </div>

        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Process Code</th>
                <th>Auditable Process Name</th>
                <th>Department</th>
                <th>Inherent ({scoringWeights.inherentRisk}%)</th>
                <th>Financial ({scoringWeights.financialExposure}%)</th>
                <th>Regulatory ({scoringWeights.regulatoryImpact}%)</th>
                <th>Prev. Findings ({scoringWeights.previousFindings}%)</th>
                <th>Fraud ({scoringWeights.fraudExposure}%)</th>
                <th>IT Dep. ({scoringWeights.itDependency}%)</th>
                <th>Composite Score</th>
                <th>System Priority</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredUniverse.map((unit, idx) => (
                <tr key={unit.id}>
                  <td className="tabular-nums" style={{ fontWeight: 800, color: 'var(--text-muted)' }}>#{idx + 1}</td>
                  <td className="tabular-nums" style={{ fontWeight: 800, color: '#3B82F6' }}>{unit.code}</td>
                  <td style={{ fontWeight: 700, maxWidth: '240px' }}>{unit.processName}</td>
                  <td><span className="badge-chip" style={{ background: 'rgba(255,255,255,0.06)' }}>{unit.businessUnit}</span></td>
                  <td className="tabular-nums" style={{ color: unit.inherentRisk >= 8 ? '#EF4444' : 'white' }}>{unit.inherentRisk}/10</td>
                  <td className="tabular-nums" style={{ color: unit.financialExposure >= 8 ? '#F59E0B' : 'white' }}>{unit.financialExposure}/10</td>
                  <td className="tabular-nums" style={{ color: unit.regulatoryImpact >= 8 ? '#EF4444' : 'white' }}>{unit.regulatoryImpact}/10</td>
                  <td className="tabular-nums">{unit.previousFindings}/10</td>
                  <td className="tabular-nums">{unit.fraudExposure}/10</td>
                  <td className="tabular-nums">{unit.itDependency}/10</td>
                  <td className="tabular-nums" style={{ fontSize: '1.05rem', fontWeight: 800, color: unit.priority === 'High' ? '#EF4444' : unit.priority === 'Medium' ? '#F59E0B' : '#10B981' }}>
                    {unit.calculatedScore} / 10
                  </td>
                  <td>
                    {unit.priority === 'High' && <span className="badge-danger">🔴 HIGH</span>}
                    {unit.priority === 'Medium' && <span className="badge-warning">🟡 MEDIUM</span>}
                    {unit.priority === 'Low' && <span className="badge-success">🟢 LOW</span>}
                  </td>
                  <td>
                    <button onClick={() => navigate('/annual-plan')} className="btn-secondary" style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}>
                      Schedule Plan ➔
                    </button>
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

export default RiskBasedPlanning;
