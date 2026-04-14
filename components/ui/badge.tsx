import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center border px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.1em]",
  {
    variants: {
      variant: {
        default: "border-border text-text-secondary bg-bg-2",
        cyan: "border-[var(--cyan-border)] text-[var(--cyan)] bg-[var(--cyan-dim)]",
        amber: "border-[var(--amber-border)] text-[var(--amber)] bg-[var(--amber-dim)]",
        green: "border-[var(--emerald-border)] text-[var(--emerald)] bg-[var(--emerald-dim)]",
        red: "border-[var(--rose-border)] text-[var(--rose)] bg-[var(--rose-dim)]"
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
