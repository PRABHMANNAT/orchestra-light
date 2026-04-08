"use client";

import { motion } from "framer-motion";
import { Download, ExternalLink, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";

import { StageShell } from "@/components/layout/StageShell";
import { AppIcon } from "@/components/shared/AppIcon";
import { OrchestraButton } from "@/components/shared/OrchestraButton";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { handoverCards, projectMeta } from "@/lib/mockData";

export function Stage10Handover() {
  const router = useRouter();

  return (
    <StageShell showGrid>
      <div className="mx-auto max-w-7xl space-y-6">
        <SectionHeader
          title="HANDOVER HUB"
          subtitle="Project complete — 8-week engagement · ACME Corp Service Request Platform"
        />
        <div className="relative mb-8 overflow-hidden rounded-2xl border border-[#bbf7d0] bg-[#f0fdf4] p-10 text-center shadow-sm">
          <div
            className="absolute inset-0"
            style={{
              background: "radial-gradient(ellipse at 50% 50%, rgba(16,185,129,0.08) 0%, transparent 70%)"
            }}
          />
          <div className="absolute left-0 top-0 h-8 w-8 border-l-[2px] border-t-[2px] border-accent-green/40" />
          <div className="absolute right-0 top-0 h-8 w-8 border-r-[2px] border-t-[2px] border-accent-green/40" />
          <div className="absolute bottom-0 left-0 h-8 w-8 border-b-[2px] border-l-[2px] border-accent-green/40" />
          <div className="absolute bottom-0 right-0 h-8 w-8 border-b-[2px] border-r-[2px] border-accent-green/40" />

          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="relative z-10"
          >
            <AppIcon name="CheckCircle2" size={48} className="mx-auto mb-5 text-[#16a34a]" />
          </motion.div>

          <h2 className="relative z-10 font-display text-[64px] leading-none text-[#111111]">DELIVERY COMPLETE</h2>
          <p className="relative z-10 mt-3 font-mono text-[11px] uppercase tracking-[0.1em] text-[#999999]">
            SERVICE REQUEST PLATFORM V1.0 · SIGNED OFF 14 MARCH 2025
          </p>
          <div className="relative z-10 mt-4 flex flex-wrap justify-center gap-3">
            {["MANAGER APPROVED", "CLIENT APPROVED", "94 JIRA ITEMS CLOSED"].map((badge) => (
              <span
                key={badge}
                className="rounded-full border border-[#bbf7d0] bg-white px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-[#166534]"
              >
                ✓ {badge}
              </span>
            ))}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {handoverCards.pm.map((card) => (
            <div key={card.title} className="rounded-2xl border border-[#e8e8e8] bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-[#999999]">
                <AppIcon
                  name={card.icon as Parameters<typeof AppIcon>[0]["name"]}
                  className={
                    card.tone === "cyan"
                      ? "text-[#999999]"
                      : card.tone === "amber"
                        ? "text-[#854d0e]"
                        : card.tone === "red"
                          ? "text-[#991b1b]"
                          : "text-[#444444]"
                  }
                  size={15}
                />
                {card.title}
              </div>
              <div className="space-y-2">
                {card.items.map((item) => (
                  <div key={item} className="font-sans text-[13px] text-[#444444]">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          <OrchestraButton variant="primary" icon={Download}>
            EXPORT HANDOVER PDF
          </OrchestraButton>
          <OrchestraButton variant="ghost" icon={ExternalLink} onClick={() => router.push("/client")}>
            OPEN CLIENT PORTAL
          </OrchestraButton>
          <OrchestraButton variant="ghost" icon={RefreshCw} onClick={() => router.push("/pm/1-intake")}>
            START NEW PROJECT
          </OrchestraButton>
        </div>
      </div>
    </StageShell>
  );
}
