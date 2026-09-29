#!/usr/bin/env bash
# cdpilot-site E2E smoke — run after every deploy (deploy/deploy.sh calls it).
# Layers: curl (HTTP contract) + cdpilot (render: sections, images, version badge).
# Usage: scripts/e2e-smoke.sh [base-url] [locale]
# Output: /tmp/cdpilot-site-smoke/<timestamp>-<locale>/{report.md,*.png}
set -uo pipefail

# === 1. PROJECT CONFIG =======================================================
PROJECT="cdpilot-site"
DEFAULT_URL="https://cdpilot.ndr.ist"
DEFAULT_LOCALE="en"
# =============================================================================

BASE_URL="${1:-$DEFAULT_URL}"
LOCALE="${2:-$DEFAULT_LOCALE}"
RUN_DIR="/tmp/${PROJECT}-smoke/$(date +%Y%m%d-%H%M%S)-${LOCALE}"
mkdir -p "$RUN_DIR"
REPORT="$RUN_DIR/report.md"
FAILED=0
SITE_DIR="$(cd "$(dirname "$0")/.." && pwd)"

# An isolated, headless cdpilot: never the user's browser or port 9222.
CDPILOT="${CDPILOT:-cdpilot}"
export CDPILOT_HOME="$RUN_DIR/home" CDPILOT_PROFILE="$RUN_DIR/profile"
export CDP_PORT="${SMOKE_CDP_PORT:-59960}" CHROME_HEADLESS=1

log()  { printf '\033[1;34m[%s]\033[0m %s\n' "$(date +%H:%M:%S)" "$*"; }
ok()   { printf '\033[1;32m✓\033[0m %s\n' "$*"; echo "- ✅ $*" >> "$REPORT"; }
fail() { printf '\033[1;31m✗\033[0m %s\n' "$*"; echo "- ❌ $*" >> "$REPORT"; FAILED=1; }

shot()    { $CDPILOT shot "$RUN_DIR/$1.png" > /dev/null 2>&1 || true; }
eval_js() { $CDPILOT eval "$1" 2>/dev/null | tail -n 1; }
status()  { /usr/bin/curl -s -o /dev/null -w '%{http_code}' "$BASE_URL$1"; }

cat > "$REPORT" <<EOF
# $PROJECT E2E Smoke Test

**Target:** $BASE_URL
**Started:** $(date -u +%Y-%m-%dT%H:%M:%SZ)

## Steps

EOF

trap '$CDPILOT stop > /dev/null 2>&1 || true' EXIT

# === 2. HTTP CONTRACT ========================================================
log "HTTP"
for p in / /examples /compare /llms.txt /sitemap.xml /examples/connect.png; do
  code=$(status "$p")
  [[ "$code" == "200" ]] && ok "GET $p → 200" || fail "GET $p → $code"
done
code=$(status /this-page-does-not-exist)
[[ "$code" == "404" ]] && ok "unknown path → 404" || fail "unknown path → $code (want 404)"
/usr/bin/curl -s "$BASE_URL/sitemap.xml" | /usr/bin/grep -q "/examples" \
  && ok "sitemap lists /examples" || fail "sitemap misses /examples"

# === 3. RENDER (cdpilot) =====================================================
log "Browser"
$CDPILOT launch > /dev/null 2>&1 || { fail "cdpilot launch failed"; }

# Landing: the version badge shows the version in package.json of the cdpilot repo on npm.
$CDPILOT go "$BASE_URL/" > /dev/null 2>&1; sleep 1
shot 01-landing
NPM_VER=$(npm view cdpilot version 2>/dev/null || echo "")
BADGE=$(eval_js "(document.body.innerText.match(/v\\d+\\.\\d+\\.\\d+ on npm/)||[''])[0]")
if [[ -n "$NPM_VER" && "$BADGE" == "v$NPM_VER on npm" ]]; then
  ok "landing badge = npm version ($BADGE)"
else
  fail "landing badge '$BADGE' != npm 'v$NPM_VER on npm'"
fi

# Examples: one section per entry in src/data/examples.ts, every screenshot decoded.
WANT=$(/usr/bin/grep -c '^    id: "' "$SITE_DIR/src/data/examples.ts")
$CDPILOT go "$BASE_URL/examples" > /dev/null 2>&1; sleep 2
shot 02-examples
GOT=$(eval_js "document.querySelectorAll('main section[id]').length")
[[ "$GOT" == "$WANT" ]] && ok "/examples renders $GOT sections" || fail "/examples: $GOT sections, want $WANT"
IMGS=$(eval_js "document.querySelectorAll('main section img').length")
[[ "$IMGS" == "$WANT" ]] && ok "/examples has $IMGS screenshots" || fail "/examples: $IMGS screenshots, want $WANT"
BROKEN=$(eval_js "Promise.all([...document.querySelectorAll('main section img')].map(i=>{i.loading='eager';return i.decode().then(()=>0,()=>1)})).then(a=>a.reduce((x,y)=>x+y,0))")
[[ "$BROKEN" == "0" ]] && ok "/examples screenshots all decode" || fail "/examples: $BROKEN screenshots failed to decode"

# Compare: the comparison table is there.
$CDPILOT go "$BASE_URL/compare" > /dev/null 2>&1; sleep 1
shot 03-compare
ROWS=$(eval_js "document.querySelectorAll('table tr').length")
[[ "${ROWS:-0}" =~ ^[0-9]+$ && "$ROWS" -gt 5 ]] && ok "/compare table has $ROWS rows" || fail "/compare table rows: '$ROWS'"

# =============================================================================
cat >> "$REPORT" <<EOF

**Finished:** $(date -u +%Y-%m-%dT%H:%M:%SZ)
**Screenshots:** \`$RUN_DIR/\`
**Status:** $([[ "$FAILED" == "0" ]] && echo "✅ ALL PASS" || echo "❌ FAILED")
EOF

log "Report: $REPORT"
exit "$FAILED"
