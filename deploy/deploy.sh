#!/bin/bash
# cdpilot-site deploy script — Server 21
set -e

SERVER="root@10.0.0.21"
SSH_PORT=2222
REMOTE_DIR="/opt/cdpilot-site"
LOCAL_DIR="$(cd "$(dirname "$0")/.." && pwd)"

echo "Building..."
cd "$LOCAL_DIR"
npm run build

echo "Syncing to server..."
rsync -avz --delete \
  --exclude node_modules \
  --exclude .git \
  --exclude .next/cache \
  -e "ssh -p $SSH_PORT" \
  "$LOCAL_DIR/" "$SERVER:$REMOTE_DIR/"

echo "Installing dependencies and restarting..."
ssh -p $SSH_PORT $SERVER "
  cd $REMOTE_DIR &&
  npm install --production &&
  pm2 delete cdpilot-site 2>/dev/null || true &&
  pm2 start deploy/ecosystem.config.js &&
  pm2 save
"

echo "Done! https://cdpilot.ndr.ist"
