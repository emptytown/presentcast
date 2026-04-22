const { contextBridge, ipcRenderer } = require('electron');

/**
 * Preload script — Expõe API segura para o React frontend
 * Segue princípios de context isolation
 */

contextBridge.exposeInMainWorld('electron', {
  // Get state
  getState: () => ipcRenderer.invoke('get-state'),
  getSources: () => ipcRenderer.invoke('get-sources'),
  
  // Set current source
  setCurrentSource: (sourceId) => ipcRenderer.invoke('set-current-source', sourceId),
  
  // Navigation
  nextSource: () => ipcRenderer.invoke('next-source'),
  prevSource: () => ipcRenderer.invoke('prev-source'),
  
  // Source management
  updateSource: (sourceId, updates) => ipcRenderer.invoke('update-source', sourceId, updates),
  addSource: (source) => ipcRenderer.invoke('add-source', source),
  
  // Capture
  captureLocalSpace: (space) => ipcRenderer.invoke('capture-local-space', space),
  captureRemoteSource: (ip, port) => ipcRenderer.invoke('capture-remote-source', ip, port),
  
  // Event listeners
  onSourceChanged: (callback) => ipcRenderer.on('source-changed', (event, data) => callback(data)),
  onBroadcastUpdate: (callback) => ipcRenderer.on('broadcast-update', (event, data) => callback(data)),
  onToggleBroadcastLock: (callback) => ipcRenderer.on('toggle-broadcast-lock', () => callback()),
  
  // Utilities
  removeListener: (channel) => ipcRenderer.removeAllListeners(channel)
});
