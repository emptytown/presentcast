# 🗺️ Moshly Broadcast — Product Roadmap

**Status:** MVP launched, production-ready  
**Current Version:** 1.0.0  
**Last Updated:** April 2025

---

## 📍 Current State (v1.0)

### ✅ Shipped Features
- [x] Sticky Hub control window (Desktop 1)
- [x] Multi-source switching (Desktop 2, 3, Mac B, C)
- [x] Local space capture (AppleScript)
- [x] Remote screenshot via HTTP
- [x] Keyboard shortcuts (Cmd+Left/Right)
- [x] Broadcast lock (Space key)
- [x] Live preview (2 FPS default)
- [x] Configuration management (electron-store)
- [x] Server template for remote machines

### 🚀 Quick Wins (1-2 weeks)
- [ ] Settings UI modal (add/remove sources)
- [ ] Custom source naming
- [ ] Resolution profiles (HD/FHD/4K)
- [ ] FPS adjustment slider
- [ ] Remember window position

---

## 🔜 V1.1 (Late April 2025)

### Layout & Visualization
- [ ] **Picture-in-Picture (PiP) mode**
  - Show 2-3 sources at once
  - Drag & resize windows
  
- [ ] **Grid layout**
  - 2x2 or 2x3 grid view
  - Tap to switch active broadcast
  - Perfect for multi-source comparison

- [ ] **Custom wallpaper / branded background**
  - Logo/brand in black bars
  - Custom colors per conference

### Source Management
- [ ] **Drag-to-reorder sources**
  - Reorder buttons in Sticky Hub
  - Persist order

- [ ] **Source aliasing**
  - Rename "Mac B" → "Claude Instance"
  - Custom icons per source

- [ ] **Source grouping**
  - Group related sources (e.g., "Battle Demo")
  - Collapse/expand groups

---

## 🎥 V1.2 (May 2025)

### Recording & Playback
- [ ] **Recording to file**
  - Start/stop recording button
  - Save as MP4 with timestamps
  - Background recording (doesn't impact live broadcast)

- [ ] **Instant replay**
  - Last 30s / 1min buffer
  - Rewind/play back during presentation

- [ ] **Session archival**
  - Auto-upload to cloud (optional)
  - Generate shareable link

### Analytics
- [ ] **Broadcast stats**
  - Duration, source switches, FPS
  - Network utilization
  - Export CSV report

---

## 📱 V1.3 (June 2025)

### Remote Control
- [ ] **iPad app (complementary)**
  - Connect to Sticky Hub via WebSocket
  - Remote source switching
  - Preview on iPad + HDMI output

- [ ] **iPhone web remote**
  - QR code pairing
  - Quick tap to switch sources
  - Live preview (thumbnail grid)

- [ ] **Physical remote support**
  - USB HID device support
  - Hotkey configuration UI

### Accessibility
- [ ] **Keyboard accessibility**
  - Number keys (1-4) to switch sources
  - Tab navigation in UI
  - Screen reader support

---

## 🎨 V2.0 (July-August 2025)

### Advanced Layouts
- [ ] **Custom layout builder**
  - Drag/drop to create grid layouts
  - Save/load layout presets
  - Scene transitions (fade, slide)

- [ ] **Source effects**
  - Blur, grayscale, brightness
  - Crop & pan
  - Green screen (chroma key) support

- [ ] **Animated transitions**
  - Fade between sources
  - Wipe, dissolve effects
  - Configurable duration

### Streaming Integration
- [ ] **RTMP output**
  - Stream directly to Twitch, YouTube
  - Multi-streaming (simultaneous platforms)
  - Bitrate / quality presets

- [ ] **WebRTC support**
  - Low-latency streaming
  - Virtual camera support
  - Zoom / Meet / Teams integration

- [ ] **SRT (Secure Reliable Transport)**
  - For professional broadcast
  - Redundancy / failover

---

## 🤖 V2.1 (Q3 2025)

### AI Integration
- [ ] **Auto-captioning**
  - Real-time captions
  - Multi-language support

- [ ] **Scene detection**
  - Automatically switch sources based on content
  - Detect when to show vs. hide presenter

- [ ] **Blur detection**
  - Auto-blur sensitive content
  - Whitelist certain windows

- [ ] **Moshly Suite integration**
  - Sync with Eventalys for event details
  - Integrate StageCall for cues
  - Pull from ShowBudget for financial overlay

---

## 🔐 V2.2 (Q3-Q4 2025)

### Security & Enterprise
- [ ] **End-to-end encryption**
  - Encrypted stream between Mac A ↔ B/C
  - Encrypted recording

- [ ] **Access control**
  - User authentication
  - Role-based permissions (admin, operator, viewer)

- [ ] **Audit logging**
  - Log all source switches
  - Who switched what and when

- [ ] **Data retention policy**
  - Auto-delete old recordings
  - GDPR / privacy compliance

---

## 💼 V3.0 (Q4 2025)

### Commercial Features
- [ ] **SaaS Dashboard**
  - Central management for multiple events
  - Analytics aggregation
  - Team collaboration

- [ ] **Cloud recording**
  - Auto-upload to S3 / Azure / GCS
  - Backup & disaster recovery

- [ ] **Scheduled broadcasts**
  - Calendar integration
  - Auto-start recording at event time

- [ ] **White-label version**
  - Rebrand for partners
  - Custom domain hosting

---

## 🌍 Long-Term Vision

### Platform Expansion
- [ ] **Windows & Linux support**
  - Port Electron app to all OSes
  - DirectShow / V4L2 for local capture

- [ ] **Web-based version**
  - No installation needed
  - Works in browser (Chrome, Safari, Firefox)

- [ ] **Mobile broadcast hub**
  - Android app for remote sources
  - iOS companion app

### Integration Ecosystem
- [ ] **OBS plugin**
  - Moshly as OBS source
  - Bi-directional sync

- [ ] **Slack integration**
  - Post broadcast status to Slack
  - Receive commands via Slack

- [ ] **Moshly Hub integration**
  - Unified broadcast + ticketing + merch
  - Single control center for shows

---

## 📊 Metrics & KPIs

### Success Criteria (v1.0)
- ✅ Zero network latency issues in testing
- ✅ 5+ simultaneous sources supported
- ✅ <50ms UI response time
- ✅ <1s broadcast switch time
- ✅ Zero crashes during 4-hour session

### Targets for v1.1+
- 1000+ active users in 6 months
- 99.9% uptime (if cloud-hosted)
- <100ms round-trip latency at 2 Mbps network
- <500ms cold start time
- NPS > 8.0

---

## 🎯 Immediate Next Steps

**This Week:**
- [ ] Settings UI modal (drag & drop, add/remove)
- [ ] Electron auto-updater setup
- [ ] GitHub Actions CI/CD pipeline

**Next Week:**
- [ ] Beta testing with 3-5 real conferences
- [ ] Collect user feedback & refine
- [ ] Publish to first app stores

**Following Week:**
- [ ] v1.1 features (PiP, grid layout)
- [ ] Performance optimization
- [ ] Documentation video tutorials

---

## 💡 Feature Ideas (Backlog)

**From User Feedback:**
- [ ] Hotkey customization UI
- [ ] Right-click context menu on sources
- [ ] Source thumbnails (small preview in button)
- [ ] Countdown timer to broadcast start
- [ ] Virtual "green room" (preview desk)
- [ ] Audio level meter
- [ ] "On-air" indicator light
- [ ] Screenshot watermark (logo overlay)

**From Moshly Team:**
- [ ] Integration with GigBid (broadcast negotiation proposals)
- [ ] Integration with RoadBook (show logistics)
- [ ] Integration with TrueRider (rider broadcast notes)

---

## 📝 Version History

| Version | Release Date | Major Features |
|---------|--------------|----------------|
| 1.0.0 | Apr 22, 2025 | MVP, multi-source, sticky hub |
| 1.1.0 | May 2025 (planned) | PiP, grid layout, settings UI |
| 1.2.0 | Jun 2025 (planned) | Recording, instant replay, analytics |
| 1.3.0 | Jul 2025 (planned) | iPad/remote control, accessibility |
| 2.0.0 | Aug 2025 (planned) | Advanced layouts, streaming, effects |

---

## 🤝 Contributing

Want to help? Ideas, PRs, and feedback welcome!

- **Issues:** Feature requests, bug reports
- **Discussions:** Design feedback, use cases
- **PRs:** Code improvements, new features

---

## 📞 Contact & Support

- **Email:** hello@moshly.io
- **Twitter:** @moshly_io
- **GitHub Issues:** https://github.com/emptytown/moshly-broadcast/issues

---

**Made with ❤️ for creators, performers, and live event professionals.**

🎬 **Moshly Broadcast** — Control your stage. Trust your broadcast.
