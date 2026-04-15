import { type Transition, type Variants } from "framer-motion";

export const EASE_OUT_EXPO: Transition["ease"] = [0.16, 1, 0.3, 1];
export const EASE_IN_OUT_CIRC: Transition["ease"] = [0.85, 0, 0.15, 1];
export const EASE_EXPO: Transition["ease"] = EASE_OUT_EXPO;
export const EASE_CIRC: Transition["ease"] = EASE_IN_OUT_CIRC;
export const SPRING_SNAPPY: Transition = { type: "spring", stiffness: 400, damping: 30 };
export const SPRING_SOFT: Transition = { type: "spring", stiffness: 200, damping: 25 };
export const SPRING_BOUNCY: Transition = { type: "spring", stiffness: 500, damping: 22 };
export const COUNT_UP_DURATION = 1.4;

export const pageContainer: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06, delayChildren: 0.05 }
  }
};

export const fadeSlideUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_OUT_EXPO } }
};

export const fadeSlideUpFast: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: EASE_OUT_EXPO } }
};

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0, transition: { duration: 0.4, ease: EASE_OUT_EXPO } }
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  show: { opacity: 1, x: 0, transition: { duration: 0.45, ease: EASE_OUT_EXPO } }
};

export const scalePop: Variants = {
  hidden: { opacity: 0, scale: 0.7 },
  show: { opacity: 1, scale: 1, transition: SPRING_BOUNCY }
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.4 } }
};

export const staggerContainer = (stagger = 0.07, delay = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren: delay } }
});

export const cardHover: Variants = {
  rest: { y: 0, boxShadow: "0 8px 22px rgba(0,0,0,0.22)" },
  hover: {
    y: -2,
    boxShadow: "0 14px 34px rgba(0,229,204,0.1)",
    transition: { type: "spring", stiffness: 260, damping: 28 }
  }
};

export const glowBorder = {
  rest: { borderColor: "rgba(42,42,58,1)" },
  hover: { borderColor: "rgba(0,229,204,0.5)", transition: { duration: 0.25 } }
};

export const livePulse: Variants = {
  hidden: { scale: 1, opacity: 1 },
  show: {
    scale: [1, 1.4, 1],
    opacity: [1, 0.4, 1],
    transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
  }
};

export const terminalLine: Variants = {
  hidden: { opacity: 0, x: -8 },
  show: { opacity: 1, x: 0, transition: { duration: 0.2, ease: "easeOut" } }
};

export const drawerSlide: Variants = {
  hidden: { opacity: 0, x: "100%" },
  show: { opacity: 1, x: 0, transition: { duration: 0.4, ease: EASE_IN_OUT_CIRC } },
  exit: { opacity: 0, x: "100%", transition: { duration: 0.3, ease: EASE_IN_OUT_CIRC } }
};

export const numberReveal: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_OUT_EXPO } }
};

export const skeletonToContent: Variants = {
  hidden: { opacity: 0, filter: "blur(4px)" },
  show: {
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: EASE_OUT_EXPO }
  }
};

export const alertSlideDown: Variants = {
  hidden: { opacity: 0, y: -16, scaleY: 0.8 },
  show: {
    opacity: 1,
    y: 0,
    scaleY: 1,
    transition: { duration: 0.4, ease: EASE_OUT_EXPO }
  }
};

export const approvalBurst: Variants = {
  hidden: { scale: 0, opacity: 0 },
  show: {
    scale: [0, 1.2, 1],
    opacity: [0, 1, 1],
    transition: { duration: 0.5, ease: EASE_OUT_EXPO }
  }
};

export const chipBounce: Variants = {
  hidden: { opacity: 0, scale: 0.6, y: 6 },
  show: { opacity: 1, scale: 1, y: 0, transition: SPRING_BOUNCY }
};

export const progressFill = (pct: number) => ({
  hidden: { scaleX: 0 },
  show: {
    scaleX: pct / 100,
    transition: { duration: 1.2, ease: EASE_OUT_EXPO, delay: 0.3 }
  }
});

export const ringDraw = (circumference: number, pct: number) => ({
  hidden: { strokeDashoffset: circumference },
  show: {
    strokeDashoffset: circumference - (circumference * pct) / 100,
    transition: { duration: 1.6, ease: EASE_IN_OUT_CIRC, delay: 0.2 }
  }
});

export const heightReveal: Variants = {
  hidden: { opacity: 0, height: 0 },
  show: {
    opacity: 1,
    height: "auto",
    transition: { duration: 0.38, ease: EASE_OUT_EXPO }
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: { duration: 0.28, ease: EASE_IN_OUT_CIRC }
  }
};
