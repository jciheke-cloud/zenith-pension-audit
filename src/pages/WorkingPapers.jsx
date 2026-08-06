import React, { useContext, useState, useEffect } from 'react';
import { AuditContext } from '../context/AuditContext';
import { FolderOpen, Plus, FileText, Download, Eye, CheckCircle, Search, Filter, ShieldCheck, Edit2, Trash2, Hash, Layers, CheckSquare, AlertTriangle, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AuditDataUpload from '../components/AuditDataUpload';
import ConfirmModal from '../components/ConfirmModal';

const WorkingPapers = () => {
  const { workingPapers, addWorkingPaper, setWorkingPapers, auditPlans, checkRbacPermission, verifyRbacOrAlert, addNotification, updateWorkingPaper } = useContext(AuditContext);
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWpId, setEditingWpId] = useState(null);
  const [confirmData, setConfirmData] = useState({ isOpen: false, onConfirm: null, title: '', message: '' });

  // Inspector Drawer State
  const [inspectWp, setInspectWp] = useState(null);

  // New & Edit WP Form State
  const [title, setTitle] = useState('');
  const [fileType, setFileType] = useState('Excel Workbook (.xlsx)');
  const [linkedAudit, setLinkedAudit] = useState(auditPlans[0]?.auditName || 'Q3 Custody Fee Sweep Reconciliation');
  const [uploadedBy, setUploadedBy] = useState('Lead Senior Auditor');
  const [samplingMethod, setSamplingMethod] = useState('Risk-based');
  const [populationSize, setPopulationSize] = useState('2,450');
  const [sampleSize, setSampleSize] = useState('25');

  // Sample testing grid inside inspector
  const [sampleRows, setSampleRows] = useState([]);

  useEffect(() => {
    if (inspectWp) {
      if (inspectWp.sampleRows) {
        setSampleRows(inspectWp.sampleRows);
      } else {
        const match = String(inspectWp.sampleSize || '5').match(/\d+/);
        const count = match ? parseInt(match[0], 10) : 5;
        const rows = Array.from({ length: Math.min(count, 50) }, (_, i) => ({
          ref: `S-${String(i + 1).padStart(3, '0')}`,
          description: 'Transaction verification against RTGS statements',
          result: 'Pending',
          notes: ''
        }));
        setSampleRows(rows);
      }
    } else {
      setSampleRows([]);
    }
  }, [inspectWp]);

  const handleSaveSamples = () => {
    if (updateWorkingPaper) {
      updateWorkingPaper(inspectWp.id, { sampleRows });
    } else {
      setWorkingPapers(prev => prev.map(wp => wp.id === inspectWp.id ? { ...wp, sampleRows } : wp));
    }
    addNotification('Samples Saved', 'Sample test execution updated.', 'success');
  };

  const handleStartEdit = (wp) => {
    if (!verifyRbacOrAlert('edit', 'workingPapers')) return;
    setEditingWpId(wp.id);
    setTitle(wp.title || '');
    setFileType(wp.fileType || 'Excel Workbook (.xlsx)');
    setLinkedAudit(wp.linkedAudit || auditPlans[0]?.auditName || '');
    setUploadedBy(wp.uploadedBy || 'Lead Senior Auditor');
    setIsModalOpen(true);
  };

  const handleDeleteWp = (wpId, wpTitle) => {
    if (!verifyRbacOrAlert('delete', 'workingPapers')) return;
    setConfirmData({
      isOpen: true,
      title: 'Delete Working Paper',
      message: `Are you sure you want to delete working paper "${wpTitle}"?`,
      onConfirm: () => {
        setWorkingPapers(prev => prev.filter(w => w.id !== wpId));
        addNotification('Working Paper Deleted', `Working paper "${wpTitle}" has been removed.`, 'info');
      }
    });
  };

  const filteredPapers = workingPapers.filter(wp => {
    if (!wp) return false;
    const title = String(wp.title || wp.fileName || '');
    const id = String(wp.id || '');
    const linked = String(wp.linkedAudit || wp.auditName || '');
    
    const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          linked.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'All' || String(wp.fileType || '').includes(filterType);
    return matchesSearch && matchesType;
  });

  const handleUpload = (e) => {
    e.preventDefault();
    if (!title) return;
    if (editingWpId) {
      if (!verifyRbacOrAlert('edit', 'workingPapers')) return;
      setWorkingPapers(prev => prev.map(wp => wp.id === editingWpId ? {
        ...wp,
        title,
        fileName: `${title.toLowerCase().replace(/\s+/g, '_')}.xlsx`,
        fileType,
        linkedAudit,
        uploadedBy,
        samplingMethod,
        populationSize,
        sampleSize
      } : wp));
      addNotification('Working Paper Updated', `Working paper "${title}" updated successfully.`, 'success');
    } else {
      addWorkingPaper({
        title,
        fileName: `${title.toLowerCase().replace(/\s+/g, '_')}.xlsx`,
        fileType,
        linkedAudit,
        uploadedBy,
        samplingMethod,
        populationSize,
        sampleSize,
        checksum: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
      });
    }
    setIsModalOpen(false);
    setEditingWpId(null);
    setTitle('');
  };

  return (
    <div className="page-container">
      <div className="module-header">
        <div>
          <h1 className="module-title">Electronic Working Papers & Evidence Hub</h1>
          <p className="module-subtitle">
            Centralized repository linking field testing evidence, bank RTGS statements, and calculation workbooks directly to audit findings and controls.
          </p>
        </div>
        <div className="header-actions">
          <AuditDataUpload targetModule="findings" buttonText="Batch Import Papers" />
          <button onClick={() => setIsModalOpen(true)} className="btn-primary">
            <Plus size={16} />
            <span>Upload Working Paper / Evidence</span>
          </button>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="filter-bar flex gap-4 items-center">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-3 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Search working papers by WP Ref, title, linked audit, or uploader..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="form-input pl-[2.4rem] w-full"
          />
        </div>

        <div className="relative">
          <button 
            className="btn-secondary flex items-center gap-[0.4rem]" 
            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
          >
            <Filter size={16} />
            <span>Filters</span>
          </button>
          
          {showFilterDropdown && (
            <div className="absolute right-0 top-[110%] bg-slate-800 border border-[var(--border-color)] p-4 rounded-lg z-10 w-[220px] flex flex-col gap-4 shadow-xl">
              <div>
                <label className="block text-[0.82rem] mb-[0.3rem]">Document Type</label>
                <select value={filterType} onChange={e => setFilterType(e.target.value)} className="form-select w-full">
                  <option value="All">All Document Types</option>
                  <option value="Excel">Excel Workbooks</option>
                  <option value="PDF">PDF Bank Statements</option>
                  <option value="Word">Word Documents</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Working Papers Table */}
      <div className="glass-card">
        <div className="section-header-bar">
          <div>
            <h3 className="section-title">Verified Electronic Working Papers Inventory</h3>
            <p className="section-subtitle">Immutable audit trail supporting supervisory review notes and external regulatory inspections</p>
          </div>
        </div>

        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Paper Ref #</th>
                <th>Working Paper Document Title</th>
                <th>File Format & SHA-256</th>
                <th>Linked Audit Engagement</th>
                <th>Sampling Method</th>
                <th>Uploaded By</th>
                <th>Review Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPapers.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center p-8">
                    No matching items found
                  </td>
                </tr>
              ) : filteredPapers.map(wp => (
                <tr key={wp.id}>
                  <td className="tabular-nums font-extrabold text-[#3B82F6]">
                    <button 
                      onClick={() => setInspectWp(wp)} 
                      className="bg-transparent border-none text-blue-400 cursor-pointer font-extrabold underline p-0"
                    >
                      {wp.id}
                    </button>
                  </td>
                  <td className="font-bold">{wp.title || wp.fileName || 'Verified Working Paper Evidence'}</td>
                  <td>
                    <div className="flex flex-col gap-[0.2rem]">
                      <span className="badge-chip bg-white/[0.06]">
                        📄 {wp.fileType || 'Excel'}
                      </span>
                      <span className="text-[0.68rem] font-mono text-[var(--text-muted)]">
                        SHA: {wp.checksum ? String(wp.checksum).substring(0, 12) + '...' : 'e3b0c44298fc...'}
                      </span>
                    </div>
                  </td>
                  <td className="max-w-[230px] text-[0.86rem] text-[#fda4af]">{wp.linkedAudit || wp.auditName || 'FY2026 ERM Core Custody Risk Review'}</td>
                  <td className="text-[0.82rem]">
                    <span className="badge-chip-info text-[0.72rem]">
                      {wp.samplingMethod || 'Risk-based'} ({wp.sampleSize || '25'} samples)
                    </span>
                  </td>
                  <td className="text-[0.84rem]">{wp.uploadedBy || wp.owner || 'Lead Senior Auditor'}</td>
                  <td>
                    {(wp.status === 'Approved' || wp.status === 'Supervisor Signed-Off' || wp.status === 'QA Approved') && <span className="badge-success">Approved / Signed-Off</span>}
                    {(wp.status === 'Submitted for Review' || wp.status === 'Under Review' || wp.status === 'In Progress') && <span className="badge-warning">Under Review</span>}
                    {(!wp.status || (wp.status !== 'Approved' && wp.status !== 'Supervisor Signed-Off' && wp.status !== 'QA Approved' && wp.status !== 'Submitted for Review' && wp.status !== 'Under Review' && wp.status !== 'In Progress')) && <span className="badge-info">{wp.status || 'Verified'}</span>}
                  </td>
                  <td>
                    <div className="flex gap-[0.4rem] items-center">
                      <button onClick={() => setInspectWp(wp)} className="btn-secondary px-[0.65rem] py-[0.3rem] text-[0.75rem] bg-blue-500/[0.18] text-blue-400">
                        <Eye size={13} /> Inspect WP
                      </button>
                      <button
                        onClick={() => handleStartEdit(wp)}
                        className={`btn-secondary px-2 py-[0.3rem] ${checkRbacPermission('edit', 'workingPapers') ? 'bg-blue-500/15 text-blue-400' : 'bg-white/5 text-[var(--text-muted)]'}`}
                        title={checkRbacPermission('edit', 'workingPapers') ? "Edit Working Paper (✏️)" : "🔒 RBAC Restricted"}
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => handleDeleteWp(wp.id, wp.title)}
                        className={`btn-secondary px-2 py-[0.3rem] ${checkRbacPermission('delete', 'workingPapers') ? 'bg-red-500/15 text-red-400' : 'bg-white/5 text-[var(--text-muted)]'}`}
                        title={checkRbacPermission('delete', 'workingPapers') ? "Delete Working Paper (🗑️)" : "🔒 RBAC Restricted"}
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

      {/* Working Paper Inspector Drawer / Modal */}
      {inspectWp && (
        <div className="modal-overlay">
          <div className="modal-content max-w-[850px] max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 border-b border-white/[0.08] pb-[0.8rem]">
              <div>
                <div className="flex items-center gap-[0.6rem]">
                  <span className="text-[0.85rem] font-extrabold text-blue-400 bg-blue-500/15 px-[0.6rem] py-[0.2rem] rounded">
                    {inspectWp.id}
                  </span>
                  <h3 className="m-0 text-[1.2rem] font-extrabold">{inspectWp.title || inspectWp.fileName}</h3>
                </div>
                <span className="text-[0.8rem] text-[var(--text-muted)] mt-[0.2rem] block">
                  Golden Thread Link ➔ Engagement: <strong className="text-[#fda4af]">{inspectWp.linkedAudit}</strong>
                </span>
              </div>
              <button onClick={() => setInspectWp(null)} className="bg-transparent border-none text-[var(--text-muted)] cursor-pointer text-[1.2rem]">✕</button>
            </div>

            {/* Header Metrics */}
            <div className="grid grid-cols-4 gap-[0.8rem] mb-6 bg-black/25 p-4 rounded-lg border border-white/[0.06]">
              <div>
                <span className="text-[0.72rem] text-[var(--text-muted)] block">Auditor (Prepared By)</span>
                <span className="text-[0.88rem] font-bold">{inspectWp.uploadedBy || 'Lead Senior Auditor'}</span>
              </div>
              <div>
                <span className="text-[0.72rem] text-[var(--text-muted)] block">Reviewer (Supervisory Sign-Off)</span>
                <span className="text-[0.88rem] font-bold text-[#F59E0B]">Sarah James (Pending Clearance)</span>
              </div>
              <div>
                <span className="text-[0.72rem] text-[var(--text-muted)] block">Sampling Methodology</span>
                <span className="text-[0.88rem] font-bold text-[#10B981]">{inspectWp.samplingMethod || 'Risk-based'} ({inspectWp.sampleSize || '25'}/{inspectWp.populationSize || '2,450'})</span>
              </div>
              <div>
                <span className="text-[0.72rem] text-[var(--text-muted)] block">SHA-256 Checksum Integrity</span>
                <span className="text-[0.72rem] font-mono text-blue-400 block break-all">
                  {inspectWp.checksum ? String(inspectWp.checksum).substring(0, 16) + '...' : 'e3b0c44298fc1c14...'}
                </span>
              </div>
            </div>

            {/* Sample Testing Grid */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-[0.6rem]">
                <h4 className="m-0 text-[0.95rem] font-bold text-[var(--text-primary)]">
                  📋 Sample Test Execution Matrix ({sampleRows.length} Tested Samples)
                </h4>
                <button onClick={() => navigate('/findings')} className="btn-secondary px-[0.6rem] py-[0.3rem] text-[0.74rem]">
                  <ExternalLink size={12} /> View Linked Findings (FND-2026-004)
                </button>
              </div>
              <div className="data-table-container bg-black/30 rounded-md">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Sample #</th>
                      <th>Sample Test Item Description</th>
                      <th>Actual Test Result</th>
                      <th>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sampleRows.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center p-8 text-[var(--text-muted)]">
                          No test evidence attached yet.
                        </td>
                      </tr>
                    ) : sampleRows.map((row, idx) => (
                      <tr key={row.ref || idx}>
                        <td className="tabular-nums font-bold text-blue-400">{row.ref}</td>
                        <td className="text-[0.82rem]">{row.description}</td>
                        <td>
                          <select 
                            value={row.result}
                            onChange={(e) => {
                              const newRows = [...sampleRows];
                              newRows[idx].result = e.target.value;
                              setSampleRows(newRows);
                            }}
                            className="form-select text-[0.8rem] py-1 px-2 bg-slate-800 border border-slate-600 rounded text-white"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Pass">Pass</option>
                            <option value="Fail">Fail</option>
                          </select>
                        </td>
                        <td>
                          <input 
                            type="text"
                            value={row.notes}
                            onChange={(e) => {
                              const newRows = [...sampleRows];
                              newRows[idx].notes = e.target.value;
                              setSampleRows(newRows);
                            }}
                            className="form-input text-[0.8rem] py-1 px-2 w-full bg-slate-800 border border-slate-600 rounded text-white"
                            placeholder="Add notes..."
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-end gap-[0.8rem] border-t border-white/[0.08] pt-4">
              <button onClick={handleSaveSamples} className="btn-primary">Save Samples</button>
              <button onClick={() => setInspectWp(null)} className="btn-secondary">Close Inspector</button>
            </div>
          </div>
        </div>
      )}

      {/* Upload / Edit Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content max-w-[540px]">
            <div className="flex justify-between items-center mb-[1.4rem]">
              <h3 className="m-0 text-[1.25rem] font-extrabold">{editingWpId ? 'Edit Working Paper Evidence' : 'Upload Working Paper Evidence'}</h3>
              <button onClick={() => { setIsModalOpen(false); setEditingWpId(null); }} className="bg-transparent border-none text-[var(--text-muted)] cursor-pointer">✕</button>
            </div>
            <form onSubmit={handleUpload} className="flex flex-col gap-4">
              <div>
                <label className="block text-[0.8rem] font-bold mb-[0.4rem] text-[var(--text-secondary)]">Working Paper Title</label>
                <input type="text" required placeholder="e.g. Custody Cash Sweep Verification Spreadsheet Q3" value={title} onChange={e => setTitle(e.target.value)} className="form-input" />
              </div>
              <div>
                <label className="block text-[0.8rem] font-bold mb-[0.4rem] text-[var(--text-secondary)]">Linked Audit Engagement</label>
                <select value={linkedAudit} onChange={e => setLinkedAudit(e.target.value)} className="form-select">
                  {auditPlans.map(p => (
                    <option key={p.id} value={p.auditName}>{p.auditName}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[0.8rem] font-bold mb-[0.4rem] text-[var(--text-secondary)]">Sampling Methodology</label>
                  <select value={samplingMethod} onChange={e => setSamplingMethod(e.target.value)} className="form-select">
                    <option value="Risk-based">Risk-based Sampling</option>
                    <option value="Random">Random Selection</option>
                    <option value="Judgmental">Judgmental Selection</option>
                    <option value="Systematic">Systematic Interval</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[0.8rem] font-bold mb-[0.4rem] text-[var(--text-secondary)]">Sample Size / Population</label>
                  <input type="text" value={sampleSize} onChange={e => setSampleSize(e.target.value)} className="form-input" placeholder="e.g. 25 / 2,450" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[0.8rem] font-bold mb-[0.4rem] text-[var(--text-secondary)]">File Format</label>
                  <select value={fileType} onChange={e => setFileType(e.target.value)} className="form-select">
                    <option value="Excel Workbook (.xlsx)">Excel Workbook (.xlsx)</option>
                    <option value="Word Document (.docx)">Word Document (.docx)</option>
                    <option value="PDF Document (.pdf)">PDF Document (.pdf)</option>
                    <option value="Bank RTGS Statement (.pdf)">Bank RTGS Statement (.pdf)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[0.8rem] font-bold mb-[0.4rem] text-[var(--text-secondary)]">Uploaded By</label>
                  <input type="text" value={uploadedBy} onChange={e => setUploadedBy(e.target.value)} className="form-input" />
                </div>
              </div>
              <div className="flex justify-end gap-[0.85rem] mt-4">
                <button type="button" onClick={() => { setIsModalOpen(false); setEditingWpId(null); }} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">{editingWpId ? 'Save Changes' : 'Upload & Link Evidence'}</button>
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

export default WorkingPapers;
