---
title: "v0.6.1 → v0.8.0: Four Versions, One Mission — Honest Plumbing for the Hard Layers"
slug: "v061-to-v080-fix-bundle"
date: "2026-05-20"
description: "We shipped four versions in a row before re-running the bench. Cookie regression fixed, per-task hygiene added, named proxy pools landed, and a TLS-aware launcher arrived. Here is what each one does and where the score ceilings actually sit."
tags: ["release", "stealth", "tls", "proxy", "bench", "engineering"]
track: "Stealth Engineering"
canonical_url: "https://cdpilot.ndr.ist/blog/v061-to-v080-fix-bundle"
related_tweet_url: null
faq:
  - q: "Should I upgrade?"
    a: "Yes. v0.8.0 is fully backward-compatible with v0.5.x. The cookie-auto regression in v0.6.0 is fixed in v0.6.1; if you were on v0.6.0 with cookies auto enabled, you almost certainly want this update."
  - q: "Does v0.8.0 patch TLS fingerprints directly?"
    a: "No. cdpilot detects and reports your browser's TLS fingerprint via `cdpilot tls-check`, and integrates with TLS-corrected forks (Camoufox, undetected-chrome) via `cdpilot browser <name>`. We do not ship a patched Chromium ourselves — BoringSSL rebuild is out of scope for an open-source single-binary CLI."
  - q: "What residential proxy provider do you recommend?"
    a: "cdpilot is provider-agnostic. We have tested URL formats from BrightData, IPRoyal, and Anchor; any HTTP/SOCKS proxy with credentials embedded in the URL will work. Pick on price, IP pool quality, and geo coverage for your workload."
  - q: "What's next?"
    a: "v0.9 is scoped for an optional TLS-MITM proxy plugin (curl-impersonate semantics), and an apples-to-apples bench against browser-use's bu-2-0 agent so we can isolate the agent-quality gap from the stealth gap."
draft: false
---

# v0.6.1 → v0.8.0: Four Versions, One Mission

We held the bench. Four versions shipped in a row before we let ourselves re-run a single task. Here's why, and what each version actually changes.

## The honest reason for the freeze

v0.6.0 introduced two big features — a captcha solver plugin and automatic cookie persistence — and one of them silently broke the bench. The cookie auto-replay layer was injecting stale cookies from earlier tasks into completely unrelated targets. Score collapsed from ~30/80 to 15/80.

Re-running the bench with the same broken layer would have told us nothing new. So we stopped, scoped four small versions, and shipped them all before letting ourselves measure again. Four PRs, one bench run.

## v0.6.1 — Cookie auto is now safe-listed

The old behavior: `cdpilot cookies auto on` would save and replay cookies for **every** host you visit.

The new behavior: the toggle is a no-op until you explicitly opt hosts in.

```bash
cdpilot cookies auto on                       # global flag (still required)
cdpilot cookies auto add cloudflare-shop.com  # opt this host in
cdpilot cookies auto add my-cf-protected.app
cdpilot cookies auto list                     # confirm
```

Adding `cloudflare-shop.com` also covers `*.cloudflare-shop.com` (suffix match). Until you add at least one host, cookie auto-replay does nothing — even if the global flag is on. This is intentional: in parallel agent workloads (browser-use, the bench, anyone driving 5+ tabs at once), an indiscriminate replay layer is dangerous.

## v0.6.2 — Per-task `wipe` for cross-task hygiene

When you share one browser across many tasks (the bench shares Brave across 80 tasks via 5 parallel tabs), state from one task can bleed into the next. v0.5.0 full mode had 11 tasks land on the wrong domain — an `anthropologie.com` task ended up on `fiverr.com`'s captcha — because cookies from a prior task were carrying TLD-wide auth state.

v0.5.1 tried to fix this with `Target.createBrowserContext` per task. That broke browser-use's target tracker — "Target not found", "Session corrupted" — because browser-use can't see contexts it didn't create. We made that fix opt-in via env var.

v0.6.2's approach is different: don't change target topology, just scrub state between tasks.

```bash
cdpilot wipe                                       # cookies + localStorage + sessionStorage
cdpilot wipe --keep stripe.com,cloudflare.com      # ad hoc keep-list
cdpilot wipe --cookies                             # cookies only
cdpilot wipe --storage                             # storage only
cdpilot wipe --all                                 # also wipe safe-list hosts
```

The bench adapter (`browsers/cdpilot.py`) now calls `cdpilot wipe --cookies --storage` in `disconnect()` between tasks. By default it preserves cookie-auto safe-list hosts (so your opt-in CF clearance survives), but everything else is gone.

## v0.7.0 — Named proxy pools

cdpilot had a single proxy URL before. v0.7.0 turns proxy into a multi-pool config.

```bash
cdpilot proxy add brd "http://USER:PASS@brd.superproxy.io:22225" --geo us
cdpilot proxy add ipr "http://USER:PASS@geo.iproyal.com:12321" --sticky
cdpilot proxy use brd
cdpilot proxy list                # credentials shown as ***:*** in all output
```

This is a framework, not an integration. cdpilot is provider-agnostic — we tested with BrightData, IPRoyal, and Anchor URL formats, but any HTTP/SOCKS proxy with credentials embedded in the URL works because Chromium handles auth at the `--proxy-server` layer. We display credentials redacted in every command output.

`CHROME_PROXY` env var still overrides everything for bench/CI use.

## v0.8.0 — TLS-aware launcher

This is the version that **doesn't** ship a TLS fix.

Anti-bot services like Akamai and Kasada inspect the TLS handshake itself — JA3, JA4, the HTTP/2 SETTINGS frame — before any JavaScript runs. BoringSSL inside Chromium produces a fixed fingerprint. Patching BoringSSL means rebuilding Chromium, which is a 2–3 week sprint and a distribution problem we don't want to take on.

What we ship instead — and what we cannot ship:

```bash
cdpilot tls-check                          # JA3/JA4/H2 probe via tls.peet.ws
cdpilot tls-check --json                   # raw output
cdpilot tls-check --service browserleaks   # alternate echo
```

`cdpilot tls-check` does the measurement: navigates the running browser to a public TLS echo service, parses the JSON, and verdicts the result against a known-good Chrome stable fingerprint set.

**What v0.8.0 does NOT ship — honest correction.** The initial plan referenced switching to Camoufox or undetected-chromedriver as a one-liner TLS fix. We verified the market state before shipping and the claim does not hold up:

- **Camoufox** is Firefox + the Juggler protocol. cdpilot speaks raw CDP. Incompatible without a Juggler adapter.
- **Patchright, undetected-chromedriver, nodriver** are Python/Playwright libraries, not standalone browsers with `--remote-debugging-port`. They patch the browser at the WebDriver/Playwright layer, not at the binary level. cdpilot's launch-binary architecture cannot drive them.

There is currently no Chromium-based, TLS-corrected, standalone browser binary on the market that exposes raw CDP. v0.8.0's honest deliverable is therefore the probe (`tls-check`) — useful for measuring whether you actually need a fix — plus the explicit acknowledgement that the fix itself belongs in v0.9: either an optional local TLS-MITM plugin with curl-impersonate semantics, or a BoringSSL-patched Chromium fork.

## What this stack looks like end-to-end

```bash
# Bench-ready configuration with the full v0.8.0 layer:
cdpilot launch                                    # default Brave / auto-pick
cdpilot stealth on                                # JS fingerprint patches
cdpilot cookies auto on
cdpilot cookies auto add cloudflare-protected.app # only this host gets replay
cdpilot proxy add resi "http://USER:PASS@..."
cdpilot proxy use resi                            # restart browser after
cdpilot tls-check                                 # confirm fingerprint
```

Five commands, four versions of work, zero new dependencies. cdpilot remains a single Node.js entry + a single Python file. No Chromium fork, no MITM proxy in core, no paid SaaS API key required to use the CLI.

## What we're measuring next

The bench is unblocked. The expected outcome of the next run:

- v0.6.1 should restore the v0.5.x baseline (~30/80, ~37.5%) — the cookies regression is gone.
- v0.6.2's `wipe` should add a few points by killing the cross-task contamination class.
- v0.7.0 and v0.8.0 are no-ops on the bench unless we plug in a residential proxy and switch to Camoufox — both of those are user choices that cost money or installation time.

We will publish the full bench numbers in the next post, with the variant matrix. No spoilers until the run finishes.

---

cdpilot is open source: [github.com/cdpilot/cdpilot](https://github.com/cdpilot/cdpilot). v0.8.0 ships today via `npm install -g cdpilot`.
