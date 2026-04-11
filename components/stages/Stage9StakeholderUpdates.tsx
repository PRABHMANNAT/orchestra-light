"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";

import { EASE_EXPO, chipBounce, fadeSlideUp, fadeSlideUpFast, pageContainer, staggerContainer } from "@/lib/animations";
import { StageShell } from "@/components/layout/StageShell";
import { OrchestraButton } from "@/components/shared/OrchestraButton";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { stakeholderTabs } from "@/lib/mockData";
import { getStageRoute } from "@/lib/stageConfig";
import { cn } from "@/lib/utils";

const tabs = [
  { key: "pm", label: "MANAGER" },
  { key: "cto", label: "CTO" },
  { key: "exec", label: "EXEC" },
  { key: "client", label: "CLIENT" }
] as const;

const clientBars = [
  { label: "Creator signup", value: 100 },
  { label: "Portfolio upload", value: 78 },
  { label: "Marketplace publish", value: 74 },
  { label: "Revenue dashboard", value: 58 },
  { label: "Discovery feed", value: 61 }
];

const tabToneMap = {
  pm: { panel: "glass-cyan", text: "var(--cyan)" },
  cto: { panel: "glass-violet", text: "var(--violet)" },
  exec: { panel: "glass-blue", text: "var(--blue)" },
  client: { panel: "glass-blue", text: "var(--blue)" }
} as const;

export function Stage9StakeholderUpdates() {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]["key"]>("client");
  const router = useRouter();
  const params = useParams<{ projectId: string }>();
  const projectId = typeof params?.projectId === "string" ? params.projectId : "p1";
  const tabContent = stakeholderTabs[activeTab];
  const activeTone = tabToneMap[activeTab];

  return (
    <StageShell showGrid>
      <motion.div variants={pageContainer} initial="hidden" animate="show" className="mx-auto max-w-7xl space-y-6 px-8 py-8">
        <SectionHeader
          label="Updates"
          title="WHAT DOES EVERYONE NEED TO KNOW?"
          subtitle="One click. The right update to the right person."
          accentColor="var(--cyan)"
        />

        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button key={tab.key} type="button" onClick={() => setActiveTab(tab.key)} className="relative overflow-hidden rounded-md px-4 py-2">
              {activeTab === tab.key ? <motion.div layoutId="tab-indicator" className={cn("absolute inset-0 rounded-md", tabToneMap[tab.key].panel)} /> : null}
              <span
                className={cn("relative z-10 font-ui text-[11px] tracking-[0.08em]", activeTab === tab.key ? "" : "text-[var(--text-secondary)]")}
                style={activeTab === tab.key ? { color: tabToneMap[tab.key].text } : undefined}
              >
                {tab.label}
              </span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: -14 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -14, transition: { duration: 0.15 } }}
            transition={{ duration: 0.28, delay: 0.04, ease: EASE_EXPO }}
            className={cn(activeTone.panel, "glass-noise rounded-xl px-6 py-6")}
          >
            {activeTab === "client" ? (
              <div>
                <div className="font-title text-[28px] tracking-[0.04em] text-[var(--blue)]">UPDATE FOR JACK — TEMPEST AI</div>
                <div className="mb-5 mt-1 font-mono text-[10px] tracking-[0.12em] text-[var(--text-muted)]">08 APR 2026</div>
                <div className="mb-5 h-px bg-[var(--border-subtle)]" />
                <motion.div variants={staggerContainer(0.08, 0.08)} initial="hidden" animate="show" className="space-y-4">
                  {clientBars.map((bar, index) => (
                    <motion.div key={bar.label} variants={fadeSlideUpFast}>
                      <div className="mb-2 flex items-center justify-between">
                        <span className="font-ui text-[12px] text-[var(--text-secondary)]">{bar.label}</span>
                        <span className="font-mono text-[10px] tracking-[0.12em] text-[var(--text-muted)]">{bar.value}%</span>
                      </div>
                      <div className="h-[6px] overflow-hidden rounded-full bg-[rgba(255,255,255,0.05)]">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${bar.value}%` }}
                          transition={{ duration: 1, ease: EASE_EXPO, delay: index * 0.1 + 0.2 }}
                          className="h-full rounded-full bg-[linear-gradient(90deg,#00e5cc,rgba(0,229,204,0.7))]"
                        />
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
                <div className="glass-emerald mt-5 rounded-lg px-4 py-3">
                  <div className="font-ui text-[13px] text-[var(--emerald)]">Overall: Sprint 3 of 6 — 61% delivered</div>
                  <div className="mt-1 font-ui text-[12px] text-[var(--text-secondary)]">On track for 8-week delivery</div>
                </div>
                <div className="mt-4 border-l-2 border-[var(--amber-border)] pl-3 font-mono text-[10px] tracking-[0.12em] text-[var(--amber)]">
                  2 items require your attention — see blockers above
                </div>
              </div>
            ) : (
              <div>
                <div className="font-title text-[28px] tracking-[0.04em] text-[var(--text-primary)]">{tabContent.heading}</div>
                <div className="mb-5 mt-1 font-mono text-[10px] tracking-[0.12em] text-[var(--text-muted)]">{tabContent.subheading}</div>
                <motion.div variants={staggerContainer(0.07, 0.08)} initial="hidden" animate="show" className="grid gap-4 md:grid-cols-3">
                  {tabContent.sections.map((section) => (
                    <motion.div key={section.title} variants={fadeSlideUp} className="glass-sm rounded-xl px-4 py-4">
                      <div className="mb-3 font-mono text-[10px] tracking-[0.12em] text-[var(--text-muted)]">{section.title}</div>
                      <div className="font-ui text-[12px] leading-6 text-[var(--text-secondary)]">{section.content}</div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <motion.div variants={fadeSlideUp} initial="hidden" animate="show">
          <OrchestraButton variant="primary" onClick={() => router.push(getStageRoute(projectId, "10-handover"))}>
            Send Update
          </OrchestraButton>
        </motion.div>
      </motion.div>
    </StageShell>
  );
}
