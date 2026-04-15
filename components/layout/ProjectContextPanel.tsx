"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Archive, Brain, CheckCircle2, GitBranch, History, Search, Sparkles } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { fadeSlideUp, staggerContainer } from "@/lib/animations";
import {
  mockChanges,
  mockDecisions,
  mockSummaryBundles,
  mockThreads,
  mockWorkflowDAG
} from "@/lib/mockData";
import { getIntelRoute, getMemoryRoute, getSurfaceRoute, pmSurfaces, type PMProjectSurfaceSlug } from "@/lib/stageConfig";
import { cn } from "@/lib/utils";

type SocratesReply = {
  label: string;
  body: string;
  tone: "cyan" | "amber" | "emerald" | "rose" | "violet" | "blue";
};

const quickPrompts = [
  "What changed today?",
  "Why is subscription risky?",
  "What should Sarah review next?"
];

const surfaceTone: Record<PMProjectSurfaceSlug, "cyan" | "amber" | "emerald" | "rose" | "violet" | "blue"> = {
  brain: "cyan",
  dag: "cyan",
  comms: "blue",
  intel: "violet",
  decisions: "emerald",
  changes: "amber",
  outputs: "cyan",
  memory: "violet"
};

function toneClass(tone: SocratesReply["tone"]) {
  return {
    cyan: "border-[var(--cyan-border)] bg-[var(--cyan-dim)] text-[var(--cyan)]",
    amber: "border-[var(--amber-border)] bg-[var(--amber-dim)] text-[var(--amber)]",
    emerald: "border-[var(--emerald-border)] bg-[var(--emerald-dim)] text-[var(--emerald)]",
    rose: "border-[var(--rose-border)] bg-[var(--rose-dim)] text-[var(--rose)]",
    violet: "border-[var(--violet-border)] bg-[var(--violet-dim)] text-[var(--violet)]",
    blue: "border-[var(--blue-border)] bg-[var(--blue-dim)] text-[var(--blue)]"
  }[tone];
}

function buildSocratesReply(prompt: string): SocratesReply[] {
  const normalized = prompt.toLowerCase();

  if (normalized.includes("subscription") || normalized.includes("pro")) {
    return [
      {
        label: "Accepted fact",
        body: "Pro subscription is outside the accepted MVP brief. MVP uses the flat 70% florist revenue share.",
        tone: "emerald"
      },
      {
        label: "Risk",
        body: "Jack re-requested Pro with 85% share. That touches billing, florist plans, reporting, and the scope-out decision.",
        tone: "rose"
      },
      {
        label: "Next action",
        body: "Keep it as an unresolved change until Sarah explicitly approves a timeline and budget adjustment.",
        tone: "amber"
      }
    ];
  }

  if (normalized.includes("driver") || normalized.includes("approval") || normalized.includes("review")) {
    return [
      {
        label: "Current plan",
        body: "Driver assignment is auto-assign after florist confirmation, based on proximity.",
        tone: "cyan"
      },
      {
        label: "New request",
        body: "Jack asked for manager approval before any driver is assigned. That adds a manual gate to a critical flow.",
        tone: "amber"
      },
      {
        label: "Next action",
        body: "Sarah should review the approval gate before engineering changes permissions, order states, or dashboard copy.",
        tone: "violet"
      }
    ];
  }

  return [
    {
      label: "Project summary",
      body:
        mockSummaryBundles.find((bundle) => bundle.role === "pm")?.content ??
        "BloomFast has two live scope questions that need human review before the MVP plan changes.",
      tone: "cyan"
    },
    {
      label: "Evidence",
      body: "The highest-impact signals are the manager approval WhatsApp thread and the Pro subscription Slack thread.",
      tone: "blue"
    },
    {
      label: "Next action",
      body: "Review the two pending change records, then update decisions if either request becomes accepted scope.",
      tone: "amber"
    }
  ];
}

function GraphicalSummary() {
  const critical = mockWorkflowDAG.criticalPath.length;
  const risky = mockWorkflowDAG.nodes.filter((node) => node.isRisky).length;
  const unresolved = mockWorkflowDAG.nodes.filter((node) => node.isUnresolved).length;

  return (
    <div className="project-context-card rounded-lg p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--text-muted)]">Live Dependency Map</div>
        <Badge variant="amber">{unresolved} unresolved</Badge>
      </div>

      <svg viewBox="0 0 292 122" className="h-[122px] w-full overflow-visible" role="img" aria-label="BloomFast dependency summary">
        <defs>
          <linearGradient id="context-panel-line" x1="0" x2="1" y1="0" y2="0">
            <stop stopColor="var(--cyan)" stopOpacity="0.75" />
            <stop offset="1" stopColor="var(--amber)" stopOpacity="0.9" />
          </linearGradient>
        </defs>
        <path d="M45 42 C90 16 126 16 164 42 S232 72 252 42" fill="none" stroke="url(#context-panel-line)" strokeWidth="2" />
        <path d="M45 82 C92 102 124 102 164 82 S228 56 252 82" fill="none" stroke="rgba(167,139,250,0.5)" strokeWidth="2" strokeDasharray="5 6" />
        {[
          { x: 45, y: 42, label: "Brief", tone: "var(--emerald)" },
          { x: 164, y: 42, label: "DAG", tone: "var(--cyan)" },
          { x: 252, y: 42, label: "Build", tone: "var(--blue)" },
          { x: 45, y: 82, label: "Messages", tone: "var(--violet)" },
          { x: 164, y: 82, label: "Changes", tone: "var(--amber)" },
          { x: 252, y: 82, label: "Decisions", tone: "var(--emerald)" }
        ].map((node) => (
          <g key={node.label}>
            <circle cx={node.x} cy={node.y} r="14" fill="var(--context-node-fill)" stroke={node.tone} strokeWidth="1.5" />
            <circle cx={node.x} cy={node.y} r="4" fill={node.tone} />
            <text x={node.x} y={node.y + 28} textAnchor="middle" fill="var(--text-secondary)" fontFamily="var(--font-mono)" fontSize="8">
              {node.label}
            </text>
          </g>
        ))}
      </svg>

      <div className="grid grid-cols-3 gap-2">
        {[
          ["Critical", critical, "cyan"],
          ["Risky", risky, "amber"],
          ["Changes", mockChanges.length, "rose"]
        ].map(([label, value, tone]) => (
          <div key={label} className="project-context-metric rounded-md px-3 py-2">
            <div className="font-display text-[28px] leading-none" style={{ color: `var(--${tone})` }}>
              {value}
            </div>
            <div className="mt-1 font-mono text-[8px] uppercase tracking-[0.14em] text-[var(--text-muted)]">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function activeSurfaceFromPath(pathname: string): PMProjectSurfaceSlug {
  const segment = pathname.split("/").filter(Boolean)[2] as PMProjectSurfaceSlug | undefined;
  const active = pmSurfaces.find((surface) => surface.slug === segment);
  return active?.slug ?? "brain";
}

export function ProjectContextPanel({ projectId }: { projectId: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState<SocratesReply[]>(() => buildSocratesReply("summary"));
  const activeSurface = activeSurfaceFromPath(pathname);

  const stats = useMemo(
    () => ({
      unreviewed: mockThreads.flatMap((thread) => thread.messages).filter((message) => message.insight && !message.insight.reviewedByHuman).length,
      finalDecisions: mockDecisions.filter((decision) => decision.status === "final").length,
      pendingChanges: mockChanges.filter((change) => change.approvalStatus !== "approved").length
    }),
    []
  );

  const submitPrompt = (nextPrompt = prompt) => {
    const content = nextPrompt.trim();
    if (!content) return;
    setReply(buildSocratesReply(content));
    setPrompt("");
  };

  return (
    <motion.aside
      initial={{ x: 340, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="project-context-panel fixed right-0 top-0 z-40 hidden h-screen w-[340px] flex-col px-4 py-4 backdrop-blur-2xl xl:flex"
    >
      <div className="flex items-start justify-between gap-3 border-b border-[rgba(255,255,255,0.06)] pb-4">
        <div>
          <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--violet)]">
            <Sparkles size={13} />
            Socrates live
          </div>
          <div className="mt-2 font-display text-[34px] leading-none tracking-[0.04em] text-[var(--text-primary)]">Project Pulse</div>
        </div>
        <button
          type="button"
          onClick={() => router.push(getIntelRoute(projectId))}
          className="rounded-md border border-[var(--violet-border)] bg-[var(--violet-dim)] px-3 py-2 font-mono text-[9px] uppercase tracking-[0.12em] text-[var(--violet)] transition-colors hover:bg-[rgba(167,139,250,0.14)]"
        >
          Archive
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto py-4 pr-1">
        <motion.div variants={staggerContainer(0.05, 0.03)} initial="hidden" animate="show" className="space-y-4">
          <motion.section variants={fadeSlideUp} className="rounded-lg border border-[var(--violet-border)] bg-[var(--violet-dim)] p-3">
            <div className="mb-2 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.14em] text-[var(--violet)]">
              <Brain size={13} />
              Ask in place
            </div>
            <textarea
              value={prompt}
              rows={3}
              onChange={(event) => setPrompt(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  submitPrompt();
                }
              }}
              className="project-context-input min-h-[84px] w-full resize-none rounded-md px-3 py-2 font-ui text-[12px] leading-5 text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)]"
              placeholder="Ask about a change, decision, DAG node, or client message..."
            />
            <div className="mt-2 flex flex-wrap gap-2">
              {quickPrompts.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => submitPrompt(item)}
                  className="rounded-md border border-[rgba(255,255,255,0.07)] px-2.5 py-1.5 font-ui text-[11px] text-[var(--text-secondary)] transition-colors hover:border-[var(--violet-border)] hover:text-[var(--text-primary)]"
                >
                  {item}
                </button>
              ))}
            </div>
          </motion.section>

          <motion.section variants={fadeSlideUp} className="space-y-2">
            {reply.map((item) => (
              <div key={`${item.label}-${item.body}`} className={cn("rounded-lg border px-3 py-3", toneClass(item.tone))}>
                <div className="font-mono text-[9px] uppercase tracking-[0.14em]">{item.label}</div>
                <div className="mt-2 font-ui text-[12px] leading-5 text-[var(--text-primary)]">{item.body}</div>
              </div>
            ))}
          </motion.section>

          <motion.section variants={fadeSlideUp}>
            <GraphicalSummary />
          </motion.section>

          <motion.section variants={fadeSlideUp} className="project-context-card rounded-lg p-3">
            <div className="mb-3 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--text-muted)]">
              <GitBranch size={13} />
              Demo path
            </div>
            <div className="space-y-1">
              {pmSurfaces.map((surface) => {
                const isActive = surface.slug === activeSurface;
                const tone = surfaceTone[surface.slug];
                return (
                  <button
                    key={surface.slug}
                    type="button"
                    onClick={() => router.push(getSurfaceRoute(projectId, surface.slug))}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left transition-colors",
                      isActive ? "bg-[rgba(255,255,255,0.055)] text-[var(--text-primary)]" : "text-[var(--text-secondary)] hover:bg-[rgba(255,255,255,0.035)]"
                    )}
                  >
                    <span className="font-mono text-[9px]" style={{ color: `var(--${tone})` }}>
                      {surface.number}
                    </span>
                    <span className="flex-1 font-ui text-[12px]">{surface.label}</span>
                    {isActive ? <span className="h-1.5 w-1.5 rounded-full" style={{ background: `var(--${tone})` }} /> : null}
                  </button>
                );
              })}
            </div>
          </motion.section>

          <motion.section variants={fadeSlideUp} className="grid grid-cols-3 gap-2">
            {[
              ["Insights", stats.unreviewed, "amber"],
              ["Decisions", stats.finalDecisions, "emerald"],
              ["Changes", stats.pendingChanges, "rose"]
            ].map(([label, value, tone]) => (
              <div key={label} className="project-context-metric rounded-md px-3 py-3">
                <div className="font-display text-[30px] leading-none" style={{ color: `var(--${tone})` }}>
                  {value}
                </div>
                <div className="mt-1 font-mono text-[8px] uppercase tracking-[0.14em] text-[var(--text-muted)]">{label}</div>
              </div>
            ))}
          </motion.section>
        </motion.div>
      </div>

      <div className="space-y-2 border-t border-[rgba(255,255,255,0.06)] pt-3">
        <button
          type="button"
          onClick={() => router.push(getMemoryRoute(projectId))}
          className="flex w-full items-center gap-3 rounded-md border border-[rgba(255,255,255,0.07)] px-3 py-2.5 text-left font-ui text-[12px] text-[var(--text-secondary)] transition-colors hover:border-[var(--violet-border)] hover:text-[var(--text-primary)]"
        >
          <Search size={14} className="text-[var(--violet)]" />
          Search memory, briefs, and evidence
        </button>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => router.push(getIntelRoute(projectId))}
            className="flex items-center gap-2 rounded-md border border-[rgba(255,255,255,0.07)] px-3 py-2 font-ui text-[11px] text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
          >
            <History size={13} />
            History
          </button>
          <button
            type="button"
            onClick={() => router.push(getMemoryRoute(projectId))}
            className="flex items-center gap-2 rounded-md border border-[rgba(255,255,255,0.07)] px-3 py-2 font-ui text-[11px] text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
          >
            <Archive size={13} />
            Evidence
          </button>
        </div>
        <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.13em] text-[var(--emerald)]">
          <CheckCircle2 size={12} />
          Accepted brief remains source of truth
        </div>
      </div>
    </motion.aside>
  );
}
