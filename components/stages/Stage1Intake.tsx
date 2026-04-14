"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Cpu, FileText, MessageSquare, UploadCloud } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { pageContainer, fadeIn, fadeSlideUp, staggerContainer, chipBounce } from "@/lib/animations";
import { StageShell } from "@/components/layout/StageShell";
import { OrchestraButton } from "@/components/shared/OrchestraButton";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { TerminalOutput } from "@/components/shared/TerminalOutput";
import { intakeAnalysisLines, intakeUploadFile } from "@/lib/mockData";
import { getBrainRoute } from "@/lib/stageConfig";

type IntakeState = "idle" | "uploading" | "parsing" | "done";

const inputChips = ["Scope doc", "PRD", "Slack export", "Notion page", "Voice memo", "Email thread"];

const nextSteps = [
  {
    title: "Orchestra reads it",
    description: "Jack's brief, PRD, and Slack fragments are consolidated into a single product signal.",
    icon: FileText
  },
  {
    title: "Extracts requirements",
    description: "Buyer ordering, florist operations, payments, and delivery constraints are separated into buildable work.",
    icon: Cpu
  },
  {
    title: "Asks the right questions",
    description: "The PM layer surfaces the assumptions Jack feels implicitly but has not stated cleanly yet.",
    icon: MessageSquare
  }
];

const extractedRows = [
  "PRIMARY GOAL: Build BloomFast on-demand flower marketplace MVP",
  "SCOPE: Buyer ordering, Florist dashboard, Payments, Driver assignment",
  "STAKEHOLDERS: Jack (BloomFast), Sarah Chen (PM)",
  "DEADLINE: 8-week delivery window"
];

export function Stage1Intake() {
  const [state, setState] = useState<IntakeState>("idle");
  const [terminalReady, setTerminalReady] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();
  const params = useParams<{ projectId: string }>();
  const projectId = typeof params?.projectId === "string" ? params.projectId : "p1";

  useEffect(() => {
    if (state !== "uploading") return;

    const timer = window.setTimeout(() => setState("parsing"), 1500);
    return () => window.clearTimeout(timer);
  }, [state]);

  const beginUpload = () => {
    setTerminalReady(false);
    setState("uploading");
  };

  return (
    <StageShell showGrid>
      <motion.div variants={pageContainer} initial="hidden" animate="show" className="mx-auto max-w-7xl space-y-6 px-8 py-8">
        <AnimatePresence mode="wait">
          {state === "idle" ? (
            <motion.div key="idle" variants={fadeIn} initial="hidden" animate="show" exit="hidden" className="space-y-6">
              <SectionHeader
                label="Step 1"
                title="WHAT DID JACK SEND?"
                subtitle="Drop whatever Jack sent. Orchestra reads it."
                accentColor="var(--violet)"
              />

              <motion.div variants={fadeSlideUp} initial="hidden" animate="show" className="glass-heavy glass-noise rounded-xl p-12 text-center">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-[rgba(167,139,250,0.2)] px-6 py-12 transition-all hover:border-[rgba(167,139,250,0.35)] hover:bg-[rgba(167,139,250,0.02)]"
                >
                  <UploadCloud size={36} className="text-[var(--violet)]" />
                  <div className="mt-4 font-ui text-[16px] font-medium text-[var(--text-primary)]">Drop the BloomFast brief here</div>
                  <div className="mt-1 font-ui text-[13px] text-[var(--text-secondary)]">PDF, Notion export, Slack thread, or plain text</div>
                </button>
                <input ref={fileInputRef} type="file" className="hidden" onChange={beginUpload} />
              </motion.div>

              <motion.div variants={staggerContainer(0.05, 0.04)} initial="hidden" animate="show" className="flex flex-wrap gap-2">
                {inputChips.map((chip) => (
                  <motion.div
                    key={chip}
                    variants={chipBounce}
                    className="rounded-md border border-[rgba(255,255,255,0.08)] bg-transparent px-3 py-1.5 font-ui text-[11px] text-[var(--text-secondary)] transition-colors hover:border-[var(--violet-border)] hover:text-[var(--violet)]"
                  >
                    {chip}
                  </motion.div>
                ))}
              </motion.div>

              <motion.div variants={staggerContainer(0.08, 0.1)} initial="hidden" animate="show" className="grid gap-4 md:grid-cols-3">
                {nextSteps.map((step) => (
                  <motion.div key={step.title} variants={fadeSlideUp} className="glass-sm rounded-lg px-4 py-4">
                    <step.icon size={16} className="text-[var(--violet)]" />
                    <div className="mt-3 font-ui text-[14px] font-medium text-[var(--text-primary)]">{step.title}</div>
                    <div className="mt-1 font-ui text-[12px] leading-6 text-[var(--text-secondary)]">{step.description}</div>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div variants={fadeSlideUp} initial="hidden" animate="show">
                <OrchestraButton variant="ghost" onClick={beginUpload}>
                  Read Jack&apos;s doc
                </OrchestraButton>
              </motion.div>
            </motion.div>
          ) : null}

          {state === "uploading" ? (
            <motion.div key="uploading" variants={fadeIn} initial="hidden" animate="show" exit="hidden" className="space-y-6">
              <SectionHeader
                label="Step 1"
                title="WHAT DID JACK SEND?"
                subtitle="Drop whatever Jack sent. Orchestra reads it."
                accentColor="var(--violet)"
              />
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-xl p-5">
                <div className="flex items-center gap-4">
                  <div className="glass-sm flex h-10 w-10 items-center justify-center rounded-lg">
                    <FileText size={16} className="text-[var(--violet)]" />
                  </div>
                  <div className="flex-1">
                    <div className="font-ui text-[13px] text-[var(--text-primary)]">{intakeUploadFile.name}</div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--text-muted)]">{intakeUploadFile.size}</div>
                  </div>
                </div>
                <div className="mt-5 h-[2px] overflow-hidden rounded-full bg-[rgba(255,255,255,0.06)]">
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1.3 }}
                    className="h-full rounded-full bg-[linear-gradient(90deg,var(--violet),rgba(167,139,250,0.55))]"
                  />
                </div>
              </motion.div>
            </motion.div>
          ) : null}

          {state === "parsing" ? (
            <motion.div key="parsing" variants={fadeIn} initial="hidden" animate="show" exit="hidden" className="space-y-6">
              <SectionHeader
                label="Step 1"
                title="WHAT DID JACK SEND?"
                subtitle="Drop whatever Jack sent. Orchestra reads it."
                accentColor="var(--violet)"
              />
              <TerminalOutput label="WHAT ORCHESTRA FOUND" lines={intakeAnalysisLines} onComplete={() => setTerminalReady(true)} tone="violet" />
              {terminalReady ? (
                <motion.div variants={fadeSlideUp} initial="hidden" animate="show">
                  <OrchestraButton variant="ghost" onClick={() => setState("done")}>
                    See what it found
                  </OrchestraButton>
                </motion.div>
              ) : null}
            </motion.div>
          ) : null}

          {state === "done" ? (
            <motion.div key="done" variants={fadeIn} initial="hidden" animate="show" exit="hidden" className="space-y-6">
              <SectionHeader
                label="Step 1"
                title="WHAT DID JACK SEND?"
                subtitle="Drop whatever Jack sent. Orchestra reads it."
                accentColor="var(--violet)"
              />
              <TerminalOutput label="WHAT ORCHESTRA FOUND" lines={intakeAnalysisLines} compact tone="violet" />
              <motion.div variants={staggerContainer(0.07, 0.08)} initial="hidden" animate="show" className="grid gap-4 md:grid-cols-2">
                {extractedRows.map((row) => (
                  <motion.div key={row} variants={fadeSlideUp} className="glass-violet rounded-xl px-5 py-5">
                    <div className="font-ui text-[13px] leading-6 text-[var(--text-primary)]">{row}</div>
                  </motion.div>
                ))}
              </motion.div>
              <motion.div variants={fadeSlideUp} initial="hidden" animate="show">
                <OrchestraButton variant="primary" onClick={() => router.push(getBrainRoute(projectId))}>
                  Start Clarification
                </OrchestraButton>
              </motion.div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.div>
    </StageShell>
  );
}
