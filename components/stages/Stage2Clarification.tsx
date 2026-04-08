"use client";

import { useEffect, useRef, useState } from "react";
import { MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { StageShell } from "@/components/layout/StageShell";
import { OrchestraButton } from "@/components/shared/OrchestraButton";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { clarifiedBriefRows, clarificationQuestions } from "@/lib/mockData";
import { cn } from "@/lib/utils";

export function Stage2Clarification() {
  const [answers, setAnswers] = useState<string[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const toastedRef = useRef(false);
  const complete = answers.length === clarificationQuestions.length;

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [answers, currentQuestion]);

  const handleAnswer = (answer: string) => {
    if (answers[currentQuestion]) return;

    const nextAnswers = [...answers, answer];
    setAnswers(nextAnswers);

    window.setTimeout(() => {
      if (nextAnswers.length === clarificationQuestions.length) {
        if (!toastedRef.current) {
          toast.success("Brief v1 generated");
          toastedRef.current = true;
        }
        return;
      }

      setCurrentQuestion((value) => value + 1);
    }, 700);
  };

  return (
    <StageShell showGrid>
      <div className="flex h-full flex-col gap-6">
        <SectionHeader
          title="CLARIFICATION ENGINE"
          subtitle="Resolve ambiguity and lock the MVP brief before orchestration begins"
        />
        <div className="grid flex-1 gap-6 xl:grid-cols-[1.4fr_1fr]">
          <div className="pm-card flex min-h-[640px] flex-col overflow-hidden">
            <div className="flex items-center border-b border-[#f0f0f0] px-5 py-4">
              <MessageSquare size={13} strokeWidth={1.5} className="text-[#999999]" />
              <span className="ml-2 font-mono text-[11px] uppercase tracking-[0.12em] text-[#999999]">
                ORCHESTRA CLARIFICATION ENGINE
              </span>
              <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.12em] text-[#999999]">
                6 QUESTIONS · EST. 2 MIN
              </span>
            </div>

            <div className="flex gap-4 border-b border-[#f0f0f0] bg-[#fafafa] px-5 py-4">
              <div>
                <div className="font-sans text-[20px] font-semibold leading-none text-[#111111]">
                  {complete ? clarificationQuestions.length : currentQuestion + 1}
                </div>
                <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.12em] text-[#999999]">
                  OF {clarificationQuestions.length}
                </div>
              </div>
              <div className="w-px bg-[#ececec]" />
              <div className="flex flex-1 items-center">
                <div className="flex gap-2">
                  {Array.from({ length: clarificationQuestions.length }).map((_, index) => (
                    <div
                      key={index}
                      className={cn(
                        "h-2 w-2 rounded-full transition-all duration-300",
                        complete || index < answers.length
                          ? "bg-[#22c55e]"
                          : index === answers.length
                            ? "bg-[#111111]"
                            : "bg-[#d9d9d9]"
                      )}
                    />
                  ))}
                </div>
              </div>
              <div className="self-center font-mono text-[10px] uppercase tracking-[0.12em] text-[#999999]">
                EST. 2 MIN
              </div>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto bg-[#fcfcfc] px-5 py-5">
              {clarificationQuestions.map((question, index) => {
                if (index > answers.length) return null;

                const answer = answers[index];
                const isCurrent = index === answers.length && !complete;

                return (
                  <div key={question.q} className="mb-6">
                    <div className="flex gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#e0e0e0] bg-[#f7f7f7] font-mono text-[10px] text-[#555555]">
                        O
                      </div>
                      <div className="flex-1">
                        <div className="mb-1 font-mono text-[9px] uppercase tracking-[0.12em] text-[#999999]">
                          ORCHESTRA · CLARIFICATION ENGINE
                        </div>
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="rounded-2xl border border-[#e8e8e8] bg-white/90 px-4 py-3 shadow-sm"
                        >
                          <div className="font-sans text-[13px] text-[#111111]">{question.q}</div>
                        </motion.div>

                        {isCurrent ? (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {question.options.map((option) => (
                              <button
                                key={option}
                                type="button"
                                onClick={() => handleAnswer(option)}
                                className="rounded-full border border-[#dddddd] bg-white px-3 py-2 font-sans text-[13px] text-[#111111] transition-colors hover:border-[#111111] hover:text-[#111111]"
                              >
                                {option}
                              </button>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    </div>

                    {answer ? (
                      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 flex justify-end">
                        <div className="max-w-[78%]">
                          <div className="mb-1 text-right font-mono text-[9px] uppercase tracking-[0.12em] text-[#999999]">
                            SARAH CHEN · PROJECT MANAGER
                          </div>
                          <div className="rounded-2xl border border-[#e8e8e8] bg-[#fafafa] px-4 py-3 font-sans text-[13px] text-[#111111] shadow-sm">
                            {answer}
                          </div>
                        </div>
                      </motion.div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex min-h-[640px] flex-col rounded-2xl border border-white/[0.75] bg-white/[0.65] p-5 shadow-glass backdrop-blur-xl">
            <div className={cn("font-mono text-[10px] uppercase tracking-[0.14em]", complete ? "text-[#111111]" : "text-[#999999]")}>
              {complete ? "BRIEF v1 — READY" : "BRIEF v1 — BUILDING..."}
            </div>
            <div className="mt-5 space-y-3">
              {clarifiedBriefRows.map((row, index) => (
                <div key={row.label} className="border-b border-[#f0f0f0] py-2.5 last:border-b-0">
                  <div className="mb-1 font-mono text-[10px] uppercase tracking-widest text-[#999999]">{row.label}</div>
                  {answers[index] ? (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                      className="font-sans text-[13px] text-[#111111]"
                    >
                      {row.value}
                    </motion.div>
                  ) : (
                    <div className="h-4 rounded-md bg-[#f0f0f0] animate-pulse" />
                  )}
                </div>
              ))}
            </div>
            <div className="mt-auto pt-6">
              <OrchestraButton variant="primary" onClick={() => router.push("/pm/3-dag")} disabled={!complete}>
                GENERATE PRODUCT FLOWCHART →
              </OrchestraButton>
            </div>
          </div>
        </div>
      </div>
    </StageShell>
  );
}
