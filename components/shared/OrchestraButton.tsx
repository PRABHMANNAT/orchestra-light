"use client";

import { motion } from "framer-motion";
import { type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface OrchestraButtonProps {
  variant: "primary" | "ghost" | "danger";
  icon?: LucideIcon;
  children: string;
  onClick?: () => void;
  fullWidth?: boolean;
  size?: "sm" | "md";
  disabled?: boolean;
  className?: string;
}

export function OrchestraButton({
  variant,
  icon: Icon,
  children,
  onClick,
  fullWidth,
  size = "md",
  disabled = false,
  className
}: OrchestraButtonProps) {
  const sizeClass = size === "sm" ? "h-9 px-3.5 text-[12px]" : "h-10 px-4.5 text-[13px]";
  const variantClass =
    variant === "primary"
      ? "border-[#111111] bg-[#111111] text-white hover:bg-[#222222]"
      : variant === "ghost"
        ? "border-[#e0e0e0] bg-white/80 text-[#111111] hover:border-[#cfcfcf] hover:bg-white"
        : "border-[rgba(248,113,113,0.35)] bg-[rgba(248,113,113,0.08)] text-[#b91c1c] hover:bg-[rgba(248,113,113,0.12)]";

  return (
    <motion.button
      type="button"
      whileHover={disabled ? undefined : { scale: 1.02 }}
      whileTap={disabled ? undefined : { scale: 0.97 }}
      onClick={disabled ? undefined : onClick}
      className={cn(
        "inline-flex items-center justify-center rounded-xl border font-sans font-medium transition-colors duration-200",
        sizeClass,
        variantClass,
        fullWidth ? "w-full" : "",
        disabled ? "cursor-not-allowed opacity-40" : "",
        className
      )}
    >
      {Icon ? <Icon size={13} strokeWidth={1.5} className="mr-2" /> : null}
      <span>{children}</span>
    </motion.button>
  );
}
