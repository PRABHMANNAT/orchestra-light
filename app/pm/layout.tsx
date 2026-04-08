"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

import { PMSidebar } from "@/components/layout/PMSidebar";
import { useRoleGuard } from "@/hooks/useRoleGuard";

export default function PmLayout({ children }: { children: React.ReactNode }) {
  const { user, ready } = useRoleGuard("pm");
  const pathname = usePathname();
  const mainRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const handleScroll = () => {
    const el = mainRef.current;

    if (!el) return;

    const scrollableHeight = el.scrollHeight - el.clientHeight;
    const progress = scrollableHeight > 0 ? el.scrollTop / scrollableHeight : 0;
    setScrollProgress(Math.round(progress * 100));
  };

  useEffect(() => {
    const el = mainRef.current;

    if (!el) return;

    el.scrollTo({ top: 0, behavior: "auto" });
    setScrollProgress(0);
  }, [pathname]);

  if (!ready || !user) {
    return (
      <div className="main-bg flex min-h-screen items-center justify-center font-mono text-[11px] uppercase tracking-[0.18em] text-text-muted">
        Loading manager workspace...
      </div>
    );
  }

  return (
    <div className="main-bg flex h-screen w-full overflow-hidden">
      <aside className="h-screen w-[260px] shrink-0 overflow-y-auto border-r border-white/60 bg-white/75 shadow-glass-lg backdrop-blur-xl">
        <PMSidebar user={user} />
      </aside>

      <div className="relative flex-1 h-screen overflow-hidden">
        <div className="absolute left-0 right-0 top-0 z-50 h-[2px] bg-[#f0f0f0]">
          <motion.div
            className="h-full origin-left bg-[#111111]"
            style={{ scaleX: scrollProgress / 100 }}
            transition={{ duration: 0 }}
          />
        </div>

        <main ref={mainRef} onScroll={handleScroll} className="h-full overflow-y-auto pt-0">
          {children}
        </main>
      </div>
    </div>
  );
}
