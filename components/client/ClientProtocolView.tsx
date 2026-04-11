"use client";

import { useState } from "react";
import { motion } from "framer-motion";

import { fadeSlideUp, pageContainer, staggerContainer } from "@/lib/animations";
import { PrototypeFrame } from "@/components/shared/PrototypeFrame";
import { OrchestraButton } from "@/components/shared/OrchestraButton";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { clientComments } from "@/lib/mockData";

export function ClientProtocolView() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [comment, setComment] = useState("");

  return (
    <motion.div variants={pageContainer} initial="hidden" animate="show" className="space-y-6">
      <SectionHeader
        title="PROTOTYPE REVIEW"
        subtitle="Tempest AI — Creator Marketplace V1 prototype — for Jack's review and approval"
      />
      <motion.div variants={fadeSlideUp} className="glass rounded-xl p-5 font-ui text-[13px] leading-7 text-[var(--text-secondary)]">
        We&apos;ve built an interactive prototype of Tempest AI&apos;s creator marketplace. It focuses on the flow you prioritised first:
        creator signup, asset upload, and publish readiness. Review the five screens and flag anything that should change before the agency continues build.
      </motion.div>

      <motion.div variants={fadeSlideUp} className="glass rounded-xl p-5">
        <PrototypeFrame activeIndex={activeIndex} onChange={setActiveIndex} />
      </motion.div>

      <motion.div variants={fadeSlideUp} className="glass rounded-xl p-5">
        <div className="font-mono text-[10px] tracking-[0.12em] text-[var(--text-muted)]">FOR SCREEN {activeIndex + 1}</div>
        <input
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          placeholder="Add a comment or revision request for this creator-facing screen..."
          className="tactical-input mt-3 w-full rounded-lg px-4 py-3 font-ui text-[13px] text-[var(--text-primary)] outline-none placeholder:text-[var(--input-placeholder)]"
        />
        <div className="mt-3">
          <OrchestraButton variant="ghost" size="sm">
            Add Comment
          </OrchestraButton>
        </div>
      </motion.div>

      <motion.div variants={staggerContainer(0.06, 0.04)} initial="hidden" animate="show" className="space-y-3">
        {clientComments.map((item) => (
          <motion.div key={`${item.screen}-${item.timestamp}`} variants={fadeSlideUp} className="glass rounded-xl p-4">
            <div className="font-mono text-[10px] tracking-[0.12em] text-[var(--text-muted)]">{item.screen}</div>
            <div className="mt-2 font-ui text-[13px] leading-7 text-[var(--text-primary)]">{item.body}</div>
            <div className="mt-2 font-mono text-[10px] tracking-[0.12em] text-[var(--text-muted)]">
              {item.author} · {item.timestamp}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
