# ⚡ Moshly Broadcast — Quick Reference

## 🚀 5-Minute Setup

### Mac B & C (Screenshot Servers)
```bash
npm install
npm start
# Server runs on http://localhost:8080
```

### Mac A (Sticky Hub Control)
```bash
npm install
npm run dev
# Opens Sticky Hub window automatically
```

---

## 🎮 Controls During Presentation

### Keyboard Shortcuts
| Action | Shortcut |
|--------|----------|
| Next Source | `Cmd+Right` |
| Previous Source | `Cmd+Left` |
| Lock/Unlock | `Space` |

### Mouse Controls
- Click any source button to switch
- [PREV] / [NEXT] buttons
- [🔄] Refresh button

---

## 📺 What Gets Broadcast

**Only these can be broadcast:**
- ✅ Desktop 2 (your Mac)
- ✅ Desktop 3 (your Mac)
- ✅ Mac B Desktop 1
- ✅ Mac C Desktop 1

**Never broadcast:**
- ❌ Desktop 1 (your private control room)

---

## 🔧 Configuration

### Add new remote source
Edit `electron/main.js`:
```javascript
{
  id: 5,
  name: 'New Mac',
  type: 'remote',
  ip: '192.168.1.x',
  port: 8080,
  enabled: true
}
```

### Get IP addresses
```bash
# On each Mac B/C:
ifconfig | grep "inet " | grep -v 127.0.0.1
```

---

## ⚠️ If Something Goes Wrong

### Server not responding
```bash
# Check if it's running:
curl http://192.168.1.50:8080/health

# Restart:
# Stop current with Ctrl+C
# Run: npm start
```

### Preview frozen
- Click 🔄 Refresh button
- Check WiFi connection
- Reduce FPS in config if needed

### Sticky Hub crashed
```bash
# Restart:
npm run dev
```

---

## 📋 Checklist Before Presentation

- [ ] Mac B server running (`npm start`)
- [ ] Mac C server running (`npm start`)
- [ ] All IPs configured correctly
- [ ] Sticky Hub open on Mac A Desktop 1
- [ ] HDMI connected to projector
- [ ] Preview showing correct content
- [ ] Test Cmd+Right / Cmd+Left switching
- [ ] Broadcast locked with Space (optional safety)

---

## 🎯 During Presentation Flow

```
1. Start on Desktop 2 (presentation)
   └─ Audience sees PowerPoint

2. Cmd+Right → Switch to Desktop 3
   └─ Audience sees Browser demo

3. Cmd+Right → Switch to Mac B
   └─ Audience sees Mac B Desktop 1

4. Cmd+Right → Switch to Mac C
   └─ Audience sees Mac C Desktop 1

5. Cmd+Right → Back to Desktop 2
   └─ Loop repeats

You stay on Desktop 1, see everything in preview.
```

---

## 📞 Emergency Contacts

**System freezes?** Force quit:
```bash
# In terminal:
killall "Moshly Broadcast"
# or: Cmd+Option+Esc → force quit
```

**Server dies?** Restart on that Mac:
```bash
npm start
```

**Network issue?** Switch to local (Desktop 2/3 only) temporarily.

---

**Good luck! 🎬 You've got this.**
