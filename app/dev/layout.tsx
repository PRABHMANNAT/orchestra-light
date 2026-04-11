"use client";

import { DevSidebar } from "@/components/layout/DevSidebar";
import { useRoleGuard } from "@/hooks/useRoleGuard";

export default function DevLayout({ children }: { children: React.ReactNode }) {
  const { user, ready } = useRoleGuard("developer");

  if (!ready || !user) {
    return (
      <div className="theme-app main-bg flex h-full items-center justify-center font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
        Loading developer workspace...
      </div>
    );
  }

  return (
    <div className="theme-app main-bg flex h-screen overflow-hidden">
      <DevSidebar user={user} />
      <main className="flex-1 overflow-hidden">{children}</main>
    </div>
  );
}
