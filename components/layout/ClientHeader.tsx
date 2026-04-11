"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { projectMeta } from "@/lib/mockData";
import { type MockUser } from "@/lib/roles";

export function ClientHeader({ user }: { user: MockUser }) {
  const router = useRouter();

  return (
    <header className="glass relative z-20 flex h-16 items-center justify-between border-b border-[var(--border-subtle)] px-8">
      <div className="flex items-center gap-3">
        <span className="font-title text-[22px] tracking-[0.12em] text-[var(--text-primary)]">ORCHESTRA</span>
        <span className="font-mono text-[10px] tracking-[0.14em] text-[var(--text-muted)]">CLIENT PORTAL</span>
      </div>

      <div className="font-ui text-[13px] text-[var(--text-secondary)]">
        {projectMeta.project} · {projectMeta.client}
      </div>

      <div className="flex items-center gap-3">
        <UserAvatar initials={user.avatar} role={user.role} />
        <div className="text-right">
          <div className="font-ui text-[12px] text-[var(--text-primary)]">{user.name}</div>
          <div className="font-mono text-[9px] tracking-[0.12em] text-[var(--text-muted)]">{user.title}</div>
        </div>
        <ThemeToggle />
        <button
          type="button"
          onClick={() => {
            window.localStorage.removeItem("orchestra_user");
            router.replace("/login");
          }}
          className="rounded-sm border border-[rgba(255,255,255,0.06)] p-2 text-[var(--text-muted)] transition-all hover:border-[rgba(239,68,68,0.25)] hover:text-[rgba(239,68,68,0.6)]"
        >
          <LogOut size={14} />
        </button>
      </div>
    </header>
  );
}
