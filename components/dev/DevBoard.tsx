"use client";

import { motion } from "framer-motion";

import { fadeSlideUp, pageContainer, staggerContainer } from "@/lib/animations";
import { StageShell } from "@/components/layout/StageShell";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { sprintBoard } from "@/lib/mockData";

const columns = [
  { key: "todo", label: "TODO" },
  { key: "inProgress", label: "IN PROGRESS" },
  { key: "inReview", label: "IN REVIEW" },
  { key: "done", label: "DONE" }
] as const;

export function DevBoard() {
  return (
    <StageShell showGrid>
      <motion.div variants={pageContainer} initial="hidden" animate="show" className="mx-auto max-w-7xl space-y-6 px-8 py-8">
        <SectionHeader title="SPRINT BOARD" subtitle="Visual delivery board for Sprint 3" />
        <motion.div variants={staggerContainer(0.1, 0.04)} initial="hidden" animate="show" className="grid gap-4 xl:grid-cols-4">
          {columns.map((column, columnIndex) => (
            <motion.div key={column.key} variants={fadeSlideUp} className="glass rounded-xl p-4">
              <div className="mb-4 font-mono text-[10px] tracking-[0.12em] text-[var(--text-muted)]">{column.label}</div>
              <motion.div variants={staggerContainer(0.06, 0.1 * columnIndex)} initial="hidden" animate="show" className="space-y-2">
                {sprintBoard[column.key].map((card) => (
                  <motion.div
                    key={card.id}
                    variants={fadeSlideUp}
                    whileHover={{ y: -3, boxShadow: "0 8px 24px rgba(0,229,204,0.1)" }}
                    whileTap={{ scale: 0.98 }}
                    className="glass-sm rounded-lg p-3"
                  >
                    <div className="font-ui text-[13px] text-[var(--text-primary)]">{card.title}</div>
                    <div className="mt-1 font-mono text-[11px] text-[var(--text-muted)]">
                      FLOWCHART: {card.dag} · {card.id}
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="font-mono text-[11px] text-[var(--text-muted)]">{card.epic}</span>
                      <StatusBadge variant={card.priority as "p0" | "p1" | "p2"} />
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </StageShell>
  );
}
