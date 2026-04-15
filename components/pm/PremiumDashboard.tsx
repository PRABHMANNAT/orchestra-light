"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { DeepAnalytics, Header, MainCharts, OptimizationPanel, SmartSummary } from "@/components/pm/DashboardAnalytics";
import { ProjectPortfolio, TeamOptimization } from "@/components/pm/DashboardProjects";
import { KpiCard, KpiPanel, money, pct, ranges, scenario, type Kpi, type ProjectTab, type TeamFilter } from "@/components/pm/dashboardShared";
import { useRoleGuard } from "@/hooks/useRoleGuard";
import { pageContainer, staggerContainer } from "@/lib/animations";
import { companyData, projects, revenueTimeline, teamRoster } from "@/lib/mockData";

export function PremiumDashboard() {
  const { user, ready } = useRoleGuard("pm");
  const [range, setRange] = useState<(typeof ranges)[number]>("6M");
  const [search, setSearch] = useState("");
  const [selectedKpi, setSelectedKpi] = useState<Kpi | null>(null);
  const [projectTab, setProjectTab] = useState<ProjectTab>("all");
  const [teamFilter, setTeamFilter] = useState<TeamFilter>("all");

  const chartData = useMemo(() => revenueTimeline.map((item, index) => ({
    month: item.month,
    revenue: Math.round(item.revenue / 1000),
    burn: Math.round(item.expenses / 1000),
    profit: Math.round((item.revenue - item.expenses) / 1000),
    forecast: Math.round((item.revenue + [6000, 7000, 9000, 14000, 16000, 19000][index]) / 1000),
    previous: Math.round((item.revenue * [0.89, 0.91, 0.92, 0.9, 0.93, 0.94][index]) / 1000)
  })), []);

  const metrics = useMemo<Kpi[]>(() => {
    const prevRevenue = revenueTimeline[revenueTimeline.length - 2]?.revenue ?? companyData.monthlyRevenue;
    const prevBurn = revenueTimeline[revenueTimeline.length - 2]?.expenses ?? companyData.monthlyBurn;
    const margin = ((companyData.monthlyRevenue - companyData.monthlyBurn) / companyData.monthlyRevenue) * 100;
    const avgHealth = projects.reduce((total, project) => total + project.health, 0) / projects.length;
    const avgUtil = teamRoster.reduce((total, member) => total + member.utilization, 0) / teamRoster.length;
    const overload = teamRoster.filter((member) => member.utilization >= 88).length;

    return [
      {
        key: "revenue",
        label: "Revenue",
        value: money(companyData.monthlyRevenue),
        delta: `+${pct(((companyData.monthlyRevenue - prevRevenue) / prevRevenue) * 100, 1)} vs prev`,
        tone: "cyan",
        health: "ahead",
        goal: 92,
        goalLabel: "Goal: $135K",
        context: "Milestone invoices and Elara expansion lift top-line movement.",
        values: revenueTimeline.map((item) => item.revenue)
      },
      {
        key: "burn",
        label: "Burn",
        value: money(companyData.monthlyBurn),
        delta: `+${pct(((companyData.monthlyBurn - prevBurn) / prevBurn) * 100, 1)} vs prev`,
        tone: "amber",
        health: "watch",
        goal: 94,
        goalLabel: "Guardrail: $95K",
        context: "Burn is controlled, but engineering load is concentrated.",
        values: revenueTimeline.map((item) => item.expenses)
      },
      {
        key: "margin",
        label: "Net Margin",
        value: pct(margin, 1),
        delta: "+3.8 pts",
        tone: "emerald",
        health: "near goal",
        goal: 94,
        goalLabel: "Benchmark: 30%",
        context: "Profitability improves if NovaCorp overrun is capped.",
        values: chartData.map((item) => item.profit)
      },
      {
        key: "runway",
        label: "Runway",
        value: `${companyData.cashRunway.toFixed(1)} mo`,
        delta: "+0.6 mo",
        tone: "blue",
        health: "stable",
        goal: 93,
        goalLabel: "Goal: 9 mo",
        context: "Stable runway with upside if milestone invoicing pulls forward.",
        values: scenario.map((item) => item.expected)
      },
      {
        key: "utilization",
        label: "Utilization",
        value: `${Math.round(avgUtil)}%`,
        delta: "+4 pts",
        tone: "amber",
        health: "pressure",
        goal: avgUtil,
        goalLabel: "Target: 78%",
        context: "High utilization is profitable but raises delivery risk.",
        values: teamRoster.map((member) => member.utilization)
      },
      {
        key: "projects",
        label: "Active Projects",
        value: `${projects.length}`,
        delta: "1 at risk",
        tone: "violet",
        health: "focused",
        goal: 60,
        goalLabel: "Capacity: 5",
        context: "NovaCorp is the main execution exception.",
        values: projects.map((project) => project.completion)
      },
      {
        key: "forecast",
        label: "Forecast Confidence",
        value: "87%",
        delta: "+5 pts",
        tone: "cyan",
        health: "strong",
        goal: 87,
        goalLabel: "Benchmark: 90%",
        context: "Source-of-truth updates improve forecast trust.",
        values: [72, 75, 78, 80, 82, 87]
      },
      {
        key: "capacity",
        label: "Capacity Pressure",
        value: `${overload} flags`,
        delta: "+1 flag",
        tone: "rose",
        health: "rebalance",
        goal: 72,
        goalLabel: "Goal: 0 flags",
        context: "Overload can be reduced through QA and backend rebalance.",
        values: [1, 1, 2, 2, 3, overload]
      },
      {
        key: "delivery",
        label: "Delivery Score",
        value: `${Math.round(avgHealth)}`,
        delta: "-4 pts",
        tone: "amber",
        health: "watch",
        goal: (avgHealth / 85) * 100,
        goalLabel: "Target: 85",
        context: "Portfolio health is held down by one enterprise migration.",
        values: projects.map((project) => project.health)
      },
      {
        key: "efficiency",
        label: "Cash Efficiency",
        value: `${(companyData.monthlyRevenue / companyData.monthlyBurn).toFixed(2)}x`,
        delta: "+0.12x",
        tone: "emerald",
        health: "healthy",
        goal: 100,
        goalLabel: "Benchmark: 1.35x",
        context: "Revenue per dollar of burn is above benchmark.",
        values: chartData.map((item) => item.revenue / item.burn)
      }
    ];
  }, [chartData]);

  if (!ready || !user) {
    return <div className="main-bg flex min-h-screen items-center justify-center font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--text-muted)]">Loading manager workspace...</div>;
  }

  return (
    <main className="dashboard-shell min-h-screen">
      <motion.div variants={pageContainer} initial="hidden" animate="show" className="relative z-10 mx-auto max-w-[1520px] px-5 py-6 sm:px-8">
        <Header range={range} setRange={(value) => setRange(value as (typeof ranges)[number])} search={search} setSearch={setSearch} />
        <SmartSummary />
        <motion.section variants={staggerContainer(0.04, 0.02)} initial="hidden" animate="show" className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {metrics.map((item) => <KpiCard key={item.key} item={item} onSelect={setSelectedKpi} />)}
        </motion.section>
        <MainCharts data={chartData} />
        <DeepAnalytics data={chartData} range={range} />
        <OptimizationPanel />
        <ProjectPortfolio activeTab={projectTab} setActiveTab={setProjectTab} />
        <TeamOptimization filter={teamFilter} setFilter={setTeamFilter} />
      </motion.div>
      <AnimatePresence>{selectedKpi ? <KpiPanel item={selectedKpi} onClose={() => setSelectedKpi(null)} /> : null}</AnimatePresence>
    </main>
  );
}
