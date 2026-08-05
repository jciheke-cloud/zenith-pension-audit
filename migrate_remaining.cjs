const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src/components');
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.jsx'));

files.forEach(file => {
  let content = fs.readFileSync(path.join(pagesDir, file), 'utf8');
  let changed = false;

  const hookImports = [];
  const hookCalls = [];

  const replaceContext = (match, p1) => {
    let vars = p1.split(',').map(v => v.trim());
    
    // check with regex for each
    const hasUniverse = vars.some(v => v.startsWith('auditUniverse'));
    const hasPlans = vars.some(v => v.startsWith('auditPlans'));
    const hasFindings = vars.some(v => v.startsWith('findings'));
    const hasControls = vars.some(v => v.startsWith('controls'));

    if (hasUniverse) {
      vars = vars.filter(v => !v.startsWith('auditUniverse'));
      hookImports.push('useAuditUniverse');
      hookCalls.push('  const { data: auditUniverse = [] } = useAuditUniverse();');
    }
    if (hasPlans) {
      vars = vars.filter(v => !v.startsWith('auditPlans'));
      hookImports.push('useEngagements');
      hookCalls.push('  const { data: auditPlans = [] } = useEngagements();');
    }
    if (hasFindings) {
      vars = vars.filter(v => !v.startsWith('findings'));
      hookImports.push('useFindings');
      hookCalls.push('  const { data: findings = [] } = useFindings();');
    }
    if (hasControls) {
      vars = vars.filter(v => !v.startsWith('controls'));
      hookImports.push('useControls');
      hookCalls.push('  const { data: controls = [] } = useControls();');
    }

    if (hookCalls.length > 0) changed = true;

    if (vars.length === 0) return '';
    return `const { ${vars.join(', ')} } = useContext(AuditContext);`;
  };

  content = content.replace(/const\s+\{\s*([^}]+)\s*\}\s*=\s*useContext\(AuditContext\);/g, replaceContext);

  if (changed) {
    const uniqueImports = [...new Set(hookImports)];
    const importsStr = uniqueImports.map(h => `import { ${h} } from '../hooks/${h}';`).join('\n');
    content = content.replace(/(import React.*?;\n)/, `$1${importsStr}\n`);
    
    const hookCallsStr = [...new Set(hookCalls)].join('\n');
    if (content.match(/(const {.*?useContext\(AuditContext\);)/)) {
       content = content.replace(/(const {.*?useContext\(AuditContext\);)/, `$1\n${hookCallsStr}`);
    } else {
       content = content.replace(/(const \w+\s*=\s*\(\w*\)\s*=>\s*\{)/, `$1\n${hookCallsStr}`);
    }
    
    fs.writeFileSync(path.join(pagesDir, file), content);
    console.log(`Updated ${file}`);
  }
});
