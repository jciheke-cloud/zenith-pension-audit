import React, { useContext, useState } from 'react';
import { AuditContext } from '../context/AuditContext';
import { Share2, RefreshCw, ShieldCheck, CheckCircle, Database, Layers, ArrowRight, AlertOctagon } from 'lucide-react';

const ErmSyncPage = () => {
  const { auditUniverse, findings, addNotification } = useContext(AuditContext);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState('2 minutes ago');
  const [syncHistory, setSyncHistory] = useState([
    { id: 'sh-1', event: 'Audit Universe Sync to ERM Risk Register', status: 'Success', itemsCount: auditUniverse.length, time: '2 mins ago' },
    { id: 'sh-2', event: '10×10 Residual Risk Score Calibration Push', status: 'Success', itemsCount: findings.length, time: '15 mins ago' },
    { id: 'sh-3', event: 'CAP Remediation Status Pull from ERM Action Owners', status: 'Success', itemsCount: 12, time: '1 hour ago' }
  ]);

  const handleForceSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      const nowStr = new Date().toLocaleTimeString();
      setLastSyncTime('Just now');
      setSyncHistory(prev => [
        { id: `sh-${Date.now()}`, event: 'Bi-Directional Full Ecosystem Payload Exchange', status: 'Success', itemsCount: auditUniverse.length + findings.length, time: `Today at ${nowStr}` },
        ...prev
      ]);
      addNotification('Ecosystem Synchronized', 'All audit findings, 10×10 residual scores, and master data successfully synchronized with RiskINTEGRA ERM.', 'success');
    }, 1200);
  };

  return (
    <div className="page-container">
      <div className="module-header">
        <div>
          <h1 className="module-title">RiskINTEGRA ERM Sync Bridge™</h1>
          <p className="module-subtitle">
            Seamless bi-directional data exchange connecting the Internal Audit Management Application with the Enterprise Risk Management (ERM) suite.
          </p>
        </div>
        <div className="header-actions">
          <button
            onClick={handleForceSync}
            disabled={isSyncing}
            className="btn-primary"
            style={{ padding: '0.6rem 1.25rem', fontSize: '0.9rem' }}
          >
            <RefreshCw size={18} className={isSyncing ? 'animate-spin' : ''} />
            <span>{isSyncing ? 'Exchanging Data Payloads...' : 'Force ERM Synchronization Now'}</span>
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

          <div style={{ background: 'rgba(0,0,0,0.5)', padding: '1.4rem 1.8rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', gap: '0.6rem', minWidth: '280px' }}>
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
              <span style={{ fontSize: '0.78rem', color: '#60a5fa', fontWeight: 600 }}>zenith_pensions_erm (Port 5173)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Pillar Mapping Grid */}
      <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
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
    </div>
  );
};

export default ErmSyncPage;
