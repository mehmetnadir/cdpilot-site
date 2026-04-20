import Link from "next/link";

const footerLinks = {
  Product: [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "Changelog", href: "https://github.com/mehmetnadir/cdpilot/releases" },
  ],
  Resources: [
    { label: "Documentation", href: "/docs" },
    { label: "npm", href: "https://www.npmjs.com/package/cdpilot" },
    { label: "Contributing", href: "https://github.com/mehmetnadir/cdpilot/blob/main/CONTRIBUTING.md" },
  ],
  Legal: [
    { label: "MIT License", href: "https://github.com/mehmetnadir/cdpilot/blob/main/LICENSE" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-[#27272a] bg-[#0a0a0a] px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link href="/" className="font-mono text-xl font-bold text-[#22c55e]">
              cdpilot
            </Link>
            <p className="mt-3 text-sm text-[#a1a1aa]">
              Browser automation in 50KB.
              <br />
              Zero dependencies. Pure CDP.
            </p>
            <div className="mt-5 flex items-center gap-3">
              <Link
                href="https://github.com/mehmetnadir/cdpilot"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#27272a] text-[#a1a1aa] transition-colors hover:border-[#3f3f46] hover:text-white"
                aria-label="GitHub"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
              </Link>
              <Link
                href="https://x.com/cdpilot"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#27272a] text-[#a1a1aa] transition-colors hover:border-[#3f3f46] hover:text-white"
                aria-label="X (Twitter)"
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-semibold text-white">{title}</h4>
              <ul className="mt-4 space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-[#a1a1aa] transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center gap-4 border-t border-[#27272a] pt-8 sm:flex-row sm:justify-between">
          <p className="text-xs text-[#52525b]">
            MIT License &middot; Made with Claude Code
          </p>
          <p className="text-xs text-[#52525b]">
            &copy; {new Date().getFullYear()} cdpilot
          </p>
        </div>
      </div>
    </footer>
  );
}
