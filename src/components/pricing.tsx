"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import Link from "next/link";

interface PricingTier {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  ctaHref: string;
  highlight?: boolean;
  badge?: string;
  disabled?: boolean;
}

const tiers: PricingTier[] = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Everything you need to get started with browser automation.",
    features: [
      "Forever free — no limits, no signup",
      "60+ CLI commands",
      "10 built-in test assertions",
      "Built-in MCP server (Claude Code, Cursor)",
      "a11y-snapshot (500x fewer tokens)",
      "Token-efficient screenshots (element crop, JPEG)",
      "Multi-project browser isolation",
      "Visual feedback (green glow, cursor, ripples)",
      "Pre-flight wizard (auto-setup)",
      "Unlimited usage",
      "Community support",
    ],
    cta: "Get Started",
    ctaHref: "https://www.npmjs.com/package/cdpilot",
  },
  {
    name: "Pro",
    price: "$9",
    period: "/mo",
    description: "Advanced features for power users and teams.",
    features: [
      "Everything in Free",
      "Stealth Mode (human-like mouse movement, typing randomization)",
      "Anti-fingerprint (proxy rotation, UA rotation, canvas noise)",
      "CAPTCHA solving (2Captcha/hCaptcha integration)",
      "Parallel orchestration (10+ concurrent sessions)",
      "Workflow recorder & replay",
      "Priority support",
      "Early access to new features",
    ],
    cta: "Coming Soon",
    ctaHref: "#",
    highlight: true,
    badge: "Most Popular",
    disabled: true,
  },
  {
    name: "Cloud",
    price: "$20",
    period: "/mo",
    description: "Hosted browser sessions with API access for CI/CD.",
    features: [
      "Everything in Pro",
      "Hosted browser sessions (no local install)",
      "MCP WebSocket endpoint (wss://api.cdpilot.ndr.ist/mcp)",
      "REST API access",
      "Usage dashboard & analytics",
      "Auto-scaling",
      "99.9% uptime SLA",
    ],
    cta: "Coming Soon",
    ctaHref: "#",
    disabled: true,
  },
];

export function Pricing() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="pricing" ref={ref} className="relative py-24 px-6">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Simple, <span className="text-gradient-green">transparent</span>{" "}
            pricing
          </h2>
          <p className="mt-4 text-[#a1a1aa]">
            Start free, upgrade when you need more.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className={`relative flex flex-col rounded-2xl border p-8 ${
                tier.highlight
                  ? "border-[#22c55e]/40 bg-[#22c55e]/5 glow-green"
                  : "border-[#27272a] bg-[#141414]/50"
              }`}
            >
              {/* Badge */}
              {tier.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 rounded-full bg-[#22c55e] px-3 py-1 text-xs font-semibold text-[#0a0a0a]">
                  <Sparkles className="h-3 w-3" />
                  {tier.badge}
                </span>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white">
                  {tier.name}
                </h3>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-white">
                    {tier.price}
                  </span>
                  <span className="text-sm text-[#a1a1aa]">{tier.period}</span>
                </div>
                <p className="mt-3 text-sm text-[#a1a1aa]">
                  {tier.description}
                </p>
              </div>

              <ul className="mb-8 flex-1 space-y-3">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#22c55e]" />
                    <span className="text-sm text-[#d4d4d8]">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={tier.ctaHref}
                className={`block rounded-full py-3 text-center text-sm font-semibold transition-all ${
                  tier.highlight
                    ? "bg-[#22c55e] text-[#0a0a0a] hover:bg-[#16a34a]"
                    : tier.disabled
                    ? "border border-[#27272a] text-[#52525b] cursor-not-allowed"
                    : "border border-[#27272a] text-white hover:border-[#3f3f46] hover:bg-white/5"
                } ${tier.disabled && !tier.highlight ? "pointer-events-none" : ""}`}
              >
                {tier.cta}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
