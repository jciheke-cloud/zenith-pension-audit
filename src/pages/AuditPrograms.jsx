import React, { useContext, useState } from 'react';
import { AuditContext } from '../context/AuditContext';
import { FileText, Plus, CheckSquare, Shield, Layers, Search, Filter, Edit2, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AuditPrograms = () => {
  const { auditPrograms, setAuditPrograms, addNotification, checkRbacPermission, verifyRbacOrAlert } = useContext(AuditContext);
  const navigate = useNavigate();

  const [selectedProgramId, setSelectedProgramId] = useState(auditPrograms[0]?.id || 'AP-01');
  const [searchTerm, setSearchTerm] = useState('');

  const selectedProgram = auditPrograms.find(p => p.id === selectedProgramId) || auditPrograms[0];

  // New & Edit Procedure Modal
  const [isProcModalOpen, setIsProcModalOpen] = useState(false);
  const [editingProcId, setEditingProcId] = useState(null);
  const [procRef, setProcRef] = useState('');
  const [procStep, setProcStep] = useState('');
  const [procSample, setProcSample] = useState('25 Transactions');
  const [procRisk, setProcRisk] = useState('High');

  const filteredProcedures = (selectedProgram?.procedures || []).filter(p =>
    p.step.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.ref.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStartEdit = (proc) => {
    if (!verifyRbacOrAlert('edit', 'programs')) return;
    setEditingProcId(proc.id);
    setProcRef(proc.ref || '');
    setProcStep(proc.step || '');
    setProcSample(proc.sampleSize || '25 Transactions');
    setProcRisk(proc.riskLink || 'High');
    setIsProcModalOpen(true);
  };

  const handleDeleteProcedure = (procId, procRefCode) => {
    if (!verifyRbacOrAlert('delete', 'programs')) return;
    if (!window.confirm(`Are you sure you want to delete testing procedure ${procRefCode}?`)) return;
    setAuditPrograms(prev => prev.map(prog => {
      if (prog.id === selectedProgramId) {
        return {
          ...prog,
          procedures: prog.procedures.filter(p => p.id !== procId)
        };
      }
      return prog;
    }));
    addNotification('Procedure Deleted', `Procedure ${procRefCode} has been removed from "${selectedProgram.title || selectedProgram.name || 'this program'}".`, 'info');
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
        id: `proc-${Date.now()}`,
        ref: procRef.toUpperCase(),
        step: procStep,
        sampleSize: procSample,
        assignedTo: 'Lead Reviewer',
        status: 'In Progress',
        riskLink: procRisk || `${selectedProgram.title || selectedProgram.name || 'Standard'} Core Risk`
      };

      setAuditPrograms(prev => prev.map(prog => {
        if (prog.id === selectedProgramId) {
          return {
            ...prog,
            procedures: [...prog.procedures, newProc]
          };
        }
        return prog;
      }));
      addNotification('Procedure Added', `Testing step ${newProc.ref} added to "${selectedProgram.title || selectedProgram.name || 'Standard Audit Program'}".`, 'success');
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
          <button onClick={() => navigate('/engagements')} className="btn-secondary">
            <span>Go to Active Engagements ➔</span>
          </button>
          <button onClick={() => setIsProcModalOpen(true)} className="btn-primary">
            <Plus size={16} />
            <span>Add Testing Procedure</span>
          </button>
        </div>
      </div>

      {/* Program Selector Pills */}
      <div className="nav-tab-container" style={{ flexWrap: 'wrap' }}>
        {auditPrograms.map(prog => (
          <button
            key={prog.id}
            onClick={() => { setSelectedProgramId(prog.id); setSearchTerm(''); }}
            className={`nav-tab-btn ${selectedProgramId === prog.id ? 'active' : ''}`}
            style={{ padding: '0.65rem 1.1rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}
            title={`Click to load testing procedures for ${prog.title || prog.name || 'Standard Audit Program'}. Contains ${prog.procedures?.length || 0} specific verification steps.`}
          >
            <FileText size={16} />
            <span style={{ fontWeight: 600 }}>{prog.title || prog.name || 'Standard Program'}</span>
            <span className="badge-chip" style={{ background: 'rgba(255, 255, 255, 0.12)', fontSize: '0.72rem', padding: '0.15rem 0.5rem', borderRadius: '12px' }}>
              {prog.procedures?.length || 0} Test Procedures
            </span>
          </button>
        ))}
      </div>

      {/* Program Header Summary */}
      <div className="glass-card" style={{ marginBottom: '1.75rem', background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.9) 100%)' }}>
        <div className="flex-between">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
              <span className="badge-purple">Code: {selectedProgram.id}</span>
              <span className="badge-chip-info">{selectedProgram.category || 'Standard Program'}</span>
            </div>
            <h2 style={{ margin: '0 0 0.5rem', fontSize: '1.4rem', fontWeight: 800, color: 'white' }}>{selectedProgram.title || selectedProgram.name || 'Standard Audit Program'}</h2>
            <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-secondary)', maxWidth: '800px', lineHeight: '1.6' }}>
              {selectedProgram.objectives || selectedProgram.description || 'Comprehensive testing checklist and field procedures for internal audit validation and regulatory compliance.'}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Total Procedures</span>
            <span className="tabular-nums" style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fda4af' }}>
              {selectedProgram.procedures?.length || 0}
            </span>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="filter-bar">
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder={`Search testing procedures in ${selectedProgram.title || selectedProgram.name || 'this program'}...`}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '2.4rem' }}
          />
        </div>
      </div>

      {/* Procedures Table */}
      <div className="glass-card">
        <div className="section-header-bar">
          <div>
            <h3 className="section-title">Step-by-Step Testing Procedures & Sampling Methodology</h3>
            <p className="section-subtitle">Comprehensive field checklist for: <strong style={{ color: '#60A5FA' }}>{selectedProgram.title || selectedProgram.name || 'Standard Audit Program'}</strong></p>
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
              {filteredProcedures.map(proc => (
                <tr key={proc.id}>
                  <td className="tabular-nums" style={{ fontWeight: 800, color: '#fda4af' }}>{proc.ref || proc.id || 'PROC-01'}</td>
                  <td style={{ fontWeight: 600, maxWidth: '460px', lineHeight: '1.5' }}>
                    <div style={{ color: 'white', marginBottom: '0.2rem' }}>{proc.step}</div>
                    {proc.expectedControl && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}><strong>Expected Control:</strong> {proc.expectedControl}</div>}
                  </td>
                  <td className="tabular-nums" style={{ fontWeight: 700 }}>{proc.sampleSize || '30 Samples (100% Target)'}</td>
                  <td><span className="badge-chip" style={{ background: 'rgba(255,255,255,0.06)' }}>{proc.riskLink || 'Custody Compliance Risk'}</span></td>
                  <td>
                    {(proc.status === 'Tested - Pass' || proc.status === 'Passed' || proc.status?.includes('Pass') || proc.status?.includes('Satisfactory')) && (
                      <span className="badge-success" title="Substantive field testing completed with 0 deviations. Control operating effectively.">Tested - Pass / Satisfactory</span>
                    )}
                    {(proc.status === 'Tested - Exception' || proc.status === 'Failed' || proc.status?.includes('Exception') || proc.status?.includes('Failed')) && (
                      <span className="badge-danger" title={`Exception identified during sample testing. Linked to finding ${proc.findingRef || 'in 10×10 Matrix'}.`}>
                        Tested - Exception {proc.findingRef ? `(${proc.findingRef})` : '(Action Req.)'}
                      </span>
                    )}
                    {(proc.status === 'In Progress' || proc.status?.includes('Progress')) && (
                      <span className="badge-info" title="Fieldwork and PBC sample testing currently underway by assigned auditor.">Fieldwork In Progress</span>
                    )}
                    {(!proc.status || (proc.status !== 'Tested - Pass' && proc.status !== 'Passed' && !proc.status?.includes('Pass') && proc.status !== 'Tested - Exception' && proc.status !== 'Failed' && !proc.status?.includes('Exception') && proc.status !== 'In Progress' && !proc.status?.includes('Progress'))) && (
                      <span className="badge-warning" title="Procedure scheduled in annual audit plan; substantive test pending execution.">{proc.status || 'Pending Field Test'}</span>
                    )}
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <button onClick={() => navigate('/engagements')} className="btn-secondary" style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }} title="Execute step in active field engagement">
                        Execute ➔
                      </button>
                      <button
                        onClick={() => handleStartEdit(proc)}
                        className="btn-secondary"
                        style={{ padding: '0.35rem 0.5rem', background: checkRbacPermission('edit', 'programs') ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255, 255, 255, 0.05)', color: checkRbacPermission('edit', 'programs') ? '#60A5FA' : 'var(--text-muted)' }}
                        title={checkRbacPermission('edit', 'programs') ? "Edit Procedure (✏️)" : "🔒 RBAC Restricted: Only Audit Team can edit"}
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => handleDeleteProcedure(proc.id, proc.ref || proc.id)}
                        className="btn-secondary"
                        style={{ padding: '0.35rem 0.5rem', background: checkRbacPermission('delete', 'programs') ? 'rgba(239, 68, 68, 0.15)' : 'rgba(255, 255, 255, 0.05)', color: checkRbacPermission('delete', 'programs') ? '#F87171' : 'var(--text-muted)' }}
                        title={checkRbacPermission('delete', 'programs') ? "Delete Procedure (🗑️)" : "🔒 RBAC Restricted: Only CAE/Manager can delete"}
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

      {/* Add / Edit Procedure Modal */}
      {isProcModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '560px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.4rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>
                {editingProcId ? 'Edit Procedure Step' : `Add Procedure to ${selectedProgram.name}`}
              </h3>
              <button onClick={() => { setIsProcModalOpen(false); setEditingProcId(null); }} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>✕</button>
            </div>
            <form onSubmit={handleAddProcedure} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>Procedure Ref Code</label>
                <input type="text" required placeholder="e.g. CUST-PROC-05" value={procRef} onChange={e => setProcRef(e.target.value)} className="form-input" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>Testing Instruction Step</label>
                <textarea rows={3} required placeholder="Detailed testing steps, verification of RTGS confirmations, checking sign-offs..." value={procStep} onChange={e => setProcStep(e.target.value)} className="form-input" style={{ width: '100%', resize: 'vertical' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>Sample Size Target</label>
                  <input type="text" value={procSample} onChange={e => setProcSample(e.target.value)} className="form-input" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>Linked Risk Area</label>
                  <input type="text" value={procRisk} onChange={e => setProcRisk(e.target.value)} className="form-input" />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.85rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => { setIsProcModalOpen(false); setEditingProcId(null); }} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">{editingProcId ? 'Save Changes' : 'Add Procedure'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditPrograms;
