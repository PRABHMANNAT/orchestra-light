"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";

import { fadeSlideUp, fadeSlideUpFast, pageContainer, staggerContainer } from "@/lib/animations";
import { StageShell } from "@/components/layout/StageShell";
import { OrchestraButton } from "@/components/shared/OrchestraButton";
import { PrototypeFrame } from "@/components/shared/PrototypeFrame";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { prototypeScope } from "@/lib/mockData";
import { getStageRoute } from "@/lib/stageConfig";

const scopeSections: Array<{ label: string; items: string[] }> = [
  { label: "INCLUDED", items: prototypeScope.included },
  { label: "MOCKED", items: prototypeScope.mocked },
  { label: "DEFERRED", items: prototypeScope.deferred }
];

export function Stage4Prototype() {
  const [activeIndex, setActiveIndex] = useState(0);
  const router = useRouter();
  const params = useParams<{ projectId: string }>();
  const projectId = typeof params?.projectId === "string" ? params.projectId : "p1";

  return (
    <StageShell showGrid>
      <motion.div variants={pageContainer} initial="hidden" animate="show" className="mx-auto max-w-7xl space-y-6 px-8 py-8">
        <SectionHeader
          label="Step 4"
          title="DOES THIS LOOK RIGHT?"
          subtitle="Real screens. Before a single line of code."
          accentColor="var(--blue)"
        />

        <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
          <motion.div variants={fadeSlideUp} initial="hidden" animate="show" className="glass-heavy glass-noise overflow-hidden rounded-xl p-5">
            <PrototypeFrame activeIndex={activeIndex} onChange={setActiveIndex} variant="studio" />
          </motion.div>

          <motion.div variants={fadeSlideUp} initial="hidden" animate="show" className="glass rounded-xl px-5 py-5">
            <div className="mb-4 font-mono text-[10px] tracking-[0.15em] text-[var(--text-muted)]">SCOPE BREAKDOWN</div>

            {scopeSections.map(({ label, items }) => (
              <div key={label} className="mb-5">
                <div
                  className="mb-3 font-mono text-[10px] tracking-[0.12em]"
                  style={{
                    color:
                      label === "INCLUDED"
                        ? "var(--emerald)"
                        : label === "MOCKED"
                          ? "var(--amber)"
                          : "var(--text-muted)"
                  }}
                >
                  {label}
                </div>
                <motion.div variants={staggerContainer(0.05, 0.02)} initial="hidden" animate="show" className="space-y-2">
                  {(items as string[]).map((item) => (
                    <motion.div key={item} variants={fadeSlideUpFast} className="flex items-start gap-2">
                      <span
                        className="mt-2 h-1.5 w-1.5 rounded-full"
                        style={{
                          background:
                            label === "INCLUDED"
                              ? "var(--emerald)"
                              : label === "MOCKED"
                                ? "var(--amber)"
                                : "rgba(255,255,255,0.2)"
                        }}
                      />
                      <span className="font-ui text-[12px] leading-6 text-[var(--text-secondary)]">{item}</span>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            ))}

            <OrchestraButton variant="primary" onClick={() => router.push(getStageRoute(projectId, "5-approval"))}>
              Send to Jack
            </OrchestraButton>
          </motion.div>
        </div>
      </motion.div>
    </StageShell>
  );
}
