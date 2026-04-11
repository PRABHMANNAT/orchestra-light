"use client";

import { motion } from "framer-motion";

import { fadeSlideUp, pageContainer, staggerContainer } from "@/lib/animations";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { handoverCards } from "@/lib/mockData";

export function ClientHandover() {
  return (
    <motion.div variants={pageContainer} initial="hidden" animate="show" className="space-y-6">
      <SectionHeader title="HANDOVER" subtitle="Everything Tempest AI needs after delivery" />
      <motion.div variants={staggerContainer(0.07, 0.05)} initial="hidden" animate="show" className="grid gap-4 md:grid-cols-3">
        {handoverCards.client.map((card) => (
          <motion.div key={card.title} variants={fadeSlideUp} className="glass rounded-xl p-5">
            <div className="mb-4 font-mono text-[10px] tracking-[0.12em] text-[var(--text-muted)]">{card.title}</div>
            <div className="space-y-2">
              {card.items.map((item) => (
                <div key={item} className="font-ui text-[13px] leading-7 text-[var(--text-secondary)]">
                  {item}
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
