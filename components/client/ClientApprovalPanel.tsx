"use client";

import { useState } from "react";
import { CheckCircle, MessageSquare } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { OrchestraButton } from "@/components/shared/OrchestraButton";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { scopeSummary } from "@/lib/mockData";

export function ClientApprovalPanel() {
  const [approved, setApproved] = useState(false);

  return (
    <div className="space-y-6">
      <SectionHeader title="APPROVALS" subtitle="Review the agreed MVP scope and confirm whether development should continue" />
      <div className="rounded-xl border border-[#e8e8e8] bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <UserAvatar initials="JW" role="client" />
          <div>
            <div className="font-sans text-[13px] text-[#111111]">James Whitfield</div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-[#999999]">
              Director of Operations · ACME Corp
            </div>
          </div>
        </div>
      </div>
      <div className="rounded-xl border border-[#e8e8e8] bg-white p-5 shadow-sm">
        <div className="mb-4 font-mono text-[10px] uppercase tracking-widest text-[#999999]">WHAT WE&apos;RE BUILDING IN THIS PHASE</div>
        <div className="mt-3 space-y-2">
          {scopeSummary.inScope.map((item) => (
            <div key={item} className="font-sans text-[13px] text-[#444444]">
              ✓ {item}
            </div>
          ))}
        </div>
        <div className="mb-4 mt-5 font-mono text-[10px] uppercase tracking-widest text-[#999999]">WHAT WE&apos;RE NOT BUILDING YET</div>
        <div className="mt-3 space-y-2">
          {scopeSummary.outOfScope.slice(0, 3).map((item) => (
            <div key={item} className="font-sans text-[13px] text-[#444444]">
              → {item}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative">
          <OrchestraButton variant="primary" icon={CheckCircle} onClick={() => setApproved(true)}>
            APPROVE THIS SCOPE
          </OrchestraButton>
          <AnimatePresence>
            {approved ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pointer-events-none absolute inset-0">
                {Array.from({ length: 10 }).map((_, index) => (
                  <motion.span
                    key={index}
                    initial={{ x: 0, y: 0, opacity: 1 }}
                    animate={{
                      x: (index - 5) * 8,
                      y: -30 - (index % 3) * 8,
                      opacity: 0
                    }}
                    transition={{ duration: 0.7 }}
                    className="absolute left-1/2 top-1/2 h-1.5 w-1.5 bg-[#111111]"
                    style={{ borderRadius: 999 }}
                  />
                ))}
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
        <OrchestraButton variant="ghost" icon={MessageSquare}>
          REQUEST REVISIONS
        </OrchestraButton>
      </div>

      {approved ? (
        <div className="rounded-xl border border-[#bbf7d0] bg-[#f0fdf4] p-5 font-mono text-[10px] uppercase tracking-widest text-[#166534] shadow-sm">
          Scope approved — your sign-off has been recorded.
        </div>
      ) : null}
    </div>
  );
}
