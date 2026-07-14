import React, { useContext, useState } from 'react';
import { AuditContext } from '../context/AuditContext';
import { Scale, ShieldAlert, CheckCircle, Clock, Plus, FileText, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ComplianceAndRegulatory = () => {
  const { regulatoryReviews, setRegulatoryReviews, addNotification } = useContext(AuditContext);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Regulatory Review Form
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('PenCom (National Pension Commission)');
  const [date, setDate] = useState('2026-06-15');
  const [findingsCount, setFindingsCount] = useState(4);
  const [status, setStatus] = useState('Remediation Underway');

  const filteredReviews = regulatoryReviews.filter(r => {
    if (activeTab === 'All') return true;
    return r.regulatoryBody?.includes(activeTab);
  });

  const handleAddReview = (e) => {
    e.preventDefault();
    if (!title) return;
    const newRev = {
      id: `reg-${Date.now()}`,
      title,
      regulatoryBody: body,
      date,
      findingsCount: parseInt(findingsCount, 10),
      status,
      leadReviewer: 'Chief Compliance Officer / CAE'
    };
    setRegulatoryReviews(prev => [newRev, ...prev]);
    addNotification('Regulatory Examination Logged', `${body} review "${title}" logged with ${findingsCount} observations.`, 'warning');
    setIsModalOpen(false);
    setTitle('');
  };

  return (
    <div className="page-container">
      <div className="module-header">
        <div>
          <h1 className="module-title">Compliance Testing & Regulatory Review Module</h1>
          <p className="module-subtitle">
            Dedicated oversight portal tracking external examination observations from PenCom, CBN, and Statutory Auditors with Issue Validation retesting.
          </p>
        </div>
        <div className="header-actions">
          <button onClick={() => setIsModalOpen(true)} className="btn-primary">
            <Plus size={16} />
            <span>Log External Regulatory Inspection</span>
          </button>
        </div>
      </div>

      {/* Regulatory Summary Banner */}
      <div className="glass-card" style={{ marginBottom: '1.75rem', borderLeft: '6px solid #3B82F6', background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.95) 100%)' }}>
        <div className="flex-between" style={{ flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
            <Scale size={38} color="#60a5fa" />
            <div>
              <span className="badge-chip-info" style={{ marginBottom: '0.4rem', display: 'inline-block' }}>External Assurance Tracking</span>
              <h3 style={{ margin: '0 0 0.4rem', fontSize: '1.35rem', fontWeight: 800 }}>Nigerian Pension Industry Regulatory Readiness</h3>
              <p style={{ margin: 0, fontSize: '0.86rem', color: 'var(--text-secondary)', maxWidth: '750px', lineHeight: '1.5' }}>
                All observations raised during National Pension Commission (PenCom) Risk-Based Examinations and Central Bank of Nigeria (CBN) RTGS inspections must undergo mandatory internal audit validation before official closure with regulators.
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Total External Reviews</span>
              <span className="tabular-nums" style={{ fontSize: '1.5rem', fontWeight: 800, color: '#3B82F6' }}>{regulatoryReviews.length}</span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Total Regulatory Issues</span>
              <span className="tabular-nums" style={{ fontSize: '1.5rem', fontWeight: 800, color: '#F59E0B' }}>
                {regulatoryReviews.reduce((acc, curr) => acc + (curr.findingsCount || 0), 0)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="nav-tab-container" style={{ flexWrap: 'wrap' }}>
        {['All', 'PenCom', 'CBN', 'Statutory / External Audit'].map(t => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`nav-tab-btn ${activeTab === t ? 'active' : ''}`}
            title={`Filter regulatory examination findings by authority: ${t === 'All' ? 'All Regulatory Bodies (PenCom, CBN, External Audit)' : t}.`}
          >
            <span style={{ fontWeight: 600 }}>{t === 'All' ? 'All Regulatory Bodies' : t}</span>
          </button>
        ))}
      </div>

      {/* Regulatory Table */}
      <div className="glass-card">
        <div className="section-header-bar">
          <div>
            <h3 className="section-title">Regulatory & External Examination Register</h3>
            <p className="section-subtitle">Retesting verification status and statutory report tracking</p>
          </div>
        </div>

        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Review ID</th>
                <th>Examination / Inspection Title</th>
                <th>Regulatory Body / Authority</th>
                <th>Examination Date</th>
                <th>Issues Raised</th>
                <th>Assigned Internal Reviewer</th>
                <th>Remediation & Retesting Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReviews.map(rev => (
                <tr key={rev.id}>
                  <td className="tabular-nums" style={{ fontWeight: 800, color: '#60a5fa' }}>{rev.id}</td>
                  <td style={{ fontWeight: 700, fontSize: '0.95rem' }}>{rev.title}</td>
                  <td>
                    <span className="badge-chip-purple">{rev.regulatoryBody}</span>
                  </td>
                  <td className="tabular-nums" style={{ color: 'var(--text-muted)' }}>{rev.date}</td>
                  <td className="tabular-nums" style={{ fontWeight: 800, fontSize: '1.05rem', color: rev.findingsCount > 0 ? '#F59E0B' : '#10B981' }}>
                    {rev.findingsCount} Issues
                  </td>
                  <td style={{ fontSize: '0.84rem' }}>{rev.leadReviewer}</td>
                  <td>
                    {rev.status === 'Completed & Cleared' && <span className="badge-success">✓ Completed & Cleared</span>}
                    {rev.status === 'Remediation Underway' && <span className="badge-warning">Remediation Underway</span>}
                    {rev.status === 'Awaiting Internal Validation' && <span className="badge-info">Awaiting Validation</span>}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button onClick={() => navigate('/action-tracker')} className="btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}>
                        Retest Issues ➔
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '560px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.4rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>Log External Regulatory Review / Examination</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>✕</button>
            </div>
            <form onSubmit={handleAddReview} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>Examination Title</label>
                <input type="text" required placeholder="e.g. 2026 PenCom Routine Risk-Based Examination" value={title} onChange={e => setTitle(e.target.value)} className="form-input" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>Regulatory Authority</label>
                  <select value={body} onChange={e => setBody(e.target.value)} className="form-select">
                    <option value="PenCom (National Pension Commission)">PenCom (National Pension Commission)</option>
                    <option value="CBN (Central Bank of Nigeria)">CBN (Central Bank of Nigeria)</option>
                    <option value="Statutory / External Audit (PwC/KPMG)">Statutory External Audit</option>
                    <option value="ISO Surveillance Body">ISO Surveillance Body</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>Examination Date</label>
                  <input type="date" value={date} onChange={e => setDate(e.target.value)} className="form-input" required />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>Issues Raised Count</label>
                  <input type="number" value={findingsCount} onChange={e => setFindingsCount(e.target.value)} className="form-input" required />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>Status</label>
                  <select value={status} onChange={e => setStatus(e.target.value)} className="form-select">
                    <option value="Remediation Underway">Remediation Underway</option>
                    <option value="Awaiting Internal Validation">Awaiting Internal Validation</option>
                    <option value="Completed & Cleared">Completed & Cleared</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.85rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Save Inspection</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplianceAndRegulatory;
