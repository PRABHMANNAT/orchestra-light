"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, Plus, Search } from "lucide-react";

import { StageShell } from "@/components/layout/StageShell";
import { OrchestraButton } from "@/components/shared/OrchestraButton";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { cardHover, fadeSlideUp, heightReveal, pageContainer, staggerContainer } from "@/lib/animations";
import { mockDecisions } from "@/lib/mockData";
import type { DecisionRecord } from "@/lib/types";
import { cn } from "@/lib/utils";

type DecisionFilter = "all" | DecisionRecord["status"];

const filters: Array<{ key: DecisionFilter; label: string }> = [
  { key: "all", label: "All" },
  { key: "final", label: "Final" },
  { key: "pending", label: "Pending" },
  { key: "unresolved", label: "Unresolved" }
];

function statusVariant(status: DecisionRecord["status"]) {
  if (status === "final") return "done" as const;
  if (status === "pending") return "in-review" as const;
  return "blocked" as const;
}

function formatTimestamp(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

export function DecisionLog() {
  const [filter, setFilter] = useState<DecisionFilter>("all");
  const [query, setQuery] = useState("");
  const [expandedId, setExpandedId] = useState("");
  const [showForm, setShowForm] = useState(false);

  const visibleDecisions = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return mockDecisions
      .filter((decision) => filter === "all" || decision.status === filter)
      .filter((decision) => {
        if (!normalized) return true;
        return [
          decision.whatWasDecided,
          decision.decidedBy,
          decision.affectedProjectArea,
          decision.sourceThreadId,
          ...decision.evidenceRefs
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalized);
      });
  }, [filter, query]);

  return (
    <StageShell showGrid>
      <motion.div variants={pageContainer} initial="hidden" animate="show" className="project-page-container">
        <SectionHeader
          label="Decisions"
          title="DECISION LOG"
          subtitle="What was decided, who decided it, and what evidence supports it."
          accentColor="var(--emerald)"
        />

        <motion.div variants={fadeSlideUp} className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Badge variant="green">{visibleDecisions.length} RECORDS</Badge>
          </div>
          <OrchestraButton variant="secondary" icon={Plus} onClick={() => setShowForm((value) => !value)}>
            New Decision
          </OrchestraButton>
        </motion.div>

        <AnimatePresence>
          {showForm ? (
            <motion.div variants={heightReveal} initial="hidden" animate="show" exit="exit" className="glass-emerald rounded-xl px-5 py-5">
              <div className="grid gap-3 md:grid-cols-2">
                <input className="rounded-lg border border-[var(--emerald-border)] bg-transparent px-3 py-2 font-ui text-[13px] text-[var(--text-primary)] outline-none" placeholder="What was decided?" />
                <input className="rounded-lg border border-[var(--emerald-border)] bg-transparent px-3 py-2 font-ui text-[13px] text-[var(--text-primary)] outline-none" placeholder="Affected project area" />
              </div>
              <div className="mt-3">
                <OrchestraButton variant="primary" size="sm">
                  Log Decision
                </OrchestraButton>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <motion.div variants={fadeSlideUp} className="glass-sm flex flex-wrap items-center gap-3 rounded-xl px-4 py-3">
          <div className="flex flex-wrap gap-2">
            {filters.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setFilter(item.key)}
                className={cn(
                  "rounded-md border px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.12em]",
                  filter === item.key
                    ? "border-[var(--emerald-border)] bg-[var(--emerald-dim)] text-[var(--emerald)]"
                    : "border-[rgba(255,255,255,0.06)] text-[var(--text-muted)]"
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="ml-auto flex min-w-[260px] flex-1 items-center gap-2">
            <Search size={13} className="text-[var(--text-muted)]" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="w-full bg-transparent font-ui text-[13px] text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)]"
              placeholder="Search decisions..."
            />
          </div>
        </motion.div>

        <motion.div variants={staggerContainer(0.06, 0.02)} initial="hidden" animate="show" className="space-y-3">
          {visibleDecisions.map((decision) => {
            const expanded = expandedId === decision.id;
            return (
              <motion.div key={decision.id} variants={fadeSlideUp}>
                <motion.div initial="rest" animate="rest" whileHover="hover" variants={cardHover} className="glass glass-noise overflow-hidden rounded-xl">
                  <button type="button" onClick={() => setExpandedId(expanded ? "" : decision.id)} className="w-full px-5 py-5 text-left">
                    <div className="flex flex-wrap items-start gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="font-ui text-[15px] font-medium leading-6 text-[var(--text-primary)]">{decision.whatWasDecided}</div>
                        <div className="mt-2 font-mono text-[9px] uppercase tracking-[0.12em] text-[var(--text-secondary)]">
                          {decision.decidedBy} · {formatTimestamp(decision.decidedAt)}
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <Badge variant="cyan">{decision.affectedProjectArea}</Badge>
                          {decision.affectedDAGNodeId ? (
                            <span className="inline-flex items-center gap-1 font-mono text-[9px] text-[var(--cyan)]">
                              <Link size={11} />
                              {decision.affectedDAGNodeId}
                            </span>
                          ) : null}
                          <span className="font-mono text-[9px] text-[var(--blue)]">source: {decision.sourceThreadId}</span>
                        </div>
                      </div>
                      <StatusBadge variant={statusVariant(decision.status)}>{decision.status}</StatusBadge>
                    </div>
                  </button>
                  <AnimatePresence initial={false}>
                    {expanded ? (
                      <motion.div variants={heightReveal} initial="hidden" animate="show" exit="exit" className="border-t border-[rgba(255,255,255,0.05)] px-5 py-4">
                        <div className="font-mono text-[9px] uppercase tracking-[0.14em] text-[var(--text-muted)]">Evidence</div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {decision.evidenceRefs.map((ref) => (
                            <Badge key={ref} variant="default">{ref}</Badge>
                          ))}
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>
    </StageShell>
  );
}
