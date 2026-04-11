"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { EASE_EXPO, alertSlideDown, approvalBurst, fadeSlideUp, fadeSlideUpFast, livePulse, pageContainer, staggerContainer, terminalLine } from "@/lib/animations";
import { StageShell } from "@/components/layout/StageShell";
import { OrchestraButton } from "@/components/shared/OrchestraButton";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { TerminalOutput } from "@/components/shared/TerminalOutput";
import { changeApplyLines, changePanels, changeSyncLines } from "@/lib/mockData";
import { getStageRoute } from "@/lib/stageConfig";

export function Stage7ChangeSync() {
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const router = useRouter();
  const params = useParams<{ projectId: string }>();
  const projectId = typeof params?.projectId === "string" ? params.projectId : "p1";

  return (
    <StageShell showGrid>
      <motion.div variants={pageContainer} initial="hidden" animate="show" className="mx-auto max-w-7xl space-y-6 px-8 py-8">
        <motion.div variants={alertSlideDown} initial="hidden" animate="show" className="sticky top-0 z-40 flex items-center gap-3 bg-[rgba(245,158,11,0.05)] px-8 py-2.5">
          <motion.div variants={livePulse} initial="hidden" animate="show" className="h-[6px] w-[6px] rounded-full bg-[var(--amber)]" />
          <span className="font-mono text-[10px] tracking-[0.15em] text-[var(--amber)]">+2 weeks · delivery recalculated</span>
        </motion.div>

        <SectionHeader
          label="Change"
          title="JACK CHANGED HIS MIND."
          subtitle="Jack added something. Here&apos;s what it costs."
          accentColor="var(--amber)"
        />

        <motion.div
          initial={{ opacity: 0, x: -22, borderLeftWidth: "0px" }}
          animate={{ opacity: 1, x: 0, borderLeftWidth: "3px" }}
          transition={{ duration: 0.5, ease: EASE_EXPO }}
          className="glass-amber glass-noise rounded-xl px-6 py-5"
        >
          <div className="flex items-center gap-3 font-mono text-[11px] tracking-[0.12em] text-[var(--amber)]">
            <AlertTriangle size={16} className="text-[var(--amber)]" />
            Change
          </div>
          <div className="mt-3 font-ui text-[13px] leading-6 text-[rgba(200,180,140,0.85)]">
            You asked for a Pro subscription on Tuesday. That means a $29/month plan, an 80/20 split, and priority placement.
          </div>
          <div className="mt-2 font-mono text-[10px] tracking-[0.12em] text-[rgba(120,100,60,0.7)]">
            TEMPESTAI_PROCREATORPLAN_CHANGEREQUEST.PDF · Tuesday 14:22
          </div>
        </motion.div>

        <motion.div variants={fadeSlideUp} initial="hidden" animate="show" className="glass-sm glass-noise rounded-xl px-5 py-4">
          <div className="mb-3 font-mono text-[10px] tracking-[0.15em] text-[var(--amber)]">What changed</div>
          {changeSyncLines.map((line, index) => (
            <motion.div
              key={line.text}
              variants={terminalLine}
              initial="hidden"
              animate="show"
              transition={{ delay: index * 0.1 }}
              className="font-mono text-[11px] leading-7 text-[var(--text-primary)]"
            >
              <span className="text-[var(--text-muted)]">&gt; </span>
              <span className="text-[var(--amber)]">
                {line.text.split(/(done|✓)/g).map((segment, segmentIndex) => (
                  <span key={`${line.text}-${segmentIndex}`} className={segment === "done" || segment === "✓" ? "text-[var(--emerald)]" : ""}>
                    {segment}
                  </span>
                ))}
              </span>
            </motion.div>
          ))}
        </motion.div>

        <motion.div variants={staggerContainer(0.1, 0.2)} initial="hidden" animate="show" className="grid gap-4 lg:grid-cols-3">
          <ImpactPanel title="What changes" items={changePanels.dag} />
          <ImpactPanel title="Task impact" items={changePanels.tasks} />
          <ImpactPanel title="Delivery impact" items={changePanels.delivery} />
        </motion.div>

        {!applying && !applied ? (
          <div className="flex flex-wrap gap-3">
            <OrchestraButton variant="primary" onClick={() => setApplying(true)}>Apply Changes</OrchestraButton>
            <OrchestraButton variant="ghost">Defer to V2</OrchestraButton>
          </div>
        ) : null}

        {applying ? (
          <TerminalOutput
            label="PLAN UPDATE"
            lines={changeApplyLines}
            onComplete={() => {
              setApplying(false);
              setApplied(true);
            }}
          />
        ) : null}

        <AnimatePresence>
          {applied ? (
            <motion.div key="applied" variants={fadeSlideUp} initial="hidden" animate="show" exit="hidden" className="glass-emerald glass-noise rounded-xl px-8 py-8 text-center">
              <motion.div variants={approvalBurst} initial="hidden" animate="show" className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-[var(--emerald-border)]">
                <CheckCircle2 size={28} className="text-[var(--emerald)]" />
              </motion.div>
              <div className="font-title text-[36px] tracking-[0.06em] text-[var(--emerald)]">CHANGES APPLIED</div>
              <div className="mt-2 font-ui text-[13px] text-[var(--text-secondary)]">New delivery: Week 8.</div>
              <div className="mt-5 space-y-2">
                {changeApplyLines.map((line, index) => (
                  <motion.div
                    key={line.text}
                    variants={terminalLine}
                    initial="hidden"
                    animate="show"
                    transition={{ delay: index * 0.08 }}
                    className="font-mono text-[11px] text-[var(--text-primary)]"
                  >
                    {line.text}
                  </motion.div>
                ))}
              </div>
              <div className="mt-6">
                <OrchestraButton variant="ghost" onClick={() => router.push(getStageRoute(projectId, "8-tower"))}>
                  Open live view
                </OrchestraButton>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.div>
    </StageShell>
  );
}

function ImpactPanel({ title, items }: { title: string; items: string[] }) {
  return (
    <motion.div variants={fadeSlideUp} className="glass glass-hover rounded-xl px-5 py-5">
      <div className="mb-3 font-mono text-[10px] tracking-[0.12em] text-[var(--amber)]">{title}</div>
      <motion.div variants={staggerContainer(0.05, 0.05)} initial="hidden" animate="show" className="space-y-2">
        {items.map((item) => (
          <motion.div
            key={item}
            variants={fadeSlideUpFast}
            className="font-ui text-[12px] leading-6"
            style={{ color: item.includes("+2 weeks") || item.includes("MEDIUM RISK") ? "var(--rose)" : "var(--text-secondary)" }}
          >
            {item}
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
