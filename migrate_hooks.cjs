const fs = require('fs');
const path = require('path');

const hooksDir = path.join(__dirname, 'src/hooks');
if (!fs.existsSync(hooksDir)) fs.mkdirSync(hooksDir);

// 1. Create hooks
const createHook = (name, key, endpoint) => {
  const content = `import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

export const ${name} = () => {
  return useQuery({
    queryKey: ['${key}'],
    queryFn: async () => {
      const { data } = await api.get('${endpoint}');
      return data;
    },
    initialData: []
  });
};
`;
  fs.writeFileSync(path.join(hooksDir, `${name}.js`), content);
};

createHook('useAuditUniverse', 'auditUniverse', '/api/audit/universe');
createHook('useEngagements', 'auditPlans', '/api/audit/plans');
createHook('useFindings', 'findings', '/api/audit/findings');
createHook('useControls', 'controls', '/api/controls');

// 2. Patch pages
const pagesDir = path.join(__dirname, 'src/pages');
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.jsx'));

files.forEach(file => {
  let content = fs.readFileSync(path.join(pagesDir, file), 'utf8');
  let changed = false;

  const hookImports = [];
  const hookCalls = [];

  const replaceContext = (match, p1) => {
    let vars = p1.split(',').map(v => v.trim());
    
    if (vars.includes('auditUniverse')) {
      vars = vars.filter(v => v !== 'auditUniverse');
      hookImports.push('useAuditUniverse');
      hookCalls.push('  const { data: auditUniverse = [] } = useAuditUniverse();');
    }
    if (vars.includes('auditPlans')) {
      vars = vars.filter(v => v !== 'auditPlans');
      hookImports.push('useEngagements');
      hookCalls.push('  const { data: auditPlans = [] } = useEngagements();');
    }
    if (vars.includes('findings')) {
      vars = vars.filter(v => v !== 'findings');
      hookImports.push('useFindings');
      hookCalls.push('  const { data: findings = [] } = useFindings();');
    }
    if (vars.includes('controls')) {
      vars = vars.filter(v => v !== 'controls');
      hookImports.push('useControls');
      hookCalls.push('  const { data: controls = [] } = useControls();');
    }

    if (hookCalls.length > 0) changed = true;

    if (vars.length === 0) return '';
    return `const { ${vars.join(', ')} } = useContext(AuditContext);`;
  };

  content = content.replace(/const\s+\{\s*([^}]+)\s*\}\s*=\s*useContext\(AuditContext\);/g, replaceContext);

  if (changed) {
    // Add imports
    const uniqueImports = [...new Set(hookImports)];
    const importsStr = uniqueImports.map(h => `import { ${h} } from '../hooks/${h}';`).join('\n');
    content = content.replace(/(import React.*?;\n)/, `$1${importsStr}\n`);
    
    // Add hook calls
    const hookCallsStr = [...new Set(hookCalls)].join('\n');
    if (content.match(/(const {.*?useContext\(AuditContext\);)/)) {
       content = content.replace(/(const {.*?useContext\(AuditContext\);)/, `$1\n${hookCallsStr}`);
    } else {
       // if context was fully removed
       content = content.replace(/(const \w+\s*=\s*\(\)\s*=>\s*\{)/, `$1\n${hookCallsStr}`);
    }
    
    fs.writeFileSync(path.join(pagesDir, file), content);
    console.log(`Updated ${file}`);
  }
});
