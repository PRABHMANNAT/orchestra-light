"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, GitCompareArrows } from "lucide-react";
import { toast } from "sonner";

import { StageShell } from "@/components/layout/StageShell";
import { OrchestraButton } from "@/components/shared/OrchestraButton";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { TerminalOutput } from "@/components/shared/TerminalOutput";
import { Badge } from "@/components/ui/badge";
import { cardHover, fadeSlideUp, pageContainer, slideInLeft, staggerContainer } from "@/lib/animations";
import { mockChanges, type TerminalLine } from "@/lib/mockData";
import type { ChangeRecord } from "@/lib/types";

const processingLines: TerminalLine[] = [
  { text: "comparing request against accepted brief .... done", delay: 160 },
  { text: "mapping affected DAG node and source thread .. done", delay: 160 },
  { text: "risk and rework implications generated ....... done", delay: 160 },
  { text: "change queue ready for Sarah review .......... done", delay: 160 }
];

function statusVariant(status: ChangeRecord["approvalStatus"]) {
  if (status === "approved") return "done" as const;
  if (status === "pending") return "in-review" as const;
  return "blocked" as const;
}

function formatTimestamp(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

export function Stage7ChangeSync() {
  const [selectedChangeId, setSelectedChangeId] = useState(mockChanges[0]?.id ?? "");
  const selectedChange = mockChanges.find((change) => change.id === selectedChangeId) ?? mockChanges[0];

  return (
    <StageShell showGrid>
      <motion.div variants={pageContainer} initial="hidden" animate="show" className="project-page-container">
        <SectionHeader
          label="Changes"
          title="CHANGE LOG"
          subtitle="Every shift in client understanding, compared against the accepted project brain."
          accentColor="var(--amber)"
        />

        <motion.div variants={fadeSlideUp}>
          <TerminalOutput label="CHANGE PROCESSOR" lines={processingLines} compact tone="amber" />
        </motion.div>

        <div className="grid gap-6 2xl:grid-cols-[0.78fr_1.22fr]">
          <motion.section variants={staggerContainer(0.06, 0.02)} initial="hidden" animate="show" className="space-y-3">
            {mockChanges.map((change) => {
              const isActive = change.id === selectedChange.id;
              return (
                <motion.button key={change.id} type="button" variants={slideInLeft} onClick={() => setSelectedChangeId(change.id)} className="w-full text-left">
                  <motion.div
                    initial="rest"
                    animate="rest"
                    whileHover="hover"
                    variants={cardHover}
                    className={isActive ? "glass-amber glass-noise rounded-xl px-5 py-5" : "glass glass-noise rounded-xl px-5 py-5"}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="font-ui text-[14px] font-medium leading-6 text-[var(--text-primary)]">{change.whatChanged}</div>
                        <div className="mt-2 font-mono text-[9px] uppercase tracking-[0.12em] text-[var(--text-muted)]">
                          {change.requestedBy} · {formatTimestamp(change.requestedAt)}
                        </div>
                      </div>
                      <StatusBadge variant={statusVariant(change.approvalStatus)}>{change.approvalStatus}</StatusBadge>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Badge variant="cyan">{change.affectedProjectArea}</Badge>
                      {change.affectedDAGNodeId ? <Badge variant="default">{change.affectedDAGNodeId}</Badge> : null}
                    </div>
                  </motion.div>
                </motion.button>
              );
            })}
          </motion.section>

          <motion.section variants={fadeSlideUp} className="glass-heavy glass-noise rounded-xl px-6 py-6">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--amber)]">
                  <GitCompareArrows size={14} />
                  Requirement Diff
                </div>
                <div className="mt-2 font-display text-[34px] leading-none text-[var(--text-primary)]">{selectedChange.affectedProjectArea}</div>
              </div>
              <StatusBadge variant={statusVariant(selectedChange.approvalStatus)}>{selectedChange.approvalStatus}</StatusBadge>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <motion.div initial="rest" animate="rest" whileHover="hover" variants={cardHover} className="rounded-xl border border-[rgba(255,255,255,0.05)] bg-[rgba(255,255,255,0.02)] px-5 py-5">
                <div className="font-mono text-[9px] uppercase tracking-[0.15em] text-[var(--text-muted)]">Previous Understanding</div>
                <div className="mt-3 font-ui text-[13px] leading-6 text-[var(--text-muted)] opacity-80">{selectedChange.previousUnderstanding}</div>
              </motion.div>
              <motion.div initial="rest" animate="rest" whileHover="hover" variants={cardHover} className="rounded-xl border border-[var(--cyan-border)] bg-[var(--bg-2)] px-5 py-5">
                <div className="font-mono text-[9px] uppercase tracking-[0.15em] text-[var(--cyan)]">New Understanding</div>
                <div className="mt-3 font-ui text-[13px] leading-6 text-[var(--text-primary)]">{selectedChange.newUnderstanding}</div>
              </motion.div>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {selectedChange.riskImplication ? (
                <div className="rounded-xl border border-[var(--amber-border)] bg-[var(--amber-dim)] px-5 py-4">
                  <div className="mb-2 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.14em] text-[var(--amber)]">
                    <AlertTriangle size={12} />
                    Risk implication
                  </div>
                  <div className="font-ui text-[12px] leading-6 text-[var(--text-secondary)]">{selectedChange.riskImplication}</div>
                </div>
              ) : null}
              {selectedChange.reworkImplication ? (
                <div className="rounded-xl border border-[var(--amber-border)] bg-[var(--amber-dim)] px-5 py-4">
                  <div className="mb-2 font-mono text-[9px] uppercase tracking-[0.14em] text-[var(--amber)]">Rework implication</div>
                  <div className="font-ui text-[12px] leading-6 text-[var(--text-secondary)]">{selectedChange.reworkImplication}</div>
                </div>
              ) : null}
            </div>

            <div className="mt-5 rounded-xl border border-[rgba(255,255,255,0.06)] px-5 py-4">
              <div className="mb-3 font-mono text-[9px] uppercase tracking-[0.14em] text-[var(--text-muted)]">Evidence References</div>
              <div className="flex flex-wrap gap-2">
                {selectedChange.evidenceRefs.map((ref) => (
                  <Badge key={ref} variant="default">{ref}</Badge>
                ))}
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <OrchestraButton variant="primary" onClick={() => toast.success("Change approved")}>
                Approve Change
              </OrchestraButton>
              <OrchestraButton variant="danger" onClick={() => toast.message("Change rejected")}>
                Reject
              </OrchestraButton>
              <OrchestraButton variant="ghost" onClick={() => toast.message("Flagged for review")}>
                Flag for Review
              </OrchestraButton>
            </div>
          </motion.section>
        </div>
      </motion.div>
    </StageShell>
  );
}
