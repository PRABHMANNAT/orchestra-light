"use client";

import { useMemo, useRef, useState } from "react";
import type React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, ChevronDown, FileText, Lock, MessageSquare, UploadCloud } from "lucide-react";

import { StageShell } from "@/components/layout/StageShell";
import { OrchestraButton } from "@/components/shared/OrchestraButton";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { TerminalOutput } from "@/components/shared/TerminalOutput";
import { Badge } from "@/components/ui/badge";
import { cardHover, chipBounce, fadeSlideUp, heightReveal, pageContainer, staggerContainer } from "@/lib/animations";
import { intakeUploadFile, mockClarifiedBrief, mockSourcePackage, type TerminalLine } from "@/lib/mockData";
import { cn } from "@/lib/utils";

type BrainTab = "source" | "brief";

const sourceExtractionLines: TerminalLine[] = [
  { text: "reading BloomFast PRD and discovery notes ... done", delay: 180 },
  { text: "extracting actors, features, and constraints ... done", delay: 180 },
  { text: "mapping contradictions to project areas ....... done", delay: 180 },
  { text: "source package ready for human review ....... done", delay: 180 }
];

const briefGenerationLines: TerminalLine[] = [
  { text: "buyer ordering flow confirmed ............... done", delay: 160 },
  { text: "Pro subscription moved outside MVP ......... done", delay: 160 },
  { text: "driver assignment assumption captured ...... done", delay: 160 },
  { text: "clarified brief locked for review .......... done", delay: 160 }
];

const clarificationPrompts = [
  {
    q: "What is the MVP objective?",
    a: "End-to-end buyer order, florist confirmation, payment, and basic driver assignment."
  },
  {
    q: "What is explicitly out?",
    a: "Pro subscription, manager approval gate, advanced analytics, and an in-house driver fleet."
  },
  {
    q: "What must Sarah confirm?",
    a: "Driver assignment stays auto-assign unless Jack approves the manager gate as a change."
  }
];

function ArtifactCard({
  title,
  tone,
  children,
  defaultOpen = true
}: {
  title: string;
  tone?: "cyan" | "amber" | "rose" | "emerald" | "violet";
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const border =
    tone === "amber"
      ? "border-[var(--amber-border)] bg-[var(--amber-dim)]"
      : tone === "rose"
        ? "border-[var(--rose-border)] bg-[var(--rose-dim)]"
        : tone === "emerald"
          ? "border-[var(--emerald-border)] bg-[var(--emerald-dim)]"
          : tone === "violet"
            ? "border-[var(--violet-border)] bg-[var(--violet-dim)]"
            : "border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)]";
  const text =
    tone === "amber"
      ? "text-[var(--amber)]"
      : tone === "rose"
        ? "text-[var(--rose)]"
        : tone === "emerald"
          ? "text-[var(--emerald)]"
          : tone === "violet"
            ? "text-[var(--violet)]"
            : "text-[var(--cyan)]";

  return (
    <motion.div variants={fadeSlideUp}>
      <motion.div initial="rest" animate="rest" whileHover="hover" variants={cardHover} className={cn("overflow-hidden rounded-xl border", border)}>
        <button type="button" onClick={() => setOpen((value) => !value)} className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left">
          <span className={cn("font-mono text-[10px] uppercase tracking-[0.16em]", text)}>{title}</span>
          <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.22 }}>
            <ChevronDown size={14} className="text-[var(--text-muted)]" />
          </motion.span>
        </button>
        <AnimatePresence initial={false}>
          {open ? (
            <motion.div variants={heightReveal} initial="hidden" animate="show" exit="exit" className="px-5 pb-5">
              {children}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

function PillList({ items, variant = "default" }: { items: string[]; variant?: "default" | "cyan" | "amber" | "green" | "red" }) {
  return (
    <motion.div variants={staggerContainer(0.035, 0.02)} initial="hidden" animate="show" className="flex flex-wrap gap-2">
      {items.map((item) => (
        <motion.div key={item} variants={chipBounce}>
          <Badge variant={variant}>{item}</Badge>
        </motion.div>
      ))}
    </motion.div>
  );
}

function NumberedList({ items }: { items: string[] }) {
  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div key={item} className="flex gap-3">
          <span className="font-mono text-[10px] text-[var(--cyan)]">{String(index + 1).padStart(2, "0")}</span>
          <span className="font-ui text-[13px] leading-6 text-[var(--text-secondary)]">{item}</span>
        </div>
      ))}
    </div>
  );
}

function UploadMaterials() {
  const [uploaded, setUploaded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <ArtifactCard title="Upload Materials" tone="violet" defaultOpen={!uploaded}>
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-[var(--violet-border)] px-6 py-8 transition-all hover:bg-[var(--violet-dim)]"
        >
          <UploadCloud size={32} className="text-[var(--violet)]" />
          <div className="mt-4 font-ui text-[15px] font-medium text-[var(--text-primary)]">Drop the BloomFast materials here</div>
          <div className="mt-1 font-ui text-[12px] text-[var(--text-secondary)]">PRD, discovery notes, WhatsApp export, or email thread</div>
        </button>
        <input ref={fileInputRef} type="file" className="hidden" onChange={() => setUploaded(true)} />
        <div className="glass-sm rounded-lg px-4 py-3">
          <div className="flex items-center gap-3">
            <FileText size={14} className="text-[var(--violet)]" />
            <div className="flex-1">
              <div className="font-ui text-[13px] text-[var(--text-primary)]">{intakeUploadFile.name}</div>
              <div className="font-mono text-[9px] uppercase tracking-[0.12em] text-[var(--text-muted)]">{intakeUploadFile.size}</div>
            </div>
            <OrchestraButton variant="secondary" size="sm" onClick={() => setUploaded(true)}>
              Read Materials
            </OrchestraButton>
          </div>
        </div>
        {uploaded ? <TerminalOutput label="SOURCE EXTRACTION" lines={sourceExtractionLines} tone="cyan" /> : null}
      </div>
    </ArtifactCard>
  );
}

function AcceptanceGate({
  accepted,
  onAccept,
  label
}: {
  accepted: boolean;
  onAccept: () => void;
  label: string;
}) {
  return accepted ? (
    <div className="flex flex-wrap items-center gap-2">
      <StatusBadge variant="done">ACCEPTED</StatusBadge>
      <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--emerald)]">
        <Lock size={12} />
        Immutable
      </span>
    </div>
  ) : (
    <OrchestraButton variant="primary" onClick={onAccept}>
      {label}
    </OrchestraButton>
  );
}

function SourcePackageTab() {
  const [accepted, setAccepted] = useState(mockSourcePackage.accepted);

  return (
    <motion.div variants={pageContainer} initial="hidden" animate="show" className="space-y-4">
      <motion.div variants={fadeSlideUp} className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Badge variant="cyan">VERSION {mockSourcePackage.version}</Badge>
          <span className="font-mono text-[10px] text-[var(--text-muted)]">{mockSourcePackage.createdAt}</span>
        </div>
        <AcceptanceGate accepted={accepted} onAccept={() => setAccepted(true)} label="Accept Source Package" />
      </motion.div>

      <UploadMaterials />

      <ArtifactCard title="Project Summary" tone="cyan">
        <p className="font-ui text-[16px] leading-7 text-[var(--text-primary)]">{mockSourcePackage.summary}</p>
      </ArtifactCard>

      <div className="grid gap-4 2xl:grid-cols-2">
        <ArtifactCard title="Actors / User Roles">
          <PillList items={mockSourcePackage.actors} variant="cyan" />
        </ArtifactCard>
        <ArtifactCard title="Features">
          <NumberedList items={mockSourcePackage.features} />
        </ArtifactCard>
        <ArtifactCard title="Constraints">
          <NumberedList items={mockSourcePackage.constraints} />
        </ArtifactCard>
        <ArtifactCard title="Integrations">
          <PillList items={mockSourcePackage.integrations} variant="green" />
        </ArtifactCard>
        <ArtifactCard title="Known Unknowns" tone="amber">
          <PillList items={mockSourcePackage.knownUnknowns} variant="amber" />
        </ArtifactCard>
        <ArtifactCard title="Risks" tone="amber">
          <NumberedList items={mockSourcePackage.risks} />
        </ArtifactCard>
        <ArtifactCard title="Contradictions" tone="rose">
          <NumberedList items={mockSourcePackage.contradictions} />
        </ArtifactCard>
        <ArtifactCard title="Evidence References">
          <div className="space-y-2">
            {mockSourcePackage.evidenceRefs.map((ref) => (
              <div key={ref} className="font-mono text-[10px] tracking-[0.08em] text-[var(--blue)]">
                {ref}
              </div>
            ))}
          </div>
        </ArtifactCard>
      </div>

      <motion.div variants={fadeSlideUp}>
        <TerminalOutput
          label="CONFIDENCE SUMMARY"
          lines={[{ text: mockSourcePackage.confidenceSummary, delay: 120 }]}
          compact
          tone="cyan"
        />
      </motion.div>
    </motion.div>
  );
}

function ClarifiedBriefTab() {
  const [accepted, setAccepted] = useState(mockClarifiedBrief.accepted);
  const rows = useMemo(() => clarificationPrompts, []);

  return (
    <motion.div variants={pageContainer} initial="hidden" animate="show" className="space-y-4">
      <motion.div variants={fadeSlideUp} className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Badge variant="cyan">VERSION {mockClarifiedBrief.version}</Badge>
          <span className="font-mono text-[10px] text-[var(--text-muted)]">{mockClarifiedBrief.createdAt}</span>
        </div>
        <AcceptanceGate accepted={accepted} onAccept={() => setAccepted(true)} label="Accept Clarified Brief" />
      </motion.div>

      <motion.div variants={fadeSlideUp}>
        <motion.div initial="rest" animate="rest" whileHover="hover" variants={cardHover} className="glass-heavy glass-noise rounded-xl p-5">
          <div className="mb-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--violet)]">
            <MessageSquare size={13} />
            Clarification Flow
          </div>
          <div className="grid gap-3 2xl:grid-cols-3">
            {rows.map((row) => (
              <div key={row.q} className="glass-sm rounded-lg px-4 py-4">
                <div className="font-ui text-[13px] font-medium text-[var(--text-primary)]">{row.q}</div>
                <div className="mt-2 font-ui text-[12px] leading-6 text-[var(--text-secondary)]">{row.a}</div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <TerminalOutput label="BRIEF GENERATION" lines={briefGenerationLines} compact tone="cyan" />
          </div>
        </motion.div>
      </motion.div>

      <div className="grid gap-4 2xl:grid-cols-2">
        <ArtifactCard title="Target Users">
          <PillList items={mockClarifiedBrief.targetUsers} variant="cyan" />
        </ArtifactCard>
        <ArtifactCard title="User Roles">
          <PillList items={mockClarifiedBrief.userRoles} variant="cyan" />
        </ArtifactCard>
      </div>

      <ArtifactCard title="Primary Journey" tone="cyan">
        <div className="border-l-2 border-[var(--cyan-border)] pl-4 font-ui text-[15px] text-[var(--text-primary)]">
          {mockClarifiedBrief.primaryJourney}
        </div>
      </ArtifactCard>

      <ArtifactCard title="MVP Objective" tone="cyan">
        <p className="font-ui text-[16px] leading-7 text-[var(--text-primary)]">{mockClarifiedBrief.mvpObjective}</p>
      </ArtifactCard>

      <div className="grid gap-4 2xl:grid-cols-2">
        <ArtifactCard title="Scope In" tone="emerald">
          <NumberedList items={mockClarifiedBrief.scopeIn} />
        </ArtifactCard>
        <ArtifactCard title="Scope Out" tone="rose">
          <div className="space-y-2">
            {mockClarifiedBrief.scopeOut.map((item) => (
              <div key={item} className="font-ui text-[13px] leading-6 text-[var(--text-muted)] opacity-70">
                {item}
              </div>
            ))}
          </div>
        </ArtifactCard>
        <ArtifactCard title="Constraints">
          <NumberedList items={mockClarifiedBrief.constraints} />
        </ArtifactCard>
        <ArtifactCard title="Must-Have Integrations">
          <PillList items={mockClarifiedBrief.mustHaveIntegrations} variant="green" />
        </ArtifactCard>
        <ArtifactCard title="Approval Conditions">
          <NumberedList items={mockClarifiedBrief.approvalConditions} />
        </ArtifactCard>
        <ArtifactCard title="Unresolved Decisions" tone="amber">
          <PillList items={mockClarifiedBrief.unresolvedDecisions} variant="amber" />
        </ArtifactCard>
        <ArtifactCard title="Risks" tone="amber">
          <NumberedList items={mockClarifiedBrief.risks} />
        </ArtifactCard>
        <ArtifactCard title="Assumption Summary" tone="violet">
          <p className="font-ui text-[13px] leading-6 text-[var(--text-primary)]">{mockClarifiedBrief.assumptionSummary}</p>
        </ArtifactCard>
      </div>
    </motion.div>
  );
}

export function ProjectBrain() {
  const [tab, setTab] = useState<BrainTab>("source");

  return (
    <StageShell showGrid>
      <motion.div variants={pageContainer} initial="hidden" animate="show" className="project-page-container">
        <SectionHeader
          label="Brain"
          title="PROJECT BRAIN"
          subtitle="Source package and clarified brief. Human-reviewed, versioned, and locked before the product DAG becomes authoritative."
          accentColor="var(--cyan)"
        />

        <motion.div variants={fadeSlideUp} className="flex flex-wrap gap-2">
          {[
            ["source", "Source Package"],
            ["brief", "Clarified Brief"]
          ].map(([key, label]) => (
            <button key={key} type="button" onClick={() => setTab(key as BrainTab)} className="relative overflow-hidden rounded-md px-4 py-2">
              {tab === key ? <motion.div layoutId="brain-tab" className="glass-cyan absolute inset-0 rounded-md" /> : null}
              <span className={cn("relative z-10 font-ui text-[12px]", tab === key ? "text-[var(--cyan)]" : "text-[var(--text-secondary)]")}>
                {label}
              </span>
            </button>
          ))}
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
            {tab === "source" ? <SourcePackageTab /> : <ClarifiedBriefTab />}
          </motion.div>
        </AnimatePresence>

        <motion.div variants={fadeSlideUp} className="glass-emerald rounded-xl px-5 py-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 size={16} className="text-[var(--emerald)]" />
            <div className="font-ui text-[13px] text-[var(--text-primary)]">
              Orchestra proposes. Sarah reviews. Accepted artifacts become immutable project memory.
            </div>
          </div>
        </motion.div>
      </motion.div>
    </StageShell>
  );
}
