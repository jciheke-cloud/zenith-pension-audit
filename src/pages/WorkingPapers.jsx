import React, { useContext, useState } from 'react';
import { AuditContext } from '../context/AuditContext';
import { FolderOpen, Plus, FileText, Download, Eye, CheckCircle, Search, Filter, ShieldCheck, Edit2, Trash2, Hash, Layers, CheckSquare, AlertTriangle, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AuditDataUpload from '../components/AuditDataUpload';

const WorkingPapers = () => {
  const { workingPapers, addWorkingPaper, setWorkingPapers, auditPlans, checkRbacPermission, verifyRbacOrAlert, addNotification } = useContext(AuditContext);
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWpId, setEditingWpId] = useState(null);

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
  const [sampleRows, setSampleRows] = useState([
    { id: 'SMP-001', desc: 'Custody Settlement TRX-9981', expected: 'Dual Authorization Signed', actual: 'Verified & Signed', exception: 'No' },
    { id: 'SMP-002', desc: 'Money Market Placement TRX-9982', expected: 'CP Placement Limit < ₦500M', actual: 'Limit Verified (₦350M)', exception: 'No' },
    { id: 'SMP-003', desc: 'Employer Contribution Inflow TRX-9983', expected: '24-hr Swept to PFC Vault', actual: 'Delayed 48-hrs (Fee Leakage)', exception: 'Yes' },
    { id: 'SMP-004', desc: 'NAV Valuation Sheet #NAV-2026-081', expected: 'Independent Market Price Re-calc', actual: 'Agrees with Bloomberg Feed', exception: 'No' },
    { id: 'SMP-005', desc: 'Safekeeping Physical Certificate Verification', expected: 'Physical Safe Verification Entry', actual: 'Dual Custodian Seal Present', exception: 'No' }
  ]);

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
    if (!window.confirm(`Are you sure you want to delete working paper "${wpTitle}"?`)) return;
    setWorkingPapers(prev => prev.filter(w => w.id !== wpId));
    addNotification('Working Paper Deleted', `Working paper "${wpTitle}" has been removed.`, 'info');
  };

  const filteredPapers = workingPapers.filter(wp => {
    const matchesSearch = (wp.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (wp.id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (wp.linkedAudit || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'All' || (wp.fileType || '').includes(filterType);
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
      <div className="filter-bar">
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search working papers by WP Ref, title, linked audit, or uploader..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '2.4rem' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Filter size={16} color="var(--text-muted)" />
          <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Filter Document Type:</span>
          <select value={filterType} onChange={e => setFilterType(e.target.value)} className="form-select" style={{ width: '200px', padding: '0.5rem 0.8rem' }}>
            <option value="All">All Document Types</option>
            <option value="Excel">Excel Workbooks</option>
            <option value="PDF">PDF Bank Statements</option>
            <option value="Word">Word Documents</option>
          </select>
        </div>
      </div>

      {/* Working Papers Table */}
      <div className="glass-card">
        <div className="section-header-bar">
          <div>
            <h3 className="section-title">Verified Electronic Working Papers Inventory</h3>
            <p className="section-subtitle">Immutable audit trail supporting supervisory review notes and external regulatory inspections</p>
          </div>
          <span className="badge-chip-info">IIA Working Paper Retention Standard Aligned</span>
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
              {filteredPapers.map(wp => (
                <tr key={wp.id}>
                  <td className="tabular-nums" style={{ fontWeight: 800, color: '#3B82F6' }}>
                    <button 
                      onClick={() => setInspectWp(wp)} 
                      style={{ background: 'none', border: 'none', color: '#60A5FA', cursor: 'pointer', fontWeight: 800, textDecoration: 'underline', padding: 0 }}
                    >
                      {wp.id}
                    </button>
                  </td>
                  <td style={{ fontWeight: 700 }}>{wp.title || wp.fileName || 'Verified Working Paper Evidence'}</td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                      <span className="badge-chip" style={{ background: 'rgba(255,255,255,0.06)' }}>
                        📄 {wp.fileType || 'Excel'}
                      </span>
                      <span style={{ fontSize: '0.68rem', fontFamily: 'monospace', color: 'var(--text-muted)' }}>
                        SHA: {wp.checksum ? wp.checksum.substring(0, 12) + '...' : 'e3b0c44298fc...'}
                      </span>
                    </div>
                  </td>
                  <td style={{ maxWidth: '230px', fontSize: '0.86rem', color: '#fda4af' }}>{wp.linkedAudit || wp.auditName || 'FY2026 ERM Core Custody Risk Review'}</td>
                  <td style={{ fontSize: '0.82rem' }}>
                    <span className="badge-chip-info" style={{ fontSize: '0.72rem' }}>
                      {wp.samplingMethod || 'Risk-based'} ({wp.sampleSize || '25'} samples)
                    </span>
                  </td>
                  <td style={{ fontSize: '0.84rem' }}>{wp.uploadedBy || wp.owner || 'Lead Senior Auditor'}</td>
                  <td>
                    {(wp.status === 'Approved' || wp.status === 'Supervisor Signed-Off' || wp.status === 'QA Approved') && <span className="badge-success">Approved / Signed-Off</span>}
                    {(wp.status === 'Submitted for Review' || wp.status === 'Under Review' || wp.status === 'In Progress') && <span className="badge-warning">Under Review</span>}
                    {(!wp.status || (wp.status !== 'Approved' && wp.status !== 'Supervisor Signed-Off' && wp.status !== 'QA Approved' && wp.status !== 'Submitted for Review' && wp.status !== 'Under Review' && wp.status !== 'In Progress')) && <span className="badge-info">{wp.status || 'Verified'}</span>}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                      <button onClick={() => setInspectWp(wp)} className="btn-secondary" style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem', background: 'rgba(59, 130, 246, 0.18)', color: '#60A5FA' }}>
                        <Eye size={13} /> Inspect WP
                      </button>
                      <button
                        onClick={() => handleStartEdit(wp)}
                        className="btn-secondary"
                        style={{ padding: '0.3rem 0.5rem', background: checkRbacPermission('edit', 'workingPapers') ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255, 255, 255, 0.05)', color: checkRbacPermission('edit', 'workingPapers') ? '#60A5FA' : 'var(--text-muted)' }}
                        title={checkRbacPermission('edit', 'workingPapers') ? "Edit Working Paper (✏️)" : "🔒 RBAC Restricted"}
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => handleDeleteWp(wp.id, wp.title)}
                        className="btn-secondary"
                        style={{ padding: '0.3rem 0.5rem', background: checkRbacPermission('delete', 'workingPapers') ? 'rgba(239, 68, 68, 0.15)' : 'rgba(255, 255, 255, 0.05)', color: checkRbacPermission('delete', 'workingPapers') ? '#F87171' : 'var(--text-muted)' }}
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
          <div className="modal-content" style={{ maxWidth: '850px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.8rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#3B82F6', background: 'rgba(59, 130, 246, 0.15)', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>
                    {inspectWp.id}
                  </span>
                  <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>{inspectWp.title || inspectWp.fileName}</h3>
                </div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem', display: 'block' }}>
                  Golden Thread Link ➔ Engagement: <strong style={{ color: '#fda4af' }}>{inspectWp.linkedAudit}</strong>
                </span>
              </div>
              <button onClick={() => setInspectWp(null)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
            </div>

            {/* Header Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.8rem', marginBottom: '1.5rem', background: 'rgba(0,0,0,0.25)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>Auditor (Prepared By)</span>
                <span style={{ fontSize: '0.88rem', fontWeight: 700 }}>{inspectWp.uploadedBy || 'Lead Senior Auditor'}</span>
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>Reviewer (Supervisory Sign-Off)</span>
                <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#F59E0B' }}>Sarah James (Pending Clearance)</span>
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>Sampling Methodology</span>
                <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#10B981' }}>{inspectWp.samplingMethod || 'Risk-based'} ({inspectWp.sampleSize || '25'}/{inspectWp.populationSize || '2,450'})</span>
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>SHA-256 Checksum Integrity</span>
                <span style={{ fontSize: '0.72rem', fontFamily: 'monospace', color: '#60A5FA', display: 'block', wordBreak: 'break-all' }}>
                  {inspectWp.checksum ? inspectWp.checksum.substring(0, 16) + '...' : 'e3b0c44298fc1c14...'}
                </span>
              </div>
            </div>

            {/* Sample Testing Grid */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  📋 Sample Test Execution Matrix ({sampleRows.length} Tested Samples)
                </h4>
                <button onClick={() => navigate('/findings')} className="btn-secondary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.74rem' }}>
                  <ExternalLink size={12} /> View Linked Findings (FND-2026-004)
                </button>
              </div>
              <div className="data-table-container" style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '6px' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Sample #</th>
                      <th>Sample Test Item Description</th>
                      <th>Expected Result</th>
                      <th>Actual Test Result</th>
                      <th>Exception?</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sampleRows.map(row => (
                      <tr key={row.id}>
                        <td className="tabular-nums" style={{ fontWeight: 700, color: '#3B82F6' }}>{row.id}</td>
                        <td style={{ fontSize: '0.82rem' }}>{row.desc}</td>
                        <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{row.expected}</td>
                        <td style={{ fontSize: '0.82rem', fontWeight: 600 }}>{row.actual}</td>
                        <td>
                          {row.exception === 'Yes' ? (
                            <span className="badge-danger">⚠️ Exception Detected</span>
                          ) : (
                            <span className="badge-success">✓ Passed</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1rem' }}>
              <button onClick={() => setInspectWp(null)} className="btn-secondary">Close Inspector</button>
            </div>
          </div>
        </div>
      )}

      {/* Upload / Edit Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '540px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.4rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>{editingWpId ? 'Edit Working Paper Evidence' : 'Upload Working Paper Evidence'}</h3>
              <button onClick={() => { setIsModalOpen(false); setEditingWpId(null); }} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>✕</button>
            </div>
            <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>Working Paper Title</label>
                <input type="text" required placeholder="e.g. Custody Cash Sweep Verification Spreadsheet Q3" value={title} onChange={e => setTitle(e.target.value)} className="form-input" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>Linked Audit Engagement</label>
                <select value={linkedAudit} onChange={e => setLinkedAudit(e.target.value)} className="form-select">
                  {auditPlans.map(p => (
                    <option key={p.id} value={p.auditName}>{p.auditName}</option>
                  ))}
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>Sampling Methodology</label>
                  <select value={samplingMethod} onChange={e => setSamplingMethod(e.target.value)} className="form-select">
                    <option value="Risk-based">Risk-based Sampling</option>
                    <option value="Random">Random Selection</option>
                    <option value="Judgmental">Judgmental Selection</option>
                    <option value="Systematic">Systematic Interval</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>Sample Size / Population</label>
                  <input type="text" value={sampleSize} onChange={e => setSampleSize(e.target.value)} className="form-input" placeholder="e.g. 25 / 2,450" />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>File Format</label>
                  <select value={fileType} onChange={e => setFileType(e.target.value)} className="form-select">
                    <option value="Excel Workbook (.xlsx)">Excel Workbook (.xlsx)</option>
                    <option value="Word Document (.docx)">Word Document (.docx)</option>
                    <option value="PDF Document (.pdf)">PDF Document (.pdf)</option>
                    <option value="Bank RTGS Statement (.pdf)">Bank RTGS Statement (.pdf)</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>Uploaded By</label>
                  <input type="text" value={uploadedBy} onChange={e => setUploadedBy(e.target.value)} className="form-input" />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.85rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => { setIsModalOpen(false); setEditingWpId(null); }} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">{editingWpId ? 'Save Changes' : 'Upload & Link Evidence'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkingPapers;
