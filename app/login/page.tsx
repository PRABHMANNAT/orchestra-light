"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { EASE_EXPO, chipBounce, fadeSlideUp, staggerContainer } from "@/lib/animations";
import { LoginForm } from "@/components/auth/LoginForm";
import { SignupForm } from "@/components/auth/SignupForm";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { type MockUser, roleRouteMap } from "@/lib/roles";
import { projectMeta } from "@/lib/mockData";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const [tab, setTab] = useState<"signin" | "signup">("signin");
  const router = useRouter();

  const handleSuccess = (user: MockUser) => {
    window.localStorage.setItem("orchestra_user", JSON.stringify(user));
    router.push(user.role === "pm" ? "/pm/dashboard" : roleRouteMap[user.role]);
  };

  return (
    <div className="login-theme relative min-h-screen overflow-hidden">
      <div className="login-top-controls fixed right-6 top-6 z-50 flex items-center gap-2">
        <ThemeToggle />
      </div>

      <div className="login-content relative z-20 grid min-h-screen md:grid-cols-2">
        <motion.div
          variants={staggerContainer(0.08, 0.02)}
          initial="hidden"
          animate="show"
          className="login-brand-side relative flex h-full min-w-0 flex-col justify-between overflow-hidden px-8 py-24 sm:px-12 md:py-12"
        >
          <motion.div variants={fadeSlideUp} className="relative z-10">
            <span className="login-version font-mono text-[10px] tracking-[0.2em] text-accent-cyan">{projectMeta.version}</span>
          </motion.div>

          <div className="relative z-10 min-w-0">
            <motion.h1
              initial={{ opacity: 0, letterSpacing: "0.5em" }}
              animate={{ opacity: 1, letterSpacing: "0.05em" }}
              transition={{ duration: 0.8, ease: EASE_EXPO }}
              className="login-wordmark whitespace-nowrap font-title text-[64px] leading-none text-[var(--text-primary)] sm:text-[80px] lg:text-[96px]"
            >
              ORCHESTRA
            </motion.h1>
            <motion.div variants={fadeSlideUp} className="login-accent-rule mt-6 h-[2px] w-16 bg-accent-cyan" />
            <motion.p variants={fadeSlideUp} className="login-kicker mt-5 font-mono text-[11px] tracking-[0.18em] text-accent-cyan">
              AI PROJECT MANAGER
              <br />
              FOR SOFTWARE DELIVERY
            </motion.p>
            <motion.p variants={fadeSlideUp} className="login-copy mt-5 max-w-[360px] font-ui text-[13px] leading-relaxed text-text-secondary">
              From Jack&apos;s founder brief to the Tempest AI delivery handover in one connected operating surface.
            </motion.p>
          </div>

          <div className="relative z-10">
            <motion.div variants={fadeSlideUp} className="mb-6 flex gap-8">
              {[
                { number: "10", label: "STAGES" },
                { number: "3", label: "ROLES" },
                { number: "1", label: "SOURCE OF TRUTH" }
              ].map((stat) => (
                <div key={stat.label} className="login-stat">
                  <div className="font-title text-[44px] leading-none text-[var(--text-primary)]">{stat.number}</div>
                  <div className="mt-1 font-mono text-[9px] tracking-[0.15em] text-text-muted">{stat.label}</div>
                </div>
              ))}
            </motion.div>

            <motion.div variants={staggerContainer(0.05, 0.5)} initial="hidden" animate="show" className="flex flex-wrap items-center gap-1">
              {["INTAKE", "FLOWCHART", "PROTOTYPE", "DELIVERY", "HANDOVER"].map((step, index, arr) => (
                <div key={step} className="flex items-center gap-1">
                  <motion.span variants={chipBounce} className="login-chip glass-sm rounded-md px-2 py-1 font-mono text-[9px] tracking-[0.12em] text-text-muted">
                    {step}
                  </motion.span>
                  {index < arr.length - 1 ? <span className="font-mono text-[10px] text-text-muted">-&gt;</span> : null}
                </div>
              ))}
            </motion.div>

            <motion.div variants={fadeSlideUp} className="mt-8">
              <div className="font-mono text-[10px] tracking-[0.14em] text-text-muted">BUILT FOR TEAMS LIKE YOURS</div>
              <div className="mt-4 space-y-3">
                {[
                  "One source of truth. No more Slack, WhatsApp, email chaos.",
                  "Auto-generated standups. Never chase status again.",
                  "Scope changes calculated in real time. No surprises."
                ].map((item) => (
                  <div key={item} className="login-benefit flex items-start gap-2">
                    <CheckCircle2 size={12} strokeWidth={1.7} className="mt-0.5 shrink-0 text-accent-cyan" />
                    <div className="font-ui text-[12px] text-text-secondary">{item}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40, scale: 0.97 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: EASE_EXPO, delay: 0.2 }}
          className="login-form-column flex h-full flex-col justify-center border-l px-8 py-24 sm:px-12 md:py-12"
        >
          <div className="login-panel glass-noise w-full max-w-[580px] rounded-lg p-6 sm:p-8">
            <div className="login-tabs mb-8 flex gap-6 border-b">
              {[
                ["signin", "SIGN IN"],
                ["signup", "CREATE ACCOUNT"]
              ].map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setTab(value as "signin" | "signup")}
                  className={cn(
                    "login-tab border-b-2 pb-3 font-mono text-[11px] tracking-[0.1em]",
                    tab === value ? "border-accent-cyan text-accent-cyan" : "border-transparent text-text-muted"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20, transition: { duration: 0.15 } }}
                transition={{ duration: 0.25 }}
              >
                {tab === "signin" ? <LoginForm onSuccess={handleSuccess} /> : <SignupForm />}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
