"use client";

import { AppIcon } from "@/components/shared/AppIcon";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { handoverCards } from "@/lib/mockData";

export function ClientHandover() {
  return (
    <div className="space-y-6">
      <SectionHeader title="HANDOVER" subtitle="Everything your team needs after delivery" />
      <div className="grid gap-4 md:grid-cols-2">
        {handoverCards.client.map((card) => (
          <div key={card.title} className="rounded-xl border border-[#e8e8e8] bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-[#999999]">
              <AppIcon
                name={card.icon as Parameters<typeof AppIcon>[0]["name"]}
                className={
                  card.tone === "cyan"
                    ? "text-[#999999]"
                    : card.tone === "amber"
                      ? "text-[#854d0e]"
                      : card.tone === "red"
                        ? "text-[#991b1b]"
                        : "text-[#444444]"
                }
                size={15}
              />
              {card.title}
            </div>
            <div className="space-y-2">
              {card.items.map((item) => (
                <div key={item} className="font-sans text-[13px] text-[#444444]">
                  {item}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
