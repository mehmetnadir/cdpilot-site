import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "cdpilot vs Playwright vs Puppeteer vs Selenium vs browser-use — cdpilot",
  description:
    "A lightweight Playwright alternative for AI coding agents: an honest, sourced comparison of cdpilot against Playwright, Puppeteer, Selenium, and browser-use — install size, MCP support, a11y snapshots, and where cdpilot is still weaker.",
  alternates: {
    canonical: "https://cdpilot.ndr.ist/compare",
  },
  openGraph: {
    title: "cdpilot vs Playwright vs Puppeteer vs Selenium vs browser-use",
    description:
      "A lightweight Playwright alternative for AI coding agents. Sourced comparison: install size, dependencies, MCP support, a11y snapshots — plus cdpilot's honest weak spots.",
    url: "https://cdpilot.ndr.ist/compare",
    siteName: "cdpilot",
    type: "article",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "cdpilot vs Playwright vs Puppeteer vs Selenium vs browser-use",
    description:
      "A lightweight Playwright alternative for AI coding agents. Sourced comparison, including where cdpilot is still weaker.",
    creator: "@mehmetnadir",
  },
};

interface Row {
  label: string;
  cdpilot: string;
  playwright: string;
  puppeteer: string;
  selenium: string;
  browserUse: string;
}

const rows: Row[] = [
  {
    label: "Install footprint",
    cdpilot: "1 Python file (~542KB) + small Node launcher (~23KB); npm package ~0.6MB unpacked, no node_modules",
    playwright: "playwright-core ~12.8MB unpacked; browsers (Chromium/Firefox/WebKit) downloaded separately, ~100s of MB total",
    puppeteer: "puppeteer-core ~5.7MB unpacked; bundled Chromium download ~170MB (macOS) to ~280MB (Linux/Windows)",
    selenium: "selenium-webdriver (Node) ~21.8MB unpacked; browser driver binaries (chromedriver etc.) installed separately",
    browserUse: "Not an npm package — Python (pip/uv), runs on top of Playwright + its browser binaries",
  },
  {
    label: "Direct npm dependencies",
    cdpilot: "0 npm (Python side needs 1 package, websockets, auto-installed on first launch)",
    playwright: "1 (playwright-core)",
    puppeteer: "6",
    selenium: "4",
    browserUse: "— (Python package manager, not npm)",
  },
  {
    label: "Runtime requirement",
    cdpilot: "Node.js 18+, Python 3.10+",
    playwright: "Node.js (also has Python/Java/.NET bindings)",
    puppeteer: "Node.js",
    selenium: "Node.js + JVM/driver toolchain (language-binding dependent)",
    browserUse: "Python 3.11+",
  },
  {
    label: "Setup time",
    cdpilot: "Instant — npx cdpilot launch",
    playwright: "Minutes (npx playwright install downloads browsers)",
    puppeteer: "Minutes (Chromium download on install)",
    selenium: "Slow — driver/browser version matching",
    browserUse: "Minutes (pip/uv install + Playwright browser install step)",
  },
  {
    label: "CLI-first",
    cdpilot: "Yes — the CLI is the entire interface",
    playwright: "Partial — ships a test-runner CLI (npx playwright test), but the core API is a library",
    puppeteer: "No — library only",
    selenium: "No — library only",
    browserUse: "Partial — ships a CLI, but designed to be driven by an LLM agent loop, not manual commands",
  },
  {
    label: "MCP server",
    cdpilot: "Yes — built in (cdpilot mcp), 42 tools",
    playwright: "Yes — official @playwright/mcp (Microsoft), separate package, actively maintained",
    puppeteer: "Deprecated — official @modelcontextprotocol/server-puppeteer exists but maintainers now recommend Playwright MCP instead",
    selenium: "No official server; only unverified community projects",
    browserUse: "Not verified as first-party — see source repo",
  },
  {
    label: "Accessibility (a11y) snapshot",
    cdpilot: "Yes — structured @ref navigation, no vision model needed (measured: 1.4-42x smaller than raw HTML across four sample pages)",
    playwright: "Yes — @playwright/mcp is built around accessibility-tree snapshots",
    puppeteer: "No built-in equivalent",
    selenium: "No",
    browserUse: "Partial — uses DOM/accessibility signals internally to feed its LLM loop, not exposed as a standalone primitive",
  },
  {
    label: "LLM-free smart interactions",
    cdpilot: "Yes — smart-click/smart-fill/smart-select match visible text, no LLM call needed",
    playwright: "Partial — locators (getByRole, getByText) are deterministic, but the MCP tool loop is still LLM-driven step by step",
    puppeteer: "No",
    selenium: "No",
    browserUse: "No — by design, every action is an LLM decision",
  },
  {
    label: "Built-in test assertions",
    cdpilot: "10 (assert, assert-url, assert-visible, screenshot-diff, ...) + a test/trace runner",
    playwright: "Yes — mature expect() API via @playwright/test, broader than cdpilot's set",
    puppeteer: "No — pairs with an external framework (Jest, Mocha)",
    selenium: "No — pairs with an external framework",
    browserUse: "No",
  },
  {
    label: "Attach to an existing / logged-in browser session",
    cdpilot: "Not by default — it launches an isolated profile so your personal browser is never touched. Commands drive whatever CDP endpoint CDP_PORT points at, so a browser you started with --remote-debugging-port works too (undocumented path). Passed challenges can also be carried via cookies save/load",
    playwright: "Yes — chromium.connectOverCDP()",
    puppeteer: "Yes — puppeteer.connect({ browserWSEndpoint })",
    selenium: "Partial — Chrome-only, via the debuggerAddress capability",
    browserUse: "Depends on its Playwright backend — not documented as a first-class feature",
  },
  /* <!-- 0.9.4-pending -->
  PR #26 (unmerged): https://github.com/mehmetnadir/cdpilot/pull/26 — drop this row if it doesn't ship in 0.9.4.
  {
    label: "Attach to your own running browser (pending 0.9.4)",
    cdpilot: "Coming in 0.9.4 (PR #26, unmerged): cdpilot connect [<port>|<ws-url>|--auto] attaches to a Chrome/Brave/Vivaldi/Edge you already started — a human solves the CAPTCHA/login wall, the agent continues in the same browser (localhost only). Until it ships, only the CDP_PORT workaround above applies.",
    playwright: "Yes — chromium.connectOverCDP()",
    puppeteer: "Yes — puppeteer.connect({ browserWSEndpoint })",
    selenium: "Partial — Chrome-only, via the debuggerAddress capability",
    browserUse: "Depends on its Playwright backend — not documented as a first-class feature",
  },
  <!-- /0.9.4-pending --> */
  {
    label: "License",
    cdpilot: "MIT",
    playwright: "Apache-2.0",
    puppeteer: "Apache-2.0",
    selenium: "Apache-2.0",
    browserUse: "MIT",
  },
];

const faqs = [
  {
    q: "What's a lightweight alternative to Playwright for AI coding agents?",
    a: "cdpilot is a single-file, zero-npm-dependency CLI that talks directly to Chrome via the DevTools Protocol (CDP) — no Playwright/Puppeteer/Selenium runtime, no bundled browser download, no node_modules tree. It ships a built-in MCP server (42 tools) so AI agents like Claude Code or Cursor can drive a browser with one config block, plus LLM-free \"smart\" commands (click/fill by visible text) that Playwright's own MCP server doesn't have.",
  },
  {
    q: "Is there a small, dependency-free MCP server for browser control?",
    a: "cdpilot's MCP server (cdpilot mcp) is that: it's part of the same ~0.6MB npm package as the CLI, adds zero npm dependencies, and exposes accessibility-tree snapshots — structured text with @ref handles the agent can act on directly, no vision model needed — plus click/type/extract/test-assertion tools. Compare that to Playwright's official @playwright/mcp, which is excellent but pulls in the full Playwright browser-automation stack, or Puppeteer's official MCP server, which its own maintainers now mark deprecated in favor of Playwright MCP.",
  },
  {
    q: "How does cdpilot compare to browser-use for AI browser agents?",
    a: "browser-use (~116k GitHub stars) is a Python agent framework where an LLM decides every action, built on top of Playwright underneath — powerful for open-ended tasks, but every step costs an LLM call. cdpilot takes the opposite approach for routine interactions: LLM-free smart-click/smart-fill by visible text, and a structured a11y-snapshot when an agent does need to reason about the page — fewer tokens and fewer LLM round-trips for the common case.",
  },
  {
    q: "Can cdpilot attach to my existing, already logged-in Chrome session?",
    a: "Not by default. cdpilot launches its own isolated browser profile (~/.cdpilot/profile) so your personal browser — cookies, history, passwords — is never touched by automation. Its commands talk to whatever CDP endpoint CDP_PORT points at, so a browser you started yourself with --remote-debugging-port can be driven too; that path is not documented yet, and recent Chrome versions only allow remote debugging on a non-default --user-data-dir. To carry a session across runs without attaching (e.g. a passed Cloudflare/DataDome challenge), use cdpilot cookies save/load. Playwright and Puppeteer expose attaching as a first-class API: connectOverCDP() / connect().",
  },
  /* <!-- 0.9.4-pending -->
  PR #26 (unmerged): https://github.com/mehmetnadir/cdpilot/pull/26 — drop this entry if it doesn't ship in 0.9.4.
  {
    q: "Will cdpilot ever support attaching to my own running Chrome?",
    a: "Yes — cdpilot connect [<port>|<ws-url>|--auto] is in progress for 0.9.4 (PR #26, not yet merged). It attaches to a Chrome/Brave/Vivaldi/Edge you already started so a human can clear a CAPTCHA or login wall and the agent continues in the same, already-authenticated browser; only localhost endpoints are accepted. Until it merges, the answer above (isolated profile + cookies save/load) still applies.",
  },
  <!-- /0.9.4-pending --> */
];

const weaknesses = [
  {
    title: "CSS selectors don't pierce shadow DOM yet",
    body: "The smart commands (smart-click, smart-fill, smart-select) search open shadow roots, but CSS-selector commands like click and fill don't pierce them yet (GitHub issue #3); Playwright's locators do by default. iframes are covered since 0.9.3: >>> or --frame reaches elements inside frames, cross-origin and nested ones included.",
  },
  {
    title: "Heavy JS-challenge anti-bot walls are still hard",
    body: "cdpilot's own Stealth Bench V1 (v0.5.3, 80 tasks) is explicit about this: PerimeterX 2/18 (11%), GeeTest 0/4 (0%), Kasada 0/1 (0%), Akamai 1/6 (17%). cdpilot describes itself as \"an avoidance engine, not a CAPTCHA solver\" — when a challenge blocks progress and can't be bypassed, the task fails, and that's counted honestly rather than hidden.",
  },
  {
    title: "Smaller ecosystem and test-assertion surface",
    body: "10 built-in assertions vs. Playwright's full expect() test framework, and a much smaller community/plugin ecosystem than Playwright (Microsoft-backed) or browser-use (~116k GitHub stars).",
  },
];

export default function ComparePage() {
  const comparisonJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "cdpilot vs Playwright vs Puppeteer vs Selenium vs browser-use",
    description: metadata.description,
    author: { "@type": "Organization", name: "cdpilot team", url: "https://cdpilot.ndr.ist" },
    publisher: {
      "@type": "Organization",
      name: "cdpilot",
      url: "https://cdpilot.ndr.ist",
      logo: { "@type": "ImageObject", url: "https://cdpilot.ndr.ist/favicon.ico" },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": "https://cdpilot.ndr.ist/compare" },
    url: "https://cdpilot.ndr.ist/compare",
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://cdpilot.ndr.ist" },
      { "@type": "ListItem", position: 2, name: "Compare", item: "https://cdpilot.ndr.ist/compare" },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(comparisonJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <Nav />
      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-6 pt-28 pb-24">
          <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-2 text-sm text-[#52525b]">
            <Link href="/" className="hover:text-[#a1a1aa] transition-colors">Home</Link>
            <span>/</span>
            <span className="text-[#a1a1aa]">Compare</span>
          </nav>

          <h1 className="text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
            cdpilot vs Playwright vs Puppeteer vs Selenium vs{" "}
            <span className="text-gradient-green">browser-use</span>
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[#a1a1aa]">
            cdpilot is a lightweight Playwright alternative built directly on raw Chrome DevTools
            Protocol (CDP): a single Python file plus a small Node launcher, zero npm
            dependencies, a built-in MCP server, and LLM-free &quot;smart&quot; commands. This page
            is an honest, sourced comparison — including the places where the bigger, older
            projects below still beat it.
          </p>

          {/* Comparison table */}
          <div className="prose-blog mt-14 overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>Dimension</th>
                  <th>cdpilot</th>
                  <th>Playwright</th>
                  <th>Puppeteer</th>
                  <th>Selenium</th>
                  <th>browser-use</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.label}>
                    <td className="font-semibold text-[#e4e4e7] whitespace-nowrap">{row.label}</td>
                    <td>{row.cdpilot}</td>
                    <td>{row.playwright}</td>
                    <td>{row.puppeteer}</td>
                    <td>{row.selenium}</td>
                    <td>{row.browserUse}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Weaknesses */}
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Where cdpilot is still <span className="text-gradient-green">weaker</span>
            </h2>
            <p className="mt-3 max-w-3xl text-[#a1a1aa]">
              A comparison that only lists advantages isn&apos;t a comparison. Here&apos;s what the
              older, larger projects still do better.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {weaknesses.map((w) => (
                <div key={w.title} className="rounded-xl border border-[#27272a] bg-[#141414]/50 p-5">
                  <h3 className="font-semibold text-white">{w.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#a1a1aa]">{w.body}</p>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Frequently asked <span className="text-gradient-green">questions</span>
            </h2>
            <div className="mt-8 space-y-6">
              {faqs.map((item) => (
                <div key={item.q} className="rounded-xl border border-[#27272a] bg-[#141414] p-5">
                  <h3 className="font-semibold text-white">{item.q}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#a1a1aa]">{item.a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Sources */}
          <section className="mt-16 border-t border-[#27272a] pt-10">
            <h2 className="text-lg font-semibold text-white">Sources</h2>
            <ul className="prose-blog mt-4">
              <li>
                <a href="https://github.com/mehmetnadir/cdpilot#readme" target="_blank" rel="noopener noreferrer">cdpilot README</a> — commands, requirements, comparison table, Stealth Bench V1 results
              </li>
              <li>
                <a href="https://registry.npmjs.org/cdpilot/latest" target="_blank" rel="noopener noreferrer">npm registry: cdpilot</a>,{" "}
                <a href="https://registry.npmjs.org/playwright/latest" target="_blank" rel="noopener noreferrer">playwright</a>,{" "}
                <a href="https://registry.npmjs.org/playwright-core/latest" target="_blank" rel="noopener noreferrer">playwright-core</a>,{" "}
                <a href="https://registry.npmjs.org/puppeteer/latest" target="_blank" rel="noopener noreferrer">puppeteer</a>,{" "}
                <a href="https://registry.npmjs.org/puppeteer-core/latest" target="_blank" rel="noopener noreferrer">puppeteer-core</a>,{" "}
                <a href="https://registry.npmjs.org/selenium-webdriver/latest" target="_blank" rel="noopener noreferrer">selenium-webdriver</a>{" "}
                — unpacked package size and direct dependency counts (measured 2026-09-27)
              </li>
              <li>
                <a href="https://playwright.dev/docs/browsers" target="_blank" rel="noopener noreferrer">playwright.dev/docs/browsers</a> — browser binaries downloaded separately from the npm package
              </li>
              <li>
                <a href="https://github.com/puppeteer/puppeteer" target="_blank" rel="noopener noreferrer">github.com/puppeteer/puppeteer</a> — bundled Chromium download size by OS
              </li>
              <li>
                <a href="https://www.npmjs.com/package/@playwright/mcp" target="_blank" rel="noopener noreferrer">npmjs.com/package/@playwright/mcp</a> and{" "}
                <a href="https://github.com/microsoft/playwright-mcp" target="_blank" rel="noopener noreferrer">github.com/microsoft/playwright-mcp</a> — official Microsoft Playwright MCP server
              </li>
              <li>
                <a href="https://www.npmjs.com/package/@modelcontextprotocol/server-puppeteer" target="_blank" rel="noopener noreferrer">npmjs.com/package/@modelcontextprotocol/server-puppeteer</a> — deprecation notice, recommends Playwright MCP
              </li>
              <li>
                <a href="https://github.com/browser-use/browser-use" target="_blank" rel="noopener noreferrer">github.com/browser-use/browser-use</a> — install method, Playwright dependency, star count (checked 2026-09-27)
              </li>
            </ul>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
