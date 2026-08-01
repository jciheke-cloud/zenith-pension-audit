#!/usr/bin/env node
// migrate_pass2.cjs - Second pass for patterns not caught by first script
const fs = require('fs');
const path = require('path');
const pagesDir = path.join(__dirname, 'src', 'pages');

const targets = [
  'RiskBasedPlanning.jsx',
  'FraudAndContinuous.jsx',
  'ComplianceAndRegulatory.jsx',
  'ErmSyncPage.jsx',
  'AuditEngagement.jsx',
  'ExecutiveDashboard.jsx',
  'FindingsManagement.jsx',
  'ReportsAndCommittee.jsx',
  'UserManagement.jsx',
  'MasterData.jsx',
  'AnnualAuditPlan.jsx',
];

// More specific patterns missed in pass 1
const replacements = [
  // h3 margin 0
  [/style=\{\{ margin: 0, fontSize: '1\.\d+rem', fontWeight: 800 \}\}/g, `className="m-0 text-xl font-extrabold"`],
  [/style=\{\{ margin: 0, fontSize: '1\.\d+rem', fontWeight: 700 \}\}/g, `className="m-0 text-xl font-bold"`],
  // max-w modal
  [/style=\{\{ maxWidth: '(\d+)px' \}\}/g, (_, w) => `className="max-w-[${w}px]"`],
  [/style=\{\{ maxWidth: '(\d+)px', maxHeight: '90vh', overflowY: 'auto' \}\}/g, (_, w) => `className="max-w-[${w}px] max-h-[90vh] overflow-y-auto"`],
  // Flex row justify/align combos
  [/style=\{\{ display: 'flex', justifyContent: 'flex-end', gap: '0\.8rem' \}\}/g, `className="flex justify-end gap-[0.8rem]"`],
  [/style=\{\{ display: 'flex', justifyContent: 'flex-end', gap: '0\.85rem' \}\}/g, `className="flex justify-end gap-[0.85rem]"`],
  [/style=\{\{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' \}\}/g, `className="flex justify-between items-center"`],
  [/style=\{\{ display: 'flex', alignItems: 'center' \}\}/g, `className="flex items-center"`],
  [/style=\{\{ display: 'flex', gap: '1rem', alignItems: 'center' \}\}/g, `className="flex gap-4 items-center"`],
  [/style=\{\{ display: 'flex', gap: '1rem' \}\}/g, `className="flex gap-4"`],
  [/style=\{\{ display: 'flex', gap: '0\.5rem' \}\}/g, `className="flex gap-2"`],
  [/style=\{\{ display: 'flex', gap: '0\.6rem' \}\}/g, `className="flex gap-[0.6rem]"`],
  [/style=\{\{ display: 'flex' \}\}/g, `className="flex"`],
  // Border-bottom variants
  [/style=\{\{ borderBottom: '1px solid rgba\(255,255,255,0\.08\)', paddingBottom: '0\.8rem', marginBottom: '1rem' \}\}/g,
    `className="border-b border-white/[0.08] pb-[0.8rem] mb-4"`],
  // Common grid patterns
  [/style=\{\{ display: 'grid', gridTemplateColumns: 'repeat\(3, 1fr\)', gap: '1rem' \}\}/g, `className="grid grid-cols-3 gap-4"`],
  [/style=\{\{ display: 'grid', gridTemplateColumns: 'repeat\(4, 1fr\)', gap: '1rem' \}\}/g, `className="grid grid-cols-4 gap-4"`],
  [/style=\{\{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' \}\}/g, `className="grid grid-cols-3 gap-4"`],
  // Padding shortcuts
  [/style=\{\{ padding: '1\.2rem' \}\}/g, `className="p-5"`],
  [/style=\{\{ padding: '1rem' \}\}/g, `className="p-4"`],
  [/style=\{\{ padding: '0\.8rem' \}\}/g, `className="p-[0.8rem]"`],
  // marginBottom
  [/style=\{\{ marginBottom: '1\.5rem' \}\}/g, `className="mb-6"`],
  [/style=\{\{ marginBottom: '1rem' \}\}/g, `className="mb-4"`],
  [/style=\{\{ marginBottom: '0\.5rem' \}\}/g, `className="mb-2"`],
  [/style=\{\{ marginBottom: '0\.8rem' \}\}/g, `className="mb-[0.8rem]"`],
  // marginTop
  [/style=\{\{ marginTop: '1rem' \}\}/g, `className="mt-4"`],
  [/style=\{\{ marginTop: '0\.5rem' \}\}/g, `className="mt-2"`],
  // Width 100%
  [/style=\{\{ width: '100%' \}\}/g, `className="w-full"`],
  // Color only (text)
  [/style=\{\{ color: '#10B981' \}\}/g, `className="text-emerald-400"`],
  [/style=\{\{ color: '#EF4444' \}\}/g, `className="text-red-400"`],
  [/style=\{\{ color: '#F59E0B' \}\}/g, `className="text-amber-400"`],
  [/style=\{\{ color: '#3B82F6' \}\}/g, `className="text-blue-400"`],
  [/style=\{\{ color: 'var\(--text-muted\)' \}\}/g, `className="text-[var(--text-muted)]"`],
  [/style=\{\{ color: 'var\(--text-secondary\)' \}\}/g, `className="text-[var(--text-secondary)]"`],
  // font-weight only
  [/style=\{\{ fontWeight: 600 \}\}/g, `className="font-semibold"`],
  // cursor pointer
  [/style=\{\{ cursor: 'pointer' \}\}/g, `className="cursor-pointer"`],
  // overflow
  [/style=\{\{ overflowX: 'auto' \}\}/g, `className="overflow-x-auto"`],
  // border-radius
  [/style=\{\{ borderRadius: '6px' \}\}/g, `className="rounded-md"`],
  [/style=\{\{ borderRadius: '8px' \}\}/g, `className="rounded-lg"`],
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
  if (c !== orig) { fs.writeFileSync(fp, c, 'utf8'); console.log('OK  ' + file + ' (' + n + ')'); totalChanged += n; }
  else { console.log('--- ' + file); }
}
console.log('\nTotal: ' + totalChanged);
