import React, { useContext, useState } from 'react';
import { AuditContext } from '../context/AuditContext';
import { Sliders, RefreshCw, CheckCircle, ShieldAlert, AlertTriangle, Layers, ArrowRight, Search, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AuditDataUpload from '../components/AuditDataUpload';
import TopScrollTableWrapper from '../components/TopScrollTableWrapper';

const RiskBasedPlanning = () => {
  const { scoringWeights, setScoringWeights, updateScoringWeights, calculateOverallScore, getAuditPriorityLabel, addNotification } = useContext(AuditContext);
  const { data: auditUniverse = [] } = useAuditUniverse();
  const navigate = useNavigate();

  const [tempWeights, setTempWeights] = useState({ ...scoringWeights });
  const [filterPriority, setFilterPriority] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [bannerMessage, setBannerMessage] = useState(null);

  const totalWeight = tempWeights.inherentRisk + tempWeights.financialExposure + tempWeights.regulatoryImpact +
                      tempWeights.previousFindings + tempWeights.fraudExposure + tempWeights.itDependency;

  const handleWeightChange = (factor, value) => {
    const val = parseInt(value, 10) || 0;
    setTempWeights(prev => ({ ...prev, [factor]: val }));
    setBannerMessage(null);
  };

  const applyWeights = () => {
    if (totalWeight !== 100) {
      addNotification('Invalid Weight Formulation', 'Total weights must sum strictly to 100% before applying.', 'warning');
      return;
    }
    const saver = updateScoringWeights || setScoringWeights;
    saver(tempWeights);
    setBannerMessage({ type: 'success', text: '✅ Risk Scoring Model Updated! Auditable universe priorities recalculated and saved to enterprise profile.' });
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
    const saver = updateScoringWeights || setScoringWeights;
    saver(defaults);
    setBannerMessage({ type: 'info', text: '🔄 Weights Reset to IIA / PenCom Statutory Defaults (100% total).' });
    addNotification('Weights Reset', 'Risk-Based Planning weights reset to IIA / PenCom statutory defaults.', 'info');
  };

  // Sort and filter universe by calculated score descending (using live tempWeights preview!)
  const scoredUniverse = auditUniverse.map(u => {
    const score = calculateOverallScore(u, tempWeights);
    const priority = getAuditPriorityLabel(score);
    return { ...u, calculatedScore: score, priority };
  }).sort((a, b) => b.calculatedScore - a.calculatedScore);

  const filteredUniverse = scoredUniverse.filter(u => {
    const query = searchTerm.toLowerCase();
    const name = (u.processName || u.title || '').toLowerCase();
    const code = (u.code || u.id || '').toLowerCase();
    const matchesSearch = name.includes(query) || code.includes(query);
    const matchesPriority = filterPriority === 'All' || u.priority === filterPriority;
    return matchesSearch && matchesPriority;
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
          <AuditDataUpload targetModule="universe" buttonText="Batch Import Universe" />
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

      {bannerMessage && (
        <div className={`px-5 py-4 rounded-xl mb-6 flex items-center gap-3 text-sm font-bold shadow-[0_4px_20px_rgba(0,0,0,0.3)] ${
          bannerMessage.type === 'success' 
            ? 'bg-emerald-500/15 border border-emerald-500 text-emerald-300' 
            : 'bg-sky-400/15 border border-sky-400 text-sky-300'
        }`}>
          <span>{bannerMessage.text}</span>
        </div>
      )}

      {/* Interactive Weight Sliders Panel */}
      <div className="glass-card bg-slate-900/85 mb-8">
        <div className="section-header-bar">
          <div>
            <h3 className="section-title">Risk Factor Weighting Calibration (Must Sum to 100%)</h3>
            <p className="section-subtitle">Adjusting these weights dynamically recalculates the Overall Audit Priority for every auditable unit across ZPC</p>
          </div>
          <div className="flex items-center gap-[0.6rem]">
            <span className="text-[0.85rem] font-bold text-[var(--text-muted)]">Total Weight Sum:</span>
            <span className={`tabular-nums text-base px-3 py-1 ${totalWeight === 100 ? 'badge-success' : 'badge-danger'}`}>
              {totalWeight}%
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 mt-5">
          <div className="bg-slate-900/65 p-[1.1rem] rounded-[var(--radius-md)] border border-[var(--border-color)] border-t-slate-400/40">
            <div className="flex-between" className="mb-2">
              <span className="font-bold text-[0.88rem] text-rose-300">Inherent Risk Factor</span>
              <span className="tabular-nums font-extrabold text-white">{tempWeights.inherentRisk}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              value={tempWeights.inherentRisk}
              onChange={e => handleWeightChange('inherentRisk', e.target.value)}
              className="w-full cursor-pointer accent-[#C81E1E]"
            />
            <span className="text-[0.72rem] text-[var(--text-muted)] block mt-[0.3rem]">
              Core operational volatility and complexity of the process
            </span>
          </div>

          <div className="bg-slate-900/65 p-[1.1rem] rounded-[var(--radius-md)] border border-[var(--border-color)] border-t-slate-400/40">
            <div className="flex-between" className="mb-2">
              <span className="font-bold text-[0.88rem] text-amber-300">Financial Exposure</span>
              <span className="tabular-nums font-extrabold text-white">{tempWeights.financialExposure}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              value={tempWeights.financialExposure}
              onChange={e => handleWeightChange('financialExposure', e.target.value)}
              className="w-full cursor-pointer accent-[#F59E0B]"
            />
            <span className="text-[0.72rem] text-[var(--text-muted)] block mt-[0.3rem]">
              Direct monetary assets handled or potential SLA penalty loss
            </span>
          </div>

          <div className="bg-slate-900/65 p-[1.1rem] rounded-[var(--radius-md)] border border-[var(--border-color)] border-t-slate-400/40">
            <div className="flex-between" className="mb-2">
              <span className="font-bold text-[0.88rem] text-blue-400">Regulatory Impact</span>
              <span className="tabular-nums font-extrabold text-white">{tempWeights.regulatoryImpact}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              value={tempWeights.regulatoryImpact}
              onChange={e => handleWeightChange('regulatoryImpact', e.target.value)}
              className="w-full cursor-pointer accent-[#3B82F6]"
            />
            <span className="text-[0.72rem] text-[var(--text-muted)] block mt-[0.3rem]">
              PENCOM regulatory examination scrutiny and compliance mandates
            </span>
          </div>

          <div className="bg-slate-900/65 p-[1.1rem] rounded-[var(--radius-md)] border border-[var(--border-color)] border-t-slate-400/40">
            <div className="flex-between" className="mb-2">
              <span className="font-bold text-[0.88rem] text-emerald-400">Previous Findings</span>
              <span className="tabular-nums font-extrabold text-white">{tempWeights.previousFindings}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              value={tempWeights.previousFindings}
              onChange={e => handleWeightChange('previousFindings', e.target.value)}
              className="w-full cursor-pointer accent-[#10B981]"
            />
            <span className="text-[0.72rem] text-[var(--text-muted)] block mt-[0.3rem]">
              Historical audit deficiencies and repeat audit issue frequency
            </span>
          </div>

          <div className="bg-slate-900/65 p-[1.1rem] rounded-[var(--radius-md)] border border-[var(--border-color)] border-t-slate-400/40">
            <div className="flex-between" className="mb-2">
              <span className="font-bold text-[0.88rem] text-purple-400">Fraud Exposure</span>
              <span className="tabular-nums font-extrabold text-white">{tempWeights.fraudExposure}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              value={tempWeights.fraudExposure}
              onChange={e => handleWeightChange('fraudExposure', e.target.value)}
              className="w-full cursor-pointer accent-[#8B5CF6]"
            />
            <span className="text-[0.72rem] text-[var(--text-muted)] block mt-[0.3rem]">
              Susceptibility to misappropriation, collusion, or external cyber fraud
            </span>
          </div>

          <div className="bg-slate-900/65 p-[1.1rem] rounded-[var(--radius-md)] border border-[var(--border-color)] border-t-slate-400/40">
            <div className="flex-between" className="mb-2">
              <span className="font-bold text-[0.88rem] text-slate-300">IT Dependency</span>
              <span className="tabular-nums font-extrabold text-white">{tempWeights.itDependency}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              value={tempWeights.itDependency}
              onChange={e => handleWeightChange('itDependency', e.target.value)}
              className="w-full cursor-pointer accent-[#94a3b8]"
            />
            <span className="text-[0.72rem] text-[var(--text-muted)] block mt-[0.3rem]">
              Reliance on core custody systems, SWIFT gateways, and automated APIs
            </span>
          </div>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="filter-bar" className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-3 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Search processes..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="form-input pl-[2.4rem] w-full"
          />
        </div>

        <div className="relative">
          <button 
            className="btn-secondary flex items-center gap-[0.4rem]" 
          >
            <Filter size={16} />
            <span>Filters</span>
          </button>
          
          {showFilterDropdown && (
            <div className="absolute right-0 top-[110%] bg-slate-800 border border-[var(--border-color)] p-4 rounded-lg z-10 w-[220px] flex flex-col gap-4 shadow-[0_4px_15px_rgba(0,0,0,0.5)]">
              <div>
                <label className="block text-[0.82rem] mb-[0.3rem]">Priority</label>
                <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)} className="form-select w-full">
                  <option value="All">All Priorities</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Scored Universe Matrix Table */}
      <div className="glass-card bg-slate-900/85">
        <div className="section-header-bar">
          <div>
            <h3 className="section-title">Weighted Audit Universe Scoring Matrix</h3>
            <p className="section-subtitle">Real-time prioritized ranking of all auditable processes across Zenith Pension Custodian</p>
          </div>
          
        </div>

        <div className="data-table-container">
          <TopScrollTableWrapper>
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
              {filteredUniverse.length === 0 ? (
                <tr>
                  <td colSpan="13" className="text-center p-8">No matching items found</td>
                </tr>
              ) : filteredUniverse.map((unit, idx) => {
                const norm = (val, def) => {
                  const v = val !== undefined ? val : def;
                  return v > 10 ? Math.round((v / 100) * 10) : v;
                };
                const inh = norm(unit.inherentRisk, 8);
                const fin = norm(unit.financialExposure, 7);
                const reg = norm(unit.regulatoryImpact, 8);
                const prv = norm(unit.previousFindings, 4);
                const frd = norm(unit.fraudExposure, 5);
                const itd = norm(unit.itDependency, 6);
                const prio = unit.priority || (unit.calculatedScore >= 7.5 ? 'High' : unit.calculatedScore >= 5.5 ? 'Medium' : 'Low');
                return (
                  <tr key={unit.id}>
                    <td className="tabular-nums font-extrabold text-[var(--text-muted)]">#{idx + 1}</td>
                    <td className="tabular-nums font-extrabold text-blue-500">{unit.code || unit.id || 'PROC-01'}</td>
                    <td className="font-bold max-w-[240px]">{unit.processName || unit.title || 'Core Auditable Unit Review'}</td>
                    <td><span className="badge-chip bg-white/[0.06]">{unit.businessUnit || unit.department || 'Custody & Operations'}</span></td>
                    <td className={`tabular-nums ${inh >= 8 ? 'text-red-500' : 'text-white'}`}>{inh}/10</td>
                    <td className={`tabular-nums ${fin >= 8 ? 'text-amber-500' : 'text-white'}`}>{fin}/10</td>
                    <td className={`tabular-nums ${reg >= 8 ? 'text-red-500' : 'text-white'}`}>{reg}/10</td>
                    <td className="tabular-nums">{prv}/10</td>
                    <td className="tabular-nums">{frd}/10</td>
                    <td className="tabular-nums">{itd}/10</td>
                    <td className={`tabular-nums text-[1.05rem] font-extrabold ${prio === 'High' ? 'text-red-500' : prio === 'Medium' ? 'text-amber-500' : 'text-emerald-500'}`}>
                      {unit.calculatedScore !== undefined ? unit.calculatedScore : 7.8} / 10
                    </td>
                    <td>
                      {prio === 'High' && <span className="badge-danger">🔴 HIGH</span>}
                      {prio === 'Medium' && <span className="badge-warning">🟡 MEDIUM</span>}
                      {(!prio || prio === 'Low') && <span className="badge-success">🟢 {prio || 'LOW'}</span>}
                    </td>
                    <td>
                      <button onClick={() => navigate('/annual-plan')} className="btn-secondary px-[0.65rem] py-[0.35rem] text-[0.75rem]">
                        Schedule Plan ➔
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
</TopScrollTableWrapper>
        </div>
      </div>
    </div>
  );
};

export default RiskBasedPlanning;
