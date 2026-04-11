"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, animate, motion } from "framer-motion";
import { CheckCircle2, ChevronRight, Zap } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import {
  COUNT_UP_DURATION,
  EASE_EXPO,
  EASE_IN_OUT_CIRC,
  SPRING_SNAPPY,
  approvalBurst,
  fadeSlideUp,
  fadeSlideUpFast,
  numberReveal,
  pageContainer,
  scalePop,
  staggerContainer
} from "@/lib/animations";
import { StageShell } from "@/components/layout/StageShell";
import { OrchestraButton } from "@/components/shared/OrchestraButton";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { TerminalOutput } from "@/components/shared/TerminalOutput";
import { boardSyncChecklist, boardSyncLines, executionEpics } from "@/lib/mockData";
import { getStageRoute } from "@/lib/stageConfig";

const epicColorMap = {
  E1: { color: "var(--cyan)", border: "var(--cyan-border)" },
  E2: { color: "var(--violet)", border: "var(--violet-border)" },
  E3: { color: "var(--blue)", border: "var(--blue-border)" },
  E4: { color: "var(--amber)", border: "var(--amber-border)" },
  E5: { color: "var(--emerald)", border: "var(--emerald-border)" }
} as const;

export function Stage6ExecutionPlan() {
  const [openEpics, setOpenEpics] = useState<string[]>(executionEpics.map((epic) => epic.id));
  const [syncing, setSyncing] = useState(false);
  const [synced, setSynced] = useState(false);
  const router = useRouter();
  const params = useParams<{ projectId: string }>();
  const projectId = typeof params?.projectId === "string" ? params.projectId : "p1";

  const metrics = useMemo(() => {
    const taskCount = executionEpics.reduce((total, epic) => total + epic.tasks.length, 0);
    const subtaskCount = executionEpics.reduce(
      (total, epic) => total + epic.tasks.reduce((taskTotal, task) => taskTotal + task.acceptance.length, 0),
      0
    );

    return {
      epics: executionEpics.length,
      tasks: taskCount,
      subtasks: subtaskCount
    };
  }, []);

  return (
    <StageShell showGrid>
      <motion.div variants={pageContainer} initial="hidden" animate="show" className="mx-auto max-w-7xl space-y-6 px-8 py-8">
        <SectionHeader
          label="Step 6"
          title="WHO BUILDS WHAT?"
          subtitle="Every task. Every owner. No ambiguity."
          accentColor="var(--cyan)"
        />

        <motion.div variants={staggerContainer(0.08, 0.04)} initial="hidden" animate="show" className="grid gap-4 md:grid-cols-3">
          <ExecutionMetric label="EPIC COUNT" value={metrics.epics} color="var(--violet)" />
          <ExecutionMetric label="TASK COUNT" value={metrics.tasks} color="var(--cyan)" />
          <ExecutionMetric label="SUBTASK COUNT" value={metrics.subtasks} color="var(--blue)" />
        </motion.div>

        <motion.div variants={staggerContainer(0.06, 0.06)} initial="hidden" animate="show" className="space-y-3">
          {executionEpics.map((epic) => {
            const open = openEpics.includes(epic.id);
            const epicTone = epicColorMap[epic.id as keyof typeof epicColorMap] ?? epicColorMap.E1;

            return (
              <motion.div key={epic.id} variants={fadeSlideUp} className="glass glass-hover overflow-hidden rounded-xl">
                <button
                  type="button"
                  onClick={() =>
                    setOpenEpics((current) => (current.includes(epic.id) ? current.filter((item) => item !== epic.id) : [...current, epic.id]))
                  }
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="font-mono text-[10px] tracking-[0.12em]" style={{ color: epicTone.color }}>
                      {epic.id}
                    </span>
                    <span className="truncate font-ui text-[14px] font-medium text-[var(--text-primary)]">{epic.title}</span>
                    <span className="glass-sm rounded-sm px-2 py-0.5 font-mono text-[9px] tracking-[0.12em] text-[var(--text-muted)]">
                      {epic.tasks.length} tasks
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge variant={epic.priority.toLowerCase() as "p0" | "p1" | "p2"} />
                    <motion.div animate={{ rotate: open ? 90 : 0 }} transition={SPRING_SNAPPY}>
                      <ChevronRight size={14} className="text-[var(--text-muted)]" />
                    </motion.div>
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {open ? (
                    <div style={{ overflow: "hidden" }}>
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.35, ease: EASE_IN_OUT_CIRC }}
                        className="pb-3"
                      >
                        <motion.div variants={staggerContainer(0.05, 0.04)} initial="hidden" animate="show" className="space-y-2 px-4">
                          {epic.tasks.map((task) => (
                            <motion.div
                              key={task.id}
                              variants={fadeSlideUpFast}
                              className="glass-sm rounded-lg border-l-2 px-4 py-3"
                              style={{ borderLeftColor: epicTone.border }}
                            >
                              <div className="flex flex-wrap items-center gap-3">
                                <span className="font-mono text-[9px] tracking-[0.12em] text-[var(--text-muted)]">{task.id}</span>
                                <span className="flex-1 font-ui text-[12px] text-[var(--text-primary)]">{task.title}</span>
                                <motion.div variants={scalePop} initial="hidden" animate="show">
                                  <StatusBadge variant={task.priority.toLowerCase() as "p0" | "p1" | "p2" | "p3"} />
                                </motion.div>
                                <StatusBadge variant={task.status} />
                                <span className="glass-sm rounded-sm px-2 py-0.5 font-ui text-[10px] text-[var(--text-secondary)]">
                                  {task.assignee}
                                </span>
                              </div>
                              <div className="mt-3 flex flex-wrap gap-2">
                                {task.dag.map((node) => (
                                  <span key={`${task.id}-${node}`} className="glass-sm rounded-full px-2 py-0.5 font-mono text-[9px] tracking-[0.12em] text-[var(--text-muted)]">
                                    {node}
                                  </span>
                                ))}
                              </div>
                              <motion.div variants={staggerContainer(0.04, 0.08)} initial="hidden" animate="show" className="mt-3 space-y-2">
                                {task.acceptance.map((criterion) => (
                                  <motion.div key={criterion} variants={fadeSlideUpFast} className="flex items-start gap-2">
                                    <span className="mt-2 h-1.5 w-1.5 rounded-full" style={{ background: epicTone.color }} />
                                    <span className="font-ui text-[12px] leading-6 text-[var(--text-secondary)]">{criterion}</span>
                                  </motion.div>
                                ))}
                              </motion.div>
                            </motion.div>
                          ))}
                        </motion.div>
                      </motion.div>
                    </div>
                  ) : null}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div variants={fadeSlideUp} initial="hidden" animate="show" className="glass-blue glass-noise rounded-xl px-6 py-6">
          <div className="mb-4 font-mono text-[10px] tracking-[0.15em] text-[var(--blue)]">SYNC TO BOARD</div>
          <div className="grid gap-3 md:grid-cols-2">
            {[
              ["J", "Jira", "TempestAI workspace"],
              ["L", "Linear", "TempestAI product team"]
            ].map(([letter, name, meta]) => (
              <div key={name} className="glass-sm flex items-center gap-3 rounded-lg px-4 py-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-md border border-[var(--blue-border)] font-mono text-[11px] text-[var(--blue)]">
                  {letter}
                </div>
                <div>
                  <div className="font-ui text-[13px] text-[var(--text-primary)]">{name}</div>
                  <div className="font-mono text-[9px] tracking-[0.12em] text-[var(--text-muted)]">{meta}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 space-y-2">
            {boardSyncChecklist.map((item) => (
              <div key={item} className="font-ui text-[12px] text-[var(--text-secondary)]">
                {item}
              </div>
            ))}
          </div>

          <div className="mt-5">
            {!syncing && !synced ? (
              <OrchestraButton variant="primary" onClick={() => setSyncing(true)} icon={Zap}>
                Sync to Jira
              </OrchestraButton>
            ) : null}

            {syncing ? (
              <div className="mt-4">
                <TerminalOutput
                  label="JIRA"
                  lines={boardSyncLines}
                  tone="blue"
                  onComplete={() => {
                    setSyncing(false);
                    setSynced(true);
                  }}
                />
              </div>
            ) : null}

            <AnimatePresence>
              {synced ? (
                <motion.div key="synced" variants={fadeSlideUp} initial="hidden" animate="show" exit="hidden" className="mt-4 space-y-4">
                  <div className="glass-sm rounded-lg px-4 py-4">
                    <motion.div variants={approvalBurst} initial="hidden" animate="show" className="mb-3 flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-[rgba(134,239,172,1)]" />
                      <span className="font-mono text-[10px] tracking-[0.12em] text-[rgba(134,239,172,1)]">Board is live. ✓</span>
                    </motion.div>
                    <div className="font-ui text-[12px] text-[var(--text-secondary)]">
                      Jira now mirrors the Tempest AI execution plan, assignees, and Sprint 3 boundaries.
                    </div>
                  </div>
                  <OrchestraButton variant="ghost" onClick={() => router.push(getStageRoute(projectId, "7-changesync"))}>
                    Review the change
                  </OrchestraButton>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </StageShell>
  );
}

function ExecutionMetric({ label, value, color }: { label: string; value: number; color: string }) {
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    const controls = animate(0, value, {
      duration: COUNT_UP_DURATION,
      ease: EASE_EXPO,
      onUpdate: (current) => setDisplayed(Math.round(current))
    });
    return () => controls.stop();
  }, [value]);

  return (
    <motion.div variants={fadeSlideUp} className="glass rounded-xl px-5 py-5">
      <div className="font-mono text-[10px] tracking-[0.12em] text-[var(--text-muted)]">{label}</div>
      <motion.div
        variants={numberReveal}
        initial="hidden"
        animate="show"
        className="mt-4 font-title text-[52px] leading-none"
        style={{ color }}
      >
        {displayed}
      </motion.div>
    </motion.div>
  );
}
