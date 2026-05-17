export interface CommandArg {
  name: string;
  required: boolean;
  description: string;
}

export interface CommandExample {
  code: string;
  description: string;
}

export interface Command {
  name: string;
  category: string;
  description: string;
  usage: string;
  args?: CommandArg[];
  examples: CommandExample[];
  flags?: string[];
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export const categories: Category[] = [
  { id: "setup", name: "Setup", icon: "gear" },
  { id: "navigation", name: "Navigation", icon: "compass" },
  { id: "interaction", name: "Interaction", icon: "pointer" },
  { id: "debugging", name: "Debugging", icon: "search" },
  { id: "tabs", name: "Tabs & Sessions", icon: "layers" },
  { id: "network", name: "Network", icon: "globe" },
  { id: "emulation", name: "Emulation", icon: "smartphone" },
  { id: "ai", name: "AI & Accessibility", icon: "bot" },
  { id: "stealth", name: "Stealth & CAPTCHA", icon: "shield" },
  { id: "advanced", name: "Advanced", icon: "zap" },
];

export const commands: Command[] = [
  // ── Setup ──────────────────────────────────────────────
  {
    name: "launch",
    category: "setup",
    description:
      "Start browser with CDP enabled. Uses an isolated profile so your personal browser is never touched.",
    usage: "cdpilot launch",
    examples: [
      {
        code: "npx cdpilot launch",
        description: "Launch the default browser (Brave > Chrome > Chromium)",
      },
      {
        code: "CHROME_BIN=/usr/bin/google-chrome npx cdpilot launch",
        description: "Launch a specific browser binary",
      },
      {
        code: "CDP_PORT=9333 npx cdpilot launch",
        description: "Launch on a custom CDP port",
      },
    ],
  },
  {
    name: "setup",
    category: "setup",
    description:
      "Auto-detect browsers on the system and create an isolated profile directory.",
    usage: "cdpilot setup",
    examples: [
      {
        code: "npx cdpilot setup",
        description: "Run interactive setup to detect browsers and configure profile",
      },
    ],
  },
  {
    name: "status",
    category: "setup",
    description:
      "Check if a CDP-enabled browser is running and reachable on the configured port.",
    usage: "cdpilot status",
    examples: [
      {
        code: "npx cdpilot status",
        description: "Check connection status",
      },
    ],
  },
  {
    name: "stop",
    category: "setup",
    description:
      "Stop the browser instance managed by cdpilot on the current port.",
    usage: "cdpilot stop",
    examples: [
      {
        code: "npx cdpilot stop",
        description: "Stop the running browser",
      },
    ],
  },
  {
    name: "version",
    category: "setup",
    description: "Show the installed cdpilot version.",
    usage: "cdpilot version",
    examples: [
      {
        code: "npx cdpilot version",
        description: "Print version number",
      },
    ],
  },
  {
    name: "browser",
    category: "setup",
    description:
      "Workload-aware browser selection. `auto` (default) picks Vivaldi/Brave/Edge when dev extensions are registered (they honor --load-extension), and prefers Chrome when none are (fastest, most stable). On macOS 26 Brave is demoted due to a known ~7min crash in the 1.89 build. Each browser gets an isolated profile so switching never corrupts prefs.",
    usage: "cdpilot browser [auto|chrome|brave|vivaldi|chromium|edge]",
    args: [
      {
        name: "name",
        required: false,
        description:
          "Browser to pin. Use 'auto' for smart default, or omit to see current pick + reason.",
      },
    ],
    examples: [
      {
        code: "npx cdpilot browser",
        description: "Show current preference, auto-pick, and reason",
      },
      {
        code: "npx cdpilot browser vivaldi",
        description: "Pin to Vivaldi (recommended for extension work)",
      },
      {
        code: "npx cdpilot browser auto",
        description: "Restore workload-aware smart default",
      },
    ],
  },
  {
    name: "health",
    category: "setup",
    description:
      "Print a JSON health snapshot: alive, port, project_id, tabs, browser version, today's Brave crash count from macOS DiagnosticReports, stealth state, and uptime warning. Exit codes 0 (alive) / 2 (down) are designed for shell watchdog loops.",
    usage: "cdpilot health",
    examples: [
      {
        code: "npx cdpilot health",
        description: "One-shot JSON status",
      },
      {
        code: "until cdpilot health >/dev/null; do cdpilot launch; sleep 2; done",
        description: "Watchdog loop — auto-relaunch on crash",
      },
    ],
  },
  {
    name: "proxy",
    category: "setup",
    description:
      "Set, show, or clear the HTTP proxy. Requires a browser restart to take effect.",
    usage: "cdpilot proxy [<url>|off]",
    args: [
      {
        name: "url",
        required: false,
        description:
          "Proxy URL (e.g. http://proxy:8080). Use 'off' to clear. Omit to show current.",
      },
    ],
    examples: [
      {
        code: "npx cdpilot proxy http://127.0.0.1:8080",
        description: "Set a proxy",
      },
      {
        code: "npx cdpilot proxy off",
        description: "Clear the proxy",
      },
      {
        code: "npx cdpilot proxy",
        description: "Show the current proxy setting",
      },
    ],
  },
  {
    name: "headless",
    category: "setup",
    description:
      "Enable or disable headless mode. Requires a browser restart.",
    usage: "cdpilot headless [on|off]",
    args: [
      {
        name: "state",
        required: false,
        description: "on or off. Omit to show current state.",
      },
    ],
    examples: [
      {
        code: "npx cdpilot headless on",
        description: "Enable headless mode",
      },
      {
        code: "npx cdpilot headless off",
        description: "Disable headless mode",
      },
    ],
  },

  // ── Stealth & CAPTCHA ──────────────────────────────────
  {
    name: "stealth",
    category: "stealth",
    description:
      "Zero-dependency anti-fingerprint layer. Patches navigator.webdriver (smart no-op — only if value is true), chrome.runtime, plugins (proper PluginArray inheritance), WebGL vendor/renderer, permissions, hardwareConcurrency, and Worker constructor. Injected via Page.addScriptToEvaluateOnNewDocument before any page script runs. Disabled by default; opt-in.",
    usage: "cdpilot stealth [on|off|status]",
    args: [
      {
        name: "state",
        required: false,
        description: "on, off, or status. Omit to show current state.",
      },
    ],
    examples: [
      {
        code: "npx cdpilot stealth on",
        description: "Enable fingerprint patches for the next navigation",
      },
      {
        code: "npx cdpilot stealth off",
        description: "Disable patches (default)",
      },
      {
        code: "npx cdpilot stealth status",
        description: "Show current state and which patches are applied",
      },
    ],
  },
  {
    name: "captcha-check",
    category: "stealth",
    description:
      "One-shot read-only CAPTCHA detection on the active page. Covers Cloudflare Turnstile, Cloudflare interstitial, hCaptcha, reCAPTCHA, DataDome, PerimeterX, Arkose/FunCaptcha, and GeeTest. Returns JSON. Exit codes: 0 = no CAPTCHA, 3 = detected, 1 = error — useful in shell pipelines.",
    usage: "cdpilot captcha-check",
    args: [],
    examples: [
      {
        code: "npx cdpilot captcha-check",
        description: "Print JSON with detected providers",
      },
      {
        code: "npx cdpilot captcha-check && echo 'clean'",
        description: "Run next step only if no CAPTCHA",
      },
    ],
  },
  {
    name: "captcha-wait",
    category: "stealth",
    description:
      "Detect CAPTCHA and wait for it to be solved. Interactive (TTY): prints a warning and blocks on Enter. Non-interactive (pipe/MCP): polls every 2s and streams one JSON line per state change until the CAPTCHA disappears or the timeout elapses. Exit codes: 0 = solved or none, 2 = timeout, 1 = error.",
    usage: "cdpilot captcha-wait [timeout-seconds]",
    args: [
      {
        name: "timeout-seconds",
        required: false,
        description:
          "Max wait in seconds. Default 300, min 5, max 1800.",
      },
    ],
    examples: [
      {
        code: "npx cdpilot captcha-wait",
        description: "Wait up to 5 minutes for a manual solve",
      },
      {
        code: "npx cdpilot captcha-wait 60",
        description: "Wait up to 60 seconds then fail",
      },
    ],
  },

  // ── Navigation ─────────────────────────────────────────
  {
    name: "go",
    category: "navigation",
    description:
      "Navigate to a URL. Launches the browser automatically if it is not running.",
    usage: "cdpilot go <url>",
    args: [
      { name: "url", required: true, description: "URL to navigate to" },
    ],
    examples: [
      {
        code: "npx cdpilot go https://example.com",
        description: "Open a page and print its text content",
      },
      {
        code: "npx cdpilot go https://news.ycombinator.com",
        description: "Navigate to Hacker News",
      },
    ],
  },
  {
    name: "content",
    category: "navigation",
    description:
      "Get the text content of the current page (document.body.innerText). Truncated at 1 MB.",
    usage: "cdpilot content",
    examples: [
      {
        code: "npx cdpilot content",
        description: "Print the visible text of the active page",
      },
    ],
  },
  {
    name: "html",
    category: "navigation",
    description:
      "Get the full HTML source of the current page (outerHTML). Truncated at 1 MB.",
    usage: "cdpilot html",
    examples: [
      {
        code: "npx cdpilot html",
        description: "Print the HTML source of the active page",
      },
      {
        code: "npx cdpilot html > page.html",
        description: "Save the HTML to a file",
      },
    ],
  },
  {
    name: "shot",
    category: "navigation",
    description:
      "Take a full-page screenshot and save it as PNG.",
    usage: "cdpilot shot [<output-path>]",
    args: [
      {
        name: "output-path",
        required: false,
        description:
          "File path for the screenshot. Defaults to ~/.cdpilot/screenshots/screenshot.png",
      },
    ],
    examples: [
      {
        code: "npx cdpilot shot",
        description: "Take a screenshot with the default file name",
      },
      {
        code: "npx cdpilot shot /tmp/mypage.png",
        description: "Save the screenshot to a custom path",
      },
    ],
  },
  {
    name: "shot-annotated",
    category: "navigation",
    description:
      "Take a screenshot with green @N badges overlaid on every interactive element (buttons, links, inputs). Useful for AI agents to identify clickable targets.",
    usage: "cdpilot shot-annotated [<output-path>]",
    args: [
      {
        name: "output-path",
        required: false,
        description: "File path for the annotated screenshot",
      },
    ],
    examples: [
      {
        code: "npx cdpilot shot-annotated",
        description: "Take an annotated screenshot",
      },
      {
        code: "npx cdpilot shot-annotated /tmp/annotated.png",
        description: "Save annotated screenshot to a custom path",
      },
    ],
  },
  {
    name: "pdf",
    category: "navigation",
    description: "Save the current page as a PDF file.",
    usage: "cdpilot pdf [<output-path>]",
    args: [
      {
        name: "output-path",
        required: false,
        description: "File path for the PDF. Auto-generated if omitted.",
      },
    ],
    examples: [
      {
        code: "npx cdpilot pdf",
        description: "Export the current page to PDF",
      },
      {
        code: "npx cdpilot pdf /tmp/report.pdf",
        description: "Save PDF to a specific path",
      },
    ],
  },

  // ── Interaction ────────────────────────────────────────
  {
    name: "click",
    category: "interaction",
    description:
      "Click an element by CSS selector. Auto-waits up to 5 seconds for the element to appear, then scrolls it into view.",
    usage: "cdpilot click <selector>",
    args: [
      {
        name: "selector",
        required: true,
        description: "CSS selector of the element to click",
      },
    ],
    examples: [
      {
        code: 'npx cdpilot click "button.submit"',
        description: "Click a submit button",
      },
      {
        code: 'npx cdpilot click "#login-btn"',
        description: "Click an element by ID",
      },
    ],
  },
  {
    name: "fill",
    category: "interaction",
    description:
      "Fill an input field with a value. React/Vue compatible -- uses the native setter and dispatches input + change events.",
    usage: "cdpilot fill <selector> <value>",
    args: [
      {
        name: "selector",
        required: true,
        description: "CSS selector of the input element",
      },
      { name: "value", required: true, description: "Text value to fill" },
    ],
    examples: [
      {
        code: 'npx cdpilot fill "#email" "user@example.com"',
        description: "Fill an email input",
      },
      {
        code: 'npx cdpilot fill "input[name=search]" "cdpilot"',
        description: "Fill a search field by attribute",
      },
    ],
  },
  {
    name: "type",
    category: "interaction",
    description:
      "Alias for fill. Type text into an input element (React/Vue compatible).",
    usage: "cdpilot type <selector> <value>",
    args: [
      {
        name: "selector",
        required: true,
        description: "CSS selector of the input element",
      },
      { name: "value", required: true, description: "Text value to type" },
    ],
    examples: [
      {
        code: 'npx cdpilot type "#username" "john"',
        description: "Type into a username field",
      },
    ],
  },
  {
    name: "submit",
    category: "interaction",
    description:
      "Submit a form by clicking its submit button or calling form.submit(). Defaults to the first <form> on the page.",
    usage: "cdpilot submit [<selector>]",
    args: [
      {
        name: "selector",
        required: false,
        description: 'CSS selector for the form. Defaults to "form".',
      },
    ],
    examples: [
      {
        code: "npx cdpilot submit",
        description: "Submit the first form on the page",
      },
      {
        code: 'npx cdpilot submit "#login-form"',
        description: "Submit a specific form",
      },
    ],
  },
  {
    name: "hover",
    category: "interaction",
    description:
      "Move the mouse cursor to the center of an element. Triggers CSS :hover styles and mouseover events.",
    usage: "cdpilot hover <selector>",
    args: [
      {
        name: "selector",
        required: true,
        description: "CSS selector of the target element",
      },
    ],
    examples: [
      {
        code: 'npx cdpilot hover ".dropdown-trigger"',
        description: "Hover over a dropdown trigger",
      },
    ],
  },
  {
    name: "dblclick",
    category: "interaction",
    description: "Double-click an element by CSS selector.",
    usage: "cdpilot dblclick <selector>",
    args: [
      {
        name: "selector",
        required: true,
        description: "CSS selector of the element",
      },
    ],
    examples: [
      {
        code: 'npx cdpilot dblclick ".editable-cell"',
        description: "Double-click to edit an inline cell",
      },
    ],
  },
  {
    name: "rightclick",
    category: "interaction",
    description: "Right-click (context menu) an element by CSS selector.",
    usage: "cdpilot rightclick <selector>",
    args: [
      {
        name: "selector",
        required: true,
        description: "CSS selector of the element",
      },
    ],
    examples: [
      {
        code: 'npx cdpilot rightclick "#canvas"',
        description: "Open context menu on a canvas element",
      },
    ],
  },
  {
    name: "drag",
    category: "interaction",
    description:
      "Drag an element from one position to another. Simulates mousedown, mousemove steps, and mouseup.",
    usage: "cdpilot drag <from-selector> <to-selector>",
    args: [
      {
        name: "from-selector",
        required: true,
        description: "CSS selector of the element to drag",
      },
      {
        name: "to-selector",
        required: true,
        description: "CSS selector of the drop target",
      },
    ],
    examples: [
      {
        code: 'npx cdpilot drag ".item-1" ".dropzone"',
        description: "Drag an item into a drop zone",
      },
    ],
  },
  {
    name: "keys",
    category: "interaction",
    description:
      "Send a keyboard shortcut or key press. Supports modifiers (ctrl, shift, alt, meta) combined with keys.",
    usage: "cdpilot keys <combo>",
    args: [
      {
        name: "combo",
        required: true,
        description:
          "Key combination like ctrl+a, shift+tab, enter, escape, etc.",
      },
    ],
    examples: [
      {
        code: "npx cdpilot keys ctrl+a",
        description: "Select all text",
      },
      {
        code: "npx cdpilot keys enter",
        description: "Press Enter",
      },
      {
        code: "npx cdpilot keys ctrl+shift+i",
        description: "Open DevTools shortcut",
      },
    ],
  },
  {
    name: "scroll-to",
    category: "interaction",
    description:
      "Scroll the specified element into view with smooth scrolling.",
    usage: "cdpilot scroll-to <selector>",
    args: [
      {
        name: "selector",
        required: true,
        description: "CSS selector of the element to scroll to",
      },
    ],
    examples: [
      {
        code: 'npx cdpilot scroll-to "#footer"',
        description: "Scroll to the footer element",
      },
    ],
  },
  {
    name: "wait",
    category: "interaction",
    description:
      "Wait for an element to appear in the DOM. Uses MutationObserver for efficient detection.",
    usage: "cdpilot wait <selector> [<timeout>]",
    args: [
      {
        name: "selector",
        required: true,
        description: "CSS selector to wait for",
      },
      {
        name: "timeout",
        required: false,
        description: "Timeout in seconds (default: 5)",
      },
    ],
    examples: [
      {
        code: 'npx cdpilot wait ".modal-content"',
        description: "Wait up to 5 seconds for a modal to appear",
      },
      {
        code: 'npx cdpilot wait "#results" 10',
        description: "Wait up to 10 seconds for results",
      },
    ],
  },
  {
    name: "click-ref",
    category: "interaction",
    description:
      "Click an element by its @N reference number from the last a11y-snapshot. Uses real mouse events via CDP Input domain.",
    usage: "cdpilot click-ref <@N>",
    args: [
      {
        name: "@N",
        required: true,
        description:
          "Reference number from a11y-snapshot (e.g. @3, @15)",
      },
    ],
    examples: [
      {
        code: "npx cdpilot click-ref @3",
        description: "Click the element labeled @3 in the last snapshot",
      },
    ],
  },

  // ── Debugging ──────────────────────────────────────────
  {
    name: "console",
    category: "debugging",
    description:
      "Capture and display browser console logs (log, error, warning, info) from the current or specified page.",
    usage: "cdpilot console [<url>]",
    args: [
      {
        name: "url",
        required: false,
        description: "URL to navigate to before capturing. Uses current page if omitted.",
      },
    ],
    examples: [
      {
        code: "npx cdpilot console",
        description: "Show console logs of the current page",
      },
      {
        code: "npx cdpilot console https://example.com",
        description: "Navigate and capture console output",
      },
    ],
  },
  {
    name: "network",
    category: "debugging",
    description:
      "Monitor and display all network requests with status codes, types, and URLs.",
    usage: "cdpilot network [<url>]",
    args: [
      {
        name: "url",
        required: false,
        description: "URL to navigate to and monitor. Uses current page if omitted.",
      },
    ],
    examples: [
      {
        code: "npx cdpilot network",
        description: "Show network requests of the current page",
      },
      {
        code: "npx cdpilot network https://api.example.com",
        description: "Navigate and inspect all requests",
      },
    ],
  },
  {
    name: "debug",
    category: "debugging",
    description:
      "Full auto-debug: navigate, then display console logs, network requests, performance metrics, and a screenshot -- all in one command.",
    usage: "cdpilot debug [<url>]",
    args: [
      {
        name: "url",
        required: false,
        description: "URL to debug. Uses current page if omitted.",
      },
    ],
    examples: [
      {
        code: "npx cdpilot debug https://myapp.dev",
        description: "Run a full debug report on a URL",
      },
      {
        code: "npx cdpilot debug",
        description: "Debug the currently open page",
      },
    ],
  },
  {
    name: "eval",
    category: "debugging",
    description:
      "Execute JavaScript in the browser and return the result. Supports async/await expressions.",
    usage: "cdpilot eval <js>",
    args: [
      {
        name: "js",
        required: true,
        description: "JavaScript expression to evaluate",
      },
    ],
    examples: [
      {
        code: 'npx cdpilot eval "document.title"',
        description: "Get the page title",
      },
      {
        code: 'npx cdpilot eval "document.querySelectorAll(\'a\').length"',
        description: "Count all links on the page",
      },
      {
        code: 'npx cdpilot eval "await fetch(\'/api/health\').then(r=>r.json())"',
        description: "Fetch an API endpoint and return JSON",
      },
    ],
  },
  {
    name: "perf",
    category: "debugging",
    description:
      "Show key performance metrics: DOM nodes, JS heap size, event listeners, first meaningful paint, and DomContentLoaded.",
    usage: "cdpilot perf",
    examples: [
      {
        code: "npx cdpilot perf",
        description: "Display performance metrics of the current page",
      },
    ],
  },
  {
    name: "multi-eval",
    category: "debugging",
    description:
      "Execute JavaScript across all open tabs in parallel and display each result.",
    usage: "cdpilot multi-eval <js>",
    args: [
      {
        name: "js",
        required: true,
        description: "JavaScript expression to run on every tab",
      },
    ],
    examples: [
      {
        code: 'npx cdpilot multi-eval "document.title"',
        description: "Get the title of every open tab",
      },
    ],
  },

  // ── Tabs & Sessions ────────────────────────────────────
  {
    name: "tabs",
    category: "tabs",
    description:
      "List all open browser tabs with their index, title, and URL.",
    usage: "cdpilot tabs",
    examples: [
      {
        code: "npx cdpilot tabs",
        description: "Show all open tabs",
      },
    ],
  },
  {
    name: "new-tab",
    category: "tabs",
    description: "Open a new browser tab.",
    usage: "cdpilot new-tab [<url>]",
    args: [
      {
        name: "url",
        required: false,
        description: "URL to open. Defaults to about:blank.",
      },
    ],
    examples: [
      {
        code: "npx cdpilot new-tab https://example.com",
        description: "Open a new tab at a URL",
      },
      {
        code: "npx cdpilot new-tab",
        description: "Open a blank new tab",
      },
    ],
  },
  {
    name: "close-tab",
    category: "tabs",
    description:
      "Close a tab by index or ID. Closes the active tab if no argument is provided.",
    usage: "cdpilot close-tab [<index-or-id>]",
    args: [
      {
        name: "index-or-id",
        required: false,
        description:
          "Tab index number or CDP target ID. Omit to close the active tab.",
      },
    ],
    examples: [
      {
        code: "npx cdpilot close-tab",
        description: "Close the current tab",
      },
      {
        code: "npx cdpilot close-tab 2",
        description: "Close tab at index 2",
      },
    ],
  },
  {
    name: "switch-tab",
    category: "tabs",
    description: "Switch to a tab by its index number or CDP target ID.",
    usage: "cdpilot switch-tab <index-or-id>",
    args: [
      {
        name: "index-or-id",
        required: true,
        description: "Tab index (from tabs command) or target ID",
      },
    ],
    examples: [
      {
        code: "npx cdpilot switch-tab 0",
        description: "Switch to the first tab",
      },
    ],
  },
  {
    name: "session",
    category: "tabs",
    description: "Show current session info (session ID, target, status).",
    usage: "cdpilot session",
    examples: [
      {
        code: "npx cdpilot session",
        description: "Display current session details",
      },
    ],
  },
  {
    name: "sessions",
    category: "tabs",
    description: "List all active sessions with their target IDs and status.",
    usage: "cdpilot sessions",
    examples: [
      {
        code: "npx cdpilot sessions",
        description: "Show all sessions",
      },
    ],
  },
  {
    name: "session-close",
    category: "tabs",
    description:
      "Close a specific session window and remove its registry entry.",
    usage: "cdpilot session-close [<session-id>]",
    args: [
      {
        name: "session-id",
        required: false,
        description: "Session ID to close. Defaults to current session.",
      },
    ],
    examples: [
      {
        code: "npx cdpilot session-close",
        description: "Close the current session",
      },
    ],
  },

  // ── Network ────────────────────────────────────────────
  {
    name: "throttle",
    category: "network",
    description:
      "Simulate network conditions: 3G, offline, or custom bandwidth/latency.",
    usage: "cdpilot throttle <preset>",
    args: [
      {
        name: "preset",
        required: true,
        description:
          "slow3g, fast3g, offline, off, or custom <down_kbps> <up_kbps> <latency_ms>",
      },
    ],
    examples: [
      {
        code: "npx cdpilot throttle slow3g",
        description: "Simulate slow 3G network",
      },
      {
        code: "npx cdpilot throttle fast3g",
        description: "Simulate fast 3G network",
      },
      {
        code: "npx cdpilot throttle offline",
        description: "Simulate offline mode",
      },
      {
        code: "npx cdpilot throttle off",
        description: "Disable throttling",
      },
      {
        code: "npx cdpilot throttle custom 500 100 200",
        description: "Custom: 500 kbps down, 100 kbps up, 200ms latency",
      },
    ],
  },
  {
    name: "intercept",
    category: "network",
    description:
      "Intercept network requests: block URLs, mock responses from files, or inject custom headers.",
    usage: "cdpilot intercept <subcmd> [args...]",
    args: [
      {
        name: "subcmd",
        required: true,
        description:
          "block <pattern>, mock <pattern> <json-file>, headers <pattern> <header:value>, clear, or list",
      },
    ],
    examples: [
      {
        code: 'npx cdpilot intercept block "*.analytics.com*"',
        description: "Block all analytics requests",
      },
      {
        code: 'npx cdpilot intercept mock "*/api/users" ./mock-users.json',
        description: "Mock an API endpoint with a local JSON file",
      },
      {
        code: 'npx cdpilot intercept headers "*" "X-Debug:true"',
        description: "Add a custom header to all requests",
      },
      {
        code: "npx cdpilot intercept list",
        description: "Show active interception rules",
      },
      {
        code: "npx cdpilot intercept clear",
        description: "Remove all interception rules",
      },
    ],
  },
  {
    name: "cookies",
    category: "network",
    description:
      "List cookies, or save/load them as JSON. Designed for replaying CF/DataDome clearance cookies across runs — beat the wall once, capture, replay later.",
    usage: "cdpilot cookies [<domain>] | cookies save <file> [<domain>] | cookies load <file>",
    args: [
      {
        name: "subcommand or domain",
        required: false,
        description: "'save'/'load' for JSON I/O, or a domain to filter. Omit to list all.",
      },
    ],
    examples: [
      {
        code: "npx cdpilot cookies",
        description: "Show all cookies for the current page",
      },
      {
        code: "npx cdpilot cookies example.com",
        description: "Show cookies for a specific domain",
      },
      {
        code: "npx cdpilot cookies save clearance.json example.com",
        description: "Export cookies for a domain to JSON (subdomain-aware)",
      },
      {
        code: "npx cdpilot cookies load clearance.json",
        description: "Replay saved cookies; verifies accepted count vs file",
      },
    ],
  },
  {
    name: "storage",
    category: "network",
    description:
      "Display all localStorage entries for the current page (keys and truncated values).",
    usage: "cdpilot storage",
    examples: [
      {
        code: "npx cdpilot storage",
        description: "Show localStorage contents",
      },
    ],
  },

  // ── Emulation ──────────────────────────────────────────
  {
    name: "emulate",
    category: "emulation",
    description:
      "Emulate a mobile device (screen size, scale factor, user agent). Presets: iphone, ipad, android. Use 'reset' to go back to desktop.",
    usage: "cdpilot emulate <device>",
    args: [
      {
        name: "device",
        required: true,
        description: "iphone, ipad, android, or reset",
      },
    ],
    examples: [
      {
        code: "npx cdpilot emulate iphone",
        description: "Emulate iPhone (390x844, 3x scale)",
      },
      {
        code: "npx cdpilot emulate android",
        description: "Emulate Android device",
      },
      {
        code: "npx cdpilot emulate reset",
        description: "Reset to desktop viewport",
      },
    ],
  },
  {
    name: "geo",
    category: "emulation",
    description:
      "Override geolocation. Presets: istanbul, london, newyork, paris, tokyo. Custom coordinates also supported.",
    usage: "cdpilot geo <preset|lat> [<lng>] [<accuracy>]",
    args: [
      {
        name: "preset or lat",
        required: true,
        description:
          "City preset name, latitude value, or 'off' to clear",
      },
      {
        name: "lng",
        required: false,
        description: "Longitude (when using custom coordinates)",
      },
    ],
    examples: [
      {
        code: "npx cdpilot geo istanbul",
        description: "Set location to Istanbul",
      },
      {
        code: "npx cdpilot geo 37.7749 -122.4194",
        description: "Set location to San Francisco",
      },
      {
        code: "npx cdpilot geo off",
        description: "Clear geolocation override",
      },
    ],
  },
  {
    name: "permission",
    category: "emulation",
    description:
      "Grant, deny, or reset browser permissions (geolocation, notifications, camera, microphone, etc.).",
    usage: "cdpilot permission <action> [<permission>]",
    args: [
      {
        name: "action",
        required: true,
        description: "grant, deny, or reset",
      },
      {
        name: "permission",
        required: false,
        description:
          "Permission name (e.g. geolocation, notifications). Required for grant/deny.",
      },
    ],
    examples: [
      {
        code: "npx cdpilot permission grant geolocation",
        description: "Grant geolocation permission",
      },
      {
        code: "npx cdpilot permission deny notifications",
        description: "Deny notification permission",
      },
      {
        code: "npx cdpilot permission reset",
        description: "Reset all permissions",
      },
    ],
  },

  // ── AI & Accessibility ─────────────────────────────────
  {
    name: "mcp",
    category: "ai",
    description:
      "Start the MCP (Model Context Protocol) server over stdin/stdout. Enables AI agents like Claude Code and Cursor to control the browser via JSON-RPC.",
    usage: "cdpilot mcp",
    examples: [
      {
        code: "npx cdpilot mcp",
        description: "Start the MCP server for AI agent integration",
      },
    ],
  },
  {
    name: "a11y-snapshot",
    category: "ai",
    description:
      "Output a compact accessibility snapshot for AI agent navigation. Each line shows @ref [role] \"name\" with attributes. Use click-ref to interact.",
    usage: "cdpilot a11y-snapshot",
    examples: [
      {
        code: "npx cdpilot a11y-snapshot",
        description: "Get a machine-readable accessibility tree",
      },
    ],
  },
  {
    name: "a11y",
    category: "ai",
    description:
      "Analyze the full accessibility tree. Subcommands: full (default), summary, find <role>.",
    usage: "cdpilot a11y [full|summary|find <role>]",
    args: [
      {
        name: "subcmd",
        required: false,
        description:
          "full (show all nodes), summary (role counts), find <role> (filter by role)",
      },
    ],
    examples: [
      {
        code: "npx cdpilot a11y",
        description: "Show the full accessibility tree",
      },
      {
        code: "npx cdpilot a11y summary",
        description: "Show role counts and interactive elements",
      },
      {
        code: "npx cdpilot a11y find button",
        description: "Find all buttons in the accessibility tree",
      },
    ],
  },
  {
    name: "batch",
    category: "ai",
    description:
      "Read a JSON array of commands from stdin and execute them sequentially. Returns results as JSON. Ideal for AI agent pipelines.",
    usage: "echo '[...]' | cdpilot batch",
    examples: [
      {
        code: 'echo \'[{"cmd":"go","args":["https://example.com"]},{"cmd":"shot","args":["/tmp/out.png"]}]\' | npx cdpilot batch',
        description: "Navigate and screenshot in one batch",
      },
      {
        code: 'echo \'[{"cmd":"click","args":["#btn"]},{"cmd":"wait","args":[".result"]}]\' | npx cdpilot batch',
        description: "Click and wait in sequence",
      },
    ],
  },

  // ── Advanced ───────────────────────────────────────────
  {
    name: "glow",
    category: "advanced",
    description:
      "Toggle the visual indicator overlay. When enabled, shows a green border and cursor animations during automation.",
    usage: "cdpilot glow [on|off]",
    args: [
      {
        name: "state",
        required: false,
        description: "on or off. Defaults to on.",
      },
    ],
    examples: [
      {
        code: "npx cdpilot glow on",
        description: "Enable visual feedback overlay",
      },
      {
        code: "npx cdpilot glow off",
        description: "Disable visual feedback overlay",
      },
    ],
  },
  {
    name: "upload",
    category: "advanced",
    description:
      "Upload a file to a file input element using DOM.setFileInputFiles.",
    usage: "cdpilot upload <selector> <file-path>",
    args: [
      {
        name: "selector",
        required: true,
        description: "CSS selector of the file input",
      },
      {
        name: "file-path",
        required: true,
        description: "Path to the file to upload",
      },
    ],
    examples: [
      {
        code: 'npx cdpilot upload "input[type=file]" ./photo.jpg',
        description: "Upload a file to a file input",
      },
    ],
  },
  {
    name: "dialog",
    category: "advanced",
    description:
      "Handle JavaScript dialogs (alert, confirm, prompt). Auto-accept, auto-dismiss, or respond to prompts.",
    usage: "cdpilot dialog <subcmd> [<text>]",
    args: [
      {
        name: "subcmd",
        required: true,
        description: "auto-accept, auto-dismiss, prompt <text>, or off",
      },
    ],
    examples: [
      {
        code: "npx cdpilot dialog auto-accept",
        description: "Automatically accept all dialogs",
      },
      {
        code: "npx cdpilot dialog auto-dismiss",
        description: "Automatically dismiss all dialogs",
      },
      {
        code: 'npx cdpilot dialog prompt "my answer"',
        description: "Accept a prompt dialog with a response",
      },
      {
        code: "npx cdpilot dialog off",
        description: "Disable automatic dialog handling",
      },
    ],
  },
  {
    name: "frame",
    category: "advanced",
    description:
      "Access iframes and Shadow DOM. List iframes, evaluate JS inside them, or read shadow root content.",
    usage: "cdpilot frame <subcmd> [args...]",
    args: [
      {
        name: "subcmd",
        required: true,
        description:
          "list, eval <js>, or shadow <selector>",
      },
    ],
    examples: [
      {
        code: "npx cdpilot frame list",
        description: "List all iframes on the page",
      },
      {
        code: 'npx cdpilot frame eval "document.title"',
        description: "Evaluate JS in the frame context",
      },
      {
        code: 'npx cdpilot frame shadow "#my-component"',
        description: "Read shadow DOM content of an element",
      },
    ],
  },
  {
    name: "download",
    category: "advanced",
    description:
      "Configure the browser download directory or check its status.",
    usage: "cdpilot download <subcmd> [<directory>]",
    args: [
      {
        name: "subcmd",
        required: true,
        description: "set <directory> or status",
      },
    ],
    examples: [
      {
        code: "npx cdpilot download set ~/Downloads/cdpilot",
        description: "Set the download directory",
      },
      {
        code: "npx cdpilot download status",
        description: "Show current download configuration",
      },
    ],
  },
  {
    name: "extensions",
    category: "advanced",
    description:
      "List all installed browser extensions and dev mode extensions.",
    usage: "cdpilot extensions",
    examples: [
      {
        code: "npx cdpilot extensions",
        description: "Show installed extensions",
      },
    ],
  },
  {
    name: "ext-install",
    category: "advanced",
    description:
      "Install an extension from a CRX file or unpacked directory. Dev extensions are loaded on next browser launch.",
    usage: "cdpilot ext-install <path>",
    args: [
      {
        name: "path",
        required: true,
        description: "Path to a .crx file or unpacked extension directory",
      },
    ],
    examples: [
      {
        code: "npx cdpilot ext-install ./my-extension/",
        description: "Install an unpacked extension",
      },
      {
        code: "npx cdpilot ext-install extension.crx",
        description: "Install from a CRX file",
      },
    ],
  },
  {
    name: "ext-remove",
    category: "advanced",
    description:
      "Remove an extension by its ID or index number.",
    usage: "cdpilot ext-remove <id-or-index>",
    args: [
      {
        name: "id-or-index",
        required: true,
        description: "Extension ID or index from the extensions list",
      },
    ],
    examples: [
      {
        code: "npx cdpilot ext-remove 0",
        description: "Remove the first dev extension",
      },
    ],
  },
  {
    name: "projects",
    category: "advanced",
    description:
      "List all registered cdpilot project instances with their ports and status.",
    usage: "cdpilot projects",
    examples: [
      {
        code: "npx cdpilot projects",
        description: "Show all project instances",
      },
    ],
  },
  {
    name: "project-stop",
    category: "advanced",
    description:
      "Stop a specific project's browser instance by name or path.",
    usage: "cdpilot project-stop <name>",
    args: [
      {
        name: "name",
        required: true,
        description: "Project name or path substring to match",
      },
    ],
    examples: [
      {
        code: "npx cdpilot project-stop my-project",
        description: "Stop a specific project instance",
      },
    ],
  },
  {
    name: "stop-all",
    category: "advanced",
    description: "Stop all active cdpilot browser instances across all projects.",
    usage: "cdpilot stop-all",
    examples: [
      {
        code: "npx cdpilot stop-all",
        description: "Stop every running cdpilot browser",
      },
    ],
  },
  {
    name: "close",
    category: "advanced",
    description: "Close the currently active browser tab.",
    usage: "cdpilot close",
    examples: [
      {
        code: "npx cdpilot close",
        description: "Close the active tab",
      },
    ],
  },

  // ── v0.5.0 — Efficient mode, smart navigation, parallel contexts ──
  {
    name: "show",
    category: "setup",
    description:
      "Toggle the visual feedback layer (glow border, fake cursor, click ripples, keystroke display). Default OFF in 0.5.0 for a quiet, professional experience. CDPILOT_MCP_SESSION=1 still keeps glow on for AI sessions automatically.",
    usage: "cdpilot show [on|off|status]",
    args: [
      {
        name: "mode",
        required: false,
        description: "on, off, or status. Omit for status.",
      },
    ],
    examples: [
      { code: "npx cdpilot show on", description: "Persist visual feedback ON" },
      { code: "npx cdpilot show off", description: "Persist visual feedback OFF (default)" },
      { code: "CDPILOT_SHOW=1 cdpilot go example.com", description: "One-shot override per command" },
    ],
  },
  {
    name: "fast",
    category: "setup",
    description:
      "Fast mode bundle — currently shortens auto-wait timeout (5000ms → 2000ms). Persisted. CDPILOT_WAIT_MS env wins over the mode default if set.",
    usage: "cdpilot fast [on|off|status]",
    args: [
      { name: "mode", required: false, description: "on, off, or status. Omit for status." },
    ],
    examples: [
      { code: "npx cdpilot fast on", description: "Enable fast defaults" },
      { code: "CDPILOT_WAIT_MS=1000 cdpilot click 'Sign in'", description: "Dial timeout independently" },
    ],
  },
  {
    name: "wait-for-text",
    category: "interaction",
    description:
      "Adaptive wait for a text fragment to appear anywhere in document.body.innerText. Uses MutationObserver with characterData+subtree, throttled via requestAnimationFrame — catches streaming AI tokens, typewriter effects, and late-loaded banners without paying for every token mutation.",
    usage: "cdpilot wait-for-text <text> [<timeout_ms>]",
    args: [
      { name: "text", required: true, description: "Text fragment to wait for (substring match)" },
      { name: "timeout_ms", required: false, description: "Max wait in ms (default 10000)" },
    ],
    examples: [
      { code: "npx cdpilot wait-for-text 'Sources'", description: "Wait for citation block in Perplexity" },
      { code: "npx cdpilot wait-for-text 'Done' 30000", description: "Wait up to 30s for completion text" },
    ],
  },
  {
    name: "eval-batch",
    category: "debugging",
    description:
      "Evaluate N JS expressions in a single Runtime.evaluate roundtrip. Each runs in its own try/catch so one failure doesn't sink the batch. Typical speedup: 5-30x vs sequential eval when reading many small DOM values. MCP: browser_eval_batch.",
    usage: "cdpilot eval-batch '<json_array>'",
    args: [
      {
        name: "json_array",
        required: true,
        description: "JSON array of JS expressions, e.g. '[\"document.title\",\"location.href\"]'",
      },
    ],
    examples: [
      {
        code: "npx cdpilot eval-batch '[\"document.title\",\"document.querySelectorAll(\\\"a\\\").length\"]'",
        description: "Read title + anchor count in one roundtrip",
      },
    ],
  },
  {
    name: "block",
    category: "network",
    description:
      "Block requests by URL pattern via Network.setBlockedURLs. Built-in presets: images, fonts, media, ads. Patterns persist and apply on every subsequent navigation. Opt-in only — blocking changes fingerprint surface, do NOT combine with stealth-mode targets. 3-10x faster load on image-heavy pages.",
    usage: "cdpilot block [on|off|preset <name>|patterns <p1,p2>|clear]",
    args: [
      {
        name: "subcommand",
        required: false,
        description: "on/off/clear, 'preset <name>', or 'patterns <comma-list>'",
      },
    ],
    examples: [
      { code: "npx cdpilot block preset images", description: "Block all image requests" },
      { code: "npx cdpilot block patterns '*.gif,*/ads/*'", description: "Custom patterns" },
      { code: "npx cdpilot block clear", description: "Remove all block rules" },
    ],
  },
  {
    name: "dismiss",
    category: "interaction",
    description:
      "Heuristic auto-click for 'Stay signed out / No thanks / Continue without account' buttons on LLM chat sites (ChatGPT, Perplexity, Claude.ai, Gemini) that gate access behind a sign-up modal. Built-in EN+TR pattern library with weighted scoring. Hard-coded negative-pattern list ('delete account', 'sign out', 'subscribe', TR equivalents) disqualifies destructive lookalikes — one negative hit and the candidate is out. MCP: browser_dismiss.",
    usage: "cdpilot dismiss [N|aggressive]",
    args: [
      {
        name: "N or aggressive",
        required: false,
        description: "Integer 1-10 for chained modals, or 'aggressive' (up to 5). Default: 1.",
      },
    ],
    examples: [
      { code: "npx cdpilot dismiss", description: "Dismiss a single sign-up wall" },
      { code: "npx cdpilot dismiss aggressive", description: "Chain through cookie-banner-then-signup" },
    ],
  },
  {
    name: "adaptive",
    category: "stealth",
    description:
      "Auto-escalate to stealth mode for hosts that show a CAPTCHA. Persists per-host memory. After every navigation, CAPTCHA detection runs; on a hit, the host is remembered AND the navigation is retried ONCE with stealth on. Conservative: never auto-demotes — once on the list it stays until you 'forget'. Matches the 'run fast, climb walls when seen' philosophy.",
    usage: "cdpilot adaptive [on|off|status|clear|forget <host>]",
    args: [
      {
        name: "subcommand",
        required: false,
        description: "on/off/status/clear, or 'forget <host>' to remove one entry",
      },
    ],
    examples: [
      { code: "npx cdpilot adaptive on", description: "Enable wall-aware navigation" },
      { code: "npx cdpilot adaptive status", description: "Show learned host list" },
      { code: "npx cdpilot adaptive forget example.com", description: "Demote a specific host" },
    ],
  },
  {
    name: "context",
    category: "advanced",
    description:
      "Browser context pool for true parallelism inside a single browser — Playwright's parallel-tabs model. Each context is an isolated cookie/storage namespace. Run actions against multiple contexts concurrently by setting CDPILOT_TARGET=<target_id> per CLI invocation. The env pin bypasses CWD-keyed session resolution — necessary for parallel workflows where two processes would otherwise race on sessions.json. Missing pin = fail loud (no silent fallback).",
    usage: "cdpilot context [create|list|close <target_id>]",
    args: [
      {
        name: "subcommand",
        required: false,
        description: "create (new isolated context+tab), list (show all targets), close <id>",
      },
    ],
    examples: [
      { code: "npx cdpilot context create", description: "Allocate a fresh isolated context" },
      { code: "npx cdpilot context list", description: "Show all targets with their context IDs" },
      {
        code: "CDPILOT_TARGET=<id> cdpilot go example.com",
        description: "Pin all subsequent commands to one context",
      },
    ],
  },
];

export function getCommandBySlug(slug: string): Command | undefined {
  return commands.find((c) => c.name === slug);
}

export function getCommandsByCategory(categoryId: string): Command[] {
  return commands.filter((c) => c.category === categoryId);
}
