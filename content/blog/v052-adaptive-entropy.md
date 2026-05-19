---
title: "cdpilot v0.5.2 — Adaptive Entropy Hook"
slug: "v052-adaptive-entropy"
date: "2026-05-19"
description: "Behavioral entropy (Bezier mouse, gauss key dwell) now auto-activates per-host when PerimeterX, DataDome, hCaptcha, or reCaptcha is detected. No manual flag."
tags: ["release", "stealth", "behavioral-entropy", "anti-bot"]
track: "Stealth Engineering"
canonical_url: "https://cdpilot.ndr.ist/blog/v052-adaptive-entropy"
related_tweet_url: null
faq:
  - q: "What is behavioral entropy?"
    a: "Mouse path randomization (Bezier curves), Gauss-distributed keyboard dwell times, quartic ease-out scroll. Targets behavior-based bot detectors."
  - q: "Why doesn't cdpilot enable entropy by default?"
    a: "It makes every action 3-8x slower. Default OFF preserves speed for non-protected sites. Adaptive layer enables it only where needed."
  - q: "Which detectors trigger entropy?"
    a: "PerimeterX, DataDome, hCaptcha, reCaptcha, Arkose, GeeTest. Not Cloudflare/Akamai (those are JS challenge-based, entropy does not help)."
draft: false
---

## The setup

Browser automation has traditionally been a game of "hide the property." For years, stealth meant patching `navigator.webdriver`, shadowing `cdc_` strings, or spoofing WebGL fingerprints. While these static signals remain relevant, the frontline of anti-bot engineering has shifted toward behavioral analysis.

Since v0.4.x, `cdpilot` has shipped a behavioral entropy engine. It moves beyond linear movements and static delays:

- **Bezier mouse paths**: Instead of a straight line from A to B, `cdpilot` calculates cubic Bezier curves with randomized control points and velocity jitter — mimicking the natural "overshoot and correction" of human motor control.
- **Gauss-distributed keyboard dwell**: Standard automation uses a fixed delay between keystrokes. `cdpilot` uses a Gaussian distribution (bell curve) for key-down/key-up intervals, so typing cadence is never a perfect metronome.
- **Quartic ease-out scrolling**: Automated scrolls typically snap or move at constant velocity. We use quartic easing to simulate the physics of a trackpad flick decelerating to a stop.

Until v0.5.2, this engine was a dumb toggle. You had to manually run `cdpilot entropy on` or pass `--entropy=on`. If you forgot, behavioral detectors caught you. If you left it on everywhere, your scraper ran 5x slower than necessary on unprotected sites.

v0.5.2 hooks the entropy engine into the adaptive layer. Stealth is now reactive — it activates high-entropy behavior only when a provider that scores behavioral signals is confirmed on the target host.

## What the adaptive layer knows

The adaptive layer is not an AI model. It is a deterministic heuristic engine that observes the environment and adjusts `cdpilot`'s internal state per host.

After every navigation, `cdpilot` runs `_detect_captcha()` — an internal routine that scans for eight provider signatures:

1. **PerimeterX / Human Security**: `window._px`, specific script tags, sensor endpoint patterns.
2. **DataDome**: `dd-captcha-container` presence, `captcha.datadome.co` endpoints.
3. **hCaptcha / reCaptcha**: iframe origins, container IDs.
4. **Cloudflare Turnstile**: `cf-turnstile` class, `challenges.cloudflare.com` scripts.
5. **Akamai**: `_abck` cookie, sensor data script signatures.
6. **Arkose Labs**: token submission endpoint.
7. **GeeTest**: `gt_` global variables.
8. **Generic interstitial**: challenge page heuristics.

In v0.5.2, when detection fires, the result is persisted in `~/.cdpilot/profile/adaptive.json` as a host-to-capability map. If the detected provider belongs to the entropy-sensitive category, the host record is updated with `entropy_required: true`.

On the next interaction with that host — even in a new session — the driver switches mouse and keyboard controllers to high-entropy mode before the first interaction fires.

## Entropy-sensitive vs entropy-immune categories

Applying maximum stealth to every request is inefficient. We categorize providers based on what signals they actually use.

### SENSITIVE — entropy ON

**PerimeterX, DataDome, hCaptcha, reCaptcha, Arkose, GeeTest.**

These providers are behavior-centric. They hook `mousemove`, `mousedown`, and `keydown` events at the document level and collect telemetry on velocity, acceleration, and movement curvature. They calculate variance in typing speed to flag "perfect" rhythm. For these targets, human-like entropy is the difference between a successful session and a permanent IP block.

### IMMUNE — entropy stays OFF

**Cloudflare Turnstile, Akamai.**

These providers are JS-challenge and infrastructure-centric. Cloudflare Turnstile focuses on TLS fingerprint, browser execution environment integrity (checking for Proxy objects, function overrides), and network-layer timing. Akamai relies heavily on the `_abck` cookie and sensor data payload validity — complex obfuscated JS that validates native API behavior rather than mouse path curvature.

On these sites, Bezier mouse movements provide zero bypass benefit. Enabling entropy here is pure latency waste. v0.5.2 keeps entropy OFF for Cloudflare and Akamai explicitly.

## Bench context

We publish our numbers, including the bad ones.

**Stealth Bench V1 — v0.5.1 (80 tasks, Gemini 2.5 Flash driving cdpilot in full mode):**

| Category | Success | Rate |
| :--- | :--- | :--- |
| Akamai | 4 / 6 | 66.7% |
| Cloudflare | 12 / 22 | 54.5% |
| Custom Antibot | 2 / 5 | 40.0% |
| DataDome | 5 / 13 | 38.5% |
| reCaptcha | 2 / 6 | 33.3% |
| GeeTest | 1 / 4 | 25.0% |
| PerimeterX | 2 / 18 | 11.1% |
| Kasada | 1 / 1 | 100.0% |
| hCaptcha | 0 / 3 | 0.0% |
| **Total** | **29 / 80** | **36.25%** |

These numbers need context: `cdpilot` does **not** solve CAPTCHAs. We do not call 2Captcha, DeathByCaptcha, or any third-party solver. Our model is **avoidance** — structural stealth (fingerprinting, behavioral entropy) to prevent the challenge from appearing in the first place. When a CAPTCHA blocks progress and cannot be bypassed via behavioral mimicry, the task fails. That is the honest definition of our success rate.

PerimeterX at 11% is our clearest weakness in v0.5.1. Most of those 16 failures were behavioral flags — the agent was detected before a hard CAPTCHA was even shown. That is exactly what the v0.5.2 entropy auto-hook targets.

v0.5.2 bench rerun is currently pending. We expect PerimeterX and DataDome to improve. We will update this post with actuals when the run completes.

## The speed tradeoff

Why not enable entropy everywhere?

Because high-entropy movement is computationally expensive per interaction. A standard automated mouse move happens near-instantly. A high-entropy `cdpilot` move from the same coordinates involves:

1. Calculating a cubic Bezier path with randomized control points.
2. Generating 15-30 intermediate steps with randomized sub-pixel offsets.
3. Injecting Gauss-sampled micro-delays (2ms–7ms) between steps to simulate motor jitter.
4. A brief hover-settle at the destination to simulate eye-tracking correction.

In practice, this makes every click or movement **3-8x slower**. In high-volume scraping against unprotected or Cloudflare-protected sites, forcing entropy wastes significant clock time with zero bypass benefit. Selective activation — pay the latency tax only where it matters — is the correct design.

## How to use

v0.5.2 is designed to be invisible. With adaptive mode on, nothing changes in your workflow.

```bash
# Enable adaptive mode (handles entropy automatically)
cdpilot adaptive on

# Check which hosts have entropy_required flagged
cdpilot adaptive status

# Manual global override (if you know the target needs it)
cdpilot entropy on

# Per-command override
cdpilot go https://example.com --entropy=on
```

If `cdpilot adaptive status` shows a host with `entropy_required: true`, that means `cdpilot` has previously seen a behavioral detector on that host and will automatically engage high-entropy mode on the next visit — no flags needed.

## What is next

v0.5.2 is a targeted fix. The bench shows bigger work remains.

- **PerimeterX hardening**: Our current 11% pass rate indicates we need deeper sensor-data spoofing, not just behavioral entropy. This is the active research focus.
- **hCaptcha**: This is an acknowledged hard problem. Audio and visual puzzle solving is out of scope for a zero-dependency library. We are exploring whether stricter initial fingerprint hygiene reduces how often hCaptcha is even triggered.
- **Bench v0.5.2**: Results will be published here when the 80-task rerun completes.

---

## FAQ

**What is behavioral entropy?**
Mouse path randomization (Bezier curves), Gauss-distributed keyboard dwell times, and quartic ease-out scrolling. These features target behavior-based bot detectors that score the "humanity" of interactions rather than just static browser properties.

**Why doesn't cdpilot enable entropy by default?**
It makes every action 3-8x slower. Default OFF preserves performance for the majority of the web. The adaptive layer enables it only where necessary — on hosts where a behavioral detector has been confirmed.

**Which detectors trigger entropy?**
PerimeterX, DataDome, hCaptcha, reCaptcha, Arkose, and GeeTest. Cloudflare Turnstile and Akamai are explicitly excluded — those providers rely on JS-challenges and TLS/network signatures, not behavioral telemetry.

---

`cdpilot` is open source (MIT). Zero dependencies, one binary, full CDP control.

Install: `npm i -g cdpilot` | GitHub: [github.com/mehmetnadir/cdpilot](https://github.com/mehmetnadir/cdpilot) | Docs: [cdpilot.ndr.ist](https://cdpilot.ndr.ist)
