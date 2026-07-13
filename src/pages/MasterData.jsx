import React, { useContext, useState } from 'react';
import { AuditContext } from '../context/AuditContext';
import { Database, Plus, Search, Layers, ShieldCheck, Filter } from 'lucide-react';

const MasterData = () => {
  const { businessUnits, addBusinessUnit, auditUniverse, setAuditUniverse, addNotification } = useContext(AuditContext);
  const [activeTab, setActiveTab] = useState('bus'); // 'bus' or 'universe'
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBu, setFilterBu] = useState('All');

  // New BU Modal State
  const [isBuModalOpen, setIsBuModalOpen] = useState(false);
  const [newBuName, setNewBuName] = useState('');
  const [newBuHead, setNewBuHead] = useState('');
  const [newBuCode, setNewBuCode] = useState('');
  const [newBuRisk, setNewBuRisk] = useState('Medium');

  // New Universe Process Modal State
  const [isProcessModalOpen, setIsProcessModalOpen] = useState(false);
  const [procName, setProcName] = useState('');
  const [procBu, setProcBu] = useState('Operations');
  const [procCode, setProcCode] = useState('');
  const [procLead, setProcLead] = useState('Tunde Bakare (Senior Auditor)');
  const [procFreq, setProcFreq] = useState('Quarterly');

  const filteredBus = businessUnits.filter(bu => 
    bu.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bu.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bu.head.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUniverse = auditUniverse.filter(item => {
    const matchesSearch = item.processName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.leadAuditor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBu = filterBu === 'All' || item.businessUnit === filterBu;
    return matchesSearch && matchesBu;
  });

  const handleCreateBu = (e) => {
    e.preventDefault();
    if (!newBuName || !newBuCode) return;
    addBusinessUnit({
      name: newBuName,
      head: newBuHead || 'Unassigned Lead',
      code: newBuCode.toUpperCase(),
      staffCount: 15,
      riskLevel: newBuRisk
    });
    setNewBuName('');
    setNewBuHead('');
    setNewBuCode('');
    setIsBuModalOpen(false);
  };

  const handleCreateProcess = (e) => {
    e.preventDefault();
    if (!procName || !procCode) return;
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
    setProcName('');
    setProcCode('');
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
      <div className="nav-tab-container">
        <button
          onClick={() => { setActiveTab('bus'); setSearchTerm(''); }}
          className={`nav-tab-btn ${activeTab === 'bus' ? 'active' : ''}`}
        >
          <Database size={16} />
          <span>Business Units ({businessUnits.length})</span>
        </button>
        <button
          onClick={() => { setActiveTab('universe'); setSearchTerm(''); }}
          className={`nav-tab-btn ${activeTab === 'universe' ? 'active' : ''}`}
        >
          <Layers size={16} />
          <span>Audit Universe Processes ({auditUniverse.length})</span>
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
                </tr>
              </thead>
              <tbody>
                {filteredBus.map(bu => (
                  <tr key={bu.id}>
                    <td className="tabular-nums" style={{ fontWeight: 800, color: '#fda4af' }}>{bu.code}</td>
                    <td style={{ fontWeight: 700, fontSize: '0.95rem' }}>{bu.name}</td>
                    <td>{bu.head}</td>
                    <td className="tabular-nums">{bu.staffCount} Staff</td>
                    <td>
                      {bu.riskLevel === 'Critical' && <span className="badge-danger">Critical Risk</span>}
                      {bu.riskLevel === 'High' && <span className="badge-warning">High Risk</span>}
                      {bu.riskLevel === 'Medium' && <span className="badge-info">Medium Risk</span>}
                      {bu.riskLevel === 'Low' && <span className="badge-success">Low Risk</span>}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <div className="progress-container" style={{ width: '90px', height: '6px' }}>
                          <div
                            className={`progress-fill ${bu.coveragePct >= 90 ? 'emerald' : bu.coveragePct >= 80 ? 'blue' : 'amber'}`}
                            style={{ width: `${bu.coveragePct}%` }}
                          />
                        </div>
                        <span className="tabular-nums" style={{ fontWeight: 700 }}>{bu.coveragePct}%</span>
                      </div>
                    </td>
                    <td>
                      <span className="badge-success">Active Universe</span>
                    </td>
                  </tr>
                ))}
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
                </tr>
              </thead>
              <tbody>
                {filteredUniverse.map(item => (
                  <tr key={item.id}>
                    <td className="tabular-nums" style={{ fontWeight: 800, color: '#3B82F6' }}>{item.code}</td>
                    <td style={{ fontWeight: 700 }}>{item.processName}</td>
                    <td><span className="badge-chip-purple">{item.businessUnit}</span></td>
                    <td className="tabular-nums">{item.frequency}</td>
                    <td className="tabular-nums" style={{ color: 'var(--text-muted)' }}>{item.lastAudited}</td>
                    <td style={{ fontSize: '0.84rem' }}>{item.leadAuditor}</td>
                    <td>
                      <span className="badge-success">Auditable Unit</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* New BU Modal */}
      {isBuModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '520px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.4rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>Add New Business Unit</h3>
              <button onClick={() => setIsBuModalOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>✕</button>
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
                <input type="text" required placeholder="e.g. Ibrahim Al-Hassan" value={newBuHead} onChange={e => setNewBuHead(e.target.value)} className="form-input" />
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
                <button type="button" onClick={() => setIsBuModalOpen(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Create Business Unit</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Process Modal */}
      {isProcessModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '560px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.4rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>Add Auditable Process to Universe</h3>
              <button onClick={() => setIsProcessModalOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>✕</button>
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
                <button type="button" onClick={() => setIsProcessModalOpen(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Add to Universe</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MasterData;
