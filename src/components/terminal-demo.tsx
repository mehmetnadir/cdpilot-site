"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

interface Line {
  type: "command" | "output";
  text: string;
}

const lines: Line[] = [
  { type: "command", text: "npx cdpilot launch" },
  { type: "output", text: "CDP ready! (port 9222)" },
  { type: "command", text: 'cdpilot go "https://example.com"' },
  { type: "output", text: "Example Domain" },
  { type: "command", text: "cdpilot a11y-snapshot" },
  { type: "output", text: '@1 [heading/1] "Example Domain"' },
  { type: "output", text: '@2 [link] "Learn more"' },
  { type: "command", text: "cdpilot click-ref @2" },
  { type: "output", text: "Clicked @2 (281, 196)" },
];

export function TerminalDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [currentText, setCurrentText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!isInView) return;

    let cancelled = false;

    async function animate() {
      for (let i = 0; i < lines.length; i++) {
        if (cancelled) return;

        const line = lines[i];

        if (line.type === "command") {
          setIsTyping(true);
          // Type character by character
          for (let c = 0; c <= line.text.length; c++) {
            if (cancelled) return;
            setCurrentText(line.text.slice(0, c));
            await new Promise((r) => setTimeout(r, 30 + Math.random() * 20));
          }
          setIsTyping(false);
          await new Promise((r) => setTimeout(r, 200));
        }

        setVisibleLines(i + 1);
        setCurrentText("");
        await new Promise((r) => setTimeout(r, line.type === "output" ? 150 : 400));
      }
    }

    const timeout = setTimeout(animate, 500);
    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [isInView]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="mx-auto mt-16 w-full max-w-2xl"
    >
      <div className="overflow-hidden rounded-xl border border-[#27272a] bg-[#0a0a0a] shadow-2xl shadow-green-500/5">
        {/* Title bar */}
        <div className="flex items-center gap-2 border-b border-[#27272a] bg-[#141414] px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-[#ef4444]" />
          <span className="h-3 w-3 rounded-full bg-[#f59e0b]" />
          <span className="h-3 w-3 rounded-full bg-[#22c55e]" />
          <span className="ml-3 text-xs text-[#52525b] font-mono">
            cdpilot
          </span>
        </div>

        {/* Terminal body */}
        <div className="p-5 font-mono text-sm leading-relaxed min-h-[280px]">
          {lines.slice(0, visibleLines).map((line, i) => (
            <div key={i} className="flex">
              {line.type === "command" ? (
                <>
                  <span className="mr-2 text-[#22c55e] select-none">$</span>
                  <span className="text-white">{line.text}</span>
                </>
              ) : (
                <span className="text-[#a1a1aa] pl-4">{line.text}</span>
              )}
            </div>
          ))}

          {/* Currently typing line */}
          {(isTyping || currentText) && (
            <div className="flex">
              <span className="mr-2 text-[#22c55e] select-none">$</span>
              <span className="text-white">{currentText}</span>
              <span className="ml-0.5 inline-block h-4 w-1.5 animate-pulse bg-[#22c55e]" />
            </div>
          )}

          {/* Cursor after all done */}
          {visibleLines === lines.length && !isTyping && !currentText && (
            <div className="flex">
              <span className="mr-2 text-[#22c55e] select-none">$</span>
              <span className="ml-0.5 inline-block h-4 w-1.5 animate-pulse bg-[#22c55e]" />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
