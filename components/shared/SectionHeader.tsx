"use client";

import { motion } from "framer-motion";

import { EASE_EXPO, fadeSlideUp, pageContainer } from "@/lib/animations";

interface SectionHeaderProps {
  title: string;
  subtitle: string;
  label?: string;
  accentColor?: string;
}

function withOpacity(color: string, opacity: number) {
  if (color.startsWith("var(")) {
    return `color-mix(in srgb, ${color} ${opacity * 100}%, transparent)`;
  }

  return color;
}

export function SectionHeader({ title, subtitle, label, accentColor = "var(--cyan)" }: SectionHeaderProps) {
  return (
    <motion.div variants={pageContainer} initial="hidden" animate="show" className="px-8 pb-6 pt-8">
      {label ? (
        <motion.div variants={fadeSlideUp} className="font-mono text-[10px] tracking-[0.2em]" style={{ color: accentColor }}>
          {label} ·
        </motion.div>
      ) : null}

      <motion.div
        variants={fadeSlideUp}
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(52px, 5vw, 80px)",
          letterSpacing: "0.01em",
          color: "var(--text-primary)",
          lineHeight: 0.95
        }}
      >
        {title}
      </motion.div>

      <motion.div variants={fadeSlideUp} className="mb-4 mt-3 flex gap-2">
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, ease: EASE_EXPO, delay: 0.12 }}
          style={{
            width: 48,
            height: 2,
            borderRadius: 1,
            transformOrigin: "left",
            background: accentColor
          }}
        />
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, ease: EASE_EXPO, delay: 0.18 }}
          style={{
            width: 20,
            height: 2,
            borderRadius: 1,
            transformOrigin: "left",
            background: withOpacity(accentColor, 0.3)
          }}
        />
      </motion.div>

      <motion.div
        variants={fadeSlideUp}
        style={{
          fontFamily: "var(--font-ui)",
          fontSize: 14,
          lineHeight: 1.55,
          color: "var(--text-secondary)",
          maxWidth: 600
        }}
      >
        {subtitle}
      </motion.div>
    </motion.div>
  );
}
