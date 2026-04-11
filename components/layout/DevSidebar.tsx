"use client";

import Link from "next/link";
import { LogOut } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { projectMeta } from "@/lib/mockData";
import { type MockUser } from "@/lib/roles";
import { devNavItems } from "@/lib/stageConfig";
import { cn } from "@/lib/utils";

export function DevSidebar({ user }: { user: MockUser }) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside className="glass-sidebar flex h-full w-[240px] shrink-0 flex-col">
      <div className="px-4 pb-4 pt-5">
        <div className="font-title text-[22px] tracking-[0.12em] text-[var(--text-primary)]">ORCHESTRA</div>
        <div className="font-mono text-[10px] tracking-[0.12em] text-[var(--text-muted)]">{projectMeta.version}</div>
        <div className="glass-sm mt-4 flex items-center gap-3 rounded-lg px-3 py-3">
          <UserAvatar initials={user.avatar} role={user.role} />
          <div>
            <div className="font-ui text-[12px] text-[var(--text-primary)]">{user.name}</div>
            <div className="font-mono text-[9px] tracking-[0.12em] text-[var(--text-muted)]">{user.title}</div>
          </div>
        </div>
      </div>
      <div className="flex-1 px-2">
        {devNavItems.map((item) => (
          <Link
            key={`${item.href}-${item.label}`}
            href={item.href}
            prefetch={false}
            className={cn(
              "mb-1 flex min-h-[42px] items-center rounded-md px-3 font-ui text-[13px] transition-colors",
              pathname === item.href
                ? "glass-cyan text-[var(--accent-cyan)]"
                : "text-[var(--text-muted)] hover:bg-[rgba(255,255,255,0.04)] hover:text-[var(--text-primary)]"
            )}
          >
            {item.label}
          </Link>
        ))}
      </div>
      <div className="border-t border-[var(--border-subtle)] px-4 py-4">
        <div className="font-mono text-[9px] tracking-[0.12em] text-[var(--text-muted)]">{projectMeta.project}</div>
        <div className="mt-3 flex items-center justify-between">
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
      </div>
    </aside>
  );
}
