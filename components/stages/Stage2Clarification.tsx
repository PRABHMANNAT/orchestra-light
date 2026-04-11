"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageSquare } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import {
  EASE_OUT_EXPO,
  SPRING_SNAPPY,
  SPRING_SOFT,
  chipBounce,
  fadeSlideUp,
  heightReveal,
  pageContainer,
  staggerContainer,
  terminalLine
} from "@/lib/animations";
import { StageShell } from "@/components/layout/StageShell";
import { OrchestraButton } from "@/components/shared/OrchestraButton";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { clarifiedBrief, clarificationQuestions } from "@/lib/mockData";
import { getStageRoute } from "@/lib/stageConfig";

export function Stage2Clarification() {
  const [answers, setAnswers] = useState<string[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showBrief, setShowBrief] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const params = useParams<{ projectId: string }>();
  const projectId = typeof params?.projectId === "string" ? params.projectId : "p1";
  const complete = answers.length === clarificationQuestions.length;

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [answers, currentQuestion, showBrief]);

  useEffect(() => {
    if (!complete) return;

    const timer = window.setTimeout(() => setShowBrief(true), 900);
    return () => window.clearTimeout(timer);
  }, [complete]);

  const activeQuestion = clarificationQuestions[currentQuestion];
  const answeredRows = clarifiedBrief.rows.slice(0, answers.length);

  const handleAnswer = (answer: string) => {
    if (answers[currentQuestion]) return;

    const next = [...answers, answer];
    setAnswers(next);

    window.setTimeout(() => {
      if (next.length < clarificationQuestions.length) {
        setCurrentQuestion((value) => value + 1);
      }
    }, 420);
  };

  const terminalLines = useMemo(
    () => [
      "Jack wants creators to succeed first.",
      "V1 is the creator journey, start to first sale.",
      "Stripe and tiers are in. Analytics and AI are out.",
      "Timeline is fixed. Scope is yours to manage.",
      "Brief locked. ✓"
    ],
    []
  );

  return (
    <StageShell showGrid>
      <motion.div variants={pageContainer} initial="hidden" animate="show" className="mx-auto max-w-7xl space-y-6 px-8 py-8">
        <SectionHeader
          label="Step 2"
          title="WHAT DOES JACK ACTUALLY WANT?"
          subtitle="Six questions. Then Orchestra knows what to build."
          accentColor="var(--violet)"
        />

        <div className="grid gap-6 xl:grid-cols-[1.25fr_0.95fr]">
          <motion.div variants={fadeSlideUp} initial="hidden" animate="show" className="glass-heavy glass-noise flex min-h-[680px] flex-col rounded-xl">
            <div className="flex items-center border-b border-[rgba(255,255,255,0.05)] px-5 py-3.5">
              <MessageSquare size={13} className="text-[var(--violet)]" />
              <span className="ml-2 font-mono text-[10px] tracking-[0.15em] text-[var(--violet)]">CLARIFICATION</span>
              <span className="ml-auto font-mono text-[9px] tracking-[0.12em] text-[var(--text-muted)]">6 questions</span>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-5">
              {clarificationQuestions.map((question, index) => {
                if (index > answers.length) return null;

                const answer = answers[index];
                const isCurrent = index === answers.length && !complete;

                return (
                  <div key={question.id} className="mb-6">
                    <motion.div
                      initial={{ opacity: 0, y: 16, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={SPRING_SOFT}
                      className="flex gap-3"
                    >
                      <div className="glass-sm flex h-7 w-7 items-center justify-center rounded-sm border border-[var(--violet-border)]">
                        <span className="font-mono text-[9px] text-[var(--violet)]">O</span>
                      </div>
                      <div className="flex-1">
                        <div className="mb-1 font-mono text-[9px] tracking-[0.12em] text-[var(--text-muted)]">
                          Orchestra
                        </div>
                        <div className="glass-sm rounded-lg px-4 py-3">
                          <div className="font-ui text-[13px] leading-6 text-[var(--text-primary)]">{question.q}</div>
                        </div>

                        {isCurrent ? (
                          <motion.div variants={staggerContainer(0.04, 0.15)} initial="hidden" animate="show" className="mt-3 flex flex-wrap gap-2">
                            {question.options.map((option) => {
                              const selected = answers[index] === option;
                              return (
                                <motion.button
                                  key={option}
                                  type="button"
                                  variants={chipBounce}
                                  whileTap={{ scale: 0.92 }}
                                  onClick={() => handleAnswer(option)}
                                  className={
                                    selected
                                      ? "glass-violet rounded-md px-3 py-1.5 font-ui text-[11px] text-[var(--violet)]"
                                      : "glass-sm rounded-md border border-[rgba(255,255,255,0.08)] px-3 py-1.5 font-ui text-[11px] text-[var(--text-secondary)] transition-colors hover:border-[var(--violet-border)] hover:text-[var(--violet)]"
                                  }
                                >
                                  {option}
                                </motion.button>
                              );
                            })}
                          </motion.div>
                        ) : null}
                      </div>
                    </motion.div>

                    {answer ? (
                      <motion.div
                        initial={{ opacity: 0, x: 20, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        transition={SPRING_SNAPPY}
                        className="mt-4 flex justify-end"
                      >
                        <div className="max-w-[78%]">
                          <div className="mb-1 text-right font-mono text-[9px] tracking-[0.12em] text-[var(--text-muted)]">JACK · TEMPEST AI</div>
                          <div className="glass-sm rounded-lg px-4 py-3 font-ui text-[13px] text-[var(--text-primary)]">{answer}</div>
                        </div>
                      </motion.div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </motion.div>

          <motion.div variants={fadeSlideUp} initial="hidden" animate="show" className="glass-heavy glass-noise flex min-h-[680px] flex-col rounded-xl">
            <div className="flex items-center border-b border-[rgba(255,255,255,0.05)] px-5 py-3.5">
              <span className="font-mono text-[10px] tracking-[0.15em] text-[var(--violet)]">THE BRIEF</span>
              <span className="ml-auto glass-sm rounded-sm px-2 py-1 font-mono text-[9px] tracking-[0.12em] text-[var(--text-muted)]">
                {complete ? "Ready" : "Taking shape"}
              </span>
            </div>

            <div className="flex-1 px-5 py-4">
              <div className="space-y-3">
                {clarifiedBrief.rows.map((row, index) => {
                  const answered = index < answeredRows.length;

                  return (
                    <div key={row.label} className="min-h-[52px]">
                      {!answered ? (
                        <div className="h-3 rounded bg-[rgba(255,255,255,0.04)] animate-pulse" />
                      ) : (
                        <AnimatePresence mode="wait">
                          <div style={{ overflow: "hidden" }}>
                            <motion.div key={row.label} variants={heightReveal} initial="hidden" animate="show" exit="exit" className="relative pl-4">
                              <motion.div
                                initial={{ scaleY: 0 }}
                                animate={{ scaleY: 1 }}
                                transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
                                style={{ transformOrigin: "top" }}
                                className="absolute left-0 top-0 h-full w-[2px] rounded-full bg-[var(--violet-border)]"
                              />
                              <div className="font-mono text-[9px] tracking-[0.12em] text-[var(--text-muted)]">{row.label}</div>
                              <div className="mt-1 font-ui text-[13px] leading-6 text-[var(--text-primary)]">{row.value}</div>
                            </motion.div>
                          </div>
                        </AnimatePresence>
                      )}
                    </div>
                  );
                })}
              </div>

              <AnimatePresence>
                {complete ? (
                  <motion.div key="terminal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-5 glass-sm rounded-lg px-4 py-4">
                    {terminalLines.map((line, index) => (
                      <motion.div
                        key={line}
                        variants={terminalLine}
                        initial="hidden"
                        animate="show"
                        transition={{ delay: index * 0.15 }}
                        className="font-mono text-[11px] leading-7"
                      >
                        <span className="text-[var(--violet)]">
                          {line.split(/(done|✓)/g).map((segment, segmentIndex) => (
                            <span key={`${line}-${segmentIndex}`} className={segment === "done" || segment === "✓" ? "text-[var(--emerald)]" : ""}>
                              {segment}
                            </span>
                          ))}
                        </span>
                      </motion.div>
                    ))}
                  </motion.div>
                ) : null}
              </AnimatePresence>

              <AnimatePresence>
                {showBrief ? (
                  <motion.div key="brief" variants={fadeSlideUp} initial="hidden" animate="show" exit="hidden" className="glass-violet glass-noise mt-5 rounded-xl px-6 py-5">
                    <div className="font-title text-[24px] tracking-[0.04em] text-[var(--text-primary)]">THE BRIEF</div>
                    <div className="mb-5 mt-1 font-mono text-[10px] tracking-[0.12em] text-[var(--text-muted)]">
                      Generated: {clarifiedBrief.generatedAt}
                    </div>
                    <div className="space-y-3">
                      {clarifiedBrief.rows.map((row) => (
                        <div key={row.label}>
                          <div className="font-mono text-[9px] tracking-[0.12em] text-[var(--text-muted)]">{row.label}</div>
                          <div className="mt-1 font-ui text-[13px] leading-6 text-[var(--text-primary)]">{row.value}</div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>

            <div className="px-5 pb-5">
              <OrchestraButton variant="primary" disabled={!complete} onClick={() => router.push(getStageRoute(projectId, "3-dag"))}>
                Generate Flowchart
              </OrchestraButton>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </StageShell>
  );
}
