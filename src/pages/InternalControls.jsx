import React, { useContext, useState } from 'react';
import { AuditContext } from '../context/AuditContext';
import { ShieldCheck, Plus, CheckCircle, AlertOctagon, Sliders, Layers, Search, Filter } from 'lucide-react';
import AuditDataUpload from '../components/AuditDataUpload';
import TopScrollTableWrapper from '../components/TopScrollTableWrapper';

const InternalControls = () => {
  const { setControls, addControl, addNotification } = useContext(AuditContext);
  const { data: controls = [] } = useControls();
  const [filterType, setFilterType] = useState('All');
  const [filterAutomated, setFilterAutomated] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Control Form
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('Preventive');
  const [automation, setAutomation] = useState('Automated');
  const [designEff, setDesignEff] = useState('Effective');
  const [opEff, setOpEff] = useState('Effective');
  const [owner, setOwner] = useState('Operations Team');

  const filteredControls = controls.filter(c => {
    const query = searchTerm.toLowerCase();
    const desc = (c.description || c.name || '').toLowerCase();
    const code = (c.code || c.id || '').toLowerCase();
    const owner = (c.owner || '').toLowerCase();
    
    const matchesSearch = desc.includes(query) || code.includes(query) || owner.includes(query);
    const matchesType = filterType === 'All' || c.type === filterType;
    const matchesAuto = filterAutomated === 'All' || c.automation === filterAutomated;
    return matchesSearch && matchesType && matchesAuto;
  });

  const handleAddControl = (e) => {
    e.preventDefault();
    if (!code || !description) return;
    const newControl = {
      id: `ctrl-${Date.now()}`,
      code: code.toUpperCase(),
      description,
      type,
      automation,
      designEff,
      operatingEff: opEff,
      owner,
      lastTested: new Date().toISOString().split('T')[0]
    };
    addControl(newControl);
    addNotification('Control Logged', `Internal control ${newControl.code} added to testing register.`, 'success');
    setIsModalOpen(false);
    setCode('');
    setDescription('');
  };

  return (
    <div className="page-container">
      <div className="module-header">
        <div>
          <h1 className="module-title">Internal Controls Assessment Register</h1>
          <p className="module-subtitle">
            Evaluating preventive, detective, and corrective controls across Design Effectiveness (DE) and Operating Effectiveness (OE).
          </p>
        </div>
        <div className="header-actions flex gap-3 items-center">
          <AuditDataUpload targetModule="controls" buttonText="Batch Ingest Controls" />
          <button onClick={() => setIsModalOpen(true)} className="btn-primary">
            <Plus size={16} />
            <span>Add Internal Control</span>
          </button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="kpi-grid grid grid-cols-[repeat(auto-fit,minmax(210px,1fr))] gap-4 mb-7">
        <div className="glass-card bg-slate-900/85 p-5">
          <span className="card-title-sm">Total Evaluated Controls</span>
          <span className="card-metric text-[1.8rem]">{controls.length}</span>
          <span className="text-xs text-[var(--text-muted)]">Across 12 Business Units</span>
        </div>

        <div className="glass-card bg-slate-900/85 p-5">
          <span className="card-title-sm">Preventive Controls</span>
          <span className="card-metric text-[1.8rem] text-emerald-500">
            {controls.filter(c => c.type === 'Preventive').length}
          </span>
          <span className="text-xs text-emerald-400">First line of operational defense</span>
        </div>

        <div className="glass-card bg-slate-900/85 p-5">
          <span className="card-title-sm">Automated Controls Ratio</span>
          <span className="card-metric text-[1.8rem] text-blue-500">
            {Math.round((controls.filter(c => c.automation === 'Automated').length / (controls.length || 1)) * 100)}%
          </span>
          <span className="text-xs text-blue-300">System enforced rules</span>
        </div>

        <div className="glass-card bg-slate-900/85 p-5">
          <span className="card-title-sm">Operating Deficiencies</span>
          <span className="card-metric text-[1.8rem] text-red-500">
            {controls.filter(c => c.operatingEff !== 'Effective').length}
          </span>
          <span className="text-xs text-red-300">Controls failing field testing</span>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="filter-bar flex gap-4 items-center">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-3 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Search controls by code, description, or owner..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="form-input pl-[2.4rem] w-full"
          />
        </div>

        <div className="relative">
          <button 
            className="btn-secondary flex items-center gap-1.5" 
            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
          >
            <Filter size={16} />
            <span>Filters</span>
          </button>
          
          {showFilterDropdown && (
            <div className="absolute right-0 top-[110%] bg-[var(--bg-dark,#1e293b)] border border-[var(--border-color,rgba(255,255,255,0.1))] p-4 rounded-lg z-10 w-[220px] flex flex-col gap-4 shadow-[0_4px_15px_rgba(0,0,0,0.5)]">
              <div>
                <label className="block text-[0.82rem] mb-1">Control Type</label>
                <select value={filterType} onChange={e => setFilterType(e.target.value)} className="form-select w-full">
                  <option value="All">All Types</option>
                  <option value="Preventive">Preventive</option>
                  <option value="Detective">Detective</option>
                  <option value="Corrective">Corrective</option>
                </select>
              </div>
              <div>
                <label className="block text-[0.82rem] mb-1">Automation Level</label>
                <select value={filterAutomated} onChange={e => setFilterAutomated(e.target.value)} className="form-select w-full">
                  <option value="All">All Levels</option>
                  <option value="Automated">Automated</option>
                  <option value="Semi-Automated">Semi-Automated</option>
                  <option value="Manual">Manual</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Controls Table */}
      <div className="glass-card bg-slate-900/85">
        <div className="section-header-bar">
          <div>
            <h3 className="section-title">Key Internal Controls & Field Testing Matrix</h3>
            <p className="section-subtitle">Evaluating institutional safeguards vs statutory custody expectations</p>
          </div>
        </div>

        <div className="data-table-container">
          <TopScrollTableWrapper>
<table className="data-table">
            <thead>
              <tr>
                <th>Control Code</th>
                <th>Control Activity Description</th>
                <th>Category Type</th>
                <th>Automation Level</th>
                <th>Design Effectiveness (DE)</th>
                <th>Operating Effectiveness (OE)</th>
                <th>Control Owner</th>
                <th>Last Tested Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredControls.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center p-8">No matching items found</td>
                </tr>
              ) : filteredControls.map(c => {
                const de = c.designEff || c.designEffectiveness || 'Effective';
                const oe = c.operatingEff || c.operatingEffectiveness || 'Effective';
                const desc = c.description || c.name || 'Core Custody Internal Control Safeguard';
                return (
                  <tr key={c.id}>
                    <td className="tabular-nums font-extrabold text-rose-300">{c.code || c.id}</td>
                    <td className="font-bold max-w-[360px]">{desc}</td>
                    <td>
                      {c.type === 'Preventive' && <span className="badge-success">Preventive</span>}
                      {c.type === 'Detective' && <span className="badge-info">Detective</span>}
                      {(!c.type || c.type === 'Corrective') && <span className="badge-warning">{c.type || 'Corrective'}</span>}
                    </td>
                    <td>
                      {c.automation === 'Automated' && <span className="badge-purple">Automated</span>}
                      {c.automation === 'Semi-Automated' && <span className="badge-chip">Semi-Automated</span>}
                      {(!c.automation || c.automation === 'Manual') && <span className="badge-chip bg-red-500/15 text-red-300">{c.automation || 'Manual'}</span>}
                    </td>
                    <td>
                      {de.includes('Effective') || de === 'Adequate' ? (
                        <span className="badge-success">✓ Effective DE</span>
                      ) : (
                        <span className="badge-danger">✕ Deficient DE</span>
                      )}
                    </td>
                    <td>
                      {oe.includes('Effective') || oe === 'Adequate' ? (
                        <span className="badge-success">✓ Effective OE</span>
                      ) : (
                        <span className="badge-danger">✕ Deficient OE</span>
                      )}
                    </td>
                    <td className="text-[0.84rem]">{c.owner || 'Head of Operations'}</td>
                    <td className="tabular-nums text-[var(--text-muted)]">{c.lastTested || c.lastTestedDate || '2026-06-28'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
</TopScrollTableWrapper>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content max-w-[560px]">
            <div className="flex justify-between items-center mb-5">
              <h3 className="m-0 text-xl font-extrabold">Add Internal Control to Register</h3>
              <button onClick={() => setIsModalOpen(false)} className="bg-transparent border-none text-[var(--text-muted)] cursor-pointer">✕</button>
            </div>
            <form onSubmit={handleAddControl} className="flex flex-col gap-4">
              <div className="grid grid-cols-[1fr_2fr] gap-4">
                <div>
                  <label className="block text-sm font-bold mb-1.5 text-[var(--text-secondary)]">Control Code</label>
                  <input type="text" required placeholder="e.g. CTRL-OPS-05" value={code} onChange={e => setCode(e.target.value)} className="form-input" />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1.5 text-[var(--text-secondary)]">Control Owner</label>
                  <input type="text" required placeholder="e.g. Head of Custody" value={owner} onChange={e => setOwner(e.target.value)} className="form-input" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold mb-1.5 text-[var(--text-secondary)]">Control Activity Description</label>
                <textarea rows={3} required placeholder="Describe control activity, dual authorization rules, system checks..." value={description} onChange={e => setDescription(e.target.value)} className="form-input w-full resize-y" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-1.5 text-[var(--text-secondary)]">Control Type</label>
                  <select value={type} onChange={e => setType(e.target.value)} className="form-select">
                    <option value="Preventive">Preventive</option>
                    <option value="Detective">Detective</option>
                    <option value="Corrective">Corrective</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1.5 text-[var(--text-secondary)]">Automation Level</label>
                  <select value={automation} onChange={e => setAutomation(e.target.value)} className="form-select">
                    <option value="Automated">Automated</option>
                    <option value="Semi-Automated">Semi-Automated</option>
                    <option value="Manual">Manual</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-1.5 text-[var(--text-secondary)]">Design Effectiveness (DE)</label>
                  <select value={designEff} onChange={e => setDesignEff(e.target.value)} className="form-select">
                    <option value="Effective">Effective</option>
                    <option value="Deficient">Deficient</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1.5 text-[var(--text-secondary)]">Operating Effectiveness (OE)</label>
                  <select value={opEff} onChange={e => setOpEff(e.target.value)} className="form-select">
                    <option value="Effective">Effective</option>
                    <option value="Deficient">Deficient</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Save Control</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InternalControls;
