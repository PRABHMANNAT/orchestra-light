"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Hash, Mail, MessageCircle, Search, Sparkles, type LucideIcon } from "lucide-react";
import { toast } from "sonner";

import { StageShell } from "@/components/layout/StageShell";
import { OrchestraButton } from "@/components/shared/OrchestraButton";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { cardHover, fadeSlideUp, heightReveal, pageContainer, slideInLeft, staggerContainer } from "@/lib/animations";
import { mockThreads } from "@/lib/mockData";
import type { CommunicationThread, MessageChannel, MessageClassification } from "@/lib/types";
import { cn } from "@/lib/utils";

type FilterKey = "all" | "scope" | "decisions" | "blockers" | "contradictions" | "questions";

const channelMeta: Record<MessageChannel, { icon: LucideIcon; label: string; tone: "blue" | "violet" | "green"; dot: string }> = {
  gmail: { icon: Mail, label: "Gmail", tone: "blue", dot: "var(--blue)" },
  slack: { icon: Hash, label: "Slack", tone: "violet", dot: "var(--violet)" },
  whatsapp: { icon: MessageCircle, label: "WhatsApp Business", tone: "green", dot: "var(--emerald)" }
};

const filters: Array<{ key: FilterKey; label: string; classifications?: MessageClassification[] }> = [
  { key: "all", label: "All" },
  { key: "scope", label: "Scope Changes", classifications: ["scope_change"] },
  { key: "decisions", label: "Decisions", classifications: ["decision_made"] },
  { key: "blockers", label: "Blockers", classifications: ["blocker"] },
  { key: "contradictions", label: "Contradictions", classifications: ["contradiction"] },
  { key: "questions", label: "Open Questions", classifications: ["clarification_needed", "engineering_uncertainty"] }
];

function classificationVariant(classification: MessageClassification) {
  switch (classification) {
    case "scope_change":
    case "risk_signal":
      return "in-review" as const;
    case "blocker":
    case "contradiction":
      return "blocked" as const;
    case "decision_made":
      return "done" as const;
    case "clarification_needed":
    case "approval_request":
      return "info" as const;
    default:
      return "todo" as const;
  }
}

function formatTimestamp(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

function threadInsights(thread: CommunicationThread) {
  return thread.messages.flatMap((message) => (message.insight ? [message.insight] : []));
}

function threadMatchesFilter(thread: CommunicationThread, filter: (typeof filters)[number]) {
  if (!filter.classifications) return true;
  const classifications = threadInsights(thread).map((insight) => insight.classification);
  return classifications.some((classification) => filter.classifications?.includes(classification));
}

export function ClientComms({ projectId }: { projectId: string }) {
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");
  const [query, setQuery] = useState("");
  const [expandedThreadId, setExpandedThreadId] = useState<string>(mockThreads[0]?.id ?? "");

  const activeFilterSpec = filters.find((filter) => filter.key === activeFilter) ?? filters[0];
  const threads = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return mockThreads
      .filter((thread) => thread.projectId === projectId || projectId !== "bloomfast")
      .filter((thread) => threadMatchesFilter(thread, activeFilterSpec))
      .filter((thread) => {
        if (!normalized) return true;
        return [
          thread.subject,
          thread.linkedProjectArea,
          ...thread.participants,
          ...thread.messages.map((message) => `${message.sender} ${message.content}`)
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(normalized);
      })
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }, [activeFilterSpec, projectId, query]);

  return (
    <StageShell showGrid>
      <motion.div variants={pageContainer} initial="hidden" animate="show" className="project-page-container">
        <SectionHeader
          label="Communications"
          title="CLIENT SIGNALS"
          subtitle="Gmail, Slack, and WhatsApp interpreted against the BloomFast product brain."
          accentColor="var(--blue)"
        />

        <div className="grid gap-6 2xl:grid-cols-[220px_1fr]">
          <motion.aside variants={fadeSlideUp} className="space-y-4">
            <div className="glass-heavy glass-noise rounded-xl px-4 py-4">
              <div className="mb-3 font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--text-muted)]">Channels</div>
              <div className="space-y-2">
                {(Object.keys(channelMeta) as MessageChannel[]).map((channel) => {
                  const meta = channelMeta[channel];
                  const Icon = meta.icon;
                  return (
                    <motion.div key={channel} initial="rest" animate="rest" whileHover="hover" variants={cardHover} className="glass-sm rounded-lg px-3 py-3">
                      <div className="flex items-center gap-2">
                        <Icon size={14} style={{ color: meta.dot }} />
                        <span className="flex-1 font-ui text-[12px] text-[var(--text-primary)]">{meta.label}</span>
                        <span className="h-[6px] w-[6px] rounded-full bg-[var(--emerald)] shadow-[0_0_8px_rgba(52,211,153,0.7)]" />
                      </div>
                      <div className="mt-2 font-mono text-[8px] uppercase tracking-[0.12em] text-[var(--emerald)]">connected</div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <div className="glass-sm rounded-xl px-4 py-4">
              <div className="mb-3 font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--text-muted)]">Classifications</div>
              <div className="flex flex-wrap gap-2">
                {filters.map((filter) => (
                  <button
                    key={filter.key}
                    type="button"
                    onClick={() => setActiveFilter(filter.key)}
                    className={cn(
                      "rounded-md border px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.12em]",
                      activeFilter === filter.key
                        ? "border-[var(--cyan-border)] bg-[var(--cyan-dim)] text-[var(--cyan)]"
                        : "border-[rgba(255,255,255,0.06)] text-[var(--text-muted)]"
                    )}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.aside>

          <motion.main variants={fadeSlideUp} className="space-y-4">
            <div className="glass-sm flex items-center gap-3 rounded-xl px-4 py-3">
              <Search size={14} className="text-[var(--text-muted)]" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="flex-1 bg-transparent font-ui text-[13px] text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)]"
                placeholder="Search by sender, subject, project area, or message..."
              />
              <Badge variant="cyan">{threads.length} THREADS</Badge>
            </div>

            <motion.div variants={staggerContainer(0.06, 0.02)} initial="hidden" animate="show" className="space-y-3">
              {threads.map((thread) => {
                const meta = channelMeta[thread.channel];
                const Icon = meta.icon;
                const insights = threadInsights(thread);
                const firstMessage = thread.messages[0];
                const isExpanded = expandedThreadId === thread.id;

                return (
                  <motion.div key={thread.id} variants={slideInLeft}>
                    <motion.div initial="rest" animate="rest" whileHover="hover" variants={cardHover} className="glass glass-noise overflow-hidden rounded-xl">
                      <button
                        type="button"
                        onClick={() => setExpandedThreadId(isExpanded ? "" : thread.id)}
                        className="w-full px-5 py-4 text-left"
                      >
                        <div className="flex flex-wrap items-start gap-4">
                          <div
                            className={cn(
                              "flex h-9 w-9 items-center justify-center rounded-lg",
                              thread.channel === "gmail" ? "glass-blue" : thread.channel === "slack" ? "glass-violet" : "glass-emerald"
                            )}
                          >
                            <Icon size={16} style={{ color: meta.dot }} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-ui text-[13px] font-medium text-[var(--text-primary)]">{firstMessage?.sender}</span>
                              <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-[var(--text-muted)]">
                                {formatTimestamp(thread.updatedAt)}
                              </span>
                              {thread.linkedProjectArea ? <Badge variant="cyan">{thread.linkedProjectArea}</Badge> : null}
                            </div>
                            <div className="mt-1 truncate font-ui text-[13px] text-[var(--text-secondary)]">
                              {thread.subject ?? firstMessage?.content}
                            </div>
                          </div>
                          <div className="flex shrink-0 flex-wrap justify-end gap-2">
                            {insights.map((insight) => (
                              <StatusBadge key={insight.id} variant={classificationVariant(insight.classification)}>
                                {insight.classification.replaceAll("_", " ")}
                              </StatusBadge>
                            ))}
                          </div>
                        </div>
                      </button>

                      <AnimatePresence initial={false}>
                        {isExpanded ? (
                          <motion.div variants={heightReveal} initial="hidden" animate="show" exit="exit" className="border-t border-[rgba(255,255,255,0.05)] px-5 py-4">
                            <div className="space-y-4">
                              {thread.messages.map((message) => {
                                const MessageIcon = channelMeta[message.channel].icon;
                                return (
                                  <div key={message.id} className="glass-sm rounded-xl px-4 py-4">
                                    <div className="mb-2 flex flex-wrap items-center gap-2">
                                      <MessageIcon size={12} style={{ color: channelMeta[message.channel].dot }} />
                                      <span className="font-ui text-[12px] text-[var(--text-primary)]">{message.sender}</span>
                                      <span className="font-mono text-[9px] text-[var(--text-muted)]">{formatTimestamp(message.timestamp)}</span>
                                    </div>
                                    <div className="font-ui text-[13px] leading-6 text-[var(--text-secondary)]">{message.content}</div>

                                    {message.insight ? (
                                      <div className="mt-4 rounded-xl border border-[var(--violet-border)] bg-[var(--violet-dim)] px-4 py-4">
                                        <div className="mb-3 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--violet)]">
                                          <Sparkles size={12} />
                                          Insight
                                        </div>
                                        <div className="grid gap-3 md:grid-cols-2">
                                          <div>
                                            <div className="font-mono text-[8px] uppercase tracking-[0.12em] text-[var(--text-muted)]">Classification</div>
                                            <div className="mt-1">
                                              <StatusBadge variant={classificationVariant(message.insight.classification)}>
                                                {message.insight.classification.replaceAll("_", " ")}
                                              </StatusBadge>
                                            </div>
                                          </div>
                                          <div>
                                            <div className="font-mono text-[8px] uppercase tracking-[0.12em] text-[var(--text-muted)]">Confidence</div>
                                            <div className="mt-1 font-mono text-[11px] text-[var(--violet)]">
                                              {Math.round(message.insight.confidence * 100)}%
                                            </div>
                                          </div>
                                          <div>
                                            <div className="font-mono text-[8px] uppercase tracking-[0.12em] text-[var(--text-muted)]">Mapped Area</div>
                                            <div className="mt-1 font-ui text-[12px] text-[var(--text-primary)]">{message.insight.mappedProjectArea}</div>
                                          </div>
                                          <div>
                                            <div className="font-mono text-[8px] uppercase tracking-[0.12em] text-[var(--text-muted)]">DAG Node</div>
                                            <div className="mt-1 font-mono text-[10px] text-[var(--cyan)]">
                                              {message.insight.mappedDAGNodeId ?? "not mapped"}
                                            </div>
                                          </div>
                                        </div>
                                        {message.insight.suggestedAction ? (
                                          <div className="mt-3 border-l-2 border-[var(--violet-border)] pl-3 font-ui text-[12px] leading-6 text-[var(--text-secondary)]">
                                            {message.insight.suggestedAction}
                                          </div>
                                        ) : null}
                                        <div className="mt-4 flex flex-wrap gap-2">
                                          <OrchestraButton variant="primary" size="sm" onClick={() => toast.success("Insight approved")}>
                                            Approve Insight
                                          </OrchestraButton>
                                          <OrchestraButton variant="ghost" size="sm" onClick={() => toast.message("Override queued")}>
                                            Override
                                          </OrchestraButton>
                                        </div>
                                      </div>
                                    ) : null}
                                  </div>
                                );
                              })}
                            </div>
                          </motion.div>
                        ) : null}
                      </AnimatePresence>
                    </motion.div>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.main>
        </div>
      </motion.div>
    </StageShell>
  );
}
