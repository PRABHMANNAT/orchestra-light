"use client";

import { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, HelpCircle, History, MessageSquare, Search, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { StageShell } from "@/components/layout/StageShell";
import { OrchestraButton } from "@/components/shared/OrchestraButton";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { TerminalOutput } from "@/components/shared/TerminalOutput";
import { Badge } from "@/components/ui/badge";
import { cardHover, fadeSlideUp, fadeSlideUpFast, pageContainer, staggerContainer } from "@/lib/animations";
import {
  mockChanges,
  mockClarifiedBrief,
  mockDecisions,
  mockSourcePackage,
  mockSummaryBundles,
  mockThreads,
  type TerminalLine
} from "@/lib/mockData";
import type { MessageClassification, MessageInsight } from "@/lib/types";
import { cn } from "@/lib/utils";

type FeedTab = "all" | "scope" | "decisions" | "blockers" | "contradictions" | "questions" | "risks";

type FeedItem = {
  id: string;
  preview: string;
  sender: string;
  timestamp: string;
  insight: MessageInsight;
  effectiveClassification: MessageClassification;
};

const feedTabs: Array<{ key: FeedTab; label: string; classifications?: MessageClassification[] }> = [
  { key: "all", label: "All" },
  { key: "scope", label: "Scope Changes", classifications: ["scope_change"] },
  { key: "decisions", label: "Decisions", classifications: ["decision_made"] },
  { key: "blockers", label: "Blockers", classifications: ["blocker"] },
  { key: "contradictions", label: "Contradictions", classifications: ["contradiction"] },
  { key: "questions", label: "Questions", classifications: ["clarification_needed", "engineering_uncertainty"] },
  { key: "risks", label: "Risk Signals", classifications: ["risk_signal", "client_concern"] }
];

function effectiveClassification(insight: MessageInsight): MessageClassification {
  if (insight.suggestedAction?.toLowerCase().includes("contradict")) return "contradiction";
  return insight.classification;
}

function statusForClassification(classification: MessageClassification) {
  switch (classification) {
    case "scope_change":
    case "risk_signal":
    case "client_concern":
      return "in-review" as const;
    case "contradiction":
    case "blocker":
      return "blocked" as const;
    case "decision_made":
      return "done" as const;
    case "clarification_needed":
    case "engineering_uncertainty":
      return "info" as const;
    default:
      return "todo" as const;
  }
}

function buildFeedItems(): FeedItem[] {
  return mockThreads.flatMap((thread) =>
    thread.messages.flatMap((message) => {
      if (!message.insight) return [];

      return [
        {
          id: message.insight.id,
          preview: message.content,
          sender: message.sender,
          timestamp: message.timestamp,
          insight: message.insight,
          effectiveClassification: effectiveClassification(message.insight)
        }
      ];
    })
  );
}

function StatCard({ label, value, tone }: { label: string; value: number; tone: "cyan" | "amber" | "emerald" | "rose" | "blue" }) {
  return (
    <motion.div variants={fadeSlideUp}>
      <motion.div initial="rest" animate="rest" whileHover="hover" variants={cardHover} className="glass glass-noise rounded-xl px-5 py-5">
        <div className="font-display text-[46px] leading-none" style={{ color: `var(--${tone})` }}>
          {value}
        </div>
        <div className="mt-2 font-ui text-[12px] text-[var(--text-secondary)]">{label}</div>
      </motion.div>
    </motion.div>
  );
}

function ConfidenceIndicator({ value }: { value: number }) {
  const filled = Math.round(value * 5);
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, index) => (
        <span
          key={index}
          className={cn("h-[3px] w-5 rounded-full", index < filled ? "bg-[var(--cyan)]" : "bg-[rgba(255,255,255,0.08)]")}
        />
      ))}
      <span className="ml-1 font-mono text-[9px] text-[var(--text-muted)]">{Math.round(value * 100)}%</span>
    </div>
  );
}

function linesFromResponse(content: string): TerminalLine[] {
  const chunks = content
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);

  return (chunks.length ? chunks : [content]).map((line) => ({ text: line, delay: 110 }));
}

export function ProductIntel({ projectId }: { projectId: string }) {
  const [activeTab, setActiveTab] = useState<FeedTab>("all");
  const [reviewedIds, setReviewedIds] = useState<Set<string>>(() => new Set(mockThreads.flatMap((thread) => thread.messages.flatMap((message) => (message.insight?.reviewedByHuman ? [message.insight.id] : [])))));
  const [input, setInput] = useState("");
  const [answer, setAnswer] = useState<TerminalLine[]>([
    {
      text: "Use this archive for deeper Socrates queries. The side panel handles quick questions while you work.",
      delay: 100
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const feedItems = useMemo(() => buildFeedItems(), []);
  const visibleItems = useMemo(() => {
    const tab = feedTabs.find((item) => item.key === activeTab) ?? feedTabs[0];
    if (!tab.classifications) return feedItems;
    return feedItems.filter((item) => tab.classifications?.includes(item.effectiveClassification));
  }, [activeTab, feedItems]);

  const contradictionItem = feedItems.find((item) => item.effectiveClassification === "contradiction");

  const stats = {
    scope: feedItems.filter((item) => item.effectiveClassification === "scope_change").length,
    decisions: mockDecisions.filter((decision) => decision.status === "final").length,
    blockers: feedItems.filter((item) => item.effectiveClassification === "blocker").length,
    contradictions: feedItems.filter((item) => item.effectiveClassification === "contradiction").length,
    questions: feedItems.filter((item) => item.effectiveClassification === "clarification_needed").length,
    unreviewed: feedItems.filter((item) => !reviewedIds.has(item.id)).length
  };

  const systemPrompt = useMemo(
    () => `You are Socrates inside Orchestra, a PRD-aware communication and understanding platform for client-facing software teams.

Project context:
Source package: ${JSON.stringify(mockSourcePackage)}
Clarified brief: ${JSON.stringify(mockClarifiedBrief)}
Threads: ${JSON.stringify(mockThreads)}
Decisions: ${JSON.stringify(mockDecisions)}
Changes: ${JSON.stringify(mockChanges)}

Answer as Sarah's project-brain assistant. Be direct, cite what record or thread supports the answer, and distinguish accepted facts from unresolved client requests.`,
    []
  );

  const askSocrates = async () => {
    const content = input.trim();
    if (!content || isLoading) return;

    setIsLoading(true);
    setInput("");
    if (inputRef.current) inputRef.current.style.height = "auto";

    const apiKey = process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY;

    if (!apiKey) {
      setAnswer(
        linesFromResponse(
          "Anthropic API key missing. Based on local context: Jack re-requested Pro subscription after it was scoped out, and he added manager approval before driver assignment. Treat both as change records until Sarah approves them."
        )
      );
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "anthropic-version": "2023-06-01",
          "x-api-key": apiKey
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 900,
          system: systemPrompt,
          messages: [
            {
              role: "user",
              content: [{ type: "text", text: content }]
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`Anthropic returned ${response.status}`);
      }

      const payload = await response.json();
      const assistantText =
        payload?.content
          ?.filter((item: { type?: string; text?: string }) => item?.type === "text")
          .map((item: { text?: string }) => item.text ?? "")
          .join("\n\n") ?? "No response returned.";

      setAnswer(linesFromResponse(assistantText));
    } catch (error) {
      setAnswer(linesFromResponse(error instanceof Error ? `Socrates could not respond: ${error.message}` : "Socrates could not respond."));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <StageShell showGrid>
      <motion.div variants={pageContainer} initial="hidden" animate="show" className="project-page-container">
        <SectionHeader
          label="Intelligence"
          title="INTELLIGENCE ARCHIVE"
          subtitle="Reviewed classifications, Socrates query history, and project-health evidence. Quick Socrates access stays in the side panel on every project screen."
          accentColor="var(--violet)"
        />

        <motion.section variants={staggerContainer(0.06, 0.02)} initial="hidden" animate="show" className="grid gap-4 md:grid-cols-2 2xl:grid-cols-6">
          <StatCard label="Scope Changes" value={stats.scope} tone="amber" />
          <StatCard label="Decisions Made" value={stats.decisions} tone="emerald" />
          <StatCard label="Blockers" value={stats.blockers} tone="rose" />
          <StatCard label="Contradictions" value={stats.contradictions} tone="rose" />
          <StatCard label="Open Questions" value={stats.questions} tone="blue" />
          <StatCard label="Unreviewed Insights" value={stats.unreviewed} tone="cyan" />
        </motion.section>

        <motion.section variants={fadeSlideUp} className="glass-heavy glass-noise rounded-xl px-5 py-5">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            {feedTabs.map((tab) => {
              const count = tab.classifications ? feedItems.filter((item) => tab.classifications?.includes(item.effectiveClassification)).length : feedItems.length;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={cn(
                    "rounded-md border px-3 py-2 font-ui text-[11px]",
                    activeTab === tab.key
                      ? "border-[var(--violet-border)] bg-[var(--violet-dim)] text-[var(--violet)]"
                      : "border-[rgba(255,255,255,0.06)] text-[var(--text-secondary)]"
                  )}
                >
                  {tab.label} <span className="ml-1 font-mono text-[9px]">{count}</span>
                </button>
              );
            })}
          </div>

          <motion.div variants={staggerContainer(0.05, 0.03)} initial="hidden" animate="show" className="space-y-3">
            {visibleItems.map((item) => (
              <motion.div key={item.id} variants={fadeSlideUpFast}>
                <motion.div initial="rest" animate="rest" whileHover="hover" variants={cardHover} className="glass-sm rounded-xl px-4 py-4">
                  <div className="flex flex-wrap items-start gap-4">
                    <div className="glass-violet flex h-9 w-9 items-center justify-center rounded-lg">
                      {item.effectiveClassification === "contradiction" ? (
                        <AlertTriangle size={16} className="text-[var(--rose)]" />
                      ) : item.effectiveClassification === "clarification_needed" ? (
                        <HelpCircle size={16} className="text-[var(--blue)]" />
                      ) : (
                        <MessageSquare size={16} className="text-[var(--violet)]" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <StatusBadge variant={statusForClassification(item.effectiveClassification)}>
                          {item.effectiveClassification.replaceAll("_", " ")}
                        </StatusBadge>
                        <Badge variant="cyan">{item.insight.mappedProjectArea}</Badge>
                        {item.insight.mappedDAGNodeId ? <span className="font-mono text-[9px] text-[var(--cyan)]">{item.insight.mappedDAGNodeId}</span> : null}
                      </div>
                      <div className="mt-2 font-ui text-[13px] leading-6 text-[var(--text-primary)]">{item.preview}</div>
                      <div className="mt-3 flex flex-wrap items-center gap-3">
                        <ConfidenceIndicator value={item.insight.confidence} />
                        {reviewedIds.has(item.id) ? (
                          <span className="inline-flex items-center gap-1 font-mono text-[9px] uppercase tracking-[0.12em] text-[var(--emerald)]">
                            <CheckCircle2 size={11} />
                            reviewed
                          </span>
                        ) : (
                          <OrchestraButton
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setReviewedIds((current) => new Set([...current, item.id]));
                              toast.success("Insight reviewed");
                            }}
                          >
                            Review
                          </OrchestraButton>
                        )}
                      </div>
                    </div>
                  </div>

                  {item.effectiveClassification === "contradiction" ? (
                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                      <div className="rounded-lg border border-[var(--amber-border)] bg-[var(--amber-dim)] px-4 py-3">
                        <div className="font-mono text-[9px] uppercase tracking-[0.14em] text-[var(--amber)]">Brief says</div>
                        <div className="mt-2 font-ui text-[12px] leading-6 text-[var(--text-secondary)]">
                          Pro subscription is deferred to post-MVP. MVP uses flat 70% revenue share.
                        </div>
                      </div>
                      <div className="rounded-lg border border-[var(--rose-border)] bg-[var(--rose-dim)] px-4 py-3">
                        <div className="font-mono text-[9px] uppercase tracking-[0.14em] text-[var(--rose)]">Message says</div>
                        <div className="mt-2 font-ui text-[12px] leading-6 text-[var(--text-primary)]">
                          Jack wants Pro subscription with 85% revenue share included in MVP.
                        </div>
                      </div>
                    </div>
                  ) : null}
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        <div className="grid gap-6 2xl:grid-cols-[1.05fr_0.95fr]">
          <motion.section variants={fadeSlideUp} className="glass-violet glass-noise rounded-xl px-5 py-5">
            <div className="mb-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--violet)]">
              <Sparkles size={14} />
              Deep Socrates Query
            </div>
            <textarea
              ref={inputRef}
              value={input}
              rows={3}
              onChange={(event) => {
                setInput(event.target.value);
                const element = event.currentTarget;
                element.style.height = "auto";
                element.style.height = `${Math.min(element.scrollHeight, 150)}px`;
              }}
              onKeyDown={(event) => {
                if ((event.metaKey && event.key === "Enter") || (event.key === "Enter" && !event.shiftKey)) {
                  event.preventDefault();
                  void askSocrates();
                }
              }}
              className="w-full resize-none rounded-lg border border-[var(--violet-border)] bg-[rgba(0,0,0,0.22)] px-4 py-3 font-ui text-[13px] leading-6 text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)]"
              placeholder="Ask about a decision, change, message, or DAG node..."
            />
            <div className="mt-3 flex items-center justify-between gap-3">
              <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-[var(--text-muted)]">Enter sends · Shift+Enter newline</span>
              <OrchestraButton variant="secondary" size="sm" isLoading={isLoading} onClick={() => void askSocrates()}>
                Ask Socrates
              </OrchestraButton>
            </div>
            <div className="mt-4">
              <TerminalOutput label="SOCRATES" lines={answer} tone="violet" compact={!isLoading} />
            </div>
          </motion.section>

          <motion.section variants={fadeSlideUp} className="glass glass-noise rounded-xl px-5 py-5">
            <div className="mb-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--text-muted)]">
              <History size={14} />
              Socrates Summary History
            </div>
            <div className="space-y-3">
              {mockSummaryBundles.map((bundle) => (
                <motion.div key={bundle.id} initial="rest" animate="rest" whileHover="hover" variants={cardHover} className="glass-sm rounded-lg px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <Badge variant={bundle.role === "pm" ? "cyan" : "green"}>{bundle.role}</Badge>
                    <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-[var(--text-muted)]">
                      {new Intl.DateTimeFormat("en-US", {
                        month: "short",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit"
                      }).format(new Date(bundle.generatedAt))}
                    </span>
                  </div>
                  <div className="mt-3 font-ui text-[12px] leading-6 text-[var(--text-primary)]">{bundle.content}</div>
                </motion.div>
              ))}
            </div>

            <div className="mt-5 mb-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--text-muted)]">
              <Search size={14} />
              Project Health
            </div>
            <div className="space-y-3">
              {[
                { label: "Communication volume", value: "3 live client threads", tone: "blue" },
                { label: "Scope change frequency", value: `${mockChanges.length} changes today`, tone: "amber" },
                { label: "Unresolved item count", value: `${mockChanges.filter((change) => change.approvalStatus !== "approved").length} unresolved`, tone: "rose" },
                { label: "Human review", value: `${stats.unreviewed} insights still need Sarah`, tone: "cyan" }
              ].map((item) => (
                <motion.div key={item.label} initial="rest" animate="rest" whileHover="hover" variants={cardHover} className="glass-sm rounded-lg px-4 py-3">
                  <div className="font-ui text-[12px] text-[var(--text-secondary)]">{item.label}</div>
                  <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.12em]" style={{ color: `var(--${item.tone})` }}>
                    {item.value}
                  </div>
                </motion.div>
              ))}
            </div>
            {contradictionItem ? (
              <div className="mt-4 rounded-lg border border-[var(--rose-border)] bg-[var(--rose-dim)] px-4 py-3">
                <div className="font-mono text-[9px] uppercase tracking-[0.14em] text-[var(--rose)]">Highest-risk contradiction</div>
                <div className="mt-2 font-ui text-[12px] leading-6 text-[var(--text-primary)]">{contradictionItem.preview}</div>
              </div>
            ) : null}
          </motion.section>
        </div>
      </motion.div>
    </StageShell>
  );
}
