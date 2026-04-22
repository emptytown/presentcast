#!/usr/bin/env node

/**
 * Moshly Broadcast — Deployment Script
 * 
 * Usage:
 *   node deploy.js --target all
 *   node deploy.js --target mac-b --ip 192.168.1.50
 *   node deploy.js --target mac-c --ip 192.168.1.51
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const args = process.argv.slice(2);
const config = {
  target: null,
  ip: null,
  port: 8080,
  verbose: false
};

// Parse arguments
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--target') config.target = args[++i];
  if (args[i] === '--ip') config.ip = args[++i];
  if (args[i] === '--port') config.port = parseInt(args[++i]);
  if (args[i] === '--verbose' || args[i] === '-v') config.verbose = true;
}

const log = (msg) => console.log(`[${new Date().toISOString().split('T')[1]}] ${msg}`);
const error = (msg) => console.error(`❌ ${msg}`);
const success = (msg) => console.log(`✅ ${msg}`);

const deployApp = () => {
  log('Building Electron app...');
  try {
    execSync('npm run build', { stdio: 'inherit' });
    success('App built successfully');
  } catch (err) {
    error('Build failed');
    process.exit(1);
  }
};

const deployServer = (machineIP) => {
  log(`Deploying server to ${machineIP}...`);
  
  if (!machineIP) {
    error('IP address required for server deployment');
    process.exit(1);
  }

  const script = `
    set -e
    cd /tmp/moshly-broadcast-server
    npm install --production
    npm start
  `;

  const sshCmd = `
    ssh -o ConnectTimeout=5 -o StrictHostKeyChecking=no \\
    $(whoami)@${machineIP} "
    git clone https://github.com/emptytown/moshly-broadcast.git /tmp/moshly-broadcast-server || true &&
    cd /tmp/moshly-broadcast-server &&
    git pull origin main &&
    npm install --production &&
    npm start
    "
  `;

  try {
    execSync(sshCmd, { stdio: 'inherit' });
    success(`Server deployed to ${machineIP}`);
  } catch (err) {
    error(`Failed to deploy to ${machineIP}`);
    error('Make sure SSH is configured and the machine is reachable');
    process.exit(1);
  }
};

const healthCheck = (ip, port) => {
  return new Promise((resolve) => {
    const req = require('http').get(`http://${ip}:${port}/health`, (res) => {
      resolve(res.statusCode === 200);
    });
    req.on('error', () => resolve(false));
    req.setTimeout(3000);
  });
};

const checkConnectivity = async (ips) => {
  log('Checking network connectivity...\n');
  
  for (const [name, ip] of Object.entries(ips)) {
    const reachable = await healthCheck(ip, 8080);
    if (reachable) {
      success(`${name} (${ip}) is reachable`);
    } else {
      error(`${name} (${ip}) is not reachable`);
    }
  }
};

const showBanner = () => {
  console.log(`
╔═══════════════════════════════════════╗
║  MOSHLY BROADCAST — Deployment        ║
╚═══════════════════════════════════════╝
  `);
};

const main = async () => {
  showBanner();

  if (!config.target) {
    error('No target specified. Use --target [app|mac-b|mac-c|all]');
    process.exit(1);
  }

  switch (config.target) {
    case 'app':
      deployApp();
      break;

    case 'mac-b':
      if (!config.ip) config.ip = '192.168.1.50';
      deployServer(config.ip);
      break;

    case 'mac-c':
      if (!config.ip) config.ip = '192.168.1.51';
      deployServer(config.ip);
      break;

    case 'all':
      log('Deploying to all machines...\n');
      deployApp();
      console.log('');
      
      const macs = {
        'Mac B': '192.168.1.50',
        'Mac C': '192.168.1.51'
      };
      
      for (const [name, ip] of Object.entries(macs)) {
        log(`Deploying ${name}...`);
        deployServer(ip);
        console.log('');
      }
      
      // Health check
      await checkConnectivity(macs);
      break;

    default:
      error(`Unknown target: ${config.target}`);
      process.exit(1);
  }

  console.log('');
  success('Deployment complete!');
};

main().catch(err => {
  error(err.message);
  process.exit(1);
});
