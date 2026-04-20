"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  MousePointerClick,
  Bot,
  Eye,
  FolderOpen,
  Camera,
  Layers,
  Sparkles,
} from "lucide-react";

interface Feature {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const features: Feature[] = [
  {
    number: "01",
    title: "Navigate & Interact",
    description:
      "go, click, fill, type, submit, hover, drag, scroll, and 40+ more commands. Full browser control from your terminal.",
    icon: <MousePointerClick className="h-5 w-5" />,
  },
  {
    number: "02",
    title: "AI Agent Integration",
    description:
      "Built-in MCP server with a11y-snapshot and click-ref. Give your AI agents browser superpowers in one line.",
    icon: <Bot className="h-5 w-5" />,
  },
  {
    number: "03",
    title: "Visual Feedback",
    description:
      "Green glow overlay, cursor visualization, click ripples, and keystroke display. See exactly what's happening.",
    icon: <Eye className="h-5 w-5" />,
  },
  {
    number: "04",
    title: "Multi-Project Isolation",
    description:
      "Each project gets its own browser instance with isolated cookies, storage, and sessions. No cross-contamination.",
    icon: <FolderOpen className="h-5 w-5" />,
  },
  {
    number: "05",
    title: "Annotated Screenshots",
    description:
      "@N badges on interactive elements for AI vision. Your AI agent can see and reference every clickable element.",
    icon: <Camera className="h-5 w-5" />,
  },
  {
    number: "06",
    title: "Batch & Auto-Wait",
    description:
      "Pipe JSON commands for complex workflows. Built-in smart waiting for elements, navigation, and network idle.",
    icon: <Layers className="h-5 w-5" />,
  },
  {
    number: "07",
    title: "Smart Commands",
    description:
      "Click, fill, and select by visible text — like Stagehand's act() but without LLM cost. Fuzzy matching across labels, placeholders, and aria attributes.",
    icon: <Sparkles className="h-5 w-5" />,
  },
];

export function Features() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="features" ref={ref} className="relative py-24 px-6">
      <div className="mx-auto max-w-6xl">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Everything you need for
            <br />
            <span className="text-gradient-green">browser automation</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[#a1a1aa]">
            70+ commands covering navigation, interaction, debugging, network
            control, and AI agent integration.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <motion.div
              key={feature.number}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="group relative rounded-2xl border border-[#27272a] bg-[#141414]/50 p-7 transition-all hover:border-[#22c55e]/30 hover:bg-[#141414]"
            >
              {/* Number badge */}
              <div className="mb-5 flex items-center gap-3">
                <span className="font-mono text-xs font-semibold text-[#22c55e]/60">
                  No.{feature.number}
                </span>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#22c55e]/10 text-[#22c55e]">
                  {feature.icon}
                </div>
              </div>

              <h3 className="text-lg font-semibold text-white">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#a1a1aa]">
                {feature.description}
              </p>

              {/* Subtle hover glow */}
              <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity group-hover:opacity-100"
                style={{
                  background:
                    "radial-gradient(circle at 50% 0%, rgba(34,197,94,0.04) 0%, transparent 70%)",
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
