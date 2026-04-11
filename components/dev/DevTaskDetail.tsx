"use client";

import { useState } from "react";
import { AlertTriangle, Flag } from "lucide-react";
import { motion } from "framer-motion";

import { fadeSlideUp, fadeSlideUpFast } from "@/lib/animations";
import { OrchestraButton } from "@/components/shared/OrchestraButton";
import { StatusBadge } from "@/components/shared/StatusBadge";

export interface DevTaskDetailProps {
  id: string;
  title: string;
  summary: string;
  epic: string;
  status: "in-progress" | "blocked";
  owner: string;
}

function TaskCheckbox({ checked, onToggle }: { checked: boolean; onToggle: () => void }) {
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

export function DevTaskDetail({ id, title, summary, epic, status, owner }: DevTaskDetailProps) {
  const [checked, setChecked] = useState(false);

  return (
    <motion.div variants={fadeSlideUp} initial="hidden" animate="show" className="glass rounded-xl px-5 py-5">
      <div className="flex gap-3">
        <TaskCheckbox checked={checked} onToggle={() => setChecked((value) => !value)} />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className={`font-ui text-[13px] ${checked ? "line-through opacity-40 decoration-[var(--text-muted)]" : "text-[var(--text-primary)]"}`}>
                {id} — {title}
              </div>
              <div className="mt-1 font-ui text-[13px] text-[var(--text-secondary)]">{epic}</div>
              <div className="mt-1 font-mono text-[9px] tracking-[0.12em] text-[var(--text-muted)]">OWNER · {owner}</div>
            </div>
            <StatusBadge variant={status} />
          </div>

          <div className={`mt-4 font-ui text-[13px] leading-6 ${checked ? "line-through opacity-40 decoration-[var(--text-muted)]" : "text-[var(--text-secondary)]"}`}>
            {summary}
          </div>

          {status === "blocked" ? (
            <motion.div variants={fadeSlideUpFast} initial="hidden" animate="show" className="glass-amber mt-4 rounded-xl px-4 py-3">
              <div className="flex items-center gap-2 font-ui text-[13px] text-[var(--text-primary)]">
                <AlertTriangle size={12} strokeWidth={1.5} className="text-[var(--amber)]" />
                Founder dependency blocking payout verification.
              </div>
              <div className="mt-3">
                <OrchestraButton variant="ghost" size="sm" icon={Flag}>
                  Escalate blocker
                </OrchestraButton>
              </div>
            </motion.div>
          ) : (
            <div className="mt-4">
              <OrchestraButton variant="ghost" size="sm">
                Update status
              </OrchestraButton>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
