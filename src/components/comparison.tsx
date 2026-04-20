"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Check, X, Minus } from "lucide-react";

interface Tool {
  name: string;
  highlight?: boolean;
  installSize: string;
  deps: string;
  setupTime: string;
  cliBased: boolean | "partial";
  mcpServer: boolean;
  aiReady: boolean | "partial";
}

const tools: Tool[] = [
  {
    name: "cdpilot",
    highlight: true,
    installSize: "50KB",
    deps: "0",
    setupTime: "Instant",
    cliBased: true,
    mcpServer: true,
    aiReady: true,
  },
  {
    name: "Playwright",
    installSize: "~300MB",
    deps: "200+",
    setupTime: "Minutes",
    cliBased: "partial",
    mcpServer: false,
    aiReady: "partial",
  },
  {
    name: "Puppeteer",
    installSize: "~400MB",
    deps: "80+",
    setupTime: "Minutes",
    cliBased: false,
    mcpServer: false,
    aiReady: false,
  },
  {
    name: "Browser Use",
    installSize: "~150MB",
    deps: "40+",
    setupTime: "Minutes",
    cliBased: false,
    mcpServer: false,
    aiReady: true,
  },
];

interface CostCard {
  title: string;
  tokens: string;
  cost: string;
  llmCalls: string;
  time: string;
  description: string;
  isCdpilot: boolean;
}

const costCards: CostCard[] = [
  {
    title: "Computer Use",
    tokens: "250,000 tokens",
    cost: "~$0.75/task",
    llmCalls: "8+ LLM calls",
    time: "~30 seconds",
    description: "Screenshot-based pixel analysis",
    isCdpilot: false,
  },
  {
    title: "Playwright MCP",
    tokens: "114,000 tokens",
    cost: "~$0.34/task",
    llmCalls: "4+ LLM calls",
    time: "~15 seconds",
    description: "DOM dump CSS selectors",
    isCdpilot: false,
  },
  {
    title: "cdpilot",
    tokens: "500 tokens",
    cost: "~$0.0015/task",
    llmCalls: "2 LLM calls",
    time: "~3 seconds",
    description: "Structured a11y @ref navigation",
    isCdpilot: true,
  },
];

function CellIcon({ value }: { value: boolean | "partial" }) {
  if (value === true)
    return <Check className="h-4 w-4 text-[#22c55e]" />;
  if (value === "partial")
    return <Minus className="h-4 w-4 text-yellow-500" />;
  return <X className="h-4 w-4 text-[#52525b]" />;
}

export function Comparison() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const costRef = useRef<HTMLDivElement>(null);
  const costInView = useInView(costRef, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="relative py-24 px-6">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            How cdpilot <span className="text-gradient-green">compares</span>
          </h2>
          <p className="mt-4 text-[#a1a1aa]">
            Lightweight by design. Powerful by default.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="mt-12 overflow-x-auto"
        >
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#27272a] text-left">
                <th className="py-4 pr-6 font-medium text-[#a1a1aa]">Tool</th>
                <th className="py-4 px-4 font-medium text-[#a1a1aa]">Install Size</th>
                <th className="py-4 px-4 font-medium text-[#a1a1aa]">Dependencies</th>
                <th className="py-4 px-4 font-medium text-[#a1a1aa]">Setup</th>
                <th className="py-4 px-4 font-medium text-[#a1a1aa] text-center">CLI-First</th>
                <th className="py-4 px-4 font-medium text-[#a1a1aa] text-center">MCP Server</th>
                <th className="py-4 pl-4 font-medium text-[#a1a1aa] text-center">AI-Ready</th>
              </tr>
            </thead>
            <tbody>
              {tools.map((tool) => (
                <tr
                  key={tool.name}
                  className={`border-b border-[#27272a]/50 ${
                    tool.highlight
                      ? "bg-[#22c55e]/5"
                      : ""
                  }`}
                >
                  <td className="py-4 pr-6">
                    <span
                      className={`font-medium ${
                        tool.highlight ? "text-[#22c55e]" : "text-white"
                      }`}
                    >
                      {tool.name}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-white">{tool.installSize}</td>
                  <td className="py-4 px-4 text-white">{tool.deps}</td>
                  <td className="py-4 px-4 text-white">{tool.setupTime}</td>
                  <td className="py-4 px-4 text-center">
                    <span className="inline-flex justify-center">
                      <CellIcon value={tool.cliBased} />
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="inline-flex justify-center">
                      <CellIcon value={tool.mcpServer} />
                    </span>
                  </td>
                  <td className="py-4 pl-4 text-center">
                    <span className="inline-flex justify-center">
                      <CellIcon value={tool.aiReady} />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {/* Token Cost Section */}
        <div ref={costRef} className="mt-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={costInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              The real cost of{" "}
              <span className="text-gradient-green">browser automation</span>
            </h2>
            <p className="mt-4 text-[#a1a1aa]">
              Same task: Search Google, click first result
            </p>
          </motion.div>

          <div className="mt-12 flex flex-col gap-6 sm:flex-row">
            {costCards.map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                animate={costInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.12, duration: 0.5 }}
                className={`relative flex-1 rounded-2xl border p-6 ${
                  card.isCdpilot
                    ? "border-[#22c55e]/40 bg-[#22c55e]/5"
                    : "border-[#27272a] bg-[#141414]/50"
                }`}
                style={
                  card.isCdpilot
                    ? { boxShadow: "0 0 24px rgba(34,197,94,0.18)" }
                    : {}
                }
              >
                {card.isCdpilot && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center rounded-full bg-[#22c55e] px-3 py-1 text-xs font-semibold text-[#0a0a0a]">
                    500x cheaper
                  </span>
                )}
                <h3
                  className={`text-lg font-semibold ${
                    card.isCdpilot ? "text-[#22c55e]" : "text-white"
                  }`}
                >
                  {card.title}
                </h3>

                <div className="mt-5 space-y-3">
                  <div>
                    <p className="text-2xl font-bold text-white">{card.tokens}</p>
                    <p className="mt-0.5 text-sm text-[#a1a1aa]">{card.cost}</p>
                  </div>
                  <div className="h-px bg-[#27272a]" />
                  <ul className="space-y-2 text-sm text-[#d4d4d8]">
                    <li>{card.llmCalls}</li>
                    <li>{card.time}</li>
                    <li className="text-[#a1a1aa]">{card.description}</li>
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={costInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-12 text-center text-2xl font-bold text-white sm:text-3xl"
          >
            500x fewer tokens.{" "}
            <span className="text-gradient-green">Same result.</span>
          </motion.p>
        </div>
      </div>
    </section>
  );
}
