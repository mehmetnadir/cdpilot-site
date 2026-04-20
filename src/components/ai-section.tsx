"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Bot, Zap, Shield, Terminal } from "lucide-react";

const bullets = [
  {
    icon: <Terminal className="h-4 w-4" />,
    text: "One-line MCP setup — no config files, no API keys",
  },
  {
    icon: <Bot className="h-4 w-4" />,
    text: "a11y-snapshot gives your AI a semantic view of any page",
  },
  {
    icon: <Zap className="h-4 w-4" />,
    text: "click-ref lets AI click elements by @N reference",
  },
  {
    icon: <Shield className="h-4 w-4" />,
    text: "Isolated browser sessions — no access to your personal data",
  },
];

const mcpConfig = `{
  "mcpServers": {
    "cdpilot": {
      "command": "npx",
      "args": ["cdpilot", "mcp"]
    }
  }
}`;

export function AiSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="relative py-24 px-6">
      <div className="mx-auto max-w-6xl">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left — text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Give your AI agent
              <br />
              <span className="text-gradient-green">browser superpowers</span>
            </h2>
            <p className="mt-4 text-[#a1a1aa]">
              Add one block to your MCP config and your AI can browse, click,
              fill forms, take screenshots, and extract structured data.
            </p>

            <ul className="mt-8 space-y-4">
              {bullets.map((b, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.1 + i * 0.08, duration: 0.4 }}
                  className="flex items-start gap-3"
                >
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#22c55e]/10 text-[#22c55e]">
                    {b.icon}
                  </span>
                  <span className="text-sm text-[#d4d4d8]">{b.text}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Right — code block */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="relative"
          >
            <div className="overflow-hidden rounded-xl border border-[#27272a] bg-[#0a0a0a]">
              {/* Title bar */}
              <div className="flex items-center gap-2 border-b border-[#27272a] bg-[#141414] px-4 py-3">
                <span className="h-3 w-3 rounded-full bg-[#ef4444]" />
                <span className="h-3 w-3 rounded-full bg-[#f59e0b]" />
                <span className="h-3 w-3 rounded-full bg-[#22c55e]" />
                <span className="ml-3 font-mono text-xs text-[#52525b]">
                  mcp-config.json
                </span>
              </div>

              <pre className="overflow-x-auto p-5 font-mono text-sm leading-relaxed">
                <code>
                  {mcpConfig.split("\n").map((line, i) => (
                    <div key={i}>
                      {line.includes('"mcpServers"') ||
                      line.includes('"cdpilot"') ||
                      line.includes('"command"') ||
                      line.includes('"args"') ? (
                        <>
                          <span className="text-[#a1a1aa]">
                            {line.split(":")[0]}
                          </span>
                          <span className="text-[#52525b]">:</span>
                          <span className="text-[#22c55e]">
                            {line.includes(":") ? line.split(":").slice(1).join(":") : ""}
                          </span>
                        </>
                      ) : (
                        <span className="text-[#52525b]">{line}</span>
                      )}
                    </div>
                  ))}
                </code>
              </pre>
            </div>

            {/* Glow effect */}
            <div className="pointer-events-none absolute -inset-4 -z-10 rounded-2xl bg-[#22c55e]/5 blur-2xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
