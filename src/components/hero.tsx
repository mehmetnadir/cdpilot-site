"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-24">
      {/* Subtle grid background */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 50%, rgba(34,197,94,0.06) 0%, transparent 60%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative z-10 mx-auto max-w-4xl text-center"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#22c55e]/20 bg-[#22c55e]/5 px-4 py-1.5 text-sm text-[#22c55e]"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[#22c55e] animate-pulse" />
          v0.8.0 on npm
        </motion.div>

        {/* Headline */}
        <h1 className="text-5xl font-bold leading-tight tracking-tight text-white sm:text-6xl lg:text-7xl">
          Browser automation
          <br />
          <span className="text-gradient-green">in 50KB</span>
        </h1>

        {/* Sub-headline */}
        <p className="mx-auto mt-6 max-w-2xl text-lg text-[#a1a1aa] sm:text-xl">
          Zero dependencies. 70+ commands. Smart interactions — no CSS selectors, no LLM needed.
          <br className="hidden sm:block" />
          Built-in MCP server for AI agents. 500x fewer tokens than screenshots.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="#pricing"
            className="group flex items-center gap-2 rounded-full bg-[#22c55e] px-8 py-3.5 text-base font-semibold text-[#0a0a0a] transition-all hover:bg-[#16a34a] hover:shadow-lg hover:shadow-green-500/25"
          >
            Get Started — Free
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="https://github.com/mehmetnadir/cdpilot"
            className="flex items-center gap-2 rounded-full border border-[#27272a] px-8 py-3.5 text-base font-medium text-white transition-all hover:border-[#3f3f46] hover:bg-white/5"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
            View on GitHub
          </Link>
        </div>

        {/* Trust badges */}
        <p className="mt-12 text-xs tracking-wide text-[#52525b] uppercase">
          Works with Claude Code &middot; Cursor &middot; Windsurf &middot; Any
          MCP client
        </p>
      </motion.div>
    </section>
  );
}
