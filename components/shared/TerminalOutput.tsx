"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

import { terminalLine } from "@/lib/animations";
import { type TerminalLine } from "@/lib/mockData";
import { cn } from "@/lib/utils";

interface TerminalOutputProps {
  label: string;
  lines: TerminalLine[];
  onComplete?: () => void;
  compact?: boolean;
  tone?: "cyan" | "violet" | "blue" | "amber";
}

const toneMap = {
  cyan: "var(--cyan)",
  violet: "var(--violet)",
  blue: "var(--blue)",
  amber: "var(--amber)"
} as const;

export function TerminalOutput({ label, lines, onComplete, compact = false, tone = "cyan" }: TerminalOutputProps) {
  const [visibleCount, setVisibleCount] = useState(compact ? lines.length : 0);
  const activeTone = toneMap[tone];

  useEffect(() => {
    if (compact) {
      onComplete?.();
      return;
    }

    setVisibleCount(0);
    const timers: number[] = [];
    let elapsed = 0;

    lines.forEach((line, index) => {
      elapsed += line.delay;
      const timer = window.setTimeout(() => {
        setVisibleCount(index + 1);
        if (index === lines.length - 1) {
          onComplete?.();
        }
      }, elapsed);

      timers.push(timer);
    });

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [compact, lines, onComplete]);

  const visibleLines = useMemo(() => {
    if (compact) {
      return lines;
    }

    return lines.slice(0, visibleCount);
  }, [compact, lines, visibleCount]);

  return (
    <div className="glass glass-noise overflow-hidden rounded-xl">
      <div className="flex h-10 items-center gap-2 border-b border-[var(--border-subtle)] px-4">
        <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
        <span className="h-2 w-2 rounded-full bg-[#febc2e]" />
        <span className="h-2 w-2 rounded-full bg-[#28c840]" />
        <span className="font-mono text-[10px] uppercase tracking-[0.18em]" style={{ color: activeTone }}>
          {label}
        </span>
      </div>

      <div className={cn("relative min-h-[120px] bg-[rgba(0,0,0,0.28)] p-4", compact ? "min-h-0" : "")}>
        {visibleLines.map((line, index) => {
          const isLast = index === visibleLines.length - 1;

          return (
            <motion.div
              key={`${line.text}-${index}`}
              variants={terminalLine}
              initial="hidden"
              animate="show"
              className="font-mono text-[11px] leading-7"
            >
              <span className="text-[var(--text-muted)]">&gt; </span>
              <span style={{ color: activeTone }}>
                {line.text.split(/(done|✓)/g).map((segment, segmentIndex) => (
                  <span
                    key={`${line.text}-${segmentIndex}`}
                    style={{ color: segment === "done" || segment === "✓" ? "var(--emerald)" : activeTone }}
                  >
                    {segment}
                  </span>
                ))}
              </span>
              {isLast && !compact ? <span className="ml-1 animate-terminal-blink" style={{ color: activeTone }}>▋</span> : null}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
