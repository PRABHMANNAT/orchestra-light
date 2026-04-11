"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Hash, Headphones, Mail, MessageCircle, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { StageShell } from "@/components/layout/StageShell";
import { OrchestraButton } from "@/components/shared/OrchestraButton";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { getCommsThreadsForProject, teamRoster, type CommsThreadRecord } from "@/lib/mockData";
import { getIntelRoute } from "@/lib/stageConfig";
import { fadeSlideUp, fadeSlideUpFast, pageContainer, slideInLeft, staggerContainer, SPRING_SOFT } from "@/lib/animations";

type PlatformFilter = "ALL" | "slack" | "whatsapp" | "email" | "discord";

const platformMeta = {
  slack: { icon: Hash, color: "var(--violet)", glass: "glass-violet", label: "Slack" },
  whatsapp: { icon: MessageCircle, color: "var(--emerald)", glass: "glass-emerald", label: "WhatsApp" },
  email: { icon: Mail, color: "var(--blue)", glass: "glass-blue", label: "Email" },
  discord: { icon: Headphones, color: "var(--blue)", glass: "glass-blue", label: "Discord" }
} as const;

const participantMeta: Record<string, { avatar: string; color: string; role: string; glass: string }> = {
  Jack: { avatar: "JT", color: "var(--blue)", role: "Founder · Tempest AI", glass: "glass-blue" },
  "Sarah Chen": { avatar: "SC", color: "var(--cyan)", role: "Project Manager", glass: "glass-cyan" },
  "Mike Torres": { avatar: "MT", color: "var(--violet)", role: "Lead Engineer", glass: "glass-violet" },
  "Priya Kapoor": { avatar: "PK", color: "var(--blue)", role: "Full Stack Dev", glass: "glass-blue" }
};

function buildMessageMap(threads: CommsThreadRecord[]) {
  return threads.reduce<Record<string, CommsThreadRecord["messages"]>>((accumulator, thread) => {
    accumulator[thread.id] = thread.messages;
    return accumulator;
  }, {});
}

function getParticipantMeta(name: string) {
  if (participantMeta[name]) return participantMeta[name];
  const rosterMember = teamRoster.find((member) => member.name === name);
  if (rosterMember) {
    return {
      avatar: rosterMember.avatar,
      color: `var(--${rosterMember.color})`,
      role: rosterMember.role,
      glass:
        rosterMember.color === "violet"
          ? "glass-violet"
          : rosterMember.color === "blue"
            ? "glass-blue"
            : rosterMember.color === "emerald"
              ? "glass-emerald"
              : rosterMember.color === "amber"
                ? "glass-amber"
                : rosterMember.color === "rose"
                  ? "glass-rose"
                  : "glass-cyan"
    };
  }

  return { avatar: name.slice(0, 2).toUpperCase(), color: "var(--text-primary)", role: "Participant", glass: "glass-sm" };
}

export function ClientComms({ projectId }: { projectId: string }) {
  const router = useRouter();
  const baseThreads = useMemo(() => getCommsThreadsForProject(projectId), [projectId]);
  const [threads, setThreads] = useState<CommsThreadRecord[]>(baseThreads);
  const [messagesByThread, setMessagesByThread] = useState<Record<string, CommsThreadRecord["messages"]>>(() => buildMessageMap(baseThreads));
  const [filter, setFilter] = useState<PlatformFilter>("ALL");
  const [activeThreadId, setActiveThreadId] = useState<string>("");
  const [reply, setReply] = useState("");

  const visibleThreads = useMemo(() => {
    if (filter === "ALL") return threads;
    return threads.filter((thread) => thread.platform === filter);
  }, [filter, threads]);

  const activeThread = threads.find((thread) => thread.id === activeThreadId) ?? null;

  const activeMessages = activeThread ? messagesByThread[activeThread.id] ?? activeThread.messages : [];

  const selectThread = (threadId: string) => {
    setActiveThreadId(threadId);
    setThreads((current) => current.map((thread) => (thread.id === threadId ? { ...thread, unread: false } : thread)));
  };

  const sendReply = () => {
    if (!reply.trim() || !activeThread) return;

    const nextMessage = {
      sender: "Sarah Chen",
      time: "Now",
      text: reply.trim(),
      platform: activeThread.platform
    } as const;

    setMessagesByThread((current) => ({
      ...current,
      [activeThread.id]: [...(current[activeThread.id] ?? activeThread.messages), nextMessage]
    }));
    setReply("");
    toast.success("Reply staged in unified comms");
  };

  return (
    <StageShell showGrid>
      <motion.div variants={pageContainer} initial="hidden" animate="show" className="mx-auto max-w-7xl space-y-6 px-8 py-8">
        <SectionHeader
          label="Jack"
          title="WHAT IS JACK SAYING?"
          subtitle="Slack, WhatsApp, email. One place. Nothing missed."
          accentColor="var(--blue)"
        />

        <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr_0.7fr]">
          <motion.div variants={fadeSlideUp} className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {(["ALL", "slack", "whatsapp", "email", "discord"] as PlatformFilter[]).map((option) => {
                const meta = option === "ALL" ? null : platformMeta[option];
                const Icon = meta?.icon;
                const isActive = filter === option;

                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setFilter(option)}
                    className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 font-mono text-[9px] tracking-[0.12em] ${
                      isActive ? (meta ? `${meta.glass} text-[var(--text-primary)]` : "glass-blue text-[var(--text-primary)]") : "glass-sm text-[var(--text-muted)]"
                    }`}
                  >
                    {Icon ? <Icon size={12} style={{ color: meta.color }} /> : null}
                    {meta?.label ?? "ALL"}
                  </button>
                );
              })}
            </div>

            <motion.div variants={staggerContainer(0.05, 0.04)} initial="hidden" animate="show" className="space-y-2">
              {visibleThreads.map((thread) => {
                const meta = platformMeta[thread.platform];
                const Icon = meta.icon;

                return (
                  <motion.button
                    key={thread.id}
                    type="button"
                    variants={slideInLeft}
                    onClick={() => selectThread(thread.id)}
                    className={`glass glass-hover relative w-full rounded-xl px-4 py-3.5 text-left ${activeThread?.id === thread.id ? meta.glass : ""}`}
                  >
                    {thread.unread ? <span className="absolute right-3 top-3 h-[5px] w-[5px] rounded-full bg-[var(--blue)]" /> : null}
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="h-[6px] w-[6px] rounded-full" style={{ background: meta.color }} />
                        <span className="font-mono text-[10px] tracking-[0.12em] text-[var(--text-muted)]">
                          {thread.channel}
                        </span>
                      </div>
                      <span className="font-mono text-[9px] tracking-[0.12em] text-[var(--text-muted)]">{thread.timestamp}</span>
                    </div>
                    <div
                      className={`mt-2 truncate font-ui text-[12px] leading-5 ${
                        thread.unread ? "font-medium text-[var(--text-primary)]" : "text-[var(--text-secondary)]"
                      }`}
                    >
                      {thread.preview}
                    </div>
                    <div className="mt-2 flex items-center justify-between gap-3">
                      {thread.actionable ? (
                        <div className="rounded-[2px] border border-[var(--amber-border)] px-1.5 py-0.5 font-mono text-[8px] tracking-[0.12em] text-[var(--amber)]">
                          ACTION
                        </div>
                      ) : <span />}
                      <div className="font-mono text-[9px] text-[var(--text-muted)]">{thread.participants.length} people</div>
                    </div>
                  </motion.button>
                );
              })}
            </motion.div>
          </motion.div>

          <motion.div variants={fadeSlideUp} className="glass-heavy glass-noise flex min-h-[760px] flex-col overflow-hidden rounded-xl">
            {activeThread ? (
              <>
                <div className="glass-sm border-b border-[rgba(255,255,255,0.05)] px-5 py-3">
                  <div className="flex items-center gap-3">
                    {(() => {
                      const Icon = platformMeta[activeThread.platform].icon;
                      return <Icon size={16} style={{ color: platformMeta[activeThread.platform].color }} />;
                    })()}
                    <div className="font-ui text-[13px] text-[var(--text-primary)]">{activeThread.channel}</div>
                    <div className="ml-auto flex items-center gap-2">
                      {activeThread.participants.map((participant) => (
                        <span key={participant} className="glass-sm rounded-sm px-2 py-1 font-mono text-[9px] tracking-[0.12em] text-[var(--text-muted)]">
                          {participant}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
                  {activeMessages.map((message, index) => {
                    const isJack = message.sender === "Jack";
                    const participant = getParticipantMeta(message.sender);
                    const PlatformIcon = platformMeta[message.platform].icon;

                    return (
                      <motion.div
                        key={`${activeThread.id}-${message.sender}-${index}-${message.time}`}
                        initial={{ opacity: 0, y: 8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ ...SPRING_SOFT, delay: index * 0.06 }}
                        className={`flex ${isJack ? "justify-start" : "justify-end"}`}
                      >
                        <div className={`max-w-[80%] ${isJack ? "" : "items-end"}`}>
                          <div className={`mb-1 flex items-center gap-2 font-mono text-[9px] tracking-[0.12em] text-[var(--text-muted)] ${isJack ? "" : "justify-end"}`}>
                            <span>{message.sender}</span>
                            <span>{message.time}</span>
                          </div>
                          <div className={`flex ${isJack ? "items-start gap-3" : "flex-row-reverse items-start gap-3"}`}>
                            <div className={`${participant.glass} flex h-7 w-7 items-center justify-center rounded-lg font-mono text-[10px]`} style={{ color: participant.color }}>
                              {participant.avatar}
                            </div>
                            <div className={`${isJack ? "glass-blue" : "glass-sm"} relative rounded-xl px-4 py-3`}>
                              <div className="font-ui text-[13px] leading-6 text-[var(--text-primary)]">{message.text}</div>
                              <div className="absolute bottom-2 right-2 opacity-30">
                                <PlatformIcon size={10} style={{ color: platformMeta[message.platform].color }} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                <div className="glass-sm sticky bottom-0 border-t border-[rgba(255,255,255,0.05)] px-4 py-3">
                  <div className="flex items-center gap-3">
                    <input
                      value={reply}
                      onChange={(event) => setReply(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" && !event.shiftKey) {
                          event.preventDefault();
                          sendReply();
                        }
                      }}
                      className="flex-1 bg-transparent font-ui text-[13px] text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)]"
                      placeholder="Reply to Jack..."
                    />
                    <span className="glass-sm rounded-sm px-2 py-1 font-mono text-[9px] tracking-[0.12em]" style={{ color: platformMeta[activeThread.platform].color }}>
                      {platformMeta[activeThread.platform].label}
                    </span>
                    <OrchestraButton variant="ghost" size="sm" onClick={sendReply}>
                      SEND
                    </OrchestraButton>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
                <MessageCircle size={28} className="text-[var(--blue)] opacity-60" />
                <div className="mt-3 font-ui text-[14px] text-[var(--text-muted)]">Pick a conversation.</div>
                <div className="mt-1 font-ui text-[13px] text-[var(--text-secondary)]">
                  Orchestra will flag anything that needs action.
                </div>
              </div>
            )}
          </motion.div>

          <motion.div variants={fadeSlideUp} className="space-y-4">
            {activeThread?.actionable ? (
              <div className="glass-amber glass-noise rounded-xl px-5 py-5">
                <div className="mb-3 flex items-center gap-2 font-mono text-[9px] tracking-[0.15em] text-[var(--amber)]">
                  <Sparkles size={12} />
                  ACTION DETECTED
                </div>
                <div className="mb-4 border-l-2 border-[var(--amber-border)] py-1 pl-3 font-ui text-[13px] leading-6 text-[var(--text-primary)] italic">
                  {activeThread.extractedAction}
                </div>
                <div className="mt-4 space-y-2">
                  <OrchestraButton variant="primary" size="sm" fullWidth onClick={() => toast.success("Added to task queue")}>
                    Add to task queue
                  </OrchestraButton>
                  <OrchestraButton variant="secondary" size="sm" fullWidth onClick={() => router.push(getIntelRoute(projectId))}>
                    Ask Socrates
                  </OrchestraButton>
                  <OrchestraButton variant="ghost" size="sm" fullWidth onClick={() => toast.message("Ignored for now")}>
                    Ignore
                  </OrchestraButton>
                </div>
              </div>
            ) : null}

            {activeThread ? (
              <>
                <div className="glass rounded-xl px-4 py-4">
                  <div className="mb-3 flex items-center gap-2 font-mono text-[9px] tracking-[0.15em] text-[var(--violet)]">
                    <Sparkles size={12} />
                    Summary
                  </div>
                  <motion.div variants={staggerContainer(0.05, 0.02)} initial="hidden" animate="show" className="space-y-2">
                    {activeThread.summaryBullets.map((bullet) => (
                      <motion.div key={bullet} variants={fadeSlideUpFast} className="flex items-start gap-2">
                        <span className="mt-2 h-[3px] w-[3px] rounded-full bg-[var(--violet)]" />
                        <span className="font-ui text-[12px] leading-6 text-[var(--text-secondary)]">{bullet}</span>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>

                <div className="glass-sm rounded-xl px-4 py-4">
                  <div className="space-y-3">
                    {activeThread.participants.map((participant) => {
                      const meta = getParticipantMeta(participant);
                      return (
                        <div key={`${activeThread.id}-${participant}`} className="flex items-center gap-3">
                          <div className={`${meta.glass} flex h-7 w-7 items-center justify-center rounded-full font-mono text-[10px]`} style={{ color: meta.color }}>
                            {meta.avatar}
                          </div>
                          <div>
                            <div className="font-ui text-[12px] text-[var(--text-primary)]">{participant}</div>
                            <div className="font-mono text-[9px] tracking-[0.12em] text-[var(--text-muted)]">{meta.role}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            ) : null}

            <div className="glass-sm rounded-xl px-4 py-4">
              <div className="mb-3 font-mono text-[9px] tracking-[0.15em] text-[var(--text-muted)]">Add a channel</div>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(platformMeta).map(([platform, meta]) => {
                  const Icon = meta.icon;
                  return (
                    <button
                      key={platform}
                      type="button"
                      onClick={() => toast.message(`${meta.label} integration coming next`)}
                      className={`${meta.glass} glass-hover rounded-lg p-3 text-center`}
                    >
                      <div className="flex flex-col items-center gap-1">
                        <Icon size={20} style={{ color: meta.color }} />
                        <span className="font-mono text-[9px] tracking-[0.12em] text-[var(--text-muted)]">{meta.label}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </StageShell>
  );
}
