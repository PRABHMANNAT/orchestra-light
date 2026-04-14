"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { FileText, Search } from "lucide-react";

import { StageShell } from "@/components/layout/StageShell";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Badge } from "@/components/ui/badge";
import { cardHover, fadeSlideUp, pageContainer, staggerContainer } from "@/lib/animations";
import {
  mockChanges,
  mockClarifiedBrief,
  mockDecisions,
  mockSourcePackage,
  mockThreads,
  truthDocuments,
  truthRequirements
} from "@/lib/mockData";

type ResultGroup = "Source Material" | "Decisions" | "Changes" | "Messages" | "Briefs";

type MemoryResult = {
  id: string;
  group: ResultGroup;
  excerpt: string;
  source: string;
  date: string;
  badge: "default" | "cyan" | "amber" | "green" | "red";
};

function buildResults(): MemoryResult[] {
  return [
    {
      id: mockSourcePackage.id,
      group: "Source Material",
      excerpt: mockSourcePackage.summary,
      source: mockSourcePackage.evidenceRefs[0] ?? "Source Package",
      date: mockSourcePackage.createdAt,
      badge: "cyan"
    },
    {
      id: mockClarifiedBrief.id,
      group: "Briefs",
      excerpt: mockClarifiedBrief.mvpObjective,
      source: "Clarified Brief v1",
      date: mockClarifiedBrief.createdAt,
      badge: "green"
    },
    ...mockDecisions.map<MemoryResult>((decision) => ({
      id: decision.id,
      group: "Decisions",
      excerpt: decision.whatWasDecided,
      source: decision.sourceThreadId,
      date: decision.createdAt,
      badge: decision.status === "final" ? "green" : decision.status === "pending" ? "amber" : "red"
    })),
    ...mockChanges.map<MemoryResult>((change) => ({
      id: change.id,
      group: "Changes",
      excerpt: `${change.whatChanged}. ${change.newUnderstanding}`,
      source: change.evidenceRefs.join(", "),
      date: change.createdAt,
      badge: change.approvalStatus === "approved" ? "green" : change.approvalStatus === "pending" ? "amber" : "red"
    })),
    ...mockThreads.flatMap((thread) =>
      thread.messages.map<MemoryResult>((message) => ({
        id: message.id,
        group: "Messages",
        excerpt: message.content,
        source: thread.subject ?? thread.id,
        date: message.timestamp,
        badge: thread.channel === "gmail" ? "cyan" : thread.channel === "slack" ? "default" : "green"
      }))
    )
  ];
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric"
  }).format(new Date(value));
}

export function SourceOfTruth({ projectId }: { projectId: string }) {
  const [query, setQuery] = useState("");
  const results = useMemo(() => buildResults(), []);
  const visibleResults = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return [];
    return results.filter((result) => `${result.excerpt} ${result.source} ${result.group}`.toLowerCase().includes(normalized));
  }, [query, results]);

  const groupedResults = visibleResults.reduce<Record<ResultGroup, MemoryResult[]>>(
    (accumulator, result) => {
      accumulator[result.group].push(result);
      return accumulator;
    },
    {
      "Source Material": [],
      Decisions: [],
      Changes: [],
      Messages: [],
      Briefs: []
    }
  );

  const defaultDocuments = truthDocuments.slice(0, 5);
  const defaultRequirements = truthRequirements.slice(0, 6);

  return (
    <StageShell showGrid>
      <motion.div variants={pageContainer} initial="hidden" animate="show" className="mx-auto max-w-7xl space-y-6 px-8 py-8">
        <SectionHeader
          label="Memory"
          title="PROJECT MEMORY"
          subtitle="Search decisions, changes, client messages, briefs, and source material from one evidence trail."
          accentColor="var(--violet)"
        />

        <motion.div variants={fadeSlideUp} className="glass-heavy glass-noise rounded-xl px-5 py-5">
          <div className="flex items-center gap-3 rounded-xl border border-[var(--cyan-border)] bg-[rgba(0,0,0,0.24)] px-4 py-4">
            <Search size={18} className="text-[var(--cyan)]" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="flex-1 bg-transparent font-ui text-[15px] text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)]"
              placeholder="Ask anything about this project - decisions, changes, what the client said..."
            />
            <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-[var(--text-muted)]">CMD K</span>
          </div>
        </motion.div>

        {query.trim() ? (
          <motion.div variants={staggerContainer(0.06, 0.02)} initial="hidden" animate="show" className="space-y-5">
            {(Object.keys(groupedResults) as ResultGroup[]).map((group) => {
              const items = groupedResults[group];
              if (items.length === 0) return null;
              return (
                <motion.section key={group} variants={fadeSlideUp} className="space-y-3">
                  <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--violet)]">{group}</div>
                  <div className="grid gap-3 xl:grid-cols-2">
                    {items.map((result) => (
                      <motion.div key={result.id} initial="rest" animate="rest" whileHover="hover" variants={cardHover} className="glass glass-noise rounded-xl px-5 py-4">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant={result.badge}>{group}</Badge>
                          <span className="font-mono text-[9px] text-[var(--text-muted)]">{formatDate(result.date)}</span>
                        </div>
                        <div className="mt-3 font-ui text-[13px] leading-6 text-[var(--text-secondary)]">{result.excerpt}</div>
                        <div className="mt-3 font-mono text-[9px] uppercase tracking-[0.12em] text-[var(--blue)]">From: {result.source}</div>
                      </motion.div>
                    ))}
                  </div>
                </motion.section>
              );
            })}
            {visibleResults.length === 0 ? (
              <motion.div variants={fadeSlideUp} className="glass-sm rounded-xl px-5 py-8 text-center font-ui text-[13px] text-[var(--text-muted)]">
                No matching evidence found.
              </motion.div>
            ) : null}
          </motion.div>
        ) : (
          <div className="grid gap-6 xl:grid-cols-[0.82fr_1.18fr]">
            <motion.section variants={fadeSlideUp} className="space-y-3">
              <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--text-muted)]">Source Documents</div>
              {defaultDocuments.map((document) => (
                <motion.div key={document.id} initial="rest" animate="rest" whileHover="hover" variants={cardHover} className="glass glass-noise rounded-xl px-4 py-4">
                  <div className="flex items-start gap-3">
                    <div className="glass-violet flex h-8 w-8 items-center justify-center rounded-lg">
                      <FileText size={15} className="text-[var(--violet)]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-ui text-[13px] font-medium text-[var(--text-primary)]">{document.title}</div>
                      <div className="mt-1 font-mono text-[9px] text-[var(--text-muted)]">{document.source} · {document.date}</div>
                      <div className="mt-2 font-ui text-[12px] leading-6 text-[var(--text-secondary)]">{document.summary}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.section>

            <motion.section variants={fadeSlideUp} className="space-y-4">
              <div className="glass-cyan rounded-xl px-5 py-5">
                <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--cyan)]">Accepted Brief Memory</div>
                <div className="font-ui text-[13px] leading-7 text-[var(--text-primary)]">{mockClarifiedBrief.assumptionSummary}</div>
              </div>
              <div className="glass rounded-xl px-5 py-5">
                <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--text-muted)]">Extracted Requirements</div>
                <div className="space-y-3">
                  {defaultRequirements.map((requirement) => (
                    <div key={requirement.id} className="border-b border-[rgba(255,255,255,0.04)] pb-3 last:border-b-0 last:pb-0">
                      <div className="font-ui text-[13px] leading-6 text-[var(--text-secondary)]">{requirement.text}</div>
                      <div className="mt-1 font-mono text-[9px] text-[var(--text-muted)]">{requirement.sourceRef}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.section>
          </div>
        )}
      </motion.div>
    </StageShell>
  );
}
