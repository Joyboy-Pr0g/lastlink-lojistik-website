import type { SpringOptions, Variants } from "framer-motion";

/** Shared easing so every animation on the page feels like one system. */
export const EASE = [0.16, 1, 0.3, 1] as const;

/** Loose spring for page-level parallax. Consumed by `useSpring`. */
export const SPRING: SpringOptions = { stiffness: 140, damping: 18, mass: 0.6 };

/** Tight spring for pointer-driven 3D tilt — fast enough to feel attached to the cursor. */
export const TILT_SPRING: SpringOptions = { stiffness: 260, damping: 22, mass: 0.5 };

/** Parent that staggers its children as the group scrolls into view. */
export const stagger = (delayChildren = 0, staggerChildren = 0.08): Variants => ({
  hidden: {},
  show: { transition: { delayChildren, staggerChildren } }
});

/** Text and cards rise while rotating out of the floor plane — the 3D entrance. */
export const riseIn: Variants = {
  hidden: { opacity: 0, y: 34, rotateX: -12 },
  show: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: 0.75, ease: EASE }
  }
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.9, ease: EASE } }
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: EASE } }
};

export const slideFrom = (x: number): Variants => ({
  hidden: { opacity: 0, x },
  show: { opacity: 1, x: 0, transition: { duration: 0.8, ease: EASE } }
});

/** Every reveal uses the same viewport rule so the page reveals at a consistent depth. */
export const VIEWPORT = { once: true, amount: 0.25 } as const;
