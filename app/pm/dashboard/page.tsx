"use client";

import { useEffect, useMemo, useState } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { animate, motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { useRoleGuard } from "@/hooks/useRoleGuard";
import { COUNT_UP_DURATION, EASE_EXPO, fadeSlideUp, pageContainer, ringDraw, slideInLeft, staggerContainer } from "@/lib/animations";
import { companyData, getTeamMemberById, projects, revenueTimeline, teamRoster } from "@/lib/mockData";
import { getStageRoute } from "@/lib/stageConfig";

type TrendTone = "cyan" | "amber" | "emerald" | "rose";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value);
}

function formatCompactCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1
  }).format(value);
}

function getToneColor(tone: TrendTone) {
  switch (tone) {
    case "amber":
      return "var(--amber)";
    case "emerald":
      return "var(--emerald)";
    case "rose":
      return "var(--rose)";
    default:
      return "var(--cyan)";
  }
}

function buildSparklinePath(values: number[], width = 80, height = 24) {
  if (values.length === 0) return "";

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  return values
    .map((value, index) => {
      const x = (index / (values.length - 1 || 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");
}

function buildSparklineArea(values: number[], width = 80, height = 24) {
  const line = buildSparklinePath(values, width, height);
  if (!line) return "";
  return `${line} L ${width} ${height} L 0 ${height} Z`;
}

function useAnimatedNumber(target: number, decimals = 0) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const controls = animate(0, target, {
      duration: COUNT_UP_DURATION,
      ease: EASE_EXPO,
      onUpdate: (latest: number) => setValue(latest)
    });

    return () => controls.stop();
  }, [target]);

  return Number(value.toFixed(decimals));
}

function TopMetricCard({
  label,
  value,
  subLabel,
  trendTone,
  sparklineValues,
  sparklineColor
}: {
  label: string;
  value: string;
  subLabel: string;
  trendTone: TrendTone;
  sparklineValues?: number[];
  sparklineColor?: string;
}) {
  const linePath = sparklineValues ? buildSparklinePath(sparklineValues) : "";
  const areaPath = sparklineValues ? buildSparklineArea(sparklineValues) : "";

  return (
    <motion.div variants={fadeSlideUp} className="glass glass-noise relative overflow-hidden rounded-xl px-5 py-5">
      <div className="font-mono text-[9px] tracking-[0.15em] text-[var(--text-muted)]">{label}</div>
      <div className="mt-3 font-title text-[44px] leading-none text-[var(--text-primary)]">{value}</div>
      <div className="mt-2 font-mono text-[10px]" style={{ color: getToneColor(trendTone) }}>
        {subLabel}
      </div>
      {sparklineValues && sparklineColor ? (
        <div className="mt-4">
          <svg width="80" height="24" viewBox="0 0 80 24" fill="none">
            <defs>
              <linearGradient id={`${label}-grad`} x1="0" y1="0" x2="0" y2="24">
                <stop offset="5%" stopColor={sparklineColor} stopOpacity="0.15" />
                <stop offset="95%" stopColor={sparklineColor} stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={areaPath} fill={`url(#${label}-grad)`} />
            <path d={linePath} stroke={sparklineColor} strokeWidth="1.5" fill="none" strokeLinecap="round" />
          </svg>
        </div>
      ) : null}
    </motion.div>
  );
}

function RevenueCard() {
  const value = useAnimatedNumber(companyData.monthlyRevenue);

  return (
    <TopMetricCard
      label="This month"
      value={formatCurrency(value)}
      subLabel="+14% vs last month"
      trendTone="emerald"
      sparklineValues={revenueTimeline.map((item) => item.revenue)}
      sparklineColor="#00e5cc"
    />
  );
}

function BurnCard() {
  const value = useAnimatedNumber(companyData.monthlyBurn);

  return (
    <TopMetricCard
      label="Going out"
      value={formatCurrency(value)}
      subLabel="+2.4% vs last month"
      trendTone="amber"
      sparklineValues={revenueTimeline.map((item) => item.expenses)}
      sparklineColor="#fbbf24"
    />
  );
}

function RunwayCard() {
  const months = useAnimatedNumber(companyData.cashRunway, 1);

  return (
    <motion.div variants={fadeSlideUp} className="glass glass-noise relative overflow-hidden rounded-xl px-5 py-5">
      <div className="font-mono text-[9px] tracking-[0.15em] text-[var(--text-muted)]">Runway</div>
      <div className="mt-3 flex items-end gap-2">
        <div className="font-title text-[44px] leading-none text-[var(--text-primary)]">{months.toFixed(1)}</div>
        <div className="pb-1 font-mono text-[13px] text-[var(--text-muted)]">months</div>
      </div>
      <div className="mt-3 flex items-center gap-2 font-mono text-[10px] text-[var(--emerald)]">
        <span
          className="h-[6px] w-[6px] rounded-full bg-[var(--emerald)]"
          style={{ boxShadow: "0 0 10px rgba(52,211,153,0.7)" }}
        />
        HEALTHY
      </div>
    </motion.div>
  );
}

function UtilizationCard() {
  const utilization = useAnimatedNumber(companyData.utilizationRate);
  const radius = 22;
  const circumference = 2 * Math.PI * radius;

  return (
    <motion.div variants={fadeSlideUp} className="glass glass-noise relative overflow-hidden rounded-xl px-5 py-5">
      <div className="font-mono text-[9px] tracking-[0.15em] text-[var(--text-muted)]">Team load</div>
      <div className="mt-3 flex items-center justify-between gap-4">
        <div>
          <div className="font-title text-[44px] leading-none text-[var(--amber)]">{utilization}%</div>
          <div className="mt-2 font-mono text-[10px] text-[var(--amber)]">Capacity pressure rising</div>
        </div>
        <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
          <circle cx="28" cy="28" r={radius} stroke="rgba(255,255,255,0.05)" strokeWidth="4" fill="none" />
          <motion.circle
            cx="28"
            cy="28"
            r={radius}
            stroke="var(--amber)"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            variants={ringDraw(circumference, companyData.utilizationRate)}
            initial="hidden"
            animate="show"
            style={{ transformOrigin: "50% 50%", rotate: -90, transformBox: "fill-box" }}
          />
        </svg>
      </div>
    </motion.div>
  );
}

function RevenueBurnChart() {
  return (
    <motion.div variants={fadeSlideUp} className="glass glass-noise relative mt-4 overflow-hidden rounded-xl px-6 py-6">
      <div className="font-mono text-[10px] tracking-[0.15em] text-[var(--text-muted)]">REVENUE vs BURN — 6 MONTHS</div>
      <div className="mt-5 h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={revenueTimeline}>
            <defs>
              <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00e5cc" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#00e5cc" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="burnGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#fb7185" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#fb7185" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area dataKey="revenue" stroke="#00e5cc" strokeWidth={2} fill="url(#revGrad)" dot={false} type="monotone" />
            <Area dataKey="expenses" stroke="#fb7185" strokeWidth={2} fill="url(#burnGrad)" dot={false} type="monotone" />
            <XAxis
              dataKey="month"
              stroke="rgba(255,255,255,0.15)"
              tick={{ fill: "rgba(120,120,145,1)", fontSize: 11, fontFamily: "var(--font-mono)" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              stroke="rgba(255,255,255,0.08)"
              tick={{ fill: "rgba(120,120,145,1)", fontSize: 10, fontFamily: "var(--font-mono)" }}
              tickFormatter={(value) => `$${(Number(value) / 1000).toFixed(0)}k`}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                background: "#0d0d0d",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 6,
                fontFamily: "var(--font-mono)",
                fontSize: 11
              }}
              labelStyle={{ color: "rgba(240,240,245,1)" }}
              itemStyle={{ color: "rgba(160,160,180,1)" }}
              formatter={(value) => formatCurrency(Number(value ?? 0))}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 flex items-center gap-6 font-mono text-[10px] text-[var(--text-muted)]">
        <div className="flex items-center gap-2">
          <span className="h-[6px] w-[6px] rounded-full bg-[var(--cyan)]" />
          Revenue
        </div>
        <div className="flex items-center gap-2">
          <span className="h-[6px] w-[6px] rounded-full bg-[var(--rose)]" />
          Burn
        </div>
      </div>
    </motion.div>
  );
}

function ProjectCard({ project, index }: { project: (typeof projects)[number]; index: number }) {
  const router = useRouter();
  const team = project.team
    .map((memberId) => getTeamMemberById(memberId))
    .filter((member): member is NonNullable<ReturnType<typeof getTeamMemberById>> => Boolean(member));

  const healthTone = project.health >= 80 ? "emerald" : project.health >= 60 ? "amber" : "rose";
  const healthLabel = project.health >= 80 ? "On track" : project.health >= 60 ? "Watch this" : "Needs attention";
  const fillColor = healthTone === "emerald" ? "var(--emerald)" : healthTone === "amber" ? "var(--amber)" : "var(--rose)";
  const clientGlass =
    project.clientColor === "violet" ? "glass-violet" : project.clientColor === "amber" ? "glass-amber" : "glass-blue";
  const healthGlass = healthTone === "emerald" ? "glass-emerald" : healthTone === "amber" ? "glass-amber" : "glass-rose";
  const shortBudget = formatCompactCurrency(project.budget).replace("K", "k");
  const shortDueDate = project.dueDate.split(" ")[0]?.toLowerCase() ?? project.dueDate;

  return (
    <motion.button
      type="button"
      variants={slideInLeft}
      onClick={() => router.push(getStageRoute(project.id, project.stageSlug))}
      className="glass glass-hover glass-noise relative block w-full overflow-hidden rounded-xl px-5 py-5 text-left"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className={`${clientGlass} flex h-8 w-8 items-center justify-center rounded-lg font-mono text-[11px]`}
            style={{ color: `var(--${project.clientColor})` }}
          >
            {project.clientInitials}
          </div>
          <div className="font-ui text-[12px] text-[var(--text-secondary)]">{project.client}</div>
        </div>
        <div className={`${healthGlass} inline-flex rounded-sm px-2 py-1 font-mono text-[9px] tracking-[0.12em]`} style={{ color: `var(--${healthTone})` }}>
          {healthLabel}
        </div>
      </div>

      <div className="mt-3 font-ui text-[15px] font-medium text-[var(--text-primary)]">{project.name}</div>
      <div className="mt-0.5 pr-10 font-ui text-[12px] text-[var(--text-muted)]">{project.description}</div>

      <div className="mt-3 flex flex-wrap gap-4 font-mono text-[9px] tracking-[0.12em] text-[var(--text-muted)]">
        <span>Sprint {project.sprint}</span>
        <span>{shortDueDate}</span>
        <span>{shortBudget}</span>
      </div>

      <div className="mt-3 h-[3px] rounded-full bg-[rgba(255,255,255,0.05)]">
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: project.completion / 100 }}
          transition={{ duration: 1.2, ease: EASE_EXPO, delay: 0.2 + index * 0.1 }}
          style={{ transformOrigin: "left", background: fillColor }}
          className="h-[3px] rounded-full"
        />
      </div>

      <div className="mt-3 flex items-center -space-x-2">
        {team.map((member) => (
          <div
            key={member.id}
            className="glass-sm flex h-6 w-6 items-center justify-center rounded-full border border-[rgba(0,0,0,0.4)] font-mono text-[9px] text-[var(--text-primary)]"
          >
            {member.avatar}
          </div>
        ))}
      </div>

      <ChevronRight size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
    </motion.button>
  );
}

function TeamRosterRow({ member }: { member: (typeof teamRoster)[number] }) {
  const tone: TrendTone = member.utilization > 90 ? "rose" : member.utilization >= 75 ? "amber" : "emerald";

  return (
    <motion.div variants={fadeSlideUp} className="glass-sm rounded-lg px-4 py-3">
      <div className="flex items-center gap-3">
        <div
          className={`${
            member.color === "violet"
              ? "glass-violet"
              : member.color === "blue"
                ? "glass-blue"
                : member.color === "emerald"
                  ? "glass-emerald"
                  : member.color === "amber"
                    ? "glass-amber"
                    : member.color === "rose"
                      ? "glass-rose"
                      : "glass-cyan"
          } flex h-8 w-8 items-center justify-center rounded-full font-mono text-[10px]`}
          style={{ color: `var(--${member.color})` }}
        >
          {member.avatar}
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate font-ui text-[13px] text-[var(--text-primary)]">{member.name}</div>
          <div className="font-mono text-[9px] tracking-[0.12em] text-[var(--text-muted)]">{member.role}</div>
        </div>
        <div className="w-20">
          <div className="flex items-center justify-end gap-2">
            <div className="h-[2px] flex-1 rounded bg-[rgba(255,255,255,0.05)]">
              <div
                className="h-[2px] rounded"
                style={{
                  width: `${member.utilization}%`,
                  background: getToneColor(tone)
                }}
              />
            </div>
            <div className="font-mono text-[9px]" style={{ color: getToneColor(tone) }}>
              {member.utilization}%
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function PmDashboardPage() {
  const { user, ready } = useRoleGuard("pm");
  const contractedTotal = useMemo(() => projects.reduce((total, project) => total + project.budget, 0), []);
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning, Sarah.";
    if (hour < 18) return "Good afternoon, Sarah.";
    return "Good evening, Sarah.";
  }, []);

  if (!ready || !user) {
    return (
      <div className="main-bg flex min-h-screen items-center justify-center font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
        Loading manager workspace...
      </div>
    );
  }

  return (
    <motion.div variants={pageContainer} initial="hidden" animate="show" className="relative z-10 mx-auto max-w-[1440px] px-8 py-6">
      <motion.div variants={fadeSlideUp} className="mb-6 flex items-center justify-between gap-4">
        <div className="font-title text-[18px] tracking-[0.12em] text-[var(--text-primary)]">ORCHESTRA</div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <div className="glass-cyan flex h-8 w-8 items-center justify-center rounded-full font-mono text-[11px] text-[var(--cyan)]">
            SC
          </div>
          <div className="font-ui text-[12px] text-[var(--text-secondary)]">Sarah Chen</div>
        </div>
      </motion.div>

      <motion.div variants={fadeSlideUp} className="mb-6 space-y-2">
        <div className="font-ui text-[22px] font-normal text-[var(--text-primary)]">{greeting}</div>
        <div className="font-mono text-[11px] tracking-[0.12em] text-[var(--text-muted)]">NovaCorp is at risk. It needs attention.</div>
      </motion.div>

      <motion.div variants={staggerContainer(0.08, 0.04)} initial="hidden" animate="show" className="grid gap-4 xl:grid-cols-4">
        <RevenueCard />
        <BurnCard />
        <RunwayCard />
        <UtilizationCard />
      </motion.div>

      <RevenueBurnChart />

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.55fr_1fr]">
        <motion.div variants={fadeSlideUp}>
          <div className="mb-4 font-mono text-[9px] tracking-[0.12em] text-[var(--text-muted)]">
            {projects.length} projects · {formatCompactCurrency(contractedTotal).replace("K", "k")} contracted
          </div>
          <motion.div variants={staggerContainer(0.08, 0.04)} initial="hidden" animate="show" className="space-y-3">
            {projects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </motion.div>
        </motion.div>

        <motion.div variants={fadeSlideUp}>
          <div className="mb-4 font-mono text-[9px] tracking-[0.12em] text-[var(--text-muted)]">
            {companyData.headcount} people
          </div>
          <motion.div variants={staggerContainer(0.06, 0.05)} initial="hidden" animate="show" className="space-y-2">
            {teamRoster.map((member) => (
              <TeamRosterRow key={member.id} member={member} />
            ))}
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
