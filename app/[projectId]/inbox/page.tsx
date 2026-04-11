"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Hash,
  Headphones,
  Inbox,
  GitBranch,
  Mail,
  MessageCircle,
  Sparkles
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { chipBounce, EASE_EXPO, fadeSlideUp, fadeSlideUpFast, pageContainer, slideInLeft, staggerContainer } from "@/lib/animations";
import { StageShell } from "@/components/layout/StageShell";
import { OrchestraButton } from "@/components/shared/OrchestraButton";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { getCommsThreadsForProject, type CommsThreadRecord } from "@/lib/mockData";

type PlatformFilter = "all" | "slack" | "whatsapp" | "email" | "discord";
type ConversionState = "idle" | "converting" | "done";

type PendingNode = {
  id: string;
  title: string;
  type: "changed";
  source: "inbox";
};

type TaskQueueItem = {
  id: string;
  title: string;
  source: string;
  threadId: string;
  status: "todo";
};

const FILTERS: PlatformFilter[] = ["all", "slack", "whatsapp", "email", "discord"];

const platformMeta = {
  slack: { label: "Slack", color: "rgba(167,139,250,0.8)", icon: Hash },
  whatsapp: { label: "WhatsApp", color: "rgba(52,211,153,0.8)", icon: MessageCircle },
  email: { label: "Email", color: "rgba(96,165,250,0.8)", icon: Mail },
  discord: { label: "Discord", color: "rgba(167,139,250,0.8)", icon: Headphones }
} as const;

function readStoredTasks() {
  if (typeof window === "undefined") return [] as TaskQueueItem[];
  try {
    const raw = window.localStorage.getItem("orchestra_task_queue");
    if (!raw) return [];
    const parsed = JSON.parse(raw) as TaskQueueItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeStoredTasks(tasks: TaskQueueItem[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem("orchestra_task_queue", JSON.stringify(tasks));
}

function readPendingNodes() {
  if (typeof window === "undefined") return [] as PendingNode[];
  try {
    const raw = window.localStorage.getItem("orchestra_pending_nodes");
    if (!raw) return [];
    const parsed = JSON.parse(raw) as PendingNode[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writePendingNodes(nodes: PendingNode[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem("orchestra_pending_nodes", JSON.stringify(nodes));
}

function platformName(platform: CommsThreadRecord["platform"]) {
  return platformMeta[platform].label;
}

function senderInitials(sender: string) {
  if (sender.toLowerCase() === "jack") return "JT";
  return sender.slice(0, 1).toUpperCase();
}

export default function InboxPage() {
  const params = useParams<{ projectId: string }>();
  const router = useRouter();
  const projectId = typeof params?.projectId === "string" ? params.projectId : "p1";
  const [threads, setThreads] = useState<CommsThreadRecord[]>(() => getCommsThreadsForProject(projectId));
  const [activeFilter, setActiveFilter] = useState<PlatformFilter>("all");
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [conversionState, setConversionState] = useState<ConversionState>("idle");
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    setThreads(getCommsThreadsForProject(projectId));
    setActiveThreadId(null);
    setConversionState("idle");
    setCountdown(3);
  }, [projectId]);

  useEffect(() => {
    if (conversionState !== "done") {
      setCountdown(3);
      return;
    }

    const countdownTimer = window.setInterval(() => {
      setCountdown((current) => (current > 0 ? current - 1 : 0));
    }, 1000);

    const navigationTimer = window.setTimeout(() => {
      router.push(`/${projectId}/flow`);
    }, 3000);

    return () => {
      window.clearInterval(countdownTimer);
      window.clearTimeout(navigationTimer);
    };
  }, [conversionState, projectId, router]);

  const visibleThreads = useMemo(() => {
    if (activeFilter === "all") return threads;
    return threads.filter((thread) => thread.platform === activeFilter);
  }, [activeFilter, threads]);

  const activeThread = useMemo(
    () => threads.find((thread) => thread.id === activeThreadId) ?? null,
    [activeThreadId, threads]
  );

  const summaryBullets = useMemo(() => {
    if (!activeThread) return [];
    return [
      `Channel: ${platformName(activeThread.platform)} · ${activeThread.channel}`,
      activeThread.actionable ? "This request is concrete enough to scope." : "This thread is context, not a task.",
      activeThread.actionable
        ? "Recommended: run impact analysis before committing."
        : "Recommended: keep this as background context."
    ];
  }, [activeThread]);

  const handleSelectThread = (threadId: string) => {
    setActiveThreadId(threadId);
    setConversionState("idle");
    setCountdown(3);
    setThreads((current) =>
      current.map((thread) => (thread.id === threadId ? { ...thread, unread: false } : thread))
    );
  };

  const handleIgnore = () => {
    if (!activeThread) return;
    setThreads((current) =>
      current.map((thread) =>
        thread.id === activeThread.id ? { ...thread, actionable: false, unread: false } : thread
      )
    );
    setConversionState("idle");
  };

  const handleAskSocrates = () => {
    if (!activeThread) return;
    const latestMessage = activeThread.messages[activeThread.messages.length - 1];
    const prompt = `Analyse this client message: ${latestMessage?.text ?? activeThread.extractedAction}`;
    window.localStorage.setItem("orchestra_socrates_prompt", prompt);
    router.push(`/pm/${projectId}/intel`);
  };

  const handleConvert = () => {
    if (!activeThread) return;

    setConversionState("converting");

    const storedTasks = readStoredTasks();
    const nextTask: TaskQueueItem = {
      id: `task-${activeThread.id}`,
      title: activeThread.extractedAction,
      source: activeThread.channel,
      threadId: activeThread.id,
      status: "todo"
    };

    const dedupedTasks = [...storedTasks.filter((task) => task.threadId !== activeThread.id), nextTask];
    writeStoredTasks(dedupedTasks);

    const storedPending = readPendingNodes();
    const pendingNode: PendingNode = {
      id: `n-rbac-${Date.now()}`,
      title: activeThread.extractedAction,
      type: "changed",
      source: "inbox"
    };
    writePendingNodes([...storedPending, pendingNode]);

    window.setTimeout(() => {
      setConversionState("done");
    }, 800);
  };

  return (
    <StageShell showGrid>
      <motion.div variants={pageContainer} initial="hidden" animate="show" className="mx-auto max-w-[1600px] px-8 py-8">
        <SectionHeader
          label="inbox"
          title="WHAT IS THE CLIENT SAYING?"
          subtitle="Every channel. One feed. Nothing missed."
          accentColor="var(--blue)"
        />

        <div className="grid h-[calc(100vh-120px)] gap-6 xl:grid-cols-[28%_44%_28%]">
          <motion.div variants={fadeSlideUp} className="flex min-h-0 flex-col">
            <motion.div variants={staggerContainer(0.04, 0.04)} initial="hidden" animate="show" className="mb-4 flex flex-wrap gap-2">
              {FILTERS.map((filter) => (
                <motion.button
                  key={filter}
                  variants={chipBounce}
                  type="button"
                  onClick={() => setActiveFilter(filter)}
                  className={
                    activeFilter === filter
                      ? "glass-blue rounded-md border border-[rgba(96,165,250,0.25)] px-3 py-1.5 font-mono text-[10px] text-[var(--blue)]"
                      : "glass-sm rounded-md px-3 py-1.5 font-mono text-[10px] text-[var(--text-muted)] transition-all hover:border-[rgba(255,255,255,0.1)] hover:text-[var(--text-secondary)]"
                  }
                >
                  {filter.toUpperCase()}
                </motion.button>
              ))}
            </motion.div>

            <motion.div variants={staggerContainer(0.05, 0.06)} initial="hidden" animate="show" className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
              {visibleThreads.map((thread) => (
                <motion.div
                  key={thread.id}
                  variants={slideInLeft}
                  className={`glass glass-hover glass-noise relative overflow-hidden rounded-xl px-4 py-3.5 ${
                    activeThread?.id === thread.id ? "border-[rgba(96,165,250,0.3)] bg-[rgba(96,165,250,0.04)]" : ""
                  }`}
                >
                  {thread.unread ? (
                    <span className="absolute right-3 top-3 h-[6px] w-[6px] rounded-full bg-[var(--blue)] shadow-[0_0_6px_rgba(96,165,250,0.8)]" />
                  ) : null}
                  <button
                    type="button"
                    onClick={() => handleSelectThread(thread.id)}
                    className="relative z-10 block w-full text-left"
                  >
                    <div className="mb-1 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className="h-[5px] w-[5px] rounded-full"
                          style={{ background: platformMeta[thread.platform].color }}
                        />
                        <span className="font-mono text-[10px] tracking-[0.08em] text-[var(--text-muted)]">
                          {thread.channel}
                        </span>
                      </div>
                      <span className="font-mono text-[9px] text-[var(--text-muted)]">{thread.timestamp}</span>
                    </div>
                    <div
                      className={`mb-2 truncate font-ui text-[12px] ${
                        thread.unread ? "font-medium text-[var(--text-primary)]" : "text-[var(--text-secondary)]"
                      }`}
                    >
                      {thread.preview}
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        {thread.actionable ? (
                          <span className="rounded-[2px] border border-[rgba(251,191,36,0.25)] bg-[rgba(251,191,36,0.06)] px-1.5 py-0.5 font-mono text-[8px] tracking-[0.1em] text-[var(--amber)]">
                            ACTION
                          </span>
                        ) : null}
                      </div>
                      <span className="font-mono text-[9px] text-[var(--text-muted)]">
                        {thread.participants.length} people
                      </span>
                    </div>
                  </button>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div variants={fadeSlideUp} className="glass glass-noise flex min-h-0 flex-col overflow-hidden rounded-xl">
            {activeThread ? (
              <>
                <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.05)] px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    {(() => {
                      const Icon = platformMeta[activeThread.platform].icon;
                      return <Icon size={14} strokeWidth={1.5} style={{ color: platformMeta[activeThread.platform].color }} />;
                    })()}
                    <span className="font-ui text-[13px] font-medium text-[var(--text-primary)]">
                      {activeThread.channel}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {activeThread.participants.map((participant) => (
                      <span
                        key={participant}
                        className="glass-sm rounded-[3px] px-2 py-1 font-mono text-[9px] text-[var(--text-muted)]"
                      >
                        {participant}
                      </span>
                    ))}
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeThread.id}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8, transition: { duration: 0.15 } }}
                    transition={{ duration: 0.3, ease: EASE_EXPO }}
                    className="flex min-h-0 flex-1 flex-col"
                  >
                    <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
                      {activeThread.messages.map((message, index) => {
                        const isJack = message.sender.toLowerCase() === "jack";
                        return (
                          <motion.div
                            key={`${activeThread.id}-${message.sender}-${message.time}-${index}`}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.24, delay: index * 0.06 }}
                            className={isJack ? "flex flex-row-reverse items-start gap-3" : "flex items-start gap-3"}
                          >
                            <div
                              className={
                                isJack
                                  ? "glass-cyan flex h-7 w-7 items-center justify-center rounded-xl font-mono text-[10px] text-[var(--cyan)]"
                                  : "flex h-7 w-7 items-center justify-center rounded-xl border border-[rgba(96,165,250,0.2)] bg-[rgba(96,165,250,0.1)] font-mono text-[10px] text-[var(--blue)]"
                              }
                            >
                              {senderInitials(message.sender)}
                            </div>
                            <div className={isJack ? "flex max-w-[82%] flex-col items-end text-right" : "flex max-w-[82%] flex-col"}>
                              <div className="mb-1 flex items-baseline gap-2">
                                <span className={`font-mono text-[9px] ${isJack ? "text-[var(--cyan)]" : "text-[var(--blue)]"}`}>
                                  {message.sender}
                                </span>
                                <span className="font-mono text-[9px] text-[var(--text-muted)]">{message.time}</span>
                              </div>
                              <div className={isJack ? "glass-sm rounded-xl px-4 py-3" : "glass-blue rounded-xl px-4 py-3"}>
                                <div className="font-ui text-[13px] leading-[1.55] text-[var(--text-primary)]">
                                  {message.text}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>

                    <div className="border-t border-[rgba(255,255,255,0.05)] px-5 py-4 text-center">
                      <div className="font-mono text-[9px] tracking-[0.08em] text-[var(--text-muted)]">
                        Reply directly in {platformName(activeThread.platform)}
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </>
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-3">
                <Inbox size={28} strokeWidth={1.5} className="text-[rgba(96,165,250,0.3)]" />
                <div className="font-ui text-[14px] text-[var(--text-muted)]">Pick a conversation.</div>
                <div className="font-ui text-[13px] text-[var(--text-muted)] opacity-60">
                  Orchestra will flag anything that needs action.
                </div>
              </div>
            )}
          </motion.div>

          <motion.div variants={fadeSlideUp} className="flex min-h-0 flex-col gap-4 overflow-y-auto">
            {activeThread ? (
              <>
                {activeThread.actionable ? (
                  <div className="glass-amber glass-noise relative overflow-hidden rounded-xl px-5 py-5">
                    <div className="mb-3 flex items-center gap-2">
                      <AlertTriangle size={12} strokeWidth={1.5} className="text-[var(--amber)]" />
                      <span className="font-mono text-[9px] tracking-[0.15em] text-[var(--amber)]">
                        ACTION DETECTED
                      </span>
                    </div>

                    <div className="mb-4 border-l-2 border-[rgba(251,191,36,0.4)] pl-3">
                      <div className="font-ui text-[13px] italic leading-[1.55] text-[var(--text-primary)]">
                        {activeThread.extractedAction}
                      </div>
                    </div>

                    <AnimatePresence mode="wait">
                      {conversionState === "idle" ? (
                        <motion.div
                          key="idle"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex flex-col gap-2"
                        >
                          <OrchestraButton variant="primary" size="sm" fullWidth onClick={handleConvert}>
                            Convert to actionable
                          </OrchestraButton>
                          <OrchestraButton variant="secondary" size="sm" fullWidth onClick={handleAskSocrates}>
                            Ask Socrates
                          </OrchestraButton>
                          <OrchestraButton variant="ghost" size="sm" fullWidth onClick={handleIgnore}>
                            Ignore
                          </OrchestraButton>
                        </motion.div>
                      ) : null}

                      {conversionState === "converting" ? (
                        <motion.div
                          key="converting"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="glass-sm flex items-center gap-3 rounded-lg px-4 py-3"
                        >
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 0.75, repeat: Infinity, ease: "linear" }}
                            className="h-[14px] w-[14px] rounded-full border-2 border-[rgba(0,229,204,0.2)] border-t-[var(--cyan)]"
                          />
                          <span className="font-ui text-[12px] text-[var(--text-secondary)]">
                            Creating task and updating flow...
                          </span>
                        </motion.div>
                      ) : null}

                      {conversionState === "done" ? (
                        <motion.div
                          key="done"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="glass-emerald rounded-lg px-4 py-4"
                        >
                          <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                            <div className="mb-3 flex items-center gap-2">
                              <CheckCircle2 size={14} strokeWidth={1.5} className="text-[var(--emerald)]" />
                              <span className="font-ui text-[13px] font-medium text-[var(--emerald)]">
                                Task created. Flow updated.
                              </span>
                            </div>
                          </motion.div>

                          <button
                            type="button"
                            onClick={() => router.push(`/${projectId}/flow`)}
                            className="glass-sm flex w-full items-center justify-between rounded-lg px-4 py-3 text-left transition-all hover:border-[rgba(0,229,204,0.2)]"
                          >
                            <span className="flex items-center gap-2">
                              <GitBranch size={13} strokeWidth={1.5} className="text-[var(--cyan)]" />
                              <span className="font-ui text-[12px] text-[var(--text-secondary)]">
                                See the change in Flow
                              </span>
                            </span>
                            <ChevronRight size={13} strokeWidth={1.5} className="text-[var(--text-muted)]" />
                          </button>

                          <div className="mt-2 font-mono text-[8px] text-[var(--text-muted)]">
                            Navigating to Flow in {countdown}s
                          </div>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </div>
                ) : null}

                <div className="glass glass-noise relative overflow-hidden rounded-xl px-4 py-4">
                  <div className="mb-3 flex items-center gap-2">
                    <Sparkles size={12} strokeWidth={1.5} className="text-[var(--violet)]" />
                    <span className="font-mono text-[9px] tracking-[0.12em] text-[var(--violet)]">Summary</span>
                  </div>
                  <motion.div variants={staggerContainer(0.05, 0.02)} initial="hidden" animate="show" className="space-y-2">
                    {summaryBullets.map((bullet) => (
                      <motion.div key={bullet} variants={fadeSlideUpFast} className="flex items-start gap-2">
                        <span className="mt-[7px] h-[3px] w-[3px] flex-shrink-0 rounded-full bg-[rgba(167,139,250,0.5)]" />
                        <span className="font-ui text-[12px] leading-[1.45] text-[var(--text-secondary)]">
                          {bullet}
                        </span>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>

                {activeThread.actionable ? (
                  <div className="glass-sm relative overflow-hidden rounded-xl px-4 py-4">
                    <div className="mb-3 font-mono text-[9px] tracking-[0.12em] text-[var(--text-muted)]">
                      Add a channel
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {(Object.entries(platformMeta) as Array<
                        [CommsThreadRecord["platform"], (typeof platformMeta)[CommsThreadRecord["platform"]]]
                      >).map(([platform, meta]) => {
                        const Icon = meta.icon;
                        return (
                          <button
                            key={platform}
                            type="button"
                            className="glass-sm flex flex-col items-center gap-1.5 rounded-xl p-3 transition-all hover:border-[rgba(255,255,255,0.1)]"
                          >
                            <Icon size={18} strokeWidth={1.5} style={{ color: meta.color }} />
                            <span className="font-mono text-[9px] tracking-[0.08em] text-[var(--text-muted)]">
                              {meta.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : null}
              </>
            ) : (
              <div className="glass-sm relative overflow-hidden rounded-xl px-4 py-4">
                <MessageCircle
                  size={24}
                  strokeWidth={1.5}
                  className="mx-auto mb-3 text-[rgba(96,165,250,0.3)]"
                />
                <div className="text-center font-ui text-[13px] text-[var(--text-muted)]">
                  Select a conversation.
                </div>
                <div className="mt-1 text-center font-ui text-[12px] text-[var(--text-muted)] opacity-60">
                  Orchestra flags what needs action.
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </StageShell>
  );
}
