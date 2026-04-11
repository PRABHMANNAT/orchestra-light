"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, MessageSquare } from "lucide-react";

import { fadeSlideUp, fadeSlideUpFast, pageContainer, staggerContainer } from "@/lib/animations";
import { OrchestraButton } from "@/components/shared/OrchestraButton";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { scopeSummary } from "@/lib/mockData";

export function ClientApprovalPanel() {
  const [approved, setApproved] = useState(false);

  return (
    <motion.div variants={pageContainer} initial="hidden" animate="show" className="space-y-6">
      <SectionHeader
        title="APPROVALS"
        subtitle="Review the agreed Creator Marketplace V1 scope and confirm whether the agency should continue delivery"
      />

      <motion.div variants={fadeSlideUp} className="glass glass-noise rounded-xl p-5">
        <div className="flex items-center gap-3">
          <UserAvatar initials="J" role="client" />
          <div>
            <div className="font-ui text-[13px] text-[var(--text-primary)]">Jack</div>
            <div className="font-mono text-[10px] tracking-[0.12em] text-[var(--text-muted)]">Founder · Tempest AI</div>
          </div>
        </div>
      </motion.div>

      <motion.div variants={fadeSlideUp} className="glass rounded-xl p-5">
        <div className="mb-4 font-mono text-[10px] tracking-[0.12em] text-[var(--text-muted)]">WHAT WE&apos;RE BUILDING IN THIS PHASE</div>
        <motion.div variants={staggerContainer(0.05, 0.06)} initial="hidden" animate="show" className="space-y-2">
          {scopeSummary.inScope.map((item) => (
            <motion.div key={item} variants={fadeSlideUpFast} className="font-ui text-[13px] text-[var(--text-secondary)]">
              ✓ {item}
            </motion.div>
          ))}
        </motion.div>
        <div className="mb-4 mt-5 font-mono text-[10px] tracking-[0.12em] text-[var(--text-muted)]">WHAT WE&apos;RE NOT BUILDING YET</div>
        <motion.div variants={staggerContainer(0.05, 0.06)} initial="hidden" animate="show" className="space-y-2">
          {scopeSummary.outOfScope.map((item) => (
            <motion.div key={item} variants={fadeSlideUpFast} className="font-ui text-[13px] text-[var(--text-secondary)]">
              → {item}
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      <div className="flex flex-wrap gap-3">
        <OrchestraButton variant="primary" onClick={() => setApproved(true)} icon={CheckCircle2}>
          Approve This Scope
        </OrchestraButton>
        <OrchestraButton variant="ghost" icon={MessageSquare}>
          Request Revisions
        </OrchestraButton>
      </div>

      <AnimatePresence>
        {approved ? (
          <motion.div key="approved" variants={fadeSlideUp} initial="hidden" animate="show" exit="hidden" className="glass-cyan rounded-xl p-5 font-mono text-[10px] tracking-[0.12em] text-[var(--accent-cyan)]">
            Scope approved — Jack sign-off recorded for Tempest AI.
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}
