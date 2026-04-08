"use client";

import { StageShell } from "@/components/layout/StageShell";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { sprintBoard } from "@/lib/mockData";

const columns = [
  { key: "todo", label: "TODO" },
  { key: "inProgress", label: "IN PROGRESS" },
  { key: "inReview", label: "IN REVIEW" },
  { key: "done", label: "DONE" }
] as const;

export function DevBoard() {
  return (
    <StageShell>
      <div className="mx-auto max-w-7xl space-y-6">
        <SectionHeader title="SPRINT BOARD" subtitle="Visual delivery board for Sprint 4" />
        <div className="grid gap-4 xl:grid-cols-4">
          {columns.map((column) => (
            <div key={column.key} className="rounded-xl border border-[#e8e8e8] bg-white p-4 shadow-sm">
              <div className="mb-4 font-mono text-[10px] uppercase tracking-widest text-[#999999]">{column.label}</div>
              <div className="space-y-2">
                {sprintBoard[column.key].map((card) => (
                  <div key={card.id} className="rounded-lg border border-[#f0f0f0] bg-[#fafafa] p-3">
                    <div className="font-sans text-[13px] text-[#333333]">{card.title}</div>
                    <div className="mt-1 font-mono text-[11px] text-[#999999]">
                      FLOWCHART: {card.dag} · {card.id}
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="font-mono text-[11px] text-[#999999]">{card.epic}</span>
                      <StatusBadge variant={card.priority as "p0" | "p1" | "p2"} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </StageShell>
  );
}
