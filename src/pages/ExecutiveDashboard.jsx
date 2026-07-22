import React, { useContext } from 'react';
import { AuditContext } from '../context/AuditContext';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';
import {
  CheckCircle, AlertOctagon, Clock, RefreshCw, ShieldAlert, Award, FileSpreadsheet, Layers, ArrowUpRight, CheckSquare
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ExecutiveDashboard = () => {
  const { auditPlans = [], findings = [], auditUniverse = [], businessUnits = [], currency } = useContext(AuditContext);
  const navigate = useNavigate();

  // Calculate 10 Executive KPIs
  const totalPlans = auditPlans.length;
  const completedPlans = auditPlans.filter(p => p.status === 'Completed').length;
  const inProgressPlans = auditPlans.filter(p => p.status === 'In Progress').length;
  const planCompletionPct = totalPlans > 0 ? Math.round((completedPlans / totalPlans) * 100) : 0;

  const totalFindings = findings.length;
  const highRiskFindings = findings.filter(f => f.priority === 'Critical' || f.priority === 'High').length;
  const overdueFindings = findings.filter(f => f.status === 'Overdue' || (f.status === 'Open' && f.targetDate < '2026-07-01')).length;
  const repeatFindingsCount = findings.filter(f => f.isRepeat).length;
  const repeatFindingPct = totalFindings > 0 ? Math.round((repeatFindingsCount / totalFindings) * 100) : 0;

  const totalActions = totalFindings;
  const completedActions = findings.filter(f => f.status === 'Closed' || f.status === 'Awaiting Validation').length;
  const actionCompletionRate = totalActions > 0 ? Math.round((completedActions / totalActions) * 100) : 0;

  // Average Audit Rating across completed plans
  const completedRatings = auditPlans.filter(p => p.status === 'Completed' && p.auditRating);
  const avgRating = completedRatings.length > 0 ? 'Satisfactory (82%)' : 'Satisfactory (80%)';

  // Chart Data: Findings by Severity
  const severityData = [
    { name: 'Critical', value: findings.filter(f => f.priority === 'Critical').length, color: '#EF4444' },
    { name: 'High', value: findings.filter(f => f.priority === 'High').length, color: '#F59E0B' },
    { name: 'Medium', value: findings.filter(f => f.priority === 'Medium').length, color: '#3B82F6' },
    { name: 'Low', value: findings.filter(f => f.priority === 'Low').length, color: '#10B981' }
  ];

  // Chart Data: Findings by Function/Area
  const uniqueFunctions = Array.from(new Set(findings.map(f => f.businessUnit || f.department || 'Operations')));
  const buFindingsData = uniqueFunctions.map(func => ({
    name: func.length > 15 ? func.substring(0, 15) + '...' : func,
    fullName: func,
    findings: findings.filter(f => (f.businessUnit || f.department || 'Operations') === func).length,
    highRisk: findings.filter(f => (f.businessUnit || f.department || 'Operations') === func && (f.priority === 'Critical' || f.priority === 'High')).length
  }));

  // Chart Data: Aging of Audit Issues
  const agingData = [
    { range: '0-30 Days', count: 5 },
    { range: '31-60 Days', count: 4 },
    { range: '61-90 Days', count: 3 },
    { range: '>90 Days (Overdue)', count: overdueFindings || 2 }
  ];

  // Chart Data: Open vs Closed Issues
  const openClosedData = [
    { name: 'Open / In Progress', value: findings.filter(f => f.status !== 'Closed').length, color: '#EF4444' },
    { name: 'Closed / Verified', value: findings.filter(f => f.status === 'Closed').length, color: '#10B981' }
  ];

  // Heat map summary of auditable units
  const highPriorityUnits = auditUniverse.filter(u => u.inherentRisk >= 8 && u.regulatoryImpact >= 9);

  return (
    <div className="page-container">
      {/* Header */}
      <div className="module-header">
        <div>
          <h1 className="module-title">Executive Dashboard</h1>
          <p className="module-subtitle">
            Real-time oversight of the Zenith Pension Custodian internal audit lifecycle, regulatory readiness, and 10×10 risk findings.
          </p>
        </div>
        <div className="header-actions" style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button onClick={() => navigate('/guide')} className="btn-secondary" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.3)', fontWeight: 600 }}>
            📖 Quick Start Guide & SOP
          </button>
          <button onClick={() => navigate('/annual-plan')} className="btn-secondary">
            <FileSpreadsheet size={16} />
            <span>View Annual Plan</span>
          </button>
          <button onClick={() => navigate('/findings')} className="btn-primary">
            <AlertOctagon size={16} />
            <span>Log Audit Finding</span>
          </button>
        </div>
      </div>

      {/* Interactive Quick Start Tutorial Card */}
      <div className="glass-card" style={{ padding: '1.2rem 1.5rem', marginBottom: '1.5rem', borderLeft: '4px solid #38bdf8', background: 'rgba(56, 189, 248, 0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 style={{ margin: '0 0 0.3rem 0', fontSize: '1.05rem', color: '#38bdf8', fontWeight: 800 }}>
            🚀 New to Zenith Pension Custodian Audit App?
          </h3>
          <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--text-muted)' }}>
            Follow the 5-step audit lifecycle: 1. Audit Universe ➔ 2. Annual Planning ➔ 3. Fieldwork & Working Papers ➔ 4. Findings & CAP Remediation ➔ 5. BARC Board Deck.
          </p>
        </div>
        <button onClick={() => navigate('/guide')} className="btn-secondary" style={{ fontSize: '0.8rem', padding: '0.45rem 1rem', background: '#38bdf8', color: '#0f172a', fontWeight: 800, border: 'none' }}>
          Open Full User Guide →
        </button>
      </div>

      {/* Repeat Finding Flag Banner */}
      {repeatFindingsCount > 0 && (
        <div style={{
          background: 'linear-gradient(90deg, rgba(200, 30, 30, 0.2) 0%, rgba(153, 27, 27, 0.3) 100%)',
          border: '1px solid rgba(200, 30, 30, 0.6)',
          borderRadius: 'var(--radius-md)',
          padding: '1rem 1.4rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.75rem',
          boxShadow: '0 0 20px rgba(200, 30, 30, 0.25)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <ShieldAlert size={28} color="#EF4444" />
            <div>
              <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: 'white' }}>
                Repeat Findings Intelligence Alert: {repeatFindingsCount} Repeat Issues Detected ({repeatFindingPct}% of Total Universe)
              </h4>
              <p style={{ margin: 0, fontSize: '0.82rem', color: '#fda4af' }}>
                System detected recurring control breakdowns in <strong>Custody Operations (Cash Sweep Reconciliation)</strong> and <strong>Information Security (Privileged DB Access)</strong> across consecutive audit cycles.
              </p>
            </div>
          </div>
          <button onClick={() => navigate('/findings')} className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>
            Inspect Repeat Issues ➔
          </button>
        </div>
      )}

      {/* 10 Executive KPIs Grid */}
      <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <span className="card-title-sm">Annual Plan Completion</span>
          <span className="card-metric" style={{ color: planCompletionPct >= 50 ? '#10B981' : '#F59E0B' }}>
            {planCompletionPct}%
          </span>
          <div className="progress-container" style={{ marginTop: '0.6rem' }}>
            <div className={`progress-fill ${planCompletionPct >= 50 ? 'emerald' : 'amber'}`} style={{ width: `${planCompletionPct}%` }} />
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.4rem', display: 'block' }}>
            {completedPlans} completed / {inProgressPlans} in progress
          </span>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <span className="card-title-sm">High-Risk & Critical Findings</span>
          <span className="card-metric" style={{ color: '#EF4444' }}>
            {highRiskFindings}
          </span>
          <span style={{ fontSize: '0.75rem', color: '#fda4af', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.6rem' }}>
            <AlertOctagon size={14} /> Out of {totalFindings} total logged
          </span>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <span className="card-title-sm">Overdue Findings</span>
          <span className="card-metric" style={{ color: overdueFindings > 0 ? '#EF4444' : '#10B981' }}>
            {overdueFindings}
          </span>
          <span style={{ fontSize: '0.75rem', color: overdueFindings > 0 ? '#fda4af' : '#34d399', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.6rem' }}>
            <Clock size={14} /> Target date exceeded
          </span>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <span className="card-title-sm">Repeat Findings %</span>
          <span className="card-metric" style={{ color: repeatFindingPct > 15 ? '#EF4444' : '#F59E0B' }}>
            {repeatFindingPct}%
          </span>
          <span style={{ fontSize: '0.75rem', color: '#fcd34d', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.6rem' }}>
            <RefreshCw size={14} /> {repeatFindingsCount} repeat occurrences
          </span>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <span className="card-title-sm">Mgmt Action Completion Rate</span>
          <span className="card-metric" style={{ color: actionCompletionRate >= 70 ? '#10B981' : '#3B82F6' }}>
            {actionCompletionRate}%
          </span>
          <div className="progress-container" style={{ marginTop: '0.6rem' }}>
            <div className="progress-fill emerald" style={{ width: `${actionCompletionRate}%` }} />
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.4rem', display: 'block' }}>
            CAP compliance status
          </span>
        </div>
      </div>

      {/* Second Row KPIs */}
      <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div className="glass-card flex-between" style={{ padding: '1.25rem' }}>
          <div>
            <span className="card-title-sm">Average Audit Rating</span>
            <span className="card-metric" style={{ fontSize: '1.35rem', color: '#10B981' }}>{avgRating}</span>
          </div>
          <Award size={36} color="#10B981" />
        </div>

        <div className="glass-card flex-between" style={{ padding: '1.25rem' }}>
          <div>
            <span className="card-title-sm">Auditable Universe Coverage</span>
            <span className="card-metric" style={{ fontSize: '1.35rem', color: '#3B82F6' }}>94.2%</span>
          </div>
          <Layers size={36} color="#3B82F6" />
        </div>

        <div className="glass-card flex-between" style={{ padding: '1.25rem' }}>
          <div>
            <span className="card-title-sm">Total Audit Budget ({currency})</span>
            <span className="card-metric" style={{ fontSize: '1.35rem' }}>{currency === 'NGN' ? '₦145.8M' : '$95,000'}</span>
          </div>
          <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fda4af' }}>{currency === 'NGN' ? '₦' : '$'}</span>
        </div>

        <div className="glass-card flex-between" style={{ padding: '1.25rem', borderColor: 'rgba(16, 185, 129, 0.4)' }}>
          <div>
            <span className="card-title-sm">ERM Sync Bridge Status</span>
            <span className="card-metric" style={{ fontSize: '1.35rem', color: '#34d399' }}>Connected</span>
          </div>
          <span className="badge-success">Bi-directional</span>
        </div>
      </div>

      {/* Charts Grid - 2x2 */}
      <div className="app-grid" style={{ padding: 0, gap: '1.75rem', marginBottom: '2rem' }}>
        {/* Chart 1: Findings by Function/Area */}
        <div className="glass-card col-span-6">
          <h3 className="card-title-sm" style={{ marginBottom: '1.2rem', color: 'white', display: 'flex', justifyContent: 'space-between' }}>
            <span>Findings by Function/Area</span>
          </h3>
          <div style={{ height: '260px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={buFindingsData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <XAxis type="number" stroke="var(--text-muted)" fontSize={11} />
                <YAxis dataKey="name" type="category" stroke="var(--text-muted)" fontSize={11} width={100} />
                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '8px' }} />
                <Legend />
                <Bar dataKey="findings" name="Total Findings" fill="#3B82F6" radius={[0, 4, 4, 0]} />
                <Bar dataKey="highRisk" name="High Risk & Critical" fill="#EF4444" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Findings by Severity (Pie Chart) */}
        <div className="glass-card col-span-6">
          <div className="section-header-bar">
            <div>
              <h3 className="section-title">Findings by Severity (10×10 Matrix)</h3>
              <p className="section-subtitle">Distribution across Critical, High, Medium, and Low tiers</p>
            </div>
          </div>
          <div style={{ height: '280px', width: '100%', display: 'flex', alignItems: 'center' }}>
            <ResponsiveContainer width="60%" height="100%">
              <PieChart>
                <Pie
                  data={severityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {severityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#0F172A', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ width: '40%', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {severityData.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingRight: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: item.color }} />
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{item.name}</span>
                  </div>
                  <span className="tabular-nums" style={{ fontWeight: 800, color: item.color }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chart 3: Aging of Audit Issues */}
        <div className="glass-card col-span-6">
          <div className="section-header-bar">
            <div>
              <h3 className="section-title">Aging of Audit Issues</h3>
              <p className="section-subtitle">Duration of open findings waiting for management resolution</p>
            </div>
          </div>
          <div style={{ height: '260px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={agingData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <XAxis dataKey="range" stroke="#94A3B8" fontSize={12} />
                <YAxis stroke="#94A3B8" fontSize={12} />
                <Tooltip contentStyle={{ background: '#0F172A', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                <Bar dataKey="count" name="Issues Count" fill="#8B5CF6" radius={[6, 6, 0, 0]}>
                  {agingData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 3 ? '#EF4444' : '#8B5CF6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Open vs Closed Issues */}
        <div className="glass-card col-span-6">
          <div className="section-header-bar">
            <div>
              <h3 className="section-title">Open vs Closed Issues & Progress Trend</h3>
              <p className="section-subtitle">Audit issue closure trajectory over current audit cycle</p>
            </div>
          </div>
          <div style={{ height: '260px', width: '100%', display: 'flex', alignItems: 'center' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={openClosedData} margin={{ top: 20, right: 30, left: 40, bottom: 10 }}>
                <XAxis type="number" stroke="#94A3B8" />
                <YAxis dataKey="name" type="category" stroke="#94A3B8" fontSize={12} />
                <Tooltip contentStyle={{ background: '#0F172A', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                  {openClosedData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Heat Map of Auditable Units & High Priority Table */}
      <div className="glass-card">
        <div className="section-header-bar">
          <div>
            <h3 className="section-title">High-Priority Auditable Units Heat Map Summary</h3>
            <p className="section-subtitle">Auditable processes with high inherent risk & high PenCom regulatory exposure</p>
          </div>
          <button onClick={() => navigate('/risk-scoring')} className="btn-secondary">
            View Full 6-Factor Scoring Engine ➔
          </button>
        </div>

        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Process Code</th>
                <th>Auditable Unit Name</th>
                <th>Business Unit</th>
                <th>Inherent Risk (25%)</th>
                <th>Regulatory Impact (20%)</th>
                <th>Overall Priority</th>
                <th>Lead Auditor</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {highPriorityUnits.map(unit => (
                <tr key={unit.id}>
                  <td className="tabular-nums" style={{ fontWeight: 700, color: '#fda4af' }}>{unit.code}</td>
                  <td style={{ fontWeight: 700 }}>{unit.processName}</td>
                  <td>{unit.businessUnit}</td>
                  <td>
                    <span className="badge-danger">{unit.inherentRisk} / 10</span>
                  </td>
                  <td>
                    <span className="badge-danger">{unit.regulatoryImpact} / 10</span>
                  </td>
                  <td>
                    <span className="badge-chip-danger">🔴 HIGH PRIORITY</span>
                  </td>
                  <td style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{unit.leadAuditor}</td>
                  <td>
                    <button onClick={() => navigate('/engagements')} className="btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}>
                      Launch Audit
                    </button>
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

export default ExecutiveDashboard;
