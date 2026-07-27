import os
import re

filepath = r"C:\Users\jcihe\.gemini\antigravity\scratch\zenith_pensions_audit\src\pages\ExecutiveDashboard.jsx"

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Fix buFindingsData fallback
content = re.sub(
    r"if \(buFindingsData\.length === 0\) \{\s*buFindingsData = \[\s*\{ name: 'Custody Operations'.*?\s*\];\s*\}",
    "",
    content,
    flags=re.DOTALL
)

# 2. Fix severityData fallback
content = re.sub(
    r"const severityData = \(sumSeverity > 0\) \? \[\s*\{ name: 'Critical', value: critCount, color: '#EF4444' \},\s*\{ name: 'High', value: highCount, color: '#F59E0B' \},\s*\{ name: 'Medium', value: medCount, color: '#3B82F6' \},\s*\{ name: 'Low', value: lowCount, color: '#10B981' \}\s*\] : \[\s*\{ name: 'Critical', value: 1.*?\s*\];",
    "const severityData = (sumSeverity > 0) ? [\n    { name: 'Critical', value: critCount, color: '#EF4444' },\n    { name: 'High', value: highCount, color: '#F59E0B' },\n    { name: 'Medium', value: medCount, color: '#3B82F6' },\n    { name: 'Low', value: lowCount, color: '#10B981' }\n  ] : [];",
    content,
    flags=re.DOTALL
)

# 3. Fix planHoursData fallback
content = re.sub(
    r"const displayPlanHoursData = planHoursData\.length > 0 \? planHoursData : \[\s*\{ name: 'Custody Ops'.*?\s*\];",
    "const displayPlanHoursData = planHoursData;",
    content,
    flags=re.DOTALL
)

# 4. Fix reconExceptionsData
content = re.sub(
    r"const reconExceptionsData = \[\s*\{ range: '< 24 Hours'.*?\s*\];",
    "const reconExceptionsData = [];",
    content,
    flags=re.DOTALL
)

# 5. Fix defectRateData
content = re.sub(
    r"const defectRateData = \[\s*\{ month: 'Jan', rate: 2\.1 \}.*?\s*\];",
    "const defectRateData = [];",
    content,
    flags=re.DOTALL
)

# 6. Fix highPriorityUnits fallback
content = re.sub(
    r"const highPriorityUnits = auditUniverse\.length > 0 \? auditUniverse\.slice\(0, 6\) : \[\s*\{ id: '1', code: 'PROC-CUS-01'.*?\s*\];",
    "const highPriorityUnits = auditUniverse.slice(0, 6);",
    content,
    flags=re.DOTALL
)

# Render empty states for charts
empty_state_html = """
          {($VAR.length === 0) ? (
            <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
              No Live Data — Awaiting Backend Sync
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
$CHART
            </ResponsiveContainer>
          )}
"""

def replace_chart(content, var_name, match_str, chart_html):
    replacement = f"""          {{({var_name}.length === 0) ? (
            <div style={{{{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}}}>
              No Live Data — Awaiting Backend Sync
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              {chart_html}
            </ResponsiveContainer>
          )}}"""
    return content.replace(match_str, replacement)

# 1. BarChart buFindingsData
bar1_match = """<ResponsiveContainer width="100%" height="100%">
              <BarChart data={buFindingsData} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
                <XAxis type="number" stroke="var(--text-muted)" fontSize={11} />
                <YAxis dataKey="name" type="category" stroke="var(--text-muted)" fontSize={11} width={130} />
                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ background: '#0F172A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                <Legend />
                <Bar dataKey="highRisk" name="High Risk & Critical" fill="#EF4444" radius={[0, 4, 4, 0]} stackId="a" />
                <Bar dataKey="mediumRisk" name="Medium & Low Risk" fill="#3B82F6" radius={[0, 4, 4, 0]} stackId="a" />
              </BarChart>
            </ResponsiveContainer>"""
content = replace_chart(content, "buFindingsData", bar1_match, """<BarChart data={buFindingsData} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
                <XAxis type="number" stroke="var(--text-muted)" fontSize={11} />
                <YAxis dataKey="name" type="category" stroke="var(--text-muted)" fontSize={11} width={130} />
                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ background: '#0F172A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                <Legend />
                <Bar dataKey="highRisk" name="High Risk & Critical" fill="#EF4444" radius={[0, 4, 4, 0]} stackId="a" />
                <Bar dataKey="mediumRisk" name="Medium & Low Risk" fill="#3B82F6" radius={[0, 4, 4, 0]} stackId="a" />
              </BarChart>""")

# 2. PieChart severityData
pie_match = """<ResponsiveContainer width="55%" height="100%">
              <PieChart>
                <Pie
                  data={severityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={92}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {severityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#0F172A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>"""
# Special case for severity data since there's an accompanying legend div
pie_repl = """{severityData.length === 0 ? (
              <div style={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                No Live Data — Awaiting Backend Sync
              </div>
            ) : (
              <>
                <ResponsiveContainer width="55%" height="100%">
                  <PieChart>
                    <Pie
                      data={severityData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={92}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {severityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#0F172A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ width: '45%', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {severityData.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingRight: '0.5rem', background: 'rgba(255,255,255,0.02)', padding: '0.45rem 0.75rem', borderRadius: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: item.color }} />
                        <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{item.name}</span>
                      </div>
                      <span className="tabular-nums" style={{ fontWeight: 800, color: item.color, fontSize: '0.9rem' }}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </>
            )}"""
# Replace the whole pie section
content = re.sub(
    r"<ResponsiveContainer width=\"55%\" height=\"100%\">.*?</ResponsiveContainer>\s*<div style={{ width: '45%'.*?</div>\s*</div>\s*</div>",
    pie_repl + "\n          </div>\n        </div>",
    content,
    flags=re.DOTALL
)

# 3. BarChart displayPlanHoursData
bar2_match = """<ResponsiveContainer width="100%" height="100%">
              <BarChart data={displayPlanHoursData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} />
                <Tooltip contentStyle={{ background: '#0F172A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                <Legend />
                <Bar dataKey="planned" name="Planned Budget Hours" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="actual" name="Actual Field Hours" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>"""
content = replace_chart(content, "displayPlanHoursData", bar2_match, """<BarChart data={displayPlanHoursData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} />
                <Tooltip contentStyle={{ background: '#0F172A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                <Legend />
                <Bar dataKey="planned" name="Planned Budget Hours" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="actual" name="Actual Field Hours" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>""")

# 4. BarChart reconExceptionsData
bar3_match = """<ResponsiveContainer width="100%" height="100%">
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
            </ResponsiveContainer>"""
content = replace_chart(content, "reconExceptionsData", bar3_match, """<BarChart data={reconExceptionsData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <XAxis dataKey="range" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} />
                <Tooltip contentStyle={{ background: '#0F172A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                <Bar dataKey="count" name="Exception Count" radius={[6, 6, 0, 0]}>
                  {reconExceptionsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 3 ? '#EF4444' : index === 2 ? '#F59E0B' : '#3B82F6'} />
                  ))}
                </Bar>
              </BarChart>""")

# 5. LineChart defectRateData
line_match = """<ResponsiveContainer width="100%" height="100%">
              <LineChart data={defectRateData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} domain={[0, 3]} />
                <Tooltip contentStyle={{ background: '#0F172A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                <Line type="monotone" dataKey="rate" name="Defect Rate (%)" stroke="#10B981" strokeWidth={3} dot={{ r: 4, fill: '#10B981' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>"""
content = replace_chart(content, "defectRateData", line_match, """<LineChart data={defectRateData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} domain={[0, 3]} />
                <Tooltip contentStyle={{ background: '#0F172A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                <Line type="monotone" dataKey="rate" name="Defect Rate (%)" stroke="#10B981" strokeWidth={3} dot={{ r: 4, fill: '#10B981' }} activeDot={{ r: 6 }} />
              </LineChart>""")

# 6. Table highPriorityUnits empty state
table_repl = """
          {highPriorityUnits.length === 0 ? (
            <div style={{ display: 'flex', padding: '2rem', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
              No Live Data — Awaiting Backend Sync
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Process Code</th>
                  <th>Auditable Process Unit Name</th>
                  <th>Business Unit</th>
                  <th>Inherent Risk</th>
                  <th>Regulatory Impact</th>
                  <th>Priority Tier</th>
                  <th>Lead Auditor</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {highPriorityUnits.map(unit => (
                  <tr key={unit.id}>
                    <td className="tabular-nums" style={{ fontWeight: 800, color: '#fda4af' }}>{unit.code || unit.unitId}</td>
                    <td style={{ fontWeight: 700 }}>{unit.processName || unit.title}</td>
                    <td>{unit.businessUnit || unit.department}</td>
                    <td>
                      <span className="badge-danger">{unit.inherentRisk} / 10</span>
                    </td>
                    <td>
                      <span className="badge-danger">{unit.regulatoryImpact} / 10</span>
                    </td>
                    <td>
                      <span className="badge-chip-danger">🔴 HIGH PRIORITY</span>
                    </td>
                    <td style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{unit.leadAuditor || 'Senior Auditor'}</td>
                    <td>
                      <button onClick={() => navigate('/engagements')} className="btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}>
                        Launch Audit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
"""
content = re.sub(
    r"<table className=\"data-table\">.*?</table>",
    table_repl,
    content,
    flags=re.DOTALL
)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Dashboard fixed.")
