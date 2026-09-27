"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Check, X, Minus } from "lucide-react";
import Link from "next/link";

interface Tool {
  name: string;
  highlight?: boolean;
  installSize: string;
  deps: string;
  setupTime: string;
  cliBased: boolean | "partial";
  mcpServer: boolean | "partial";
  aiReady: boolean | "partial";
}

const tools: Tool[] = [
  {
    name: "cdpilot",
    highlight: true,
    installSize: "1 file, no node_modules",
    deps: "0 npm",
    setupTime: "Instant",
    cliBased: true,
    mcpServer: true,
    aiReady: true,
  },
  {
    name: "Playwright",
    installSize: "200MB+ (w/ browsers)",
    deps: "30+",
    setupTime: "Minutes",
    cliBased: "partial",
    mcpServer: "partial",
    aiReady: "partial",
  },
  {
    name: "Puppeteer",
    installSize: "400MB+ (w/ Chromium)",
    deps: "50+",
    setupTime: "Minutes",
    cliBased: false,
    mcpServer: false,
    aiReady: false,
  },
  {
    name: "Selenium",
    installSize: "100MB+ (+ drivers)",
    deps: "Java + drivers",
    setupTime: "Painful",
    cliBased: false,
    mcpServer: false,
    aiReady: false,
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
          <p className="mt-4 text-xs text-[#52525b]">
            Figures per each tool&apos;s own README/npm registry metadata. Full breakdown with
            sources and a browser-use MCP row on the{" "}
            <Link href="/compare" className="text-[#22c55e] hover:underline">
              compare page
            </Link>
            .
          </p>
        </motion.div>

        {/* Measured token footprint */}
        <div className="mt-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Structured text,{" "}
              <span className="text-gradient-green">no vision model needed</span>
            </h2>
            <p className="mt-4 text-[#a1a1aa]">
              a11y-snapshot returns semantic elements with short @ref handles — the agent
              acts on text, not pixels.
            </p>
          </motion.div>
          <p className="mt-6 text-center text-sm text-[#a1a1aa]">
            Measured on four real pages (Hacker News, Wikipedia, GitHub, saucedemo):
            a11y-snapshot ran 1.4-42x smaller than raw HTML on the same page. Against a
            small screenshot it was cheaper only on the form-heavy page — on
            link/content-dense pages the screenshot was smaller. Full numbers and
            methodology in our{" "}
            <Link
              href="/blog/cdp-vs-playwright-benchmark"
              className="text-[#22c55e] hover:underline"
            >
              retraction of an earlier, unmeasured &ldquo;500x&rdquo; claim
            </Link>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
