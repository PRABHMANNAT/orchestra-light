"use client";

import {
  Area,
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { motion } from "framer-motion";
import { AlertTriangle, BarChart3, BrainCircuit, CalendarDays, ChevronRight, Filter, Gauge, Search, Settings2, Sparkles, Target, TrendingUp, Users, WalletCards } from "lucide-react";
import { useRouter } from "next/navigation";

import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { fadeSlideUp, staggerContainer } from "@/lib/animations";
import { projects, teamRoster } from "@/lib/mockData";
import { activity, expenseMix, money, Pill, Progress, ranges, scenario, toneColor, type Tone } from "@/components/pm/dashboardShared";
import { cn } from "@/lib/utils";

type ChartPoint = { month: string; revenue: number; burn: number; profit: number; forecast: number; previous: number };

const bloomfastBrainRoute = "/pm/bloomfast/brain";
const projectLaunchButtons = ["Open Project BloomFast", "Open Project Herclues", "Open Project Saturn"] as const;

export function Header({
  range,
  setRange,
  search,
  setSearch
}: {
  range: string;
  setRange: (value: string) => void;
  search: string;
  setSearch: (value: string) => void;
}) {
  const router = useRouter();

  return (
    <motion.header variants={fadeSlideUp} className="dashboard-header">
      <div className="flex flex-col gap-5 2xl:flex-row 2xl:items-end 2xl:justify-between">
        <div className="max-w-4xl">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <Pill tone="emerald">Live portfolio telemetry</Pill>
            <Pill tone="amber">2 teams near overload</Pill>
            <Pill tone="rose">NovaCorp delivery risk</Pill>
          </div>
          <div className="font-ui text-[15px] text-[var(--text-secondary)]">Good afternoon, Sarah.</div>
          <h1 className="mt-2 font-title text-[72px] leading-none text-[var(--text-primary)]">Agency Command Center</h1>
          <p className="mt-4 max-w-3xl font-ui text-[15px] leading-7 text-[var(--text-secondary)]">
            Revenue is ahead of burn, but utilization risk is concentrated in engineering. Stabilize NovaCorp, protect runway, and shift capacity before the next sprint locks.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="dashboard-search">
            <Search size={15} className="text-[var(--text-muted)]" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search project, owner, risk..." />
          </div>
          <ThemeToggle />
          <div className="dashboard-avatar">SC</div>
        </div>
      </div>
      <div className="dashboard-project-launch-grid mt-5">
        {projectLaunchButtons.map((label) => (
          <button key={label} type="button" className="dashboard-project-launch-button" onClick={() => router.push(bloomfastBrainRoute)}>
            <span>{label}</span>
            <ChevronRight size={15} />
          </button>
        ))}
      </div>
      <div className="dashboard-filter-bar">
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--text-muted)]">
          <Filter size={13} />
          Filters
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {ranges.map((item) => (
            <button key={item} type="button" onClick={() => setRange(item)} className={cn("dashboard-range-button", range === item ? "is-active" : "")}>
              {item}
            </button>
          ))}
        </div>
        {["All teams", "All projects", "Global", "All departments"].map((item) => (
          <button key={item} type="button" className="dashboard-select-button">{item}</button>
        ))}
        <button type="button" className="dashboard-action-button">
          <Settings2 size={13} />
          Optimize plan
        </button>
      </div>
    </motion.header>
  );
}

export function SmartSummary() {
  const items = [
    { icon: TrendingUp, label: "Burn is rising slower than revenue", value: "+14% revenue / +2.4% burn", tone: "emerald" as Tone },
    { icon: AlertTriangle, label: "Delivery risk concentrated", value: "1 high-risk project", tone: "rose" as Tone },
    { icon: Gauge, label: "Runway stable", value: "8.4 months", tone: "cyan" as Tone },
    { icon: Users, label: "Capacity pressure", value: "3 people above 88%", tone: "amber" as Tone }
  ];

  return (
    <motion.div variants={staggerContainer(0.05, 0.02)} initial="hidden" animate="show" className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <motion.div key={item.label} variants={fadeSlideUp} className="dashboard-summary-tile">
          <div className="dashboard-summary-icon" style={{ color: toneColor(item.tone), background: `var(--${item.tone}-dim)`, borderColor: `var(--${item.tone}-border)` }}>
            <item.icon size={15} />
          </div>
          <div>
            <div className="font-ui text-[13px] font-medium text-[var(--text-primary)]">{item.label}</div>
            <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em]" style={{ color: toneColor(item.tone) }}>{item.value}</div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

export function MainCharts({ data }: { data: ChartPoint[] }) {
  const tooltip = {
    background: "var(--dashboard-tooltip-bg)",
    border: "1px solid var(--dashboard-border)",
    borderRadius: 8,
    color: "var(--text-primary)",
    fontFamily: "var(--font-mono)",
    fontSize: 11,
    boxShadow: "var(--dashboard-shadow)"
  };

  return (
    <section className="mt-6 grid gap-5 2xl:grid-cols-[minmax(0,1.45fr)_minmax(360px,0.55fr)]">
      <motion.div variants={fadeSlideUp} className="dashboard-card dashboard-chart-card">
        <div className="dashboard-section-header">
          <div>
            <div className="dashboard-eyebrow">Financial Command</div>
            <h2>Revenue, burn, profit, forecast</h2>
          </div>
          <Pill tone="cyan">Forecast confidence 87%</Pill>
        </div>
        <div className="dashboard-chart-tall">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data}>
              <defs>
                <linearGradient id="dashProfit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--emerald)" stopOpacity={0.24} />
                  <stop offset="95%" stopColor="var(--emerald)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="var(--dashboard-chart-grid)" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: "var(--text-muted)", fontSize: 11, fontFamily: "var(--font-mono)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "var(--text-muted)", fontSize: 10, fontFamily: "var(--font-mono)" }} tickFormatter={(value) => `$${Number(value)}k`} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltip} formatter={(value) => `$${Number(value)}k`} />
              <Area name="Profit" dataKey="profit" type="monotone" fill="url(#dashProfit)" stroke="var(--emerald)" strokeWidth={2} dot={false} />
              <Line name="Revenue" dataKey="revenue" type="monotone" stroke="var(--cyan)" strokeWidth={3} dot={false} />
              <Line name="Burn" dataKey="burn" type="monotone" stroke="var(--rose)" strokeWidth={2.5} dot={false} />
              <Line name="Forecast" dataKey="forecast" type="monotone" stroke="var(--blue)" strokeWidth={2} strokeDasharray="6 5" dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <div className="dashboard-legend">
          {["Revenue", "Burn", "Profit", "Forecast"].map((label, index) => (
            <span key={label}><i style={{ background: ["var(--cyan)", "var(--rose)", "var(--emerald)", "var(--blue)"][index] }} />{label}</span>
          ))}
        </div>
      </motion.div>

      <div className="grid gap-5">
        <motion.div variants={fadeSlideUp} className="dashboard-card">
          <div className="dashboard-section-header">
            <div><div className="dashboard-eyebrow">Expense Mix</div><h2>Cost type breakdown</h2></div>
            <Pill tone="emerald">Tools down 4%</Pill>
          </div>
          <div className="dashboard-chart-medium">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={expenseMix}>
                <CartesianGrid stroke="var(--dashboard-chart-grid)" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: "var(--text-muted)", fontSize: 10, fontFamily: "var(--font-mono)" }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip contentStyle={tooltip} formatter={(value) => `$${Number(value)}K`} />
                <Bar dataKey="Engineering" stackId="a" fill="var(--cyan)" radius={[0, 0, 4, 4]} />
                <Bar dataKey="Design" stackId="a" fill="var(--blue)" />
                <Bar dataKey="Ops" stackId="a" fill="var(--amber)" />
                <Bar dataKey="Tools" stackId="a" fill="var(--rose)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div variants={fadeSlideUp} className="dashboard-card">
          <div className="dashboard-section-header">
            <div><div className="dashboard-eyebrow">Scenario Simulation</div><h2>Runway best / expected / worst</h2></div>
          </div>
          <div className="dashboard-chart-medium">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={scenario}>
                <CartesianGrid stroke="var(--dashboard-chart-grid)" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: "var(--text-muted)", fontSize: 10, fontFamily: "var(--font-mono)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "var(--text-muted)", fontSize: 10, fontFamily: "var(--font-mono)" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltip} formatter={(value) => `${value} mo`} />
                <Line dataKey="best" stroke="var(--emerald)" strokeWidth={2} dot={false} />
                <Line dataKey="expected" stroke="var(--cyan)" strokeWidth={3} dot={false} />
                <Line dataKey="worst" stroke="var(--rose)" strokeWidth={2} strokeDasharray="5 5" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export function DeepAnalytics({ data, range }: { data: ChartPoint[]; range: string }) {
  const maxSpent = Math.max(...projects.map((project) => project.spent));
  const allocationTotal = projects.reduce((total, project) => total + project.budget, 0);

  return (
    <section className="mt-6 grid gap-5 xl:grid-cols-2 2xl:grid-cols-4">
      <motion.div variants={fadeSlideUp} className="dashboard-card">
        <div className="dashboard-section-header">
          <div><div className="dashboard-eyebrow">Workload Heatmap</div><h2>Person / week pressure</h2></div>
          <Pill tone="amber">3 overload flags</Pill>
        </div>
        <div className="dashboard-heatmap">
          <div />
          {["W1", "W2", "W3", "W4", "W5", "W6"].map((week) => <div key={week} className="dashboard-heatmap-label">{week}</div>)}
          {teamRoster.map((member, row) => (
            <div key={member.id} className="contents">
              <div className="dashboard-heatmap-name">{member.avatar}</div>
              {["W1", "W2", "W3", "W4", "W5", "W6"].map((week, col) => {
                const value = Math.max(0, Math.min(100, member.utilization + [-12, -5, 2, 8, -3, 5][col] + row));
                return <div key={`${member.id}-${week}`} className="dashboard-heatmap-cell" style={{ background: value > 92 ? "var(--rose)" : value > 82 ? "var(--amber)" : "var(--cyan)", opacity: 0.3 + value / 140 }}>{Math.round(value)}</div>;
              })}
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div variants={fadeSlideUp} className="dashboard-card">
        <div className="dashboard-section-header">
          <div><div className="dashboard-eyebrow">Budget Allocation</div><h2>Project allocation</h2></div>
          <WalletCards size={17} className="text-[var(--text-muted)]" />
        </div>
        <div className="space-y-4">
          {projects.map((project) => {
            const tone: Tone = project.riskLevel === "high" ? "rose" : project.riskLevel === "medium" ? "amber" : "emerald";
            return (
              <div key={project.id}>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span className="truncate font-ui text-[13px] text-[var(--text-primary)]">{project.name}</span>
                  <span className="font-mono text-[10px] text-[var(--text-muted)]">{money(project.budget)}</span>
                </div>
                <Progress value={(project.budget / allocationTotal) * 100} tone={tone} />
              </div>
            );
          })}
        </div>
      </motion.div>

      <motion.div variants={fadeSlideUp} className="dashboard-card">
        <div className="dashboard-section-header">
          <div><div className="dashboard-eyebrow">Highest Burn</div><h2>Project ranking</h2></div>
          <BarChart3 size={17} className="text-[var(--text-muted)]" />
        </div>
        <div className="space-y-4">
          {[...projects].sort((a, b) => b.spent - a.spent).map((project) => (
            <div key={project.id}>
              <div className="mb-2 flex items-center justify-between gap-3">
                <span className="truncate font-ui text-[13px] text-[var(--text-primary)]">{project.name}</span>
                <span className="font-mono text-[10px] text-[var(--text-muted)]">{money(project.spent)}</span>
              </div>
              <Progress value={(project.spent / maxSpent) * 100} tone={project.riskLevel === "high" ? "rose" : project.riskLevel === "medium" ? "amber" : "emerald"} />
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div variants={fadeSlideUp} className="dashboard-card">
        <div className="dashboard-section-header">
          <div><div className="dashboard-eyebrow">Activity Tracking</div><h2>Operating cadence</h2></div>
          <CalendarDays size={17} className="text-[var(--text-muted)]" />
        </div>
        <div className="dashboard-calendar-grid">
          {activity.map((value, index) => (
            <div key={index} className="dashboard-calendar-cell" title={`Day ${index + 1}: ${value}`} style={{ background: value > 80 ? "var(--cyan)" : value > 60 ? "var(--emerald)" : value > 42 ? "var(--amber)" : "var(--dashboard-soft)" }}>
              {index + 1}
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div variants={fadeSlideUp} className="dashboard-card 2xl:col-span-2">
        <div className="dashboard-section-header">
          <div><div className="dashboard-eyebrow">Comparison Mode</div><h2>Current period vs previous</h2></div>
          <Pill tone="cyan">{range}</Pill>
        </div>
        <div className="dashboard-chart-medium">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid stroke="var(--dashboard-chart-grid)" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: "var(--text-muted)", fontSize: 10, fontFamily: "var(--font-mono)" }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip contentStyle={{ background: "var(--dashboard-tooltip-bg)", border: "1px solid var(--dashboard-border)", borderRadius: 8 }} formatter={(value) => `$${Number(value)}k`} />
              <Bar name="Previous" dataKey="previous" fill="var(--dashboard-soft-strong)" radius={[4, 4, 0, 0]} />
              <Bar name="Current" dataKey="revenue" fill="var(--cyan)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <motion.div variants={fadeSlideUp} className="dashboard-card 2xl:col-span-2">
        <div className="dashboard-section-header">
          <div><div className="dashboard-eyebrow">Pipeline Funnel</div><h2>Delivery stage health</h2></div>
          <Target size={17} className="text-[var(--text-muted)]" />
        </div>
        <div className="space-y-3">
          {[
            ["Brief accepted", 100, "cyan"],
            ["Prototype active", 78, "blue"],
            ["Build in motion", 61, "emerald"],
            ["Review-ready", 42, "amber"],
            ["Launch cleared", 24, "rose"]
          ].map(([label, value, tone]) => (
            <div key={label} className="dashboard-funnel-row">
              <div className="dashboard-funnel-bar" style={{ width: `${value}%`, background: `linear-gradient(90deg, var(--${tone}), transparent)` }}><span>{label}</span></div>
              <strong>{value}%</strong>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

export function OptimizationPanel() {
  const items = [
    ["Move QA support into NovaCorp", "Anika has available capacity and can reduce regression risk this week.", "emerald"],
    ["Cap lead engineering allocation", "Mike is at 100%. Freeze new scope until BloomFast decisions settle.", "rose"],
    ["Pull Elara milestone invoice", "Prototype milestone is near completion and can improve May cash flow.", "cyan"]
  ];

  return (
    <motion.section variants={fadeSlideUp} className="dashboard-optimization mt-6">
      <div className="dashboard-section-header">
        <div><div className="dashboard-eyebrow">Optimization System</div><h2>Recommended operating moves</h2></div>
        <BrainCircuit size={18} className="text-[var(--cyan)]" />
      </div>
      <div className="grid gap-3 xl:grid-cols-3">
        {items.map(([title, body, tone]) => (
          <div key={title} className="dashboard-optimization-card">
            <Pill tone={tone as Tone}>{title}</Pill>
            <p className="mt-3 font-ui text-[13px] leading-6 text-[var(--text-secondary)]">{body}</p>
          </div>
        ))}
      </div>
    </motion.section>
  );
}
