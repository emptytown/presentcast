# 🔧 Moshly Broadcast — Advanced Troubleshooting

## Diagnostic Workflow

**Before diving into specific issues, run the diagnostic tool:**

```bash
# Local machine diagnostics
node diagnose.js

# Remote server diagnostics
node diagnose.js --target 192.168.1.50

# Verbose mode (for detailed output)
node diagnose.js --target 192.168.1.50 --verbose
```

---

## Common Issues & Solutions

### 1. Remote Server Not Responding

**Symptoms:**
- "Connection refused" error
- Preview shows gray/black screen
- Network timeout in Sticky Hub

**Diagnosis:**

```bash
# 1. Check if server process is running
ssh user@192.168.1.50
ps aux | grep "node server.js"

# 2. Check if port 8080 is listening
netstat -an | grep 8080
# or
lsof -i :8080

# 3. Test HTTP connection
curl http://192.168.1.50:8080/health

# 4. Check firewall
sudo iptables -L | grep 8080
```

**Solutions:**

```bash
# If server is not running:
cd /path/to/moshly-broadcast
npm start

# If port is in use:
sudo lsof -i :8080  # Find process using port
kill -9 <PID>        # Kill process
npm start            # Restart server

# If firewall is blocking:
sudo ufw allow 8080/tcp
# or
sudo firewall-cmd --permanent --add-port=8080/tcp
sudo firewall-cmd --reload
```

---

### 2. High Latency / Delayed Preview

**Symptoms:**
- Preview updates very slowly (>1s delay)
- Broadcast is choppy
- Network utilization is high

**Root Causes:**
- Low WiFi signal strength
- Congested network
- High resolution captures
- Too many concurrent requests

**Solutions:**

```javascript
// In electron/main.js, reduce capture frequency:
// Default: 2 FPS (500ms interval)
broadcastState.fps = 1;  // Change to 1 FPS (1000ms)

// Reduce resolution:
broadcastState.resolution = '1024x576';  // Instead of 1280x720

// Reduce simultaneous sources:
// Only capture active source, not all 4
```

**Network Optimization:**

```bash
# Check WiFi signal strength
# macOS:
/System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport -I

# Check network bandwidth
# macOS (install iftop):
brew install iftop
sudo iftop -i en0

# Use 5GHz WiFi instead of 2.4GHz for better throughput
# Switch to wired Ethernet if available
```

---

### 3. AppleScript Errors (Desktop capture not working)

**Symptoms:**
- "AppleScript permission denied"
- Local space capture returns black screen
- Desktop 2/3 buttons show error

**Solution:**

macOS requires accessibility permissions for AppleScript:

1. Go to **System Preferences → Security & Privacy → Accessibility**
2. Unlock the padlock (enter password)
3. Add these applications:
   - Terminal.app
   - Your editor (VS Code, etc.)
   - Electron (Moshly Broadcast app)

```bash
# Or use terminal (one-time setup):
tccutil reset All
# Then grant permissions manually once
```

---

### 4. JPEG Compression Issues

**Symptoms:**
- Preview looks pixelated/artifacted
- Random visual glitches
- File size fluctuates wildly

**Root Cause:**
- Screenshot conversion to JPEG with lossy compression
- screencapture default settings

**Solution:**

```bash
# In server.js, change JPEG quality:
# Current: screencapture -x (default quality)
# Better: screencapture -x -t jpg -T 0.5

# Or use PNG for lossless:
execSync(`screencapture -P "${SCREENSHOT_FILE}"`, { stdio: 'pipe' });
// Set quality to 100% in response headers
```

---

### 5. Electron App Won't Start

**Symptoms:**
- "Cannot find module" errors
- Blank window
- Dev tools show React errors

**Solutions:**

```bash
# 1. Clean install
rm -rf node_modules package-lock.json
npm install

# 2. Check Node version (must be 14+)
node --version

# 3. Check React dev server is running
ps aux | grep "react-scripts"
# If missing, open new terminal and run:
npm run react-start

# 4. Check Electron is installed
npm list electron

# 5. Clear Electron cache
rm -rf ~/Library/Caches/moshly-broadcast
```

---

### 6. Multiple Instances Running (Port Conflict)

**Symptoms:**
- Port 8080 already in use
- Server fails to start
- "Address already in use" error

**Solution:**

```bash
# Find what's using port 8080
lsof -i :8080
# or
netstat -tulpn | grep 8080

# Kill the process
kill -9 <PID>

# Alternatively, use different port:
PORT=8081 node server.js
# Then update config in Mac A
```

---

### 7. Preview is Frozen

**Symptoms:**
- Preview image doesn't update
- Stuck on old screenshot
- [🔄] Refresh doesn't help

**Causes:**
- Network timeout
- Server crash
- High resource usage

**Solutions:**

```bash
# On remote machine:
# Check system load
uptime
# If load is high, reduce screenshot frequency

# Monitor server logs
node server.js  # Watch console output

# Check disk space (screenshot capture needs space)
df -h /tmp

# If /tmp is full:
rm -f /tmp/broadcast-*.jpg
rm -f /tmp/screenshot.jpg
```

---

### 8. Sources Disappear from List

**Symptoms:**
- Source button not appearing
- Settings don't save
- Configuration resets after restart

**Cause:**
- electron-store permission issue
- Config file corruption

**Solution:**

```bash
# Reset configuration
rm ~/Library/Application\ Support/moshly-broadcast/*

# Or manually edit config:
# macOS: ~/Library/Application\ Support/moshly-broadcast/config.json
# Edit and verify JSON is valid

# Restart app
npm run dev
```

---

### 9. HDMI Output Not Switching

**Important:** Moshly Broadcast controls what gets *captured*, not the display output.

**If HDMI doesn't switch when broadcast changes:**

1. Verify HDMI is detected:
   - System Preferences → Displays → Check external display

2. Verify resolution:
   - External display resolution must match capture resolution

3. Enable "Mirror Displays" or set external as main:
   - System Preferences → Displays

4. For selective HDMI output:
   - Use DisplayLink or Blackmagic DeckLink
   - Configure in System Preferences

---

## Performance Tuning

### For Low-Bandwidth Networks

```javascript
// electron/main.js
broadcastState.fps = 1;           // 1 FPS = 1 screenshot/second
broadcastState.resolution = '960x540';  // Reduce resolution
```

### For High-Latency Scenarios

```bash
# Server-side: Reduce JPEG quality
# In server.js, add quality parameter
execSync(`screencapture -x -j 80 "${SCREENSHOT_FILE}"`);
// -j 80 = 80% JPEG quality (reduces file size by ~30%)
```

### For Many Concurrent Sources

```javascript
// Don't capture all sources simultaneously
// Instead, only capture the active one:
const activeSource = sources[currentIndex];
captureSource(activeSource);  // Skip others
```

---

## Network Debugging

### Capture network traffic

```bash
# macOS (use Instruments or command line):
tcpdump -i en0 -A 'tcp port 8080'

# Or use mitmproxy:
brew install mitmproxy
mitmproxy -p 8080
```

### Check DNS resolution

```bash
# If using hostnames instead of IPs:
nslookup mac-b.local
# or
ping mac-b.local

# If doesn't resolve, use direct IP instead
```

---

## Emergency Recovery

### If Sticky Hub Crashes During Presentation

```bash
# Terminal fallback (basic broadcast control):
while true; do
  curl -s http://192.168.1.50:8080/screenshot > /tmp/broadcast.jpg
  # View in Preview.app or display on HDMI
  open /tmp/broadcast.jpg
done
```

### If Network is Down

Switch to **local sources only**:
- Desktop 2 (PowerPoint)
- Desktop 3 (Browser)

Disable Mac B/C sources in UI until network recovers.

### Force Quit Everything

```bash
killall -9 "Moshly Broadcast"
killall -9 "node"
```

Then restart cleanly.

---

## Data Collection for Support

**If you need help, gather this info:**

```bash
# System info
system_profiler SPSoftwareDataType > system.txt

# Network config
ifconfig > network.txt

# Electron logs
cd ~/Library/Logs/moshly-broadcast
cat main.log

# Server logs (from remote machine)
# Copy last 100 lines of server output

# Performance metrics
node diagnose.js --target 192.168.1.50 --verbose > diagnostics.txt
```

Share these files when reporting issues.

---

## Advanced: Custom Resolution Profiles

```javascript
// In electron/main.js, add preset profiles:

const RESOLUTION_PROFILES = {
  'hd': { width: 1280, height: 720, fps: 2 },
  'fhd': { width: 1920, height: 1080, fps: 2 },
  '4k': { width: 3840, height: 2160, fps: 1 },
  'lowbw': { width: 640, height: 360, fps: 1 },
};

// User can select profile in settings
```

---

## Resources

- **AppleScript Reference:** https://developer.apple.com/library/archive/documentation/AppleScript/
- **Electron Documentation:** https://www.electronjs.org/docs
- **Express.js Debugging:** https://expressjs.com/en/guide/debugging.html
- **Network Troubleshooting:** https://en.wikipedia.org/wiki/Network_troubleshooting

---

**Still stuck?** Check the GitHub issues or open a new one with diagnostics output.

Good luck! 🎬
