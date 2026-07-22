const puppeteer = require('puppeteer');
(async () => {
    try {
        const browser = await puppeteer.launch({ 
            executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', 
            headless: true 
        });
        const page = await browser.newPage();
        page.on('console', msg => console.log('LOG:', msg.text()));
        page.on('pageerror', err => console.log('PAGE ERROR:', err.message));
        page.on('response', response => {
            if (!response.ok()) console.log('404 URL:', response.url());
        });
        
        await page.goto('http://127.0.0.1:8080/');
        await new Promise(r => setTimeout(r, 6000));
        await browser.close();
    } catch (e) {
        console.error(e);
    }
})();
