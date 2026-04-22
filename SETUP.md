# 🎬 Moshly Broadcast — Setup Guide

**Status:** Production-ready MVP  
**Tested:** macOS 12.0+  
**Dependencies:** Node.js 16+, npm 8+

---

## 📋 What You're Setting Up

```
Mac A (Your Control Machine)
├─ Desktop 1 (PRIVATE — never broadcast)
│  └─ 🟢 Sticky Hub (always visible, controls everything)
├─ Desktop 2 (PowerPoint)
└─ Desktop 3 (Browser Show)

Mac B & C (Slave Displays)
└─ Screenshot server (sends their Desktop 1 to broadcast)
```

**Result:** Single control hub on your Desktop 1, broadcast any source (your D2, D3, or Mac B/C) to HDMI/projector.

---

## 🚀 Quick Start (5 minutes)

### Step 1: Mac B & C Setup (Screenshot Servers)

**On each Mac B and Mac C:**

```bash
# Clone/download the server files
cd ~/Downloads
git clone https://github.com/emptytown/moshly-broadcast.git
cd moshly-broadcast

# Install dependencies
npm install

# Start the server
npm start

# You should see:
# ╔═══════════════════════════════════════╗
# ║   MOSHLY BROADCAST SERVER             ║
# ╚═══════════════════════════════════════╝
# 🚀 Server running on: http://localhost:8080
```

**Keep this terminal window open.** The server runs indefinitely.

### Step 2: Get IP Addresses

**On Mac B:**
```bash
# In another terminal on Mac B
ifconfig | grep "inet " | grep -v 127.0.0.1
# Copy the IP, e.g., 192.168.1.50
```

**On Mac C:**
```bash
# Same process, e.g., 192.168.1.51
```

### Step 3: Configure Sticky Hub (Mac A)

**On your Mac A:**

```bash
# Clone the broadcast app
cd ~/Development
git clone https://github.com/emptytown/moshly-broadcast.git
cd moshly-broadcast

# Install dependencies
npm install

# Start development mode
npm run dev

# This will:
# 1. Start React dev server (http://localhost:3000)
# 2. Launch Electron app (Sticky Hub)
```

### Step 4: Configure Sources

**In the Sticky Hub UI:**

1. Click ⚙️ Settings
2. Update Mac B IP: `192.168.1.50`
3. Update Mac C IP: `192.168.1.51`
4. Enable sources you want to broadcast
5. Click "Save & Close"

**That's it!** You're ready to broadcast.

---

## 🎯 Using Sticky Hub

### Desktop 1 (Your Private Control Room)

```
┌─────────────────────────────────┐
│ 🟢 MOSHLY BROADCAST HUB         │ ← Always visible, never broadcast
├─────────────────────────────────┤
│ 📺 NOW BROADCASTING: Desktop 2  │
│ ┌───────────────────────────────┐
│ │ [Live preview of broadcast]   │
│ └───────────────────────────────┘
├─────────────────────────────────┤
│ ☑️ Desktop 2 (PowerPoint)       │
│ ☐ Desktop 3 (Browser Show)      │
│ ☐ Mac B                         │
│ ☐ Mac C                         │
│ [◀️ PREV] [🔄] [NEXT ▶️]        │
└─────────────────────────────────┘
```

### Controls

**Mouse:**
- Click any source button to broadcast it
- Use [PREV] / [NEXT] to cycle through sources
- [🔄] to refresh preview (if frozen)

**Keyboard Shortcuts:**
- `Cmd+Right` → Next source
- `Cmd+Left` → Previous source
- `Space` → Toggle broadcast lock (prevents accidental switches)

### Workflow Example (Battle de Prompts)

```
1. Start on Desktop 2 (presentation intro)
   └─ Audience sees your PowerPoint

2. Cmd+Right → Switch to Mac B
   └─ Audience sees Mac B Desktop 1 (AI Prompt 1)

3. Cmd+Right → Switch to Mac C
   └─ Audience sees Mac C Desktop 1 (AI Prompt 2)

4. Cmd+Right → Back to Desktop 3
   └─ Audience sees Browser demo

5. Cmd+Right → Back to Desktop 2
   └─ Loop continues
```

**You see all of this in Sticky Hub preview** — never lost about what's being broadcast.

---

## 🔧 Configuration

### Adding New Remote Sources

**In Sticky Hub Settings:**

```json
{
  "name": "Mac D (Custom)",
  "type": "remote",
  "ip": "192.168.1.52",
  "port": 8080,
  "enabled": true
}
```

### Adjusting Capture Resolution

**Edit `electron/main.js`:**

```javascript
resolution: store.get('resolution', '1920x1080') // Change default
```

### Refresh Rate

Default is **2 FPS** (500ms capture interval). To change:

**In `electron/main.js`:**

```javascript
broadcastState.fps = 1; // 1 FPS = 1000ms interval
broadcastState.fps = 3; // 3 FPS = 333ms interval
broadcastState.fps = 5; // 5 FPS = 200ms interval (higher bandwidth)
```

---

## 🐛 Troubleshooting

### "Connection refused" to Mac B/C

**Check:**
1. Is the server running on Mac B/C? (`node server.js`)
2. Is the IP correct? Run `ifconfig` on the source Mac
3. Are they on the same WiFi network?
4. Try from terminal: `curl http://192.168.1.50:8080/health`

**Expected response:**
```json
{
  "status": "ok",
  "port": 8080,
  "timestamp": "2026-04-22T..."
}
```

### Preview is frozen / not updating

- Click 🔄 Refresh button
- Check network latency: `ping 192.168.1.50`
- If >500ms, reduce FPS (see Configuration above)

### Sticky Hub disappeared

- Try: `Cmd+Tab` to switch apps, find Moshly Broadcast
- If crashed, restart: `npm run dev` from moshly-broadcast folder

### HDMI output not switching

- This app controls **what gets captured**, not the display output
- Verify macOS is correctly mirroring/extending to HDMI
- In System Preferences → Displays, confirm external monitor is detected

---

## 📱 Building for Production

**When you're ready to ship:**

```bash
npm run build
# Creates: Moshly Broadcast.app (ready to distribute)
```

---

## 🎓 Architecture

```
Mac A (Master)
  ├─ React UI (Sticky Hub)
  ├─ Electron (window management, IPC)
  └─ Capture backends:
      ├─ Local: AppleScript (Spaces) + screencapture
      └─ Remote: HTTP fetch from Mac B/C servers

Mac B/C (Slaves)
  └─ Node.js Express server
      └─ GET /screenshot → JPEG stream
```

---

## 🚨 Known Limitations

1. **AppleScript Space switching:** Currently captures current space only. If you need to automate Space switching, requires additional AppleScript setup.

2. **Network latency:** Remote sources have ~500ms-1s delay depending on network. Same WiFi network is strongly recommended.

3. **Resolution:** Captures full screen. To capture specific window, requires additional refinement.

---

## 📞 Support / Next Steps

**Feature requests:**
- Multi-display layout (PiP, grid)
- Recording to file
- Remote control via iPhone
- Custom RTMP source support

**Found a bug?**
- Check Electron dev tools: `Cmd+I` in Sticky Hub
- Check Node.js server logs on Mac B/C

---

## 📄 License

MIT — Use freely, modify as needed.

---

**Happy broadcasting! 🎬**

Made with ❤️ for live presentations, AI battles, and conference madness.
