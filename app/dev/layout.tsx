"use client";

import { DevSidebar } from "@/components/layout/DevSidebar";
import { useRoleGuard } from "@/hooks/useRoleGuard";

export default function DevLayout({ children }: { children: React.ReactNode }) {
  const { user, ready } = useRoleGuard("developer");

  if (!ready || !user) {
    return (
      <div className="flex h-full items-center justify-center font-mono text-[11px] uppercase tracking-[0.18em] text-text-muted">
        Loading developer workspace...
      </div>
    );
  }

  return (
    <div className="flex h-full">
      <DevSidebar user={user} />
      <main className="flex-1 overflow-hidden">{children}</main>
    </div>
  );
}

