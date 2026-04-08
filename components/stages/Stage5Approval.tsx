"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { StageShell } from "@/components/layout/StageShell";
import { OrchestraButton } from "@/components/shared/OrchestraButton";
import { PrototypeFrame } from "@/components/shared/PrototypeFrame";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { approvalApprovers, scopeSummary } from "@/lib/mockData";

export function Stage5Approval() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [comment, setComment] = useState("");
  const [approved, setApproved] = useState(false);
  const router = useRouter();

  const simulateApproval = () => {
    window.setTimeout(() => {
      setApproved(true);
      toast.success("Scope approved — v1.0 locked · manager + client confirmed");
    }, 600);
  };

  return (
    <StageShell showGrid>
      <div className="grid gap-8 xl:grid-cols-[1.15fr_0.95fr]">
        <PrototypeFrame activeIndex={activeIndex} onChange={setActiveIndex} />
        <div className="space-y-6">
          <SectionHeader title="SCOPE APPROVAL" subtitle="Version 1.0 · Awaiting sign-off from manager + client" />
          <div className="space-y-3">
            {approvalApprovers.map((approver, index) => (
              <div key={approver.name} className="rounded-2xl border border-[#e8e8e8] bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <UserAvatar initials={approver.avatar} role={index === 0 ? "pm" : "client"} />
                    <div>
                      <div className="font-sans text-[13px] text-[#111111]">{approver.name}</div>
                      <div className="font-mono text-[10px] uppercase tracking-widest text-[#999999]">{approver.role}</div>
                    </div>
                  </div>
                  <div className={approved || index === 0 ? "text-[#166534]" : "text-[#854d0e]"}>
                    <div className="font-mono text-[10px] uppercase tracking-widest">
                      {approved || index === 0 ? "APPROVED ✓" : approver.status}
                    </div>
                    <div className="font-mono text-[9px] uppercase tracking-widest text-[#999999]">
                      {approved && index === 1 ? "Today · 11:47" : approver.timestamp}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-[#e8e8e8] bg-white p-5 shadow-sm">
            <div className="mb-4 font-mono text-[10px] uppercase tracking-widest text-[#999999]">SCOPE SUMMARY v1.0</div>
            <div className="mt-4 space-y-3">
              <SummaryGroup title="IN SCOPE" items={scopeSummary.inScope} />
              <SummaryGroup title="OUT OF SCOPE" items={scopeSummary.outOfScope} />
              <SummaryLine title="DELIVERY" value={scopeSummary.delivery} />
              <SummaryLine title="SIGN-OFF" value={approved ? "MANAGER ✓ · Client ✓" : scopeSummary.signoff} />
            </div>
          </div>

          <div className="rounded-2xl border border-[#e8e8e8] bg-white p-5 shadow-sm">
            <div className="font-mono text-[10px] uppercase tracking-widest text-[#999999]">
              ADD REVISION REQUEST OR COMMENT
            </div>
            <textarea
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              className="mt-2 h-20 w-full rounded-xl border border-[#e0e0e0] bg-white px-3 py-2 font-sans text-[13px] text-[#111111] outline-none placeholder:text-[#cccccc]"
            />
            <div className="mt-3 flex gap-2">
              <OrchestraButton variant="ghost" size="sm">
                ADD COMMENT
              </OrchestraButton>
              {!approved ? (
                <button
                  type="button"
                  onClick={simulateApproval}
                  className="rounded-xl border border-[#e0e0e0] bg-white px-5 py-2.5 font-sans text-[13px] text-[#333333] transition-colors hover:border-[#111111] hover:text-[#111111]"
                >
                  Simulate Client Approval
                </button>
              ) : null}
            </div>
          </div>

          <AnimatePresence>
            {approved ? (
              <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-[#bbf7d0] bg-[#f0fdf4] px-5 py-4 shadow-sm"
            >
                <div className="font-sans text-[15px] font-semibold text-[#111111]">SCOPE APPROVED</div>
                <div className="mt-1 font-mono text-[10px] uppercase tracking-widest text-[#999999]">
                  Version 1.0 locked · manager + client sign-off confirmed · 14 Mar 2025 11:47
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>

          <OrchestraButton variant="primary" onClick={() => router.push("/pm/6-execution")} disabled={!approved}>
            GENERATE EXECUTION PLAN →
          </OrchestraButton>
        </div>
      </div>
    </StageShell>
  );
}

function SummaryGroup({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <div className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#999999]">{title}</div>
      <div className="mt-2 space-y-1">
        {items.map((item) => (
          <div key={item} className="font-sans text-[13px] text-[#444444]">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

function SummaryLine({ title, value }: { title: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <div className="font-mono text-[10px] uppercase tracking-widest text-[#999999]">{title}</div>
      <div className="font-sans text-[13px] text-[#111111]">{value}</div>
    </div>
  );
}
