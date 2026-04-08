"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { StageShell } from "@/components/layout/StageShell";
import { OrchestraButton } from "@/components/shared/OrchestraButton";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { clarificationQuestions } from "@/lib/mockData";
import { cn } from "@/lib/utils";

const briefFields = [
  { label: "PRIMARY USER", answerIndex: 0, skeletonWidth: "58%" },
  { label: "CORE JOURNEY", answerIndex: 1, skeletonWidth: "72%" },
  { label: "MVP PROOF POINT", answerIndex: 2, skeletonWidth: "64%" },
  { label: "INTEGRATIONS (V1)", answerIndex: 3, skeletonWidth: "54%" },
  { label: "CONSTRAINTS", answerIndex: 4, skeletonWidth: "66%" },
  { label: "SIGN-OFF REQUIRED", answerIndex: 5, skeletonWidth: "48%" }
] as const;

export function Stage2Clarification() {
  const [answers, setAnswers] = useState<string[]>([]);
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [isAdvancing, setIsAdvancing] = useState(false);
  const [draftAnswer, setDraftAnswer] = useState("");
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const toastedRef = useRef(false);
  const timeoutRef = useRef<number | null>(null);
  const complete = answers.length === clarificationQuestions.length;

  useEffect(() => {
    const element = scrollRef.current;

    if (!element) return;

    const frame = window.requestAnimationFrame(() => {
      element.scrollTo({ top: element.scrollHeight, behavior: "smooth" });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [answers, activeQuestion, isAdvancing]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleAnswer = (answer: string) => {
    if (complete || isAdvancing || answers[activeQuestion]) return;

    const finalAnswer = answer.trim();

    if (!finalAnswer) return;

    const nextAnswers = [...answers, finalAnswer];
    setAnswers(nextAnswers);
    setIsAdvancing(true);
    setDraftAnswer("");

    timeoutRef.current = window.setTimeout(() => {
      if (nextAnswers.length === clarificationQuestions.length) {
        if (!toastedRef.current) {
          toast.success("Brief v1 generated");
          toastedRef.current = true;
        }
        setIsAdvancing(false);
        return;
      }

      setActiveQuestion((value) => value + 1);
      setIsAdvancing(false);
    }, 700);
  };

  const handleTypedSubmit = () => {
    handleAnswer(draftAnswer);
  };

  return (
    <StageShell showGrid className="min-h-0">
      <div className="flex min-h-full flex-col gap-6 min-[1080px]:h-full min-[1080px]:min-h-0">
        <SectionHeader
          title="CLARIFICATION ENGINE"
          subtitle="Resolve ambiguity and lock the MVP brief before orchestration begins"
        />

        <div className="grid gap-6 min-[1080px]:min-h-0 min-[1080px]:flex-1 min-[1080px]:grid-cols-[minmax(0,1.3fr)_minmax(340px,0.92fr)]">
          <div className="pm-card flex min-h-[560px] flex-col min-[1080px]:h-[calc(100vh-250px)] min-[1080px]:min-h-0">
            <div className="flex items-center border-b border-[#ececec] px-5 py-4">
              <MessageSquare size={14} strokeWidth={1.5} className="text-[#111111]" />
              <span className="ml-2 font-mono text-[10px] uppercase tracking-widest text-[#999999]">
                ORCHESTRA CLARIFICATION ENGINE
              </span>
              <span className="ml-auto font-mono text-[10px] uppercase tracking-widest text-[#999999]">
                6 QUESTIONS · EST. 2 MIN
              </span>
            </div>

            <div className="flex gap-4 border-b border-[#ececec] bg-white/60 px-5 py-4">
              <div>
                <div className="font-display text-[20px] font-semibold leading-none tracking-tight text-[#111111]">
                  {complete ? 6 : activeQuestion + 1}
                </div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-[#999999]">OF 6</div>
              </div>
              <div className="w-px bg-[#e8e8e8]" />
              <div className="flex flex-1 items-center">
                <div className="flex gap-2">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div
                      key={index}
                      className={cn(
                        "h-2.5 rounded-full transition-all duration-300",
                        complete || index < answers.length
                          ? "w-5 bg-[#111111]"
                          : index === activeQuestion
                            ? "w-4 bg-[#777777]"
                            : "w-2.5 bg-[#dddddd]"
                      )}
                    />
                  ))}
                </div>
              </div>
              <div className="self-center font-mono text-[10px] uppercase tracking-widest text-[#999999]">EST. 2 MIN</div>
            </div>

            <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
              {clarificationQuestions.map((question, index) => {
                if (index > activeQuestion) return null;

                const answer = answers[index];
                const isCurrent = index === activeQuestion && !complete;

                return (
                  <div key={question.q} className="mb-6">
                    <div className="flex gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#e0e0e0] bg-[#f7f7f7] font-mono text-[10px] text-[#333333]">
                        O
                      </div>
                      <div className="flex-1">
                        <div className="mb-1 font-mono text-[10px] uppercase tracking-widest text-[#999999]">
                          ORCHESTRA · CLARIFICATION ENGINE
                        </div>

                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className="rounded-xl border border-[#e8e8e8] bg-white/90 px-4 py-3 shadow-sm"
                        >
                          <div className="font-sans text-[13px] text-[#111111]">{question.q}</div>
                        </motion.div>

                        {isCurrent ? (
                          <div className="mt-3 space-y-4">
                            <div className="flex flex-wrap gap-2">
                              {question.options.map((option) => {
                                const selected = answer === option;

                                return (
                                  <button
                                    key={option}
                                    type="button"
                                    onClick={() => handleAnswer(option)}
                                    disabled={Boolean(answer) || isAdvancing}
                                    className={cn(
                                      "rounded-lg border px-3 py-2 font-sans text-[13px] text-[#111111] transition-colors",
                                      selected
                                        ? "border-[#111111] bg-[#111111]/[0.04]"
                                        : "border-[#e0e0e0] bg-white/90 hover:border-[#cfcfcf]",
                                      Boolean(answer) || isAdvancing ? "cursor-default opacity-80" : ""
                                    )}
                                  >
                                    {option}
                                  </button>
                                );
                              })}
                            </div>

                            <div className="rounded-xl border border-[#ececec] bg-[#fafafa] p-3">
                              <div className="mb-2 font-mono text-[10px] uppercase tracking-widest text-[#999999]">
                                OR TYPE A CUSTOM ANSWER
                              </div>
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  value={isCurrent ? draftAnswer : ""}
                                  onChange={(event) => setDraftAnswer(event.target.value)}
                                  onKeyDown={(event) => {
                                    if (event.key === "Enter") {
                                      event.preventDefault();
                                      handleTypedSubmit();
                                    }
                                  }}
                                  disabled={Boolean(answer) || isAdvancing}
                                  placeholder="Type a custom manager answer..."
                                  className="h-10 flex-1 rounded-lg border border-[#e0e0e0] bg-white px-3 py-2 font-sans text-[13px] text-[#111111] outline-none placeholder:text-[#bbbbbb] focus:border-[#999999] disabled:cursor-default disabled:opacity-60"
                                />
                                <button
                                  type="button"
                                  onClick={handleTypedSubmit}
                                  disabled={!draftAnswer.trim() || Boolean(answer) || isAdvancing}
                                  className="rounded-lg border border-[#111111] bg-[#111111] px-4 py-2 font-sans text-[13px] font-medium text-white transition-colors hover:bg-[#222222] disabled:cursor-not-allowed disabled:border-[#cccccc] disabled:bg-[#cccccc]"
                                >
                                  Send
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </div>

                    {answer ? (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-4 flex justify-end"
                      >
                        <div className="max-w-[78%]">
                          <div className="mb-1 text-right font-mono text-[10px] uppercase tracking-widest text-[#999999]">
                            SARAH CHEN · PROJECT MANAGER
                          </div>
                          <div className="rounded-xl border border-[#e8e8e8] bg-white/90 px-4 py-3 font-sans text-[13px] text-[#111111] shadow-sm">
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

          <div className="pm-card flex min-h-[520px] flex-col p-5 min-[1080px]:h-[calc(100vh-250px)] min-[1080px]:min-h-0">
            <div className="font-sans text-[15px] font-semibold text-[#111111]">
              {complete ? "BRIEF v1 READY" : "BRIEF v1 BUILDING"}
            </div>

            <div className="mt-5 flex-1 space-y-4 overflow-y-auto pr-1">
              {briefFields.map((field) => {
                const value = answers[field.answerIndex];

                return (
                  <div key={field.label} className="border-b border-[#ececec] pb-4 last:border-b-0">
                    <div className="mb-1 font-mono text-[10px] uppercase tracking-widest text-[#999999]">
                      {field.label}
                    </div>
                    <AnimatePresence initial={false} mode="wait">
                      {value ? (
                        <motion.div
                          key={`${field.label}-value`}
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 4 }}
                          transition={{ duration: 0.4 }}
                          className="font-sans text-[13px] text-[#111111]"
                        >
                          {value}
                        </motion.div>
                      ) : (
                        <motion.div
                          key={`${field.label}-skeleton`}
                          initial={{ opacity: 0.8 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="h-4 rounded bg-[#f0f0f0] animate-pulse"
                          style={{ width: field.skeletonWidth }}
                        />
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            <div className="mt-auto pt-6">
              <OrchestraButton
                variant="primary"
                onClick={() => router.push("/pm/3-dag")}
                disabled={!complete}
              >
                GENERATE PRODUCT FLOWCHART →
              </OrchestraButton>
            </div>
          </div>
        </div>
      </div>
    </StageShell>
  );
}
