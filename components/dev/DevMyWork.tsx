"use client";

import { StageShell } from "@/components/layout/StageShell";
import { DevTaskDetail } from "@/components/dev/DevTaskDetail";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { devInProgress, devSummary, devTodo } from "@/lib/mockData";

export function DevMyWork() {
  return (
    <StageShell>
      <div className="mx-auto max-w-6xl space-y-6">
        <SectionHeader title="MY WORK" subtitle="Tasks assigned to Mike Torres · Sprint 4" />
        <div className="flex flex-wrap gap-2">
          {devSummary.map((item) => (
            <span key={item} className="border border-border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-[#555555]">
              {item}
            </span>
          ))}
        </div>

        <div className="space-y-4">
          {devInProgress.map((task) => (
            <DevTaskDetail key={task.id} {...task} />
          ))}
        </div>

        <div className="rounded-xl border border-[#e8e8e8] bg-white p-5 shadow-sm">
          <div className="mb-4 font-mono text-[10px] uppercase tracking-widest text-[#999999]">TODO</div>
          <div className="space-y-3">
            {devTodo.map((task) => (
              <div key={task.id} className="rounded-lg border border-[#f5f5f5] bg-[#fafafa] px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="font-sans text-[13px] text-[#333333]">
                    {task.id} — {task.title}
                  </div>
                  <StatusBadge variant={task.status as "revised" | "deferred"} />
                </div>
                <div className="mt-2 font-mono text-[11px] text-[#999999]">{task.note}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </StageShell>
  );
}
