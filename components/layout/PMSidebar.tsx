"use client";

import { useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  BarChart3,
  CheckCircle2,
  ChevronLeft,
  GitBranch,
  GitMerge,
  Layers,
  LogOut,
  MessageCircle,
  MessageSquare,
  Package,
  Send,
  ShieldCheck,
  UploadCloud
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { EASE_EXPO, SPRING_SNAPPY, livePulse, slideInLeft, staggerContainer } from "@/lib/animations";
import { RoleBadge } from "@/components/shared/RoleBadge";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { getProjectById, getUnreadCommsCount } from "@/lib/mockData";
import { type MockUser } from "@/lib/roles";
import { getCommsRoute, getIntelRoute, getStageRoute, getTruthRoute, pmStages } from "@/lib/stageConfig";
import { cn } from "@/lib/utils";

type AccentTone = "cyan" | "violet" | "blue" | "amber" | "emerald";

const stageColors = {
  "01": "blue",
  "02": "violet",
  "03": "cyan",
  "04": "blue",
  "05": "cyan",
  "06": "amber",
  "07": "amber",
  "08": "cyan",
  "09": "blue",
  "10": "emerald"
} as const satisfies Record<string, AccentTone>;

const stageIcons = {
  "1-intake": UploadCloud,
  "2-clarification": MessageSquare,
  "3-dag": GitBranch,
  "4-prototype": Layers,
  "5-approval": ShieldCheck,
  "6-execution": Activity,
  "7-changesync": GitBranch,
  "8-tower": Activity,
  "9-updates": Send,
  "10-handover": Package
} as const;

const intelligenceItems = [
  { key: "truth", label: "Everything Jack gave us", icon: GitMerge, color: "violet" as const },
  { key: "comms", label: "What Jack is saying", icon: MessageCircle, color: "blue" as const },
  { key: "intel", label: "Ask anything", icon: BarChart3, color: "amber" as const }
];

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
  const routeSection = pathSegments[2] ?? "stage";
  const routeLeaf = pathSegments[3] ?? "";
  const activeStageSlug = routeSection === "stage" ? routeLeaf : project.stageSlug;
  const currentStageIndex = pmStages.findIndex((stage) => stage.slug === activeStageSlug);
  const activeIntelKey =
    routeSection === "truth" || routeSection === "comms" || routeSection === "intel" ? routeSection : null;

  useEffect(() => {
    activeRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [activeStageSlug, activeIntelKey]);

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
        <div className="font-mono text-[9px] tracking-[0.1em] text-[var(--text-muted)]">v2 · demo build</div>
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
        <div className="font-mono text-[9px] tracking-[0.12em] text-[var(--cyan)]">CREATOR MARKETPLACE</div>
        <div className="mt-1 flex items-center gap-2">
          <span className="h-[5px] w-[5px] rounded-full bg-[var(--cyan)] shadow-[0_0_8px_rgba(0,229,204,0.8)]" />
          <span className="font-ui text-[11px] text-[var(--text-secondary)]">{project.client}</span>
        </div>
        <div className="mt-1 font-mono text-[9px] text-[var(--text-muted)]">Last update 2h ago</div>
        <div className="mt-1.5 flex items-center justify-between">
          <span className="font-mono text-[9px] tracking-[0.12em] text-[var(--text-muted)]">
            SPRINT {project.sprint.toUpperCase()}
          </span>
          <span className="font-mono text-[9px] text-[var(--cyan)]">{project.completion}%</span>
        </div>
        <div className="mt-2 h-[2px] rounded-full bg-[rgba(255,255,255,0.05)]">
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: project.completion / 100 }}
            transition={{ duration: 1.2, ease: EASE_EXPO, delay: 0.2 }}
            className="h-[2px] rounded-full"
            style={{
              transformOrigin: "left",
              background: "linear-gradient(90deg, #00e5cc, rgba(0,229,204,0.5))"
            }}
          />
        </div>
      </div>

      <div className="mx-4 my-2 border-t border-[rgba(255,255,255,0.04)]" />

      <nav className="flex-1 overflow-y-auto px-3 py-1">
        <motion.ul variants={staggerContainer(0.04, 0.08)} initial="hidden" animate="show" className="space-y-1">
          {pmStages.map((stage, index) => {
            const Icon = stageIcons[stage.slug];
            const stageTone = tone(stageColors[stage.number as keyof typeof stageColors] ?? "cyan");
            const isActive = stage.slug === activeStageSlug && !activeIntelKey;
            const isCompleted = index < currentStageIndex && !activeIntelKey;

            return (
              <motion.li key={stage.slug} variants={slideInLeft} className="relative">
                <motion.button
                  type="button"
                  onClick={() => router.push(getStageRoute(projectId, stage.slug))}
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
                        background: stageTone.dim,
                        border: `1px solid ${stageTone.border}`
                      }}
                    />
                  ) : null}
                  <div className="relative z-10 flex items-center gap-3 px-3 py-2.5 text-left">
                    <Icon
                      size={14}
                      strokeWidth={1.5}
                      style={{ color: isActive ? stageTone.value : "var(--text-muted)" }}
                    />
                    <span
                      className="w-5 shrink-0 font-mono text-[10px]"
                      style={{ color: isActive || isCompleted ? stageTone.value : "var(--text-muted)" }}
                    >
                      {stage.number}
                    </span>
                    <span
                      className={cn(
                        "relative z-10 flex-1 font-ui text-[12px] font-medium",
                        isActive ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)]"
                      )}
                    >
                      {stage.label}
                    </span>
                    {isActive ? (
                      <motion.div
                        ref={isActive ? activeRef : undefined}
                        variants={livePulse}
                        initial="hidden"
                        animate="show"
                        className="h-[5px] w-[5px] rounded-full"
                        style={{ background: stageTone.value, boxShadow: `0 0 6px ${stageTone.value}` }}
                      />
                    ) : isCompleted ? (
                      <CheckCircle2 size={12} strokeWidth={1.5} color="rgba(52,211,153,0.5)" />
                    ) : null}
                  </div>
                </motion.button>
              </motion.li>
            );
          })}
        </motion.ul>

        <div className="mx-4 my-2 border-t border-[rgba(255,255,255,0.04)]" />
        <div className="px-5 pb-1 pt-2 font-mono text-[9px] tracking-[0.2em] text-[var(--text-muted)]">ALWAYS ON</div>

        <motion.ul variants={staggerContainer(0.04, 0.12)} initial="hidden" animate="show" className="space-y-1">
          {intelligenceItems.map((item) => {
            const itemTone = tone(item.color);
            const href =
              item.key === "truth"
                ? getTruthRoute(projectId)
                : item.key === "comms"
                  ? getCommsRoute(projectId)
                  : getIntelRoute(projectId);
            const isActive = activeIntelKey === item.key;
            const Icon = item.icon;

            return (
              <motion.li key={item.key} variants={slideInLeft} className="relative">
                <motion.button
                  type="button"
                  onClick={() => router.push(href)}
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
                        background: itemTone.dim,
                        border: `1px solid ${itemTone.border}`
                      }}
                    />
                  ) : null}
                  <div className="relative z-10 flex items-center gap-3 px-3 py-2.5 text-left">
                    <Icon size={14} strokeWidth={1.5} style={{ color: isActive ? itemTone.value : "var(--text-muted)" }} />
                    <span className="flex-1 font-ui text-[12px] font-medium text-[var(--text-secondary)]">
                      {item.label}
                    </span>
                    {item.key === "comms" && unreadComms > 0 ? (
                      <span className="absolute right-2 top-2 h-[4px] w-[4px] rounded-full bg-[var(--rose)]" />
                    ) : null}
                    {isActive ? (
                      <motion.div
                        variants={livePulse}
                        initial="hidden"
                        animate="show"
                        className="h-[5px] w-[5px] rounded-full"
                        style={{ background: itemTone.value, boxShadow: `0 0 6px ${itemTone.value}` }}
                      />
                    ) : null}
                  </div>
                </motion.button>
              </motion.li>
            );
          })}
        </motion.ul>
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
