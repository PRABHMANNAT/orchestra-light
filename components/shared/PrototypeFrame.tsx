"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Compass,
  DollarSign,
  Monitor,
  Search,
  Smartphone,
  Sparkles,
  Tablet,
  UploadCloud,
  UserRoundPlus
} from "lucide-react";

import { fadeIn, scalePop } from "@/lib/animations";
import { prototypeScreens } from "@/lib/mockData";
import { cn } from "@/lib/utils";

interface PrototypeFrameProps {
  activeIndex: number;
  onChange: (index: number) => void;
  className?: string;
  variant?: "default" | "studio";
}

export function PrototypeFrame({
  activeIndex,
  onChange,
  className,
  variant = "default"
}: PrototypeFrameProps) {
  const [device, setDevice] = useState<"mac" | "ipad" | "iphone">("mac");
  const currentScreen = prototypeScreens[activeIndex];
  const isStudio = variant === "studio";

  const renderScreenContent = () => (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentScreen.id}
        variants={fadeIn}
        initial="hidden"
        animate="show"
        exit="hidden"
        className="h-full px-4 py-4"
      >
        {activeIndex === 0 ? <CreatorSignupScreen /> : null}
        {activeIndex === 1 ? <PortfolioUploadScreen /> : null}
        {activeIndex === 2 ? <MarketplaceScreen /> : null}
        {activeIndex === 3 ? <RevenueDashboardScreen /> : null}
        {activeIndex === 4 ? <DiscoveryFeedScreen /> : null}
      </motion.div>
    </AnimatePresence>
  );

  return (
    <div className={cn("space-y-4", className)}>
      {isStudio ? (
        <>
          <div className="flex items-center gap-2">
            <div className="glass-sm flex gap-1 rounded-md p-1">
              <button
                type="button"
                onClick={() => setDevice("mac")}
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-3 py-1.5 font-ui text-[11px] tracking-[0.08em] transition-all",
                  device === "mac"
                    ? "glass-blue text-[var(--blue)]"
                    : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                )}
              >
                <Monitor size={12} />
                MAC
              </button>
              <button
                type="button"
                onClick={() => setDevice("ipad")}
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-3 py-1.5 font-ui text-[11px] tracking-[0.08em] transition-all",
                  device === "ipad"
                    ? "glass-blue text-[var(--blue)]"
                    : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                )}
              >
                <Tablet size={12} />
                IPAD
              </button>
              <button
                type="button"
                onClick={() => setDevice("iphone")}
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-3 py-1.5 font-ui text-[11px] tracking-[0.08em] transition-all",
                  device === "iphone"
                    ? "glass-blue text-[var(--blue)]"
                    : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                )}
              >
                <Smartphone size={12} />
                IPHONE
              </button>
            </div>
            <span className="ml-2 font-mono text-[10px] tracking-[0.14em] text-[var(--text-muted)]">
              SCREEN {activeIndex + 1} OF {prototypeScreens.length} · {currentScreen.label}
            </span>
          </div>

          <div className="flex justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={device}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="w-full"
              >
                {device === "mac" ? (
                  <div className="mx-auto w-full max-w-[680px]">
                    <div className="glass flex items-center gap-2 rounded-t-xl px-4 py-3">
                      <div className="flex gap-1.5">
                        <div className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                        <div className="h-3 w-3 rounded-full bg-[#febc2e]" />
                        <div className="h-3 w-3 rounded-full bg-[#28c840]" />
                      </div>
                      <div className="mx-4 flex-1 rounded-md border border-[var(--border-default)] bg-[rgba(255,255,255,0.03)] px-3 py-1 text-center font-mono text-[11px] text-[var(--text-muted)]">
                        {currentScreen.url}
                      </div>
                    </div>
                    <div className="overflow-hidden rounded-b-[2.5rem] border border-[var(--border-default)] border-t-0 bg-[var(--bg-bg-2)]" style={{ height: "420px" }}>
                      {renderScreenContent()}
                    </div>
                  </div>
                ) : null}

                {device === "ipad" ? (
                  <div className="mx-auto" style={{ width: "420px" }}>
                    <div className="glass flex aspect-[4/3] flex-col rounded-[3rem] p-4">
                      <div className="mx-auto mb-2 h-2 w-2 rounded-full bg-[rgba(255,255,255,0.18)]" />
                      <div className="w-full flex-1 overflow-hidden rounded-[2.5rem] bg-[var(--bg-bg-2)]">
                        {renderScreenContent()}
                      </div>
                      <div className="mx-auto mt-2 h-1 w-16 rounded-full bg-[rgba(255,255,255,0.18)]" />
                    </div>
                  </div>
                ) : null}

                {device === "iphone" ? (
                  <div className="mx-auto" style={{ width: "220px" }}>
                    <div className="glass flex aspect-[9/19.5] flex-col rounded-[4rem] p-3">
                      <div className="mx-auto mb-2 h-4 w-16 rounded-full bg-[rgba(255,255,255,0.06)]" />
                      <div className="w-full flex-1 overflow-hidden rounded-[3rem] bg-[var(--bg-bg-2)]">
                        {renderScreenContent()}
                      </div>
                      <div className="mx-auto mt-2 h-1 w-12 rounded-full bg-[rgba(255,255,255,0.18)]" />
                    </div>
                  </div>
                ) : null}
              </motion.div>
            </AnimatePresence>
          </div>
        </>
      ) : (
        <div className="browser-frame glass glass-noise relative overflow-hidden rounded-xl">
          <div className="browser-chrome">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
            <div className="ml-2 flex items-center gap-2 text-[var(--text-muted)]">
              <ChevronLeft size={13} strokeWidth={1.5} />
              <ChevronRight size={13} strokeWidth={1.5} />
            </div>
            <div className="url-bar">{currentScreen.url}</div>
          </div>
          <div className="h-[440px] bg-[var(--bg-bg-2)]">{renderScreenContent()}</div>
        </div>
      )}

      {isStudio ? (
        <div className="flex flex-col items-center">
          <div className="flex flex-wrap justify-center gap-2">
            {prototypeScreens.map((screen, index) => (
              <button
                key={screen.id}
                type="button"
                onClick={() => onChange(index)}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-md border font-mono text-[10px] uppercase tracking-[0.12em] transition-all",
                  index === activeIndex
                    ? "glass-blue text-[var(--blue)]"
                    : "glass-sm text-[var(--text-muted)] hover:border-[var(--blue-border)] hover:text-[var(--blue)]"
                )}
              >
                {String(index + 1).padStart(2, "0")}
              </button>
            ))}
          </div>
          <div className="mt-2 text-center font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--text-muted)]">
            {currentScreen.label}
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {prototypeScreens.map((screen, index) => (
            <button
              key={screen.id}
              type="button"
              onClick={() => onChange(index)}
              className={cn(
                "rounded-md border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em]",
                index === activeIndex ? "glass-blue text-[var(--blue)]" : "glass-sm text-[var(--text-muted)]"
              )}
            >
              {screen.shortLabel} · {screen.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function CreatorSignupScreen() {
  return (
    <div className="glass-sm h-full rounded-xl p-5">
      <div className="mb-5 flex items-center gap-3">
        <div className="glass-blue flex h-9 w-9 items-center justify-center rounded-md">
          <UserRoundPlus size={16} className="text-[var(--blue)]" />
        </div>
        <div>
          <div className="font-title text-[28px] leading-none tracking-[0.06em] text-[var(--text-primary)]">CREATOR SIGNUP</div>
          <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--text-muted)]">Tempest AI · supply-side onboarding</div>
        </div>
      </div>
      <div className="grid gap-3">
        {["Studio name", "Creator email", "Primary genre"].map((item) => (
          <div key={item} className="glass-sm rounded-lg px-4 py-3">
            <div className="font-mono text-[9px] uppercase tracking-[0.12em] text-[var(--text-muted)]">{item}</div>
            <div className="mt-1 font-ui text-[12px] text-[var(--text-primary)]">
              {item === "Studio name" ? "Nebula Forge" : item === "Creator email" ? "creator@tempest.ai" : "Adventure · RPG"}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-5 flex gap-2">
        {["Free", "Pro", "Studio"].map((tier) => (
          <motion.div
            key={tier}
            variants={scalePop}
            initial="hidden"
            animate="show"
            className={cn(
              "rounded-md px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em]",
              tier === "Pro" ? "glass-blue text-[var(--blue)]" : "glass-sm text-[var(--text-secondary)]"
            )}
          >
            {tier}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function PortfolioUploadScreen() {
  return (
    <div className="grid h-full gap-4 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="glass-sm rounded-xl p-4">
        <div className="mb-3 flex items-center gap-2">
          <UploadCloud size={15} className="text-[var(--blue)]" />
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--text-muted)]">Portfolio upload</span>
        </div>
        <div className="space-y-3">
          {["Gameplay trailer.mp4", "Marketplace preview.png", "Build notes.txt"].map((file, index) => (
            <div key={file} className="glass-sm rounded-lg px-4 py-3">
              <div className="flex items-center justify-between">
                <span className="font-ui text-[12px] text-[var(--text-primary)]">{file}</span>
                <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-[var(--text-muted)]">
                  {index === 0 ? "uploaded" : "queued"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="glass-sm rounded-xl p-4">
        <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--text-muted)]">Linked games</div>
        <div className="grid gap-3">
          {["Dungeons of Tempest", "Starfall Cartographer", "Warden's Loop"].map((game) => (
            <div key={game} className="glass-sm flex items-center justify-between rounded-lg px-4 py-3">
              <span className="font-ui text-[12px] text-[var(--text-primary)]">{game}</span>
                <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-[var(--blue)]">linked</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MarketplaceScreen() {
  return (
    <div className="grid h-full gap-4 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="glass-sm rounded-xl p-4">
        <div className="mb-3 flex items-center gap-2">
          <Search size={15} className="text-[var(--blue)]" />
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--text-muted)]">Marketplace inventory</span>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {["Animated tavern pack", "RPG inventory UI", "Quest dialogue kit", "Dungeon tileset"].map((asset) => (
            <div key={asset} className="glass-sm rounded-lg p-3">
              <div className="h-20 rounded-md bg-[rgba(255,255,255,0.04)]" />
              <div className="mt-3 font-ui text-[12px] text-[var(--text-primary)]">{asset}</div>
              <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.12em] text-[var(--text-muted)]">Tags · preview · publish-ready</div>
            </div>
          ))}
        </div>
      </div>
      <div className="glass-sm rounded-xl p-4">
        <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--text-muted)]">Publish summary</div>
        <div className="space-y-3">
          {[
            ["Listing status", "Ready to publish"],
            ["Visibility", "Featured creator feed"],
            ["Revenue split", "70 / 30 default"]
          ].map(([label, value]) => (
            <div key={label} className="glass-sm rounded-lg px-4 py-3">
              <div className="font-mono text-[9px] uppercase tracking-[0.12em] text-[var(--text-muted)]">{label}</div>
              <div className="mt-1 font-ui text-[12px] text-[var(--text-primary)]">{value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RevenueDashboardScreen() {
  return (
    <div className="grid h-full gap-4 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="glass-sm rounded-xl p-4">
        <div className="mb-3 flex items-center gap-2">
          <DollarSign size={15} className="text-[var(--blue)]" />
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--text-muted)]">Payout status</span>
        </div>
        <div className="glass-blue rounded-lg px-4 py-4">
          <div className="font-title text-[34px] leading-none text-[var(--text-primary)]">$12.4K</div>
          <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.12em] text-[var(--text-muted)]">available for payout</div>
        </div>
        <div className="mt-3 space-y-3">
          {["Stripe verification pending", "ABN required", "Banking details awaiting founder"].map((row) => (
            <div key={row} className="glass-sm rounded-lg px-4 py-3 font-ui text-[12px] text-[var(--text-secondary)]">
              {row}
            </div>
          ))}
        </div>
      </div>
      <div className="glass-sm rounded-xl p-4">
        <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--text-muted)]">Revenue split preview</div>
        <div className="grid gap-3 md:grid-cols-3">
          {[
            ["Creator share", "70%"],
            ["Tempest share", "30%"],
            ["Pro creator target", "80 / 20"]
          ].map(([label, value]) => (
            <div key={label} className="glass-sm rounded-lg px-4 py-4">
              <div className="font-title text-[32px] leading-none text-[var(--text-primary)]">{value}</div>
              <div className="mt-2 font-mono text-[9px] uppercase tracking-[0.12em] text-[var(--text-muted)]">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DiscoveryFeedScreen() {
  return (
    <div className="grid h-full gap-4 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="glass-sm rounded-xl p-4">
        <div className="mb-3 flex items-center gap-2">
          <Compass size={15} className="text-[var(--blue)]" />
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--text-muted)]">Discovery feed</span>
        </div>
        <div className="space-y-3">
          {["Trending this week", "Featured creators", "AI picks (V2)", "Adventure spotlight"].map((module, index) => (
            <div key={module} className="glass-sm rounded-lg px-4 py-3">
              <div className="flex items-center justify-between">
                <span className="font-ui text-[12px] text-[var(--text-primary)]">{module}</span>
                <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-[var(--text-muted)]">
                  {index === 2 ? "deferred" : "active"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="glass-sm rounded-xl p-4">
        <div className="mb-3 flex items-center gap-2">
          <Sparkles size={15} className="text-[var(--blue)]" />
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--text-muted)]">Featured game cards</span>
        </div>
        <div className="space-y-3">
          {["Tides of Auren", "Hexlight Hollow", "Clockwork Caverns"].map((game) => (
            <div key={game} className="glass-sm rounded-lg p-3">
              <div className="h-16 rounded-md bg-[rgba(255,255,255,0.04)]" />
              <div className="mt-3 font-ui text-[12px] text-[var(--text-primary)]">{game}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
