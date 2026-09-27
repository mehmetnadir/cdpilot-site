---
title: "Retracted: CDP vs Playwright Token Cost Benchmark"
slug: "cdp-vs-playwright-benchmark"
date: "2026-05-05"
description: "This post originally claimed a 50-task, 20-site benchmark showing cdpilot uses 500x fewer tokens than screenshots. We could not find any data supporting those numbers and are retracting them. See the correction below for what we actually measured on 2026-09-27."
tags: ["benchmark", "ai-agents", "performance", "retraction"]
faq:
  - q: "Is the '500x fewer tokens' benchmark in this post real?"
    a: "No. We searched our own records for the '50 real AI agent tasks on 20 websites' benchmark described below and found no task log, harness, or raw data supporting it. The numbers were never measured. This post is retracted."
  - q: "What did you actually measure instead?"
    a: "On 2026-09-27 we measured cdpilot's a11y-snapshot against raw HTML and against a small (756x419) screenshot on four real pages: Hacker News, Wikipedia, GitHub, and saucedemo. a11y-snapshot was 1.4-42x smaller than raw HTML on every page. Against screenshots, it was cheaper only on the form-heavy page (~7x); on link/content-heavy pages the screenshot was actually 3-20x cheaper than the a11y-snapshot."
  - q: "Where does the '500x' number actually come from?"
    a: "Our best guess: an unrelated comparison in internal notes between a multi-turn Computer-Use-style agent loop (~250,000 cumulative tokens from re-sending screenshots every turn) and a single cdpilot describe call (~500 tokens on a simple page). 250,000 / 500 = 500. That is a real ratio for that specific scenario, but it is not the same thing as 'one a11y-snapshot vs. one screenshot,' which is how this post presented it."
draft: false
---

## Retraction (2026-09-27)

This post claimed we ran a benchmark of 50 real AI agent tasks across 20 websites and
measured a 500x token reduction from using cdpilot's accessibility-tree snapshot instead
of screenshots or HTML dumps. **We cannot find any evidence that benchmark was run** — no
task list, no per-task logs, no raw token counts, nothing. Every number in the original
post below (the 91%/87%/82% success rates, the $1.38/$0.59/$0.012 per-task costs, the
14x/51x/500x ratios, the cost-projection table) appears to have been written without
measurement. We're retracting all of it.

### What we measured instead

On 2026-09-27 we ran `cdpilot go` → `a11y-snapshot` → `describe` → `shot` → `html` against
four real pages, with a stock headless browser (no flags forced), and counted tokens with
`tiktoken`'s `o200k_base` encoding for text output and Anthropic's documented 28px-patch
formula (`tokens = ceil(width/28) × ceil(height/28)`) for the screenshot (756×419px,
cdpilot's own default viewport, no resize triggered).

| Page | a11y-snapshot tokens | raw HTML tokens | HTML ÷ a11y | screenshot tokens (Claude) | screenshot ÷ a11y |
|---|---|---|---|---|---|
| Hacker News | 8,182 | 11,718 | 1.4x | 405 | 0.05x (screenshot cheaper) |
| Wikipedia (CDP article) | 1,380 | 58,022 | 42.0x | 405 | 0.29x (screenshot cheaper) |
| GitHub (repo page) | 8,022 | 274,013 | 34.2x | 405 | 0.05x (screenshot cheaper) |
| saucedemo (login form) | 58 | 716 | 12.3x | 405 | 6.98x (a11y cheaper) |

Two honest takeaways:

- Against **raw HTML**, cdpilot's a11y-snapshot is consistently smaller — 1.4x to 42x
  across these four pages. That is the real, defensible comparison.
- Against a **screenshot**, the result depends entirely on the page. On a form-heavy page
  with little content (saucedemo), the a11y-snapshot is ~7x cheaper. On link/content-dense
  pages (Hacker News, GitHub, Wikipedia), the small 756×419 screenshot is actually 3-20x
  *cheaper* than the a11y-snapshot. "500x fewer tokens than screenshots" is not true in any
  of the four cases we measured — three of four go the other way.

We've updated the site copy (hero, pricing, compare page, llms.txt) to stop repeating the
500x claim and to say what we can actually stand behind: structured text with `@ref`
handles an agent can act on directly, with no vision model required — not a categorical
token-count win over screenshots.

---

## Original post (context, not evidence)

For AI agents that browse the web, the biggest cost is not compute — it is tokens. Every
time an agent "observes" a page, it burns context window. Multiply that across thousands
of daily tasks and the bill compounds quickly.

cdpilot's `a11y-snapshot` extracts the Chrome Accessibility Tree — the same structure
screen readers use — and returns only semantic elements:

```
[1] button "Add to cart" (pressed: false)
[2] link "Sign in" → /auth/login
[3] input "Search products" (type: search)
[4] heading "Today's deals" (level: 2)
```

Interactive elements get short `@ref` identifiers the model can act on directly, without
interpreting pixels. That part of the pitch stands. What did not stand was the specific
"50 tasks, 20 sites, 500x" benchmark that used to follow this paragraph — see the
retraction above for what replaces it.

To run cdpilot's a11y-snapshot yourself:

```bash
npx cdpilot launch
npx cdpilot go https://example.com
npx cdpilot a11y-snapshot   # structured a11y tree output
```
