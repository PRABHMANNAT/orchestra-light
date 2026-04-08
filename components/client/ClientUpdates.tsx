"use client";

import { useState } from "react";

import { ProgressBar } from "@/components/shared/ProgressBar";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { stakeholderTabs, weekUpdates } from "@/lib/mockData";

export function ClientUpdates() {
  const [openWeek, setOpenWeek] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <SectionHeader title="PROGRESS UPDATES" subtitle="Plain-English delivery updates generated from live project state" />
      <div className="rounded-xl border border-[#e8e8e8] bg-white p-6 shadow-sm">
        <div className="font-sans text-[15px] font-semibold text-[#111111]">{stakeholderTabs.client.heading}</div>
        <div className="mt-1 font-mono text-[10px] uppercase tracking-widest text-[#999999]">
          {stakeholderTabs.client.subheading}
        </div>
        <div className="mt-6">
          <ProgressBar label="Progress Overview" value={62} variant="cyan" />
        </div>
        <div className="mt-6 space-y-5">
          {stakeholderTabs.client.sections.map((section) => (
            <div key={section.title}>
              <div className="mb-4 font-mono text-[10px] uppercase tracking-widest text-[#999999]">{section.title}</div>
              <div className="font-sans text-[13px] leading-relaxed text-[#444444]">{section.content}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-3">
        {weekUpdates.map((update) => (
          <div key={update.label} className="rounded-xl border border-[#e8e8e8] bg-white shadow-sm">
            <button
              type="button"
              onClick={() => setOpenWeek((current) => (current === update.label ? null : update.label))}
              className="flex w-full items-center justify-between px-4 py-3"
            >
              <span className="font-sans text-[13px] text-[#333333]">{update.label} update</span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#999999]">
                {openWeek === update.label ? "Hide" : "Show"}
              </span>
            </button>
            {openWeek === update.label ? (
              <div className="border-t border-[#f5f5f5] px-4 py-3 font-sans text-[13px] text-[#444444]">
                {update.summary}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
