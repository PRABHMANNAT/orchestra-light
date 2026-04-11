"use client";

import { useEffect, useState } from "react";
import { animate, motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";

import { COUNT_UP_DURATION, EASE_EXPO, EASE_IN_OUT_CIRC, alertSlideDown, fadeSlideUp, fadeSlideUpFast, livePulse, pageContainer, progressFill, ringDraw, staggerContainer } from "@/lib/animations";
import { StageShell } from "@/components/layout/StageShell";
import { OrchestraButton } from "@/components/shared/OrchestraButton";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { blockerCards, dependencyRiskMatrix, towerMetrics } from "@/lib/mockData";
import { getStageRoute } from "@/lib/stageConfig";
import { cn } from "@/lib/utils";

const featureRows = [
  { label: "Creator Onboarding", value: 87, tone: "on-track" },
  { label: "Asset Upload Pipeline", value: 82, tone: "on-track" },
  { label: "Stripe Connect", value: 34, tone: "blocked" },
  { label: "Search & Filter", value: 75, tone: "on-track" },
  { label: "Creator Analytics", value: 58, tone: "on-track" },
  { label: "Revenue Split", value: 62, tone: "on-track" },
  { label: "AI Recommendations", value: 18, tone: "blocked" },
  { label: "Game Discovery", value: 64, tone: "on-track" },
  { label: "Creator Tiers", value: 71, tone: "on-track" },
  { label: "Payout Dashboard", value: 59, tone: "on-track" }
] as const;

const riskToneMap = {
  stable: "text-[var(--emerald)] border-[var(--emerald-border)] bg-[var(--emerald-dim)]",
  watch: "text-[var(--amber)] border-[var(--amber-border)] bg-[var(--amber-dim)]",
  blocked: "text-[var(--rose)] border-[var(--rose-border)] bg-[var(--rose-dim)]",
  deferred: "text-[var(--text-muted)] border-[var(--border-default)] bg-[rgba(255,255,255,0.03)]"
} as const;

export function Stage8ControlTower() {
  const router = useRouter();
  const params = useParams<{ projectId: string }>();
  const projectId = typeof params?.projectId === "string" ? params.projectId : "p1";

  return (
    <StageShell showGrid>
      <motion.div variants={pageContainer} initial="hidden" animate="show" className="mx-auto max-w-7xl space-y-6 px-8 py-8">
        <SectionHeader
          label="Live"
          title="HOW ARE WE DOING?"
          subtitle="Right now. No meetings needed."
          accentColor="var(--cyan)"
        />

        <motion.div variants={alertSlideDown} initial="hidden" animate="show" className="glass-cyan glass-noise rounded-xl px-6 py-5">
          <div className="flex flex-wrap items-center gap-3">
            <motion.div variants={livePulse} initial="hidden" animate="show" className="h-[6px] w-[6px] rounded-full bg-[var(--accent-cyan)]" />
            <span className="font-mono text-[10px] tracking-[0.15em] text-[var(--accent-cyan)]">TODAY</span>
            <span className="ml-auto font-mono text-[9px] tracking-[0.12em] text-[var(--text-muted)]">08 APR 2026 · 09:00</span>
          </div>
          <div className="mb-3 mt-3 h-px bg-[rgba(0,229,204,0.1)]" />
          <motion.div variants={staggerContainer(0.06, 0.04)} initial="hidden" animate="show" className="space-y-2">
            {[
              "Jack needs to send his ABN. Chase him.",
              "Onboarding ships Friday.",
              "AI recs are V2. Everyone knows."
            ].map((item) => (
              <motion.div key={item} variants={fadeSlideUpFast} className="flex items-start gap-3">
                <span className="mt-2 h-1 w-1 rounded-full bg-[rgba(0,229,204,0.4)]" />
                <span className="font-ui text-[12px] leading-6 text-[var(--text-secondary)]">{item}</span>
              </motion.div>
            ))}
          </motion.div>
          <div className="mt-4 flex gap-3">
            <OrchestraButton variant="primary" size="sm">
              Generate Standup
            </OrchestraButton>
            <OrchestraButton variant="ghost" size="sm">
              SHARE TO SLACK
            </OrchestraButton>
            <OrchestraButton variant="ghost" size="sm">
              EMAIL TO JACK
            </OrchestraButton>
          </div>
        </motion.div>

        <motion.div variants={staggerContainer(0.08, 0.1)} initial="hidden" animate="show" className="grid gap-4 xl:grid-cols-4">
          <HealthMetricCard />
          <SimpleMetricCard title="ON TRACK" value={towerMetrics.onTrack} tone="green" />
          <SimpleMetricCard title="BLOCKED" value={towerMetrics.blocked} tone="red" />
          <SimpleMetricCard title="AT RISK" value={towerMetrics.atRisk} tone="amber" />
        </motion.div>

        <motion.div variants={fadeSlideUp} initial="hidden" animate="show" className="glass glass-noise rounded-xl px-6 py-6">
          <div className="font-mono text-[10px] tracking-[0.12em] text-[var(--text-muted)]">FEATURE DELIVERY STATUS</div>
          <div className="mb-5 mt-1 flex flex-wrap gap-6 font-mono text-[9px] tracking-[0.12em]">
            <span className="text-[var(--emerald)]">8 ON TRACK</span>
            <span className="text-[var(--cyan)]">61% AVG COMPLETION</span>
            <span className="text-[var(--text-muted)]">2 DEFERRED</span>
          </div>
          <motion.div variants={staggerContainer(0.05, 0.04)} initial="hidden" animate="show" className="space-y-4">
            {featureRows.map((feature, index) => (
              <motion.div key={feature.label} variants={fadeSlideUpFast}>
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-ui text-[12px] text-[var(--text-secondary)]">{feature.label}</span>
                  <span className="font-mono text-[10px] tracking-[0.12em] text-[var(--text-muted)]">{feature.value}%</span>
                </div>
                <div className="h-[6px] overflow-hidden rounded-full bg-[rgba(255,255,255,0.05)]">
                  <motion.div
                    variants={progressFill(feature.value)}
                    initial="hidden"
                    animate="show"
                    transition={{ duration: 1, delay: index * 0.06, ease: EASE_EXPO }}
                      className={cn(
                        "h-full rounded-full",
                        feature.tone === "blocked"
                        ? "bg-[linear-gradient(90deg,var(--rose),rgba(251,113,133,0.5))]"
                        : "bg-[linear-gradient(90deg,var(--cyan),rgba(0,229,204,0.6))]"
                    )}
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div variants={staggerContainer(0.08, 0.2)} initial="hidden" animate="show" className="grid gap-4 md:grid-cols-2">
          {blockerCards.map((blocker) => (
            <motion.div key={blocker.title} variants={fadeSlideUp} className="glass-rose glass-noise rounded-xl px-5 py-4">
              <div className="font-mono text-[9px] tracking-[0.12em] text-[var(--rose)]">BLOCKER</div>
              <div className="mt-2 font-ui text-[13px] font-medium text-[var(--text-primary)]">{blocker.title}</div>
              <div className="mt-1 font-ui text-[12px] leading-6 text-[var(--text-secondary)]">{blocker.description}</div>
              <div className="mt-3">
                <span className="glass-sm rounded-sm px-2 py-1 font-mono text-[9px] tracking-[0.12em] text-[var(--text-muted)]">
                  OWNER · {blocker.owner}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div variants={fadeSlideUp} initial="hidden" animate="show" className="glass rounded-xl px-5 py-5">
          <div className="mb-3 font-mono text-[10px] tracking-[0.12em] text-[var(--text-muted)]">DEPENDENCY RISK MATRIX</div>
          <motion.div variants={staggerContainer(0.06, 0.15)} initial="hidden" animate="show" className="grid gap-3 md:grid-cols-3 xl:grid-cols-6">
            {dependencyRiskMatrix.map((item) => (
              <motion.div
                key={item.id}
                variants={fadeSlideUpFast}
                className={cn("rounded-lg border px-3 py-3", riskToneMap[item.tone as keyof typeof riskToneMap])}
              >
                <div className="font-mono text-[9px] tracking-[0.12em]">{item.id}</div>
                <div className="mt-1 font-ui text-[12px]">{item.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div variants={fadeSlideUp} initial="hidden" animate="show">
          <OrchestraButton variant="ghost" onClick={() => router.push(getStageRoute(projectId, "9-updates"))}>
            Open updates
          </OrchestraButton>
        </motion.div>
      </motion.div>
    </StageShell>
  );
}

function HealthMetricCard() {
  const circumference = 2 * Math.PI * 30;
  const pct = towerMetrics.health;

  return (
    <motion.div variants={fadeSlideUp} className="glass glass-hover glass-noise rounded-xl px-5 py-6">
      <div className="mb-4 font-mono text-[10px] tracking-[0.12em] text-[var(--text-muted)]">Health</div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <CountNumber value={pct} suffix="%" className="font-title text-[40px] leading-none text-[var(--text-primary)]" />
          <div className="mt-1 font-mono text-[9px] tracking-[0.12em] text-[var(--text-muted)]">OVERALL HEALTH</div>
        </div>
        <svg width="80" height="80" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="30" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
          <motion.circle
            cx="40"
            cy="40"
            r="30"
            fill="none"
            stroke="#00e5cc"
            strokeWidth="6"
            strokeDasharray={circumference}
            filter="drop-shadow(0 0 8px rgba(0,229,204,0.6))"
            variants={ringDraw(circumference, pct)}
            initial="hidden"
            animate="show"
            style={{ transformOrigin: "center", rotate: -90, transformBox: "fill-box" }}
          />
        </svg>
      </div>
    </motion.div>
  );
}

function SimpleMetricCard({
  title,
  value,
  tone
}: {
  title: string;
  value: number;
  tone: "green" | "red" | "amber";
}) {
  const colorMap = {
    green: "text-[var(--emerald)]",
    red: "text-[var(--rose)]",
    amber: "text-[var(--amber)]"
  } as const;

  return (
    <motion.div variants={fadeSlideUp} className="glass glass-hover rounded-xl px-5 py-6">
      <div className="font-mono text-[10px] tracking-[0.12em] text-[var(--text-muted)]">{title}</div>
      <div className="mt-4">
        <CountNumber value={value} className={cn("font-title text-[52px] leading-none", colorMap[tone])} />
      </div>
      <div className="mt-1 font-mono text-[9px] tracking-[0.12em] text-[var(--text-muted)]">features</div>
    </motion.div>
  );
}

function CountNumber({
  value,
  suffix = "",
  className
}: {
  value: number;
  suffix?: string;
  className?: string;
}) {
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    const controls = animate(0, value, {
      duration: COUNT_UP_DURATION,
      ease: EASE_EXPO,
      onUpdate: (current) => setDisplayed(Math.round(current))
    });
    return () => controls.stop();
  }, [value]);

  return (
    <motion.span className={className}>
      {displayed}
      {suffix}
    </motion.span>
  );
}
