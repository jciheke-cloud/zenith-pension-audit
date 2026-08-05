const fs = require('fs');

function virtualizeTable(filePath, arrayName) {
  let content = fs.readFileSync(filePath, 'utf8');

  if (!content.includes('import { FixedSizeList')) {
    content = content.replace(
      /(import React.*?;\n)/,
      `$1import { FixedSizeList as List } from 'react-window';\nimport AutoSizer from 'react-virtualized-auto-sizer';\n`
    );
  }

  // Extract the row rendering logic
  const tbodyMatch = content.match(/<tbody>\s*\{\w+\.length === 0 \? \([\s\S]*?\) : (\w+)\.map\(\w+ => \(([\s\S]*?)\)\)\}\s*<\/tbody>/);
  
  if (tbodyMatch) {
    const arrName = tbodyMatch[1];
    let rowContent = tbodyMatch[2];
    
    // Replace the specific map variable with arrayName[index]
    const varMatch = rowContent.match(/<tr key=\{([^\}]+)\}/);
    const itemVar = tbodyMatch[0].match(/\.map\((\w+) =>/)[1];
    
    // We'll create a Row component outside or inline. Since we can just inline it:
    let replacement = `
<tbody style={{ height: '600px', display: 'block' }}>
  <AutoSizer disableWidth>
    {({ height }) => (
      <List
        height={height || 600}
        itemCount={${arrName}.length}
        itemSize={80}
        width="100%"
        innerElementType="tbody"
      >
        {({ index, style }) => {
          const ${itemVar} = ${arrName}[index];
          return (
            ${rowContent.replace(/<tr/, '<tr style={style}')}
          );
        }}
      </List>
    )}
  </AutoSizer>
</tbody>
`;
    content = content.replace(tbodyMatch[0], replacement);
    fs.writeFileSync(filePath, content);
    console.log(`Virtualized ${filePath}`);
  } else {
    // try fallback for master data
    const altMatch = content.match(/<tbody>\s*\{(\w+)\.length === 0 \? \([\s\S]*?\) : (\w+)\.map\(\w+ => \(([\s\S]*?)\)\)\}\s*<\/tbody>/);
    if(altMatch) {
        const arrName = altMatch[2];
        let rowContent = altMatch[3];
        const itemVar = altMatch[0].match(/\.map\((\w+) =>/)[1];
        let replacement = `
<tbody style={{ height: '600px', display: 'block' }}>
  <AutoSizer disableWidth>
    {({ height }) => (
      <List
        height={height || 600}
        itemCount={${arrName}.length}
        itemSize={80}
        width="100%"
        innerElementType="tbody"
      >
        {({ index, style }) => {
          const ${itemVar} = ${arrName}[index];
          return (
            ${rowContent.replace(/<tr/, '<tr style={style}')}
          );
        }}
      </List>
    )}
  </AutoSizer>
</tbody>
`;
        content = content.replace(altMatch[0], replacement);
        fs.writeFileSync(filePath, content);
        console.log(`Virtualized ${filePath}`);
    } else {
        console.log(`Could not find tbody match in ${filePath}`);
    }
  }
}

virtualizeTable('src/pages/FindingsManagement.jsx');
virtualizeTable('src/pages/MasterData.jsx');
virtualizeTable('src/pages/RiskBasedPlanning.jsx');

