#!/bin/bash

###############################################################################
#                                                                             #
#  PresentCast — Interactive Setup Wizard                                    #
#  Para configurar rapidamente todos os Macs                                 #
#                                                                             #
#  Usage: bash setup-mac.sh                                                  #
#                                                                             #
###############################################################################

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Banner
clear
echo ""
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║                                                           ║"
echo "║        PresentCast — Setup Wizard 🎬                      ║"
echo "║                                                           ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

# Ask mode
echo -e "${YELLOW}O que vais configurar?${NC}"
echo ""
echo "  1) Mac A (Control Hub) — Sticky Hub + Desktop 2 & 3"
echo "  2) Mac B (Server) — Screenshot server"
echo "  3) Mac C (Server) — Screenshot server"
echo ""
read -p "Escolhe (1/2/3): " MODE

case $MODE in
    1)
        echo ""
        echo -e "${BLUE}=== Mac A Setup ===${NC}"
        echo ""
        echo "Já tens clonado o repositório?"
        echo "  git clone https://github.com/emptytown/presentcast.git"
        echo ""
        read -p "Já clonaste? (S/N): " CLONED
        
        if [[ "$CLONED" =~ ^[Ss]$ ]]; then
            cd presentcast
            npm install
            
            echo ""
            echo -e "${GREEN}✓ Dependências instaladas${NC}"
            echo ""
            echo -e "${YELLOW}Próximo passo:${NC}"
            echo "  npm run dev"
            echo ""
            echo "Isto abre o Sticky Hub automaticamente."
            echo ""
            read -p "Quer iniciar agora? (S/N): " START_NOW
            
            if [[ "$START_NOW" =~ ^[Ss]$ ]]; then
                npm run dev
            fi
        else
            echo ""
            echo -e "${BLUE}Clona o repositório primeiro:${NC}"
            echo "  git clone https://github.com/emptytown/presentcast.git"
            echo "  cd presentcast"
            echo "  bash setup-mac.sh"
            exit 0
        fi
        ;;
        
    2|3)
        if [ "$MODE" = "2" ]; then
            MAC_NAME="Mac B"
        else
            MAC_NAME="Mac C"
        fi
        
        echo ""
        echo -e "${BLUE}=== ${MAC_NAME} Setup ===${NC}"
        echo ""
        echo "Este script vai:"
        echo "  ✓ Clonar o repositório"
        echo "  ✓ Instalar dependências"
        echo "  ✓ Detectar IP local"
        echo "  ✓ Iniciar servidor"
        echo ""
        read -p "Continuar? (S/N): " CONTINUE
        
        if [[ "$CONTINUE" =~ ^[Ss]$ ]]; then
            # Clone
            echo ""
            echo -e "${BLUE}Clonando...${NC}"
            
            INSTALL_DIR="${HOME}/DEV"
            if [ ! -d "$INSTALL_DIR" ]; then
                mkdir -p "$INSTALL_DIR"
            fi
            
            if [ ! -d "$INSTALL_DIR/presentcast" ]; then
                cd "$INSTALL_DIR"
                git clone https://github.com/emptytown/presentcast.git
            else
                cd "$INSTALL_DIR/presentcast"
                git pull origin main
            fi
            
            cd presentcast
            
            # Install
            echo -e "${BLUE}Instalando npm...${NC}"
            npm install
            
            # Detect IP
            echo ""
            echo -e "${BLUE}Detectando IP...${NC}"
            LOCAL_IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | head -1 | awk '{print $2}')
            
            if [ -z "$LOCAL_IP" ]; then
                echo -e "${YELLOW}Não consegui detectar IP automaticamente.${NC}"
                echo "Qual é o IP local desta máquina?"
                read LOCAL_IP
            fi
            
            echo -e "${GREEN}✓ IP: ${LOCAL_IP}${NC}"
            echo ""
            echo -e "${YELLOW}NOTA IMPORTANTE:${NC}"
            echo "  Copia este IP: ${LOCAL_IP}"
            echo "  E cola em Mac A → PresentCast Settings"
            echo ""
            
            # Start server
            echo -e "${YELLOW}Quer iniciar o servidor agora? (S/N)${NC}"
            read -p "Resposta: " START_SERVER
            
            if [[ "$START_SERVER" =~ ^[Ss]$ ]]; then
                echo ""
                echo -e "${GREEN}Iniciando servidor...${NC}"
                echo ""
                npm start
            else
                echo ""
                echo -e "${BLUE}Para iniciar depois, roda:${NC}"
                echo "  cd $INSTALL_DIR/presentcast"
                echo "  npm start"
                echo ""
            fi
        else
            echo "Setup cancelado."
            exit 0
        fi
        ;;
        
    *)
        echo -e "${RED}Opção inválida${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}✅ Setup completo!${NC}"
echo ""
