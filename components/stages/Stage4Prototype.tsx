"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { StageShell } from "@/components/layout/StageShell";
import { OrchestraButton } from "@/components/shared/OrchestraButton";
import { PrototypeFrame } from "@/components/shared/PrototypeFrame";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { prototypeNodeChips, prototypeScope } from "@/lib/mockData";

export function Stage4Prototype() {
  const [activeIndex, setActiveIndex] = useState(0);
  const router = useRouter();

  useEffect(() => {
    toast("Prototype generated from 9-node product flowchart slice");
  }, []);

  return (
    <StageShell showGrid>
      <div className="grid items-start gap-10 xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="flex justify-center">
          <PrototypeFrame activeIndex={activeIndex} onChange={setActiveIndex} variant="studio" className="w-full max-w-[760px]" />
        </div>

        <div className="space-y-6">
          <SectionHeader
            title="PROTOTYPE STUDIO"
            subtitle="Generated from the approved product flowchart slice · 9 nodes selected · MVP-first"
          />
          <div className="rounded-2xl border border-[#e8e8e8] bg-white p-5 shadow-sm">
            <div className="mb-4 font-mono text-[10px] uppercase tracking-widest text-[#999999]">
              GENERATED FROM PRODUCT FLOWCHART SLICE
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {prototypeNodeChips.map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-[#ebebeb] bg-[#f5f5f5] px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-[#666666]"
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>

          <ScopeCard title="INCLUDED IN V1" tone="green" items={prototypeScope.included} />
          <ScopeCard title="MOCKED IN PROTOTYPE" tone="amber" items={prototypeScope.mocked} />
          <ScopeCard title="DEFERRED TO V2" tone="muted" items={prototypeScope.deferred} />

          <OrchestraButton variant="primary" onClick={() => router.push("/pm/5-approval")}>
            SEND FOR CLIENT APPROVAL →
          </OrchestraButton>
        </div>
      </div>
    </StageShell>
  );
}

function ScopeCard({
  title,
  tone,
  items
}: {
  title: string;
  tone: "green" | "amber" | "muted";
  items: string[];
}) {
  return (
    <div className="rounded-2xl border border-[#e8e8e8] bg-white p-5 shadow-sm">
      <div
        className={`mb-4 font-mono text-[10px] uppercase tracking-widest ${
          tone === "green" ? "text-[#166534]" : tone === "amber" ? "text-[#854d0e]" : "text-[#999999]"
        }`}
      >
        {title}
      </div>
      <div className="mt-3 space-y-2">
        {items.map((item) => (
          <div key={item} className="font-sans text-[13px] text-[#444444]">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
