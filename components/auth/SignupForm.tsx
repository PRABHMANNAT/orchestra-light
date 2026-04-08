"use client";

import { useState } from "react";

import { OrchestraButton } from "@/components/shared/OrchestraButton";
import { type UserRole } from "@/lib/roles";
import { cn } from "@/lib/utils";

export function SignupForm() {
  const [role, setRole] = useState<UserRole>("pm");

  return (
    <div className="space-y-5">
      {["FULL NAME", "EMAIL ADDRESS"].map((label) => (
        <div key={label}>
          <label className="mb-1 block font-mono text-[10px] uppercase tracking-[0.12em] text-[#999999]">
            {label}
          </label>
          <input className="w-full rounded-lg border border-[#e0e0e0] bg-white px-3 py-2.5 font-sans text-[13px] text-[#111111] outline-none" />
        </div>
      ))}
      <div>
        <label className="mb-1 block font-mono text-[10px] uppercase tracking-[0.12em] text-[#999999]">
          ROLE
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(["pm", "developer", "client"] as const).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setRole(item)}
              className={cn(
                "rounded-lg border px-3 py-2 font-mono text-[10px] uppercase tracking-[0.12em]",
                role === item
                  ? "border-[#111111] bg-[#111111] text-white"
                  : "border-[#cccccc] bg-white text-[#333333]"
              )}
            >
              {item === "pm" ? "Manager" : item === "developer" ? "Developer" : "Client"}
            </button>
          ))}
        </div>
      </div>
      {["PASSWORD", "CONFIRM PASSWORD"].map((label) => (
        <div key={label}>
          <label className="mb-1 block font-mono text-[10px] uppercase tracking-[0.12em] text-[#999999]">
            {label}
          </label>
          <input type="password" className="w-full rounded-lg border border-[#e0e0e0] bg-white px-3 py-2.5 font-sans text-[13px] text-[#111111] outline-none" />
        </div>
      ))}
      <OrchestraButton fullWidth variant="primary">
        CREATE ACCOUNT
      </OrchestraButton>
      <p className="text-center font-mono text-[10px] text-[#999999]">This is a demo — no real accounts are created</p>
    </div>
  );
}
