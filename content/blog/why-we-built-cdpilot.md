---
title: "Why We Built cdpilot: Browser Automation Without the Bloat"
slug: "why-we-built-cdpilot"
date: "2026-05-10"
description: "Playwright is 300MB. Puppeteer adds 50 packages. We wanted browser automation that fits in a tweet. Here is how cdpilot was born from a simple question: why can't we just talk to the browser directly?"
tags: ["story", "browser-automation", "philosophy"]
faq:
  - q: "Why not just use Playwright for browser automation?"
    a: "Playwright is excellent for end-to-end testing, but for lightweight CLI tools and AI agents, a 300MB install and complex dependency tree are often overkill. cdpilot uses the browser you already have installed — no binaries downloaded, no configuration required."
  - q: "What does zero-dependency really mean for cdpilot?"
    a: "The core automation logic is written in Python using only the standard library (urllib, asyncio, json, subprocess). The npm package is a thin 2KB wrapper that finds your local Python and browser, then delegates. No node_modules explosion, no native addons."
  - q: "Can cdpilot handle tasks Puppeteer and Playwright can?"
    a: "cdpilot covers about 95% of common automation tasks with 70+ commands. For edge cases requiring browser-level hooks not exposed by CDP, you can inject custom JavaScript with 'cdpilot eval' or extend via the DevExtension system."
draft: false
---

Modern browser automation is heavy. When you run `npm install playwright`, you are not just getting a library — you are downloading hundreds of megabytes of Chromium binaries, dozens of transitive Node.js dependencies, and a complex orchestration layer built for CI environments.

For lightweight CLI tools, portable scripts, and AI agents that need to browse the web, this is the wrong abstraction. We built cdpilot to answer a different question: **what is the minimum required to automate a browser?**

## The Problem

In early 2025, we were building a small terminal tool that needed to screenshot a webpage on demand. Our options were:

- **Puppeteer** — 50MB+ of dependencies, requires a bundled Chromium
- **Playwright** — 300MB of browser binaries, designed for test suites
- **Selenium** — Java WebDriver server, XML configuration files
- **curl + html parsing** — no JavaScript execution

None of these fit a single-file CLI that someone should be able to install with `npx` and run in seconds.

## The Question That Changed Everything

Every Chromium-based browser — Chrome, Brave, Edge, Vivaldi — exposes the **Chrome DevTools Protocol (CDP)**. This is the same protocol DevTools uses internally. It provides a full JSON-RPC interface over WebSocket for navigating, clicking, evaluating JavaScript, capturing screenshots, intercepting network requests, and much more.

If the browser is already on the machine, it is already a fully capable automation engine. You just need to talk to it.

We wrote a 300-line Python proof-of-concept using only `urllib` and `asyncio`. It could navigate to a URL, click an element, and take a screenshot. No dependencies. No configuration. Just an HTTP request to start Chrome in debug mode and a WebSocket to send commands.

That prototype became cdpilot.

## The Philosophy

cdpilot is built on four principles:

**No binaries.** Use the browser the developer already has installed. cdpilot supports Brave, Chrome, Chromium, and Vivaldi — it detects whichever is available and uses it.

**No dependencies.** The automation core is pure Python stdlib. The npm wrapper is under 2KB. `npm install -g cdpilot` installs in under a second.

**Composable.** Every cdpilot command produces structured output (JSON or plaintext) that can be piped to other tools. `cdpilot content | jq '.links'` just works.

**Transparent.** Automation should not be a black box. cdpilot's visual feedback system (element glow, cursor ripple, keystroke overlay) makes it immediately obvious what the tool is doing. Essential for debugging, optional in production via Efficient Mode.

## Why This Matters for AI Agents

When we started, cdpilot was a developer CLI. Then LLMs started needing to browse the web, and the token cost problem became clear.

Screenshot-based tools pass a full image to the language model — thousands of tokens for a single page observation. HTML dumps are worse: a typical news article DOM is 50,000+ tokens.

cdpilot's **a11y tree snapshot** extracts only the semantic structure of the page — buttons, links, inputs, headings — with short `@ref` identifiers for clicking. A typical page observation is 600-1,200 tokens. That is a [500x reduction](https://cdpilot.ndr.ist/blog/cdp-vs-playwright-benchmark) compared to screenshot-based approaches.

The MCP server ships built-in. Add cdpilot to Claude Code or any MCP client in one line:

```json
{
  "mcpServers": {
    "cdpilot": {
      "command": "npx",
      "args": ["cdpilot", "mcp"]
    }
  }
}
```

## The Result

cdpilot is now used by developers building web scrapers, QA automation pipelines, AI research tools, and agent frameworks. The codebase is a single Python file — `src/cdpilot.py` — with 70+ commands, zero external dependencies, and a Lighthouse performance score above 90.

If browser automation has felt too heavy for what you are trying to build, [cdpilot](https://www.npmjs.com/package/cdpilot) might be what you are looking for.
