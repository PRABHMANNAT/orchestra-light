"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { LoginForm } from "@/components/auth/LoginForm";
import { SignupForm } from "@/components/auth/SignupForm";
import { type MockUser, roleRouteMap } from "@/lib/roles";
import { projectMeta } from "@/lib/mockData";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const [tab, setTab] = useState<"signin" | "signup">("signin");
  const router = useRouter();

  const handleSuccess = (user: MockUser) => {
    window.localStorage.setItem("orchestra_user", JSON.stringify(user));
    router.push(roleRouteMap[user.role]);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050505] text-white">
      <div className="orb-container">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>
      <div className="scanlines" />
      <div className="grain" />

      <div className="relative z-20 grid min-h-screen md:grid-cols-2">
        <div className="relative flex h-full min-w-0 flex-col justify-between overflow-hidden px-12 py-12">
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg, #00d4ff 0px, #00d4ff 1px, transparent 1px, transparent 60px)"
            }}
          />

          <div className="relative z-10">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent-cyan">{projectMeta.version}</span>
          </div>

          <div className="relative z-10 min-w-0">
            <div
              className="pointer-events-none absolute select-none whitespace-nowrap font-display text-[80px] font-bold leading-none tracking-tight text-transparent lg:text-[96px]"
              style={{
                WebkitTextStroke: "1px rgba(255,255,255,0.08)",
                top: "-12px",
                left: "-4px"
              }}
            >
              ORCHESTRA
            </div>
            <h1
              className="relative z-10 whitespace-nowrap font-display text-[80px] font-bold leading-none tracking-tight text-white lg:text-[96px]"
            >
              ORCHESTRA
            </h1>

            <div className="mt-6 h-[2px] w-16 bg-accent-cyan" />

            <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.18em] text-accent-cyan">
              AI Project Manager
              <br />
              for Software Delivery
            </p>

            <p className="mt-5 max-w-[340px] font-sans text-[13px] leading-relaxed text-text-muted">
              From messy brief to clean handover in one connected system. Brief → Product Flowchart → Prototype →
              Delivery.
            </p>
          </div>

          <div className="relative z-10">
            <div className="mb-6 flex gap-8">
              {[
                { number: "9", label: "STAGES" },
                { number: "3", label: "ROLES" },
                { number: "1", label: "SOURCE OF TRUTH" }
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="font-display text-[44px] font-bold leading-none text-white">{stat.number}</div>
                  <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.15em] text-text-muted">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-1">
              {["INTAKE", "FLOWCHART", "PROTOTYPE", "DELIVERY", "HANDOVER"].map((step, index, arr) => (
                <div key={step} className="flex items-center gap-1">
                  <span className="border border-[#2a2a2a] px-2 py-1 font-mono text-[9px] uppercase tracking-[0.12em] text-text-muted">
                    {step}
                  </span>
                  {index < arr.length - 1 ? (
                    <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-text-muted">→</span>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex h-full flex-col justify-center border-l border-[#1b1b1b] px-12 py-12">
          <div className="w-full max-w-[580px]">
            <div className="mb-8 flex gap-6 border-b border-[#1b1b1b]">
              {[
                ["signin", "SIGN IN"],
                ["signup", "CREATE ACCOUNT"]
              ].map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setTab(value as "signin" | "signup")}
                  className={cn(
                    "border-b-2 pb-3 font-mono text-[11px] uppercase tracking-[0.1em]",
                    tab === value ? "border-accent-cyan text-accent-cyan" : "border-transparent text-text-muted"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
            {tab === "signin" ? <LoginForm onSuccess={handleSuccess} /> : <SignupForm />}
          </div>
        </div>
      </div>
    </div>
  );
}
