"use client";

import { useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import {
  Archive,
  Brain,
  CheckSquare,
  ChevronLeft,
  GitBranch,
  LogOut,
  MessageCircle,
  Plus,
  RefreshCw,
  Send,
  Settings,
  Sparkles
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { PageRouteDropdown } from "@/components/layout/PageRouteDropdown";
import { RoleBadge } from "@/components/shared/RoleBadge";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { EASE_EXPO, SPRING_SNAPPY, livePulse, slideInLeft, staggerContainer } from "@/lib/animations";
import { getProjectById, getUnreadCommsCount } from "@/lib/mockData";
import { type MockUser } from "@/lib/roles";
import { getSurfaceRoute, pmSurfaces, type PMProjectSurfaceSlug } from "@/lib/stageConfig";
import { cn } from "@/lib/utils";

type AccentTone = "cyan" | "violet" | "blue" | "amber" | "emerald";

const surfaceTone: Record<PMProjectSurfaceSlug, AccentTone> = {
  brain: "cyan",
  dag: "cyan",
  comms: "blue",
  intel: "violet",
  decisions: "emerald",
  changes: "amber",
  outputs: "cyan",
  memory: "violet"
};

const surfaceIcons = {
  brain: Brain,
  dag: GitBranch,
  comms: MessageCircle,
  intel: Sparkles,
  decisions: CheckSquare,
  changes: RefreshCw,
  outputs: Send,
  memory: Archive
} as const;

function tone(color: AccentTone) {
  return {
    value: `var(--${color})`,
    dim: `var(--${color}-dim)`,
    border: `var(--${color}-border)`
  };
}

export function PMSidebar({ user, projectId }: { user: MockUser; projectId: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const activeRef = useRef<HTMLDivElement | null>(null);
  const project = useMemo(() => getProjectById(projectId), [projectId]);
  const unreadComms = useMemo(() => getUnreadCommsCount(projectId), [projectId]);

  const pathSegments = pathname.split("/").filter(Boolean);
  const routeSection = pathSegments[2] as PMProjectSurfaceSlug | undefined;
  const activeSurface = pmSurfaces.some((surface) => surface.slug === routeSection) ? routeSection : "brain";

  useEffect(() => {
    activeRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [activeSurface]);

  return (
    <motion.aside
      initial={{ x: -280, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: EASE_EXPO }}
      className="glass-sidebar fixed left-0 top-0 z-50 flex h-screen w-[260px] flex-col"
    >
      <div className="px-5 pb-4 pt-5">
        <button
          type="button"
          onClick={() => router.push("/pm/dashboard")}
          className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.12em] text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
        >
          <ChevronLeft size={12} strokeWidth={1.5} />
          all projects
        </button>

        <div className="mt-2 font-display text-[22px] tracking-[0.08em] text-[var(--text-primary)]">ORCHESTRA</div>
        <div className="mt-3">
          <PageRouteDropdown projectId={projectId} align="left" compact />
        </div>
        <div className="font-mono text-[9px] tracking-[0.1em] text-[var(--text-muted)]">project brain · demo</div>
      </div>

      <div className="glass-sm mx-4 mb-3 rounded-xl px-3 py-3">
        <div className="flex items-center gap-3">
          <div className="glass-cyan flex h-8 w-8 items-center justify-center rounded-xl font-mono text-[11px] text-[var(--cyan)]">
            {user.avatar}
          </div>
          <div className="min-w-0">
            <div className="truncate font-ui text-[13px] font-medium text-[var(--text-primary)]">{user.name}</div>
            <div className="mt-1">
              <RoleBadge role={user.role} />
            </div>
          </div>
        </div>
      </div>

      <div className="glass-sm mx-4 mb-4 rounded-xl px-3 py-3">
        <div className="font-mono text-[9px] tracking-[0.12em] text-[var(--cyan)]">BLOOMFAST MVP</div>
        <div className="mt-1 flex items-center gap-2">
          <motion.span
            variants={livePulse}
            initial="hidden"
            animate="show"
            className="h-[5px] w-[5px] rounded-full bg-[var(--cyan)] shadow-[0_0_8px_rgba(0,229,204,0.8)]"
          />
          <span className="font-ui text-[11px] text-[var(--text-secondary)]">{project.client}</span>
        </div>
        <div className="mt-1 font-mono text-[9px] text-[var(--text-muted)]">Last signal · 14 Apr 2026</div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          <span className="rounded-sm border border-[var(--amber-border)] bg-[var(--amber-dim)] px-2 py-1 font-mono text-[8px] tracking-[0.12em] text-[var(--amber)]">
            {unreadComms} UNREVIEWED
          </span>
          <span className="rounded-sm border border-[var(--emerald-border)] bg-[var(--emerald-dim)] px-2 py-1 font-mono text-[8px] tracking-[0.12em] text-[var(--emerald)]">
            BRIEF LOCKED
          </span>
        </div>
      </div>

      <div className="mx-4 my-2 border-t border-[rgba(255,255,255,0.04)]" />

      <nav className="flex-1 overflow-y-auto px-3 py-1">
        <motion.ul variants={staggerContainer(0.04, 0.08)} initial="hidden" animate="show" className="space-y-1">
          {pmSurfaces.map((surface) => {
            const Icon = surfaceIcons[surface.slug];
            const surfaceColor = tone(surfaceTone[surface.slug]);
            const isActive = surface.slug === activeSurface;

            return (
              <motion.li key={surface.slug} variants={slideInLeft} className="relative">
                <motion.button
                  type="button"
                  onClick={() => router.push(getSurfaceRoute(projectId, surface.slug))}
                  whileHover={{ x: 3 }}
                  transition={SPRING_SNAPPY}
                  className="relative w-full rounded-[6px]"
                >
                  {isActive ? (
                    <motion.div
                      ref={activeRef}
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-[6px]"
                      style={{
                        background: surfaceColor.dim,
                        border: `1px solid ${surfaceColor.border}`
                      }}
                    />
                  ) : null}
                  <div className="relative z-10 flex items-center gap-3 px-3 py-2.5 text-left">
                    <Icon
                      size={14}
                      strokeWidth={1.5}
                      style={{ color: isActive ? surfaceColor.value : "var(--text-muted)" }}
                    />
                    <span className="w-5 shrink-0 font-mono text-[10px]" style={{ color: isActive ? surfaceColor.value : "var(--text-muted)" }}>
                      {surface.number}
                    </span>
                    <span
                      className={cn(
                        "relative z-10 flex-1 font-ui text-[12px] font-medium",
                        isActive ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)]"
                      )}
                    >
                      {surface.label}
                    </span>
                    {surface.slug === "comms" && unreadComms > 0 ? (
                      <span className="absolute right-2 top-2 h-[4px] w-[4px] rounded-full bg-[var(--rose)]" />
                    ) : null}
                    {isActive ? (
                      <motion.div
                        variants={livePulse}
                        initial="hidden"
                        animate="show"
                        className="h-[5px] w-[5px] rounded-full"
                        style={{ background: surfaceColor.value, boxShadow: `0 0 6px ${surfaceColor.value}` }}
                      />
                    ) : null}
                  </div>
                </motion.button>
              </motion.li>
            );
          })}
        </motion.ul>

        <div className="mx-4 my-2 border-t border-[rgba(255,255,255,0.04)]" />
        <div className="space-y-1 pt-1">
          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-[6px] px-3 py-2.5 text-left font-ui text-[12px] font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
          >
            <Settings size={14} strokeWidth={1.5} className="text-[var(--text-muted)]" />
            Settings
          </button>
          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-[6px] px-3 py-2.5 text-left font-ui text-[12px] font-medium text-[var(--cyan)] transition-colors hover:text-[var(--text-primary)]"
          >
            <Plus size={14} strokeWidth={1.5} />
            New Project
          </button>
        </div>
      </nav>

      <div className="flex items-center justify-between px-4 pb-5 pt-3">
        <ThemeToggle />
        <button
          type="button"
          onClick={() => {
            window.localStorage.removeItem("orchestra_user");
            router.replace("/login");
          }}
          className="flex items-center gap-2 rounded-sm border border-[rgba(255,255,255,0.06)] px-2.5 py-2 font-ui text-[11px] text-[var(--text-muted)] transition-all hover:border-[rgba(251,113,133,0.2)] hover:text-[var(--rose)]"
        >
          <LogOut size={13} strokeWidth={1.5} />
          logout
        </button>
      </div>
    </motion.aside>
  );
}
