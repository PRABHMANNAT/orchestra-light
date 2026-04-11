"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Copy, ExternalLink, UploadCloud } from "lucide-react";
import { useParams } from "next/navigation";

import { StageShell } from "@/components/layout/StageShell";
import { OrchestraButton } from "@/components/shared/OrchestraButton";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { fadeSlideUp, pageContainer } from "@/lib/animations";

const screens = [
  { id: 1, name: "Creator Signup", url: "creator.tempestai.com/onboarding" },
  { id: 2, name: "Portfolio Upload", url: "creator.tempestai.com/portfolio" },
  { id: 3, name: "Asset Marketplace", url: "creator.tempestai.com/marketplace" },
  { id: 4, name: "Revenue Dashboard", url: "creator.tempestai.com/revenue" },
  { id: 5, name: "Discovery Feed", url: "creator.tempestai.com/discovery" }
] as const;

export default function PreviewPage() {
  const params = useParams<{ projectId: string }>();
  const projectId = typeof params?.projectId === "string" ? params.projectId : "p1";
  const [viewMode, setViewMode] = useState<"dev" | "client">("dev");
  const [activeScreen, setActiveScreen] = useState(1);

  return (
    <StageShell showGrid>
      <motion.div variants={pageContainer} initial="hidden" animate="show" className="mx-auto max-w-7xl space-y-6 px-8 py-8">
        <SectionHeader
          label="preview"
          title="DOES THIS LOOK RIGHT?"
          subtitle="Real screens. Before a single line of code."
          accentColor="var(--blue)"
        />

        <motion.div variants={fadeSlideUp} className="flex gap-3">
          {(["dev", "client"] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setViewMode(mode)}
              className={
                viewMode === mode
                  ? "glass-blue rounded-md border border-[var(--blue-border)] px-4 py-2 font-ui text-[12px] text-[var(--blue)]"
                  : "glass-sm rounded-md px-4 py-2 font-ui text-[12px] text-[var(--text-secondary)]"
              }
            >
              {mode === "dev" ? "Dev view" : "Client view"}
            </button>
          ))}
        </motion.div>

        <motion.div variants={fadeSlideUp} className="flex gap-3 overflow-x-auto pb-1">
          {screens.map((screen) => (
            <button
              key={screen.id}
              type="button"
              onClick={() => setActiveScreen(screen.id)}
              className={`glass-sm flex w-[160px] flex-shrink-0 flex-col overflow-hidden rounded-xl border ${
                activeScreen === screen.id ? "border-[var(--blue)]" : "border-[rgba(255,255,255,0.06)]"
              }`}
            >
              <ThumbnailPreview screenId={screen.id} />
              <div className="py-2 text-center font-mono text-[9px] tracking-[0.1em] text-[var(--text-muted)]">{screen.name}</div>
            </button>
          ))}
        </motion.div>

        <motion.div variants={fadeSlideUp} className="glass-heavy overflow-hidden rounded-xl">
          <div className="flex items-center gap-3 border-b border-[rgba(255,255,255,0.05)] bg-[rgba(0,0,0,0.3)] px-4 py-3">
            <div className="flex gap-1.5">
              <div className="h-3 w-3 rounded-full bg-[var(--rose)] opacity-70" />
              <div className="h-3 w-3 rounded-full bg-[var(--amber)] opacity-70" />
              <div className="h-3 w-3 rounded-full bg-[var(--emerald)] opacity-70" />
            </div>
            <div className="glass-sm mx-4 flex-1 rounded-md px-3 py-1.5 font-mono text-[10px] text-[var(--text-muted)]">
              {screens.find((screen) => screen.id === activeScreen)?.url}
            </div>
            {viewMode === "dev" ? (
              <div className="glass-sm rounded-md px-3 py-1.5 font-mono text-[9px] tracking-[0.1em] text-[var(--text-muted)]">
                Annotations
              </div>
            ) : null}
          </div>

          <div className="relative min-h-[520px] bg-[#080808]">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${viewMode}-${activeScreen}`}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.25 }}
              >
                {activeScreen === 1 ? <CreatorSignupScreen /> : null}
                {activeScreen === 2 ? <PortfolioUploadScreen /> : null}
                {activeScreen === 3 ? <MarketplaceScreen /> : null}
                {activeScreen === 4 ? <RevenueDashboardScreen /> : null}
                {activeScreen === 5 ? <DiscoveryFeedScreen /> : null}
              </motion.div>
            </AnimatePresence>

            {viewMode === "dev" ? (
              <>
                <div className="glass-violet absolute left-[120px] top-[110px] rounded-md px-2 py-1 font-mono text-[8px] text-[var(--violet)]">
                  T-03 · Priya
                </div>
                <div className="glass-violet absolute right-[120px] top-[240px] rounded-md px-2 py-1 font-mono text-[8px] text-[var(--violet)]">
                  BLOCKED · Stripe
                </div>
              </>
            ) : null}
          </div>
        </motion.div>

        <motion.div variants={fadeSlideUp} className="glass-cyan rounded-xl px-5 py-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="font-mono text-[9px] tracking-[0.12em] text-[var(--cyan)]">CLIENT PORTAL</div>
              <div className="mt-1 font-ui text-[13px] text-[var(--text-secondary)]">
                Share with Jack. Read-only.
              </div>
              <div className="mt-1 font-mono text-[10px] text-[var(--text-muted)]">orchestra.app/portal/{projectId}-c7x9</div>
            </div>
            <div className="flex gap-2">
              <OrchestraButton variant="ghost" size="sm" icon={Copy}>
                Copy link
              </OrchestraButton>
              <OrchestraButton variant="secondary" size="sm" icon={ExternalLink}>
                Open portal
              </OrchestraButton>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </StageShell>
  );
}

function ThumbnailPreview({ screenId }: { screenId: number }) {
  return (
    <div className="relative h-[100px] bg-[#0d0d0d] p-3">
      {screenId === 1 ? (
        <div className="space-y-2">
          <div className="h-3 w-20 rounded bg-[rgba(255,255,255,0.07)]" />
          <div className="h-6 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)]" />
          <div className="h-6 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)]" />
          <div className="h-6 w-2/3 rounded-lg bg-[rgba(0,229,204,0.16)]" />
        </div>
      ) : null}
      {screenId === 2 ? (
        <div className="space-y-2">
          <div className="h-12 rounded-xl border border-dashed border-[rgba(167,139,250,0.2)] bg-[rgba(167,139,250,0.04)]" />
          <div className="space-y-1">
            <div className="h-4 rounded bg-[rgba(255,255,255,0.04)]" />
            <div className="h-4 rounded bg-[rgba(255,255,255,0.04)]" />
          </div>
        </div>
      ) : null}
      {screenId === 3 ? (
        <div className="grid grid-cols-3 gap-2">
          {["linear-gradient(135deg,#a78bfa,#60a5fa)", "linear-gradient(135deg,#00e5cc,#60a5fa)", "linear-gradient(135deg,#fbbf24,#fb7185)", "linear-gradient(135deg,#34d399,#00e5cc)", "linear-gradient(135deg,#60a5fa,#a78bfa)", "linear-gradient(135deg,#fb7185,#a78bfa)"].map((background, index) => (
            <div key={index} className="h-10 rounded-lg" style={{ background }} />
          ))}
        </div>
      ) : null}
      {screenId === 4 ? (
        <svg width="100%" height="100%" viewBox="0 0 160 100">
          <path d="M0 78 C20 70 32 60 48 52 S72 30 92 36 S124 20 154 12" fill="none" stroke="#00e5cc" strokeWidth="2" />
          <path d="M0 78 C20 70 32 60 48 52 S72 30 92 36 S124 20 154 12 L154 100 L0 100 Z" fill="rgba(0,229,204,0.12)" />
        </svg>
      ) : null}
      {screenId === 5 ? (
        <div className="space-y-2">
          {[1, 2, 3].map((row) => (
            <div key={row} className="flex items-center gap-2 rounded-lg bg-[rgba(255,255,255,0.03)] p-2">
              <div className="h-8 w-8 rounded-lg bg-[rgba(96,165,250,0.18)]" />
              <div className="flex-1 space-y-1">
                <div className="h-2 rounded bg-[rgba(255,255,255,0.07)]" />
                <div className="h-2 w-1/2 rounded bg-[rgba(255,255,255,0.05)]" />
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function CreatorSignupScreen() {
  return (
    <div className="flex min-h-[520px] items-center justify-center bg-[#080808] p-8">
      <div className="glass-sm w-full max-w-md rounded-xl px-8 py-8">
        <div className="mb-6 font-mono text-[10px] tracking-[0.12em] text-[var(--cyan)]">CREATOR ACCOUNT</div>
        <div className="font-display text-[36px] leading-none text-[var(--text-primary)]">Join Tempest AI</div>
        <div className="mt-2 font-ui text-[13px] text-[var(--text-secondary)]">
          Build and monetise games. First 1,000 creators get Pro free.
        </div>
        {["Your name", "Email address", "Password"].map((field) => (
          <div key={field} className="glass-sm mt-3 rounded-lg px-4 py-3 font-ui text-[13px] text-[var(--text-muted)]">
            {field}
          </div>
        ))}
        <div className="mt-4">
          <OrchestraButton variant="primary" fullWidth>
            Create creator account
          </OrchestraButton>
        </div>
        <div className="mt-4 text-center font-ui text-[12px] text-[var(--text-muted)]">Already have an account? Sign in</div>
      </div>
    </div>
  );
}

function PortfolioUploadScreen() {
  return (
    <div className="min-h-[520px] bg-[#080808] p-8">
      <div className="font-mono text-[10px] tracking-[0.12em] text-[var(--violet)]">PORTFOLIO</div>
      <div className="mt-2 font-display text-[36px] leading-none text-[var(--text-primary)]">Upload your work</div>
      <div className="glass-sm mt-6 rounded-xl border-2 border-dashed border-[rgba(167,139,250,0.2)] p-12 text-center">
        <UploadCloud size={32} strokeWidth={1.5} className="mx-auto text-[var(--violet)]" />
        <div className="mt-3 font-ui text-[13px] text-[var(--text-muted)]">Drop your games, assets, or projects here</div>
        <div className="mt-1 font-mono text-[10px] text-[var(--text-muted)]">PDF, ZIP, images, videos up to 500MB</div>
      </div>
      {[
        { file: "dungeons-of-tempest-build.zip", size: "214MB", progress: 80 },
        { file: "marketplace-showreel.mov", size: "84MB", progress: 100 }
      ].map((item) => (
        <div key={item.file} className="glass-sm mt-3 rounded-lg px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="font-ui text-[13px] text-[var(--text-primary)]">{item.file}</div>
              <div className="mt-1 font-mono text-[10px] text-[var(--text-muted)]">{item.size}</div>
            </div>
            <div className="w-32">
              <div className="h-[3px] rounded-full bg-[rgba(255,255,255,0.05)]">
                <div className="h-[3px] rounded-full bg-[var(--cyan)]" style={{ width: `${item.progress}%` }} />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function MarketplaceScreen() {
  return (
    <div className="min-h-[520px] bg-[#080808] p-6">
      <div className="mb-4 flex gap-2">
        {["RPG", "Action", "Puzzle", "Assets"].map((tag, index) => (
          <div
            key={tag}
            className={index === 0 ? "glass-cyan rounded-md px-3 py-1.5 font-mono text-[10px] text-[var(--cyan)]" : "glass-sm rounded-md px-3 py-1.5 font-mono text-[10px] text-[var(--text-muted)]"}
          >
            {tag}
          </div>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {[
          ["Dungeon Tiles", "Kite & Lantern", "$4.99", "linear-gradient(135deg,#a78bfa,#60a5fa)"],
          ["NPC Dialogue Pack", "Moonriver", "$8.00", "linear-gradient(135deg,#00e5cc,#60a5fa)"],
          ["Boss Arena FX", "Temple Five", "$12.00", "linear-gradient(135deg,#fbbf24,#fb7185)"],
          ["Forest Ambience", "Ash+Oak", "$3.99", "linear-gradient(135deg,#34d399,#00e5cc)"],
          ["RPG Inventory UI", "Hexline", "$7.50", "linear-gradient(135deg,#60a5fa,#a78bfa)"],
          ["Quest Prompt Kit", "Northbound", "$5.50", "linear-gradient(135deg,#fb7185,#a78bfa)"]
        ].map(([title, creator, price, background]) => (
          <div key={title} className="glass glass-hover overflow-hidden rounded-xl">
            <div className="h-32" style={{ background }} />
            <div className="px-4 py-3">
              <div className="font-ui text-[13px] font-medium text-[var(--text-primary)]">{title}</div>
              <div className="mt-1 font-mono text-[10px] text-[var(--text-muted)]">{creator}</div>
              <div className="mt-3 flex items-center justify-between">
                <div className="font-display text-[18px] text-[var(--cyan)]">{price}</div>
                <div className="font-mono text-[10px] text-[var(--amber)]">●●●●○</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RevenueDashboardScreen() {
  return (
    <div className="min-h-[520px] bg-[#080808] p-6">
      <div className="font-mono text-[10px] tracking-[0.12em] text-[var(--cyan)]">REVENUE</div>
      <div className="mt-2 font-display text-[36px] leading-none text-[var(--text-primary)]">Your earnings</div>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {[
          ["This month", "$2,847", "+$1,240", "var(--emerald)"],
          ["Total earned", "$18,420", "", "var(--text-primary)"],
          ["Payout pending", "$842", "", "var(--amber)"]
        ].map(([label, value, sub, color]) => (
          <div key={label} className="glass-sm rounded-xl px-4 py-4">
            <div className="font-mono text-[10px] text-[var(--text-muted)]">{label}</div>
            <div className="mt-2 font-display text-[28px] leading-none text-[var(--text-primary)]">{value}</div>
            {sub ? <div className="mt-2 font-mono text-[10px]" style={{ color }}>{sub}</div> : null}
          </div>
        ))}
      </div>
      <div className="glass-sm mt-6 h-48 rounded-xl p-4">
        <svg width="100%" height="150" viewBox="0 0 400 150">
          <defs>
            <linearGradient id="revenue-chart" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00e5cc" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#00e5cc" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M0 120 C50 100 80 80 120 70 S180 40 220 50 S300 30 350 20 L350 150 L0 150 Z" fill="url(#revenue-chart)" />
          <path d="M0 120 C50 100 80 80 120 70 S180 40 220 50 S300 30 350 20" stroke="#00e5cc" strokeWidth="2" fill="none" />
        </svg>
      </div>
    </div>
  );
}

function DiscoveryFeedScreen() {
  return (
    <div className="min-h-[520px] bg-[#080808] p-6">
      <div className="font-mono text-[10px] tracking-[0.12em] text-[var(--blue)]">DISCOVER</div>
      <div className="mt-2 font-display text-[36px] leading-none text-[var(--text-primary)]">Find your next adventure</div>
      <div className="mt-4 flex gap-2 overflow-x-auto">
        {["All", "RPG", "Action", "Puzzle", "Horror", "Sim"].map((tag, index) => (
          <div
            key={tag}
            className={index === 0 ? "glass-blue rounded-md px-3 py-1.5 font-mono text-[10px] text-[var(--blue)]" : "glass-sm rounded-md px-3 py-1.5 font-mono text-[10px] text-[var(--text-muted)]"}
          >
            {tag}
          </div>
        ))}
      </div>
      <div className="mt-5 space-y-3">
        {[
          ["Temple of Ash", "Jackal Forge"],
          ["Midnight Harbour", "Northbound"],
          ["Astral Rooms", "Moonriver"],
          ["The Last Warden", "Kite & Lantern"]
        ].map(([title, creator], index) => (
          <div key={title} className="glass glass-hover flex items-center gap-4 rounded-xl px-5 py-4">
            <div
              className="h-[60px] w-[60px] rounded-lg"
              style={{
                background:
                  index % 2 === 0 ? "linear-gradient(135deg,#60a5fa,#a78bfa)" : "linear-gradient(135deg,#00e5cc,#60a5fa)"
              }}
            />
            <div className="flex-1">
              <div className="font-ui text-[14px] font-medium text-[var(--text-primary)]">{title}</div>
              <div className="mt-1 font-mono text-[10px] text-[var(--text-muted)]">{creator}</div>
              <div className="mt-2 flex gap-2">
                {["RPG", "Narrative"].map((tag) => (
                  <span key={tag} className="glass-sm rounded-sm px-2 py-0.5 font-mono text-[9px] text-[var(--text-muted)]">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <OrchestraButton variant="ghost" size="sm">
              PLAY
            </OrchestraButton>
          </div>
        ))}
      </div>
    </div>
  );
}
