#!/usr/bin/env node

/**
 * Moshly Broadcast — Configuration Helper
 * 
 * Usage: node config-setup.js
 * 
 * Interactive setup:
 * 1. Detects network interfaces
 * 2. Lists available sources
 * 3. Generates config file
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

const getLocalIP = () => {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return '127.0.0.1';
};

const DEFAULT_CONFIG = {
  app: {
    name: 'Moshly Broadcast',
    version: '1.0.0',
    fps: 2,
    resolution: '1280x720'
  },
  sources: [
    {
      id: 1,
      name: 'Desktop 2 (PowerPoint)',
      type: 'local_space',
      space: 2,
      icon: '📊',
      enabled: true
    },
    {
      id: 2,
      name: 'Desktop 3 (Browser Show)',
      type: 'local_space',
      space: 3,
      icon: '🌐',
      enabled: true
    },
    {
      id: 3,
      name: 'Mac B',
      type: 'remote',
      ip: '192.168.1.50',
      port: 8080,
      icon: '🖥️',
      enabled: false
    },
    {
      id: 4,
      name: 'Mac C',
      type: 'remote',
      ip: '192.168.1.51',
      port: 8080,
      icon: '🖥️',
      enabled: false
    }
  ],
  server: {
    port: 8080,
    host: '0.0.0.0',
    enableCors: true
  }
};

const run = async () => {
  console.log(`
╔═══════════════════════════════════════╗
║  MOSHLY BROADCAST — Configuration     ║
╚═══════════════════════════════════════╝

This will help you set up your broadcast network.

`);

  // Detect if running on server machine
  const mode = await question('Are you setting up [A]pp (Mac A - control) or [S]erver (Mac B/C)? (A/S): ');

  if (mode.toLowerCase() === 's') {
    // Server setup
    console.log('\n📡 Server Mode Setup\n');
    
    const serverPort = await question('Server port (default 8080): ');
    const config = DEFAULT_CONFIG;
    config.server.port = serverPort ? parseInt(serverPort) : 8080;
    
    const configPath = path.join(__dirname, 'server-config.json');
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    
    console.log(`
✅ Configuration saved to: ${configPath}

Next steps:
  1. npm install
  2. npm start

The server will run on http://localhost:${config.server.port}

`);
    
  } else {
    // App setup
    console.log('\n🎛️  App Mode Setup\n');
    
    const localIP = getLocalIP();
    console.log(`Your local IP: ${localIP}`);
    
    const config = DEFAULT_CONFIG;
    
    // Configure remote sources
    console.log('\nRemote Sources (Mac B, C, etc):');
    
    const configMacB = await question('Configure Mac B? (y/n): ');
    if (configMacB.toLowerCase() === 'y') {
      const macBIP = await question('Mac B IP (e.g., 192.168.1.50): ');
      const macBPort = await question('Mac B port (default 8080): ');
      
      config.sources[2].ip = macBIP;
      config.sources[2].port = parseInt(macBPort) || 8080;
      config.sources[2].enabled = true;
    }
    
    const configMacC = await question('Configure Mac C? (y/n): ');
    if (configMacC.toLowerCase() === 'y') {
      const macCIP = await question('Mac C IP (e.g., 192.168.1.51): ');
      const macCPort = await question('Mac C port (default 8080): ');
      
      config.sources[3].ip = macCIP;
      config.sources[3].port = parseInt(macCPort) || 8080;
      config.sources[3].enabled = true;
    }
    
    // Configure capture resolution
    const resolution = await question('Resolution (1280x720/1920x1080/2560x1440): ');
    if (resolution) {
      config.app.resolution = resolution;
    }
    
    // Configure FPS
    const fps = await question('Refresh rate in FPS (1-5, default 2): ');
    if (fps) {
      config.app.fps = Math.min(5, Math.max(1, parseInt(fps)));
    }
    
    const configPath = path.join(__dirname, 'app-config.json');
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    
    console.log(`
✅ Configuration saved to: ${configPath}

Next steps:
  1. npm install
  2. npm run dev

Sticky Hub will open on your Desktop 1 (always on top).

Network Summary:
  - Your IP: ${localIP}
  - Resolution: ${config.app.resolution}
  - FPS: ${config.app.fps}
  - Remote sources: ${config.sources.filter(s => s.type === 'remote' && s.enabled).length}

`);
  }
  
  rl.close();
};

run().catch(console.error);
