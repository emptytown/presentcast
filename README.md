# 🎬 Moshly Broadcast

**Production-ready broadcast control hub for live presentations.**

Control multiple Macs (and display sources) from a single sticky window. Perfect for:
- Conference presentations
- Live AI prompt battles (side-by-side comparison)
- Multi-desktop workflows
- Remote collaboration

---

## 📸 What You Get

```
Your Mac (Desktop 1 — Private Control Center)
├─ Sticky Hub window (always visible)
│  ├─ Live preview of current broadcast
│  ├─ Source selector (Desktop 2, 3, Mac B, Mac C)
│  └─ Next/Prev controls (keyboard or buttons)
├─ Desktop 2 (PowerPoint) — Can broadcast
├─ Desktop 3 (Browser) — Can broadcast
└─ Connected to Mac B & C servers

Result: Switch what's on the projector without leaving Desktop 1 ✨
```

---

## 🚀 Setup (TL;DR)

**Mac B & C:**
```bash
npm install && npm start
```

**Mac A (yours):**
```bash
npm install && npm run dev
```

**That's it.** Detailed guide: [SETUP.md](./SETUP.md)

---

## 🎮 Usage

### Keyboard
- `Cmd+Right` → Next source
- `Cmd+Left` → Previous source
- `Space` → Lock/unlock broadcast

### Mouse
- Click any source button
- Use [PREV] / [NEXT] buttons
- [🔄] to refresh preview

---

## 📁 Project Structure

```
moshly-broadcast/
├── electron/
│   ├── main.js              # Electron main process
│   └── preload.js           # Secure IPC bridge
├── src/
│   ├── StickyHub.jsx        # Main React component
│   ├── StickyHub.css        # Styling
│   ├── App.jsx
│   └── index.jsx
├── public/
│   └── index.html           # React entry point
├── server.js                # Screenshot server (for Mac B/C)
├── package.json
└── SETUP.md                 # Full documentation
```

---

## 🔌 How It Works

### Architecture

```
Mac A (Your Control Machine)
  │
  ├─ Desktop 1 (Private)
  │  └─ Sticky Hub (React + Electron)
  │     ├─ Captures Desktop 2 screenshots
  │     ├─ Captures Desktop 3 screenshots
  │     └─ Fetches screenshots from Mac B/C via HTTP
  │
  ├─ Desktop 2 (Broadcast)
  │  └─ PowerPoint (or anything)
  │
  └─ Desktop 3 (Broadcast)
     └─ Browser (or anything)

Mac B (Slave 1)
  └─ Node.js Server
     └─ GET /screenshot → returns JPEG of Desktop 1

Mac C (Slave 2)
  └─ Node.js Server
     └─ GET /screenshot → returns JPEG of Desktop 1

HDMI Output:
  └─ Whichever source is "active" in Sticky Hub
```

### Tech Stack

- **Frontend:** React 18 + CSS3
- **Desktop:** Electron 25
- **Backend (Mac A):** Node.js (IPC, AppleScript bridge)
- **Backend (Mac B/C):** Express.js (screenshot server)
- **Storage:** electron-store (persistent config)

---

## ⚙️ Configuration

### Add/Remove Remote Sources

Edit `electron/main.js`, `DEFAULT_SOURCES` array:

```javascript
{
  id: 4,
  name: 'Mac D (Custom)',
  type: 'remote',
  ip: '192.168.1.52',
  port: 8080,
  enabled: true
}
```

### Adjust Refresh Rate

```javascript
// In electron/main.js
broadcastState.fps = 2; // 2 FPS (default, 500ms)
// 1 FPS = lower bandwidth, 3+ FPS = higher quality
```

### Change Resolution

```javascript
resolution: store.get('resolution', '1280x720')
// Options: '1280x720', '1920x1080', '2560x1440'
```

---

## 🎯 Use Cases

### 1. Conference Presentation
```
Desktop 1: Notes + Sticky Hub
Desktop 2: Slides (broadcast)
Desktop 3: Browser for live demos
→ Control what's shown without flipping windows
```

### 2. AI Prompt Battle
```
Mac A Desktop 1: Sticky Hub + timing
Mac B: Claude
Mac C: ChatGPT
→ Side-by-side comparison, switch on demand
```

### 3. Remote Collaboration
```
Mac A: Your screen (private)
Mac B: Collaborator 1 (broadcast)
Mac C: Collaborator 2 (broadcast)
→ Moderate who's speaking to the audience
```

---

## 🐛 Troubleshooting

### Remote source not connecting
```bash
# Check Mac B is running:
curl http://192.168.1.50:8080/health

# Check network:
ping 192.168.1.50
```

### Preview not updating
- Click 🔄 Refresh
- Check WiFi connection quality
- Reduce FPS if bandwidth is limited

### Sticky Hub crashed
```bash
# Restart from terminal:
npm run dev
```

### AppleScript permission denied
- macOS → System Preferences → Security & Privacy
- Grant Terminal access to accessibility controls

---

## 📦 Building for Production

```bash
npm run build
# Creates: Moshly Broadcast.app
```

Or with electron-builder:
```bash
npm run electron-build
```

---

## 🚦 Roadmap

- [ ] Multi-display layout (PiP, grid view)
- [ ] Recording + replay
- [ ] iPad remote control
- [ ] Custom RTMP sources
- [ ] Window-specific capture (not full desktop)
- [ ] Reordering sources (drag & drop)
- [ ] Hotkey customization UI

---

## 📝 License

MIT — Use, modify, distribute freely.

---

## 💬 Support

**Questions?** Check [SETUP.md](./SETUP.md) for detailed troubleshooting.

**Found a bug?** File an issue with:
- macOS version
- Steps to reproduce
- Electron dev tools logs (`Cmd+I`)

---

**Made with ❤️ for presenters, performers, and makers who need control.**

🎬 Moshly Broadcast — Trust your broadcast.
