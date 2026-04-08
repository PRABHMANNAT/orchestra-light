"use client";

import { useEffect, useMemo, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip } from "chart.js";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

import { StageShell } from "@/components/layout/StageShell";
import { OrchestraButton } from "@/components/shared/OrchestraButton";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { blockerCards, dependencyRiskMatrix, towerMetrics } from "@/lib/mockData";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

type FeatureProgressItem = {
  label: string;
  value: number;
  deferred?: boolean;
};

const features: FeatureProgressItem[] = [
  { label: "Status Tracking", value: 100 },
  { label: "Authentication & SSO", value: 87 },
  { label: "Request Submission", value: 75 },
  { label: "Basic Reporting", value: 52 },
  { label: "Assignment Engine", value: 38 },
  { label: "Role Management", value: 33 },
  { label: "Manager Approval", value: 22 },
  { label: "Email Notifications", value: 0, deferred: true },
  { label: "Admin Panel", value: 0, deferred: true },
  { label: "Billing Integration", value: 0, deferred: true }
];

const riskToneMap = {
  green: "bg-[#dcfce7]",
  amber: "bg-[#fef3c7]",
  red: "bg-[#fee2e2]",
  muted: "bg-[#f3f4f6]"
};

export function Stage8ControlTower() {
  const router = useRouter();

  const sortedFeatures = useMemo(
    () =>
      [...features].sort((left, right) => {
        if (left.deferred && !right.deferred) return 1;
        if (!left.deferred && right.deferred) return -1;
        return right.value - left.value;
      }),
    []
  );

  const nonDeferredFeatures = useMemo(
    () => sortedFeatures.filter((feature) => !feature.deferred),
    [sortedFeatures]
  );

  const metrics = useMemo(() => {
    const onTrack = nonDeferredFeatures.filter((feature) => feature.value > 50).length;
    const average =
      nonDeferredFeatures.reduce((total, feature) => total + feature.value, 0) / nonDeferredFeatures.length;
    const deferred = sortedFeatures.filter((feature) => feature.deferred).length;

    return {
      onTrack,
      averageCompletion: Math.round(average),
      deferred
    };
  }, [nonDeferredFeatures, sortedFeatures]);

  const chartData = useMemo(
    () => ({
      labels: sortedFeatures.map((feature) => feature.label),
      datasets: [
        {
          data: sortedFeatures.map((feature) => feature.value),
          backgroundColor: sortedFeatures.map((feature) =>
            feature.value === 100 ? "#22c55e" : feature.deferred ? "#e5e7eb" : "#111111"
          ),
          borderRadius: 6,
          borderSkipped: false,
          barThickness: 20
        }
      ]
    }),
    [sortedFeatures]
  );

  const chartOptions = useMemo(
    () => ({
      indexAxis: "y" as const,
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: "#111111",
          displayColors: false,
          titleFont: {
            family: '"DM Mono", monospace',
            size: 10
          },
          bodyFont: {
            family: '"DM Mono", monospace',
            size: 10
          }
        }
      },
      scales: {
        x: {
          min: 0,
          max: 100,
          border: {
            display: false
          },
          grid: {
            color: "rgba(0,0,0,0.04)",
            drawBorder: false
          },
          ticks: {
            color: "#999999",
            font: {
              family: "Inter, sans-serif",
              size: 11
            },
            callback: (value: string | number) => `${value}%`
          }
        },
        y: {
          border: {
            display: false
          },
          grid: {
            display: false,
            drawBorder: false
          },
          ticks: {
            color: "#333333",
            font: {
              family: "Inter, sans-serif",
              size: 12
            }
          }
        }
      }
    }),
    []
  );

  return (
    <StageShell showGrid>
      <div className="mx-auto max-w-7xl space-y-6">
        <SectionHeader title="CONTROL TOWER" subtitle="Live delivery intelligence · Week 4 of 8 · Against approved scope v1.0" />
        <div className="grid gap-4 xl:grid-cols-4">
          <MetricCard title="DELIVERY HEALTH" value={Number(towerMetrics.health)} tone="amber" donut />
          <MetricCard title="ON TRACK" value={Number(towerMetrics.onTrack)} tone="green" />
          <MetricCard title="BLOCKED" value={Number(towerMetrics.blocked)} tone="red" />
          <MetricCard title="AT RISK" value={Number(towerMetrics.atRisk)} tone="amber" />
        </div>

        <div className="mt-6 rounded-2xl border border-[#e8e8e8] bg-white p-6 shadow-sm">
          <h3 className="mb-5 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-[#999999]">
            <div className="h-2 w-2 rounded-full bg-[#6ca956]" />
            FEATURE PROGRESS
          </h3>

          <div className="grid gap-4 md:grid-cols-3">
            <FeatureMetricCard label="ON TRACK" value={metrics.onTrack} />
            <FeatureMetricCard label="AVG COMPLETION" value={metrics.averageCompletion} suffix="%" />
            <FeatureMetricCard label="DEFERRED" value={metrics.deferred} />
          </div>

          <div className="mt-5 flex flex-wrap gap-4">
            {[
              { color: "#111111", label: "IN PROGRESS" },
              { color: "#22c55e", label: "COMPLETE" },
              { color: "#e5e7eb", label: "DEFERRED" }
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-md" style={{ background: item.color }} />
                <span className="font-mono text-[10px] tracking-widest text-[#999999]">{item.label}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 h-[360px]">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>

        <div className="space-y-3">
          {blockerCards.map((card) => (
            <div key={card.title} className="rounded-2xl border border-[#e8e8e8] border-l-4 border-l-[#fca5a5] bg-white p-5 shadow-sm">
              <div className="font-sans text-[15px] font-semibold text-[#111111]">{card.title}</div>
              <div className="mt-2 font-sans text-[13px] text-[#444444]">{card.description}</div>
              <div className="mt-2 font-mono text-[10px] uppercase tracking-widest text-[#999999]">{card.meta}</div>
              <div className="mt-3">
                <OrchestraButton variant="ghost" size="sm">
                  FLAG FOR REVIEW
                </OrchestraButton>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-[#e8e8e8] bg-white p-5 shadow-sm">
          <div className="mb-3 font-mono text-[10px] uppercase tracking-widest text-[#999999]">DEPENDENCY RISK MATRIX</div>
          <div className="grid grid-cols-6 gap-3">
            {dependencyRiskMatrix.map((tone, index) => (
              <div
                key={`${tone}-${index}`}
                className={`flex h-9 items-center justify-center rounded-xl font-mono text-[9px] uppercase tracking-[0.12em] text-[#666666] ${riskToneMap[tone]}`}
              >
                N{index + 1}
              </div>
            ))}
          </div>
          <div className="mt-3 font-mono text-[10px] uppercase tracking-widest text-[#999999]">
            WEEK 4 OF 8 · 50% TIMELINE ELAPSED · 62% SCOPE COMPLETE
          </div>
          <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-[#eeeeee]">
            <div className="relative h-full w-1/2 rounded-full bg-[#111111]">
              <div className="absolute right-0 top-1/2 h-3 w-3 -translate-y-1/2 translate-x-1/2 rotate-45 bg-white" />
            </div>
          </div>
        </div>

        <OrchestraButton variant="primary" onClick={() => router.push("/pm/9-updates")}>
          VIEW STAKEHOLDER UPDATES →
        </OrchestraButton>
      </div>
    </StageShell>
  );
}

function FeatureMetricCard({
  label,
  value,
  suffix = ""
}: {
  label: string;
  value: number;
  suffix?: string;
}) {
  return (
    <div className="rounded-2xl bg-[#f9fafb] p-4">
      <div className="font-sans text-[28px] font-medium leading-none text-[#111111]">
        {value}
        {suffix}
      </div>
      <div className="mt-1 font-mono text-[10px] tracking-widest text-[#999999]">{label}</div>
    </div>
  );
}

function MetricCard({
  title,
  value,
  tone,
  donut = false
}: {
  title: string;
  value: number;
  tone: "green" | "amber" | "red";
  donut?: boolean;
}) {
  const backgrounds = {
    amber: "linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(226,178,13,0.12) 100%)",
    green: "linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(108,169,86,0.15) 100%)",
    red: "linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(239,68,68,0.10) 100%)"
  } as const;

  return (
    <div
      className="glass-card rounded-2xl border border-navy/15 p-6"
      style={{ background: backgrounds[tone], borderColor: "rgba(52,68,95,0.15)" }}
    >
      <div className="font-mono text-[10px] uppercase tracking-widest text-[#999999]">{title}</div>
      {donut ? (
        <div className="mt-4 flex items-center justify-between gap-4">
          <div>
            <AnimatedNumber value={value} color="text-[#111111]" size="text-[28px]" />
            <div className="font-mono text-[10px] uppercase tracking-widest text-[#999999]">COMPUTED FROM 26 ACTIVE TASKS</div>
          </div>
          <DeliveryHealthRing value={value} />
        </div>
      ) : (
        <div className="mt-3">
          <AnimatedNumber value={value} color="text-[#111111]" size="text-[28px]" />
        </div>
      )}
    </div>
  );
}

function DeliveryHealthRing({ value }: { value: number }) {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative flex h-24 w-24 items-center justify-center">
      <svg className="h-24 w-24 -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={radius} fill="none" stroke="rgba(52,68,95,0.12)" strokeWidth="5" />
        <motion.circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="#6ca956"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="font-sans text-[20px] font-semibold leading-none text-[#111111]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {value}
        </motion.span>
        <span className="font-mono text-[8px] text-[#999999]">/ 100</span>
      </div>
    </div>
  );
}

function AnimatedNumber({
  value,
  color,
  size
}: {
  value: number;
  color: string;
  size: string;
}) {
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    let start = 0;
    const step = Math.ceil(value / 30);
    const timer = window.setInterval(() => {
      start += step;
      if (start >= value) {
        setDisplayed(value);
        window.clearInterval(timer);
      } else {
        setDisplayed(start);
      }
    }, 30);

    return () => window.clearInterval(timer);
  }, [value]);

  return <span className={`font-display leading-none ${size} ${color}`}>{displayed}</span>;
}
