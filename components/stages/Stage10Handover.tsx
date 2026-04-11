"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { approvalBurst, fadeSlideUp, fadeSlideUpFast, pageContainer, scalePop, staggerContainer } from "@/lib/animations";
import { StageShell } from "@/components/layout/StageShell";
import { OrchestraButton } from "@/components/shared/OrchestraButton";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { handoverCards } from "@/lib/mockData";

export function Stage10Handover() {
  const router = useRouter();
  useParams<{ projectId: string }>();

  return (
    <StageShell showGrid>
      <motion.div variants={pageContainer} initial="hidden" animate="show" className="mx-auto max-w-7xl space-y-8 px-8 py-8">
        <SectionHeader
          label="Done"
          title="IT SHIPPED."
          subtitle="Creator Marketplace V1 is live."
          accentColor="var(--emerald)"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="glass-emerald glass-noise rounded-xl px-10 py-12 text-center"
        >
          <motion.div variants={approvalBurst} initial="hidden" animate="show" className="mx-auto w-fit" style={{ filter: "drop-shadow(0 0 24px rgba(52,211,153,0.8))" }}>
            <CheckCircle2 size={48} className="text-[var(--emerald)]" />
          </motion.div>
          <div className="mt-5 font-mono text-[11px] tracking-[0.2em] text-[var(--emerald)]">CREATOR MARKETPLACE V1</div>
          <div className="mt-2 font-title text-[72px] leading-[0.9] text-[var(--emerald)]">DELIVERED</div>
          <div className="mt-3 font-ui text-[14px] text-[var(--text-secondary)]">Tempest AI · Jack</div>

          <motion.div variants={staggerContainer(0.08, 0.4)} initial="hidden" animate="show" className="mt-6 flex flex-wrap justify-center gap-3">
            {["JACK APPROVED ✓", "SARAH CHEN ✓", "QA PASSED ✓"].map((badge) => (
              <motion.div
                key={badge}
                variants={scalePop}
                className={`rounded-lg px-4 py-2 font-mono text-[9px] tracking-[0.12em] ${
                  badge.startsWith("JACK") ? "glass-blue text-[var(--blue)]" : badge.startsWith("SARAH") ? "glass-cyan text-[var(--cyan)]" : "glass-emerald text-[var(--emerald)]"
                }`}
              >
                {badge}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div variants={staggerContainer(0.07, 0.2)} initial="hidden" animate="show" className="grid gap-4 lg:grid-cols-3">
          {handoverCards.manager.map((group) => (
            <motion.div
              key={group.title}
              variants={fadeSlideUp}
              className={`glass-hover glass-noise rounded-xl px-5 py-5 ${
                group.title === "DELIVERABLES" ? "glass-emerald" : group.title === "DOCUMENTATION" ? "glass-violet" : "glass-blue"
              }`}
            >
              <div className="mb-4 font-mono text-[10px] tracking-[0.12em] text-[var(--text-muted)]">{group.title}</div>
              <div className="space-y-2">
                {group.items.map((item) => (
                  <div key={item} className="font-ui text-[12px] leading-6 text-[var(--text-secondary)]">
                    {item}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div variants={staggerContainer(0.06, 0.5)} initial="hidden" animate="show" className="flex flex-wrap gap-4">
          <motion.div variants={fadeSlideUpFast}>
            <OrchestraButton variant="primary" onClick={() => router.push("/client")}>
              Open Client Portal →
            </OrchestraButton>
          </motion.div>
          <motion.div variants={fadeSlideUpFast}>
            <OrchestraButton variant="secondary">Export Report</OrchestraButton>
          </motion.div>
          <motion.div variants={fadeSlideUpFast}>
            <OrchestraButton variant="ghost" onClick={() => router.push("/pm/dashboard")}>
              Start New Project
            </OrchestraButton>
          </motion.div>
        </motion.div>
      </motion.div>
    </StageShell>
  );
}
