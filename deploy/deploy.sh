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
  set -e
  cd $REMOTE_DIR &&
  npm install --production &&
  # Next.js standalone ships only the server bundle — the static/ and public/
  # trees must be co-located under standalone/ manually, otherwise every
  # /_next/static/* asset 404s and the client renders a white screen.
  # https://nextjs.org/docs/app/api-reference/config/next-config-js/output
  mkdir -p .next/standalone/01dev/cdpilot-site/.next &&
  rm -rf .next/standalone/01dev/cdpilot-site/.next/static &&
  cp -r .next/static .next/standalone/01dev/cdpilot-site/.next/ &&
  if [ -d public ]; then rm -rf .next/standalone/01dev/cdpilot-site/public && cp -r public .next/standalone/01dev/cdpilot-site/; fi &&
  pm2 delete cdpilot-site 2>/dev/null || true &&
  pm2 start deploy/ecosystem.config.js &&
  pm2 save
"

echo ""
echo "Smoke-testing static asset..."
ASSET=$(curl -s --max-time 10 https://cdpilot.ndr.ist/ | grep -oE 'src="/_next/static/[^"]*\.js"' | head -1 | sed 's/src="//;s/"//')
if [ -n "$ASSET" ]; then
  CODE=$(curl -s -o /dev/null -w '%{http_code}' --max-time 10 "https://cdpilot.ndr.ist$ASSET")
  if [ "$CODE" = "200" ]; then
    echo "✅ Static assets OK — $ASSET → 200"
  else
    echo "❌ Static asset $ASSET returned $CODE — site would render white."
    exit 1
  fi
fi

echo "Done! https://cdpilot.ndr.ist"
