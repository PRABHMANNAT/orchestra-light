"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, MoveRight } from "lucide-react";

const deviceRevealDelays = [0, 0.15, 0.3] as const;

export default function HomePage() {
  const showcaseRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: showcaseRef,
    offset: ["start end", "end start"]
  });

  const rotateX = useTransform(scrollYProgress, [0.1, 0.55], [20, 0]);
  const translateY = useTransform(scrollYProgress, [0.1, 0.55], [64, 0]);
  const scale = useTransform(scrollYProgress, [0.1, 0.55], [0.95, 1]);

  return (
    <main className="min-h-screen text-[#111111]">
      <section className="relative overflow-hidden px-6 pb-20 pt-8 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <header className="flex items-center justify-between rounded-full border border-white/70 bg-white/75 px-4 py-3 shadow-glass backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className="rounded-full border border-white/70 bg-white/[0.55] px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-[#999999] backdrop-blur-lg">
                  Orchestra
                </div>
                <span className="hidden font-mono text-[10px] uppercase tracking-widest text-[#999999] sm:inline">
                AI Project Manager for software delivery
              </span>
            </div>

            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-xl border border-[#111111] bg-[#111111] px-4 py-2 font-sans text-[13px] font-medium text-white"
            >
              Open Demo
              <ArrowRight size={14} strokeWidth={1.5} />
            </Link>
          </header>

          <div className="grid gap-10 pb-6 pt-16 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.72fr)] lg:items-end">
            <div className="max-w-4xl">
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/[0.55] px-3 py-1.5 shadow-glass-sm backdrop-blur-lg"
              >
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#999999]">
                  Brief → Flowchart → Prototype → Delivery
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.05 }}
                className="max-w-4xl font-sans text-[clamp(3.5rem,8vw,7rem)] font-bold leading-[0.92] tracking-tight text-[#111111]"
              >
                Turn ambiguous product requests into delivery-ready execution.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.12 }}
                className="mt-6 max-w-2xl font-sans text-[16px] leading-7 text-[#555555]"
              >
                Orchestra clarifies the brief, maps the product flowchart, packages the prototype slice, and keeps manager,
                client, and developer views aligned inside one clean operating surface.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.18 }}
                className="mt-8 flex flex-wrap gap-3"
              >
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 rounded-xl border border-[#111111] bg-[#111111] px-5 py-3 font-sans text-[14px] font-medium text-white shadow-sm"
                >
                  Launch Workspace
                  <MoveRight size={15} strokeWidth={1.5} />
                </Link>
                <a
                  href="#device-showcase"
                  className="inline-flex items-center gap-2 rounded-xl border border-[#e0e0e0] bg-white/80 px-5 py-3 font-sans text-[14px] font-medium text-[#111111] shadow-sm backdrop-blur-sm"
                >
                  See Device Showcase
                </a>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.22 }}
              className="pm-card p-6"
            >
              <div className="font-mono text-[10px] uppercase tracking-widest text-[#999999]">Live product workflow</div>
              <div className="mt-3 space-y-4">
                <div className="rounded-2xl border border-[#ececec] bg-white/90 p-4">
                  <div className="font-sans text-[15px] font-semibold text-[#111111]">Clarification engine</div>
                  <p className="mt-1 font-sans text-[13px] leading-6 text-[#555555]">
                    Ask the six questions that turn hand-wavy requirements into an approval-ready brief.
                  </p>
                </div>
                <div className="rounded-2xl border border-[#ececec] bg-white/90 p-4">
                  <div className="font-sans text-[15px] font-semibold text-[#111111]">Product flowchart</div>
                  <p className="mt-1 font-sans text-[13px] leading-6 text-[#555555]">
                    Make dependency paths visible before the team burns time on the wrong prototype.
                  </p>
                </div>
                <div className="rounded-2xl border border-[#ececec] bg-white/90 p-4">
                  <div className="font-sans text-[15px] font-semibold text-[#111111]">Shared execution plan</div>
                  <p className="mt-1 font-sans text-[13px] leading-6 text-[#555555]">
                    Keep the manager plan, client review loop, and developer board mapped to the same source of truth.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section
        id="device-showcase"
        ref={showcaseRef}
        className="py-24 px-8 flex items-end justify-center gap-8 bg-[#f5f5f7] overflow-hidden"
      >
        <motion.div
          style={{
            rotateX,
            y: translateY,
            scale,
            transformPerspective: 1600
          }}
          className="flex w-full max-w-[1200px] flex-col items-center justify-center gap-8 lg:flex-row lg:items-end"
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: deviceRevealDelays[0], ease: [0.16, 1, 0.3, 1] }}
          >
            <PhoneMockup />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: deviceRevealDelays[1], ease: [0.16, 1, 0.3, 1] }}
          >
            <MacBookMockup />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: deviceRevealDelays[2], ease: [0.16, 1, 0.3, 1] }}
          >
            <TabletMockup />
          </motion.div>
        </motion.div>
      </section>
    </main>
  );
}

function MacBookMockup() {
  return (
    <div className="shrink-0">
      <div className="w-[600px] rounded-[2.5rem] bg-[#1d1d1f] px-3 pt-3 shadow-2xl">
        <div className="mb-1 mx-auto h-1.5 w-16 rounded-full bg-[#1d1d1f]" />
        <div className="aspect-[16/10] w-full overflow-hidden rounded-[1.75rem] bg-[#f5f5f7]">
          <div className="flex h-full gap-3 bg-[#f5f5f7] p-3">
            <div className="flex flex-col">
              <div className="mb-2 flex gap-1">
                <div className="h-2 w-2 rounded-full bg-[#ff5f57]" />
                <div className="h-2 w-2 rounded-full bg-[#febc2e]" />
                <div className="h-2 w-2 rounded-full bg-[#28c840]" />
              </div>
              <div className="h-full w-24 rounded-2xl bg-white/80 p-2">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="mb-2 h-2 rounded-full bg-[#e0e0e0]" />
                ))}
              </div>
            </div>

            <div className="flex-1 rounded-2xl bg-white/60 p-3">
              <div className="mb-3 h-4 w-32 rounded-md bg-[#111111]/10" />
              <div className="grid h-[calc(100%-1.75rem)] grid-cols-3 gap-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="h-12 rounded-2xl border border-[#e8e8e8] bg-white" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto h-3 w-[640px] rounded-b-sm bg-[#c8c8ca]" />
      <div className="mx-auto h-2 w-[200px] rounded-b-lg bg-[#b0b0b2]" />
    </div>
  );
}

function TabletMockup() {
  return (
    <div className="shrink-0">
      <div className="flex aspect-[3/4] w-[280px] flex-col rounded-[3rem] bg-[#1d1d1f] p-3 shadow-xl">
        <div className="w-full flex-1 overflow-hidden rounded-[2.5rem] bg-[#f5f5f7]">
          <div className="h-full bg-[#f5f5f7] p-3">
            <div className="mb-3 h-3 w-24 rounded-full bg-[#111111]/10" />
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="mb-2 flex h-8 items-center gap-2 rounded-2xl border border-[#e8e8e8] bg-white px-3">
                <div className="h-2 w-2 rounded-full bg-[#e0e0e0]" />
                <div className="h-1.5 w-20 rounded-full bg-[#e0e0e0]" />
              </div>
            ))}
          </div>
        </div>
        <div className="mt-2 mx-auto h-1 w-12 rounded-full bg-[#3a3a3c]" />
      </div>
    </div>
  );
}

function PhoneMockup() {
  return (
    <div className="shrink-0">
      <div className="flex aspect-[9/19.5] w-[160px] flex-col rounded-[4rem] bg-[#1d1d1f] p-2.5 shadow-xl">
        <div className="mb-1 mx-auto h-3 w-16 rounded-full bg-[#1d1d1f]" />
        <div className="w-full flex-1 overflow-hidden rounded-[3rem] bg-[#f5f5f7]">
          <div className="h-full bg-[#f5f5f7] p-2">
            <div className="mx-auto mb-2 h-2 w-16 rounded-full bg-[#111111]/10" />
            <div className="mb-2 rounded-2xl border border-[#e8e8e8] bg-white p-2">
              <div className="mb-1 h-1.5 w-20 rounded-md bg-[#e0e0e0]" />
              <div className="mb-1 h-1.5 w-14 rounded-md bg-[#e0e0e0]" />
              <div className="h-1.5 w-16 rounded-md bg-[#e0e0e0]" />
            </div>
            <div className="mx-auto w-fit rounded-full bg-[#111111] px-2 py-0.5 font-mono text-[6px] text-white">
              ACTIVE · WEEK 4
            </div>
          </div>
        </div>
        <div className="mt-2 mx-auto h-1 w-10 rounded-full bg-[#3a3a3c]" />
      </div>
    </div>
  );
}
