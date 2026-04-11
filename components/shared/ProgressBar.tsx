"use client";

import { motion } from "framer-motion";

import { EASE_OUT_EXPO } from "@/lib/animations";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  label: string;
  value: number;
  variant?: "cyan" | "amber" | "red" | "green" | "muted";
  deferred?: boolean;
}

const toneMap = {
  cyan: "bg-[linear-gradient(90deg,#00e5cc,rgba(0,229,204,0.65))]",
  amber: "bg-[linear-gradient(90deg,rgba(253,186,116,1),rgba(245,158,11,0.65))]",
  red: "bg-[linear-gradient(90deg,rgba(252,165,165,1),rgba(239,68,68,0.65))]",
  green: "bg-[linear-gradient(90deg,rgba(134,239,172,1),rgba(34,197,94,0.65))]",
  muted: "bg-[rgba(255,255,255,0.1)]"
} as const;

export function ProgressBar({
  label,
  value,
  variant = "cyan",
  deferred = false
}: ProgressBarProps) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="font-ui text-[13px] text-[var(--text-secondary)]">{label}</span>
        {deferred ? (
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--text-muted)]">Deferred</span>
        ) : (
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--text-muted)]">{value}%</span>
        )}
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-[var(--surface-track)]">
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: value / 100 }}
          transition={{ duration: 1, ease: EASE_OUT_EXPO }}
          style={{ transformOrigin: "left" }}
          className={cn("h-full rounded-full", toneMap[variant])}
        />
      </div>
    </div>
  );
}
