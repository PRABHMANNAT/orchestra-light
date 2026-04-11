"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { ClientApprovalPanel } from "@/components/client/ClientApprovalPanel";
import { ClientHandover } from "@/components/client/ClientHandover";
import { ClientProtocolView } from "@/components/client/ClientProtocolView";
import { ClientUpdates } from "@/components/client/ClientUpdates";
import { StageShell } from "@/components/layout/StageShell";
import { EASE_EXPO, fadeSlideUp, pageContainer } from "@/lib/animations";
import { clientTabs } from "@/lib/stageConfig";
import { cn } from "@/lib/utils";

type ClientTabKey = (typeof clientTabs)[number]["key"];

export default function ClientPage() {
  const [tab, setTab] = useState<ClientTabKey>("prototype");

  return (
    <StageShell showGrid>
      <motion.div variants={pageContainer} initial="hidden" animate="show" className="mx-auto max-w-7xl space-y-6 px-8 py-8">
        <div className="flex flex-wrap gap-2">
          {clientTabs.map((item) => (
            <button key={item.key} type="button" onClick={() => setTab(item.key)} className="relative overflow-hidden rounded-md px-4 py-2">
              {tab === item.key ? <motion.div layoutId="client-tab-indicator" className="glass-cyan absolute inset-0 rounded-md" /> : null}
              <span className={cn("relative z-10 font-ui text-[11px] tracking-[0.08em]", tab === item.key ? "text-[var(--accent-cyan)]" : "text-[var(--text-secondary)]")}>
                {item.label}
              </span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            variants={fadeSlideUp}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0, y: -8, transition: { duration: 0.2, ease: EASE_EXPO } }}
          >
            {tab === "prototype" ? <ClientProtocolView /> : null}
            {tab === "approvals" ? <ClientApprovalPanel /> : null}
            {tab === "updates" ? <ClientUpdates /> : null}
            {tab === "handover" ? <ClientHandover /> : null}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </StageShell>
  );
}
