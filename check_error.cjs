const puppeteer = require('puppeteer');
const express = require('express');
const app = express();
app.use(express.static('dist'));
const server = app.listen(3000, async () => {
  const browser = await puppeteer.launch({headless: true});
  const page = await browser.newPage();
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  page.on('pageerror', err => console.error('BROWSER ERROR:', err.toString()));
  try {
    await page.goto('http://localhost:3000', {waitUntil: 'networkidle0', timeout: 10000});
  } catch (e) {
    console.log(e);
  }
  await browser.close();
  server.close();
});
