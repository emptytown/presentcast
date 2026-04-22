import React, { useState, useEffect, useCallback } from 'react';
import './StickyHub.css';

const StickyHub = () => {
  const [state, setState] = useState(null);
  const [sources, setSources] = useState([]);
  const [currentSource, setCurrentSource] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [broadcastLocked, setBroadcastLocked] = useState(false);
  const [error, setError] = useState(null);

  // Initialize
  useEffect(() => {
    const init = async () => {
      if (!window.electron) {
        console.error('Electron API not available');
        return;
      }

      try {
        const initialState = await window.electron.getState();
        const initialSources = await window.electron.getSources();
        
        setState(initialState);
        setSources(initialSources);
        setCurrentSource(initialSources.find(s => s.id === initialState.currentSourceId));
        
        // Trigger first capture
        await captureCurrentSource();
      } catch (err) {
        console.error('Init error:', err);
        setError(err.message);
      }
    };

    init();
  }, []);

  // Listen to events
  useEffect(() => {
    if (!window.electron) return;

    const unsubscribeSourceChanged = window.electron.onSourceChanged((data) => {
      const newSource = sources.find(s => s.id === data.sourceId);
      setCurrentSource(newSource);
      captureCurrentSource();
    });

    const unsubscribeBroadcastUpdate = window.electron.onBroadcastUpdate((data) => {
      setPreview(data);
    });

    const unsubscribeLock = window.electron.onToggleBroadcastLock(() => {
      setBroadcastLocked(prev => !prev);
    });

    return () => {
      window.electron.removeListener('source-changed');
      window.electron.removeListener('broadcast-update');
      window.electron.removeListener('toggle-broadcast-lock');
    };
  }, [sources]);

  // Capture current source
  const captureCurrentSource = useCallback(async () => {
    if (!currentSource) return;

    setIsLoading(true);
    setError(null);

    try {
      let result;

      if (currentSource.type === 'local_space') {
        result = await window.electron.captureLocalSpace(currentSource.space);
      } else if (currentSource.type === 'remote') {
        result = await window.electron.captureRemoteSource(
          currentSource.ip,
          currentSource.port
        );
      }

      if (result.success) {
        setPreview(result);
      } else {
        setError(result.error || 'Capture failed');
      }
    } catch (err) {
      console.error('Capture error:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [currentSource]);

  // Handle source selection
  const handleSourceSelect = async (sourceId) => {
    if (broadcastLocked) {
      setError('🔒 Broadcast is locked. Press Space to unlock.');
      return;
    }

    try {
      await window.electron.setCurrentSource(sourceId);
    } catch (err) {
      setError(err.message);
    }
  };

  // Next/Prev navigation
  const handleNext = async () => {
    if (broadcastLocked) return;
    try {
      await window.electron.nextSource();
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePrev = async () => {
    if (broadcastLocked) return;
    try {
      await window.electron.prevSource();
    } catch (err) {
      setError(err.message);
    }
  };

  // Refresh current source
  const handleRefresh = () => {
    captureCurrentSource();
  };

  if (!state || !currentSource) {
    return (
      <div className="sticky-hub loading">
        <div className="spinner"></div>
        <p>Initializing broadcast...</p>
      </div>
    );
  }

  const enabledSources = sources.filter(s => s.enabled);

  return (
    <div className={`sticky-hub ${broadcastLocked ? 'locked' : ''}`}>
      {/* Header */}
      <div className="hub-header">
        <div className="title">
          <span className="logo">🟢</span>
          <span>MOSHLY BROADCAST</span>
        </div>
        <div className="lock-indicator">
          {broadcastLocked && <span className="lock-icon">🔒</span>}
        </div>
      </div>

      {/* Current Broadcast Info */}
      <div className="broadcast-info">
        <div className="label">📺 NOW BROADCASTING</div>
        <div className="source-name">{currentSource.name}</div>
      </div>

      {/* Preview */}
      <div className="preview-container">
        {isLoading ? (
          <div className="preview-loading">
            <div className="spinner-small"></div>
            <span>Capturing...</span>
          </div>
        ) : preview?.data ? (
          <img 
            src={preview.data} 
            alt="Broadcast preview" 
            className="preview-image"
            onError={() => setError('Failed to load preview')}
          />
        ) : (
          <div className="preview-empty">
            <span>No preview available</span>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-message">
          ⚠️ {error}
        </div>
      )}

      {/* Sources Grid */}
      <div className="sources-section">
        <div className="sources-label">SOURCES</div>
        <div className="sources-grid">
          {enabledSources.map(source => (
            <button
              key={source.id}
              className={`source-button ${currentSource.id === source.id ? 'active' : ''}`}
              onClick={() => handleSourceSelect(source.id)}
              disabled={broadcastLocked}
            >
              <span className="source-icon">{source.icon}</span>
              <span className="source-text">{source.name.split('(')[0].trim()}</span>
              {currentSource.id === source.id && <span className="active-indicator">📡</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="controls">
        <button 
          className="control-btn prev-btn"
          onClick={handlePrev}
          disabled={broadcastLocked || enabledSources.length < 2}
          title="Previous source (Cmd+Left)"
        >
          ◀️ PREV
        </button>
        
        <button 
          className="control-btn refresh-btn"
          onClick={handleRefresh}
          disabled={isLoading}
          title="Refresh preview"
        >
          🔄
        </button>
        
        <button 
          className="control-btn next-btn"
          onClick={handleNext}
          disabled={broadcastLocked || enabledSources.length < 2}
          title="Next source (Cmd+Right)"
        >
          NEXT ▶️
        </button>
      </div>

      {/* Footer Status */}
      <div className="footer-status">
        <span className="status-item">
          ⚡ FPS: {state.fps}
        </span>
        <span className="status-item">
          📐 {state.resolution}
        </span>
        <span className="status-item">
          🔗 {enabledSources.length} sources
        </span>
      </div>

      {/* Lock hint */}
      <div className="hint">
        Press <strong>Space</strong> to {broadcastLocked ? 'unlock' : 'lock'} broadcast
      </div>
    </div>
  );
};

export default StickyHub;
