"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

import { type TerminalLine } from "@/lib/mockData";
import { cn } from "@/lib/utils";

interface TerminalOutputProps {
  label: string;
  lines: TerminalLine[];
  onComplete?: () => void;
  compact?: boolean;
}

export function TerminalOutput({ label, lines, onComplete, compact = false }: TerminalOutputProps) {
  const [visibleCount, setVisibleCount] = useState(compact ? lines.length : 0);

  useEffect(() => {
    if (compact) {
      onComplete?.();
      return;
    }

    setVisibleCount(0);
    const timers: number[] = [];
    let totalDelay = 0;

    lines.forEach((line, index) => {
      totalDelay += line.delay;
      const timer = window.setTimeout(() => {
        setVisibleCount(index + 1);
        if (index === lines.length - 1) {
          onComplete?.();
        }
      }, totalDelay);
      timers.push(timer);
    });

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [compact, lines, onComplete]);

  const visibleLines = useMemo(() => {
    if (compact) {
      return lines.slice(-1);
    }
    return lines.slice(0, visibleCount);
  }, [compact, lines, visibleCount]);

  return (
    <div className="overflow-hidden rounded-2xl border border-[#e8e8e8] bg-white shadow-sm">
      <div className="flex h-9 items-center gap-2 border-b border-[#f0f0f0] bg-[#fafafa] px-4">
        <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
        <span className="h-2 w-2 rounded-full bg-[#febc2e]" />
        <span className="h-2 w-2 rounded-full bg-[#28c840]" />
        <span className="font-mono text-[10px] uppercase tracking-widest text-[#999999]">{label}</span>
      </div>
      <div className={cn("min-h-[120px] bg-[#fbfbfb] p-4", compact ? "min-h-0" : "")}>
        {visibleLines.map((line, index) => {
          const isLast = index === visibleLines.length - 1;
          return (
            <motion.div
              key={`${line.text}-${index}`}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              className="font-mono text-[11px] leading-6 text-[#166534]"
            >
              <span className="text-[#bbbbbb]">&gt; </span>
              <span>{line.text}</span>
              {isLast && !compact ? <span className="ml-1 animate-terminal-blink text-[#166534]">▋</span> : null}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
