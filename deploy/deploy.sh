#!/bin/bash
# cdpilot-site deploy script — Server 21
set -e

# DEPLOY_HOST=root@100.117.187.26 (Tailscale) when the 10.0.0.x VPN is down
SERVER="${DEPLOY_HOST:-root@10.0.0.21}"
SSH_PORT=2222
REMOTE_DIR="/opt/cdpilot-site"
LOCAL_DIR="$(cd "$(dirname "$0")/.." && pwd)"

echo "Building..."
cd "$LOCAL_DIR"
npm run build
# Next 16.4 izleme kökü proje dizinidir: server.js standalone kökündedir (ecosystem bu yolu koşar).
[ -f .next/standalone/server.js ] || { echo "✗ .next/standalone/server.js yok — ecosystem yolu tutmaz"; exit 1; }

echo "Syncing to server..."
rsync -avz --delete \
  --exclude node_modules \
  --exclude .git \
  --exclude .next/cache \
  --exclude .next/dev \
  -e "ssh -p $SSH_PORT" \
  "$LOCAL_DIR/" "$SERVER:$REMOTE_DIR/"

echo "Installing dependencies and restarting..."
NEXT_LOCAL=$(node -p 'require("next/package.json").version')
ssh -p $SSH_PORT $SERVER "
  set -e
  cd $REMOTE_DIR
  # rsync node_modules dizinlerini dışarıda bırakır: standalone, next'i bu dizinin node_modules'undan çözer.
  # Sürüm derlemedekinden farklıysa sunucu çöker (03.11: ensureInstrumentation is not a function, 502).
  NODE_OPTIONS=--dns-result-order=ipv4first npm install --omit=dev --no-audit --no-fund
  [ \"\$(node -p 'require(\"next/package.json\").version')\" = \"$NEXT_LOCAL\" ] || { echo 'next sürümü derlemeyle aynı değil'; exit 1; }
  # Next.js standalone ships only the server bundle — the static/ and public/
  # trees must be co-located under standalone/ manually, otherwise every
  # /_next/static/* asset 404s and the client renders a white screen.
  # https://nextjs.org/docs/app/api-reference/config/next-config-js/output
  mkdir -p .next/standalone/.next
  rm -rf .next/standalone/.next/static
  cp -r .next/static .next/standalone/.next/
  if [ -d public ]; then rm -rf .next/standalone/public && cp -r public .next/standalone/; fi
  pm2 delete cdpilot-site 2>/dev/null || true
  pm2 start deploy/ecosystem.config.js
  pm2 save
"

echo ""
# pm2 restart leaves a few seconds of 502 (11.11: GET / and /examples 502 in the smoke, 200 seconds later)
echo "Waiting for the app to answer..."
for _ in $(seq 1 30); do
  [ "$(curl -s -o /dev/null -w '%{http_code}' --max-time 5 https://cdpilot.ndr.ist/)" = "200" ] && break
  sleep 1
done
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

echo "E2E smoke..."
if [ -x "$LOCAL_DIR/scripts/e2e-smoke.sh" ]; then
  "$LOCAL_DIR/scripts/e2e-smoke.sh" "https://cdpilot.ndr.ist" en || echo "⚠️  E2E smoke failed — deploy partially successful"
fi

echo "Done! https://cdpilot.ndr.ist"
