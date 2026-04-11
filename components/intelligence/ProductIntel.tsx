"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { animate, motion } from "framer-motion";
import { Area, AreaChart, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import {
  AlertTriangle,
  BarChart3,
  Calendar,
  CheckCircle2,
  CheckSquare,
  Clock,
  DollarSign,
  GitMerge,
  MessageCircle,
  MessageSquare,
  Plus,
  Sparkles,
  Users,
  type LucideIcon
} from "lucide-react";
import { toast } from "sonner";

import { StageShell } from "@/components/layout/StageShell";
import { OrchestraButton } from "@/components/shared/OrchestraButton";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { EASE_EXPO, fadeSlideUp, fadeSlideUpFast, pageContainer, progressFill, staggerContainer } from "@/lib/animations";
import {
  aiTaskQueue,
  getCommsThreadsForProject,
  getProjectFinancials,
  getProjectIntelData,
  getTeamForProject,
  newRBACTasks,
  projectFinancials
} from "@/lib/mockData";

type ChatMessage = { id: string; role: "user" | "assistant"; content: string };

const featureColors = {
  "Creator Onboarding": "#00e5cc",
  "Asset Marketplace": "#a78bfa",
  "Revenue & Payouts": "#60a5fa",
  "Creator Analytics": "#fbbf24",
  "Game Discovery": "#34d399"
} as const;

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

function useAnimatedValue(target: number, decimals = 0) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const controls = animate(0, target, {
      duration: 1.2,
      ease: EASE_EXPO,
      onUpdate: (latest) => setValue(latest)
    });

    return () => controls.stop();
  }, [target]);

  return Number(value.toFixed(decimals));
}

function MetricCard({
  label,
  value,
  suffix,
  valueColor,
  meta
}: {
  label: string;
  value: string;
  suffix?: string;
  valueColor?: string;
  meta: string;
}) {
  return (
    <motion.div variants={fadeSlideUp} className="glass glass-noise rounded-xl px-5 py-5">
      <div className="font-mono text-[9px] tracking-[0.15em] text-[var(--text-muted)]">{label}</div>
      <div className="mt-3 flex items-end gap-2">
        <div className="font-title text-[44px] leading-none" style={{ color: valueColor ?? "var(--text-primary)" }}>
          {value}
        </div>
        {suffix ? <div className="pb-1 font-mono text-[13px] text-[var(--text-muted)]">{suffix}</div> : null}
      </div>
      <div className="mt-2 font-mono text-[10px] text-[var(--text-muted)]">{meta}</div>
    </motion.div>
  );
}

function ContextRow({
  icon: Icon,
  iconColor,
  label
}: {
  icon: LucideIcon;
  iconColor: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-3 border-b border-[rgba(255,255,255,0.04)] py-2 last:border-b-0">
      <Icon size={14} className={iconColor} />
      <div className="flex-1 font-ui text-[12px] text-[var(--text-secondary)]">{label}</div>
      <CheckCircle2 size={12} className="text-[var(--emerald)]" />
    </div>
  );
}

function SectionDivider({ label }: { label: string }) {
  return (
    <motion.div variants={fadeSlideUp} className="relative py-2">
      <div className="h-px w-full bg-[rgba(255,255,255,0.04)]" />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="bg-transparent px-4 font-mono text-[9px] tracking-[0.15em] text-[var(--text-muted)]">{label}</span>
      </div>
    </motion.div>
  );
}

function isImpactPrompt(value: string) {
  const normalized = value.toLowerCase();
  return (
    normalized.includes("analyse this client message") ||
    normalized.includes("analyze this client message") ||
    normalized.includes("impact analysis") ||
    normalized.includes("analyse jack") ||
    normalized.includes("analyze jack")
  );
}

function isImpactMessage(content: string) {
  return content.toUpperCase().includes("IMPACT ANALYSIS");
}

function buildImpactResponse() {
  return [
    "IMPACT ANALYSIS",
    "Jack added a Pro subscription with 80/20 revenue share and priority placement.",
    "Three delivery flows are affected: creator tiers, payouts, and discovery ranking.",
    "Seven tasks are stale, nine new tasks are needed, and the current plan slips by two weeks.",
    "Draft reply is ready."
  ].join("\n\n");
}

function ImpactAnalysisCard({
  analysis,
  onUpdateTasks
}: {
  analysis?: {
    affectedFlows: number;
    milestonesShift: number;
    tasksOutdated: number;
    newTasksNeeded: number;
    timeline: string;
    budget: string;
    breaksMvp: string;
    draftReply: string;
  };
  onUpdateTasks: () => void;
}) {
  const timestamp = "Now";
  const resolvedAnalysis = analysis ?? {
    affectedFlows: 3,
    milestonesShift: 2,
    tasksOutdated: 7,
    newTasksNeeded: 9,
    timeline: "+2 weeks",
    budget: "+$4,200",
    breaksMvp: "yes",
    draftReply:
      "Jack — we can pull the Pro subscription into V1, but it changes payout logic, creator tiers, and discovery placement. Current estimate is +2 weeks and +$4,200. If you want the original date preserved, we should move premium placement to V2."
  };

  return (
    <div className="glass-amber rounded-xl px-5 py-5">
      <div className="mb-4 flex items-center gap-2">
        <AlertTriangle size={12} strokeWidth={1.5} className="text-[var(--amber)]" />
        <span className="font-mono text-[9px] tracking-[0.12em] text-[var(--amber)]">IMPACT ANALYSIS</span>
        <span className="ml-auto font-mono text-[9px] text-[var(--text-muted)]">{timestamp}</span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {[
          { icon: GitMerge, color: "var(--cyan)", label: "affected flows", value: `${resolvedAnalysis.affectedFlows}` },
          { icon: Calendar, color: "var(--amber)", label: "milestones shift", value: `${resolvedAnalysis.milestonesShift}` },
          { icon: AlertTriangle, color: "var(--amber)", label: "tasks outdated", value: `${resolvedAnalysis.tasksOutdated}` },
          { icon: Plus, color: "var(--cyan)", label: "new tasks needed", value: `${resolvedAnalysis.newTasksNeeded}` },
          { icon: Clock, color: "var(--amber)", label: "timeline", value: resolvedAnalysis.timeline },
          { icon: DollarSign, color: "var(--amber)", label: "budget", value: resolvedAnalysis.budget },
          { icon: AlertTriangle, color: "var(--rose)", label: "breaks MVP", value: resolvedAnalysis.breaksMvp },
          { icon: MessageSquare, color: "var(--violet)", label: "draft reply", value: "ready" }
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="glass-sm rounded-lg px-3 py-2.5">
              <div className="flex items-center gap-2">
                <Icon size={10} strokeWidth={1.5} style={{ color: item.color }} />
                <span className="font-mono text-[8px] tracking-[0.1em] text-[var(--text-muted)]">{item.label}</span>
              </div>
              <div className="mt-2 font-ui text-[12px] font-medium text-[var(--text-primary)]">{item.value}</div>
            </div>
          );
        })}
      </div>

      <div className="mt-4">
        <div className="mb-2 font-mono text-[8px] tracking-[0.1em] text-[var(--text-muted)]">DRAFT CLIENT REPLY</div>
        <div className="glass-sm rounded-xl px-4 py-3 font-ui text-[12px] italic leading-6 text-[var(--text-secondary)]">
          {resolvedAnalysis.draftReply}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <OrchestraButton variant="primary" size="sm" onClick={onUpdateTasks}>
          Update tasks
        </OrchestraButton>
        <OrchestraButton variant="secondary" size="sm">
          Sync Jira
        </OrchestraButton>
        <OrchestraButton variant="ghost" size="sm">
          Defer to V2
        </OrchestraButton>
      </div>
    </div>
  );
}

export function ProductIntel({ projectId }: { projectId: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [taskQueue, setTaskQueue] = useState(aiTaskQueue);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const financials = getProjectFinancials(projectId) ?? projectFinancials.p1;
  const intel = getProjectIntelData(projectId) ?? getProjectIntelData("p1");
  const team = getTeamForProject(projectId);
  const recentThreads = getCommsThreadsForProject(projectId);

  const velocity = intel.velocity[intel.velocity.length - 1]?.points ?? 0;
  const tasksCompleted = 12;
  const budgetSpentPct = Math.round((financials.spent / financials.budget) * 100);
  const daysRemaining = 54;
  const outstandingDelta = financials.budget - financials.projected;

  const suggestionPrompts = [
    "What's blocking delivery right now?",
    "Summarise Jack's latest requests",
    "Are we on track to hit the budget?",
    "Who's overloaded on this project?",
    "What did Jack say about the subscription?",
    "Draft a standup update for today"
  ];

  const systemPrompt = useMemo(
    () => `You are Socrates, an AI project intelligence assistant built into Orchestra — a delivery management platform for software agencies.

You have full context on the following project:
Project: Creator Marketplace V1
Client: Jack — Tempest AI (AI-native no-code game creation platform)
PM: Sarah Chen | Dev Lead: Mike Torres | Dev: Priya Kapoor
Sprint: 3 of 6 | Completion: 61% | Health: 74%
Budget: $85,000 | Spent: $51,000 | Projected: $82,400 (under budget)

Key blockers:
1. Stripe Connect: awaiting Jack's ABN and banking verification
2. AI recommendation engine: deferred — insufficient player data

Recent client communications:
- Jack requested $29/month Pro subscription with 80/20 revenue split (+2 weeks)
- Jack wants tag-based discovery (not just categories)
- Jack wants week-on-week earnings comparison on creator dashboard

Epics: Creator Onboarding (87%), Asset Marketplace (72%), Revenue & Payouts (51%), Creator Analytics (44%), Game Discovery (68%)

You are direct, precise, and technical. You speak like a senior PM who has read every document. No fluff. Bullet points when listing. Short when short is enough. Long only when the question demands it.
Never say you're an AI or refer to your training data.
Address the user as Sarah.`,
    []
  );

  const sendMessage = async (rawInput?: string) => {
    const content = (rawInput ?? input).trim();
    if (!content || isLoading) return;

    const apiKey = process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY;
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setIsLoading(true);

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    if (isImpactPrompt(content)) {
      setMessages([
        ...nextMessages,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: buildImpactResponse()
        }
      ]);
      setIsLoading(false);
      return;
    }

    if (!apiKey) {
      setMessages([
        ...nextMessages,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: "Anthropic API key missing. Set NEXT_PUBLIC_ANTHROPIC_API_KEY to enable Socrates in the browser."
        }
      ]);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "anthropic-version": "2023-06-01",
          "x-api-key": apiKey
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: systemPrompt,
          messages: nextMessages.map((message) => ({
            role: message.role,
            content: [{ type: "text", text: message.content }]
          }))
        })
      });

      if (!response.ok) {
        throw new Error(`Anthropic returned ${response.status}`);
      }

      const payload = await response.json();
      const assistantText =
        payload?.content
          ?.filter((item: { type?: string; text?: string }) => item?.type === "text")
          .map((item: { text?: string }) => item.text ?? "")
          .join("\n\n") ?? "No response returned.";

      setMessages([
        ...nextMessages,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: assistantText
        }
      ]);
    } catch (error) {
      setMessages([
        ...nextMessages,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content:
            error instanceof Error ? `I couldn't reach Socrates right now: ${error.message}` : "I couldn't reach Socrates right now."
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const animatedBudget = useAnimatedValue(financials.budget);
  const animatedSpent = useAnimatedValue(financials.spent);
  const animatedProjected = useAnimatedValue(financials.projected);

  const addImpactTasks = () => {
    setTaskQueue((current) => {
      const existingIds = new Set(current.map((task) => task.id));
      const additions = newRBACTasks.filter((task) => !existingIds.has(task.id));
      return [...current, ...additions];
    });
    window.dispatchEvent(new CustomEvent("orchestra-rbac-added"));
    toast.success("9 tasks added to queue");
  };

  return (
    <StageShell showGrid>
      <motion.div variants={pageContainer} initial="hidden" animate="show" className="mx-auto max-w-7xl space-y-6 px-8 py-8">
        <SectionHeader
          label="Intel"
          title="ASK ANYTHING."
          subtitle="Socrates has read everything. Just ask."
          accentColor="var(--amber)"
        />

        <div className="grid h-[520px] gap-6 xl:grid-cols-[0.7fr_1.3fr]">
          <motion.div variants={fadeSlideUp} className="glass-violet glass-noise h-full rounded-xl px-4 py-5">
            <div className="mb-4 font-mono text-[10px] tracking-[0.15em] text-[var(--violet)]">What Socrates can see</div>
            <div className="space-y-1">
              <ContextRow icon={GitMerge} iconColor="text-[var(--violet)]" label="Everything Jack gave us (5 docs)" />
              <ContextRow icon={MessageCircle} iconColor="text-[var(--blue)]" label={`What Jack is saying (${recentThreads.length} threads)`} />
              <ContextRow icon={Users} iconColor="text-[var(--cyan)]" label={`Team (${team.length} people)`} />
              <ContextRow icon={DollarSign} iconColor="text-[var(--amber)]" label="Budget and burn" />
              <ContextRow icon={BarChart3} iconColor="text-[var(--cyan)]" label="Delivery metrics" />
              <ContextRow icon={CheckSquare} iconColor="text-[var(--emerald)]" label={`Task board (${taskQueue.length} tasks)`} />
            </div>
          </motion.div>

          <motion.div variants={fadeSlideUp} className="glass-heavy glass-noise flex h-full flex-col overflow-hidden rounded-xl">
            <div className="flex items-center gap-3 border-b border-[rgba(255,255,255,0.05)] px-5 py-3.5">
              <div className="glass-violet flex h-8 w-8 items-center justify-center rounded-lg">
                <Sparkles size={16} className="text-[var(--violet)]" />
              </div>
              <div className="font-ui text-[14px] font-medium text-[var(--text-primary)]">SOCRATES</div>
              <button
                type="button"
                onClick={() => setMessages([])}
                className="ml-auto font-mono text-[9px] tracking-[0.12em] text-[var(--text-muted)] transition-colors hover:text-[var(--rose)]"
              >
                CLEAR
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              {messages.length === 0 ? (
                <motion.div variants={staggerContainer(0.05, 0.02)} initial="hidden" animate="show" className="flex h-full flex-col items-start justify-center gap-3">
                  {suggestionPrompts.map((prompt) => (
                    <motion.button
                      key={prompt}
                      type="button"
                      variants={fadeSlideUpFast}
                      onClick={() => setInput(prompt)}
                      className="glass-sm rounded-lg px-3 py-2.5 text-left font-ui text-[11px] text-[var(--text-secondary)] transition-all hover:border-[var(--violet-border)] hover:text-[var(--violet)]"
                    >
                      {prompt}
                    </motion.button>
                  ))}
                </motion.div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => {
                    const isAssistant = message.role === "assistant";

                    return (
                      <div key={message.id} className={`flex ${isAssistant ? "justify-start" : "justify-end"}`}>
                        <div className="max-w-[78%]">
                          <div className={`mb-1 font-mono text-[9px] tracking-[0.12em] ${isAssistant ? "text-[var(--violet)]" : "text-right text-[var(--text-muted)]"}`}>
                            {isAssistant ? "Socrates" : "SARAH CHEN"}
                          </div>
                          {isAssistant && isImpactMessage(message.content) ? (
                            <ImpactAnalysisCard analysis={recentThreads[0]?.socratesAnalysis} onUpdateTasks={addImpactTasks} />
                          ) : (
                            <div className={`${isAssistant ? "glass-violet" : "glass-sm"} rounded-xl px-4 py-3 font-ui text-[13px] leading-6 text-[var(--text-primary)]`}>
                              {message.content}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {isLoading ? (
                    <div className="flex justify-start">
                      <div className="glass-violet rounded-xl px-4 py-3">
                        <div className="flex items-center gap-2">
                          {[0, 1, 2].map((index) => (
                            <motion.div
                              key={index}
                              className="h-2 w-2 rounded-full bg-[var(--violet)]"
                              animate={{ y: [0, -4, 0] }}
                              transition={{ duration: 0.6, repeat: Infinity, delay: index * 0.15 }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              )}
            </div>

            <div className="border-t border-[rgba(255,255,255,0.05)] px-5 py-4">
              <textarea
                ref={textareaRef}
                value={input}
                rows={1}
                onChange={(event) => {
                  setInput(event.target.value);
                  const element = event.currentTarget;
                  element.style.height = "auto";
                  element.style.height = `${Math.min(element.scrollHeight, 112)}px`;
                }}
                onKeyDown={(event) => {
                  if ((event.metaKey && event.key === "Enter") || (event.key === "Enter" && !event.shiftKey)) {
                    event.preventDefault();
                    void sendMessage();
                  }
                }}
                className="max-h-[112px] w-full resize-none bg-transparent font-ui text-[13px] text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)]"
                placeholder="Ask anything."
              />
              <div className="mt-3 flex items-center justify-between gap-3">
                <div className="font-mono text-[9px] tracking-[0.12em] text-[var(--text-muted)]">Cmd+Enter to send</div>
                <OrchestraButton variant="secondary" size="sm" isLoading={isLoading} onClick={() => void sendMessage()}>
                  Ask Socrates
                </OrchestraButton>
              </div>
            </div>
          </motion.div>
        </div>

        <SectionDivider label="DELIVERY" />

        <motion.div variants={staggerContainer(0.08, 0.04)} initial="hidden" animate="show" className="grid gap-4 xl:grid-cols-4">
          <MetricCard label="Sprint velocity" value={`${velocity}`} suffix="pts" valueColor="var(--cyan)" meta="+21% vs sprint 1" />
          <MetricCard label="Tasks completed" value={`${tasksCompleted} / 20`} meta="Sprint 3 of 6" />
          <MetricCard label="Budget health" value={`${budgetSpentPct}%`} valueColor="var(--amber)" meta="of budget spent · on track" />
          <MetricCard label="Days remaining" value={`${daysRemaining}`} meta="to Jun delivery" />
        </motion.div>

        <div className="grid gap-4 xl:grid-cols-2">
          <motion.div variants={fadeSlideUp} className="glass glass-noise rounded-xl px-6 py-5">
            <div className="mb-4 font-mono text-[10px] tracking-[0.15em] text-[var(--text-muted)]">Sprint velocity</div>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={intel.velocity}>
                  <defs>
                    <linearGradient id="velocityGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00e5cc" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#00e5cc" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area
                    dataKey="points"
                    type="monotone"
                    stroke="var(--cyan)"
                    strokeWidth={2}
                    fill="url(#velocityGrad)"
                    dot={{ fill: "#00e5cc", r: 3, strokeWidth: 0 }}
                    activeDot={{ r: 5, fill: "#00e5cc" }}
                  />
                  <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fill: "rgba(120,120,145,1)", fontSize: 11, fontFamily: "var(--font-mono)" }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "rgba(120,120,145,1)", fontSize: 10, fontFamily: "var(--font-mono)" }} />
                  <Tooltip
                    contentStyle={{ background: "#0d0d0d", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6 }}
                    labelStyle={{ color: "rgba(240,240,245,1)", fontFamily: "var(--font-mono)", fontSize: 11 }}
                    itemStyle={{ color: "rgba(160,160,180,1)", fontFamily: "var(--font-mono)", fontSize: 11 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div variants={fadeSlideUp} className="glass glass-noise rounded-xl px-6 py-5">
            <div className="mb-4 font-mono text-[10px] tracking-[0.15em] text-[var(--text-muted)]">Sprint burndown</div>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={intel.burndown}>
                  <Line type="monotone" dataKey="remaining" stroke="var(--violet)" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="ideal" stroke="var(--amber)" strokeWidth={1.5} dot={false} strokeDasharray="4 4" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "rgba(120,120,145,1)", fontSize: 11, fontFamily: "var(--font-mono)" }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "rgba(120,120,145,1)", fontSize: 10, fontFamily: "var(--font-mono)" }} />
                  <Tooltip
                    contentStyle={{ background: "#0d0d0d", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6 }}
                    labelStyle={{ color: "rgba(240,240,245,1)", fontFamily: "var(--font-mono)", fontSize: 11 }}
                    itemStyle={{ color: "rgba(160,160,180,1)", fontFamily: "var(--font-mono)", fontSize: 11 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        <motion.div variants={fadeSlideUp} className="glass glass-noise rounded-xl px-6 py-5">
          <div className="mb-4 font-mono text-[10px] tracking-[0.15em] text-[var(--text-muted)]">Feature progress over time</div>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={intel.featureProgress}>
                <defs>
                  {Object.entries(featureColors).map(([name, color]) => (
                    <linearGradient key={name} id={`feature-${name}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={color} stopOpacity={0.08} />
                      <stop offset="95%" stopColor={color} stopOpacity={0} />
                    </linearGradient>
                  ))}
                </defs>
                {Object.entries(featureColors).map(([name, color]) => (
                  <Area
                    key={name}
                    dataKey={name}
                    type="monotone"
                    stroke={color}
                    strokeWidth={1.5}
                    fill={`url(#feature-${name})`}
                    dot={false}
                    activeDot={{ r: 4, fill: color }}
                  />
                ))}
                <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fill: "rgba(120,120,145,1)", fontSize: 11, fontFamily: "var(--font-mono)" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "rgba(120,120,145,1)", fontSize: 10, fontFamily: "var(--font-mono)" }} />
                <Tooltip
                  contentStyle={{ background: "#0d0d0d", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6 }}
                  labelStyle={{ color: "rgba(240,240,245,1)", fontFamily: "var(--font-mono)", fontSize: 11 }}
                  itemStyle={{ color: "rgba(160,160,180,1)", fontFamily: "var(--font-mono)", fontSize: 11 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex flex-wrap gap-5 font-mono text-[10px] text-[var(--text-muted)]">
            {Object.entries(featureColors).map(([name, color]) => (
              <div key={name} className="flex items-center gap-2">
                <span className="h-[6px] w-[6px] rounded-full" style={{ background: color }} />
                {name}
              </div>
            ))}
          </div>
        </motion.div>

        <SectionDivider label="FINANCES" />

        <motion.div variants={staggerContainer(0.08, 0.04)} initial="hidden" animate="show" className="grid gap-4 xl:grid-cols-3">
          <motion.div variants={fadeSlideUp} className="glass-cyan glass-noise rounded-xl px-5 py-5">
            <div className="font-mono text-[9px] tracking-[0.15em] text-[var(--text-muted)]">Total budget</div>
            <div className="mt-3 font-title text-[44px] leading-none text-[var(--text-primary)]">{formatCurrency(animatedBudget)}</div>
            <div className="mt-2 font-mono text-[10px] text-[var(--cyan)]">{budgetSpentPct}% spent</div>
            <div className="mt-3 h-[3px] rounded-full bg-[rgba(255,255,255,0.05)]">
              <motion.div variants={progressFill(budgetSpentPct)} initial="hidden" animate="show" className="h-[3px] rounded-full bg-[var(--cyan)]" style={{ transformOrigin: "left" }} />
            </div>
          </motion.div>

          <motion.div variants={fadeSlideUp} className="glass-amber glass-noise rounded-xl px-5 py-5">
            <div className="font-mono text-[9px] tracking-[0.15em] text-[var(--text-muted)]">Spent to date</div>
            <div className="mt-3 font-title text-[44px] leading-none text-[var(--text-primary)]">{formatCurrency(animatedSpent)}</div>
            <div className="mt-2 font-mono text-[10px] text-[var(--amber)]">36 days of work logged</div>
          </motion.div>

          <motion.div variants={fadeSlideUp} className="glass-emerald glass-noise rounded-xl px-5 py-5">
            <div className="font-mono text-[9px] tracking-[0.15em] text-[var(--text-muted)]">Projected final</div>
            <div className="mt-3 font-title text-[44px] leading-none text-[var(--text-primary)]">{formatCurrency(animatedProjected)}</div>
            <div className="mt-2 font-mono text-[10px] text-[var(--emerald)]">{formatCurrency(Math.abs(outstandingDelta))} under budget</div>
          </motion.div>
        </motion.div>

        <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
          <motion.div variants={fadeSlideUp} className="glass glass-noise rounded-xl px-6 py-5">
            <div className="mb-4 font-mono text-[10px] tracking-[0.15em] text-[var(--text-muted)]">Weekly burn rate</div>
            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={financials.weeklyBurn.map((burn, index) => ({
                    week: `W${index + 1}`,
                    burn
                  }))}
                >
                  <defs>
                    <linearGradient id="burnRateGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#fb7185" stopOpacity={0.12} />
                      <stop offset="95%" stopColor="#fb7185" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="burn" stroke="var(--rose)" strokeWidth={2} fill="url(#burnRateGrad)" dot={false} />
                  <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fill: "rgba(120,120,145,1)", fontSize: 11, fontFamily: "var(--font-mono)" }} />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) => `$${(Number(value) / 1000).toFixed(0)}k`}
                    tick={{ fill: "rgba(120,120,145,1)", fontSize: 10, fontFamily: "var(--font-mono)" }}
                  />
                  <Tooltip
                    contentStyle={{ background: "#0d0d0d", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6 }}
                    labelStyle={{ color: "rgba(240,240,245,1)", fontFamily: "var(--font-mono)", fontSize: 11 }}
                    itemStyle={{ color: "rgba(160,160,180,1)", fontFamily: "var(--font-mono)", fontSize: 11 }}
                    formatter={(value) => formatCurrency(Number(value ?? 0))}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div variants={fadeSlideUp} className="glass glass-noise rounded-xl px-6 py-5">
            <div className="mb-4 font-mono text-[10px] tracking-[0.15em] text-[var(--text-muted)]">Budget allocation</div>
            {financials.budgetAllocation.map((allocation, index) => {
              const color =
                allocation.category === "Engineering"
                  ? "var(--cyan)"
                  : allocation.category === "Design"
                    ? "var(--violet)"
                    : allocation.category === "QA"
                      ? "var(--amber)"
                      : "var(--blue)";
              const pct = Math.round((allocation.spent / allocation.allocated) * 100);

              return (
                <div key={allocation.category} className="mb-4 last:mb-0">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <div className="font-ui text-[12px] text-[var(--text-primary)]">{allocation.category}</div>
                    <div className="font-mono text-[10px] text-[var(--text-muted)]">
                      {formatCompactCurrency(allocation.spent)} / {formatCompactCurrency(allocation.allocated)}
                    </div>
                  </div>
                  <div className="h-1 rounded-full bg-[rgba(255,255,255,0.05)]">
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: allocation.spent / allocation.allocated }}
                      transition={{ duration: 1, ease: EASE_EXPO, delay: index * 0.1 }}
                      style={{ transformOrigin: "left", background: color }}
                      className="h-1 rounded-full"
                    />
                  </div>
                  <div className="mt-1 font-mono text-[9px]" style={{ color }}>
                    {pct}%
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>

        <motion.div variants={fadeSlideUp} className="glass rounded-xl px-6 py-5">
          <div className="mb-4 font-mono text-[10px] tracking-[0.15em] text-[var(--text-muted)]">Payment milestones</div>
          <div className="relative mt-8">
            <div className="absolute left-0 right-0 top-8 h-px bg-[rgba(255,255,255,0.06)]" />
            <div className="grid gap-4 md:grid-cols-4">
              {financials.milestones.map((milestone, index) => (
                <div key={milestone.name} className={`relative ${index % 2 === 0 ? "pb-16" : "pt-16"}`}>
                  <div
                    className={`absolute left-1/2 top-8 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full ${milestone.paid ? "bg-[var(--emerald)]" : "border border-[rgba(255,255,255,0.2)] bg-transparent"}`}
                    style={milestone.paid ? { boxShadow: "0 0 8px rgba(52,211,153,0.8)" } : undefined}
                  />
                  <div className={`text-center ${index % 2 === 0 ? "" : "absolute left-0 right-0 top-0"}`}>
                    <div className="font-mono text-[9px] tracking-[0.12em] text-[var(--text-muted)]">{milestone.name}</div>
                    <div className="mt-1 font-ui text-[13px] text-[var(--text-primary)]">{formatCurrency(milestone.value)}</div>
                    <div className={`mt-1 font-mono text-[8px] tracking-[0.12em] ${milestone.paid ? "text-[var(--emerald)]" : "text-[var(--amber)]"}`}>
                      {milestone.paid ? "PAID" : `DUE ${milestone.due}`}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 font-mono text-[10px] tracking-[0.12em] text-[var(--text-muted)]">
            INVOICED: {formatCurrency(financials.invoiced)} · OUTSTANDING: <span className="text-[var(--amber)]">{formatCurrency(financials.outstanding)}</span>
          </div>
        </motion.div>
      </motion.div>
    </StageShell>
  );
}
