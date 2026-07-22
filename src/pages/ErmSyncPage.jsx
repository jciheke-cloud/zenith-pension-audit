import React, { useContext, useState } from 'react';
import { AuditContext } from '../context/AuditContext';
import { Share2, RefreshCw, ShieldCheck, CheckCircle, Database, Layers, ArrowRight, AlertOctagon } from 'lucide-react';
import AuditDataUpload from '../components/AuditDataUpload';

const ErmSyncPage = () => {
  const { auditUniverse, findings, clearAllMockData, syncFromErmSuite, bulkUploadRecords, addNotification } = useContext(AuditContext);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState('2 minutes ago');
  const [syncHistory, setSyncHistory] = useState([
    { id: 'sh-1', event: 'Audit Universe Sync to ERM Risk Register', status: 'Success', itemsCount: auditUniverse.length, time: '2 mins ago' },
    { id: 'sh-2', event: '10×10 Residual Risk Score Calibration Push', status: 'Success', itemsCount: findings.length, time: '15 mins ago' },
    { id: 'sh-3', event: 'CAP Remediation Status Pull from ERM Action Owners', status: 'Success', itemsCount: 12, time: '1 hour ago' }
  ]);

  const [csvInput, setCsvInput] = useState('');
  const [uploadType, setUploadType] = useState('findings');

  const handleForceSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      const nowStr = new Date().toLocaleTimeString();
      setLastSyncTime('Just now');
      syncFromErmSuite && syncFromErmSuite();
      setSyncHistory(prev => [
        { id: `sh-${Date.now()}`, event: 'Direct Live ERM -> Audit Risk & Universe Ingestion', status: 'Success', itemsCount: auditUniverse.length + findings.length, time: `Today at ${nowStr}` },
        ...prev
      ]);
    }, 1000);
  };

  const handleDownloadTemplate = (type) => {
    let content = '';
    let filename = '';
    if (type === 'findings') {
      content = 'findingNumber,businessUnit,observation,criteria,rootCause,likelihood,impact,status\nFND-2026-101,Settlements & Corporate Actions,Unreconciled Dividend Sweep Variance,PENCOM Section 63 Guidelines,System timeout during clearing,7,8,Open\nFND-2026-102,Contribution Reconciliation Dept,24h Employer Contribution Schedule Delay,SLA Breach Prevention Circular,Portal schedule ingestion lag,6,8,Open';
      filename = 'RiskINTEGRA_Audit_Findings_Template.csv';
    } else if (type === 'universe') {
      content = 'unitId,department,processName,inherentRisk,financialExposure,regulatoryImpact\nUNIV-101,Treasury & Markets,Money Market Placement & Haircut Controls,8,9,8\nUNIV-102,IT & Cybersecurity,Core Banking & Custody DB Failover,9,8,9';
      filename = 'RiskINTEGRA_Audit_Universe_Template.csv';
    } else {
      content = 'id,auditName,department,plannedHours,status\nPLAN-2026-01,Annual Custody Operations Review,Pension Operations,320,Approved\nPLAN-2026-02,RMAS Cybersecurity Penetration Test,IT & Cybersecurity,240,Approved';
      filename = 'RiskINTEGRA_Annual_Plans_Template.csv';
    }
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleProcessCsv = (e) => {
    e.preventDefault();
    if (!csvInput.trim()) return;
    const lines = csvInput.trim().split('\n');
    if (lines.length < 2) {
      addNotification('CSV Processing Failure', 'Please provide at least one header row and one data row in CSV format.', 'warning');
      return;
    }
    const headers = lines[0].split(',').map(h => h.trim());
    const parsedRecords = [];
    for (let i = 1; i < lines.length; i++) {
      const vals = lines[i].split(',').map(v => v.trim());
      if (vals.length === headers.length) {
        const obj = {};
        headers.forEach((h, idx) => { obj[h] = vals[idx]; });
        parsedRecords.push(obj);
      }
    }
    if (parsedRecords.length > 0) {
      bulkUploadRecords && bulkUploadRecords(uploadType, parsedRecords);
      setCsvInput('');
    } else {
      addNotification('CSV Parsing Failure', 'Could not parse valid CSV records. Please check format against the template.', 'danger');
    }
  };

  return (
    <div className="page-container">
      <div className="module-header">
        <div>
          <h1 className="module-title">RiskINTEGRA ERM Sync Bridge & Data Hub™</h1>
          <p className="module-subtitle">
            Direct bi-directional data ingestion from RiskINTEGRA ERM, bulk CSV/Excel upload hub, and production readiness manager.
          </p>
        </div>
        <div className="header-actions" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={handleForceSync}
            disabled={isSyncing}
            className="btn-primary"
            style={{ padding: '0.6rem 1.25rem', fontSize: '0.9rem', background: 'linear-gradient(135deg, #10B981, #059669)' }}
          >
            <RefreshCw size={18} className={isSyncing ? 'animate-spin' : ''} />
            <span>{isSyncing ? 'Ingesting Live ERM Data...' : 'Sync Data Directly From ERM'}</span>
          </button>
        </div>
      </div>

      {/* Sync Bridge Architectural Showcase */}
      <div className="glass-card" style={{ marginBottom: '2rem', background: 'linear-gradient(135deg, rgba(200, 30, 30, 0.18) 0%, rgba(15, 23, 42, 0.95) 100%)', border: '1px solid rgba(200, 30, 30, 0.5)' }}>
        <div className="flex-between" style={{ flexWrap: 'wrap', gap: '1.5rem' }}>
          <div style={{ maxWidth: '600px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
              <Share2 size={24} color="#C81E1E" />
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#fda4af', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Integrated Risk Architecture
              </span>
            </div>
            <h2 style={{ margin: '0 0 0.6rem', fontSize: '1.6rem', fontWeight: 800, color: 'white' }}>
              RiskINTEGRA Audit™ ➔ RiskINTEGRA ERM™
            </h2>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              Instead of operating in functional silos, ZPC Internal Audit and Risk Management share an interconnected database foundation. When auditors identify control breakdowns on the <strong>10×10 matrix</strong>, residual risk scores in the <strong>ERM Risk Register</strong> automatically adjust up or down in real time.
            </p>
          </div>

          <div style={{ background: 'rgba(18, 26, 41, 0.65)', padding: '1.4rem 1.8rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', borderTop: '1px solid rgba(148, 163, 184, 0.38)', display: 'flex', flexDirection: 'column', gap: '0.6rem', minWidth: '280px' }}>
            <div className="flex-between">
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Connection Status</span>
              <span className="badge-success">● Active / Live Socket</span>
            </div>
            <div className="flex-between">
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Last Payload Exchange</span>
              <span style={{ fontWeight: 800, color: '#fda4af' }}>{lastSyncTime}</span>
            </div>
            <div className="flex-between">
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Target ERM Endpoint</span>
              <span style={{ fontSize: '0.78rem', color: '#60a5fa', fontWeight: 600 }}>RiskINTEGRA™ ERM Cloud Bridge (AWS Infrastructure)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Pillar Mapping Grid */}
      <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="glass-card" style={{ padding: '1.5rem', borderTop: '4px solid #3B82F6' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.8rem' }}>
            <Database size={24} color="#3B82F6" />
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>Audit Universe ➔ ERM Risk Register</h3>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6', margin: '0 0 1rem' }}>
            Every auditable process defined in Master Data (`Operations`, `Custody Asset Safekeeping`, `SWIFT Gateway`) maps 1:1 to a risk universe entry in the ZPC Enterprise Risk Register.
          </p>
          <span className="badge-chip-info">14 Linked Universe Processes</span>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', borderTop: '4px solid #EF4444' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.8rem' }}>
            <AlertOctagon size={24} color="#EF4444" />
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>10×10 Findings ➔ Residual Risk Heat Map</h3>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6', margin: '0 0 1rem' }}>
            Whenever a critical finding is logged with Likelihood × Impact &ge; 80, the ERM heat map automatically highlights the department in Red and prompts executive risk review.
          </p>
          <span className="badge-chip-danger">{findings.filter(f => f.priority === 'Critical').length} Live Score Overrides</span>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', borderTop: '4px solid #10B981' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.8rem' }}>
            <ShieldCheck size={24} color="#10B981" />
            <h3 style={{ margin: '0 0 0.8rem', fontSize: '1.1rem', fontWeight: 800 }}>CAP Trackers ➔ Key Risk Indicators (KRIs)</h3>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6', margin: '0 0 1rem' }}>
            As action owners remediate CAPs and auditors pass retesting validation (`Closed status`), operational risk KRI metrics decrease, lowering statutory capital requirement projections.
          </p>
          <span className="badge-success">100% KRI Sync Active</span>
        </div>
      </div>

      {/* Sync History Log Table */}
      <div className="glass-card">
        <div className="section-header-bar">
          <div>
            <h3 className="section-title">Bi-Directional Payload Exchange History</h3>
            <p className="section-subtitle">Real-time audit trail of data streaming between Audit and ERM applications</p>
          </div>
        </div>

        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Sync Event Ref</th>
                <th>Exchange Description</th>
                <th>Records Synchronized</th>
                <th>Timestamp</th>
                <th>Transaction Status</th>
              </tr>
            </thead>
            <tbody>
              {syncHistory.map(item => (
                <tr key={item.id}>
                  <td className="tabular-nums" style={{ fontWeight: 800, color: '#60a5fa' }}>{item.id}</td>
                  <td style={{ fontWeight: 700 }}>{item.event}</td>
                  <td className="tabular-nums" style={{ fontWeight: 800 }}>{item.itemsCount} Records</td>
                  <td className="tabular-nums" style={{ color: 'var(--text-muted)' }}>{item.time}</td>
                  <td>
                    <span className="badge-success">✓ {item.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Enterprise Bulk CSV/Excel Upload & Templates Hub */}
      <div className="glass-card" style={{ marginTop: '2rem', borderTop: '4px solid #10B981' }}>
        <div className="section-header-bar">
          <div>
            <h3 className="section-title">📦 Enterprise Bulk Data Ingestion & Templates Hub</h3>
            <p className="section-subtitle">
              Download standard PENCOM/IIA CSV/Excel templates to populate hundreds of audit findings, auditable universe items, or annual audit plans without manual single entry.
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          <button onClick={() => handleDownloadTemplate('findings')} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.85rem 1.1rem', justifyContent: 'center' }}>
            <span>📄 Download Findings Template (.csv)</span>
          </button>
          <button onClick={() => handleDownloadTemplate('universe')} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.85rem 1.1rem', justifyContent: 'center' }}>
            <span>🏛️ Download Universe Template (.csv)</span>
          </button>
          <button onClick={() => handleDownloadTemplate('plans')} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.85rem 1.1rem', justifyContent: 'center' }}>
            <span>📋 Download Audit Plans Template (.csv)</span>
          </button>
        </div>

        <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>1. Select Target Ingestion Module:</span>
            <select
              value={uploadType}
              onChange={(e) => setUploadType(e.target.value)}
              style={{ padding: '0.45rem 0.85rem', background: 'rgba(18, 26, 41, 0.85)', color: 'white', border: '1px solid var(--border-color)', borderRadius: '0.35rem', fontSize: '0.85rem', fontWeight: 700 }}
            >
              <option value="findings">Audit Findings (10×10 Matrix)</option>
              <option value="universe">Auditable Universe (Master Data)</option>
              <option value="plans">Annual Audit Plans</option>
            </select>
          </div>
          
          <div style={{ marginTop: '0.5rem' }}>
            <AuditDataUpload targetModule={uploadType} buttonText={`Launch Batch ${uploadType.toUpperCase()} Uploader`} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErmSyncPage;
