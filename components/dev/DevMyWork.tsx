"use client";

import { useState } from "react";
import { motion } from "framer-motion";

import { chipBounce, fadeSlideUp, pageContainer, slideInLeft, staggerContainer } from "@/lib/animations";
import { StageShell } from "@/components/layout/StageShell";
import { DevTaskDetail } from "@/components/dev/DevTaskDetail";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { devInProgress, devSummary, devTodo } from "@/lib/mockData";

function TodoCheckbox({ checked, onToggle }: { checked: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="mt-0.5 flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center rounded-full border transition-colors"
      style={{
        borderColor: checked ? "var(--cyan)" : "rgba(255,255,255,0.2)",
        background: checked ? "rgba(0,229,204,0.15)" : "transparent"
      }}
    >
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
        <motion.path
          d="M1.5 5.2 3.8 7.5 8.5 2.5"
          stroke="#00e5cc"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: checked ? 1 : 0, opacity: checked ? 1 : 0 }}
          transition={{ duration: 0.22 }}
        />
      </svg>
    </button>
  );
}

export function DevMyWork() {
  const [checkedTodo, setCheckedTodo] = useState<Record<string, boolean>>({});
  const capacityHours = 32;
  const bookedHours = 29;
  const capacityTone = bookedHours >= capacityHours ? "var(--rose)" : bookedHours >= capacityHours * 0.8 ? "var(--amber)" : "var(--emerald)";

  return (
    <StageShell showGrid>
      <motion.div variants={pageContainer} initial="hidden" animate="show" className="mx-auto max-w-6xl space-y-6 px-8 py-8">
        <SectionHeader title="MY WORK" subtitle="The work on Mike's plate right now." accentColor="var(--emerald)" />

        <motion.div variants={staggerContainer(0.05, 0.04)} initial="hidden" animate="show" className="flex flex-wrap gap-2">
          {devSummary.map((item) => (
            <motion.div
              key={item}
              variants={chipBounce}
              className="glass-sm rounded-md px-3 py-1.5 font-mono text-[10px] tracking-[0.12em] text-[var(--text-secondary)]"
            >
              {item}
            </motion.div>
          ))}
        </motion.div>

        <motion.div variants={fadeSlideUp} className="glass rounded-xl px-5 py-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="font-mono text-[10px] tracking-[0.12em] text-[var(--text-muted)]">CAPACITY</div>
              <div className="mt-2 font-display text-[32px] leading-none text-[var(--text-primary)]">
                {bookedHours}<span className="ml-1 font-mono text-[12px] text-[var(--text-muted)]">/ {capacityHours}h</span>
              </div>
            </div>
            <div className="w-[180px]">
              <div className="mb-2 text-right font-mono text-[9px]" style={{ color: capacityTone }}>
                {Math.round((bookedHours / capacityHours) * 100)}%
              </div>
              <div className="h-[3px] rounded-full bg-[rgba(255,255,255,0.05)]">
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: bookedHours / capacityHours }}
                  transition={{ duration: 0.8 }}
                  className="h-[3px] rounded-full"
                  style={{ transformOrigin: "left", background: capacityTone }}
                />
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div variants={staggerContainer(0.08, 0.05)} initial="hidden" animate="show" className="space-y-4">
          {devInProgress.map((task) => (
            <DevTaskDetail key={task.id} {...task} />
          ))}
        </motion.div>

        <motion.div variants={fadeSlideUp} className="glass rounded-xl px-5 py-5">
          <div className="mb-4 font-mono text-[10px] tracking-[0.12em] text-[var(--text-muted)]">UP NEXT</div>
          <motion.div variants={staggerContainer(0.05, 0.1)} initial="hidden" animate="show" className="space-y-3">
            {devTodo.map((task) => {
              const checked = Boolean(checkedTodo[task.id]);
              return (
                <motion.div key={task.id} variants={slideInLeft} className="glass-sm rounded-xl px-4 py-3">
                  <div className="flex gap-3">
                    <TodoCheckbox
                      checked={checked}
                      onToggle={() => setCheckedTodo((current) => ({ ...current, [task.id]: !current[task.id] }))}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div className={`font-ui text-[13px] ${checked ? "line-through opacity-40 decoration-[var(--text-muted)]" : "text-[var(--text-primary)]"}`}>
                          {task.id} — {task.title}
                        </div>
                        <StatusBadge variant={task.status} />
                      </div>
                      <div className={`mt-2 font-ui text-[13px] ${checked ? "line-through opacity-40 decoration-[var(--text-muted)]" : "text-[var(--text-secondary)]"}`}>
                        {task.note}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      </motion.div>
    </StageShell>
  );
}
