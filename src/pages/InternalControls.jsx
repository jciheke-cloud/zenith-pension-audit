import React, { useContext, useState } from 'react';
import { AuditContext } from '../context/AuditContext';
import { ShieldCheck, Plus, CheckCircle, AlertOctagon, Sliders, Layers } from 'lucide-react';

const InternalControls = () => {
  const { controls, setControls, addNotification } = useContext(AuditContext);
  const [filterType, setFilterType] = useState('All');
  const [filterAutomated, setFilterAutomated] = useState('All');
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
    const matchesType = filterType === 'All' || c.type === filterType;
    const matchesAuto = filterAutomated === 'All' || c.automation === filterAutomated;
    return matchesType && matchesAuto;
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
    setControls(prev => [newControl, ...prev]);
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
        <div className="header-actions">
          <button onClick={() => setIsModalOpen(true)} className="btn-primary">
            <Plus size={16} />
            <span>Add Internal Control</span>
          </button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <span className="card-title-sm">Total Evaluated Controls</span>
          <span className="card-metric" style={{ fontSize: '1.8rem' }}>{controls.length}</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Across 12 Business Units</span>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <span className="card-title-sm">Preventive Controls</span>
          <span className="card-metric" style={{ fontSize: '1.8rem', color: '#10B981' }}>
            {controls.filter(c => c.type === 'Preventive').length}
          </span>
          <span style={{ fontSize: '0.75rem', color: '#34d399' }}>First line of operational defense</span>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <span className="card-title-sm">Automated Controls Ratio</span>
          <span className="card-metric" style={{ fontSize: '1.8rem', color: '#3B82F6' }}>
            {Math.round((controls.filter(c => c.automation === 'Automated').length / (controls.length || 1)) * 100)}%
          </span>
          <span style={{ fontSize: '0.75rem', color: '#93c5fd' }}>System enforced rules</span>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <span className="card-title-sm">Operating Deficiencies</span>
          <span className="card-metric" style={{ fontSize: '1.8rem', color: '#EF4444' }}>
            {controls.filter(c => c.operatingEff !== 'Effective').length}
          </span>
          <span style={{ fontSize: '0.75rem', color: '#fca5a5' }}>Controls failing field testing</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Filter Control Type:</span>
          <select value={filterType} onChange={e => setFilterType(e.target.value)} className="form-select" style={{ width: '180px' }}>
            <option value="All">All Types</option>
            <option value="Preventive">Preventive</option>
            <option value="Detective">Detective</option>
            <option value="Corrective">Corrective</option>
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Automation Level:</span>
          <select value={filterAutomated} onChange={e => setFilterAutomated(e.target.value)} className="form-select" style={{ width: '180px' }}>
            <option value="All">All Levels</option>
            <option value="Automated">Automated</option>
            <option value="Semi-Automated">Semi-Automated</option>
            <option value="Manual">Manual</option>
          </select>
        </div>
      </div>

      {/* Controls Table */}
      <div className="glass-card">
        <div className="section-header-bar">
          <div>
            <h3 className="section-title">Key Internal Controls & Field Testing Matrix</h3>
            <p className="section-subtitle">Evaluating institutional safeguards vs statutory custody expectations</p>
          </div>
        </div>

        <div className="data-table-container">
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
              {filteredControls.map(c => {
                const de = c.designEff || c.designEffectiveness || 'Effective';
                const oe = c.operatingEff || c.operatingEffectiveness || 'Effective';
                const desc = c.description || c.name || 'Core Custody Internal Control Safeguard';
                return (
                  <tr key={c.id}>
                    <td className="tabular-nums" style={{ fontWeight: 800, color: '#fda4af' }}>{c.code || c.id}</td>
                    <td style={{ fontWeight: 700, maxWidth: '360px' }}>{desc}</td>
                    <td>
                      {c.type === 'Preventive' && <span className="badge-success">Preventive</span>}
                      {c.type === 'Detective' && <span className="badge-info">Detective</span>}
                      {(!c.type || c.type === 'Corrective') && <span className="badge-warning">{c.type || 'Corrective'}</span>}
                    </td>
                    <td>
                      {c.automation === 'Automated' && <span className="badge-purple">Automated</span>}
                      {c.automation === 'Semi-Automated' && <span className="badge-chip">Semi-Automated</span>}
                      {(!c.automation || c.automation === 'Manual') && <span className="badge-chip" style={{ background: 'rgba(239,68,68,0.15)', color: '#fca5a5' }}>{c.automation || 'Manual'}</span>}
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
                    <td style={{ fontSize: '0.84rem' }}>{c.owner || 'Head of Operations'}</td>
                    <td className="tabular-nums" style={{ color: 'var(--text-muted)' }}>{c.lastTested || c.lastTestedDate || '2026-06-28'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '560px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.4rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>Add Internal Control to Register</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>✕</button>
            </div>
            <form onSubmit={handleAddControl} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>Control Code</label>
                  <input type="text" required placeholder="e.g. CTRL-OPS-05" value={code} onChange={e => setCode(e.target.value)} className="form-input" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>Control Owner</label>
                  <input type="text" required placeholder="e.g. Head of Custody" value={owner} onChange={e => setOwner(e.target.value)} className="form-input" />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>Control Activity Description</label>
                <textarea rows={3} required placeholder="Describe control activity, dual authorization rules, system checks..." value={description} onChange={e => setDescription(e.target.value)} className="form-input" style={{ width: '100%', resize: 'vertical' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>Control Type</label>
                  <select value={type} onChange={e => setType(e.target.value)} className="form-select">
                    <option value="Preventive">Preventive</option>
                    <option value="Detective">Detective</option>
                    <option value="Corrective">Corrective</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>Automation Level</label>
                  <select value={automation} onChange={e => setAutomation(e.target.value)} className="form-select">
                    <option value="Automated">Automated</option>
                    <option value="Semi-Automated">Semi-Automated</option>
                    <option value="Manual">Manual</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>Design Effectiveness (DE)</label>
                  <select value={designEff} onChange={e => setDesignEff(e.target.value)} className="form-select">
                    <option value="Effective">Effective</option>
                    <option value="Deficient">Deficient</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>Operating Effectiveness (OE)</label>
                  <select value={opEff} onChange={e => setOpEff(e.target.value)} className="form-select">
                    <option value="Effective">Effective</option>
                    <option value="Deficient">Deficient</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.85rem', marginTop: '1rem' }}>
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
