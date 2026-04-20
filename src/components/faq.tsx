"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What browsers does cdpilot support?",
    answer:
      "cdpilot works with any Chromium-based browser — Brave, Chrome, Chromium, Edge, and others. It auto-detects installed browsers with Brave as the default preference.",
  },
  {
    question: "How is this different from Playwright or Puppeteer?",
    answer:
      "cdpilot is a CLI-first tool with zero dependencies (50KB vs 300MB+). It talks directly to Chrome DevTools Protocol over HTTP/WebSocket using Python's standard library. No Node.js runtime needed for the core, no browser downloads, and it includes a built-in MCP server for AI agents.",
  },
  {
    question: "Does it work with Claude Code?",
    answer:
      "Yes! cdpilot includes a built-in MCP server. Add it to your Claude Code config and your AI agent can browse the web, take annotated screenshots, click elements by reference, fill forms, and extract data — all through natural language.",
  },
  {
    question: "Is it really zero dependencies?",
    answer:
      "Yes. The Python core uses only the standard library (urllib, asyncio, json). The Node.js entry point is a thin wrapper that finds Python and spawns the process. No pip install, no node_modules bloat.",
  },
  {
    question: "Can I use it for web scraping?",
    answer:
      "Absolutely. cdpilot provides content extraction (text, HTML, structured data), request interception, cookie management, and session isolation. Commands like 'content', 'html', 'eval', and 'network' give you full control over data extraction.",
  },
  {
    question: "Is it free?",
    answer:
      "The core CLI with all 40+ commands and the MCP server is completely free and open source (MIT license). We plan to offer Pro and Cloud tiers with advanced features like stealth mode, parallel orchestration, and hosted sessions.",
  },
  {
    question: "What's the MCP server?",
    answer:
      "MCP (Model Context Protocol) is a standard for connecting AI models to external tools. cdpilot's MCP server lets AI agents like Claude browse the web autonomously — navigating pages, reading content via accessibility snapshots, clicking elements, and taking screenshots.",
  },
  {
    question: "Does it work on Windows and Linux?",
    answer:
      "Yes. cdpilot supports macOS, Windows, and Linux. The browser detection automatically finds Chrome/Brave/Chromium installations on each platform. Python 3 is the only requirement.",
  },
];

export function Faq() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="relative py-24 px-6">
      <div className="mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Frequently asked{" "}
            <span className="text-gradient-green">questions</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="mt-12"
        >
          <Accordion defaultValue={[]} className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="rounded-xl border border-[#27272a] bg-[#141414]/50 px-6 data-[state=open]:border-[#22c55e]/30"
              >
                <AccordionTrigger className="text-left text-sm font-medium text-white hover:text-[#22c55e] hover:no-underline py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-[#a1a1aa] pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
