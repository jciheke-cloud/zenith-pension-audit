import React, { useContext, useState } from 'react';
import { AuditContext } from '../context/AuditContext';
import { FileText, Plus, CheckSquare, Shield, Layers, Search, Filter, Edit2, Trash2 } from 'lucide-react';
import AuditDataUpload from '../components/AuditDataUpload';
import ConfirmModal from '../components/ConfirmModal';
import { useNavigate } from 'react-router-dom';

const AuditPrograms = () => {
  const { auditPrograms, setAuditPrograms, addNotification, checkRbacPermission, verifyRbacOrAlert, addProcedureToProgram, deleteProcedure } = useContext(AuditContext);
  const navigate = useNavigate();

  const [selectedProgramId, setSelectedProgramId] = useState(auditPrograms[0]?.id || 'AP-01');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [showFilter, setShowFilter] = useState(false);
  const [confirmData, setConfirmData] = useState({ isOpen: false, onConfirm: null, title: '', message: '' });

  const selectedProgram = auditPrograms.find(p => p.id === selectedProgramId) || auditPrograms[0];

  // New & Edit Procedure Modal
  const [isProcModalOpen, setIsProcModalOpen] = useState(false);
  const [editingProcId, setEditingProcId] = useState(null);
  const [procRef, setProcRef] = useState('');
  const [procStep, setProcStep] = useState('');
  const [procSample, setProcSample] = useState('25 Transactions');
  const [procRisk, setProcRisk] = useState('High');

  const filteredProcedures = (selectedProgram?.procedures || []).filter(p => {
    const matchSearch = p.step.toLowerCase().includes(searchTerm.toLowerCase()) || (p.ref || '').toLowerCase().includes(searchTerm.toLowerCase());
    const pStatus = p.status || 'Pending';
    const matchStatus = filterStatus === 'All' || pStatus.includes(filterStatus);
    return matchSearch && matchStatus;
  });

  const handleStartEdit = (proc) => {
    setEditingProcId(proc.id);
    setProcRef(proc.ref || '');
    setProcStep(proc.step || '');
    setProcSample(proc.sampleSize || '25 Transactions');
    setProcRisk(proc.riskLink || 'High');
    setIsProcModalOpen(true);
  };

  const handleDeleteProcedure = (procId, procRefCode) => {
    if (!verifyRbacOrAlert('delete', 'programs')) return;
    setConfirmData({
      isOpen: true,
      title: 'Delete Procedure',
      message: `Are you sure you want to delete testing procedure ${procRefCode}?`,
      onConfirm: async () => {
        await deleteProcedure(selectedProgramId, procId);
        addNotification('Procedure Deleted', `Procedure ${procRefCode} has been removed from "${selectedProgram.title || selectedProgram.name || 'this program'}".`, 'info');
      }
    });
  };

  const handleAddProcedure = (e) => {
    e.preventDefault();
    if (!procRef || !procStep) return;

    if (editingProcId) {
      if (!verifyRbacOrAlert('edit', 'programs')) return;
      setAuditPrograms(prev => prev.map(prog => {
        if (prog.id === selectedProgramId) {
          return {
            ...prog,
            procedures: prog.procedures.map(p => p.id === editingProcId ? {
              ...p,
              ref: procRef.toUpperCase(),
              step: procStep,
              sampleSize: procSample,
              riskLink: procRisk
            } : p)
          };
        }
        return prog;
      }));
      addNotification('Procedure Updated', `Testing step ${procRef.toUpperCase()} updated successfully.`, 'success');
    } else {
      const newProc = {
        ref: procRef.toUpperCase(),
        step: procStep,
        sampleSize: procSample,
        assignedTo: 'Lead Reviewer',
        status: 'Pending',
        riskLink: procRisk || `${selectedProgram?.title || selectedProgram?.name || 'Standard'} Core Risk`
      };
      addProcedureToProgram(selectedProgram?.id || selectedProgramId, newProc);
      addNotification('Procedure Added', `Testing step ${procRef.toUpperCase()} added to "${selectedProgram?.title || selectedProgram?.name || 'Standard Audit Program'}".`, 'success');
    }

    setIsProcModalOpen(false);
    setEditingProcId(null);
    setProcRef('');
    setProcStep('');
  };

  return (
    <div className="page-container">
      <div className="module-header">
        <div>
          <h1 className="module-title">Standardized Audit Programs Library</h1>
          <p className="module-subtitle">
            Curated, IIA & PenCom compliant testing checklists and procedural templates across core ZPC operations.
          </p>
        </div>
        <div className="header-actions">
          <AuditDataUpload targetModule="programs" buttonText="Batch Import Programs" />
          <button onClick={() => navigate('/engagements')} className="btn-secondary">
            <span>Go to Active Engagements ➔</span>
          </button>
          <button 
            onClick={() => setIsProcModalOpen(true)} 
            className="btn-primary"
          >
            <Plus size={16} />
            <span>Add Testing Procedure</span>
          </button>
        </div>
      </div>

      {/* Program Selector Pills */}
      <div className="nav-tab-container flex-wrap">
        {auditPrograms.map(prog => (
          <button
            key={prog.id}
            onClick={() => { setSelectedProgramId(prog.id); setSearchTerm(''); }}
            className={`nav-tab-btn flex items-center gap-[0.6rem] px-[1.1rem] py-[0.65rem] ${selectedProgramId === prog.id ? 'active' : ''}`}
            title={`Click to load testing procedures for ${prog.title || prog.name || 'Standard Audit Program'}. Contains ${prog.procedures?.length || 0} specific verification steps.`}
          >
            <FileText size={16} />
            <span className="font-semibold">{prog.title || prog.name || 'Standard Program'}</span>
            <span className="badge-chip bg-white/[0.12] text-[0.72rem] py-[0.15rem] px-2 rounded-xl">
              {prog.procedures?.length || 0} Test Procedures
            </span>
          </button>
        ))}
      </div>

      {/* Program Header Summary */}
      {!selectedProgram ? (
        <div className="glass-card p-12 text-center">
          <FileText size={48} className="text-[var(--text-muted)] mx-auto mb-4" />
          <h3>No Audit Programs Found</h3>
          <p className="text-[var(--text-muted)]">There are currently no testing checklists available.</p>
        </div>
      ) : (
      <>
        <div className="glass-card mb-7 bg-gradient-to-br from-slate-800/70 to-slate-900/90">
        <div className="flex-between">
          <div>
            <div className="flex items-center gap-[0.6rem] mb-[0.4rem] flex-wrap">
              {/* Labels removed per user request */}
            </div>
            <h2 className="m-0 mb-2 text-[1.4rem] font-extrabold text-white">{selectedProgram.title || selectedProgram.name || 'Standard Audit Program'}</h2>
            <p className="m-0 text-[0.88rem] text-[var(--text-secondary)] max-w-[800px] leading-relaxed">
              {selectedProgram.objectives || selectedProgram.description || 'Comprehensive testing checklist and field procedures for internal audit validation and regulatory compliance.'}
            </p>
          </div>
          <div className="text-right flex flex-col items-end gap-[0.6rem]">
            <div>
              <span className="text-[0.75rem] text-[var(--text-muted)] block">Total Procedures</span>
              <span className="tabular-nums text-[1.8rem] font-extrabold text-[#fda4af]">
                {selectedProgram.procedures?.length || 0}
              </span>
            </div>
            <button 
              onClick={() => {
                addNotification('Program Attached', `Program "${selectedProgram.title || selectedProgram.name}" linked to Active Audit Engagement.`, 'success');
                navigate('/engagements');
              }} 
              className="btn-primary px-[0.8rem] py-[0.4rem] text-[0.78rem]"
            >
              Attach Program to Engagement ➔
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="filter-bar">
        <div className="flex gap-[0.8rem] w-full">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-3 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder={`Search testing procedures in ${selectedProgram.title || selectedProgram.name || 'this program'}...`}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="form-input pl-[2.4rem]"
            />
          </div>
          <div className="relative">
            <button onClick={() => setShowFilter(!showFilter)} className="btn-secondary px-4 py-[0.6rem] h-full">
              <Filter size={16} /> Filter
            </button>
            {showFilter && (
              <div className="absolute right-0 top-[110%] bg-[var(--bg-card)] border border-[var(--border-color)] rounded-md p-[0.8rem] z-10 min-w-[180px] shadow-lg">
                <label className="block text-[0.75rem] font-semibold mb-[0.4rem]">By Status</label>
                <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="form-select w-full">
                  <option value="All">All Statuses</option>
                  <option value="Completed">Completed/Pass</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Pending">Pending Test</option>
                </select>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Procedures Table */}
      <div className="glass-card">
        <div className="section-header-bar">
          <div>
            <h3 className="section-title">Step-by-Step Testing Procedures & Sampling Methodology</h3>
            <p className="section-subtitle">Comprehensive field checklist for: <strong className="text-blue-400">{selectedProgram.title || selectedProgram.name || 'Standard Audit Program'}</strong></p>
          </div>
        </div>

        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Procedure Ref #</th>
                <th>Testing Instruction & Control Objective</th>
                <th>Recommended Sample Size</th>
                <th>Linked Risk Area</th>
                <th>Execution Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProcedures.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center p-8">No matching items found</td>
                </tr>
              ) : (
              filteredProcedures.map(proc => (
                <tr key={proc.id}>
                  <td className="tabular-nums font-extrabold text-[#fda4af]">{proc.ref || proc.id || 'PROC-01'}</td>
                  <td className="font-semibold max-w-[460px] leading-relaxed">
                    <div className="text-white mb-[0.2rem]">{proc.step}</div>
                    {proc.expectedControl && <div className="text-[0.75rem] text-[var(--text-muted)]"><strong>Expected Control:</strong> {proc.expectedControl}</div>}
                  </td>
                  <td className="tabular-nums font-bold">{proc.sampleSize || '30 Samples (100% Target)'}</td>
                  <td><span className="badge-chip bg-white/[0.06]">{proc.riskLink || 'Custody Compliance Risk'}</span></td>
                  <td>
                    {(proc.status === 'Completed' || proc.status === 'Pass' || proc.status === 'Verified') && <span className="badge-success">Verified / Pass</span>}
                    {(proc.status === 'In Progress' || proc.status === 'Under Review') && <span className="badge-info">In Progress</span>}
                    {(!proc.status || proc.status === 'Open' || proc.status === 'Pending') && <span className="badge-warning">Pending Test</span>}
                  </td>
                  <td>
                    <div className="flex gap-[0.4rem] items-center">
                      <button onClick={() => navigate('/engagements')} className="btn-secondary px-[0.65rem] py-[0.35rem] text-[0.75rem]" title="Execute step in active field engagement">
                        Execute ➔
                      </button>
                      <button
                        onClick={() => handleStartEdit(proc)}
                        className={`btn-secondary px-2 py-[0.35rem] ${checkRbacPermission('edit', 'programs') ? 'bg-blue-500/15 text-blue-400' : 'bg-white/5 text-[var(--text-muted)]'}`}
                        title={checkRbacPermission('edit', 'programs') ? "Edit Procedure (✏️)" : "🔒 RBAC Restricted"}
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => handleDeleteProcedure(proc.id, proc.ref || proc.id)}
                        className={`btn-secondary px-2 py-[0.35rem] ${checkRbacPermission('delete', 'programs') ? 'bg-red-500/15 text-red-400' : 'bg-white/5 text-[var(--text-muted)]'}`}
                        title={checkRbacPermission('delete', 'programs') ? "Delete Procedure (🗑️)" : "🔒 RBAC Restricted: Only CAE/Manager can delete"}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
      </div>

      </>
      )}

      {/* Add / Edit Procedure Modal — moved outside selectedProgram conditional */}
      {isProcModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content max-w-[560px]">
            <div className="flex justify-between items-center mb-[1.4rem]">
              <h3 className="m-0 text-[1.25rem] font-extrabold">
                {editingProcId ? 'Edit Procedure Step' : `Add Procedure to ${selectedProgram?.title || selectedProgram?.name || 'Audit Program'}`}
              </h3>
              <button onClick={() => { setIsProcModalOpen(false); setEditingProcId(null); }} className="bg-transparent border-none text-[var(--text-muted)] cursor-pointer">✕</button>
            </div>
            <form onSubmit={handleAddProcedure} className="flex flex-col gap-4">
              <div>
                <label className="block text-[0.8rem] font-bold mb-[0.4rem] text-[var(--text-secondary)]">Procedure Ref Code</label>
                <input type="text" required placeholder="e.g. CUST-PROC-05" value={procRef} onChange={e => setProcRef(e.target.value)} className="form-input" />
              </div>
              <div>
                <label className="block text-[0.8rem] font-bold mb-[0.4rem] text-[var(--text-secondary)]">Testing Instruction Step</label>
                <textarea rows={3} required placeholder="Detailed testing steps, verification of RTGS confirmations, checking sign-offs..." value={procStep} onChange={e => setProcStep(e.target.value)} className="form-input w-full resize-y" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[0.8rem] font-bold mb-[0.4rem] text-[var(--text-secondary)]">Sample Size Target</label>
                  <input type="text" value={procSample} onChange={e => setProcSample(e.target.value)} className="form-input" />
                </div>
                <div>
                  <label className="block text-[0.8rem] font-bold mb-[0.4rem] text-[var(--text-secondary)]">Linked Risk Area</label>
                  <input type="text" value={procRisk} onChange={e => setProcRisk(e.target.value)} className="form-input" />
                </div>
              </div>
              <div className="flex justify-end gap-[0.85rem] mt-4">
                <button type="button" onClick={() => { setIsProcModalOpen(false); setEditingProcId(null); }} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">{editingProcId ? 'Save Changes' : 'Add Procedure'}</button>
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

export default AuditPrograms;
