"use client";

import { useState } from "react";

import { PrototypeFrame } from "@/components/shared/PrototypeFrame";
import { OrchestraButton } from "@/components/shared/OrchestraButton";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { clientComments } from "@/lib/mockData";

export function ClientProtocolView() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [comment, setComment] = useState("");

  return (
    <div className="space-y-6">
      <SectionHeader
        title="PROTOTYPE REVIEW"
        subtitle="Service Request Platform — MVP Prototype v1.0 — For your review and approval"
      />
      <div className="rounded-xl border border-[#e8e8e8] bg-white p-5 font-sans text-[13px] leading-relaxed text-[#444444] shadow-sm">
        We&apos;ve built an interactive prototype of your Service Request Platform. This shows the core workflow
        we&apos;ve agreed to build first. Please review the 5 screens and let us know if anything needs to change
        before we begin full development.
      </div>
      <PrototypeFrame activeIndex={activeIndex} onChange={setActiveIndex} />
      <div className="rounded-xl border border-[#e8e8e8] bg-white p-5 shadow-sm">
        <div className="font-mono text-[10px] uppercase tracking-widest text-[#999999]">
          For Screen {activeIndex + 1}
        </div>
        <input
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          placeholder="Add a comment or revision request for this screen..."
          className="mt-2 w-full rounded-lg border border-[#e0e0e0] bg-white px-3 py-2 font-sans text-[13px] text-[#111111] outline-none placeholder:text-[#cccccc]"
        />
        <div className="mt-3">
          <OrchestraButton variant="ghost" size="sm">
            ADD COMMENT
          </OrchestraButton>
        </div>
      </div>
      <div className="space-y-3">
        {clientComments.map((item) => (
          <div key={item.screen} className="rounded-xl border border-[#e8e8e8] bg-white p-4 shadow-sm">
            <div className="font-mono text-[10px] uppercase tracking-widest text-[#999999]">{item.screen}</div>
            <div className="mt-2 font-sans text-[13px] leading-relaxed text-[#111111]">{item.body}</div>
            <div className="mt-2 font-mono text-[10px] uppercase tracking-widest text-[#999999]">
              {item.author} · {item.timestamp}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
