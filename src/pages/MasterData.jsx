import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuditContext } from '../context/AuditContext';
import { Database, Plus, Search, Layers, ShieldCheck, Filter, Edit2, Trash2 } from 'lucide-react';
import AuditDataUpload from '../components/AuditDataUpload';

const MasterData = () => {
  const navigate = useNavigate();
  const { businessUnits, addBusinessUnit, setBusinessUnits, auditUniverse, setAuditUniverse, addNotification, checkRbacPermission, verifyRbacOrAlert } = useContext(AuditContext);
  const [activeTab, setActiveTab] = useState('bus'); // 'bus' or 'universe'
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBu, setFilterBu] = useState('All');

  // New & Edit BU Modal State
  const [isBuModalOpen, setIsBuModalOpen] = useState(false);
  const [editingBuId, setEditingBuId] = useState(null);
  const [newBuName, setNewBuName] = useState('');
  const [newBuHead, setNewBuHead] = useState('');
  const [newBuCode, setNewBuCode] = useState('');
  const [newBuRisk, setNewBuRisk] = useState('Medium');

  // New & Edit Universe Process Modal State
  const [isProcessModalOpen, setIsProcessModalOpen] = useState(false);
  const [editingProcId, setEditingProcId] = useState(null);
  const [procName, setProcName] = useState('');
  const [procBu, setProcBu] = useState('Operations');
  const [procCode, setProcCode] = useState('');
  const [procLead, setProcLead] = useState('Lead Senior Auditor');
  const [procFreq, setProcFreq] = useState('Quarterly');

  const handleStartEditBu = (bu) => {
    if (!verifyRbacOrAlert('edit', 'universe')) return;
    setEditingBuId(bu.id);
    setNewBuName(bu.name || bu.department || '');
    setNewBuHead(bu.head || bu.owner || '');
    setNewBuCode(bu.code || '');
    setNewBuRisk(bu.riskLevel || 'Medium');
    setIsBuModalOpen(true);
  };

  const handleDeleteBu = (buId, buName) => {
    if (!verifyRbacOrAlert('delete', 'universe')) return;
    if (!window.confirm(`Are you sure you want to delete Business Unit "${buName}"?`)) return;
    setBusinessUnits(prev => prev.filter(b => b.id !== buId));
    addNotification('Business Unit Deleted', `Unit "${buName}" removed from Audit Universe.`, 'info');
  };

  const handleStartEditProc = (proc) => {
    if (!verifyRbacOrAlert('edit', 'universe')) return;
    setEditingProcId(proc.id);
    setProcName(proc.processName || proc.title || '');
    setProcBu(proc.businessUnit || proc.department || 'Operations');
    setProcCode(proc.code || '');
    setProcLead(proc.leadAuditor || proc.owner || 'Lead Senior Auditor');
    setProcFreq(proc.frequency || 'Quarterly');
    setIsProcessModalOpen(true);
  };

  const handleDeleteProc = (procId, procCodeVal) => {
    if (!verifyRbacOrAlert('delete', 'universe')) return;
    if (!window.confirm(`Are you sure you want to delete auditable process "${procCodeVal}"?`)) return;
    setAuditUniverse(prev => prev.filter(p => p.id !== procId));
    addNotification('Process Deleted', `Auditable process "${procCodeVal}" removed from Master Universe.`, 'info');
  };

  const getItemBu = (item) => item.businessUnit || item.department || item.business_unit || 'Custody Operations';
  const getItemCode = (item) => item.code || item.unitId || item.unit_id || `PROC-${item.id}`;
  const getItemName = (item) => item.processName || item.process_name || item.title || item.name || 'Custody Process';
  const getItemLead = (item) => item.leadAuditor || item.lead_auditor || item.owner || 'Senior Lead Auditor';

  const filteredBus = (businessUnits || []).filter(bu => {
    const name = (bu.name || bu.department || '').toLowerCase();
    const code = (bu.code || bu.id || '').toLowerCase();
    const head = (bu.head || bu.owner || '').toLowerCase();
    const query = searchTerm.toLowerCase();
    return name.includes(query) || code.includes(query) || head.includes(query);
  });

  const filteredUniverse = (auditUniverse || []).filter(item => {
    const name = getItemName(item).toLowerCase();
    const code = getItemCode(item).toLowerCase();
    const lead = getItemLead(item).toLowerCase();
    const bu = getItemBu(item);
    const query = searchTerm.toLowerCase();
    const matchesSearch = name.includes(query) || code.includes(query) || lead.includes(query);
    const matchesBu = filterBu === 'All' || bu === filterBu || bu.includes(filterBu) || filterBu.includes(bu);
    return matchesSearch && matchesBu;
  });

  const handleCreateBu = (e) => {
    e.preventDefault();
    if (!newBuName || !newBuCode) return;
    if (editingBuId) {
      if (!verifyRbacOrAlert('edit', 'universe')) return;
      setBusinessUnits(prev => prev.map(bu => bu.id === editingBuId ? {
        ...bu,
        name: newBuName,
        head: newBuHead || 'Unassigned Lead',
        code: newBuCode.toUpperCase(),
        riskLevel: newBuRisk
      } : bu));
      addNotification('Business Unit Updated', `Business Unit "${newBuName}" updated successfully.`, 'success');
    } else {
      addBusinessUnit({
        name: newBuName,
        head: newBuHead || 'Unassigned Lead',
        code: newBuCode.toUpperCase(),
        staffCount: 15,
        riskLevel: newBuRisk
      });
    }
    setNewBuName('');
    setNewBuHead('');
    setNewBuCode('');
    setEditingBuId(null);
    setIsBuModalOpen(false);
  };

  const handleCreateProcess = (e) => {
    e.preventDefault();
    if (!procName || !procCode) return;
    if (editingProcId) {
      if (!verifyRbacOrAlert('edit', 'universe')) return;
      setAuditUniverse(prev => prev.map(item => item.id === editingProcId ? {
        ...item,
        processName: procName,
        businessUnit: procBu,
        code: procCode.toUpperCase(),
        frequency: procFreq,
        leadAuditor: procLead
      } : item));
      addNotification('Audit Universe Updated', `Auditable process "${procName}" updated successfully.`, 'success');
    } else {
      const newProc = {
        id: `au-${Date.now()}`,
        processName: procName,
        businessUnit: procBu,
        code: procCode.toUpperCase(),
        inherentRisk: 7,
        financialExposure: 7,
        regulatoryImpact: 8,
        previousFindings: 5,
        fraudExposure: 5,
        itDependency: 6,
        lastAudited: new Date().toISOString().split('T')[0],
        frequency: procFreq,
        leadAuditor: procLead
      };
      setAuditUniverse(prev => [newProc, ...prev]);
      addNotification('Audit Universe Expanded', `Auditable process "${newProc.processName}" added to Master Data foundation.`, 'success');
    }
    setProcName('');
    setProcCode('');
    setEditingProcId(null);
    setIsProcessModalOpen(false);
  };

  return (
    <div className="page-container">
      <div className="module-header">
        <div>
          <h1 className="module-title">Master Data Foundation & Audit Universe</h1>
          <p className="module-subtitle">
            The structural backbone of the Audit Management application, defining ZPC Business Units and every auditable process.
          </p>
        </div>
        <div className="header-actions">
          <AuditDataUpload targetModule="universe" buttonText="Batch Universe Ingestion" />
          {activeTab === 'bus' ? (
            <button onClick={() => setIsBuModalOpen(true)} className="btn-primary">
              <Plus size={16} />
              <span>Add Business Unit</span>
            </button>
          ) : (
            <button onClick={() => setIsProcessModalOpen(true)} className="btn-primary">
              <Plus size={16} />
              <span>Add Auditable Process</span>
            </button>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="nav-tab-container" style={{ flexWrap: 'wrap' }}>
        <button
          onClick={() => { setActiveTab('bus'); setSearchTerm(''); }}
          className={`nav-tab-btn ${activeTab === 'bus' ? 'active' : ''}`}
          style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}
          title={`Click to manage ZPC organizational structure (${businessUnits.length} Business Units registered).`}
        >
          <Database size={16} />
          <span style={{ fontWeight: 600 }}>Business Units</span>
          <span className="badge-chip" style={{ background: 'rgba(255, 255, 255, 0.12)', fontSize: '0.72rem', padding: '0.15rem 0.5rem', borderRadius: '12px' }}>
            {businessUnits.length} Units
          </span>
        </button>
        <button
          onClick={() => { setActiveTab('universe'); setSearchTerm(''); }}
          className={`nav-tab-btn ${activeTab === 'universe' ? 'active' : ''}`}
          style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}
          title={`Click to manage the auditable processes matrix (${auditUniverse.length} processes registered across all departments).`}
        >
          <Layers size={16} />
          <span style={{ fontWeight: 600 }}>Audit Universe Processes</span>
          <span className="badge-chip" style={{ background: 'rgba(255, 255, 255, 0.12)', fontSize: '0.72rem', padding: '0.15rem 0.5rem', borderRadius: '12px' }}>
            {auditUniverse.length} Processes
          </span>
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="filter-bar">
        <div style={{ position: 'relative', flex: 1, minWidth: '280px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder={activeTab === 'bus' ? 'Search BUs by name, code, head of department...' : 'Search auditable processes, code, or lead auditor...'}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '2.4rem' }}
          />
        </div>

        {activeTab === 'universe' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Filter size={16} color="var(--text-muted)" />
            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Filter Department:</span>
            <select
              value={filterBu}
              onChange={e => setFilterBu(e.target.value)}
              className="form-select"
              style={{ width: '220px', padding: '0.6rem 0.8rem' }}
            >
              <option value="All">All Business Units</option>
              {businessUnits.map(b => (
                <option key={b.id} value={b.name}>{b.name} ({b.code})</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Content Area */}
      {activeTab === 'bus' ? (
        <div className="glass-card">
          <div className="section-header-bar">
            <div>
              <h3 className="section-title">Institutional Business Units Register</h3>
              <p className="section-subtitle">The 12 primary organizational departments of Zenith Pension Custodian Limited</p>
            </div>
          </div>

          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Department / BU Name</th>
                  <th>Head of Department</th>
                  <th>Staff Count</th>
                  <th>Inherent Risk Profile</th>
                  <th>Audit Universe Coverage %</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBus.map(bu => {
                  const risk = bu.riskLevel || 'High';
                  return (
                    <tr key={bu.id}>
                      <td className="tabular-nums" style={{ fontWeight: 800, color: '#fda4af' }}>{bu.code || bu.id || 'BU-01'}</td>
                      <td style={{ fontWeight: 700, fontSize: '0.95rem' }}>{bu.name || bu.department || 'Custody & Operations Unit'}</td>
                      <td>{bu.head || bu.owner || 'Department Head / VP'}</td>
                      <td className="tabular-nums">{bu.staffCount !== undefined ? bu.staffCount : 24} Staff</td>
                      <td>
                        {risk === 'Critical' && <span className="badge-danger">Critical Risk</span>}
                        {risk === 'High' && <span className="badge-warning">High Risk</span>}
                        {risk === 'Medium' && <span className="badge-info">Medium Risk</span>}
                        {(!risk || risk === 'Low') && <span className="badge-success">{risk || 'Low'} Risk</span>}
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <div className="progress-container" style={{ width: '90px', height: '6px' }}>
                            <div
                              className={`progress-fill ${(bu.coveragePct || 85) >= 90 ? 'emerald' : (bu.coveragePct || 85) >= 80 ? 'blue' : 'amber'}`}
                              style={{ width: `${bu.coveragePct || 85}%` }}
                            />
                          </div>
                          <span className="tabular-nums" style={{ fontWeight: 700 }}>{bu.coveragePct || 85}%</span>
                        </div>
                      </td>
                      <td>
                        <span className="badge-success">Active Universe</span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button
                            onClick={() => handleStartEditBu(bu)}
                            className="btn-secondary"
                            style={{ padding: '0.35rem 0.5rem', background: checkRbacPermission('edit', 'universe') ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255, 255, 255, 0.05)', color: checkRbacPermission('edit', 'universe') ? '#60A5FA' : 'var(--text-muted)' }}
                            title={checkRbacPermission('edit', 'universe') ? "Edit Business Unit (✏️)" : "🔒 RBAC Restricted"}
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            onClick={() => handleDeleteBu(bu.id, bu.name)}
                            className="btn-secondary"
                            style={{ padding: '0.35rem 0.5rem', background: checkRbacPermission('delete', 'universe') ? 'rgba(239, 68, 68, 0.15)' : 'rgba(255, 255, 255, 0.05)', color: checkRbacPermission('delete', 'universe') ? '#F87171' : 'var(--text-muted)' }}
                            title={checkRbacPermission('delete', 'universe') ? "Delete Business Unit (🗑️)" : "🔒 RBAC Restricted"}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="glass-card">
          <div className="section-header-bar">
            <div>
              <h3 className="section-title">Complete Audit Universe Inventory</h3>
              <p className="section-subtitle">Every auditable process, control point, and risk area within ZPC</p>
            </div>
          </div>

          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Process Code</th>
                  <th>Auditable Process / Area</th>
                  <th>Business Unit</th>
                  <th>Audit Frequency</th>
                  <th>Last Audited</th>
                  <th>Assigned Lead Auditor</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUniverse.map(item => (
                  <tr key={item.id}>
                    <td className="tabular-nums" style={{ fontWeight: 800, color: '#3B82F6' }}>{getItemCode(item)}</td>
                    <td style={{ fontWeight: 700 }}>{getItemName(item)}</td>
                    <td><span className="badge-chip-purple">{getItemBu(item)}</span></td>
                    <td className="tabular-nums">{item.frequency || 'Quarterly'}</td>
                    <td className="tabular-nums" style={{ color: 'var(--text-muted)' }}>{item.lastAuditDate || item.lastAudited || '2026-03-31'}</td>
                    <td style={{ fontSize: '0.84rem' }}>{getItemLead(item)}</td>
                    <td>
                      <span className="badge-success">Auditable Unit</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button
                          onClick={() => handleStartEditProc(item)}
                          className="btn-secondary"
                          style={{ padding: '0.35rem 0.5rem', background: checkRbacPermission('edit', 'universe') ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255, 255, 255, 0.05)', color: checkRbacPermission('edit', 'universe') ? '#60A5FA' : 'var(--text-muted)' }}
                          title={checkRbacPermission('edit', 'universe') ? "Edit Auditable Process (✏️)" : "🔒 RBAC Restricted"}
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => handleDeleteProc(item.id, getItemCode(item))}
                          className="btn-secondary"
                          style={{ padding: '0.35rem 0.5rem', background: checkRbacPermission('delete', 'universe') ? 'rgba(239, 68, 68, 0.15)' : 'rgba(255, 255, 255, 0.05)', color: checkRbacPermission('delete', 'universe') ? '#F87171' : 'var(--text-muted)' }}
                          title={checkRbacPermission('delete', 'universe') ? "Delete Auditable Process (🗑️)" : "🔒 RBAC Restricted"}
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

      {/* Add / Edit BU Modal */}
      {isBuModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '520px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.4rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>{editingBuId ? 'Edit Business Unit' : 'Add New Business Unit'}</h3>
              <button onClick={() => { setIsBuModalOpen(false); setEditingBuId(null); }} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>✕</button>
            </div>
            <form onSubmit={handleCreateBu} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>BU Name</label>
                <input type="text" required placeholder="e.g. Retail Custody Operations" value={newBuName} onChange={e => setNewBuName(e.target.value)} className="form-input" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>Department Code (3-4 Chars)</label>
                <input type="text" required placeholder="e.g. RTC" value={newBuCode} onChange={e => setNewBuCode(e.target.value)} className="form-input" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>Head of Department</label>
                <input type="text" required placeholder="e.g. Lead Reviewer" value={newBuHead} onChange={e => setNewBuHead(e.target.value)} className="form-input" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>Inherent Risk Level</label>
                <select value={newBuRisk} onChange={e => setNewBuRisk(e.target.value)} className="form-select">
                  <option value="Critical">Critical Risk</option>
                  <option value="High">High Risk</option>
                  <option value="Medium">Medium Risk</option>
                  <option value="Low">Low Risk</option>
                </select>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.85rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => { setIsBuModalOpen(false); setEditingBuId(null); }} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">{editingBuId ? 'Save Changes' : 'Create Business Unit'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add / Edit Process Modal */}
      {isProcessModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '560px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.4rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>{editingProcId ? 'Edit Auditable Process' : 'Add Auditable Process to Universe'}</h3>
              <button onClick={() => { setIsProcessModalOpen(false); setEditingProcId(null); }} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>✕</button>
            </div>
            <form onSubmit={handleCreateProcess} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>Process / Auditable Unit Name</label>
                <input type="text" required placeholder="e.g. SWIFT Alliance Cloud Interface Governance" value={procName} onChange={e => setProcName(e.target.value)} className="form-input" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>Process Code</label>
                  <input type="text" required placeholder="e.g. SEC-SWF-02" value={procCode} onChange={e => setProcCode(e.target.value)} className="form-input" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>Business Unit</label>
                  <select value={procBu} onChange={e => setProcBu(e.target.value)} className="form-select">
                    {businessUnits.map(b => (
                      <option key={b.id} value={b.name}>{b.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>Frequency</label>
                  <select value={procFreq} onChange={e => setProcFreq(e.target.value)} className="form-select">
                    <option value="Monthly">Monthly</option>
                    <option value="Quarterly">Quarterly</option>
                    <option value="Semi-Annually">Semi-Annually</option>
                    <option value="Annually">Annually</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>Assigned Lead Auditor</label>
                  <input type="text" value={procLead} onChange={e => setProcLead(e.target.value)} className="form-input" />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.85rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => { setIsProcessModalOpen(false); setEditingProcId(null); }} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">{editingProcId ? 'Save Changes' : 'Add to Universe'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MasterData;
