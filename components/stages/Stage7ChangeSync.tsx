"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, RefreshCw, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { StageShell } from "@/components/layout/StageShell";
import { OrchestraButton } from "@/components/shared/OrchestraButton";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { TerminalOutput } from "@/components/shared/TerminalOutput";
import { changeApplyLines, changePanels, changeSyncLines } from "@/lib/mockData";

export function Stage7ChangeSync() {
  const [started, setStarted] = useState(false);
  const [ready, setReady] = useState(false);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setStarted(true);
    }, 500);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <StageShell showGrid>
      <div className="mx-auto max-w-7xl space-y-6">
        <SectionHeader
          title="CHANGE SYNC"
          subtitle="SRS updated mid-project — Orchestra detects, diffs, and proposes plan updates"
        />

        <div className="rounded-2xl border border-[#fef08a] bg-[#fffbea] px-5 py-4 shadow-sm">
          <div className="flex items-start gap-3">
          <AlertTriangle size={18} strokeWidth={1.5} className="mt-0.5 text-[#854d0e]" />
          <div>
            <div className="font-sans text-[15px] font-semibold text-[#111111]">SCOPE CHANGE DETECTED</div>
            <div className="mt-1 font-sans text-[13px] text-[#444444]">
              Client has added a new requirement: managers must approve all requests before assignment can proceed.
            </div>
            <div className="mt-2 font-mono text-[10px] uppercase tracking-widest text-[#854d0e]">
              RECEIVED: ServiceRequest_SRS_v3.pdf · TODAY 14:22
            </div>
          </div>
          </div>
        </div>

        {started && !ready && !applying && !applied ? (
          <TerminalOutput
            label="CHANGE SYNC ENGINE — DIFF ANALYSIS"
            lines={changeSyncLines}
            onComplete={() => setReady(true)}
          />
        ) : null}

        {ready && !applying && !applied ? (
          <>
            <div className="grid gap-4 xl:grid-cols-3">
              <ImpactPanel title="PRODUCT FLOWCHART UPDATES" tone="amber">
                <div className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#999999]">NEW DEPENDENCY PATH</div>
                <div className="my-3 flex items-center gap-1">
                  <div className="mr-2 font-mono text-[9px] uppercase tracking-[0.12em] text-[#999999]">BEFORE</div>
                  {["N7 Assign", "N9 Status"].map((item, index, arr) => (
                    <div key={item} className="flex items-center gap-1">
                      <div className="rounded-full border border-[#e0e0e0] px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.08em] text-[#333333]">
                        {item}
                      </div>
                      {index < arr.length - 1 ? <span className="font-mono text-[10px] text-[#999999]">→</span> : null}
                    </div>
                  ))}
                </div>
                <div className="my-2 flex items-center gap-1">
                  <div className="mr-2 font-mono text-[9px] uppercase tracking-[0.12em] text-[#999999]">AFTER</div>
                  {["N7 Assign", "N12 Approval", "N9 Status"].map((item, index, arr) => (
                    <div key={item} className="flex items-center gap-1">
                      <div
                        className={
                          item === "N12 Approval"
                            ? "rounded-full border border-[#fef08a] bg-[#fff7cc] px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.08em] text-[#854d0e]"
                            : "rounded-full border border-[#e0e0e0] px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.08em] text-[#333333]"
                        }
                      >
                        {item}
                      </div>
                      {index < arr.length - 1 ? (
                        <span className={`font-mono text-[10px] ${item === "N7 Assign" ? "text-[#854d0e]" : "text-[#999999]"}`}>
                          →
                        </span>
                      ) : null}
                    </div>
                  ))}
                </div>
                <div className="mt-4 space-y-3">
                  {changePanels.dag.map((item) => (
                    <div key={item} className="font-sans text-[13px] text-[#444444]">
                      {item}
                    </div>
                  ))}
                </div>
              </ImpactPanel>

              <ImpactPanel title="TASK CHANGES" tone="amber">
                <div className="space-y-3">
                  {changePanels.tasks.map((item, index) => (
                    <div key={item} className="border-b border-[#f5f5f5] pb-3 last:border-b-0">
                      <div className="font-sans text-[13px] text-[#111111]">{item}</div>
                      <div className="mt-2">
                        <StatusBadge variant={index >= 3 ? "new" : "revised"} />
                      </div>
                    </div>
                  ))}
                </div>
              </ImpactPanel>

              <ImpactPanel title="DELIVERY IMPACT" tone="red">
                <div className="font-mono text-[10px] uppercase tracking-widest text-[#991b1b]">TIMELINE RISK DETECTED</div>
                <div className="mt-4 space-y-3">
                  {changePanels.delivery.map((item) => (
                    <div key={item} className="font-sans text-[13px] text-[#444444]">
                      {item}
                    </div>
                  ))}
                </div>
              </ImpactPanel>
            </div>

            <div className="flex flex-wrap gap-3">
              <OrchestraButton
                variant="primary"
                icon={RefreshCw}
                onClick={() => {
                  setApplying(true);
                  setReady(false);
                }}
              >
                APPLY ALL CHANGES TO PLAN + FLOWCHART
              </OrchestraButton>
              <OrchestraButton variant="ghost">REVIEW CHANGES MANUALLY</OrchestraButton>
              <OrchestraButton variant="ghost" icon={X}>
                REJECT — KEEP ORIGINAL SCOPE
              </OrchestraButton>
            </div>
          </>
        ) : null}

        {applying && !applied ? (
          <TerminalOutput
            label="CHANGE SYNC ENGINE — APPLYING"
            lines={changeApplyLines}
            onComplete={() => {
              setApplied(true);
              setApplying(false);
              toast("Change sync complete — plan aligned with SRS v3");
            }}
          />
        ) : null}

        {applied ? (
          <div className="space-y-5">
            <div className="rounded-2xl border border-[#bbf7d0] bg-[#f0fdf4] p-5 shadow-sm">
              <div className="font-sans text-[15px] font-semibold text-[#111111]">PLAN ALIGNED WITH SRS v3</div>
              <div className="mt-2 flex gap-2">
                <StatusBadge variant="new" />
                <StatusBadge variant="revised" />
              </div>
            </div>
            <OrchestraButton variant="primary" onClick={() => router.push("/pm/8-tower")}>
              VIEW CONTROL TOWER →
            </OrchestraButton>
          </div>
        ) : null}
      </div>
    </StageShell>
  );
}

function ImpactPanel({
  title,
  tone,
  children
}: {
  title: string;
  tone: "amber" | "red";
  children: React.ReactNode;
}) {
  return (
    <div
      className={`min-h-[380px] rounded-2xl border bg-white p-5 shadow-sm ${
        tone === "amber" ? "border-[#fef08a]" : "border-[#fecaca]"
      }`}
    >
      <div className="mb-4 font-mono text-[10px] uppercase tracking-widest text-[#999999]">{title}</div>
      <div className="mt-3">{children}</div>
    </div>
  );
}
