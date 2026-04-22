#!/bin/bash

#############################################################
#                                                           #
#  🎬 PRESENTCAST — Automatic Setup Script                #
#                                                           #
#  Usage: bash install.sh                                  #
#                                                           #
#  This script:                                            #
#  - Clones PresentCast from GitHub                        #
#  - Installs all dependencies                             #
#  - Starts the Sticky Hub                                 #
#                                                           #
#############################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Welcome message
echo ""
echo -e "${BLUE}╔═══════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                                                           ║${NC}"
echo -e "${BLUE}║         🎬 PRESENTCAST v1.0 — Setup                      ║${NC}"
echo -e "${BLUE}║      Sticky Broadcast Control Hub Installer              ║${NC}"
echo -e "${BLUE}║                                                           ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════════════╝${NC}"
echo ""

# Check if Node.js is installed
echo -e "${YELLOW}→ Checking prerequisites...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}✗ Node.js is not installed${NC}"
    echo "  Please install Node.js from: https://nodejs.org/"
    exit 1
fi
echo -e "${GREEN}✓ Node.js ${NC}$(node --version)"

if ! command -v npm &> /dev/null; then
    echo -e "${RED}✗ npm is not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ npm ${NC}$(npm --version)"

# Get installation directory
echo ""
echo -e "${YELLOW}→ Setting up installation directory...${NC}"
INSTALL_DIR="${HOME}/DEV/Moshly/presentcast"
read -p "Installation path [${INSTALL_DIR}]: " input
INSTALL_DIR="${input:-$INSTALL_DIR}"

# Create directory if doesn't exist
mkdir -p "$(dirname "$INSTALL_DIR")"

# Check if already exists
if [ -d "$INSTALL_DIR" ]; then
    echo -e "${YELLOW}⚠ Directory already exists: $INSTALL_DIR${NC}"
    read -p "Overwrite? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        rm -rf "$INSTALL_DIR"
    else
        echo -e "${RED}✗ Cancelled${NC}"
        exit 1
    fi
fi

# Clone repository
echo ""
echo -e "${YELLOW}→ Cloning PresentCast from GitHub...${NC}"
if git clone https://github.com/emptytown/presentcast.git "$INSTALL_DIR"; then
    echo -e "${GREEN}✓ Repository cloned${NC}"
else
    echo -e "${RED}✗ Failed to clone repository${NC}"
    exit 1
fi

cd "$INSTALL_DIR"

# Install dependencies
echo ""
echo -e "${YELLOW}→ Installing dependencies (this may take a few minutes)...${NC}"
if npm install; then
    echo -e "${GREEN}✓ Dependencies installed${NC}"
else
    echo -e "${RED}✗ Failed to install dependencies${NC}"
    exit 1
fi

# Ask about remote Macs
echo ""
echo -e "${YELLOW}→ Remote Mac configuration${NC}"
read -p "Do you want to configure remote Macs (B, C) now? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo -e "${BLUE}Configure Mac B:${NC}"
    read -p "Mac B IP address (leave empty to skip): " mac_b_ip
    
    echo ""
    echo -e "${BLUE}Configure Mac C:${NC}"
    read -p "Mac C IP address (leave empty to skip): " mac_c_ip
    
    # Create config file
    cat > presentcast-config.json <<EOF
{
  "macB": {
    "ip": "${mac_b_ip:-}",
    "port": 8080,
    "enabled": $([ -n "$mac_b_ip" ] && echo "true" || echo "false")
  },
  "macC": {
    "ip": "${mac_c_ip:-}",
    "port": 8080,
    "enabled": $([ -n "$mac_c_ip" ] && echo "true" || echo "false")
  }
}
EOF
    echo -e "${GREEN}✓ Configuration saved to presentcast-config.json${NC}"
fi

# Summary
echo ""
echo -e "${BLUE}╔═══════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                     ✅ SETUP COMPLETE                     ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${GREEN}PresentCast is ready!${NC}"
echo ""
echo "Next steps:"
echo "  1. cd $INSTALL_DIR"
echo "  2. npm run dev"
echo ""
echo "The Sticky Hub will open automatically."
echo ""

# Ask to start now
read -p "Start PresentCast now? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}→ Starting PresentCast...${NC}"
    npm run dev
else
    echo ""
    echo -e "${YELLOW}To start later, run:${NC}"
    echo "  cd $INSTALL_DIR"
    echo "  npm run dev"
    echo ""
fi
