"use client";

import { motion } from "framer-motion";

interface SectionHeaderProps {
  title: string;
  subtitle: string;
  badge?: string;
}

export function SectionHeader({ title, subtitle, badge }: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="mb-8"
    >
      {badge ? (
        <span className="mb-2 block font-mono text-[10px] uppercase tracking-widest text-[#999999]">
          {badge}
        </span>
      ) : null}
      <h1 className="font-title text-[72px] leading-none tracking-tight text-[#111111]">{title}</h1>
      <div className="mb-2 mt-3 flex items-center gap-2">
        <div className="h-1 w-10 rounded-full bg-[#111111]" />
        <div className="h-1 w-4 rounded-full bg-[#d1d5db]" />
      </div>
      <p className="mt-2 font-sans text-[15px] text-[#666666]">{subtitle}</p>
    </motion.div>
  );
}
