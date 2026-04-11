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
          <label className="mb-1 block font-mono text-[10px] tracking-[0.12em] text-text-muted">{label}</label>
          <input className="tactical-input w-full rounded-lg px-3 py-2.5 font-ui text-[13px] text-white outline-none" />
        </div>
      ))}
      <div>
        <label className="mb-1 block font-mono text-[10px] tracking-[0.12em] text-text-muted">ROLE</label>
        <div className="grid grid-cols-3 gap-2">
          {(["pm", "developer", "client"] as const).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setRole(item)}
              className={cn(
                "rounded-md border px-3 py-2 font-mono text-[10px] tracking-[0.12em]",
                role === item
                  ? "glass-cyan text-[var(--accent-cyan)]"
                  : "glass-sm text-[var(--text-secondary)]"
              )}
            >
              {item === "pm" ? "Manager" : item === "developer" ? "Developer" : "Client"}
            </button>
          ))}
        </div>
      </div>
      {["PASSWORD", "CONFIRM PASSWORD"].map((label) => (
        <div key={label}>
          <label className="mb-1 block font-mono text-[10px] tracking-[0.12em] text-text-muted">{label}</label>
          <input type="password" className="tactical-input w-full rounded-lg px-3 py-2.5 font-ui text-[13px] text-white outline-none" />
        </div>
      ))}
      <OrchestraButton fullWidth variant="primary">
        CREATE ACCOUNT
      </OrchestraButton>
      <p className="text-center font-mono text-[10px] text-text-muted">This is a demo — no real accounts are created</p>
    </div>
  );
}
