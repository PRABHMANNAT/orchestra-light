"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { EASE_EXPO, fadeSlideUp, fadeSlideUpFast, pageContainer, staggerContainer } from "@/lib/animations";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { stakeholderTabs, weekUpdates } from "@/lib/mockData";

export function ClientUpdates() {
  const [openWeek, setOpenWeek] = useState<string | null>(null);

  return (
    <motion.div variants={pageContainer} initial="hidden" animate="show" className="space-y-6">
      <SectionHeader title="PROGRESS UPDATES" subtitle="Plain-English delivery updates generated from live project state" />

      <motion.div variants={fadeSlideUp} className="glass rounded-xl p-6">
        <div className="font-title text-[28px] tracking-[0.04em] text-[var(--text-primary)]">{stakeholderTabs.client.heading}</div>
        <div className="mt-1 font-mono text-[10px] tracking-[0.12em] text-[var(--text-muted)]">{stakeholderTabs.client.subheading}</div>
        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-ui text-[12px] text-[var(--text-secondary)]">Progress Overview</span>
            <span className="font-mono text-[10px] tracking-[0.12em] text-[var(--text-muted)]">61%</span>
          </div>
          <div className="h-[6px] overflow-hidden rounded-full bg-[rgba(255,255,255,0.05)]">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "61%" }}
              transition={{ duration: 1, ease: EASE_EXPO, delay: 0.2 }}
              className="h-full rounded-full bg-[linear-gradient(90deg,#00e5cc,rgba(0,229,204,0.7))]"
            />
          </div>
        </div>
        <motion.div variants={staggerContainer(0.05, 0.08)} initial="hidden" animate="show" className="mt-6 space-y-5">
          {stakeholderTabs.client.sections.map((section) => (
            <motion.div key={section.title} variants={fadeSlideUpFast}>
              <div className="mb-3 font-mono text-[10px] tracking-[0.12em] text-[var(--text-muted)]">{section.title}</div>
              <div className="font-ui text-[13px] leading-7 text-[var(--text-secondary)]">{section.content}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      <motion.div variants={staggerContainer(0.06, 0.04)} initial="hidden" animate="show" className="space-y-3">
        {weekUpdates.map((update) => (
          <motion.div key={update.label} variants={fadeSlideUp} className="glass rounded-xl">
            <button
              type="button"
              onClick={() => setOpenWeek((current) => (current === update.label ? null : update.label))}
              className="flex w-full items-center justify-between px-4 py-3"
            >
              <span className="font-ui text-[13px] text-[var(--text-primary)]">{update.label} update</span>
              <span className="font-mono text-[10px] tracking-[0.12em] text-[var(--text-muted)]">{openWeek === update.label ? "Hide" : "Show"}</span>
            </button>
            <AnimatePresence initial={false}>
              {openWeek === update.label ? (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="border-t border-[var(--border-subtle)] px-4 py-3 font-ui text-[13px] text-[var(--text-secondary)]">
                    {update.summary}
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
