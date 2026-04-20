"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";

interface Metric {
  value: string;
  numericValue?: number;
  suffix?: string;
  label: string;
}

const metrics: Metric[] = [
  { value: "50KB", numericValue: 50, suffix: "KB", label: "Install size" },
  { value: "40+", numericValue: 40, suffix: "+", label: "CLI commands" },
  { value: "0", numericValue: 0, label: "Dependencies" },
  { value: "MCP", label: "AI agent ready" },
];

function AnimatedCounter({
  target,
  suffix = "",
  isInView,
}: {
  target: number;
  suffix?: string;
  isInView: boolean;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    if (target === 0) {
      setCount(0);
      return;
    }

    let current = 0;
    const step = Math.max(1, Math.floor(target / 30));
    const interval = setInterval(() => {
      current += step;
      if (current >= target) {
        setCount(target);
        clearInterval(interval);
      } else {
        setCount(current);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [isInView, target]);

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
}

export function Metrics() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section ref={ref} className="relative py-20 px-6">
      <div className="mx-auto max-w-5xl">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {metrics.map((metric, i) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="flex flex-col items-center rounded-2xl border border-[#27272a] bg-[#141414]/50 p-8 text-center"
            >
              <span className="text-4xl font-bold text-white sm:text-5xl">
                {metric.numericValue !== undefined ? (
                  <AnimatedCounter
                    target={metric.numericValue}
                    suffix={metric.suffix}
                    isInView={isInView}
                  />
                ) : (
                  <span className="text-gradient-green">{metric.value}</span>
                )}
              </span>
              <span className="mt-2 text-sm text-[#a1a1aa]">
                {metric.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
