import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuditContext } from '../context/AuditContext';
import { Database, Plus, Search, Layers, ShieldCheck, Filter, Edit2, Trash2, Users } from 'lucide-react';
import AuditDataUpload from '../components/AuditDataUpload';
import AuditUserManagementModal from '../components/AuditUserManagementModal';
import ConfirmModal from '../components/ConfirmModal';

const MasterData = () => {
  const navigate = useNavigate();
  const { businessUnits, addBusinessUnit, editBusinessUnit, deleteBusinessUnit, setBusinessUnits, auditUniverse, setAuditUniverse, addNotification, checkRbacPermission, verifyRbacOrAlert, logAuditAction } = useContext(AuditContext);
  const [activeTab, setActiveTab] = useState('bus'); // 'bus' or 'universe'
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBu, setFilterBu] = useState('All');
  const [filterFreq, setFilterFreq] = useState('All');
  const [filterLead, setFilterLead] = useState('All');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [confirmData, setConfirmData] = useState({ isOpen: false, onConfirm: null, title: '', message: '' });

  // New & Edit BU Modal State
  const [isBuModalOpen, setIsBuModalOpen] = useState(false);
  const [editingBuId, setEditingBuId] = useState(null);
  const [newBuName, setNewBuName] = useState('');
  const [newBuHead, setNewBuHead] = useState('');
  const [newBuCode, setNewBuCode] = useState('');
  const [newBuRisk, setNewBuRisk] = useState('Medium');
  const [newBuStaff, setNewBuStaff] = useState(15);

  // New & Edit Universe Process Modal State
  const [isProcessModalOpen, setIsProcessModalOpen] = useState(false);
  const [editingProcId, setEditingProcId] = useState(null);
  const [procName, setProcName] = useState('');
  const [procBu, setProcBu] = useState('Operations');
  const [procCode, setProcCode] = useState('');
  const [procLead, setProcLead] = useState('Lead Senior Auditor');
  const [procFreq, setProcFreq] = useState('Quarterly');

  // Audit User Management Modal State
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  const handleStartEditBu = (bu) => {
    if (!verifyRbacOrAlert('edit', 'universe')) return;
    setEditingBuId(bu.id);
    setNewBuName(bu.name || bu.department || '');
    setNewBuHead(bu.head || bu.owner || '');
    setNewBuCode(bu.code || '');
    setNewBuRisk(bu.riskLevel || 'Medium');
    setNewBuStaff(bu.staffCount !== undefined ? bu.staffCount : 15);
    setIsBuModalOpen(true);
  };

  const handleDeleteBu = (buId, buName) => {
    if (!verifyRbacOrAlert('delete', 'universe')) return;
    setConfirmData({
      isOpen: true,
      title: 'Delete Business Unit',
      message: `Are you sure you want to delete Business Unit "${buName}"?`,
      onConfirm: () => {
        deleteBusinessUnit(buId);
        addNotification('Business Unit Deleted', `Unit "${buName}" removed from Audit Universe.`, 'info');
      }
    });
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
    setConfirmData({
      isOpen: true,
      title: 'Delete Process',
      message: `Are you sure you want to delete auditable process "${procCodeVal}"?`,
      onConfirm: () => {
        setAuditUniverse(prev => prev.filter(p => p.id !== procId));
        addNotification('Process Deleted', `Auditable process "${procCodeVal}" removed from Master Universe.`, 'info');
      }
    });
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
    const lead = getItemLead(item);
    const bu = getItemBu(item);
    const freq = item.frequency || 'Quarterly';
    const query = searchTerm.toLowerCase();
    
    const matchesSearch = name.includes(query) || code.includes(query) || lead.toLowerCase().includes(query);
    const matchesBu = filterBu === 'All' || bu === filterBu || bu.includes(filterBu) || filterBu.includes(bu);
    const matchesFreq = filterFreq === 'All' || freq === filterFreq;
    const matchesLead = filterLead === 'All' || lead.includes(filterLead) || filterLead.includes(lead);
    
    return matchesSearch && matchesBu && matchesFreq && matchesLead;
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
        riskLevel: newBuRisk,
        staffCount: parseInt(newBuStaff, 10) || 0
      } : bu));
      addNotification('Business Unit Updated', `Business Unit "${newBuName}" updated successfully.`, 'success');
      logAuditAction('EDIT_BUSINESS_UNIT', 'Master Data', `Chief Auditor updated Business Unit: ${newBuName}`);
    } else {
      addBusinessUnit({
        name: newBuName,
        head: newBuHead || 'Unassigned Lead',
        code: newBuCode.toUpperCase(),
        staffCount: parseInt(newBuStaff, 10) || 0,
        riskLevel: newBuRisk
      });
    }
    setNewBuName('');
    setNewBuHead('');
    setNewBuCode('');
    setNewBuStaff(15);
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
      logAuditAction('EDIT_AUDIT_UNIVERSE_PROCESS', 'Master Data', `Chief Auditor updated Auditable Process: ${procName}`);
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
          <button 
            onClick={() => setIsUserModalOpen(true)} 
            className="btn-secondary flex items-center gap-1.5 border border-emerald-500/40 text-emerald-300"
          >
            <Users size={16} />
            <span>Audit User Management</span>
          </button>
          <AuditDataUpload targetModule="universe" buttonText="Batch Universe Ingestion" />
          {activeTab === 'bus' ? (
            <button onClick={() => setIsBuModalOpen(true)} className="btn-primary bg-[#C81E1E] hover:bg-[#a61919] text-white">
              <Plus size={16} />
              <span>Add Business Unit</span>
            </button>
          ) : (
            <button onClick={() => setIsProcessModalOpen(true)} className="btn-primary bg-[#C81E1E] hover:bg-[#a61919] text-white">
              <Plus size={16} />
              <span>Add Auditable Process</span>
            </button>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="nav-tab-container flex-wrap">
        <button
          onClick={() => { setActiveTab('bus'); setSearchTerm(''); }}
          className={`nav-tab-btn flex items-center gap-[0.6rem] ${activeTab === 'bus' ? 'active' : ''}`}
          title={`Click to manage ZPC organizational structure (${businessUnits.length} Business Units registered).`}
        >
          <Database size={16} />
          <span className="font-semibold">Business Units</span>
          <span className="badge-chip bg-white/12 text-[0.72rem] py-[0.15rem] px-2 rounded-xl">
            {businessUnits.length} Units
          </span>
        </button>
        <button
          onClick={() => { setActiveTab('universe'); setSearchTerm(''); }}
          className={`nav-tab-btn flex items-center gap-[0.6rem] ${activeTab === 'universe' ? 'active' : ''}`}
          title={`Click to manage the auditable processes matrix (${auditUniverse.length} processes registered across all departments).`}
        >
          <Layers size={16} />
          <span className="font-semibold">Audit Universe Processes</span>
          <span className="badge-chip bg-white/12 text-[0.72rem] py-[0.15rem] px-2 rounded-xl">
            {auditUniverse.length} Processes
          </span>
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="filter-bar flex gap-4 items-center">
        <div className="relative flex-1 min-w-[280px]">
          <Search size={16} className="absolute left-3 top-3 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder={activeTab === 'bus' ? 'Search BUs by name, code, head of department...' : 'Search auditable processes, code, or lead auditor...'}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="form-input pl-9 w-full"
          />
        </div>

        {activeTab === 'universe' && (
          <div className="relative">
            <button 
              className="btn-secondary flex items-center gap-[0.4rem]" 
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            >
              <Filter size={16} />
              <span>Filters</span>
            </button>
            
            {showFilterDropdown && (
              <div className="absolute right-0 top-[110%] bg-slate-900/85 border border-white/10 p-4 rounded-lg z-10 w-[260px] flex flex-col gap-4 shadow-[0_4px_15px_rgba(0,0,0,0.5)]">
                <div>
                  <label className="block text-[0.82rem] mb-[0.3rem]">Department / BU</label>
                  <select
                    value={filterBu}
                    onChange={e => setFilterBu(e.target.value)}
                    className="form-select w-full py-[0.6rem] px-[0.8rem]"
                  >
                    <option value="All">All Business Units</option>
                    {businessUnits.map(b => (
                      <option key={b.id} value={b.name}>{b.name} ({b.code})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[0.82rem] mb-[0.3rem]">Audit Frequency</label>
                  <select
                    value={filterFreq}
                    onChange={e => setFilterFreq(e.target.value)}
                    className="form-select w-full py-[0.6rem] px-[0.8rem]"
                  >
                    <option value="All">Any Frequency</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Quarterly">Quarterly</option>
                    <option value="Semi-Annually">Semi-Annually</option>
                    <option value="Annually">Annually</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[0.82rem] mb-[0.3rem]">Lead Auditor</label>
                  <select
                    value={filterLead}
                    onChange={e => setFilterLead(e.target.value)}
                    className="form-select w-full py-[0.6rem] px-[0.8rem]"
                  >
                    <option value="All">All Auditors</option>
                    {[...new Set(auditUniverse.map(item => getItemLead(item)))].filter(Boolean).map(leadName => (
                      <option key={leadName} value={leadName}>{leadName}</option>
                    ))}
                  </select>
                </div>
                
                <button 
                  onClick={() => { setFilterBu('All'); setFilterFreq('All'); setFilterLead('All'); }} 
                  className="bg-white/5 border border-white/10 text-[var(--text-color)] p-2 rounded cursor-pointer mt-2 text-[0.85rem]"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Content Area */}
      {activeTab === 'bus' ? (
        <div className="glass-card bg-slate-900/85">
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
                {filteredBus.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center p-8">No matching items found</td>
                  </tr>
                ) : filteredBus.map(bu => {
                  const risk = bu.riskLevel || 'High';
                  return (
                    <tr key={bu.id}>
                      <td className="tabular-nums font-extrabold text-rose-300">{bu.code || bu.id || 'BU-01'}</td>
                      <td className="font-bold text-[0.95rem]">{bu.name || bu.department || 'Custody & Operations Unit'}</td>
                      <td>{bu.head || bu.owner || 'Department Head / VP'}</td>
                      <td className="tabular-nums">{bu.staffCount !== undefined ? bu.staffCount : 24} Staff</td>
                      <td>
                        {risk === 'Critical' && <span className="badge-danger">Critical Risk</span>}
                        {risk === 'High' && <span className="badge-warning">High Risk</span>}
                        {risk === 'Medium' && <span className="badge-info">Medium Risk</span>}
                        {(!risk || risk === 'Low') && <span className="badge-success">{risk || 'Low'} Risk</span>}
                      </td>
                      <td>
                        <div className="flex items-center gap-[0.6rem]">
                          <div className="progress-container w-[90px] h-1.5">
                            <div
                              className={`progress-fill ${(bu.coveragePct || 85) >= 90 ? 'emerald' : (bu.coveragePct || 85) >= 80 ? 'blue' : 'amber'}`}
                              style={{ width: `${bu.coveragePct || 85}%` }}
                            />
                          </div>
                          <span className="tabular-nums font-bold">{bu.coveragePct || 85}%</span>
                        </div>
                      </td>
                      <td>
                        <span className="badge-success">Active Universe</span>
                      </td>
                      <td>
                        <div className="flex gap-[0.4rem]">
                          <button
                            onClick={() => handleStartEditBu(bu)}
                            className={`btn-secondary p-[0.35rem] px-2 ${checkRbacPermission('edit', 'universe') ? 'bg-blue-500/15 text-blue-400' : 'bg-white/5 text-[var(--text-muted)]'}`}
                            title={checkRbacPermission('edit', 'universe') ? "Edit Business Unit (✏️)" : "🔒 RBAC Restricted"}
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            onClick={() => handleDeleteBu(bu.id, bu.name)}
                            className={`btn-secondary p-[0.35rem] px-2 ${checkRbacPermission('delete', 'universe') ? 'bg-red-500/15 text-red-400' : 'bg-white/5 text-[var(--text-muted)]'}`}
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
        <div className="glass-card bg-slate-900/85">
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
                {filteredUniverse.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center p-8">No matching items found</td>
                  </tr>
                ) : filteredUniverse.map(item => (
                  <tr key={item.id}>
                    <td className="tabular-nums font-extrabold text-blue-500">{getItemCode(item)}</td>
                    <td className="font-bold">{getItemName(item)}</td>
                    <td><span className="badge-chip-purple">{getItemBu(item)}</span></td>
                    <td className="tabular-nums">{item.frequency || 'Quarterly'}</td>
                    <td className="tabular-nums text-[var(--text-muted)]">{item.lastAuditDate || item.lastAudited || '2026-03-31'}</td>
                    <td className="text-[0.84rem]">{getItemLead(item)}</td>
                    <td>
                      <span className="badge-success">Auditable Unit</span>
                    </td>
                    <td>
                      <div className="flex gap-[0.4rem]">
                        <button
                          onClick={() => handleStartEditProc(item)}
                          className={`btn-secondary p-[0.35rem] px-2 ${checkRbacPermission('edit', 'universe') ? 'bg-blue-500/15 text-blue-400' : 'bg-white/5 text-[var(--text-muted)]'}`}
                          title={checkRbacPermission('edit', 'universe') ? "Edit Auditable Process (✏️)" : "🔒 RBAC Restricted"}
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => handleDeleteProc(item.id, getItemCode(item))}
                          className={`btn-secondary p-[0.35rem] px-2 ${checkRbacPermission('delete', 'universe') ? 'bg-red-500/15 text-red-400' : 'bg-white/5 text-[var(--text-muted)]'}`}
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
          <div className="modal-content max-w-[520px]">
            <div className="flex justify-between items-center mb-[1.4rem]">
              <h3 className="m-0 text-xl font-extrabold">{editingBuId ? 'Edit Business Unit' : 'Add New Business Unit'}</h3>
              <button onClick={() => { setIsBuModalOpen(false); setEditingBuId(null); }} className="bg-transparent border-none text-[var(--text-muted)] cursor-pointer">✕</button>
            </div>
            <form onSubmit={handleCreateBu} className="flex flex-col gap-4">
              <div>
                <label className="block text-[0.8rem] font-bold mb-[0.4rem] text-[var(--text-secondary)]">BU Name</label>
                <input type="text" required placeholder="e.g. Retail Custody Operations" value={newBuName} onChange={e => setNewBuName(e.target.value)} className="form-input" />
              </div>
              <div>
                <label className="block text-[0.8rem] font-bold mb-[0.4rem] text-[var(--text-secondary)]">Department Code (3-4 Chars)</label>
                <input type="text" required placeholder="e.g. RTC" value={newBuCode} onChange={e => setNewBuCode(e.target.value)} className="form-input" />
              </div>
              <div>
                <label className="block text-[0.8rem] font-bold mb-[0.4rem] text-[var(--text-secondary)]">Head of Department</label>
                <input type="text" required placeholder="e.g. Lead Reviewer" value={newBuHead} onChange={e => setNewBuHead(e.target.value)} className="form-input" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[0.8rem] font-bold mb-[0.4rem] text-[var(--text-secondary)]">Staff Count</label>
                  <input type="number" min="1" required placeholder="e.g. 15" value={newBuStaff} onChange={e => setNewBuStaff(e.target.value)} className="form-input" />
                </div>
                <div>
                  <label className="block text-[0.8rem] font-bold mb-[0.4rem] text-[var(--text-secondary)]">Inherent Risk Level</label>
                  <select value={newBuRisk} onChange={e => setNewBuRisk(e.target.value)} className="form-select">
                    <option value="Critical">Critical Risk</option>
                    <option value="High">High Risk</option>
                    <option value="Medium">Medium Risk</option>
                    <option value="Low">Low Risk</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-[0.85rem] mt-4">
                <button type="button" onClick={() => { setIsBuModalOpen(false); setEditingBuId(null); }} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary bg-[#C81E1E] hover:bg-[#a61919] text-white">{editingBuId ? 'Save Changes' : 'Create Business Unit'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add / Edit Process Modal */}
      {isProcessModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content max-w-[560px]">
            <div className="flex justify-between items-center mb-[1.4rem]">
              <h3 className="m-0 text-xl font-extrabold">{editingProcId ? 'Edit Auditable Process' : 'Add Auditable Process to Universe'}</h3>
              <button onClick={() => { setIsProcessModalOpen(false); setEditingProcId(null); }} className="bg-transparent border-none text-[var(--text-muted)] cursor-pointer">✕</button>
            </div>
            <form onSubmit={handleCreateProcess} className="flex flex-col gap-4">
              <div>
                <label className="block text-[0.8rem] font-bold mb-[0.4rem] text-[var(--text-secondary)]">Process / Auditable Unit Name</label>
                <input type="text" required placeholder="e.g. SWIFT Alliance Cloud Interface Governance" value={procName} onChange={e => setProcName(e.target.value)} className="form-input" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[0.8rem] font-bold mb-[0.4rem] text-[var(--text-secondary)]">Process Code</label>
                  <input type="text" required placeholder="e.g. SEC-SWF-02" value={procCode} onChange={e => setProcCode(e.target.value)} className="form-input" />
                </div>
                <div>
                  <label className="block text-[0.8rem] font-bold mb-[0.4rem] text-[var(--text-secondary)]">Business Unit</label>
                  <select value={procBu} onChange={e => setProcBu(e.target.value)} className="form-select">
                    {businessUnits.map(b => (
                      <option key={b.id} value={b.name}>{b.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[0.8rem] font-bold mb-[0.4rem] text-[var(--text-secondary)]">Frequency</label>
                  <select value={procFreq} onChange={e => setProcFreq(e.target.value)} className="form-select">
                    <option value="Monthly">Monthly</option>
                    <option value="Quarterly">Quarterly</option>
                    <option value="Semi-Annually">Semi-Annually</option>
                    <option value="Annually">Annually</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[0.8rem] font-bold mb-[0.4rem] text-[var(--text-secondary)]">Assigned Lead Auditor</label>
                  <input type="text" value={procLead} onChange={e => setProcLead(e.target.value)} className="form-input" />
                </div>
              </div>
              <div className="flex justify-end gap-[0.85rem] mt-4">
                <button type="button" onClick={() => { setIsProcessModalOpen(false); setEditingProcId(null); }} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary bg-[#C81E1E] hover:bg-[#a61919] text-white">{editingProcId ? 'Save Changes' : 'Add to Universe'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Audit User Management Modal */}
      <AuditUserManagementModal 
        isOpen={isUserModalOpen} 
        onClose={() => setIsUserModalOpen(false)} 
      />
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

export default MasterData;
