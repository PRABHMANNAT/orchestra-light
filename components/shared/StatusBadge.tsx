import { cn } from "@/lib/utils";

type StatusBadgeVariant =
  | "p0"
  | "p1"
  | "p2"
  | "p3"
  | "todo"
  | "in-progress"
  | "in-review"
  | "done"
  | "blocked"
  | "info"
  | "deferred"
  | "new"
  | "revised"
  | "stale";

const variantMap: Record<StatusBadgeVariant, string> = {
  p0: "bg-[var(--rose-dim)] border-[var(--rose-border)] text-[var(--rose)]",
  p1: "bg-[var(--amber-dim)] border-[var(--amber-border)] text-[var(--amber)]",
  p2: "bg-[rgba(251,191,36,0.04)] border-[rgba(251,191,36,0.12)] text-[rgba(251,191,36,0.75)]",
  p3: "bg-[var(--violet-dim)] border-[var(--violet-border)] text-[var(--violet)]",
  todo: "bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.08)] text-[var(--text-muted)]",
  "in-progress": "bg-[var(--cyan-dim)] border-[var(--cyan-border)] text-[var(--cyan)]",
  "in-review": "bg-[var(--amber-dim)] border-[var(--amber-border)] text-[var(--amber)]",
  done: "bg-[var(--emerald-dim)] border-[var(--emerald-border)] text-[var(--emerald)]",
  blocked: "bg-[var(--rose-dim)] border-[var(--rose-border)] text-[var(--rose)]",
  info: "bg-[var(--blue-dim)] border-[var(--blue-border)] text-[var(--blue)]",
  deferred: "bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.08)] text-[rgba(100,100,120,1)]",
  new: "bg-[var(--cyan-dim)] border-[var(--cyan-border)] text-[var(--cyan)]",
  revised: "bg-[var(--violet-dim)] border-[var(--violet-border)] text-[var(--violet)]",
  stale: "bg-[rgba(255,255,255,0.02)] border-[rgba(255,255,255,0.06)] text-[var(--text-muted)] line-through"
};

export function StatusBadge({
  variant,
  children
}: {
  variant: StatusBadgeVariant;
  children?: React.ReactNode;
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
                    : variant === "info"
                      ? "INFO"
                    : variant === "deferred"
                      ? "DEFERRED"
                      : variant === "new"
                        ? "NEW"
                        : variant === "revised"
                          ? "REVISED"
                          : variant === "stale"
                            ? "STALE"
                          : "TODO");

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[3px] border px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.12em]",
        variantMap[variant]
      )}
    >
      {label}
    </span>
  );
}
