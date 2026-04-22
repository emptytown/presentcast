#!/usr/bin/env node

/**
 * Moshly Broadcast — Diagnostic Tool
 * 
 * Usage: node diagnose.js [--target <ip>]
 * 
 * Checks:
 * - Network connectivity
 * - Server health
 * - Screenshot capture
 * - Performance metrics
 */

const os = require('os');
const net = require('net');
const fetch = require('node-fetch');

const COLORS = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

const log = {
  info: (msg) => console.log(`${COLORS.blue}ℹ️  ${msg}${COLORS.reset}`),
  success: (msg) => console.log(`${COLORS.green}✅ ${msg}${COLORS.reset}`),
  error: (msg) => console.log(`${COLORS.red}❌ ${msg}${COLORS.reset}`),
  warn: (msg) => console.log(`${COLORS.yellow}⚠️  ${msg}${COLORS.reset}`),
  debug: (msg, obj) => {
    if (process.argv.includes('--verbose')) {
      console.log(`${COLORS.cyan}🔍 ${msg}${COLORS.reset}`, obj || '');
    }
  }
};

const banner = () => {
  console.log(`
${COLORS.cyan}╔═══════════════════════════════════════╗
║  MOSHLY BROADCAST — Diagnostics       ║
╚═══════════════════════════════════════╝${COLORS.reset}
  `);
};

const getSystemInfo = () => {
  console.log(`\n${COLORS.cyan}System Information${COLORS.reset}`);
  
  const platform = os.platform();
  const arch = os.arch();
  const nodeVersion = process.version;
  const uptime = Math.floor(os.uptime() / 60);
  
  log.info(`OS: ${platform} (${arch})`);
  log.info(`Node.js: ${nodeVersion}`);
  log.info(`Uptime: ${uptime} minutes`);
};

const getNetworkInfo = () => {
  console.log(`\n${COLORS.cyan}Network Configuration${COLORS.reset}`);
  
  const interfaces = os.networkInterfaces();
  let found = false;
  
  for (const [name, addrs] of Object.entries(interfaces)) {
    for (const addr of addrs) {
      if (addr.family === 'IPv4' && !addr.internal) {
        log.success(`${name}: ${addr.address}`);
        found = true;
      }
    }
  }
  
  if (!found) {
    log.warn('No external IPv4 addresses found');
  }
};

const checkServerHealth = async (ip, port = 8080) => {
  console.log(`\n${COLORS.cyan}Server Health Check${COLORS.reset}`);
  
  const start = Date.now();
  
  try {
    const response = await fetch(`http://${ip}:${port}/health`, {
      timeout: 5000
    });
    const time = Date.now() - start;
    
    if (response.ok) {
      const data = await response.json();
      log.success(`Server is running (${time}ms response time)`);
      log.info(`Hostname: ${data.hostname}`);
      log.info(`Uptime: ${Math.floor(data.timestamp / 1000)}s`);
      return true;
    } else {
      log.error(`Server returned ${response.status}`);
      return false;
    }
  } catch (err) {
    log.error(`Failed to connect: ${err.message}`);
    return false;
  }
};

const checkScreenshot = async (ip, port = 8080) => {
  console.log(`\n${COLORS.cyan}Screenshot Capture${COLORS.reset}`);
  
  const start = Date.now();
  
  try {
    const response = await fetch(`http://${ip}:${port}/screenshot`, {
      timeout: 10000
    });
    const time = Date.now() - start;
    
    if (response.ok) {
      const size = response.headers.get('content-length');
      const contentType = response.headers.get('content-type');
      
      log.success(`Screenshot captured (${time}ms)`);
      log.info(`Content-Type: ${contentType}`);
      log.info(`Size: ${(parseInt(size) / 1024 / 1024).toFixed(2)} MB`);
      
      return { size: parseInt(size), time };
    } else {
      log.error(`Screenshot endpoint returned ${response.status}`);
      return null;
    }
  } catch (err) {
    log.error(`Failed to capture: ${err.message}`);
    return null;
  }
};

const checkNetworkLatency = async (ip) => {
  console.log(`\n${COLORS.cyan}Network Latency${COLORS.reset}`);
  
  const times = [];
  
  for (let i = 0; i < 5; i++) {
    try {
      const start = Date.now();
      await fetch(`http://${ip}:8080/health`, { timeout: 3000 });
      times.push(Date.now() - start);
    } catch (err) {
      log.warn(`Ping ${i + 1}: failed`);
    }
  }
  
  if (times.length > 0) {
    const avg = Math.round(times.reduce((a, b) => a + b) / times.length);
    const min = Math.min(...times);
    const max = Math.max(...times);
    
    log.info(`Average latency: ${avg}ms`);
    log.info(`Min: ${min}ms, Max: ${max}ms`);
    
    if (avg > 1000) {
      log.warn('High latency detected. This may affect broadcast quality.');
    }
    
    return avg;
  } else {
    log.error('Unable to measure latency');
    return null;
  }
};

const estimatePerformance = (size, time, latency) => {
  console.log(`\n${COLORS.cyan}Performance Estimate${COLORS.reset}`);
  
  const bitrate = (size * 8) / (time / 1000) / 1000000; // Mbps
  const fps = 1000 / (time + latency);
  
  log.info(`Estimated bitrate: ${bitrate.toFixed(2)} Mbps`);
  log.info(`Estimated FPS: ${fps.toFixed(1)}`);
  
  if (bitrate > 50) {
    log.warn('High bitrate. Consider reducing resolution or FPS.');
  }
  
  if (fps < 1) {
    log.error('FPS too low for smooth broadcast.');
  }
};

const runFullDiagnostics = async (targetIP) => {
  banner();
  
  getSystemInfo();
  getNetworkInfo();
  
  if (!targetIP) {
    log.warn('No target IP specified. Use --target <ip> to check remote server.');
    console.log('\n' + COLORS.yellow + 'Example:' + COLORS.reset);
    console.log('  node diagnose.js --target 192.168.1.50\n');
    return;
  }
  
  const healthy = await checkServerHealth(targetIP);
  
  if (!healthy) {
    log.error('Server is not reachable. Fix connectivity before continuing.');
    process.exit(1);
  }
  
  const screenshotResult = await checkScreenshot(targetIP);
  const latency = await checkNetworkLatency(targetIP);
  
  if (screenshotResult && latency) {
    estimatePerformance(screenshotResult.size, screenshotResult.time, latency);
  }
  
  // Summary
  console.log(`\n${COLORS.cyan}Summary${COLORS.reset}`);
  
  if (healthy && screenshotResult && latency < 500) {
    log.success('All checks passed! System is ready for broadcast.');
  } else {
    log.warn('Some issues detected. Review above for details.');
  }
  
  console.log('');
};

// Parse args
const args = process.argv.slice(2);
let targetIP = null;

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--target') {
    targetIP = args[++i];
  }
}

runFullDiagnostics(targetIP);
