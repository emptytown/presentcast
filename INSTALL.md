# 🚀 PresentCast — Quick Installation Guide

**Ultra-fast setup para Mac A, B, C com scripts automáticos.**

---

## 📋 Opções de Instalação

### **Opção 1: Wizard Interativo (RECOMENDADO) ⭐**

Mais fácil e interativo. Escolhe o teu Mac e segue os passos.

```bash
bash setup-mac.sh
```

Depois:
1. Escolhe: `1` (Mac A), `2` (Mac B), ou `3` (Mac C)
2. O script faz tudo automaticamente
3. Pronto!

---

### **Opção 2: Script Automático para Servidor**

Se só queres instalar o servidor (Mac B/C):

```bash
bash install-server.sh
```

O script:
- ✅ Clona repositório
- ✅ Instala dependências
- ✅ Detecta IP local
- ✅ Mostra próximos passos

---

### **Opção 3: Manual (Controlo Total)**

Se preferires fazer passo a passo:

```bash
# Clone
git clone https://github.com/emptytown/presentcast.git
cd presentcast

# Install
npm install

# Mac A (Control Hub)
npm run dev

# Mac B/C (Server)
npm start
```

---

## 🎯 Quick Setup Summary

### **Mac A (Control Hub) — 2 minutos**

```bash
cd ~/DEV/Moshly
git clone https://github.com/emptytown/presentcast.git
cd presentcast
npm install
npm run dev
```

✅ **Sticky Hub abre automaticamente**

---

### **Mac B (Server) — 3 minutos**

```bash
# Opção 1: Wizard (recomendado)
bash setup-mac.sh
# Escolhe opção 2

# Opção 2: Script direto
bash install-server.sh
```

✅ **Servidor fica a rodar em http://localhost:8080**

**Copia o IP que aparece (e.g., 192.168.1.50)**

---

### **Mac C (Server) — 3 minutos**

**Exatamente igual a Mac B:**

```bash
bash setup-mac.sh
# Escolhe opção 3
```

✅ **Servidor rodando**

**Copia o IP (e.g., 192.168.1.51)**

---

## 🔌 Configurar Mac B & C em Mac A

**Depois de terem IPs de Mac B e C:**

1. **Sticky Hub está aberto em Mac A**
2. **Clica em ⚙️ Settings**
3. **Para Mac B:**
   - IP: `192.168.1.50` (ou o teu)
   - Port: `8080`
   - ✓ Enabled
4. **Para Mac C:**
   - IP: `192.168.1.51` (ou o teu)
   - Port: `8080`
   - ✓ Enabled
5. **Save**

---

## ✅ Verificar Conexão

**Mac A:**

```bash
# Testa se consegue ver Mac B
curl http://192.168.1.50:8080/health
# Esperado: {"status":"ok",...}

# Testa screenshot
curl http://192.168.1.50:8080/screenshot > test.jpg
open test.jpg  # Abre screenshot de Mac B
```

---

## 🎬 Usar

**Em Mac A (Sticky Hub):**

```
Cmd+Right  → Próxima fonte
Cmd+Left   → Fonte anterior
Space      → Trancar broadcast
Click      → Ir para fonte específica
```

**4 Fontes disponíveis:**
1. Desktop 2 (Mac A)
2. Desktop 3 (Mac A)
3. Mac B Desktop 1
4. Mac C Desktop 1

---

## 🆘 Troubleshooting

### "Connection refused" para Mac B

```bash
# Mac B — Verifica se servidor está rodando
npm start

# Mac A — Testa conectividade
ping 192.168.1.50
curl http://192.168.1.50:8080/health
```

### "No such file or directory: bash"

```bash
# Torna script executável
chmod +x setup-mac.sh
bash setup-mac.sh
```

### IP não aparece

```bash
# Manual em Mac B/C
ifconfig | grep "inet " | grep -v 127.0.0.1
```

---

## 📚 Ficheiros de Suporte

- **START_HERE.md** — Ponto de entrada geral
- **QUICK_START.md** — Referência rápida durante apresentação
- **SETUP.md** — Guia detalhado
- **TROUBLESHOOTING.md** — Resolvendo problemas

---

## 🚀 TL;DR (Ultra-Rápido)

**Mac A:**
```bash
git clone https://github.com/emptytown/presentcast.git && cd presentcast && npm install && npm run dev
```

**Mac B:**
```bash
git clone https://github.com/emptytown/presentcast.git && cd presentcast && npm install && npm start
# Nota IP, configura em Mac A
```

**Mac C:**
```bash
Mesmo que Mac B, com IP diferente
```

---

**Pronto! 🎬**

Qualquer dúvida, check **TROUBLESHOOTING.md**
