#!/usr/bin/env node

/**
 * Moshly Broadcast — Screenshot Server
 * 
 * Roda em Mac B e Mac C
 * Expõe endpoint: GET /screenshot → JPEG stream
 * 
 * Setup:
 *   1. npm install express cors
 *   2. node server.js
 *   3. Confirma: curl http://localhost:8080/screenshot > test.jpg
 */

const express = require('express');
const cors = require('cors');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;
const TMP_DIR = '/tmp';
const SCREENSHOT_FILE = path.join(TMP_DIR, 'broadcast-screenshot.jpg');

// Middleware
app.use(cors());
app.use(express.json());

/**
 * GET /screenshot
 * Retorna screenshot JPEG do desktop atual
 */
app.get('/screenshot', (req, res) => {
  try {
    // Captura screenshot do desktop (sem janela dock)
    execSync(`screencapture -x "${SCREENSHOT_FILE}"`, { stdio: 'pipe' });

    // Verifica se arquivo foi criado
    if (!fs.existsSync(SCREENSHOT_FILE)) {
      return res.status(500).json({ error: 'Screenshot failed' });
    }

    // Retorna JPEG com cache headers apropriados
    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    const fileStream = fs.createReadStream(SCREENSHOT_FILE);
    fileStream.on('error', (err) => {
      console.error('Stream error:', err);
      res.status(500).json({ error: 'Stream failed' });
    });

    fileStream.pipe(res);

  } catch (error) {
    console.error('Screenshot error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /health
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    port: PORT,
    timestamp: new Date().toISOString()
  });
});

/**
 * GET /info
 * Server info
 */
app.get('/info', (req, res) => {
  const os = require('os');
  res.json({
    hostname: os.hostname(),
    platform: os.platform(),
    port: PORT,
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Express error:', err);
  res.status(500).json({ error: err.message });
});

// Start server
app.listen(PORT, () => {
  const hostname = require('os').hostname();
  console.log(`
╔═══════════════════════════════════════╗
║   MOSHLY BROADCAST SERVER             ║
╚═══════════════════════════════════════╝

🚀 Server running on:
   http://localhost:${PORT}
   http://${hostname}.local:${PORT}

📸 Screenshot endpoint:
   GET /screenshot → image/jpeg

🏥 Health check:
   GET /health

ℹ️  Server info:
   GET /info

⏸️  Stop: Press Ctrl+C

Ready to broadcast! 📡
  `);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n👋 Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n\n👋 Shutting down gracefully...');
  process.exit(0);
});
