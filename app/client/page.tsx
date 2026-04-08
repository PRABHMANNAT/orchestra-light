"use client";

import { useState } from "react";

import { ClientApprovalPanel } from "@/components/client/ClientApprovalPanel";
import { ClientHandover } from "@/components/client/ClientHandover";
import { ClientProtocolView } from "@/components/client/ClientProtocolView";
import { ClientUpdates } from "@/components/client/ClientUpdates";
import { StageShell } from "@/components/layout/StageShell";
import { clientTabs } from "@/lib/stageConfig";
import { cn } from "@/lib/utils";

type ClientTabKey = (typeof clientTabs)[number]["key"];

export default function ClientPage() {
  const [tab, setTab] = useState<ClientTabKey>("prototype");

  return (
    <StageShell>
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-wrap gap-5 border-b border-border pb-3">
          {clientTabs.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setTab(item.key)}
              className={cn(
                "border-b-2 pb-2 font-mono text-[11px] uppercase tracking-[0.1em]",
                tab === item.key ? "border-[#111111] text-[#111111]" : "border-transparent text-[#999999]"
              )}
            >
              {item.label}
            </button>
          ))}
        </div>

        {tab === "prototype" ? <ClientProtocolView /> : null}
        {tab === "approvals" ? <ClientApprovalPanel /> : null}
        {tab === "updates" ? <ClientUpdates /> : null}
        {tab === "handover" ? <ClientHandover /> : null}
      </div>
    </StageShell>
  );
}
