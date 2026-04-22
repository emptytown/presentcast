#!/bin/bash

###############################################################################
#                                                                             #
#  PresentCast — Server Installation Script                                  #
#  Para Mac B, Mac C, e outros servidores                                    #
#                                                                             #
#  Usage: bash install-server.sh                                             #
#                                                                             #
###############################################################################

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Banner
echo ""
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║                                                           ║"
echo "║         PresentCast — Server Installation                ║"
echo "║                                                           ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

# Check Node.js
echo -e "${BLUE}Verificando dependências...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}✗ Node.js não encontrado${NC}"
    echo "  Instala com: brew install node"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo -e "${RED}✗ npm não encontrado${NC}"
    exit 1
fi

NODE_VERSION=$(node -v)
echo -e "${GREEN}✓ Node.js ${NODE_VERSION}${NC}"

# Get installation directory
INSTALL_DIR="${1:-.}"
INSTALL_PATH="$(cd "$INSTALL_DIR" && pwd)"

echo -e "${BLUE}Diretório de instalação: ${INSTALL_PATH}${NC}"

# Clone if needed
if [ ! -d "$INSTALL_PATH/presentcast" ]; then
    echo ""
    echo -e "${BLUE}Clonando repositório...${NC}"
    cd "$INSTALL_PATH"
    git clone https://github.com/emptytown/presentcast.git
    cd presentcast
else
    echo -e "${YELLOW}⚠ Diretório presentcast já existe${NC}"
    cd "$INSTALL_PATH/presentcast"
    echo -e "${BLUE}Atualizando repositório...${NC}"
    git pull origin main
fi

# Install dependencies
echo ""
echo -e "${BLUE}Instalando dependências npm...${NC}"
npm install

# Detect IP
echo ""
echo -e "${BLUE}Detectando IP local...${NC}"
LOCAL_IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | head -1 | awk '{print $2}')

if [ -z "$LOCAL_IP" ]; then
    LOCAL_IP="192.168.1.x (detecta manualmente)"
fi

echo -e "${GREEN}✓ IP detectado: ${LOCAL_IP}${NC}"

# Create systemd service (opcional, para auto-start)
echo ""
echo -e "${YELLOW}Quer criar um serviço para auto-iniciar? (S/N)${NC}"
read -p "Resposta: " CREATE_SERVICE

if [[ "$CREATE_SERVICE" =~ ^[Ss]$ ]]; then
    SERVICE_FILE="/tmp/presentcast.service"
    WORK_DIR="$(pwd)"
    
    cat > "$SERVICE_FILE" << EOF
[Unit]
Description=PresentCast Screenshot Server
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=$WORK_DIR
ExecStart=/usr/local/bin/npm start
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF
    
    echo -e "${GREEN}✓ Serviço criado em: $SERVICE_FILE${NC}"
    echo -e "${YELLOW}Para instalar: sudo cp $SERVICE_FILE /etc/systemd/system/${NC}"
    echo -e "${YELLOW}Depois: sudo systemctl enable presentcast${NC}"
fi

# Success
echo ""
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║                   ✅ INSTALAÇÃO COMPLETA                 ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""
echo -e "${GREEN}Para iniciar o servidor:${NC}"
echo ""
echo "  cd $(pwd)"
echo "  npm start"
echo ""
echo -e "${BLUE}Servidor rodará em:${NC}"
echo "  http://localhost:8080"
echo "  http://${LOCAL_IP}:8080"
echo ""
echo -e "${YELLOW}Próximo passo:${NC}"
echo "  1. Copia o IP acima"
echo "  2. Cola em Mac A (PresentCast Settings)"
echo "  3. Marque 'Enabled' para esta máquina"
echo ""
