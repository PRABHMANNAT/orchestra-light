"use client";

import { AnimatePresence, motion } from "framer-motion";

import { EASE_EXPO, pageContainer } from "@/lib/animations";
import { DevMyWork } from "@/components/dev/DevMyWork";

export default function DevPage() {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="dev-my-work"
        variants={pageContainer}
        initial="hidden"
        animate="show"
        exit={{ opacity: 0, y: -8, transition: { duration: 0.2, ease: EASE_EXPO } }}
        className="w-full"
      >
        <DevMyWork />
      </motion.div>
    </AnimatePresence>
  );
}
