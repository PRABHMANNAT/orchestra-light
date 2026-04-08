"use client";

import { useEffect, useRef, useState } from "react";
import { FileSearch, FileText, GitFork, Layers, MessageSquare, Upload } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { StageShell } from "@/components/layout/StageShell";
import { AppIcon } from "@/components/shared/AppIcon";
import { OrchestraButton } from "@/components/shared/OrchestraButton";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { TerminalOutput } from "@/components/shared/TerminalOutput";
import { intakeAnalysisLines, intakeCards, intakeUploadFile } from "@/lib/mockData";
import { cn } from "@/lib/utils";

type IntakeState = "idle" | "uploading" | "parsing" | "done";

const explainerSteps = [
  {
    step: "01",
    icon: FileSearch,
    title: "Document Parsing",
    desc: "Orchestra chunks and classifies your SRS — extracting actors, features, constraints, integrations, and risks."
  },
  {
    step: "02",
    icon: MessageSquare,
    title: "Clarification Questions",
    desc: "Orchestra identifies gaps in your requirements and asks the manager-style questions that prevent confusion later."
  },
  {
    step: "03",
    icon: GitFork,
    title: "Product Flowchart",
    desc: "A delivery workflow map that shows what must happen before what, before any prototype is generated."
  },
  {
    step: "04",
    icon: Layers,
    title: "Prototype from Slice",
    desc: "The smallest believable MVP path is extracted from the product flowchart and turned into a client-approvable prototype."
  }
];

export function Stage1Intake() {
  const [state, setState] = useState<IntakeState>("idle");
  const [terminalReady, setTerminalReady] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const hasToastedRef = useRef(false);
  const router = useRouter();

  useEffect(() => {
    if (state !== "uploading") {
      return;
    }

    const timer = window.setTimeout(() => {
      setState("parsing");
    }, 1600);

    return () => window.clearTimeout(timer);
  }, [state]);

  const beginUpload = () => {
    setTerminalReady(false);
    setState("uploading");
  };

  return (
    <StageShell showGrid>
      <div className="mx-auto max-w-7xl">
        <AnimatePresence mode="wait">
          {state === "idle" ? (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="grid min-h-[720px] gap-6 xl:grid-cols-2"
            >
              <div className="flex flex-col gap-4">
                <SectionHeader
                  title="INTAKE"
                  subtitle="Upload your SRS, PRD, notes, screenshots or voice material"
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="group relative flex min-h-[300px] flex-1 flex-col items-center justify-center gap-4 overflow-hidden rounded-2xl border border-dashed border-[#d8d8d8] bg-white/70 shadow-sm transition-colors hover:border-[#bdbdbd] hover:bg-white/85"
                >
                  <div className="absolute left-0 top-0 h-6 w-6 border-l border-t border-[#dcdcdc]" />
                  <div className="absolute right-0 top-0 h-6 w-6 border-r border-t border-[#dcdcdc]" />
                  <div className="absolute bottom-0 left-0 h-6 w-6 border-b border-l border-[#dcdcdc]" />
                  <div className="absolute bottom-0 right-0 h-6 w-6 border-b border-r border-[#dcdcdc]" />

                  <Upload size={36} strokeWidth={1} className="text-[#555555] group-hover:text-[#111111]" />
                  <div className="text-center">
                    <div className="font-display text-[28px] font-semibold tracking-tight text-[#555555] group-hover:text-[#111111]">
                      DROP FILES HERE
                    </div>
                    <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.15em] text-[#999999]">
                      SRS · PRD · SCREENSHOTS · NOTES · VOICE
                    </div>
                    <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.1em] text-[#999999]">
                      PDF · DOCX · PNG · MP3 · TXT
                    </div>
                  </div>
                  <div className="rounded-full border border-[#d7d7d7] px-4 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-[#333333] group-hover:border-[#111111] group-hover:text-[#111111]">
                    OR CLICK TO BROWSE
                  </div>
                </button>

                <input ref={fileInputRef} type="file" className="hidden" multiple onChange={beginUpload} />

                <div className="flex flex-wrap gap-2">
                  {["📄 SRS Document", "🔗 Reference Links", "🎙️ Voice Notes", "📸 Screenshots", "📝 Client Notes"].map((item) => (
                    <button
                      key={item}
                      type="button"
                      className="rounded-full border border-[#cccccc] px-3 py-1.5 font-mono text-[10px] text-[#333333] hover:border-[#111111] hover:text-[#111111]"
                    >
                      {item}
                    </button>
                  ))}
                </div>

                <OrchestraButton variant="primary" icon={Upload} fullWidth onClick={beginUpload}>
                  UPLOAD & ANALYSE
                </OrchestraButton>
              </div>

              <div className="flex flex-col gap-4 pt-[136px]">
                <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#999999]">WHAT HAPPENS NEXT</div>
                {explainerSteps.map((item, index) => (
                  <motion.div
                    key={item.step}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.08, duration: 0.35 }}
                    className="pm-card flex items-start gap-4 bg-white px-4 py-3"
                  >
                    <div className="mt-0.5 w-10 shrink-0 font-sans text-[28px] font-bold leading-none text-[#111111]">{item.step}</div>
                    <div>
                      <div className="mb-1 flex items-center gap-2">
                        <item.icon size={13} strokeWidth={1.5} className="text-[#999999]" />
                        <span className="font-sans text-[15px] font-semibold text-[#111111]">{item.title}</span>
                      </div>
                      <p className="font-sans text-[13px] leading-relaxed text-[#444444]">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : null}

          {state === "uploading" ? (
            <motion.div key="uploading" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
              <SectionHeader title="INTAKE" subtitle="Uploading source material into the Orchestra analysis pipeline" />
              <div className="pm-card mt-8 flex items-center gap-3 border border-[#e8e8e8] bg-white px-4 py-3">
                <FileText size={16} strokeWidth={1.5} className="text-[#999999]" />
                <div className="flex-1">
                  <div className="font-sans text-[13px] text-[#111111]">{intakeUploadFile.name}</div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#999999]">{intakeUploadFile.size}</div>
                </div>
                <div className="w-[220px]">
                  <div className="h-1 overflow-hidden rounded-full bg-[#eeeeee]">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 1.6, ease: "easeOut" }}
                      className="h-full rounded-full bg-[#111111]"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ) : null}

          {state === "parsing" ? (
            <motion.div
              key="parsing"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="space-y-5"
            >
              <SectionHeader title="INTAKE" subtitle="Parsing uploaded material into a structured, delivery-ready brief" />
              <TerminalOutput
                label="ORCHESTRA ANALYSIS ENGINE — REF: ORC-2024-0441"
                lines={intakeAnalysisLines}
                onComplete={() => {
                  setTerminalReady(true);
                  if (!hasToastedRef.current) {
                    toast.success("Analysis complete — confidence 94%");
                    hasToastedRef.current = true;
                  }
                }}
              />
              {terminalReady ? (
                <OrchestraButton variant="primary" onClick={() => setState("done")}>
                  VIEW ANALYSIS RESULTS
                </OrchestraButton>
              ) : null}
            </motion.div>
          ) : null}

          {state === "done" ? (
            <motion.div key="done" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <SectionHeader title="INTAKE" subtitle="Analysis complete — Orchestra has extracted the working product model" />
              <TerminalOutput label="ORCHESTRA ANALYSIS ENGINE — REF: ORC-2024-0441" lines={intakeAnalysisLines} compact />
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#999999]">
                ANALYSIS RESULTS — CONFIDENCE 94%
              </div>
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: {},
                  visible: {
                    transition: { staggerChildren: 0.05 }
                  }
                }}
                className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
              >
                {intakeCards.map((card) => (
                  <motion.div
                    key={card.title}
                    variants={{
                      hidden: { opacity: 0, y: 10 },
                      visible: { opacity: 1, y: 0 }
                    }}
                    className={cn(
                      "pm-card border bg-white p-4",
                      card.tone === "red"
                        ? "border-[rgba(239,68,68,0.25)]"
                        : card.tone === "amber"
                          ? "border-[rgba(245,158,11,0.25)]"
                          : "border-border"
                    )}
                  >
                    <div className="mb-4 font-mono text-[10px] uppercase tracking-widest text-[#999999]">
                      <AppIcon
                        name={card.icon as Parameters<typeof AppIcon>[0]["name"]}
                        className={
                          card.tone === "red"
                            ? "text-[#991b1b]"
                            : card.tone === "amber"
                              ? "text-[#854d0e]"
                              : "text-[#999999]"
                        }
                        size={13}
                      />
                      <span className="ml-2">{card.title}</span>
                    </div>
                    {card.content ? <p className="font-sans text-[13px] leading-relaxed text-[#444444]">{card.content}</p> : null}
                    {card.items ? (
                      <div className="mt-2 flex flex-wrap gap-x-2 gap-y-1 font-sans text-[13px] leading-relaxed text-[#444444]">
                        {card.items.map((item) => (
                          <span key={item}>{item}</span>
                        ))}
                      </div>
                    ) : null}
                  </motion.div>
                ))}
              </motion.div>
              <OrchestraButton variant="primary" onClick={() => router.push("/pm/2-clarification")}>
                PROCEED TO CLARIFICATION →
              </OrchestraButton>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </StageShell>
  );
}
