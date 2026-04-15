"use client";

import type { ReactNode } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { motion } from "framer-motion";
import { Sparkles, X } from "lucide-react";

import { EASE_EXPO, fadeSlideUp } from "@/lib/animations";

export type Tone = "cyan" | "emerald" | "amber" | "rose" | "blue" | "violet";
export type KpiKey = "revenue" | "burn" | "margin" | "runway" | "utilization" | "projects" | "forecast" | "capacity" | "delivery" | "efficiency";
export type ProjectTab = "all" | "risk" | "best" | "deadline" | "revenue";
export type TeamFilter = "all" | "overloaded" | "balanced" | "available";

export type Kpi = {
  key: KpiKey;
  label: string;
  value: string;
  delta: string;
  tone: Tone;
  health: string;
  goal: number;
  goalLabel: string;
  context: string;
  values: number[];
};

export const ranges = ["7D", "30D", "90D", "6M", "12M"] as const;

export const expenseMix = [
  { month: "Nov", Engineering: 48, Design: 12, Ops: 9, Tools: 13 },
  { month: "Dec", Engineering: 51, Design: 12, Ops: 9, Tools: 13 },
  { month: "Jan", Engineering: 54, Design: 12, Ops: 9, Tools: 13 },
  { month: "Feb", Engineering: 52, Design: 11, Ops: 9, Tools: 14 },
  { month: "Mar", Engineering: 54, Design: 12, Ops: 10, Tools: 12 },
  { month: "Apr", Engineering: 55, Design: 12, Ops: 10, Tools: 12 }
];

export const scenario = [
  { month: "Apr", best: 8.9, expected: 8.4, worst: 7.8 },
  { month: "May", best: 9.2, expected: 8.1, worst: 7.1 },
  { month: "Jun", best: 9.6, expected: 7.9, worst: 6.5 },
  { month: "Jul", best: 10.1, expected: 8.2, worst: 6.2 },
  { month: "Aug", best: 10.8, expected: 8.7, worst: 6.0 },
  { month: "Sep", best: 11.4, expected: 9.1, worst: 5.8 }
];

export const activity = [24, 48, 72, 50, 88, 66, 34, 42, 75, 92, 56, 28, 64, 78, 82, 45, 38, 69, 96, 74, 51, 33, 58, 87, 91, 62, 44, 70];

export function money(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1
  }).format(value);
}

export function pct(value: number, decimals = 0) {
  return `${value.toFixed(decimals)}%`;
}

export function clamp(value: number) {
  return Math.max(0, Math.min(100, value));
}

export function toneColor(tone: Tone) {
  return `var(--${tone})`;
}

export function financialKey(projectId: string) {
  return projectId === "bloomfast" ? "p1" : projectId;
}

function sparkPath(values: number[], width = 96, height = 30) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  return values
    .map((value, index) => {
      const x = (index / (values.length - 1 || 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${index === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

export function Sparkline({ values, tone }: { values: number[]; tone: Tone }) {
  const path = sparkPath(values);

  return (
    <svg viewBox="0 0 96 30" className="h-[34px] w-[104px]" aria-hidden="true">
      <path d={`${path} L96,30 L0,30 Z`} fill={`var(--${tone}-dim)`} />
      <path d={path} fill="none" stroke={toneColor(tone)} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}

export function Pill({ children, tone }: { children: ReactNode; tone: Tone }) {
  return (
    <span className="dashboard-pill" style={{ color: toneColor(tone), borderColor: `var(--${tone}-border)`, background: `var(--${tone}-dim)` }}>
      {children}
    </span>
  );
}

export function Progress({ value, tone }: { value: number; tone: Tone }) {
  return (
    <div className="dashboard-progress-track">
      <motion.div
        className="dashboard-progress-fill"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: clamp(value) / 100 }}
        transition={{ duration: 0.9, ease: EASE_EXPO }}
        style={{ background: toneColor(tone) }}
      />
    </div>
  );
}

export function KpiCard({ item, onSelect }: { item: Kpi; onSelect: (item: Kpi) => void }) {
  return (
    <motion.button type="button" variants={fadeSlideUp} whileHover={{ y: -3 }} onClick={() => onSelect(item)} className="dashboard-card dashboard-kpi text-left">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="dashboard-eyebrow">{item.label}</div>
          <div className="mt-3 font-title text-[40px] leading-none text-[var(--text-primary)]">{item.value}</div>
        </div>
        <Sparkline values={item.values} tone={item.tone} />
      </div>
      <div className="mt-3 flex items-center justify-between gap-2">
        <span className="font-mono text-[10px]" style={{ color: toneColor(item.tone) }}>{item.delta}</span>
        <Pill tone={item.tone}>{item.health}</Pill>
      </div>
      <p className="mt-3 min-h-[40px] font-ui text-[12px] leading-5 text-[var(--text-secondary)]">{item.context}</p>
      <div className="mt-4 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.12em] text-[var(--text-muted)]">
        <span>{item.goalLabel}</span>
        <span>{Math.round(clamp(item.goal))}%</span>
      </div>
      <div className="mt-1.5">
        <Progress value={item.goal} tone={item.tone} />
      </div>
    </motion.button>
  );
}

export function KpiPanel({ item, onClose }: { item: Kpi; onClose: () => void }) {
  return (
    <motion.aside initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 24 }} className="dashboard-detail-panel">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="dashboard-eyebrow">Metric Drilldown</div>
          <div className="mt-2 font-title text-[42px] leading-none text-[var(--text-primary)]">{item.label}</div>
        </div>
        <button type="button" className="dashboard-icon-button" onClick={onClose} aria-label="Close metric panel">
          <X size={16} />
        </button>
      </div>
      <div className="mt-6 grid gap-3">
        {[
          ["Current", item.value],
          ["Movement", item.delta],
          ["Health", item.health],
          ["Benchmark", item.goalLabel]
        ].map(([label, value]) => (
          <div key={label} className="dashboard-insight-row">
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>
      <div className="mt-6 h-[190px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={item.values.map((value, index) => ({ point: `P${index + 1}`, value }))}>
            <defs>
              <linearGradient id={`detail-${item.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={toneColor(item.tone)} stopOpacity={0.25} />
                <stop offset="95%" stopColor={toneColor(item.tone)} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="var(--dashboard-chart-grid)" vertical={false} />
            <XAxis dataKey="point" tick={{ fill: "var(--text-muted)", fontSize: 10, fontFamily: "var(--font-mono)" }} axisLine={false} tickLine={false} />
            <YAxis hide domain={["dataMin", "dataMax"]} />
            <Area dataKey="value" type="monotone" stroke={toneColor(item.tone)} strokeWidth={2} fill={`url(#detail-${item.key})`} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-6 rounded-lg border border-[var(--dashboard-border)] bg-[var(--dashboard-soft)] p-4">
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--cyan)]">
          <Sparkles size={13} />
          Optimization read
        </div>
        <p className="mt-3 font-ui text-[13px] leading-6 text-[var(--text-secondary)]">
          {item.context} Track this in the weekly operating review and route exceptions before sprint lock.
        </p>
      </div>
    </motion.aside>
  );
}
