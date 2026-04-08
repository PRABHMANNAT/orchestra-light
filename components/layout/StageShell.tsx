"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

export function StageShell({
  children,
  className,
  showGrid = false
}: {
  children: React.ReactNode;
  className?: string;
  showGrid?: boolean;
}) {
  const pathname = usePathname();

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={cn("page-surface relative h-full min-h-0 overflow-y-auto px-8 py-8", className)}
    >
      {showGrid ? <div className="page-grid" /> : null}
      <div className={cn("min-h-0", showGrid ? "relative z-10" : "relative z-10")}>{children}</div>
    </motion.div>
  );
}
