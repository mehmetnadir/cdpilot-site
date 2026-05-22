---
title: "cdpilot v0.5.0: Efficient Mode, Smart Navigation, Parallel Contexts"
slug: "cdpilot-v050-release"
date: "2026-05-17"
description: "cdpilot v0.5.0 ships efficient mode (visual feedback off by default), parallel browser contexts, adaptive CAPTCHA escalation, and wait-for-text for streaming AI. Everything in 50KB."
tags: ["release", "browser-automation", "changelog"]
track: "Releases"
related_tweet_url: "https://x.com/cdpilot"
faq:
  - q: "What is Efficient Mode in cdpilot v0.5.0?"
    a: "Efficient Mode turns off visual feedback (glows, cursor ripples) by default to maximize speed and reduce CPU usage during high-volume automation. Enable visuals anytime with 'cdpilot show on'."
  - q: "How do Parallel Contexts work in cdpilot?"
    a: "cdpilot uses Target.createBrowserContext to spawn truly isolated sessions within a single browser instance. Each context has its own cookies, storage, and cache — enabling true parallel execution without state leakage. Pin a target with the CDPILOT_TARGET environment variable."
  - q: "Does v0.5.0 still maintain the zero-dependency philosophy?"
    a: "Yes. Despite shipping five major features, the entire cdpilot core remains under 50KB with no external Python or npm dependencies. Everything uses stdlib only."
draft: false
---

cdpilot v0.5.0 is now available on [npm](https://www.npmjs.com/package/cdpilot). This release is the biggest since launch, shipping five production-grade capabilities that make cdpilot the default choice for AI-agent browser automation.

## Efficient Mode: Performance First

Previous versions of cdpilot included rich visual feedback — glowing elements, cursor ripples, keystroke overlays. These are invaluable for debugging, but high-volume automation pipelines don't need them.

In v0.5.0, **Efficient Mode is on by default**. Visual feedback is disabled, post-load wait drops from 1.5s to 0.3s, and scroll is instant. The result is dramatically faster loops for headless automation.

You can re-enable the full visual experience at any time:

```bash
cdpilot show on    # enable visual feedback
cdpilot show off   # back to efficient (default)
```

## Parallel Browser Contexts

Scale is no longer a constraint. Using Chrome DevTools Protocol's `Target.createBrowserContext`, cdpilot can manage multiple fully isolated sessions inside a single browser instance.

```bash
# Launch isolated context per worker
export CDPILOT_TARGET=worker-1
cdpilot go https://example.com

# In another terminal — completely isolated
export CDPILOT_TARGET=worker-2
cdpilot go https://different-site.com
```

Each context has independent cookies, localStorage, and network state. No session bleed between workers.

## Adaptive CAPTCHA Escalation

The modern web actively fights automation. v0.5.0 introduces **Adaptive Escalation**: when cdpilot detects a CAPTCHA (supports 8 providers: Turnstile, hCaptcha, reCAPTCHA, DataDome, PerimeterX, Arkose, GeeTest, CF-interstitial), it automatically:

1. Engages stealth mode for that host
2. Applies human-like behavioral entropy
3. Re-navigates automatically

Escalation state is **per-host** and **persists across runs** via cookie save/load. cdpilot runs fast and only "climbs walls" when it encounters them.

```bash
cdpilot adaptive on    # enable adaptive escalation
cdpilot captcha-check  # inspect current CAPTCHA status
```

## wait-for-text: Streaming AI Support

LLM-powered web apps stream their responses character by character. Traditional `waitForSelector` breaks because the element exists immediately but contains no content yet.

`wait-for-text` uses an rAF-throttled MutationObserver to poll for a specific string inside a target element:

```bash
# Wait until Claude's response contains "In conclusion"
cdpilot wait-for-text "#response" "In conclusion"
```

This makes cdpilot the first browser automation CLI designed to work with streaming AI interfaces.

## WebSocket Connection Pool

All CDP connections are now pooled per target. Instead of creating a new WebSocket for each command, cdpilot reuses the existing connection — reducing command latency to near-zero for sequential operations. Connections are cleaned up automatically at process exit.

## Block Network Requests

New `block` command lets you filter network requests before they're made:

```bash
cdpilot block images     # block all image requests
cdpilot block fonts      # block web fonts
cdpilot block ads        # block common ad domains
cdpilot block "*.png"    # block by URL pattern
```

Useful for speeding up page loads during data extraction tasks.

## Install

```bash
npm install -g cdpilot@0.5.0
# or use without installing
npx cdpilot@latest go https://example.com
```

Full changelog on [GitHub Releases](https://github.com/mehmetnadir/cdpilot/releases).
