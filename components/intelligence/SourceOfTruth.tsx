"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Code2, FileText, GitMerge, Hash, Layers, Mic, Sparkles, UploadCloud } from "lucide-react";
import { toast } from "sonner";

import { StageShell } from "@/components/layout/StageShell";
import { OrchestraButton } from "@/components/shared/OrchestraButton";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { TerminalOutput } from "@/components/shared/TerminalOutput";
import {
  aiTaskQueue,
  brainDocuments,
  getTeamMemberById,
  getTruthDocumentsForProject,
  getTruthRequirementsForDocument,
  type ExtractedTaskRecord,
  type TruthDocumentRecord
} from "@/lib/mockData";
import { chipBounce, fadeIn, fadeSlideUp, fadeSlideUpFast, pageContainer, slideInLeft, staggerContainer } from "@/lib/animations";

type FilterOption = "ALL" | "SPECS" | "RECORDINGS" | "DOCS" | "CHAT EXPORTS";
type QueueTask = ExtractedTaskRecord & { requirementId?: string };

const filterMap: Record<FilterOption, TruthDocumentRecord["type"] | "all"> = {
  ALL: "all",
  SPECS: "client-spec",
  RECORDINGS: "recording",
  DOCS: "document",
  "CHAT EXPORTS": "slack-export"
};

const iconMap = {
  FileText,
  Mic,
  Layers,
  Hash,
  Code2
} as const;

const pushLines = [
  { text: "These docs turned into backlog items.", delay: 140 },
  { text: "Owners and priorities are set.", delay: 140 },
  { text: "The queue is ready for Jira.", delay: 140 },
  { text: "Synced. ✓", delay: 140 }
];

function normalizeStatus(status: QueueTask["status"]) {
  switch (status) {
    case "IN_PROGRESS":
      return "in-progress";
    case "IN_REVIEW":
      return "in-review";
    case "DONE":
      return "done";
    default:
      return "todo";
  }
}

function buildInitialQueue(projectId: string) {
  const documents = getTruthDocumentsForProject(projectId);
  return documents.reduce<Record<string, QueueTask[]>>((accumulator, document) => {
    accumulator[document.id] = aiTaskQueue.filter((task) => task.source === document.id).map((task) => ({ ...task }));
    return accumulator;
  }, {});
}

export function SourceOfTruth({ projectId }: { projectId: string }) {
  const [filter, setFilter] = useState<FilterOption>("ALL");
  const documents = useMemo(() => getTruthDocumentsForProject(projectId), [projectId]);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(documents[0]?.id ?? null);
  const [queueByDoc, setQueueByDoc] = useState<Record<string, QueueTask[]>>(() => buildInitialQueue(projectId));
  const [pushing, setPushing] = useState(false);
  const [pushed, setPushed] = useState(false);

  const visibleDocuments = useMemo(() => {
    const activeFilter = filterMap[filter];
    if (activeFilter === "all") return documents;
    return documents.filter((document) => document.type === activeFilter);
  }, [documents, filter]);

  const selectedDocument =
    documents.find((document) => document.id === selectedDocId) ??
    visibleDocuments[0] ??
    documents[0] ??
    null;

  const requirements = selectedDocument ? getTruthRequirementsForDocument(selectedDocument.id) : [];
  const queuedTasks = selectedDocument ? queueByDoc[selectedDocument.id] ?? [] : [];
  const convertedRequirementIds = new Set(queuedTasks.map((task) => task.requirementId).filter(Boolean));

  const convertRequirement = (requirementId: string) => {
    if (!selectedDocument) return;

    const requirement = requirements.find((item) => item.id === requirementId);
    if (!requirement) return;
    if (convertedRequirementIds.has(requirement.id)) return;

    const newTask: QueueTask = {
      id: `gen-${requirement.id}`,
      source: selectedDocument.id,
      task: requirement.text,
      priority: requirement.priority,
      assignee: requirement.assignee,
      estimatedHours: 6,
      status: "TODO",
      requirementId: requirement.id
    };

    setQueueByDoc((current) => ({
      ...current,
      [selectedDocument.id]: [...(current[selectedDocument.id] ?? []), newTask]
    }));
    toast.success("Requirement converted to task");
  };

  const convertAllRequirements = () => {
    if (!selectedDocument) return;

    const nextTasks = requirements
      .filter((requirement) => !convertedRequirementIds.has(requirement.id))
      .map<QueueTask>((requirement) => ({
        id: `gen-${requirement.id}`,
        source: selectedDocument.id,
        task: requirement.text,
        priority: requirement.priority,
        assignee: requirement.assignee,
        estimatedHours: 6,
        status: "TODO",
        requirementId: requirement.id
      }));

    if (nextTasks.length === 0) {
      toast.message("All visible requirements are already queued");
      return;
    }

    setQueueByDoc((current) => ({
      ...current,
      [selectedDocument.id]: [...(current[selectedDocument.id] ?? []), ...nextTasks]
    }));
    toast.success(`${nextTasks.length} requirements added to the task queue`);
  };

  return (
    <StageShell showGrid>
      <motion.div variants={pageContainer} initial="hidden" animate="show" className="mx-auto max-w-7xl space-y-6 px-8 py-8">
        <SectionHeader
          label="Context"
          title="EVERYTHING JACK GAVE US."
          subtitle="Every spec, recording, and doc — processed into tasks."
          accentColor="var(--violet)"
        />

        <div className="grid gap-6 xl:grid-cols-[0.82fr_1.18fr]">
          <motion.div variants={fadeSlideUp} className="space-y-4">
            <div className="glass-sm rounded-lg px-4 py-3">
              <div className="flex items-center gap-3">
                <UploadCloud size={16} className="text-[var(--violet)]" />
                <div className="font-ui text-[12px] text-[var(--text-muted)]">
                  Drop anything Jack sent — PDF, audio, Notion, Figma, Slack export
                </div>
                <div className="ml-auto">
                  <OrchestraButton variant="secondary" size="sm" onClick={() => toast.success("Queued for processing")}>
                    Read it
                  </OrchestraButton>
                </div>
              </div>
            </div>

            <motion.div variants={staggerContainer(0.05, 0.02)} initial="hidden" animate="show" className="flex flex-wrap gap-2">
              {(["ALL", "SPECS", "RECORDINGS", "DOCS", "CHAT EXPORTS"] as FilterOption[]).map((option) => (
                <motion.button
                  key={option}
                  type="button"
                  variants={chipBounce}
                  onClick={() => setFilter(option)}
                  className={`rounded-lg px-3 py-2 font-mono text-[9px] tracking-[0.12em] ${
                    filter === option ? "glass-violet text-[var(--violet)]" : "glass-sm text-[var(--text-muted)]"
                  }`}
                >
                  {option}
                </motion.button>
              ))}
            </motion.div>

            <motion.div variants={staggerContainer(0.06, 0.04)} initial="hidden" animate="show" className="space-y-2">
              {visibleDocuments.map((document) => {
                const Icon = iconMap[document.icon];
                const isActive = selectedDocument?.id === document.id;

                return (
                  <motion.button
                    key={document.id}
                    type="button"
                    variants={slideInLeft}
                    onClick={() => setSelectedDocId(document.id)}
                    className={`glass glass-hover w-full rounded-xl px-4 py-4 text-left ${isActive ? "glass-violet" : ""}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="glass-violet flex h-8 w-8 items-center justify-center rounded-lg">
                        <Icon size={16} className="text-[var(--violet)]" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate font-ui text-[13px] font-medium text-[var(--text-primary)]">{document.title}</div>
                        <div className="mt-1 font-mono text-[9px] tracking-[0.12em] text-[var(--text-muted)]">
                          {document.source} · {document.date}
                        </div>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {document.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-sm border border-[rgba(255,255,255,0.06)] px-2 py-0.5 font-mono text-[9px] tracking-[0.1em] text-[var(--text-muted)]"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      {document.status === "processed" ? (
                        <div className="glass-emerald rounded-sm px-2 py-1 font-mono text-[9px] tracking-[0.12em] text-[var(--emerald)]">
                          ✓ {document.extractedRequirements} REQUIREMENTS
                        </div>
                      ) : (
                        <div className="glass-amber inline-flex items-center gap-2 rounded-sm px-2 py-1 font-mono text-[9px] tracking-[0.12em] text-[var(--amber)]">
                          <motion.span
                            className="h-[5px] w-[5px] rounded-full bg-[var(--amber)]"
                            animate={{ opacity: [0.4, 1, 0.4] }}
                            transition={{ duration: 1.2, repeat: Infinity }}
                          />
                          Reading...
                        </div>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </motion.div>
          </motion.div>

          <motion.div variants={fadeSlideUp} className="space-y-4">
            <AnimatePresence mode="wait">
              {!selectedDocument ? (
                <motion.div
                  key="empty"
                  variants={fadeIn}
                  initial="hidden"
                  animate="show"
                  exit="hidden"
                  className="glass-violet rounded-xl py-16 text-center"
                >
                  <GitMerge size={28} className="mx-auto text-[var(--violet)] opacity-50" />
                  <div className="mt-3 font-ui text-[14px] text-[var(--text-muted)]">Nothing selected.</div>
                  <div className="mt-1 font-ui text-[13px] text-[var(--text-secondary)]">
                    Pick a document to see what Orchestra extracted.
                  </div>
                </motion.div>
              ) : (
                <motion.div key={selectedDocument.id} variants={fadeIn} initial="hidden" animate="show" exit="hidden" className="space-y-4">
                  <div className="glass-heavy glass-noise rounded-xl px-6 py-5">
                    <div className="font-ui text-[16px] font-medium text-[var(--text-primary)]">{selectedDocument.title}</div>
                    <div className="mt-1 font-mono text-[10px] tracking-[0.12em] text-[var(--text-muted)]">
                      {selectedDocument.source} · {selectedDocument.date}
                    </div>
                    <div className="mt-3 border-l-2 border-[var(--violet-border)] pl-3 font-ui text-[13px] leading-6 text-[var(--text-secondary)]">
                      {selectedDocument.summary}
                    </div>
                    <div className="mt-4 inline-flex items-center gap-2 font-mono text-[9px] tracking-[0.15em] text-[var(--violet)]">
                      <Sparkles size={12} />
                      Read by Orchestra
                    </div>
                  </div>

                  <div className="glass rounded-xl px-5 py-5">
                    <div className="mb-4 flex items-center justify-between gap-4">
                      <div className="font-mono text-[10px] tracking-[0.15em] text-[var(--violet)]">What Orchestra found</div>
                      <div className="glass-violet rounded-sm px-2 py-1 font-mono text-[9px] tracking-[0.12em] text-[var(--violet)]">
                        {selectedDocument.extractedRequirements} found
                      </div>
                    </div>

                    <motion.div variants={staggerContainer(0.05, 0.05)} initial="hidden" animate="show">
                      {requirements.map((requirement, index) => (
                        <motion.div
                          key={requirement.id}
                          variants={fadeSlideUpFast}
                          className="flex items-start gap-4 border-b border-[rgba(255,255,255,0.04)] py-3 last:border-b-0"
                        >
                          <div className="pt-1 font-mono text-[10px] tracking-[0.12em] text-[var(--text-muted)]">R{index + 1}</div>
                          <div className="min-w-0 flex-1">
                            <div className="font-ui text-[13px] leading-6 text-[var(--text-primary)]">{requirement.text}</div>
                            <div className="mt-1 font-mono text-[9px] italic tracking-[0.08em] text-[var(--text-muted)]">
                              {requirement.sourceRef}
                            </div>
                          </div>
                          {convertedRequirementIds.has(requirement.id) ? (
                            <div className="glass-emerald rounded-sm px-2 py-1 font-mono text-[9px] tracking-[0.12em] text-[var(--emerald)]">
                              Task made ✓
                            </div>
                          ) : (
                            <OrchestraButton variant="secondary" size="sm" onClick={() => convertRequirement(requirement.id)}>
                              Make task
                            </OrchestraButton>
                          )}
                        </motion.div>
                      ))}
                    </motion.div>

                    <div className="mt-4">
                      <OrchestraButton variant="primary" onClick={convertAllRequirements}>
                        Convert to Tasks
                      </OrchestraButton>
                    </div>
                  </div>

                  <div className="glass-cyan rounded-xl px-5 py-5">
                    <div className="mb-4 flex items-center justify-between gap-4">
                      <div className="font-mono text-[10px] tracking-[0.15em] text-[var(--cyan)]">TASK QUEUE</div>
                      <div className="glass-sm rounded-sm px-2 py-1 font-mono text-[9px] tracking-[0.12em] text-[var(--text-secondary)]">
                        {queuedTasks.length} READY FOR JIRA
                      </div>
                    </div>

                    <motion.div variants={staggerContainer(0.05, 0.04)} initial="hidden" animate="show" className="space-y-2">
                      {queuedTasks.map((task) => {
                        const assignee = getTeamMemberById(task.assignee);
                        const sourceDocument = brainDocuments.find((document) => document.id === task.source);

                        return (
                          <motion.div key={task.id} variants={fadeSlideUpFast} className="glass-sm rounded-xl px-5 py-4">
                            <div className="flex items-start justify-between gap-4">
                              <StatusBadge variant={task.priority.toLowerCase() as "p0" | "p1" | "p2" | "p3"} />
                              <div className="font-mono text-[9px] tracking-[0.12em] text-[var(--text-muted)]">
                                {task.estimatedHours ?? 0}h
                              </div>
                            </div>
                            <div className="mt-2 font-ui text-[14px] font-medium text-[var(--text-primary)]">
                              {task.task}
                            </div>
                            <div className="mt-1 font-mono text-[9px] tracking-[0.08em] text-[var(--text-muted)]">
                              from {sourceDocument?.title ?? task.source}
                            </div>
                            <div className="mt-3 flex items-center justify-between gap-3">
                              <div className="flex items-center gap-2">
                                {assignee ? (
                                  <div className="glass-sm flex h-5 w-5 items-center justify-center rounded-full font-mono text-[9px] text-[var(--text-primary)]">
                                    {assignee.avatar}
                                  </div>
                                ) : null}
                                <span className="font-ui text-[11px] text-[var(--text-secondary)]">{assignee?.name ?? "Unassigned"}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => toast.success(`${task.task} approved`)}
                                  className="glass-emerald flex h-8 w-8 items-center justify-center rounded-lg font-mono text-[11px] text-[var(--emerald)]"
                                >
                                  ✓
                                </button>
                                <OrchestraButton variant="ghost" size="sm" onClick={() => toast.message(`Edit ${task.id}`)}>
                                  Edit
                                </OrchestraButton>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setQueueByDoc((current) => ({
                                      ...current,
                                      [selectedDocument.id]: (current[selectedDocument.id] ?? []).filter((queueTask) => queueTask.id !== task.id)
                                    }))
                                  }
                                  className="glass-rose flex h-8 w-8 items-center justify-center rounded-lg font-mono text-[11px] text-[var(--rose)]"
                                >
                                  ✕
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </motion.div>

                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      {queuedTasks.length > 0 ? (
                        <OrchestraButton variant="ghost" size="sm" onClick={() => toast.success(`Approved all ${queuedTasks.length}`)}>
                          Approve all {queuedTasks.length}
                        </OrchestraButton>
                      ) : null}
                      <OrchestraButton
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          setPushing(true);
                          setPushed(false);
                        }}
                      >
                        Sync
                      </OrchestraButton>
                    </div>

                    <AnimatePresence>
                      {pushing ? (
                        <motion.div key="push-terminal" variants={fadeIn} initial="hidden" animate="show" exit="hidden" className="mt-4">
                          <TerminalOutput
                            label="JIRA"
                            lines={pushLines}
                            tone="cyan"
                            onComplete={() => {
                              setPushing(false);
                              setPushed(true);
                              toast.success("Task queue pushed to Jira");
                            }}
                          />
                        </motion.div>
                      ) : null}
                    </AnimatePresence>

                    {pushed ? (
                      <div className="mt-3 font-mono text-[10px] tracking-[0.12em] text-[var(--emerald)]">Synced.</div>
                    ) : null}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.div>
    </StageShell>
  );
}
