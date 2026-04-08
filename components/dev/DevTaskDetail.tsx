"use client";

import { AlertTriangle, Flag } from "lucide-react";

import { OrchestraButton } from "@/components/shared/OrchestraButton";
import { ProgressBar } from "@/components/shared/ProgressBar";
import { StatusBadge } from "@/components/shared/StatusBadge";

export interface DevTaskDetailProps {
  id: string;
  title: string;
  epic: string;
  meta: string;
  status: string;
  priority: string;
  progress: number;
  acceptance: string;
  footer: string;
}

export function DevTaskDetail(props: DevTaskDetailProps) {
  return (
    <div className="rounded-xl border border-[#e8e8e8] bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="font-sans text-[13px] text-[#333333]">
            {props.id} — {props.title}
          </div>
          <div className="mt-1 font-sans text-[13px] text-[#444444]">{props.epic}</div>
          <div className="mt-1 font-mono text-[10px] uppercase tracking-widest text-[#999999]">{props.meta}</div>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge variant={props.status as "in-progress" | "blocked"} />
          <StatusBadge variant={props.priority as "p0" | "p1" | "p2"} />
        </div>
      </div>

      <div className="mt-4">
        <ProgressBar label="Progress" value={props.progress} variant={props.status === "blocked" ? "amber" : "cyan"} />
      </div>

      {props.status === "blocked" ? (
        <div className="mt-4 rounded-lg border border-[#fecaca] bg-[#fef2f2] p-3">
          <div className="flex items-center gap-2 font-sans text-[13px] text-[#111111]">
            <AlertTriangle size={12} strokeWidth={1.5} className="text-[#991b1b]" />
            {props.acceptance}
          </div>
          <div className="mt-2 font-mono text-[10px] uppercase tracking-widest text-[#999999]">{props.footer}</div>
          <div className="mt-3">
            <OrchestraButton variant="ghost" size="sm" icon={Flag}>
              ESCALATE BLOCKER
            </OrchestraButton>
          </div>
        </div>
      ) : (
        <>
          <div className="mt-4 font-sans text-[13px] text-[#444444]">{props.acceptance}</div>
          <div className="mt-3 font-mono text-[10px] uppercase tracking-widest text-[#999999]">{props.footer}</div>
          <div className="mt-3">
            <OrchestraButton variant="ghost" size="sm">
              UPDATE STATUS
            </OrchestraButton>
          </div>
        </>
      )}
    </div>
  );
}
