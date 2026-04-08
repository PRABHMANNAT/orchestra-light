"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, LogOut } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { RoleBadge } from "@/components/shared/RoleBadge";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { projectMeta } from "@/lib/mockData";
import { type MockUser } from "@/lib/roles";
import { pmStages } from "@/lib/stageConfig";

type StageState = "completed" | "active";

export function PMSidebar({ user }: { user: MockUser }) {
  const pathname = usePathname();
  const router = useRouter();
  const activeSlug = pathname.split("/").pop() ?? "1-intake";
  const activeRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest"
    });
  }, [activeSlug]);

  const handleLogout = () => {
    window.localStorage.removeItem("orchestra_user");
    router.replace("/login");
  };

  return (
    <div className="flex h-full flex-col">
      <div className="shrink-0 px-5 pb-4 pt-5">
        <div>
          <div className="font-sans text-[18px] font-semibold tracking-tight text-[#111111]">ORCHESTRA</div>
          <div className="mt-1 font-mono text-[10px] tracking-widest text-[#999999]">{projectMeta.version}</div>
        </div>

        <div className="mt-5 flex items-center gap-3">
          <UserAvatar initials={user.avatar} role={user.role} />
          <div>
            <div className="font-sans text-[13px] font-semibold text-[#111111]">{user.name}</div>
            <RoleBadge role={user.role} />
          </div>
        </div>
      </div>

      <div className="mx-4 shrink-0 border-t border-[#f0f0f0]" />

      <nav className="flex-1 overflow-y-auto px-2 py-3">
        {pmStages.map((stage, index) => {
          const state: StageState = stage.slug === activeSlug ? "active" : "completed";

          return (
            <div key={stage.slug}>
              {state === "completed" ? (
                <motion.div
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.24, delay: index * 0.04 }}
                  whileHover={{ backgroundColor: "#f5f5f5" }}
                  onClick={() => router.push(`/pm/${stage.slug}`)}
                  className="mx-3 flex cursor-pointer items-center gap-3 rounded-xl px-4 py-2.5 transition-colors group"
                >
                  <span className="w-4 shrink-0 font-mono text-[10px] text-[#bbbbbb]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap font-sans text-[13px] text-[#555555] transition-colors group-hover:text-[#111111]">
                    {stage.label}
                  </span>
                  <CheckCircle2 size={12} className="shrink-0 text-[#22c55e]" />
                </motion.div>
              ) : null}

              {state === "active" ? (
                <motion.div
                  ref={activeRef}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.24, delay: index * 0.04 }}
                  onClick={() => router.push(`/pm/${stage.slug}`)}
                  className="mx-3 flex cursor-pointer items-center gap-3 rounded-xl border border-white/80 bg-white/80 px-4 py-2.5 shadow-glass-sm"
                >
                  <span className="w-4 shrink-0 font-mono text-[10px] font-medium text-[#111111]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap font-sans text-[13px] font-medium text-[#111111]">
                    {stage.label}
                  </span>
                  <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#111111]" />
                </motion.div>
              ) : null}
            </div>
          );
        })}
      </nav>

      <div className="mt-auto shrink-0 border-t border-[#f0f0f0] px-4 py-4">
        <div className="mx-4 mb-3 rounded-xl border border-white/60 bg-white/60 px-3 py-3 backdrop-blur-sm">
          <p className="mb-2 font-mono text-[9px] tracking-widest text-[#bbbbbb]">STAGE STATUS</p>
          {[
            { color: "#22c55e", label: "COMPLETED — CLICK TO REVISIT" },
            { color: "#111111", label: "ACTIVE — CURRENT STAGE" }
          ].map(({ color, label }) => (
            <div key={label} className="mb-1.5 flex items-center gap-2 last:mb-0">
              <div className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: color }} />
              <span className="font-mono text-[9px] text-[#aaaaaa]">{label}</span>
            </div>
          ))}
        </div>
        <div className="mx-2 rounded-2xl border border-[#e8e8e8] bg-white/85 p-3 shadow-sm">
          <div className="font-sans text-[11px] font-semibold text-[#111111]">SERVICE REQUEST PLATFORM</div>
          <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.08em] text-[#999999]">{projectMeta.client}</div>
          <div className="mt-2 flex items-center">
            <span className="h-2 w-2 rounded-full bg-[#6ca956]" />
            <span className="ml-2 font-sans text-[11px] text-[#6ca956]">Active · Week 4 of 8</span>
          </div>
        </div>
        <button type="button" onClick={handleLogout} className="mt-3 px-2 text-[#999999] hover:text-[#555555]">
          <LogOut size={13} strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}
