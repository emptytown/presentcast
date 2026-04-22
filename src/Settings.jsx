import React, { useState, useEffect } from 'react';
import './Settings.css';

const Settings = ({ sources, onClose, onSave }) => {
  const [editSources, setEditSources] = useState(sources);
  const [newSource, setNewSource] = useState({
    name: '',
    type: 'remote',
    ip: '',
    port: 8080
  });
  const [showAddForm, setShowAddForm] = useState(false);

  const handleSourceToggle = (id) => {
    setEditSources(
      editSources.map(s =>
        s.id === id ? { ...s, enabled: !s.enabled } : s
      )
    );
  };

  const handleSourceUpdate = (id, field, value) => {
    setEditSources(
      editSources.map(s =>
        s.id === id ? { ...s, [field]: value } : s
      )
    );
  };

  const handleAddSource = () => {
    if (!newSource.name || (newSource.type === 'remote' && !newSource.ip)) {
      alert('Please fill in all required fields');
      return;
    }

    const maxId = Math.max(...editSources.map(s => s.id), 0);
    const source = {
      ...newSource,
      id: maxId + 1,
      icon: newSource.type === 'remote' ? '🖥️' : '📺',
      enabled: true
    };

    setEditSources([...editSources, source]);
    setNewSource({ name: '', type: 'remote', ip: '', port: 8080 });
    setShowAddForm(false);
  };

  const handleRemoveSource = (id) => {
    if (editSources.length <= 2) {
      alert('You must have at least 2 sources enabled');
      return;
    }
    setEditSources(editSources.filter(s => s.id !== id));
  };

  const handleSave = () => {
    onSave(editSources);
  };

  return (
    <div className="settings-overlay">
      <div className="settings-modal">
        <div className="settings-header">
          <h2>⚙️ Settings</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="settings-content">
          {/* Sources Section */}
          <div className="settings-section">
            <h3>📺 Broadcast Sources</h3>
            
            <div className="sources-list">
              {editSources.map(source => (
                <div key={source.id} className="source-item">
                  <div className="source-header">
                    <input
                      type="checkbox"
                      checked={source.enabled}
                      onChange={() => handleSourceToggle(source.id)}
                      className="source-toggle"
                    />
                    <span className="source-icon">{source.icon}</span>
                    <input
                      type="text"
                      value={source.name}
                      onChange={(e) =>
                        handleSourceUpdate(source.id, 'name', e.target.value)
                      }
                      className="source-name-input"
                    />
                    {editSources.length > 2 && (
                      <button
                        className="remove-btn"
                        onClick={() => handleRemoveSource(source.id)}
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  {source.type === 'remote' && (
                    <div className="source-details">
                      <label>
                        IP:
                        <input
                          type="text"
                          value={source.ip}
                          onChange={(e) =>
                            handleSourceUpdate(source.id, 'ip', e.target.value)
                          }
                          placeholder="192.168.1.50"
                        />
                      </label>
                      <label>
                        Port:
                        <input
                          type="number"
                          value={source.port}
                          onChange={(e) =>
                            handleSourceUpdate(source.id, 'port', parseInt(e.target.value))
                          }
                          min="1"
                          max="65535"
                        />
                      </label>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Add New Source */}
            {!showAddForm ? (
              <button
                className="add-source-btn"
                onClick={() => setShowAddForm(true)}
              >
                + Add New Source
              </button>
            ) : (
              <div className="add-source-form">
                <h4>New Source</h4>
                <input
                  type="text"
                  placeholder="Source name"
                  value={newSource.name}
                  onChange={(e) =>
                    setNewSource({ ...newSource, name: e.target.value })
                  }
                />
                <select
                  value={newSource.type}
                  onChange={(e) =>
                    setNewSource({ ...newSource, type: e.target.value })
                  }
                >
                  <option value="remote">Remote (Mac B/C)</option>
                  <option value="local_space">Local Space</option>
                </select>
                {newSource.type === 'remote' && (
                  <>
                    <input
                      type="text"
                      placeholder="IP address"
                      value={newSource.ip}
                      onChange={(e) =>
                        setNewSource({ ...newSource, ip: e.target.value })
                      }
                    />
                    <input
                      type="number"
                      placeholder="Port"
                      value={newSource.port}
                      onChange={(e) =>
                        setNewSource({ ...newSource, port: parseInt(e.target.value) })
                      }
                      min="1"
                      max="65535"
                    />
                  </>
                )}
                <div className="form-buttons">
                  <button onClick={handleAddSource}>✓ Add</button>
                  <button onClick={() => setShowAddForm(false)}>✕ Cancel</button>
                </div>
              </div>
            )}
          </div>

          {/* Advanced Settings */}
          <div className="settings-section">
            <h3>⚡ Advanced</h3>
            <label>
              <span>Refresh Rate (FPS):</span>
              <input type="range" min="1" max="5" defaultValue="2" />
            </label>
            <label>
              <span>Resolution:</span>
              <select>
                <option>1280x720</option>
                <option>1920x1080</option>
                <option>2560x1440</option>
              </select>
            </label>
          </div>
        </div>

        <div className="settings-footer">
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button className="save-btn" onClick={handleSave}>
            ✓ Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
