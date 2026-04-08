import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center border px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.1em]",
  {
    variants: {
      variant: {
        default: "border-border text-text-secondary bg-bg-2",
        cyan: "border-[rgba(0,212,255,0.35)] text-accent-cyan bg-[rgba(0,212,255,0.08)]",
        amber: "border-[rgba(245,158,11,0.35)] text-accent-amber bg-[rgba(245,158,11,0.08)]",
        green: "border-[rgba(16,185,129,0.35)] text-accent-green bg-[rgba(16,185,129,0.08)]",
        red: "border-[rgba(239,68,68,0.35)] text-accent-red bg-[rgba(239,68,68,0.08)]"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };

