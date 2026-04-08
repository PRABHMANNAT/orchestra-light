"use client";

import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

type StatusBadgeVariant =
  | "p0"
  | "p1"
  | "p2"
  | "p3"
  | "blocked"
  | "done"
  | "in-progress"
  | "in-review"
  | "todo"
  | "deferred"
  | "new"
  | "revised";

const variantMap: Record<StatusBadgeVariant, string> = {
  p0: "border-[#fecaca] bg-[#fee2e2] text-[#991b1b]",
  p1: "border-[#fef08a] bg-[#fef9c3] text-[#854d0e]",
  p2: "border-[#bfdbfe] bg-[#dbeafe] text-[#1e40af]",
  p3: "border-[#bbf7d0] bg-[#f0fdf4] text-[#166534]",
  blocked: "border-[#fecaca] bg-[#fee2e2] text-[#991b1b]",
  done: "border-[#bbf7d0] bg-[#f0fdf4] text-[#166534]",
  "in-progress": "border-[#fef08a] bg-[#fef9c3] text-[#92400e]",
  "in-review": "border-[#bfdbfe] bg-[#dbeafe] text-[#1e40af]",
  todo: "border-[#ebebeb] bg-[#f5f5f5] text-[#888888]",
  deferred: "border-[#ebebeb] bg-[#f5f5f5] text-[#888888]",
  new: "border-[#bbf7d0] bg-[#f0fdf4] text-[#166534]",
  revised: "border-[#bfdbfe] bg-[#dbeafe] text-[#1e40af]"
};

export function StatusBadge({
  variant,
  children
}: {
  variant: StatusBadgeVariant;
  children?: string;
}) {
  const label =
    children ??
    (variant === "p0"
      ? "P0"
      : variant === "p1"
        ? "P1"
        : variant === "p2"
          ? "P2"
          : variant === "p3"
            ? "P3"
          : variant === "in-progress"
            ? "IN PROGRESS"
            : variant === "in-review"
              ? "IN REVIEW"
            : variant === "done"
              ? "DONE"
              : variant === "blocked"
                ? "BLOCKED"
                : variant === "todo"
                  ? "TODO"
                : variant === "new"
                  ? "NEW"
                  : variant === "revised"
                    ? "REVISED"
                    : "DEFERRED");

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.1em]",
        variantMap[variant]
      )}
    >
      {label}
    </span>
  );
}
