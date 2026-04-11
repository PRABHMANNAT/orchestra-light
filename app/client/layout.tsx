"use client";

import { ClientHeader } from "@/components/layout/ClientHeader";
import { useRoleGuard } from "@/hooks/useRoleGuard";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { user, ready } = useRoleGuard("client");

  if (!ready || !user) {
    return (
      <div className="theme-app main-bg flex h-full items-center justify-center font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
        Loading client portal...
      </div>
    );
  }

  return (
    <div className="theme-app main-bg flex h-screen flex-col overflow-hidden">
      <ClientHeader user={user} />
      <main className="flex-1 overflow-hidden">{children}</main>
    </div>
  );
}
