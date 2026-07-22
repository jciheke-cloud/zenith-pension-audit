const { JSDOM } = require('jsdom');

JSDOM.fromURL('http://127.0.0.1:8080/', { 
    runScripts: 'dangerously', 
    resources: 'usable',
    pretendToBeVisual: true
}).then(dom => { 
    dom.window.console.log = (...args) => console.log('LOG:', ...args); 
    dom.window.console.error = (...args) => console.error('ERROR:', ...args); 
    dom.window.addEventListener('error', e => console.log('UNHANDLED ERROR:', e.error)); 
    dom.window.addEventListener('unhandledrejection', e => console.log('UNHANDLED PROMISE REJECTION:', e.reason));
    setTimeout(() => {
        console.log('Test finished');
        process.exit(0);
    }, 8000); 
}).catch(console.error);
