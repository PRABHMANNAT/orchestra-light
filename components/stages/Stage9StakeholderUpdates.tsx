"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

import { StageShell } from "@/components/layout/StageShell";
import { OrchestraButton } from "@/components/shared/OrchestraButton";
import { ProgressBar } from "@/components/shared/ProgressBar";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { stakeholderTabs } from "@/lib/mockData";
import { cn } from "@/lib/utils";

type StakeholderTab = keyof typeof stakeholderTabs;

const ctoRiskRows = [
  { node: "N7 Assignment Engine", status: "BLOCKED", blocker: "Client permissions sign-off" },
  { node: "N8 Staff Role Rule", status: "BLOCKED", blocker: "RBAC architecture review" },
  { node: "N12 Manager Approval", status: "AT RISK", blocker: "Scope not fully defined" }
];

const velocityRows = [
  { epic: "Auth & Access", done: 5, total: 6 },
  { epic: "Request Lifecycle", done: 4, total: 10 },
  { epic: "Reporting", done: 3, total: 8 }
];

export function Stage9StakeholderUpdates() {
  const [tab, setTab] = useState<StakeholderTab>("pm");
  const router = useRouter();
  const active = stakeholderTabs[tab];

  return (
    <StageShell showGrid>
      <div className="mx-auto max-w-6xl space-y-6">
        <SectionHeader title="STAKEHOLDER UPDATES" subtitle="Automated plain-English updates generated from live project state" />
        <div className="flex flex-wrap gap-5 border-b border-[#f0f0f0] pb-3">
          {[
            ["pm", "MANAGER REPORT"],
            ["cto", "CTO BRIEF"],
            ["exec", "EXEC SUMMARY"],
            ["client", "CLIENT UPDATE"]
          ].map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setTab(value as StakeholderTab)}
              className={cn(
                "border-b-2 pb-2 font-mono text-[11px] uppercase tracking-[0.1em]",
                tab === value ? "border-[#111111] text-[#111111]" : "border-transparent text-[#999999]"
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === "pm" ? (
          <ReportCard heading={active.heading} subheading={active.subheading} exportButton>
            {active.sections.map((section) => (
              <SectionBlock key={section.title} title={section.title} content={section.content} />
            ))}
          </ReportCard>
        ) : null}

        {tab === "cto" ? (
          <div className="rounded-2xl border border-[#e8e8e8] bg-white p-6 shadow-sm">
            <div className="mb-5 flex justify-between">
              <div>
                <div className="font-sans text-[15px] font-semibold text-[#111111]">CTO TECHNICAL BRIEF</div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-[#999999]">
                  SERVICE REQUEST PLATFORM · WEEK 4
                </div>
              </div>
              <OrchestraButton variant="ghost" icon={Download} size="sm">
                EXPORT
              </OrchestraButton>
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
              <div>
                <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-[#999999]">DEPENDENCY RISK</div>
                {ctoRiskRows.map((row) => (
                  <div key={row.node} className="flex items-start justify-between gap-3 border-b border-[#f5f5f5] py-3">
                    <div>
                      <div className="font-sans text-[13px] text-[#333333]">{row.node}</div>
                      <div className="mt-0.5 font-mono text-[11px] text-[#999999]">{row.blocker}</div>
                    </div>
                    <StatusBadge variant={row.status === "BLOCKED" ? "blocked" : "in-progress"} />
                  </div>
                ))}
              </div>
              <div>
                <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-[#999999]">BUILD VELOCITY</div>
                {velocityRows.map((row) => (
                  <div key={row.epic} className="mb-4">
                    <div className="mb-1 flex justify-between">
                      <span className="font-mono text-[10px] uppercase tracking-widest text-[#999999]">{row.epic}</span>
                      <span className="font-mono text-[10px] uppercase tracking-widest text-[#111111]">
                        {row.done}/{row.total}
                      </span>
                    </div>
                    <div className="h-1 overflow-hidden rounded-full bg-[#eeeeee]">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(row.done / row.total) * 100}%` }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        className="h-full rounded-full bg-[#111111]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}

        {tab === "exec" ? (
          <div className="rounded-2xl border border-[#e8e8e8] bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <div className="font-sans text-[15px] font-semibold text-[#111111]">{active.heading}</div>
                <div className="mt-1 font-mono text-[10px] uppercase tracking-widest text-[#999999]">{active.subheading}</div>
              </div>
              <div className="rounded-xl border border-[#e0e0e0] px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-[#999999]">
                DELIVERY HEALTH 74/100
              </div>
            </div>
            <div className="grid gap-4 xl:grid-cols-3">
              <div className="rounded-2xl border border-[#e8e8e8] bg-white p-4 shadow-sm">
                <div className="mb-4 font-mono text-[10px] uppercase tracking-widest text-[#999999]">STATUS</div>
                <div className="font-sans text-[13px] leading-relaxed text-[#444444]">{active.sections[0]?.content}</div>
              </div>
              <div className="rounded-2xl border border-[#e8e8e8] bg-white p-4 shadow-sm">
                <div className="mb-4 font-mono text-[10px] uppercase tracking-widest text-[#999999]">RISK</div>
                <div className="font-sans text-[13px] leading-relaxed text-[#444444]">{active.sections[1]?.content}</div>
              </div>
              <div className="rounded-2xl border border-[#e8e8e8] bg-white p-4 shadow-sm">
                <div className="mb-4 font-mono text-[10px] uppercase tracking-widest text-[#999999]">KEY SIGNALS</div>
                <div className="mt-3 space-y-2">
                  {["Core auth on track", "Reporting stabilising", "Permissions decision still open"].map((item) => (
                    <div key={item} className="font-sans text-[13px] text-[#444444]">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {tab === "client" ? (
          <ReportCard heading={active.heading} subheading={active.subheading}>
            <div className="mb-6">
              <ProgressBar label="Progress Overview" value={62} variant="cyan" />
            </div>
            {active.sections.map((section) => (
              <SectionBlock key={section.title} title={section.title} content={section.content} />
            ))}
          </ReportCard>
        ) : null}

        <div className="flex flex-wrap gap-3">
          <OrchestraButton variant="primary" onClick={() => router.push("/client")}>
            VIEW CLIENT PORTAL →
          </OrchestraButton>
          <OrchestraButton variant="ghost" onClick={() => router.push("/pm/10-handover")}>
            OPEN HANDOVER HUB →
          </OrchestraButton>
        </div>
      </div>
    </StageShell>
  );
}

function ReportCard({
  heading,
  subheading,
  children,
  exportButton = false
}: {
  heading: string;
  subheading: string;
  children: React.ReactNode;
  exportButton?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-[#e8e8e8] bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="font-sans text-[15px] font-semibold text-[#111111]">{heading}</div>
          <div className="mt-1 font-mono text-[10px] uppercase tracking-widest text-[#999999]">{subheading}</div>
        </div>
        {exportButton ? (
          <OrchestraButton variant="ghost" icon={Download} size="sm">
            EXPORT PDF
          </OrchestraButton>
        ) : null}
      </div>
      <div className="mt-6 space-y-6">{children}</div>
    </div>
  );
}

function SectionBlock({ title, content }: { title: string; content: string }) {
  return (
    <div>
      <div className="mb-4 font-mono text-[10px] uppercase tracking-widest text-[#999999]">{title}</div>
      <div className="font-sans text-[13px] leading-relaxed text-[#444444]">{content}</div>
    </div>
  );
}
