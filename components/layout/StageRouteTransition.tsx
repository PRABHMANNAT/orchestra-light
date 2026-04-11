"use client";

import { AnimatePresence, motion } from "framer-motion";

import { EASE_EXPO, pageContainer } from "@/lib/animations";

export function StageRouteTransition({
  stage,
  children
}: {
  stage: string;
  children: React.ReactNode;
}) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={stage}
        variants={pageContainer}
        initial="hidden"
        animate="show"
        exit={{ opacity: 0, y: -8, transition: { duration: 0.2 } }}
        transition={{ duration: 0.42, ease: EASE_EXPO }}
        className="min-h-full w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
