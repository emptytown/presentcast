const { app, BrowserWindow, ipcMain, globalShortcut, Menu } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const Store = require('electron-store');

const store = new Store();

let mainWindow;
let hubWindow;

/**
 * Broadcast Sources Configuration
 * Cada source = um "input" que pode ser broadcast
 */
const DEFAULT_SOURCES = [
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
];

let broadcastState = {
  sources: store.get('sources', DEFAULT_SOURCES),
  currentSourceId: store.get('currentSourceId', 1),
  isRecording: false,
  fps: 2,
  resolution: store.get('resolution', '1280x720')
};

/**
 * Create Sticky Hub Window (Desktop 1 — ALWAYS ON TOP, PRIVATE)
 */
const createHubWindow = () => {
  hubWindow = new BrowserWindow({
    width: 420,
    height: 550,
    alwaysOnTop: true,
    frame: false,
    transparent: false,
    skipTaskbar: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false
    },
    icon: path.join(__dirname, 'assets', 'icon.png')
  });

  const startUrl = isDev
    ? 'http://localhost:3000'
    : `file://${path.join(__dirname, '../build/index.html')}`;

  hubWindow.loadURL(startUrl);

  if (isDev) {
    hubWindow.webContents.openDevTools({ mode: 'detach' });
  }

  // Posiciona no canto superior direito por padrão
  const primaryDisplay = require('electron').screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;
  hubWindow.setPosition(width - 420 - 20, 20);

  hubWindow.on('closed', () => {
    hubWindow = null;
  });

  return hubWindow;
};

/**
 * IPC Handlers — Comunicação entre Electron e React
 */

// Get current broadcast state
ipcMain.handle('get-state', () => {
  return broadcastState;
});

// Get sources list
ipcMain.handle('get-sources', () => {
  return broadcastState.sources;
});

// Switch to specific source
ipcMain.handle('set-current-source', (event, sourceId) => {
  const source = broadcastState.sources.find(s => s.id === sourceId);
  if (source) {
    broadcastState.currentSourceId = sourceId;
    store.set('currentSourceId', sourceId);
    
    // Notifica todas as windows sobre mudança
    if (hubWindow && !hubWindow.isDestroyed()) {
      hubWindow.webContents.send('source-changed', { sourceId });
    }
    
    return { success: true, source };
  }
  return { success: false, error: 'Source not found' };
});

// Next source (cycling)
ipcMain.handle('next-source', () => {
  const enabledSources = broadcastState.sources.filter(s => s.enabled);
  if (enabledSources.length === 0) return { success: false };
  
  const currentIndex = enabledSources.findIndex(s => s.id === broadcastState.currentSourceId);
  const nextIndex = (currentIndex + 1) % enabledSources.length;
  const nextSource = enabledSources[nextIndex];
  
  return ipcMain._invokeRenderer('set-current-source', nextSource.id);
});

// Previous source (cycling)
ipcMain.handle('prev-source', () => {
  const enabledSources = broadcastState.sources.filter(s => s.enabled);
  if (enabledSources.length === 0) return { success: false };
  
  const currentIndex = enabledSources.findIndex(s => s.id === broadcastState.currentSourceId);
  const prevIndex = currentIndex === 0 ? enabledSources.length - 1 : currentIndex - 1;
  const prevSource = enabledSources[prevIndex];
  
  return ipcMain._invokeRenderer('set-current-source', prevSource.id);
});

// Update source configuration
ipcMain.handle('update-source', (event, sourceId, updates) => {
  const source = broadcastState.sources.find(s => s.id === sourceId);
  if (source) {
    Object.assign(source, updates);
    store.set('sources', broadcastState.sources);
    return { success: true };
  }
  return { success: false };
});

// Add new source
ipcMain.handle('add-source', (event, newSource) => {
  const maxId = Math.max(...broadcastState.sources.map(s => s.id), 0);
  newSource.id = maxId + 1;
  broadcastState.sources.push(newSource);
  store.set('sources', broadcastState.sources);
  return { success: true, source: newSource };
});

// Capture screenshot from local space
ipcMain.handle('capture-local-space', async (event, space) => {
  try {
    const { execSync } = require('child_process');
    const tmpFile = `/tmp/broadcast-space-${space}.jpg`;
    
    // AppleScript para ativar Space e capturar
    const script = `
      tell application "System Events"
        key code 18 using {control down, option down} -- fn+arrow para mudar space
      end tell
    `;
    
    execSync(`screencapture -x "${tmpFile}"`, { stdio: 'pipe' });
    
    const fs = require('fs');
    const buffer = fs.readFileSync(tmpFile);
    const base64 = buffer.toString('base64');
    
    return {
      success: true,
      data: `data:image/jpeg;base64,${base64}`,
      timestamp: Date.now()
    };
  } catch (error) {
    console.error('Capture error:', error);
    return { success: false, error: error.message };
  }
});

// Capture screenshot from remote source
ipcMain.handle('capture-remote-source', async (event, ip, port) => {
  try {
    const fetch = require('node-fetch');
    const response = await fetch(`http://${ip}:${port}/screenshot`, {
      timeout: 5000
    });
    
    if (!response.ok) {
      throw new Error(`Remote server returned ${response.status}`);
    }
    
    const buffer = await response.buffer();
    const base64 = buffer.toString('base64');
    
    return {
      success: true,
      data: `data:image/jpeg;base64,${base64}`,
      timestamp: Date.now()
    };
  } catch (error) {
    console.error('Remote capture error:', error);
    return { success: false, error: error.message };
  }
});

/**
 * App Lifecycle
 */

app.on('ready', () => {
  createHubWindow();
  registerGlobalShortcuts();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (hubWindow === null) {
    createHubWindow();
  }
});

/**
 * Global Shortcuts
 */
const registerGlobalShortcuts = () => {
  // Cmd+Right: Next source
  globalShortcut.register('CmdOrCtrl+Right', () => {
    ipcMain.emit('next-source');
  });

  // Cmd+Left: Previous source
  globalShortcut.register('CmdOrCtrl+Left', () => {
    ipcMain.emit('prev-source');
  });

  // Space: Toggle broadcast lock
  globalShortcut.register('Space', () => {
    if (hubWindow && !hubWindow.isDestroyed()) {
      hubWindow.webContents.send('toggle-broadcast-lock');
    }
  });
};

/**
 * Menu Setup
 */
if (isDev) {
  const menu = Menu.buildFromTemplate([
    {
      label: 'Development',
      submenu: [
        {
          label: 'Reload',
          accelerator: 'CmdOrCtrl+R',
          click: () => hubWindow.reload()
        },
        {
          label: 'DevTools',
          accelerator: 'CmdOrCtrl+I',
          click: () => hubWindow.webContents.openDevTools()
        }
      ]
    }
  ]);
  Menu.setApplicationMenu(menu);
}
