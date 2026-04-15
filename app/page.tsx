"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { EASE_EXPO, fadeSlideUp, staggerContainer } from "@/lib/animations";
import { PageRouteDropdown } from "@/components/layout/PageRouteDropdown";
import { OrchestraButton } from "@/components/shared/OrchestraButton";
import { ThemeToggle } from "@/components/shared/ThemeToggle";

const headlineWords = ["Turn", "Tempest", "AI", "ambiguity", "into", "delivery", "clarity."];

export default function HomePage() {
  const showcaseRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: showcaseRef,
    offset: ["start end", "end start"]
  });

  const rotateX = useTransform(scrollYProgress, [0.1, 0.55], [18, 0]);
  const translateY = useTransform(scrollYProgress, [0.1, 0.55], [48, 0]);

  return (
    <main className="home-page main-bg min-h-screen text-[var(--text-primary)]">
      <section className="relative overflow-hidden px-8 pb-24 pt-8">
        <div className="mx-auto max-w-7xl">
          <header className="home-nav glass flex items-center justify-between rounded-full px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="home-brand-pill glass-sm rounded-full px-3 py-1 font-mono text-[10px] tracking-[0.14em] text-[var(--accent-cyan)]">
                ORCHESTRA
              </div>
              <span className="hidden font-mono text-[10px] tracking-[0.12em] text-[var(--text-muted)] sm:inline">
                AI PROJECT MANAGER FOR SOFTWARE DELIVERY
              </span>
            </div>
            <div className="flex items-center gap-2">
              <PageRouteDropdown compact />
              <ThemeToggle />
              <Link href="/login">
                <OrchestraButton variant="ghost" size="sm">
                  OPEN DEMO
                </OrchestraButton>
              </Link>
            </div>
          </header>

          <div className="grid gap-10 pb-6 pt-20 lg:grid-cols-[minmax(0,1.05fr)_420px] lg:items-end">
            <div>
              <motion.div variants={fadeSlideUp} initial="hidden" animate="show" className="home-eyebrow mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-4 py-1.5 font-mono text-[10px] tracking-[0.15em] text-[var(--text-muted)]">
                BRIEF -&gt; FLOWCHART -&gt; PROTOTYPE -&gt; DELIVERY
              </motion.div>

              <motion.div
                variants={staggerContainer(0.05, 0.08)}
                initial="hidden"
                animate="show"
                style={{ perspective: 800 }}
                className="max-w-5xl"
              >
                {headlineWords.map((word) => (
                  <motion.span
                    key={word}
                    initial={{ opacity: 0, y: 40, rotateX: -20 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    transition={{ duration: 0.55, ease: EASE_EXPO }}
                    style={{ transformOrigin: "top center" }}
                    className="home-headline-word mr-3 inline-block font-title text-[clamp(4rem,10vw,8rem)] leading-[0.9] tracking-[0.02em]"
                  >
                    {word}
                  </motion.span>
                ))}
              </motion.div>

              <motion.p
                variants={fadeSlideUp}
                initial="hidden"
                animate="show"
                transition={{ delay: 0.4 }}
                className="home-body-copy mt-6 max-w-2xl font-ui text-[15px] leading-8 text-[var(--text-secondary)]"
              >
                Orchestra clarifies Jack&apos;s founder intent, maps the product flowchart, slices the prototype, and keeps the agency, developer, and client surfaces operating from one source of truth.
              </motion.p>

              <motion.div
                variants={fadeSlideUp}
                initial="hidden"
                animate="show"
                transition={{ delay: 0.6 }}
                className="mt-8 flex flex-wrap gap-3"
              >
                <Link href="/login">
                  <OrchestraButton variant="primary" icon={ArrowRight}>Launch Workspace</OrchestraButton>
                </Link>
                <a href="#device-showcase">
                  <OrchestraButton variant="ghost">See Device Showcase</OrchestraButton>
                </a>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: EASE_EXPO }}
              className="home-workflow-panel glass-cyan glass-noise rounded-xl p-6"
            >
              <div className="font-mono text-[10px] tracking-[0.15em] text-[var(--accent-cyan)]">LIVE PRODUCT WORKFLOW</div>
              <div className="mt-4 space-y-4">
                {[
                  ["Clarity first", "Orchestra asks the questions Jack can feel but hasn't fully articulated yet."],
                  ["Graph before code", "The creator marketplace path is mapped visually before the agency prototypes the wrong thing."],
                  ["Standups from reality", "Execution status, blockers, and founder asks all trace back to the same workflow model."]
                ].map(([title, body]) => (
                  <div key={title} className="home-workflow-card glass-sm rounded-xl p-4">
                    <div className="font-ui text-[14px] font-medium text-[var(--text-primary)]">{title}</div>
                    <div className="mt-1 font-ui text-[12px] leading-6 text-[var(--text-secondary)]">{body}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="device-showcase" ref={showcaseRef} className="home-device-showcase flex items-end justify-center overflow-hidden px-8 py-24">
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          style={{ rotateX, y: translateY, transformPerspective: 1600 }}
          className="flex w-full max-w-[1200px] flex-col items-center justify-center gap-8 lg:flex-row lg:items-end"
        >
          <DeviceReveal delay={0}>
            <PhoneMockup />
          </DeviceReveal>
          <DeviceReveal delay={0.1}>
            <MacBookMockup />
          </DeviceReveal>
          <DeviceReveal delay={0.2}>
            <TabletMockup />
          </DeviceReveal>
        </motion.div>
      </section>
    </main>
  );
}

function DeviceReveal({
  children,
  delay
}: {
  children: React.ReactNode;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay, ease: EASE_EXPO }}
    >
      {children}
    </motion.div>
  );
}

function MacBookMockup() {
  return (
    <div className="shrink-0">
      <div className="home-device-frame glass w-[min(600px,78vw)] rounded-[2.5rem] px-3 pt-3 shadow-2xl">
        <div className="home-device-dot mx-auto mb-1 h-1.5 w-16 rounded-full" />
        <div className="home-device-screen aspect-[16/10] w-full overflow-hidden rounded-[2rem] bg-[var(--bg-bg-2)]">
          <div className="flex h-full gap-3 p-3">
            <div className="flex flex-col">
              <div className="mb-2 flex gap-1">
                <div className="h-2 w-2 rounded-full bg-[#ff5f57]" />
                <div className="h-2 w-2 rounded-full bg-[#febc2e]" />
                <div className="h-2 w-2 rounded-full bg-[#28c840]" />
              </div>
              <div className="home-device-surface glass-sm h-full w-24 rounded-xl p-2">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="home-device-line mb-2 h-2 rounded-full" />
                ))}
              </div>
            </div>
            <div className="home-device-surface glass-sm flex-1 rounded-xl p-3">
              <div className="home-device-line mb-3 h-4 w-32 rounded-md" />
              <div className="grid h-[calc(100%-1.75rem)] grid-cols-3 gap-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="home-device-tile glass-sm h-12 rounded-lg" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="home-device-base mx-auto h-3 w-[min(640px,84vw)] rounded-b-sm" />
      <div className="home-device-base-secondary mx-auto h-2 w-[min(200px,40vw)] rounded-b-lg" />
    </div>
  );
}

function TabletMockup() {
  return (
    <div className="shrink-0">
      <div className="home-device-frame glass flex aspect-[3/4] w-[min(280px,72vw)] flex-col rounded-[3rem] p-3 shadow-xl">
        <div className="home-device-screen w-full flex-1 overflow-hidden rounded-[2.5rem] bg-[var(--bg-bg-2)] p-3">
          <div className="home-device-line mb-3 h-3 w-24 rounded-full" />
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="home-device-surface glass-sm mb-2 flex h-8 items-center gap-2 rounded-lg px-3">
              <div className="home-device-status h-2 w-2 rounded-full" />
              <div className="home-device-line h-1.5 w-20 rounded-full" />
            </div>
          ))}
        </div>
        <div className="home-device-dot mx-auto mt-2 h-1 w-12 rounded-full" />
      </div>
    </div>
  );
}

function PhoneMockup() {
  return (
    <div className="shrink-0">
      <div className="home-device-frame glass flex aspect-[9/19.5] w-[160px] flex-col rounded-[4rem] p-2.5 shadow-xl">
        <div className="home-device-dot mb-1 mx-auto h-3 w-16 rounded-full" />
        <div className="home-device-screen w-full flex-1 overflow-hidden rounded-[3rem] bg-[var(--bg-bg-2)] p-2">
          <div className="home-device-line mx-auto mb-2 h-2 w-16 rounded-full" />
          <div className="home-device-surface glass-sm mb-2 rounded-xl p-2">
            <div className="home-device-line mb-1 h-1.5 w-20 rounded-md" />
            <div className="home-device-line mb-1 h-1.5 w-14 rounded-md" />
            <div className="home-device-line h-1.5 w-16 rounded-md" />
          </div>
          <div className="mx-auto w-fit rounded-full border border-[var(--cyan-border)] px-2 py-0.5 font-mono text-[6px] text-[var(--accent-cyan)]">
            ACTIVE - WEEK 4
          </div>
        </div>
        <div className="home-device-dot mx-auto mt-2 h-1 w-10 rounded-full" />
      </div>
    </div>
  );
}
