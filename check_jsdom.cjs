const { JSDOM } = require('jsdom');
const express = require('express');
const app = express();
app.use('/audit-portal', express.static('dist'));
const server = app.listen(3000, async () => {
  try {
    const virtualConsole = new (require('jsdom').VirtualConsole)();
    virtualConsole.on('error', err => console.error('JSDOM ERROR:', err));
    virtualConsole.on('jsdomError', err => console.error('JSDOM ERROR:', err));
    virtualConsole.on('log', msg => console.log('JSDOM LOG:', msg));
    const dom = await JSDOM.fromURL('http://localhost:3000/audit-portal/index.html', {
      runScripts: 'dangerously',
      resources: 'usable',
      virtualConsole
    });
    setTimeout(() => {
      server.close();
      process.exit(0);
    }, 5000);
  } catch (e) {
    console.error(e);
    server.close();
  }
});
