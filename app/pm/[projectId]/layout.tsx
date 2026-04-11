"use client";

import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { useState } from "react";

import { PMSidebar } from "@/components/layout/PMSidebar";
import { useRoleGuard } from "@/hooks/useRoleGuard";

export default function ProjectPmLayout({ children }: { children: React.ReactNode }) {
  const { user, ready } = useRoleGuard("pm");
  const params = useParams<{ projectId: string }>();
  const [scrollProgress, setScrollProgress] = useState(0);
  const projectId = typeof params?.projectId === "string" ? params.projectId : "p1";

  if (!ready || !user) {
    return (
      <div className="main-bg flex min-h-screen items-center justify-center font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
        Loading manager workspace...
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-page">
      <div
        style={{
          position: "fixed",
          top: "5%",
          left: "320px",
          width: "500px",
          height: "500px",
          background: "radial-gradient(circle, rgba(167,139,250,0.03) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0
        }}
      />
      <div
        style={{
          position: "fixed",
          top: "40%",
          right: "5%",
          width: "600px",
          height: "600px",
          background: "radial-gradient(circle, rgba(0,229,204,0.02) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0
        }}
      />
      <div
        style={{
          position: "fixed",
          bottom: "10%",
          left: "340px",
          width: "400px",
          height: "400px",
          background: "radial-gradient(circle, rgba(96,165,250,0.025) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0
        }}
      />

      <PMSidebar user={user} projectId={projectId} />

      <main
        style={{ marginLeft: "260px" }}
        className="relative z-10 flex-1 overflow-y-auto"
        onScroll={(event) => {
          const element = event.currentTarget;
          const maxScroll = element.scrollHeight - element.clientHeight;
          setScrollProgress(maxScroll > 0 ? element.scrollTop / maxScroll : 0);
        }}
      >
        <div className="sticky top-0 z-50 h-[2px] w-full bg-transparent">
          <motion.div
            style={{
              scaleX: scrollProgress,
              transformOrigin: "left",
              background: "linear-gradient(90deg, #00e5cc, rgba(0,229,204,0.6))"
            }}
            className="h-[2px] w-full"
          />
        </div>
        {children}
      </main>
    </div>
  );
}
