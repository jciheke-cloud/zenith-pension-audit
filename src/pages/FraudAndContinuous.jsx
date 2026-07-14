import React, { useContext, useState } from 'react';
import { AuditContext } from '../context/AuditContext';
import { Eye, ShieldAlert, Plus, AlertOctagon, CheckCircle, Clock, RefreshCw, Layers } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FraudAndContinuous = () => {
  const { fraudCases, setFraudCases, continuousExceptions, setContinuousExceptions, saveFinding, addNotification } = useContext(AuditContext);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('continuous'); // 'continuous' or 'fraud'
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Fraud Case State
  const [title, setTitle] = useState('');
  const [dept, setDept] = useState('Custody Operations');
  const [impact, setImpact] = useState('₦8,500,000');
  const [recovered, setRecovered] = useState('₦4,200,000');
  const [status, setStatus] = useState('Under Investigation');

  const handleCreateCase = (e) => {
    e.preventDefault();
    if (!title) return;
    const newCase = {
      id: `FRD-2026-${String(fraudCases.length + 1).padStart(2, '0')}`,
      title,
      department: dept,
      dateOpened: new Date().toISOString().split('T')[0],
      financialImpact: impact,
      recoveredAmount: recovered,
      status,
      investigator: 'Forensic Audit & Internal Security'
    };
    setFraudCases(prev => [newCase, ...prev]);
    addNotification('Fraud Investigation Logged', `Case ${newCase.id} (${newCase.title}) initiated.`, 'danger');
    setIsModalOpen(false);
    setTitle('');
  };

  const handleClearException = (id) => {
    setContinuousExceptions(prev => prev.map(ex => {
      if (ex.id === id) return { ...ex, status: 'Cleared / Verified Normal' };
      return ex;
    }));
    addNotification('Continuous Exception Cleared', `Exception ${id} verified as legitimate operational override.`, 'info');
  };

  const handleEscalateExceptionToFinding = (ex) => {
    saveFinding({
      businessUnit: ex.department || 'Custody Operations',
      observation: `Continuous Auditing Triggered Exception: ${ex.ruleName} (${ex.details})`,
      rootCause: 'Automated continuous monitoring rule detected systemic control bypass or SoD violation.',
      criteria: 'IIA Continuous Auditing Framework & ZPC Information Security Policy Section 8.1.',
      riskImpact: 'High potential for unauthorized financial transaction or asset misappropriation.',
      likelihood: 9,
      impact: 8,
      managementResponse: 'Escalated from Continuous Auditing exception feed for immediate root cause remediation.',
      actionOwner: 'Head of ICT & Custody Operations',
      targetDate: '2026-07-30',
      status: 'Open'
    });
    // Mark exception escalated
    setContinuousExceptions(prev => prev.map(item => {
      if (item.id === ex.id) return { ...item, status: 'Escalated to 10×10 Finding' };
      return item;
    }));
  };

  return (
    <div className="page-container">
      <div className="module-header">
        <div>
          <h1 className="module-title">Fraud Investigation & Continuous Auditing Monitoring</h1>
          <p className="module-subtitle">
            Forensic tracking of internal irregularities and automated 24/7 continuous auditing script exception feeds across ZPC core databases.
          </p>
        </div>
        <div className="header-actions">
          {activeTab === 'fraud' ? (
            <button onClick={() => setIsModalOpen(true)} className="btn-primary">
              <Plus size={16} />
              <span>Log Fraud Investigation Case</span>
            </button>
          ) : (
            <button onClick={() => addNotification('Continuous Scripts Run', 'All 18 automated continuous auditing verification scripts executed successfully across RTGS and SWIFT logs.', 'success')} className="btn-secondary">
              <RefreshCw size={16} />
              <span>Run Continuous Audit Scripts Now</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="nav-tab-container" style={{ flexWrap: 'wrap' }}>
        <button
          onClick={() => setActiveTab('continuous')}
          className={`nav-tab-btn ${activeTab === 'continuous' ? 'active' : ''}`}
          style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}
          title={`Click to monitor automated real-time transaction anomalies (` + continuousExceptions.filter(e => e.status !== 'Cleared / Verified Normal').length + ` active exception alerts).`}
        >
          <Eye size={16} />
          <span style={{ fontWeight: 600 }}>Continuous Auditing Exception Feed</span>
          <span className="badge-chip" style={{ background: 'rgba(255, 255, 255, 0.12)', fontSize: '0.72rem', padding: '0.15rem 0.5rem', borderRadius: '12px' }}>
            {continuousExceptions.filter(e => e.status !== 'Cleared / Verified Normal').length} Active Alerts
          </span>
        </button>
        <button
          onClick={() => setActiveTab('fraud')}
          className={`nav-tab-btn ${activeTab === 'fraud' ? 'active' : ''}`}
          style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}
          title={`Click to review confidential forensic investigations and whistleblowing cases (${fraudCases.length} open/closed cases).`}
        >
          <ShieldAlert size={16} />
          <span style={{ fontWeight: 600 }}>Forensic Fraud Investigations</span>
          <span className="badge-chip" style={{ background: 'rgba(255, 255, 255, 0.12)', fontSize: '0.72rem', padding: '0.15rem 0.5rem', borderRadius: '12px' }}>
            {fraudCases.length} Cases
          </span>
        </button>
      </div>

      {activeTab === 'continuous' ? (
        <div className="glass-card">
          <div className="section-header-bar">
            <div>
              <h3 className="section-title">24/7 Automated Script Exception Alerts</h3>
              <p className="section-subtitle">Real-time detection of Maker/Checker segregation of duties (SoD) breaches, dormant account activity, and RTGS mismatches</p>
            </div>
            <span className="badge-chip-danger">Live Script Engine Active</span>
          </div>

          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Alert Ref</th>
                  <th>Monitoring Rule Name</th>
                  <th>Triggered Details & Evidence</th>
                  <th>Department</th>
                  <th>Severity Tier</th>
                  <th>Timestamp</th>
                  <th>Current Status</th>
                  <th>Resolution / Action</th>
                </tr>
              </thead>
              <tbody>
                {continuousExceptions.map(ex => (
                  <tr key={ex.id}>
                    <td className="tabular-nums" style={{ fontWeight: 800, color: '#fda4af' }}>{ex.id}</td>
                    <td style={{ fontWeight: 700, fontSize: '0.92rem', color: 'white' }}>{ex.ruleName || 'Continuous Auditing Alert Rule'}</td>
                    <td style={{ maxWidth: '340px', fontSize: '0.84rem', lineHeight: '1.5', color: 'var(--text-secondary)' }}>{ex.details || 'Automated KRI / SLA exception flagged.'}</td>
                    <td>{ex.department || 'Operations'}</td>
                    <td>
                      {ex.severity === 'Critical' && <span className="badge-danger">Critical Severity</span>}
                      {ex.severity === 'High' && <span className="badge-warning">High Severity</span>}
                      {(!ex.severity || ex.severity === 'Medium' || ex.severity === 'Low') && <span className="badge-info">{ex.severity || 'Medium'} Severity</span>}
                    </td>
                    <td className="tabular-nums" style={{ color: 'var(--text-muted)' }}>{ex.timestamp || '2026-07-13'}</td>
                    <td>
                      {(ex.status === 'Under Review' || ex.status?.includes('Investigation') || ex.status?.includes('Open')) && <span className="badge-warning">{ex.status || 'Under Review'}</span>}
                      {(ex.status === 'Cleared / Verified Normal' || ex.status?.includes('Resolved') || ex.status?.includes('Cleared')) && <span className="badge-success">Cleared / Verified</span>}
                      {(ex.status === 'Escalated to 10×10 Finding' || ex.status?.includes('Escalated') || ex.status?.includes('Flagged')) && <span className="badge-danger">{ex.status || 'Escalated'}</span>}
                      {(!ex.status || (!ex.status.includes('Review') && !ex.status.includes('Investigation') && !ex.status.includes('Open') && !ex.status.includes('Cleared') && !ex.status.includes('Resolved') && !ex.status.includes('Escalated') && !ex.status.includes('Flagged'))) && <span className="badge-info">{ex.status || 'Active Alert'}</span>}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                        {ex.status === 'Under Review' && (
                          <>
                            <button onClick={() => handleClearException(ex.id)} className="btn-success" style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem' }}>
                              ✓ Clear Exception
                            </button>
                            <button onClick={() => handleEscalateExceptionToFinding(ex)} className="btn-primary" style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem' }}>
                              <AlertOctagon size={13} /> Escalate to Finding
                            </button>
                          </>
                        )}
                        {ex.status !== 'Under Review' && (
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Processed</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Fraud Cases Table */
        <div className="glass-card">
          <div className="section-header-bar">
            <div>
              <h3 className="section-title">Forensic Fraud Investigation Register</h3>
              <p className="section-subtitle">Tracking suspected irregularities, asset recovery progress, and disciplinary referrals</p>
            </div>
            <span className="badge-chip-danger">Confidential Forensic Portal</span>
          </div>

          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Case ID</th>
                  <th>Investigation Title & Irregularity Detail</th>
                  <th>Department</th>
                  <th>Date Opened</th>
                  <th>Financial Impact</th>
                  <th>Recovered Amount</th>
                  <th>Assigned Forensic Lead</th>
                  <th>Investigation Status</th>
                </tr>
              </thead>
              <tbody>
                {fraudCases.map(fc => (
                  <tr key={fc.id}>
                    <td className="tabular-nums" style={{ fontWeight: 800, color: '#EF4444' }}>{fc.id}</td>
                    <td style={{ fontWeight: 700, fontSize: '0.95rem' }}>{fc.title || fc.caseTitle || 'Suspicious Activity / Irregularity Investigation'}</td>
                    <td>{fc.department || 'Operations'}</td>
                    <td className="tabular-nums">{fc.dateOpened || fc.reportedDate || '2026-04-10'}</td>
                    <td className="tabular-nums" style={{ fontWeight: 800, color: '#fca5a5' }}>{fc.financialImpact !== undefined ? fc.financialImpact : 4.5}</td>
                    <td className="tabular-nums" style={{ fontWeight: 800, color: '#34d399' }}>{fc.recoveredAmount !== undefined ? fc.recoveredAmount : 4.5}</td>
                    <td style={{ fontSize: '0.84rem' }}>{fc.investigator || fc.leadInvestigator || 'Head of Fraud & Forensics'}</td>
                    <td>
                      {(fc.status === 'Under Investigation' || fc.status?.includes('Investigation')) && <span className="badge-danger">Under Investigation</span>}
                      {(fc.status === 'Referred to Law Enforcement / EFCC' || fc.status?.includes('Referred')) && <span className="badge-warning">Referred to EFCC</span>}
                      {(fc.status === 'Closed - Remediated' || fc.status?.includes('Closed') || fc.status?.includes('Substantiated')) && <span className="badge-success">Closed & Remediated</span>}
                      {(!fc.status || (!fc.status.includes('Investigation') && !fc.status.includes('Referred') && !fc.status.includes('Closed') && !fc.status.includes('Substantiated'))) && <span className="badge-info">{fc.status || 'Active Case'}</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '560px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.4rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>Initiate Fraud Investigation Case</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>✕</button>
            </div>
            <form onSubmit={handleCreateCase} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>Investigation Title / Suspected Irregularity</label>
                <input type="text" required placeholder="e.g. Unauthorized Fee Reversal & Duplicate Sweep Attempt" value={title} onChange={e => setTitle(e.target.value)} className="form-input" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>Department</label>
                  <input type="text" value={dept} onChange={e => setDept(e.target.value)} className="form-input" required />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>Status</label>
                  <select value={status} onChange={e => setStatus(e.target.value)} className="form-select">
                    <option value="Under Investigation">Under Investigation</option>
                    <option value="Referred to Law Enforcement / EFCC">Referred to EFCC / Police</option>
                    <option value="Closed - Remediated">Closed - Remediated</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>Potential Financial Impact</label>
                  <input type="text" value={impact} onChange={e => setImpact(e.target.value)} className="form-input" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>Recovered / Frozen Amount</label>
                  <input type="text" value={recovered} onChange={e => setRecovered(e.target.value)} className="form-input" />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.85rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Initiate Case</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FraudAndContinuous;
