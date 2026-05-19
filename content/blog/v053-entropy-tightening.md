---
title: "Three Patches, One Lesson: Why cdpilot's Adaptive Layer Hasn't Beaten Stealth-Only"
slug: "v053-entropy-tightening"
date: "2026-05-20"
description: "We ran four bench variants across v0.5.0–v0.5.3. Stealth-only still wins at 40%. Here is what each patch taught us and where the adaptive layer needs to go next."
tags: ["bench", "stealth", "adaptive", "anti-bot", "engineering"]
track: "Stealth Engineering"
canonical_url: "https://cdpilot.ndr.ist/blog/v053-entropy-tightening"
related_tweet_url: null
faq:
  - q: "Should I use cdpilot adaptive on?"
    a: "Only if your target sites are confirmed PerimeterX-heavy or captcha-heavy and you have profiled them specifically. For general use, stealth-only (cdpilot stealth on) is the better default."
  - q: "Why not keep iterating on the entropy approach?"
    a: "Diminishing returns. The entropy-only mechanism has hit baseline parity (30/80). The next meaningful gain requires external integration: a captcha solver API or TLS fingerprint matching (JA3/JA4). Those are v0.6.x scope."
  - q: "What is coming in v0.6.x?"
    a: "Captcha solver integration (2captcha/anti-captcha plugin), TLS fingerprint matching, per-host cookie persistence with CF clearance replay, and optional residential proxy support."
draft: false
---

We released three patches in a week trying to make the adaptive layer beat the stealth layer. It did not work. Here is what we learned.

## The baseline

cdpilot's Stealth Bench V1 is 80 high-friction web tasks across 11 anti-bot systems. Gemini 2.5 Flash drives cdpilot as the controller. Success means full task completion without interception — no partial credit.

Going into v0.5.0 we had three variants:

- **Baseline**: stealth off, adaptive off — 30/80 (37.5%)
- **Stealth-only**: stealth on, adaptive off — 32/80 (40.0%)
- **Full**: stealth on, adaptive on — ??? (we were optimistic)

The full variant was the regression nobody expected.

## v0.5.0: the context bleed problem (26/80 = 32.5%)

Full mode scored 26/80 — worse than baseline. The root cause: the browser context pool was leaking state across tasks.

Adaptive mode replays per-host cookies and reuses contexts. When browser-use issued a new `navigate`, the agent sometimes found itself on the previous task's host page. 11 tasks finished on the wrong domain in the full run, versus only 2 in the stealth-only run.

Examples from the log: task #42 (`anthropologie.com`) blocked by a `fiverr.com` CAPTCHA. Task #47 (`immobiliare.com`) hitting a `samsclub.com` CAPTCHA. The agent never reached the right site on step one.

PerimeterX collapsed from 6/18 (stealth) to 0/18 (full). PX uses shared cookie/TLS state across tabs, and a contaminated context kills every PX task in the batch.

## v0.5.1: idempotent navigation + host-assert (29/80 = 36.25%)

Two targeted fixes:

1. **Idempotent adaptive**: if the page is already on the requested origin, skip the re-navigate. The adaptive escalation loop was firing a fresh nav that raced with the agent's own nav and landed on the pool's previous tab.
2. **Host-assert after every navigate**: verify `document.location.host` matches the requested host after every `cmd_go`. Fail loud instead of letting the agent run against the wrong site silently.

Result: 29/80. The regression closed most of the way. Wrong-site landings dropped from 11 to ~2. PerimeterX recovered to 2/18 — not great, but no longer zero.

The gap vs stealth-only (32/80) remained. We went after it with entropy.

## v0.5.2: entropy auto-hook (28/80 = 35.0%)

The theory: behavioral entropy (Bezier mouse paths, Gaussian keyboard dwell times) helps on detectors that model human behavior — PerimeterX, DataDome, hCaptcha. Auto-enable it per-host when those detectors are flagged.

The actuals disagreed. DataDome dropped from 5/13 to 3/13. PerimeterX stayed at 2/18. The entropy added latency without producing a bypass benefit on DataDome's JS-challenge model. The overall score went down.

DataDome does not care much about mouse curves. It runs a JS challenge that checks environment properties and network timing. Behavioral entropy on top of that is noise.

## v0.5.3: scope tightened (30/80 = 37.5%)

Remove DataDome and Custom Antibot from the entropy auto-enable list. Add Kasada and Shape as explicit-false (TLS-based detectors; entropy does not help there either).

Result: 30/80 — baseline parity.

DataDome recovered (3→5). Custom Antibot recovered fully (2→5, 100%). hCaptcha improved (0→2). Cloudflare improved (10→12). PerimeterX stayed at 2/18 — we lost the v0.5.1 gain, which suggests variance or an entropy interaction we have not isolated yet.

### v0.5.3 per-category breakdown

| Category | Success / Total | Rate |
| :--- | :--- | :--- |
| Custom Antibot | 5 / 5 | 100% |
| Temu Slider | 1 / 1 | 100% |
| hCaptcha | 2 / 3 | 67% |
| Cloudflare | 12 / 22 | 55% |
| DataDome | 5 / 13 | 38% |
| reCaptcha | 2 / 6 | 33% |
| Akamai | 1 / 6 | 17% |
| PerimeterX | 2 / 18 | 11% |
| GeeTest | 0 / 4 | 0% |
| Shape | 0 / 1 | 0% |
| Kasada | 0 / 1 | 0% |
| **Total** | **30 / 80** | **37.5%** |

## The lesson

Stealth-only is still the best single variant at 40.0%. The adaptive layer, after four iterations, is at baseline parity. It is not negative anymore — but it is not positive either.

Entropy-based behavioral mimicry has a hard ceiling against modern detectors. PerimeterX and Kasada have moved to TLS fingerprint analysis and captcha challenges that require an external solver to bypass. Mouse curves do not help there.

The adaptive layer is still the right architecture. It provides per-host memory, cookie replay, and escalation logic that will matter once we plug in the right primitives. But those primitives are not entropy — they are TLS fingerprint matching and captcha solver integration.

## What we are publishing

Honest numbers. 30/80 against Stealth Bench V1's mix. Stealth-only at 40%.

We will not ship a release that claims "improved bypass" without showing the before/after. Adaptive is data-driven feature gating, not marketing copy.

---

## FAQ

**Should I use `cdpilot adaptive on`?**

For most workflows: no. Use `cdpilot stealth on` as your default. Adaptive is appropriate if you have confirmed PerimeterX-heavy or captcha-heavy target sites and have profiled the specific hosts. For general-purpose automation, stealth-only is faster and currently higher-scoring.

**Why stop iterating on entropy?**

Diminishing returns. Four releases of entropy tuning have moved us from 32.5% (regression) back to 37.5% (baseline). The next percentage point gain requires external integration: a captcha solver API or TLS fingerprint matching that mimics real Chrome JA3/JA4 signatures. Those are qualitatively different from entropy tuning and are scoped to v0.6.x.

**What is next?**

v0.6.x will make bigger bets:

- **Captcha solver integration** — 2captcha/anti-captcha plugin for cases where avoidance fails
- **TLS fingerprint matching** — JA3/JA4 signature spoofing to match legitimate Chrome traffic patterns
- **Per-host cookie persistence** — CF/DataDome clearance replay that survives browser restarts (beyond current session scope)
- **Residential proxy support** — optional integration for IP-reputation-sensitive targets

These are the actual levers for PerimeterX (2/18 → meaningful improvement) and GeeTest (0/4). The entropy chapter is closed.
