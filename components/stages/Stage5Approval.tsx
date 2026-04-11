"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, MessageSquare } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { approvalBurst, fadeSlideUp, fadeSlideUpFast, pageContainer, scalePop, staggerContainer } from "@/lib/animations";
import { StageShell } from "@/components/layout/StageShell";
import { OrchestraButton } from "@/components/shared/OrchestraButton";
import { PrototypeFrame } from "@/components/shared/PrototypeFrame";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { approvalApprovers, scopeSummary } from "@/lib/mockData";
import { getStageRoute } from "@/lib/stageConfig";

const scopeColumns: Array<{ label: string; items: string[] }> = [
  { label: "IN SCOPE", items: scopeSummary.inScope },
  { label: "OUT OF SCOPE", items: scopeSummary.outOfScope }
];

export function Stage5Approval() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [comment, setComment] = useState("");
  const [approved, setApproved] = useState(false);
  const router = useRouter();
  const params = useParams<{ projectId: string }>();
  const projectId = typeof params?.projectId === "string" ? params.projectId : "p1";

  const particles = useMemo(
    () =>
      Array.from({ length: 8 }).map((_, index) => ({
        id: index,
        x: Math.random() * 200 - 100,
        y: -150 - Math.random() * 150,
        rotate: Math.random() * 720
      })),
    []
  );

  return (
    <StageShell showGrid>
      <motion.div variants={pageContainer} initial="hidden" animate="show" className="mx-auto max-w-7xl space-y-6 px-8 py-8">
        <SectionHeader
          label="Step 5"
          title="IS JACK HAPPY?"
          subtitle="Nothing gets built until Jack says yes."
          accentColor="var(--cyan)"
        />

        <AnimatePresence mode="wait">
          {!approved ? (
            <motion.div key="approval" variants={fadeSlideUp} initial="hidden" animate="show" exit="hidden" className="space-y-6">
              <motion.div variants={staggerContainer(0.1, 0.08)} initial="hidden" animate="show" className="grid gap-4 md:grid-cols-2">
                {approvalApprovers.map((person) => (
                  <motion.div
                    key={person.name}
                    variants={fadeSlideUp}
                    className={`${person.name === "Sarah Chen" ? "glass-emerald" : "glass-amber"} glass-hover rounded-xl px-5 py-5`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <div className="font-ui text-[13px] font-medium text-[var(--text-primary)]">
                          {person.name} · {person.role}
                        </div>
                        <div
                          className="mt-2 glass-sm inline-flex rounded-sm px-2 py-1 font-mono text-[9px] tracking-[0.12em]"
                          style={{
                            color: person.name === "Sarah Chen" ? "var(--emerald)" : "var(--amber)",
                            borderColor: person.name === "Sarah Chen" ? "var(--emerald-border)" : "var(--amber-border)"
                          }}
                        >
                          {person.name === "Sarah Chen" ? "Reviewed ✓" : "Waiting for you, Jack."}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div variants={fadeSlideUp} initial="hidden" animate="show" className="glass overflow-hidden rounded-xl p-5">
                <PrototypeFrame activeIndex={activeIndex} onChange={setActiveIndex} />
              </motion.div>

              <motion.div variants={fadeSlideUp} initial="hidden" animate="show" className="glass-sm rounded-xl px-5 py-4">
                <div className="grid gap-5 md:grid-cols-2">
                  {scopeColumns.map(({ label, items }) => (
                    <div key={label}>
                      <div className="mb-3 font-mono text-[10px] tracking-[0.12em] text-[var(--text-muted)]">{label}</div>
                      <motion.div variants={staggerContainer(0.05, 0.1)} initial="hidden" animate="show" className="space-y-2">
                        {(items as string[]).map((item) => (
                          <motion.div key={item} variants={fadeSlideUpFast} className="flex items-start gap-2">
                            <span
                              className="mt-2 h-1.5 w-1.5 rounded-full"
                              style={{ background: label === "IN SCOPE" ? "var(--emerald)" : "rgba(251,113,133,0.5)" }}
                            />
                            <span className="font-ui text-[12px] leading-6 text-[var(--text-secondary)]">{item}</span>
                          </motion.div>
                        ))}
                      </motion.div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div variants={fadeSlideUp} initial="hidden" animate="show" className="glass-sm rounded-lg">
                <textarea
                  value={comment}
                  onChange={(event) => setComment(event.target.value)}
                  placeholder="Leave Jack a note before he approves."
                  className="w-full resize-none bg-transparent px-4 py-4 font-ui text-[13px] text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)]"
                  rows={4}
                />
              </motion.div>

              <div className="flex flex-wrap gap-3">
                <div className="relative">
                  <OrchestraButton variant="primary" onClick={() => setApproved(true)}>
                    Approve Scope
                  </OrchestraButton>
                  <AnimatePresence>
                    {approved ? (
                      <motion.div key="particles" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pointer-events-none absolute inset-0">
                        {particles.map((particle) => (
                          <motion.div
                            key={particle.id}
                            initial={{ x: 0, y: 0, opacity: 1, scale: 1, rotate: 0 }}
                            animate={{
                              x: particle.x,
                              y: particle.y,
                              opacity: 0,
                              scale: 0.3,
                              rotate: particle.rotate
                            }}
                            transition={{ duration: 0.8 + Math.random() * 0.4 }}
                            className="absolute left-1/2 top-1/2 h-2 w-2 rounded-sm bg-[var(--accent-cyan)]"
                          />
                        ))}
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>
                <OrchestraButton variant="ghost" icon={MessageSquare}>
                  Request Changes
                </OrchestraButton>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="approved"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
              className="glass-emerald glass-noise rounded-xl px-8 py-10 text-center"
            >
              <motion.div variants={approvalBurst} initial="hidden" animate="show" className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-[var(--emerald-border)]">
                <CheckCircle2 size={30} className="text-[var(--emerald)]" />
              </motion.div>
              <div className="font-title text-[40px] tracking-[0.06em] text-[var(--emerald)]">SCOPE APPROVED</div>
              <div className="mt-2 font-ui text-[14px] text-[var(--text-secondary)]">Jack has approved. Build begins.</div>
              <motion.div variants={staggerContainer(0.08, 0.2)} initial="hidden" animate="show" className="mt-6 flex flex-wrap justify-center gap-3">
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
              <div className="mt-8">
                <OrchestraButton variant="ghost" onClick={() => router.push(getStageRoute(projectId, "6-execution"))}>
                  Go to execution
                </OrchestraButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </StageShell>
  );
}
