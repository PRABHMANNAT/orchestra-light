"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, ChevronLeft, ChevronRight, Monitor, RotateCcw, Search, Smartphone, Tablet } from "lucide-react";

import {
  dashboardStats,
  detailTimeline,
  prototypeScreens,
  reportsBars,
  reportsCategories,
  requestTableRows
} from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { OrchestraButton } from "@/components/shared/OrchestraButton";
import { StatusBadge } from "@/components/shared/StatusBadge";

interface PrototypeFrameProps {
  activeIndex: number;
  onChange: (index: number) => void;
  className?: string;
  variant?: "default" | "studio";
}

export function PrototypeFrame({
  activeIndex,
  onChange,
  className,
  variant = "default"
}: PrototypeFrameProps) {
  const [device, setDevice] = useState<"mac" | "ipad" | "iphone">("mac");
  const currentScreen = prototypeScreens[activeIndex];
  const isStudio = variant === "studio";
  const renderScreenContent = () => (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentScreen.id}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.28, ease: "easeOut" }}
        className="h-full"
      >
        {activeIndex === 0 ? <LoginScreen /> : null}
        {activeIndex === 1 ? <DashboardScreen /> : null}
        {activeIndex === 2 ? <SubmitScreen /> : null}
        {activeIndex === 3 ? <DetailScreen /> : null}
        {activeIndex === 4 ? <ReportsScreen /> : null}
      </motion.div>
    </AnimatePresence>
  );

  return (
    <div className={cn("space-y-4", className)}>
      {isStudio ? (
        <>
          <div className="flex items-center gap-2">
            <div className="flex gap-1 rounded-full border border-white/70 bg-white/60 p-1 shadow-glass-sm backdrop-blur-md">
              <button
                type="button"
                onClick={() => setDevice("mac")}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-3 py-1.5 font-mono text-[11px] tracking-wider transition-all",
                  device === "mac" ? "bg-white text-[#111111] shadow-sm" : "text-[#999999] hover:text-[#555555]"
                )}
              >
                <Monitor size={12} />
                MAC
              </button>
              <button
                type="button"
                onClick={() => setDevice("ipad")}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-3 py-1.5 font-mono text-[11px] tracking-wider transition-all",
                  device === "ipad" ? "bg-white text-[#111111] shadow-sm" : "text-[#999999] hover:text-[#555555]"
                )}
              >
                <Tablet size={12} />
                IPAD
              </button>
              <button
                type="button"
                onClick={() => setDevice("iphone")}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-3 py-1.5 font-mono text-[11px] tracking-wider transition-all",
                  device === "iphone" ? "bg-white text-[#111111] shadow-sm" : "text-[#999999] hover:text-[#555555]"
                )}
              >
                <Smartphone size={12} />
                IPHONE
              </button>
            </div>
            <span className="ml-2 font-mono text-[10px] tracking-widest text-[#999999]">
              SCREEN {activeIndex + 1} OF {prototypeScreens.length} · {currentScreen.label}
            </span>
          </div>

          <div className="flex justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={device}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="w-full"
              >
                {device === "mac" ? (
                  <div className="mx-auto w-full max-w-[680px]">
                    <div className="flex items-center gap-2 rounded-t-[2.5rem] bg-[#e8e8e8] px-4 py-3">
                      <div className="flex gap-1.5">
                        <div className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                        <div className="h-3 w-3 rounded-full bg-[#febc2e]" />
                        <div className="h-3 w-3 rounded-full bg-[#28c840]" />
                      </div>
                      <div className="mx-4 flex-1 rounded-xl bg-white px-3 py-1 text-center font-mono text-[11px] text-[#999999]">
                        {currentScreen.url}
                      </div>
                    </div>
                    <div className="overflow-hidden rounded-b-[2.5rem] bg-[#f5f5f7]" style={{ height: "420px" }}>
                      {renderScreenContent()}
                    </div>
                  </div>
                ) : null}

                {device === "ipad" ? (
                  <div className="mx-auto" style={{ width: "420px" }}>
                    <div className="flex aspect-[4/3] flex-col rounded-[3rem] bg-[#1d1d1f] p-4">
                      <div className="mx-auto mb-2 h-2 w-2 rounded-full bg-[#3a3a3c]" />
                      <div className="w-full flex-1 overflow-hidden rounded-[2.5rem] bg-[#f5f5f7]">
                        {renderScreenContent()}
                      </div>
                      <div className="mx-auto mt-2 h-1 w-16 rounded-full bg-[#3a3a3c]" />
                    </div>
                  </div>
                ) : null}

                {device === "iphone" ? (
                  <div className="mx-auto" style={{ width: "220px" }}>
                    <div className="flex aspect-[9/19.5] flex-col rounded-[4rem] bg-[#1d1d1f] p-3">
                      <div className="mx-auto mb-2 h-4 w-16 rounded-full bg-[#111111]" />
                      <div className="w-full flex-1 overflow-hidden rounded-[3rem] bg-[#f5f5f7]">
                        {renderScreenContent()}
                      </div>
                      <div className="mx-auto mt-2 h-1 w-12 rounded-full bg-[#3a3a3c]" />
                    </div>
                  </div>
                ) : null}
              </motion.div>
            </AnimatePresence>
          </div>
        </>
      ) : (
        <div>
          <div className="browser-frame relative">
            <div className="browser-chrome">
              <span className="h-2.5 w-2.5 bg-accent-red" style={{ borderRadius: 999 }} />
              <span className="h-2.5 w-2.5 bg-accent-amber" style={{ borderRadius: 999 }} />
              <span className="h-2.5 w-2.5 bg-accent-green" style={{ borderRadius: 999 }} />
              <div className="ml-2 flex items-center gap-2 text-[#333333]">
                <ChevronLeft size={13} strokeWidth={1.5} />
                <ChevronRight size={13} strokeWidth={1.5} />
                <RotateCcw size={13} strokeWidth={1.5} />
              </div>
              <div className="url-bar">{currentScreen.url}</div>
            </div>
            <div className="h-[440px] bg-[#f5f5f7]">{renderScreenContent()}</div>
          </div>
        </div>
      )}

      {isStudio ? (
        <div className="flex flex-col items-center">
          <div className="flex flex-wrap justify-center gap-2">
            {prototypeScreens.map((screen, index) => (
              <button
                key={screen.id}
                type="button"
                onClick={() => onChange(index)}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-xl border font-mono text-[10px] uppercase tracking-[0.12em] transition-all",
                  index === activeIndex
                    ? "border-[#111111] bg-[#111111] text-white"
                    : "border-[#e0e0e0] text-[#999999] hover:border-[#111111] hover:text-[#111111]"
                )}
              >
                {String(index + 1).padStart(2, "0")}
              </button>
            ))}
          </div>
          <div className="mt-2 text-center font-mono text-[10px] uppercase tracking-widest text-[#999999]">
            {currentScreen.label}
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {prototypeScreens.map((screen, index) => (
            <button
              key={screen.id}
              type="button"
              onClick={() => onChange(index)}
              className={cn(
                "rounded-xl border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em]",
                index === activeIndex
                  ? "border-[#111111] bg-[#111111] text-white"
                  : "border-[#e0e0e0] text-[#999999]"
              )}
            >
              {screen.shortLabel} · {screen.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function LoginScreen() {
  return (
    <div className="mx-auto mt-10 max-w-[320px] border border-border bg-[#0a0a0a] p-7">
      <div className="font-display text-[18px] tracking-[0.1em] text-white">SERVICE REQUEST</div>
      <div className="font-mono text-[9px] uppercase tracking-[0.14em] text-text-muted">
        ENTERPRISE OPERATIONS PLATFORM
      </div>
      <div className="my-5 border-t border-border" />
      <Label>EMAIL ADDRESS</Label>
      <Input value="sarah.chen@acmecorp.com" />
      <Label className="mt-3">PASSWORD</Label>
      <Input value="••••••••••" />
      <button type="button" className="mt-5 w-full bg-accent-cyan py-2.5 font-ui text-[11px] font-bold uppercase tracking-[0.15em] text-black">
        SIGN IN
      </button>
      <div className="mt-3 text-center font-mono text-[10px] text-accent-cyan">SIGN IN WITH SSO →</div>
      <div className="mt-6 text-center font-mono text-[9px] uppercase tracking-[0.1em] text-text-muted">
        SECURED BY ACTIVE DIRECTORY · ACME CORP
      </div>
    </div>
  );
}

function DashboardScreen() {
  return (
    <div className="h-full">
      <div className="flex h-11 items-center justify-between border-b border-border bg-[#0a0a0a] px-4">
        <div className="flex items-center">
          <span className="font-display text-[15px] text-white">DASHBOARD</span>
          <span className="ml-3 font-mono text-[9px] uppercase tracking-[0.12em] text-text-muted">WEEK 14 · Q1 2025</span>
        </div>
        <div className="flex items-center gap-3 text-text-muted">
          <Bell size={14} strokeWidth={1.5} />
          <Search size={14} strokeWidth={1.5} />
          <div className="flex h-6 w-6 items-center justify-center rounded border border-border bg-bg-3 font-mono text-[9px] text-white">
            SC
          </div>
        </div>
      </div>
      <div className="flex h-[396px]">
        <div className="w-[120px] border-r border-[#111111] px-2 py-3">
          {["Overview", "My Requests", "Assigned", "Reports", "Settings"].map((label, index) => (
            <div
              key={label}
              className={cn(
                "mb-1 flex h-9 items-center px-3 font-ui text-[11px]",
                index === 0 ? "border-l-2 border-accent-cyan bg-[rgba(0,212,255,0.05)] text-white" : "text-text-muted"
              )}
            >
              {label}
            </div>
          ))}
        </div>
        <div className="flex-1 px-4 py-4">
          <div className="grid grid-cols-4 gap-3">
            {dashboardStats.map((stat) => (
              <div key={stat.label} className="border border-[#161616] bg-[#0a0a0a] p-3">
                <div
                  className={cn(
                    "font-display text-[28px]",
                    stat.tone === "amber"
                      ? "text-accent-amber"
                      : stat.tone === "red"
                        ? "text-accent-red"
                        : stat.tone === "green"
                          ? "text-accent-green"
                          : "text-white"
                  )}
                >
                  {stat.value}
                </div>
                <div className="font-mono text-[9px] uppercase tracking-[0.12em] text-text-muted">{stat.label}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 border border-[#161616] bg-[#0a0a0a]">
            <div className="grid grid-cols-[80px_1.5fr_110px_90px_70px] gap-3 border-b border-[#161616] px-4 py-3 font-mono text-[9px] uppercase tracking-[0.14em] text-text-muted">
              <span>ID</span>
              <span>TITLE</span>
              <span>STATUS</span>
              <span>ASSIGNEE</span>
              <span>UPDATED</span>
            </div>
            {requestTableRows.map((row) => (
              <div key={row.id} className="grid grid-cols-[80px_1.5fr_110px_90px_70px] gap-3 border-b border-[#111111] px-4 py-3 font-ui text-[11px] text-white last:border-b-0">
                <span>{row.id}</span>
                <span>{row.title}</span>
                <span>
                  <StatusBadge variant={row.status as "in-progress" | "p1" | "done"} />
                </span>
                <span>{row.assignee}</span>
                <span>{row.updated}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SubmitScreen() {
  return (
    <div className="px-5 py-4">
      <div className="font-mono text-[9px] uppercase tracking-[0.14em] text-text-muted">DASHBOARD / REQUESTS / NEW</div>
      <div className="mt-1 font-display text-[22px] text-white">NEW SERVICE REQUEST</div>
      <div className="mt-4 space-y-3">
        <div>
          <Label>REQUEST TITLE</Label>
          <Input value="Describe your request..." muted />
        </div>
        <div>
          <Label>CATEGORY</Label>
          <div className="mt-2 flex flex-wrap gap-2">
            {["IT Support", "Facilities", "HR", "Finance"].map((label, index) => (
              <span
                key={label}
                className={cn(
                  "border px-3 py-1.5 font-ui text-[11px]",
                  index === 0 ? "border-accent-cyan bg-[rgba(0,212,255,0.08)] text-accent-cyan" : "border-border text-text-muted"
                )}
              >
                {label}
              </span>
            ))}
          </div>
        </div>
        <div>
          <Label>PRIORITY</Label>
          <div className="mt-2 flex gap-2">
            {["LOW", "MEDIUM", "HIGH", "URGENT"].map((label) => (
              <span
                key={label}
                className={cn(
                  "border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em]",
                  label === "HIGH" ? "border-[rgba(245,158,11,0.45)] bg-[rgba(245,158,11,0.08)] text-accent-amber" : "border-border text-text-muted"
                )}
              >
                {label}
                {label === "HIGH" ? " ✓" : ""}
              </span>
            ))}
          </div>
        </div>
        <div>
          <Label>DESCRIPTION</Label>
          <div className="mt-1 min-h-[84px] rounded-xl border border-border bg-[#0a0a0a] px-3 py-2 font-ui text-[12px] text-text-muted">
            Provide details, context, and any urgency reasons...
          </div>
        </div>
        <div>
          <Label>ATTACHMENTS</Label>
          <div className="mt-1 flex h-12 items-center justify-center rounded-xl border border-dashed border-border bg-[#0a0a0a] font-mono text-[10px] uppercase tracking-[0.12em] text-text-muted">
            Drop files here · PDF · IMG · DOCX
          </div>
        </div>
        <OrchestraButton variant="primary">SUBMIT REQUEST</OrchestraButton>
      </div>
    </div>
  );
}

function DetailScreen() {
  return (
    <div className="px-5 py-4">
      <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-accent-cyan">REQ-0241</div>
      <div className="mt-0.5 font-display text-[17px] text-white">
        Network access required for new hire — Design team
      </div>
      <div className="mt-4 flex gap-4">
        <div className="flex-1">
          {detailTimeline.map((item) => (
            <div key={item.title} className="mb-4 flex items-start gap-3">
              <div className="mt-1.5 h-2 w-2" style={{ borderRadius: 999, background: item.tone === "done" ? "#10b981" : item.tone === "in-progress" ? "#00d4ff" : item.tone === "p1" ? "#f59e0b" : "#4a4a4a" }} />
              <div>
                <div className={cn("font-ui text-[11px]", item.tone === "p1" ? "text-accent-amber" : item.tone === "deferred" ? "text-text-muted" : "text-white")}>
                  {item.title} — {item.detail}
                </div>
                {item.meta ? <div className="font-mono text-[9px] uppercase tracking-[0.12em] text-text-muted">{item.meta}</div> : null}
              </div>
            </div>
          ))}
          <div className="mt-4">
            <div className="font-ui text-[11px] text-text-secondary">
              <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-text-muted">MT</span> Mike Torres:
            </div>
            <div className="font-ui text-[11px] text-white">
              Need AD admin approval to provision. Escalating now.
            </div>
            <div className="font-mono text-[9px] uppercase tracking-[0.12em] text-text-muted">11:04</div>
          </div>
        </div>
        <div className="w-[120px] rounded-xl border border-[#161616] bg-[#0a0a0a] p-3">
          <SidebarRow label="STATUS">
            <StatusBadge variant="in-progress" />
          </SidebarRow>
          <SidebarRow label="ASSIGNEE">M. Torres</SidebarRow>
          <SidebarRow label="PRIORITY">HIGH</SidebarRow>
          <SidebarRow label="SLA">
            <span className="text-accent-amber">Due 3h 22m</span>
          </SidebarRow>
          <SidebarRow label="CREATED">Today 09:41</SidebarRow>
        </div>
      </div>
    </div>
  );
}

function ReportsScreen() {
  return (
    <div className="px-5 py-4">
      <div className="font-display text-[22px] text-white">REPORTING OVERVIEW</div>
      <div className="mt-2 flex gap-2">
        {["TODAY", "7D", "30D", "CUSTOM"].map((label) => (
          <span
            key={label}
            className={cn(
              "rounded-full border px-3 py-1 font-mono text-[9px] uppercase tracking-[0.12em]",
              label === "30D" ? "border-accent-cyan bg-[rgba(0,212,255,0.08)] text-accent-cyan" : "border-border text-text-muted"
            )}
          >
            {label}
            {label === "30D" ? " ✓" : ""}
          </span>
        ))}
      </div>
      <div className="mt-3 grid grid-cols-4 gap-2">
        {[
          ["142", "TOTAL"],
          ["94%", "RESOLVED"],
          ["2.4h", "AVG RESOLUTION"],
          ["98%", "SLA MET"]
        ].map(([value, label]) => (
          <div key={label} className="rounded-xl border border-[#161616] bg-[#0a0a0a] p-3">
            <div className="font-display text-[18px] text-white">{value}</div>
            <div className="font-mono text-[8px] uppercase tracking-[0.12em] text-text-muted">{label}</div>
          </div>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-[1fr_170px] gap-4">
        <div className="rounded-xl border border-[#161616] bg-[#0a0a0a] p-3">
          <svg viewBox="0 0 220 110" className="h-[120px] w-full">
            {reportsBars.map((height, index) => (
              <g key={index}>
                <rect x={12 + index * 30} y={100 - height} width={24} height={height} fill="rgba(0,212,255,0.72)" />
                <text x={24 + index * 30} y={108} textAnchor="middle" fill="#4a4a4a" style={{ fontFamily: "var(--font-mono)", fontSize: 8 }}>
                  {["M", "T", "W", "T", "F", "S", "S"][index]}
                </text>
              </g>
            ))}
          </svg>
        </div>
        <div className="rounded-xl border border-[#161616] bg-[#0a0a0a] p-3">
          <div className="font-mono text-[9px] uppercase tracking-[0.12em] text-text-muted">CATEGORY</div>
          <div className="mt-2 space-y-2">
            {[
              ["IT", "42%"],
              ["Facilities", "28%"],
              ["HR", "18%"],
              ["Finance", "12%"]
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between font-ui text-[11px] text-white">
                <span>{label}</span>
                <span>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-4 overflow-hidden rounded-2xl border border-[#161616] bg-[#0a0a0a]">
        <div className="grid grid-cols-4 gap-3 border-b border-[#161616] px-4 py-3 font-mono text-[9px] uppercase tracking-[0.14em] text-text-muted">
          <span>CATEGORY</span>
          <span>COUNT</span>
          <span>% RESOLVED</span>
          <span>AVG TIME</span>
        </div>
        {reportsCategories.map((row) => (
          <div key={row.category} className="grid grid-cols-4 gap-3 border-b border-[#111111] px-4 py-3 font-ui text-[11px] text-white last:border-b-0">
            <span>{row.category}</span>
            <span>{row.count}</span>
            <span>{row.resolved}</span>
            <span>{row.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("mb-1 font-mono text-[9px] uppercase tracking-[0.14em] text-text-muted", className)}>{children}</div>;
}

function Input({ value, muted = false }: { value: string; muted?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-[#0f0f0f] px-3 py-2 font-ui text-[12px]",
        muted ? "text-text-muted" : "text-white"
      )}
    >
      {value}
    </div>
  );
}

function SidebarRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-3">
      <div className="mb-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-text-muted">{label}</div>
      <div className="font-ui text-[11px] text-white">{children}</div>
    </div>
  );
}
