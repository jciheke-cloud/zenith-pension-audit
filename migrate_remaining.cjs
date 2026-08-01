#!/usr/bin/env node
// migrate_remaining.cjs
const fs = require('fs');
const path = require('path');
const pagesDir = path.join(__dirname, 'src', 'pages');

const targets = [
  'RiskBasedPlanning.jsx',
  'FraudAndContinuous.jsx',
  'ComplianceAndRegulatory.jsx',
  'ErmSyncPage.jsx',
  'AuditEngagement.jsx',
  'AnnualAuditPlan.jsx',
  'ExecutiveDashboard.jsx',
  'FindingsManagement.jsx',
];

const replacements = [
  // Modal header flex
  [/style=\{\{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1\.\drem' \}\}/g, `className="flex justify-between items-center mb-5"`],
  [/style=\{\{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' \}\}/g, `className="flex justify-between items-center mb-4"`],
  // Close button
  [/style=\{\{ background: 'transparent', border: 'none', color: 'var\(--text-muted\)', cursor: 'pointer' \}\}/g, `className="bg-transparent border-none text-[var(--text-muted)] cursor-pointer"`],
  // flex column gap
  [/style=\{\{ display: 'flex', flexDirection: 'column', gap: '1rem' \}\}/g, `className="flex flex-col gap-4"`],
  // label
  [/style=\{\{ display: 'block', fontSize: '0\.8rem', fontWeight: 700, marginBottom: '0\.4rem', color: 'var\(--text-secondary\)' \}\}/g, `className="block text-[0.8rem] font-bold mb-[0.4rem] text-[var(--text-secondary)]"`],
  // modal footer
  [/style=\{\{ display: 'flex', justifyContent: 'flex-end', gap: '0\.8(?:5)?rem', marginTop: '1rem' \}\}/g, `className="flex justify-end gap-[0.85rem] mt-4"`],
  // section-header flex
  [/style=\{\{ display: 'flex', gap: '0\.8rem', alignItems: 'center' \}\}/g, `className="flex gap-[0.8rem] items-center"`],
  [/style=\{\{ display: 'flex', alignItems: 'center', gap: '0\.5rem' \}\}/g, `className="flex items-center gap-2"`],
  [/style=\{\{ display: 'flex', gap: '0\.4rem', flexWrap: 'wrap' \}\}/g, `className="flex gap-[0.4rem] flex-wrap"`],
  [/style=\{\{ display: 'flex', gap: '0\.4rem', alignItems: 'center' \}\}/g, `className="flex gap-[0.4rem] items-center"`],
  // position relative
  [/style=\{\{ position: 'relative' \}\}/g, `className="relative"`],
  [/style=\{\{ position: 'relative', flex: 1 \}\}/g, `className="relative flex-1"`],
  // search icon
  [/style=\{\{ position: 'absolute', left: '12px', top: '10px', color: 'var\(--text-muted\)' \}\}/g, `className="absolute left-3 top-[10px] text-[var(--text-muted)]"`],
  [/style=\{\{ position: 'absolute', left: '12px', top: '12px', color: 'var\(--text-muted\)' \}\}/g, `className="absolute left-3 top-3 text-[var(--text-muted)]"`],
  // empty state td
  [/style=\{\{ textAlign: 'center', padding: '2rem' \}\}/g, `className="text-center p-8"`],
  [/style=\{\{ textAlign: 'center', padding: '2rem', color: 'var\(--text-muted\)' \}\}/g, `className="text-center p-8 text-[var(--text-muted)]"`],
  // 2-col grid
  [/style=\{\{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' \}\}/g, `className="grid grid-cols-2 gap-4"`],
  // filter label
  [/style=\{\{ display: 'block', fontSize: '0\.75rem', fontWeight: 600, marginBottom: '0\.4rem' \}\}/g, `className="block text-[0.75rem] font-semibold mb-[0.4rem]"`],
  // btn sizes (must do className first then remove style)
  [/className="btn-secondary"\s+style=\{\{ padding: '0\.5rem 0\.8rem' \}\}/g, `className="btn-secondary px-[0.8rem] py-2"`],
  [/className="btn-secondary"\s+style=\{\{ padding: '0\.3rem 0\.65rem', fontSize: '0\.75rem' \}\}/g, `className="btn-secondary px-[0.65rem] py-[0.3rem] text-[0.75rem]"`],
  [/className="btn-primary"\s+style=\{\{ padding: '0\.3rem 0\.65rem', fontSize: '0\.75rem' \}\}/g, `className="btn-primary px-[0.65rem] py-[0.3rem] text-[0.75rem]"`],
  [/className="btn-success"\s+style=\{\{ padding: '0\.3rem 0\.65rem', fontSize: '0\.75rem' \}\}/g, `className="btn-success px-[0.65rem] py-[0.3rem] text-[0.75rem]"`],
  // form-input/select width
  [/className="form-input"\s+style=\{\{ paddingLeft: '2\.2rem', width: '220px' \}\}/g, `className="form-input pl-[2.2rem] w-[220px]"`],
  [/className="form-input"\s+style=\{\{ paddingLeft: '2\.4rem', width: '100%' \}\}/g, `className="form-input pl-[2.4rem] w-full"`],
  [/className="form-select"\s+style=\{\{ width: '100%' \}\}/g, `className="form-select w-full"`],
  // nav-tab flex-wrap
  [/className="nav-tab-container"\s+style=\{\{ flexWrap: 'wrap' \}\}/g, `className="nav-tab-container flex-wrap"`],
];

let totalChanged = 0;
for (const file of targets) {
  const fp = path.join(pagesDir, file);
  if (!fs.existsSync(fp)) { console.log('SKIP: ' + file); continue; }
  let c = fs.readFileSync(fp, 'utf8'), orig = c, n = 0;
  for (const [pat, rep] of replacements) {
    const matches = c.match(pat);
    if (matches) { n += matches.length; c = c.replace(pat, rep); }
  }
  if (c !== orig) { fs.writeFileSync(fp, c, 'utf8'); console.log('OK  ' + file + ' (' + n + ' replacements)'); totalChanged += n; }
  else { console.log('--- ' + file + ' (no changes)'); }
}
console.log('\nTotal replacements applied: ' + totalChanged);
