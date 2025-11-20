const puppeteer = require('puppeteer-core');
const express = require('express');
const path = require('path');
const fs = require('fs');

const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
const app = express();

// Global references for cleanup
let server = null;
let browser = null;
let isShuttingDown = false;

// Graceful shutdown handler
async function shutdown(signal) {
  if (isShuttingDown) {
    console.log('Shutdown already in progress...');
    return;
  }
  isShuttingDown = true;

  console.log(`\n${signal} received. Shutting down gracefully...`);

  try {
    // Close browser first
    if (browser) {
      console.log('Closing browser...');
      await browser.close();
      browser = null;
    }

    // Close server
    if (server) {
      console.log('Closing server...');
      await new Promise((resolve, reject) => {
        server.close((err) => {
          if (err) reject(err);
          else resolve();
        });
      });
      server = null;
    }

    console.log('Cleanup completed. Exiting.');
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
}

// Register signal handlers
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGHUP', () => shutdown('SIGHUP'));

// Error handlers
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  shutdown('uncaughtException');
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
  shutdown('unhandledRejection');
});

// Serve static files
app.use(express.static('public'));
app.use('/assets', express.static('assets'));

// Endpoint to get config
app.get('/api/config', (req, res) => {
  // Return config as-is; external URLs (e.g., http://localhost:3000) are kept unchanged
  res.json(config);
});

// Main startup function
async function main() {
  const port = 0; // Let OS assign a free port

  server = app.listen(port, async () => {
    const assignedPort = server.address().port;
    console.log(`Server running at http://localhost:${assignedPort}`);

    try {
      // Determine which browser executable to use
      const browserExecutable = process.env.BROWSER === 'chromium' ? '/usr/lib/chromium/chromium' : undefined;
      const launchOptions = {
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
        ignoreDefaultArgs: ['--enable-automation']
      };
      if (browserExecutable) {
        launchOptions.executablePath = browserExecutable;
      }
      browser = await puppeteer.launch(launchOptions);

      const pages = await browser.pages();
      const page = pages[0];

      // Set viewport to match window size
      await page.setViewport({
        width: config.window.width,
        height: config.window.height
      });

      page.on('close', () => {
        console.log('Browser window closed.');
        shutdown('page-close');
      });

      // Handle browser disconnect
      browser.on('disconnected', () => {
        if (!isShuttingDown) {
          console.log('Browser disconnected unexpectedly.');
          shutdown('browser-disconnect');
        }
      });

    } catch (error) {
      console.error('Failed to launch browser:', error);
      shutdown('launch-error');
    }
  });

  server.on('error', (error) => {
    console.error('Server error:', error);
    shutdown('server-error');
  });
}

// Start the application
main().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});
