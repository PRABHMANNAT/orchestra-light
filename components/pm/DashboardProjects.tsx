"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, Zap } from "lucide-react";
import { useRouter } from "next/navigation";

import { fadeSlideUp } from "@/lib/animations";
import { getTeamMemberById, projectFinancials, projects, teamRoster } from "@/lib/mockData";
import { financialKey, money, pct, Pill, Progress, type ProjectTab, type TeamFilter, type Tone } from "@/components/pm/dashboardShared";

const bloomfastBrainRoute = "/pm/bloomfast/brain";
const projectLaunchButtons = ["Open Project Bloomfast", "Open Project Herius", "Open Project Orion"] as const;

export function ProjectPortfolio({ activeTab, setActiveTab }: { activeTab: ProjectTab; setActiveTab: (tab: ProjectTab) => void }) {
  const [expandedId, setExpandedId] = useState(projects[0]?.id ?? "");
  const router = useRouter();
  const sorted = useMemo(() => {
    const list = [...projects];
    if (activeTab === "risk") return list.sort((a, b) => a.health - b.health);
    if (activeTab === "best") return list.sort((a, b) => b.health - a.health);
    if (activeTab === "deadline") return list.sort((a, b) => a.completion - b.completion);
    if (activeTab === "revenue") return list.sort((a, b) => b.budget - a.budget);
    return list;
  }, [activeTab]);

  return (
    <motion.section variants={fadeSlideUp} className="dashboard-section mt-6">
      <div className="dashboard-section-header mb-4">
        <div><div className="dashboard-eyebrow">Project Tracking</div><h2>Portfolio execution system</h2></div>
        <div className="dashboard-mini-tabs">
          {(["all", "risk", "best", "deadline", "revenue"] as ProjectTab[]).map((tab) => (
            <button key={tab} type="button" onClick={() => setActiveTab(tab)} className={activeTab === tab ? "is-active" : ""}>
              {tab === "risk" ? "High Risk" : tab === "best" ? "Best" : tab === "deadline" ? "Near Deadline" : tab === "revenue" ? "Revenue" : "All"}
            </button>
          ))}
        </div>
      </div>
      <div className="dashboard-project-launch-grid mb-4">
        {projectLaunchButtons.map((label) => (
          <button key={label} type="button" className="dashboard-project-launch-button" onClick={() => router.push(bloomfastBrainRoute)}>
            <span>{label}</span>
            <ChevronRight size={15} />
          </button>
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-3">
        {sorted.map((project) => {
          const financial = projectFinancials[financialKey(project.id)];
          const team = project.team.map((id) => getTeamMemberById(id)).filter((member): member is NonNullable<ReturnType<typeof getTeamMemberById>> => Boolean(member));
          const spendPct = (project.spent / project.budget) * 100;
          const tone: Tone = project.health >= 80 ? "emerald" : project.health >= 60 ? "amber" : "rose";
          const expanded = expandedId === project.id;
          return (
            <motion.article key={project.id} variants={fadeSlideUp} className="dashboard-project-card">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="dashboard-client-avatar">{project.clientInitials}</span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.13em] text-[var(--text-muted)]">{project.id === "bloomfast" ? "Jack - BloomFast" : project.client}</span>
                  </div>
                  <h3 className="mt-3 font-ui text-[17px] font-semibold text-[var(--text-primary)]">{project.name}</h3>
                  <p className="mt-2 min-h-[42px] font-ui text-[12px] leading-6 text-[var(--text-secondary)]">{project.description}</p>
                </div>
                <Pill tone={tone}>{project.health} health</Pill>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="dashboard-mini-metric"><span>Budget</span><strong>{money(project.budget)}</strong></div>
                <div className="dashboard-mini-metric"><span>Forecast margin</span><strong>{pct(financial.margin, 1)}</strong></div>
                <div className="dashboard-mini-metric"><span>Deadline</span><strong>{project.dueDate}</strong></div>
                <div className="dashboard-mini-metric"><span>Sprint</span><strong>{project.sprint}</strong></div>
              </div>
              <div className="mt-4 space-y-3">
                <div><div className="mb-1.5 flex justify-between font-mono text-[9px] uppercase tracking-[0.12em] text-[var(--text-muted)]"><span>Progress</span><span>{project.completion}%</span></div><Progress value={project.completion} tone={tone} /></div>
                <div><div className="mb-1.5 flex justify-between font-mono text-[9px] uppercase tracking-[0.12em] text-[var(--text-muted)]"><span>Spend vs planned</span><span>{pct(spendPct)}</span></div><Progress value={spendPct} tone={spendPct > 88 ? "rose" : spendPct > 62 ? "amber" : "emerald"} /></div>
              </div>
              <div className="mt-4 flex items-center justify-between gap-3">
                <div className="flex -space-x-2">{team.map((member) => <span key={member.id} className="dashboard-team-avatar" title={member.name}>{member.avatar}</span>)}</div>
                <div className="flex items-center gap-2">
                  <button type="button" className="dashboard-link-button" onClick={() => setExpandedId(expanded ? "" : project.id)}>{expanded ? "Collapse" : "Details"}</button>
                  <button type="button" className="dashboard-icon-button" onClick={() => router.push(bloomfastBrainRoute)} aria-label={`Open ${project.name}`}><ChevronRight size={15} /></button>
                </div>
              </div>
              <AnimatePresence initial={false}>
                {expanded ? (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                    <div className="dashboard-project-expanded">
                      <div className="dashboard-insight-row"><span>Owner</span><strong>{team[0]?.name ?? "Unassigned"}</strong></div>
                      <div className="dashboard-insight-row"><span>Projected spend</span><strong>{money(financial.projected)}</strong></div>
                      <div className="dashboard-insight-row"><span>Outstanding</span><strong>{money(financial.outstanding)}</strong></div>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </motion.article>
          );
        })}
      </div>
    </motion.section>
  );
}

export function TeamOptimization({ filter, setFilter }: { filter: TeamFilter; setFilter: (filter: TeamFilter) => void }) {
  const roster = teamRoster.filter((member) => {
    if (filter === "overloaded") return member.utilization >= 88;
    if (filter === "balanced") return member.utilization >= 70 && member.utilization < 88;
    if (filter === "available") return member.utilization < 70;
    return true;
  });

  return (
    <motion.section variants={fadeSlideUp} className="dashboard-section mt-6 pb-12">
      <div className="dashboard-section-header mb-4">
        <div><div className="dashboard-eyebrow">Team Optimization</div><h2>Workforce analytics</h2></div>
        <div className="dashboard-mini-tabs">
          {(["all", "overloaded", "balanced", "available"] as TeamFilter[]).map((item) => <button key={item} type="button" onClick={() => setFilter(item)} className={filter === item ? "is-active" : ""}>{item}</button>)}
        </div>
      </div>
      <div className="grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="dashboard-card space-y-3">
          {roster.map((member) => {
            const tone: Tone = member.utilization > 92 ? "rose" : member.utilization >= 82 ? "amber" : member.utilization >= 70 ? "emerald" : "cyan";
            return (
              <div key={member.id} className="dashboard-team-row">
                <div className="dashboard-team-avatar">{member.avatar}</div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div><div className="font-ui text-[13px] font-medium text-[var(--text-primary)]">{member.name}</div><div className="font-mono text-[9px] uppercase tracking-[0.12em] text-[var(--text-muted)]">{member.role}</div></div>
                    <Pill tone={tone}>{member.utilization > 92 ? "Overload" : member.utilization >= 82 ? "Watch" : "Balanced"}</Pill>
                  </div>
                  <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_120px] sm:items-center">
                    <Progress value={member.utilization} tone={tone} />
                    <div className="font-mono text-[10px] text-[var(--text-muted)]">{member.utilization}% used / {100 - member.utilization}% free</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="dashboard-card space-y-3">
          <div className="dashboard-section-header"><div><div className="dashboard-eyebrow">Action Queue</div><h2>Capacity moves</h2></div><Zap size={17} className="text-[var(--cyan)]" /></div>
          {[
            ["Freeze new engineering scope", "Mike and Liam are above safe utilization.", "rose"],
            ["Rebalance QA", "Anika can absorb NovaCorp regression checks.", "emerald"],
            ["Protect PM focus", "Sarah spans two active decision loops.", "amber"]
          ].map(([title, body, tone]) => <div key={title} className="dashboard-optimization-card"><Pill tone={tone as Tone}>{title}</Pill><p className="mt-2 font-ui text-[12px] leading-6 text-[var(--text-secondary)]">{body}</p></div>)}
        </div>
      </div>
    </motion.section>
  );
}
