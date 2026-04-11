"use client";

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
  return (
    <div className={cn("relative min-h-screen w-full px-0 py-0 text-text-primary", className)}>
      {showGrid ? <div className="page-grid" /> : null}
      <div className="relative z-10 min-h-screen">{children}</div>
    </div>
  );
}
