"use client";

import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

interface ProgressBarProps {
  label: string;
  value: number;
  variant?: "cyan" | "amber" | "red" | "green" | "muted";
  deferred?: boolean;
}

const toneMap = {
  cyan: "bg-[#111111]",
  amber: "bg-[#d4a017]",
  red: "bg-[#dc2626]",
  green: "bg-[#16a34a]",
  muted: "bg-[#d6d6d6]"
};

export function ProgressBar({
  label,
  value,
  variant = "cyan",
  deferred = false
}: ProgressBarProps) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="font-sans text-[13px] text-[#333333]">{label}</span>
        {deferred ? (
          <span className="font-mono text-[10px] uppercase tracking-widest text-[#999999]">Deferred</span>
        ) : (
          <span className="font-mono text-[10px] uppercase tracking-widest text-[#999999]">{value}%</span>
        )}
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-[#eeeeee]">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className={cn("h-full rounded-full", toneMap[variant])}
        />
      </div>
    </div>
  );
}
