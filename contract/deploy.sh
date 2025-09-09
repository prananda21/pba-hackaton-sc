#!/usr/bin/env bash
set -euo pipefail

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_info()    { echo -e "${BLUE}[INFO]${NC} $1"; }
print_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
print_error()   { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }

# Load .env from project root
ENV_FILE="$(cd "$(dirname "$0")" && pwd)/.env"

if [ -f "$ENV_FILE" ]; then
    set -o allexport
    source "$ENV_FILE"
    set +o allexport
    print_success "Environment variables loaded from .env"
else
    print_error ".env file not found at $ENV_FILE"
fi

# Validate env vars
[ -z "${PRIVATE_KEY:-}" ] && print_error "PRIVATE_KEY is not set in .env"
[ -z "${RPC_URL:-}" ] && print_error "RPC_URL is not set in .env"

# Run Foundry script
print_info "Deploying to RPC: $RPC_URL"

forge create Medisa \
  --rpc-url $RPC_URL \
  --private-key $PRIVATE_KEY \
  --resolc \
  --broadcast \
  --verifier blockscout \
  --verifier-url "$BLOCKSCOUT_API_URL" \

print_success "Deployment script finished"