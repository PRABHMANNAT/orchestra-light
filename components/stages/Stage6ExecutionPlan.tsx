"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { StageShell } from "@/components/layout/StageShell";
import { OrchestraButton } from "@/components/shared/OrchestraButton";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { TerminalOutput } from "@/components/shared/TerminalOutput";
import { boardSyncChecklist, boardSyncLines, executionEpics } from "@/lib/mockData";
import { cn } from "@/lib/utils";

type TaskVisualStatus = "todo" | "in-progress" | "in-review" | "done";

const taskVisualStatusMap: Record<string, TaskVisualStatus> = {
  "T1.1": "in-progress",
  "T1.2": "done",
  "T1.4": "in-progress",
  "T2.3": "in-review",
  "T2.4": "todo",
  "T2.8": "todo",
  "T3.1": "in-progress",
  "T3.2": "done"
};

const taskAssigneeMap: Record<string, string> = {
  E1: "M. TORRES",
  E2: "BUILD TEAM",
  E3: "DATA TEAM"
};

const epicPriorityTone = {
  E1: {
    label: "CRITICAL",
    className: "border border-[#fecaca] bg-[#fee2e2] text-[#991b1b]"
  },
  E2: {
    label: "HIGH",
    className: "border border-[#fef08a] bg-[#fef9c3] text-[#854d0e]"
  },
  E3: {
    label: "MEDIUM",
    className: "border border-[#bfdbfe] bg-[#dbeafe] text-[#1e40af]"
  }
} as const;

function getTaskPriorityVariant(priority: string) {
  switch (priority) {
    case "p0":
      return "p0";
    case "p1":
      return "p1";
    case "p2":
      return "p2";
    default:
      return "p3";
  }
}

function getTaskStatusVariant(status: TaskVisualStatus) {
  switch (status) {
    case "in-progress":
      return "in-progress";
    case "in-review":
      return "in-review";
    case "done":
      return "done";
    default:
      return "todo";
  }
}

function getSubtaskCompletion(status: TaskVisualStatus, index: number) {
  if (status === "done") return true;
  if (status === "in-review") return true;
  if (status === "in-progress") return index === 0;
  return false;
}

export function Stage6ExecutionPlan() {
  const [openEpics, setOpenEpics] = useState<string[]>(["E1", "E2", "E3"]);
  const [openTasks, setOpenTasks] = useState<string[]>([]);
  const [syncing, setSyncing] = useState(false);
  const [synced, setSynced] = useState(false);
  const router = useRouter();

  const epicMetrics = useMemo(() => {
    const taskCount = executionEpics.reduce((total, epic) => total + epic.tasks.length, 0);
    const subtaskCount = executionEpics.reduce(
      (total, epic) => total + epic.tasks.reduce((taskTotal, task) => taskTotal + task.acceptance.length, 0),
      0
    );

    return {
      epicCount: executionEpics.length,
      taskCount,
      subtaskCount
    };
  }, []);

  return (
    <StageShell showGrid>
      <div className="mx-auto max-w-7xl space-y-6">
        <SectionHeader
          title="EXECUTION PLAN"
          subtitle="Derived from approved scope v1.0 · Linked to product flowchart nodes · Traceable to brief"
        />

        <div className="rounded-2xl border border-[#e8e8e8] bg-white p-5 shadow-sm">
          <div className="font-mono text-[10px] uppercase tracking-widest text-[#999999]">PLAN SNAPSHOT</div>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <MetricCard label="EPICS" value={epicMetrics.epicCount} />
            <MetricCard label="TASKS" value={epicMetrics.taskCount} />
            <MetricCard label="SUBTASKS" value={epicMetrics.subtaskCount} />
          </div>
        </div>

        {!syncing && !synced ? (
          <>
            <div className="space-y-4">
              {executionEpics.map((epic) => {
                const epicOpen = openEpics.includes(epic.id);
                const epicTone = epicPriorityTone[epic.id as keyof typeof epicPriorityTone];

                return (
                  <div key={epic.id} className="mb-4 overflow-hidden rounded-2xl border border-[#e8e8e8] bg-white shadow-sm">
                    <div className="flex items-center justify-between border-b border-[#f0f0f0] bg-[#fafafa] px-5 py-3">
                      <button
                        type="button"
                        onClick={() =>
                          setOpenEpics((current) =>
                            current.includes(epic.id) ? current.filter((item) => item !== epic.id) : [...current, epic.id]
                          )
                        }
                        className="flex flex-1 items-center text-left"
                      >
                        <motion.div
                          animate={{ rotate: epicOpen ? 90 : 0 }}
                          transition={{ duration: 0.2 }}
                          className="mr-3"
                        >
                          <ChevronRight size={14} strokeWidth={1.5} className="text-[#999999] hover:text-[#111111]" />
                        </motion.div>
                        <span className="mr-2 rounded-full bg-[#f0f0f0] px-2.5 py-0.5 font-mono text-[10px] text-[#555555]">
                          {epic.id}
                        </span>
                        <span className="font-sans text-[14px] font-semibold text-[#111111]">{epic.title}</span>
                        <span className="ml-2 font-mono text-[11px] text-[#999999]">{epic.tasks.length} tasks</span>
                      </button>
                      <span className={cn("rounded-full px-2.5 py-1 font-mono text-[10px]", epicTone.className)}>
                        {epicTone.label}
                      </span>
                    </div>

                    {epicOpen ? (
                      <div>
                        {epic.tasks.map((task) => {
                          const taskOpen = openTasks.includes(task.id);
                          const status = taskVisualStatusMap[task.id] ?? "todo";

                          return (
                            <div key={task.id}>
                              <button
                                type="button"
                                onClick={() =>
                                  setOpenTasks((current) =>
                                    current.includes(task.id)
                                      ? current.filter((item) => item !== task.id)
                                      : [...current, task.id]
                                  )
                                }
                                className="flex w-full cursor-pointer items-center gap-3 border-b border-[#f7f7f7] px-5 py-3 text-left transition-colors hover:bg-[#fafafa]"
                              >
                                <motion.div
                                  animate={{ rotate: taskOpen ? 90 : 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="shrink-0"
                                >
                                  <ChevronRight size={12} strokeWidth={1.5} className="text-[#cccccc] hover:text-[#999999]" />
                                </motion.div>
                                <span className="flex-1 font-sans text-[13px] text-[#222222]">
                                  {task.id} — {task.title}
                                </span>
                                <div className="flex flex-wrap gap-1">
                                  {task.dag.map((node) => (
                                    <span
                                      key={`${task.id}-${node}`}
                                      className="rounded-full border border-[#ebebeb] bg-[#f5f5f5] px-2.5 py-0.5 font-mono text-[10px] text-[#666666]"
                                    >
                                      {node}
                                    </span>
                                  ))}
                                </div>
                                <StatusBadge variant={getTaskPriorityVariant(task.priority) as "p0" | "p1" | "p2" | "p3"} />
                                <StatusBadge variant={getTaskStatusVariant(status) as "todo" | "in-progress" | "in-review" | "done"} />
                              </button>

                              {taskOpen ? (
                                <div>
                                  {task.acceptance.map((criterion, index) => {
                                    const checked = getSubtaskCompletion(status, index);

                                    return (
                                      <div
                                        key={`${task.id}-${criterion}`}
                                        className="flex items-center gap-3 border-b border-[#f5f5f5] bg-[#fafafa] py-2.5 pl-12 pr-5"
                                      >
                                        <div
                                            className={cn(
                                            "h-4 w-4 shrink-0 rounded-md border border-[#e0e0e0]",
                                            checked ? "border-[#111111] bg-[#111111]" : "bg-white"
                                          )}
                                        />
                                        <span className="flex-1 font-sans text-[12px] text-[#555555]">{criterion}</span>
                                        <span className="rounded-full bg-[#f5f5f5] px-2.5 py-0.5 font-mono text-[9px] text-[#888888]">
                                          {taskAssigneeMap[epic.id] ?? "UNASSIGNED"}
                                        </span>
                                      </div>
                                    );
                                  })}
                                  <div className="flex items-center gap-2 border-b border-[#f5f5f5] bg-[#fafafa] py-2.5 pl-12 pr-5">
                                    <span className="font-mono text-[10px] tracking-widest text-[#999999]">DEPENDS ON</span>
                                    <div className="flex flex-wrap gap-1">
                                      {task.dependencies.map((dependency) => (
                                        <span
                                          key={`${task.id}-${dependency}`}
                                          className="rounded-full border border-[#ebebeb] bg-white px-2.5 py-0.5 font-mono text-[9px] text-[#888888]"
                                        >
                                          {dependency}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              ) : null}
                            </div>
                          );
                        })}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>

            <div className="rounded-2xl border border-[#e8e8e8] bg-white p-5 shadow-sm">
              <div className="mb-4 font-mono text-[10px] uppercase tracking-widest text-[#999999]">SYNC TO BOARD</div>
              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  className="rounded-xl border border-[#111111] bg-[#111111] px-5 py-2.5 font-sans text-[13px] text-white transition-colors hover:bg-[#333333]"
                >
                  JIRA
                </button>
                <button
                  type="button"
                  className="rounded-xl border border-[#e0e0e0] bg-white px-5 py-2.5 font-sans text-[13px] text-[#333333] transition-colors hover:border-[#111111] hover:text-[#111111]"
                >
                  LINEAR
                </button>
              </div>
              <div className="mt-4 space-y-2">
                {boardSyncChecklist.map((item) => (
                  <div key={item} className="font-sans text-[13px] text-[#444444]">
                    {item}
                  </div>
                ))}
              </div>
              <div className="mt-5">
                <OrchestraButton variant="primary" icon={Zap} fullWidth onClick={() => setSyncing(true)}>
                  SYNC TO JIRA →
                </OrchestraButton>
              </div>
            </div>
          </>
        ) : null}

        {syncing && !synced ? (
          <TerminalOutput
            label="BOARD SYNC ENGINE — JIRA"
            lines={boardSyncLines}
            onComplete={() => {
              setSynced(true);
              setSyncing(false);
              toast.success("Synced to Jira — 94 items written");
            }}
          />
        ) : null}

        {synced ? (
          <div className="space-y-5">
            <div className="rounded-2xl border border-[#bbf7d0] bg-[#f0fdf4] p-5 shadow-sm">
              <div className="font-sans text-[15px] font-semibold text-[#111111]">Synced to Jira</div>
              <div className="mt-1 font-mono text-[10px] uppercase tracking-widest text-[#999999]">
                PROJ-1 through PROJ-94 · 3 epics · 24 tasks · 67 subtasks
              </div>
              <button type="button" className="mt-3 font-mono text-[10px] uppercase tracking-widest text-[#166534]">
                Open in Jira →
              </button>
            </div>
            <OrchestraButton variant="primary" onClick={() => router.push("/pm/7-changesync")}>
              CONTINUE TO CHANGE SYNC →
            </OrchestraButton>
          </div>
        ) : null}
      </div>
    </StageShell>
  );
}

function MetricCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-white/80 bg-white/70 p-5 shadow-glass-sm backdrop-blur-lg">
      <div className="font-sans text-[28px] font-bold leading-none text-[#111111]">{value}</div>
      <div className="mt-1 font-mono text-[10px] tracking-widest text-[#999999]">{label}</div>
    </div>
  );
}
