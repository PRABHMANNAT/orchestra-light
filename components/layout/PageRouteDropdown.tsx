"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { ChevronDown, ExternalLink, Map } from "lucide-react";

import { getSiteRouteGroups } from "@/lib/routes";
import { cn } from "@/lib/utils";

export function PageRouteDropdown({
  projectId = "bloomfast",
  align = "right",
  compact = false
}: {
  projectId?: string;
  align?: "left" | "right";
  compact?: boolean;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const routeGroups = useMemo(() => getSiteRouteGroups(projectId), [projectId]);

  return (
    <div className="page-route-dropdown relative z-[80]">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className={cn(
          "page-route-trigger inline-flex items-center justify-center gap-2 rounded-md border font-ui font-medium text-[var(--text-secondary)] transition-colors hover:border-[var(--cyan-border)] hover:text-[var(--text-primary)]",
          compact ? "px-2.5 py-2 text-[11px]" : "px-3.5 py-2.5 text-[12px]"
        )}
        aria-expanded={open}
      >
        <Map size={14} strokeWidth={1.6} className="text-[var(--cyan)]" />
        <span>All pages</span>
        <ChevronDown size={13} strokeWidth={1.6} className={cn("transition-transform", open ? "rotate-180" : "")} />
      </button>

      {open ? (
        <>
          <button type="button" aria-label="Close page menu" className="fixed inset-0 z-0 cursor-default" onClick={() => setOpen(false)} />
          <div
            className={cn(
              "page-route-menu glass-heavy absolute top-[calc(100%+8px)] z-10 w-[330px] overflow-hidden rounded-lg border p-2 shadow-2xl",
              align === "right" ? "right-0" : "left-0"
            )}
          >
            {routeGroups.map((group) => (
              <div key={group.label} className="py-1">
                <div className="px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--text-muted)]">{group.label}</div>
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "page-route-link flex items-start gap-3 rounded-md px-2.5 py-2.5 transition-colors",
                          isActive ? "border border-[var(--cyan-border)] bg-[var(--cyan-dim)]" : ""
                        )}
                      >
                        <span className={cn("mt-1 h-1.5 w-1.5 shrink-0 rounded-full", isActive ? "bg-[var(--cyan)]" : "bg-[var(--text-muted)]")} />
                        <span className="min-w-0 flex-1">
                          <span className="flex items-center gap-2 font-ui text-[12px] font-medium text-[var(--text-primary)]">
                            {item.label}
                            {item.href === "/pm" ? <ExternalLink size={11} className="text-[var(--text-muted)]" /> : null}
                          </span>
                          <span className="mt-0.5 block font-ui text-[11px] leading-5 text-[var(--text-secondary)]">{item.description}</span>
                          <span className="mt-1 block truncate font-mono text-[9px] text-[var(--text-muted)]">{item.href}</span>
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
