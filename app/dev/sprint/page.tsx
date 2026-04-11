"use client";

import { AnimatePresence, motion } from "framer-motion";

import { EASE_EXPO, pageContainer } from "@/lib/animations";
import { DevBoard } from "@/components/dev/DevBoard";

export default function DevSprintPage() {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="dev-sprint"
        variants={pageContainer}
        initial="hidden"
        animate="show"
        exit={{ opacity: 0, y: -8, transition: { duration: 0.2, ease: EASE_EXPO } }}
        className="w-full"
      >
        <DevBoard />
      </motion.div>
    </AnimatePresence>
  );
}
