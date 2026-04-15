"use client";

import { useMemo, useState } from "react";
import type React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Copy, RefreshCw } from "lucide-react";
import { toast } from "sonner";

import { StageShell } from "@/components/layout/StageShell";
import { OrchestraButton } from "@/components/shared/OrchestraButton";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { TerminalOutput } from "@/components/shared/TerminalOutput";
import { Badge } from "@/components/ui/badge";
import { cardHover, chipBounce, fadeSlideUp, fadeSlideUpFast, pageContainer, staggerContainer } from "@/lib/animations";
import {
  mockChanges,
  mockClarifiedBrief,
  mockDecisions,
  mockSummaryBundles,
  mockThreads,
  mockWorkflowDAG,
  type TerminalLine
} from "@/lib/mockData";
import type { ChangeRecord, DecisionRecord, DAGNode } from "@/lib/types";
import { cn } from "@/lib/utils";

type OutputTab = "pm" | "engineering" | "founder" | "client" | "engineer";

const tabs: Array<{ key: OutputTab; label: string }> = [
  { key: "pm", label: "PM" },
  { key: "engineering", label: "Engineering" },
  { key: "founder", label: "Founder" },
  { key: "client", label: "Client" },
  { key: "engineer", label: "Engineer" }
];

const regenLines: TerminalLine[] = [
  { text: "reading latest decisions and changes ... done", delay: 130 },
  { text: "selecting role-specific context ...... done", delay: 130 },
  { text: "output regenerated .................. done", delay: 130 }
];

function OutputBlock({
  title,
  tone = "cyan",
  children
}: {
  title: string;
  tone?: "cyan" | "amber" | "rose" | "blue" | "emerald" | "violet";
  children: React.ReactNode;
}) {
  const [regenerating, setRegenerating] = useState(false);

  return (
    <motion.div variants={fadeSlideUp}>
      <motion.div initial="rest" animate="rest" whileHover="hover" variants={cardHover} className="glass glass-noise rounded-xl px-5 py-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="font-mono text-[10px] uppercase tracking-[0.16em]" style={{ color: `var(--${tone})` }}>
            {title}
          </div>
          <div className="flex gap-2">
            <OrchestraButton variant="ghost" size="sm" icon={RefreshCw} onClick={() => setRegenerating(true)}>
              Regenerate
            </OrchestraButton>
            <OrchestraButton variant="ghost" size="sm" icon={Copy} onClick={() => toast.success(`${title} copied`)}>
              Copy
            </OrchestraButton>
          </div>
        </div>
        {children}
        <AnimatePresence>
          {regenerating ? (
            <motion.div key="regen" variants={fadeSlideUpFast} initial="hidden" animate="show" exit="hidden" className="mt-4">
              <TerminalOutput label="OUTPUT ENGINE" lines={regenLines} tone={tone === "violet" ? "violet" : tone === "amber" || tone === "rose" ? "amber" : "cyan"} onComplete={() => setRegenerating(false)} />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

function ItemList({
  items,
  tone
}: {
  items: string[];
  tone: "cyan" | "amber" | "rose" | "blue" | "emerald" | "violet";
}) {
  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div key={item} className="rounded-lg border px-3 py-2 font-ui text-[12px] leading-6 text-[var(--text-secondary)]" style={{ borderColor: `var(--${tone}-border)`, background: `var(--${tone}-dim)` }}>
          {item}
        </div>
      ))}
    </div>
  );
}

function decisionStatus(decision: DecisionRecord) {
  if (decision.status === "final") return "done" as const;
  if (decision.status === "pending") return "in-review" as const;
  return "blocked" as const;
}

function changeStatus(change: ChangeRecord) {
  if (change.approvalStatus === "approved") return "done" as const;
  if (change.approvalStatus === "pending") return "in-review" as const;
  return "blocked" as const;
}

function PMTab() {
  const openQuestions = mockThreads
    .flatMap((thread) => thread.messages)
    .filter((message) => message.insight?.classification === "clarification_needed")
    .map((message) => message.insight?.suggestedAction ?? message.content);
  const decisionsPending = mockDecisions.filter((decision) => decision.status !== "final");
  const contradictions = mockChanges.filter((change) => change.approvalStatus === "unresolved");
  const handoff = mockSummaryBundles.find((bundle) => bundle.role === "pm")?.content ?? "";

  return (
    <div className="grid gap-4 2xl:grid-cols-2">
      <OutputBlock title="Open Questions" tone="blue">
        <ItemList items={openQuestions} tone="blue" />
      </OutputBlock>
      <OutputBlock title="Decisions Pending" tone="amber">
        <div className="space-y-2">
          {decisionsPending.map((decision) => (
            <div key={decision.id} className="glass-sm rounded-lg px-3 py-3">
              <div className="font-ui text-[12px] leading-6 text-[var(--text-primary)]">{decision.whatWasDecided}</div>
              <div className="mt-2 flex items-center gap-2">
                <StatusBadge variant={decisionStatus(decision)}>{decision.status}</StatusBadge>
                <Badge variant="cyan">{decision.affectedProjectArea}</Badge>
              </div>
            </div>
          ))}
        </div>
      </OutputBlock>
      <OutputBlock title="Change Requests" tone="amber">
        <div className="space-y-2">
          {mockChanges.map((change) => (
            <div key={change.id} className="glass-sm rounded-lg px-3 py-3">
              <div className="font-ui text-[12px] leading-6 text-[var(--text-primary)]">{change.whatChanged}</div>
              <div className="mt-2 flex items-center gap-2">
                <StatusBadge variant={changeStatus(change)}>{change.approvalStatus}</StatusBadge>
                <Badge variant="cyan">{change.affectedProjectArea}</Badge>
              </div>
            </div>
          ))}
        </div>
      </OutputBlock>
      <OutputBlock title="Contradictions" tone="rose">
        <ItemList items={contradictions.map((change) => `${change.previousUnderstanding} vs ${change.newUnderstanding}`)} tone="rose" />
      </OutputBlock>
      <OutputBlock title="Threads Needing Action" tone="blue">
        <ItemList items={mockThreads.filter((thread) => thread.messages.some((message) => message.insight && !message.insight.reviewedByHuman)).map((thread) => thread.subject ?? thread.id)} tone="blue" />
      </OutputBlock>
      <OutputBlock title="Engineer Handoff Summary" tone="cyan">
        <div className="rounded-lg border border-[var(--cyan-border)] bg-[var(--cyan-dim)] px-4 py-4 font-ui text-[13px] leading-7 text-[var(--text-primary)]">
          {handoff}
        </div>
      </OutputBlock>
    </div>
  );
}

function EngineeringTab() {
  const confusionAreas = mockThreads.reduce<Record<string, number>>((accumulator, thread) => {
    const key = thread.linkedProjectArea ?? "Unmapped";
    accumulator[key] = (accumulator[key] ?? 0) + thread.messages.filter((message) => message.insight).length;
    return accumulator;
  }, {});

  return (
    <div className="grid gap-4 2xl:grid-cols-2">
      <OutputBlock title="What the Client Actually Wants" tone="cyan">
        <div className="font-ui text-[13px] leading-7 text-[var(--text-primary)]">
          {mockClarifiedBrief.mvpObjective} Scope includes {mockClarifiedBrief.scopeIn.join(", ")}.
        </div>
      </OutputBlock>
      <OutputBlock title="Approved Requirement Changes" tone="amber">
        <ItemList items={mockChanges.filter((change) => change.approvalStatus === "approved").map((change) => change.whatChanged)} tone="amber" />
        {mockChanges.every((change) => change.approvalStatus !== "approved") ? (
          <div className="font-ui text-[12px] text-[var(--text-muted)]">No approved changes yet. Pending requests must not enter build scope.</div>
        ) : null}
      </OutputBlock>
      <OutputBlock title="Unresolved Dependencies" tone="rose">
        <ItemList items={mockWorkflowDAG.nodes.filter((node) => node.isUnresolved).map((node) => node.label)} tone="rose" />
      </OutputBlock>
      <OutputBlock title="Repeated Confusion" tone="violet">
        <div className="space-y-2">
          {Object.entries(confusionAreas).map(([area, count]) => (
            <div key={area} className="flex items-center justify-between rounded-lg border border-[var(--violet-border)] bg-[var(--violet-dim)] px-3 py-2">
              <span className="font-ui text-[12px] text-[var(--text-primary)]">{area}</span>
              <span className="font-mono text-[10px] text-[var(--violet)]">{count} signals</span>
            </div>
          ))}
        </div>
      </OutputBlock>
    </div>
  );
}

function FounderTab() {
  return (
    <div className="grid gap-4 2xl:grid-cols-2">
      <OutputBlock title="Major Changes" tone="amber">
        <ItemList items={mockChanges.map((change) => change.whatChanged)} tone="amber" />
      </OutputBlock>
      <OutputBlock title="Communication Health" tone="emerald">
        <div className="font-display text-[44px] leading-none text-[var(--amber)]">AMBER</div>
        <div className="mt-2 font-ui text-[13px] text-[var(--text-secondary)]">Two unresolved client requests need Sarah and Jack aligned before build scope changes.</div>
      </OutputBlock>
      <OutputBlock title="Unresolved Risks" tone="amber">
        <ItemList items={[...mockClarifiedBrief.risks, ...mockChanges.map((change) => change.riskImplication ?? "").filter(Boolean)]} tone="amber" />
      </OutputBlock>
      <OutputBlock title="Where Intervention Is Needed" tone="rose">
        <ItemList items={mockChanges.filter((change) => change.approvalStatus === "unresolved").map((change) => change.whatChanged)} tone="rose" />
      </OutputBlock>
    </div>
  );
}

function ClientTab() {
  return (
    <div className="grid gap-4 2xl:grid-cols-2">
      <OutputBlock title="What Was Discussed" tone="blue">
        <div className="font-ui text-[13px] leading-7 text-[var(--text-primary)]">
          We discussed driver assignment approval, Pro subscription timing, and Apple Pay support for launch payments.
        </div>
      </OutputBlock>
      <OutputBlock title="What Was Decided" tone="emerald">
        <ItemList items={mockDecisions.filter((decision) => decision.status === "final").map((decision) => decision.whatWasDecided)} tone="emerald" />
      </OutputBlock>
      <OutputBlock title="What Remains Open" tone="amber">
        <ItemList items={mockDecisions.filter((decision) => decision.status !== "final").map((decision) => decision.whatWasDecided)} tone="amber" />
      </OutputBlock>
      <OutputBlock title="What Happens Next" tone="cyan">
        <ItemList
          items={[
            "Sarah will confirm whether the manager approval gate changes MVP scope.",
            "Engineering will confirm Apple Pay support through Stripe.",
            "Jack will decide whether Pro subscription stays post-MVP or becomes a formal change."
          ]}
          tone="cyan"
        />
      </OutputBlock>
    </div>
  );
}

function EngineerTab() {
  const modules = mockWorkflowDAG.nodes.filter((node) => ["flow", "module", "integration", "approval", "unresolved"].includes(node.type));
  const [selectedModuleId, setSelectedModuleId] = useState(modules[0]?.id ?? "");
  const selectedModule = modules.find((node) => node.id === selectedModuleId) ?? modules[0];

  const relatedChanges = mockChanges.filter((change) => change.affectedDAGNodeId === selectedModule.id);
  const relatedDecisions = mockDecisions.filter((decision) => decision.affectedDAGNodeId === selectedModule.id);

  return (
    <div className="space-y-4">
      <motion.div variants={staggerContainer(0.04, 0.02)} initial="hidden" animate="show" className="flex flex-wrap gap-2">
        {modules.map((module) => (
          <motion.button
            key={module.id}
            type="button"
            variants={chipBounce}
            onClick={() => setSelectedModuleId(module.id)}
            className={cn(
              "rounded-md border px-3 py-2 font-ui text-[11px]",
              selectedModule.id === module.id
                ? "border-[var(--cyan-border)] bg-[var(--cyan-dim)] text-[var(--cyan)]"
                : "border-[rgba(255,255,255,0.06)] text-[var(--text-secondary)]"
            )}
          >
            {module.label}
          </motion.button>
        ))}
      </motion.div>

      <div className="grid gap-4 2xl:grid-cols-2">
        <OutputBlock title={`Build Brief - ${selectedModule.label}`} tone="cyan">
          <EngineerBrief module={selectedModule} />
        </OutputBlock>
        <OutputBlock title="Relevant Decisions" tone="emerald">
          {relatedDecisions.length > 0 ? (
            <ItemList items={relatedDecisions.map((decision) => decision.whatWasDecided)} tone="emerald" />
          ) : (
            <div className="font-ui text-[12px] text-[var(--text-muted)]">No decision records mapped to this module yet.</div>
          )}
        </OutputBlock>
        <OutputBlock title="Change Warnings" tone="amber">
          {relatedChanges.length > 0 ? (
            <ItemList items={relatedChanges.map((change) => `${change.whatChanged}: ${change.approvalStatus}`)} tone="amber" />
          ) : (
            <div className="font-ui text-[12px] text-[var(--text-muted)]">No active change requests mapped to this module.</div>
          )}
        </OutputBlock>
        <OutputBlock title="Scope Guardrails" tone="rose">
          <ItemList items={mockClarifiedBrief.scopeOut} tone="rose" />
        </OutputBlock>
      </div>
    </div>
  );
}

function EngineerBrief({ module }: { module: DAGNode }) {
  return (
    <div className="space-y-3">
      <div className="font-ui text-[13px] leading-7 text-[var(--text-primary)]">{module.description}</div>
      <div className="rounded-lg border border-[var(--cyan-border)] bg-[var(--cyan-dim)] px-4 py-3">
        <div className="font-mono text-[9px] uppercase tracking-[0.14em] text-[var(--cyan)]">Accepted objective</div>
        <div className="mt-2 font-ui text-[12px] leading-6 text-[var(--text-secondary)]">{mockClarifiedBrief.mvpObjective}</div>
      </div>
      <OrchestraButton variant="ghost" size="sm" icon={Copy} onClick={() => toast.success("Engineer brief copied")}>
        Copy Brief
      </OrchestraButton>
    </div>
  );
}

export function Stage9StakeholderUpdates() {
  const [activeTab, setActiveTab] = useState<OutputTab>("pm");

  const content = useMemo(() => {
    switch (activeTab) {
      case "engineering":
        return <EngineeringTab />;
      case "founder":
        return <FounderTab />;
      case "client":
        return <ClientTab />;
      case "engineer":
        return <EngineerTab />;
      default:
        return <PMTab />;
    }
  }, [activeTab]);

  return (
    <StageShell showGrid>
      <motion.div variants={pageContainer} initial="hidden" animate="show" className="project-page-container">
        <SectionHeader
          label="Outputs"
          title="ROLE-BASED OUTPUTS"
          subtitle="One project brain, translated into exactly what each stakeholder needs to know right now."
          accentColor="var(--cyan)"
        />

        <motion.div variants={fadeSlideUp} className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button key={tab.key} type="button" onClick={() => setActiveTab(tab.key)} className="relative overflow-hidden rounded-md px-4 py-2">
              {activeTab === tab.key ? <motion.div layoutId="outputs-tab" className="glass-cyan absolute inset-0 rounded-md" /> : null}
              <span className={cn("relative z-10 font-ui text-[11px] tracking-[0.08em]", activeTab === tab.key ? "text-[var(--cyan)]" : "text-[var(--text-secondary)]")}>
                {tab.label}
              </span>
            </button>
          ))}
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: -14 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -14, transition: { duration: 0.15 } }}
            transition={{ duration: 0.28 }}
          >
            {content}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </StageShell>
  );
}
