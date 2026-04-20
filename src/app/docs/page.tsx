"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Settings,
  Compass,
  MousePointer,
  Search,
  Layers,
  Globe,
  Smartphone,
  Bot,
  Shield,
  Zap,
  ChevronLeft,
  Menu,
  X,
} from "lucide-react";
import { categories, commands, getCommandsByCategory } from "@/data/commands";

const iconMap: Record<string, React.ReactNode> = {
  gear: <Settings className="h-4 w-4" />,
  compass: <Compass className="h-4 w-4" />,
  pointer: <MousePointer className="h-4 w-4" />,
  search: <Search className="h-4 w-4" />,
  layers: <Layers className="h-4 w-4" />,
  globe: <Globe className="h-4 w-4" />,
  smartphone: <Smartphone className="h-4 w-4" />,
  bot: <Bot className="h-4 w-4" />,
  shield: <Shield className="h-4 w-4" />,
  zap: <Zap className="h-4 w-4" />,
};

export default function DocsPage() {
  const [query, setQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const filtered = query.trim()
    ? commands.filter(
        (c) =>
          c.name.toLowerCase().includes(query.toLowerCase()) ||
          c.description.toLowerCase().includes(query.toLowerCase())
      )
    : null;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#fafafa]">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-[#27272a] bg-[#0a0a0a]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-[#a1a1aa] hover:text-white lg:hidden"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>

          <Link
            href="/"
            className="flex items-center gap-2 text-[#a1a1aa] transition-colors hover:text-white"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="font-mono text-sm font-bold text-[#22c55e]">
              cdpilot
            </span>
          </Link>

          <div className="mx-4 hidden h-5 w-px bg-[#27272a] sm:block" />

          <h1 className="hidden text-sm font-medium text-[#a1a1aa] sm:block">
            Documentation
          </h1>

          <div className="ml-auto w-full max-w-xs">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search commands..."
              className="w-full rounded-lg border border-[#27272a] bg-[#141414] px-3 py-1.5 text-sm text-[#fafafa] placeholder-[#52525b] outline-none transition-colors focus:border-[#22c55e]/50 focus:ring-1 focus:ring-[#22c55e]/30"
            />
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-30 w-64 transform border-r border-[#27272a] bg-[#0a0a0a] pt-14 transition-transform lg:static lg:z-auto lg:w-56 lg:shrink-0 lg:translate-x-0 lg:pt-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <nav className="sticky top-14 space-y-1 overflow-y-auto px-3 py-6">
            {categories.map((cat) => {
              const count = getCommandsByCategory(cat.id).length;
              return (
                <a
                  key={cat.id}
                  href={`#${cat.id}`}
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm text-[#a1a1aa] transition-colors hover:bg-[#1a1a1a] hover:text-white"
                >
                  <span className="text-[#22c55e]">{iconMap[cat.icon]}</span>
                  <span>{cat.name}</span>
                  <span className="ml-auto text-xs text-[#52525b]">
                    {count}
                  </span>
                </a>
              );
            })}
          </nav>
        </aside>

        {/* Backdrop for mobile sidebar */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-20 bg-black/60 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <main className="min-w-0 flex-1 px-4 py-8 sm:px-6 lg:px-10">
          {/* Search results */}
          {filtered ? (
            <section>
              <h2 className="mb-4 text-lg font-semibold text-[#a1a1aa]">
                {filtered.length} result{filtered.length !== 1 ? "s" : ""} for
                &ldquo;{query}&rdquo;
              </h2>
              {filtered.length === 0 ? (
                <p className="text-sm text-[#52525b]">
                  No commands found. Try a different search term.
                </p>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {filtered.map((cmd) => (
                    <CommandCard key={cmd.name} cmd={cmd} />
                  ))}
                </div>
              )}
            </section>
          ) : (
            /* Categories */
            categories.map((cat) => {
              const cmds = getCommandsByCategory(cat.id);
              if (cmds.length === 0) return null;
              return (
                <section key={cat.id} id={cat.id} className="mb-12">
                  <div className="mb-4 flex items-center gap-2.5">
                    <span className="text-[#22c55e]">{iconMap[cat.icon]}</span>
                    <h2 className="text-lg font-semibold">{cat.name}</h2>
                    <span className="text-xs text-[#52525b]">
                      {cmds.length} command{cmds.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {cmds.map((cmd) => (
                      <CommandCard key={cmd.name} cmd={cmd} />
                    ))}
                  </div>
                </section>
              );
            })
          )}
        </main>
      </div>
    </div>
  );
}

function CommandCard({ cmd }: { cmd: (typeof commands)[number] }) {
  return (
    <Link
      href={`/docs/${cmd.name}`}
      className="group flex flex-col rounded-lg border border-[#27272a] bg-[#141414] p-4 transition-all hover:border-[#22c55e]/30 hover:bg-[#1a1a1a]"
    >
      <code className="mb-1.5 font-mono text-sm font-bold text-[#22c55e] group-hover:text-[#4ade80]">
        {cmd.name}
      </code>
      <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-[#a1a1aa]">
        {cmd.description}
      </p>
      <div className="mt-auto rounded bg-[#0a0a0a] px-2.5 py-1.5">
        <code className="text-[11px] text-[#52525b]">{cmd.usage}</code>
      </div>
    </Link>
  );
}
