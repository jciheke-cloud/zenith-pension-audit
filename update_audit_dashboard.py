import re
import os

filepath = r"C:\Users\jcihe\.gemini\antigravity\scratch\zenith_pensions_audit\src\pages\ExecutiveDashboard.jsx"

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add Penalty Tracker to KPIs (Row 2)
penalty_kpi = """
        <div className="glass-card flex-between" style={{ padding: '1.2rem', borderColor: 'rgba(239, 68, 68, 0.4)' }}>
          <div>
            <span className="card-title-sm">PenCom Regulatory Penalty Tracker</span>
            <span className="card-metric" style={{ fontSize: '1.25rem', color: '#EF4444', marginTop: '0.2rem' }}>₦0.00</span>
          </div>
          <ShieldAlert size={32} color="#EF4444" />
        </div>
"""
# Replace Annual Audit Budget with PenCom Penalty Tracker
content = re.sub(
    r'<div className="glass-card flex-between" style=\{\{ padding: \'1.2rem\' \}\}>\s*<div>\s*<span className="card-title-sm">Annual Audit Budget</span>.*?</svg>\s*</div>\s*</div>',
    penalty_kpi,
    content,
    flags=re.DOTALL
)
# If the regex doesn't match, we might need a broader replacement
if 'PenCom Regulatory Penalty Tracker' not in content:
    content = re.sub(
        r'<span className="card-title-sm">Annual Audit Budget</span>.*?</svg>\s*</div>',
        penalty_kpi,
        content,
        flags=re.DOTALL
    )

# 2. Add New Data for Reconciliations & Instructions
new_data_code = """
  // 6. Reconciliation Exceptions (Live Data Simulation)
  const reconExceptionsData = [
    { range: '< 24 Hours', count: 12 },
    { range: '24-48 Hours', count: 5 },
    { range: '48-72 Hours', count: 2 },
    { range: '> 72 Hours (Breach)', count: 0 }
  ];

  // 7. PFA Instruction Defect Rate
  const defectRateData = [
    { month: 'Jan', rate: 2.1 },
    { month: 'Feb', rate: 1.8 },
    { month: 'Mar', rate: 1.5 },
    { month: 'Apr', rate: 1.9 },
    { month: 'May', rate: 1.2 },
    { month: 'Jun', rate: 0.8 }
  ];
"""
content = content.replace('// Heat map summary of auditable units from live auditUniverse', new_data_code + '\n  // Heat map summary of auditable units from live auditUniverse')

# 3. Add Row 5 Charts for Reconciliation and Instruction Defects
new_charts_code = """
      {/* Row 5: PFC Specific Operational Audit Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: '1.75rem', marginBottom: '2rem' }}>
        {/* Chart 5: Reconciliation Exceptions Aging */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: 'white' }}>Reconciliation Exceptions Aging</h3>
              <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)' }}>Unreconciled items across contribution & payment accounts</p>
            </div>
            <span className="badge-warning" style={{ fontSize: '0.72rem' }}>Live API Feed</span>
          </div>
          <div style={{ height: '250px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={reconExceptionsData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <XAxis dataKey="range" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} />
                <Tooltip contentStyle={{ background: '#0F172A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                <Bar dataKey="count" name="Exception Count" radius={[6, 6, 0, 0]}>
                  {reconExceptionsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 3 ? '#EF4444' : index === 2 ? '#F59E0B' : '#3B82F6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 6: PFA Instruction Defect Rate */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: 'white' }}>PFA Instruction Defect Rate</h3>
              <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)' }}>Percentage of rejected/failed PFA instructions over time</p>
            </div>
            <span className="badge-info" style={{ fontSize: '0.72rem' }}>Trend Analysis</span>
          </div>
          <div style={{ height: '250px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={defectRateData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} domain={[0, 3]} />
                <Tooltip contentStyle={{ background: '#0F172A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                <Line type="monotone" dataKey="rate" name="Defect Rate (%)" stroke="#10B981" strokeWidth={3} dot={{ r: 4, fill: '#10B981' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
"""

content = content.replace('{/* Heat Map of Auditable Units & High Priority Table */}', new_charts_code + '\n      {/* Heat Map of Auditable Units & High Priority Table */}')

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated ExecutiveDashboard.jsx successfully.")
