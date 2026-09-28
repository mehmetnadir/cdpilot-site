// Claim guard for site copy. A number on the site has to be one we measured.
// 2026-09-27: "500x fewer tokens than screenshots" and "50KB" were live for
// months with nothing behind them; the measured ratios are 1.4-42x vs raw
// HTML, and a small screenshot is cheaper on most content-heavy pages.
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { execFileSync } from "node:child_process";

const ROOT = new URL("..", import.meta.url).pathname;

function filesUnder(dir, exts) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...filesUnder(p, exts));
    else if (exts.some((e) => p.endsWith(e))) out.push(p);
  }
  return out;
}

const COPY = [
  ...filesUnder(join(ROOT, "src"), [".tsx", ".ts"]),
  join(ROOT, "public", "llms.txt"),
];

test("no unmeasured token-ratio claim in site copy", () => {
  const hits = [];
  for (const f of COPY) {
    readFileSync(f, "utf8").split("\n").forEach((line, i) => {
      // The one allowed mention links to the retraction and rejects the claim.
      if (/500x/i.test(line) && !/retraction|unmeasured/i.test(line)) {
        hits.push(`${f.replace(ROOT, "")}:${i + 1}`);
      }
    });
  }
  assert.deepEqual(hits, []);
});

test("no install-size claim in site copy", () => {
  const hits = COPY.filter((f) => /\b50\s?KB\b/i.test(readFileSync(f, "utf8")));
  assert.deepEqual(hits.map((f) => f.replace(ROOT, "")), []);
});

test("retracted benchmark post stays marked as retracted", () => {
  const post = readFileSync(
    join(ROOT, "content", "blog", "cdp-vs-playwright-benchmark.md"), "utf8");
  assert.match(post, /^title: "Retracted:/m);
  // The retraction names the withdrawn numbers; the kept original text must not
  // present them again.
  const original = post.split("## Original post")[1] ?? "";
  assert.ok(original.length > 0, "original-post section missing");
  assert.doesNotMatch(original, /91%|\$1\.38|\$0\.012/);
});

test("compare page is in the sitemap", () => {
  const sitemap = readFileSync(join(ROOT, "src", "app", "sitemap.ts"), "utf8");
  assert.match(sitemap, /\/compare`/);
});

// 2026-09-28: iframes shipped in 0.9.3 (issue #1); the "no iframe support"
// limitation must not come back, and the two version spots must agree.
test("site copy does not say iframes are unsupported", () => {
  const hits = COPY.filter((f) => /no iframe (interaction|support)|can't click or type inside an <iframe>/i
    .test(readFileSync(f, "utf8")));
  assert.deepEqual(hits.map((f) => f.replace(ROOT, "")), []);
});

test("hero badge and structured data show the same version", () => {
  const hero = readFileSync(join(ROOT, "src", "components", "hero.tsx"), "utf8");
  const layout = readFileSync(join(ROOT, "src", "app", "layout.tsx"), "utf8");
  const badge = (hero.match(/v(\d+\.\d+\.\d+) on npm/) || [])[1];
  const schema = (layout.match(/softwareVersion: "(\d+\.\d+\.\d+)"/) || [])[1];
  assert.ok(badge && schema, "version spots not found");
  assert.equal(badge, schema);
});

// 2026-09-28: guard against commands.ts describing CLI syntax the cdpilot
// README never shipped (PR #33 added the same guard for the plugin skill —
// "invents no commands beyond the README's" — this is the site-docs version).
// Reads the cdpilot repo's README off origin/main (via `git show`), not the
// sibling checkout's working tree, which can be on an older commit than
// origin/main (verified 2026-09-28: the local checkout was missing the
// bot-auth/WebMCP sections that are already merged on origin/main).
// A handful of pre-existing commands predate this guard and aren't spelled
// out as "cdpilot <name>" (or backticked) anywhere in the root README today
// -- they're allowlisted by name so a genuinely NEW undocumented command
// still fails loud instead of hiding behind them.
const PREDATES_README_GUARD = new Set([
  "glow", "download", "ext-remove", "wait", "click-ref", "batch", "shot-annotated",
]);

function readCdpilotReadmeFromOriginMain() {
  const repo = process.env.CDPILOT_REPO_PATH || "/Users/nadir/01dev/cdpilot";
  if (!existsSync(join(repo, ".git"))) return null;
  try {
    return execFileSync("git", ["-C", repo, "show", "origin/main:README.md"], {
      encoding: "utf8",
    });
  } catch {
    return null; // no such repo/remote/ref in this environment (e.g. CI)
  }
}

test("commands.ts entries outside 0.9.4-pending markers are documented in the cdpilot README", () => {
  const readme = readCdpilotReadmeFromOriginMain();
  if (!readme) {
    // No sibling cdpilot checkout (with an origin/main ref) in this
    // environment -- nothing to diff against, so there is nothing this test
    // can safely assert.
    return;
  }

  const commandsSrc = readFileSync(join(ROOT, "src", "data", "commands.ts"), "utf8");
  // Marker-text based (not tied to `//` vs `/* */`) so it matches a pending
  // block regardless of whether it's also commented out to stay inert on the
  // live site (see compare/page.tsx for the same convention).
  const withoutPending = commandsSrc.replace(
    /<!-- 0\.9\.4-pending -->[\s\S]*?<!-- \/0\.9\.4-pending -->/g,
    ""
  );

  // A Command entry looks like `name: "x",\n    category: "y"`; this excludes
  // Category objects (no `category` field) and CommandArg objects (`required`
  // follows `name`, not `category`).
  const names = [...withoutPending.matchAll(/name:\s*"([^"]+)",\s*\n\s*category:\s*"/g)].map(
    (m) => m[1]
  );
  assert.ok(names.length > 70, "sanity: command extraction found too few entries -- regex broke?");

  const missing = names.filter(
    (n) =>
      !PREDATES_README_GUARD.has(n) &&
      !readme.includes(`cdpilot ${n}`) &&
      !readme.includes(`\`${n}\``) &&
      !readme.includes(`\`${n} `)
  );
  assert.deepEqual(missing, []);
});
