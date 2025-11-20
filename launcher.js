const puppeteer = require('puppeteer');
const express = require('express');
const path = require('path');
const fs = require('fs');

const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
const app = express();
let serverPort;
const port = 0; // Let OS assign a free port

// Serve static files
app.use(express.static('public'));
app.use('/assets', express.static('assets'));

// Endpoint to get config
app.get('/api/config', (req, res) => {
  // Return config as‑is; external URLs (e.g., http://localhost:3000) are kept unchanged
  res.json(config);
});

// Endpoint to close the system removed; OS window close will terminate the process.

const server = app.listen(port, async () => {
  const assignedPort = server.address().port;
  serverPort = assignedPort; // store for URL rewriting
  console.log(`Server running at http://localhost:${assignedPort}`);

  const browser = await puppeteer.launch({
    headless: false, // Visible window
    defaultViewport: null,
    args: [
      `--window-size=${config.window.width},${config.window.height}`,
      `--app=http://localhost:${assignedPort}`,
      '--kiosk', // Fullscreen kiosk mode without UI
      '--no-sandbox',
      '--disable-infobars',
      '--disable-web-security',
      '--allow-running-insecure-content'
    ],
    ignoreDefaultArgs: ['--enable-automation'] // Hides "Chrome is being controlled by automated test software"
  });

  const pages = await browser.pages();
  const page = pages[0];

  // Set viewport to match window size
  await page.setViewport({
    width: config.window.width,
    height: config.window.height
  });

  page.on('close', () => {
    console.log('Browser window closed. Exiting...');
    process.exit(0);
  });
});
