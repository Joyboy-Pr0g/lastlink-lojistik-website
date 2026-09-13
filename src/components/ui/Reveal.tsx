import { ReactNode } from "react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { VIEWPORT, riseIn, stagger } from "@/lib/motion";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  variants?: Variants;
};

/** Single element rising out of the floor plane when it scrolls into view. */
export const Reveal = ({ children, className = "", delay = 0, variants = riseIn }: RevealProps) => (
  <motion.div
    className={className}
    initial="hidden"
    whileInView="show"
    viewport={VIEWPORT}
    variants={variants}
    transition={{ delay }}
    style={{ transformPerspective: 900 }}
  >
    {children}
  </motion.div>
);

/** Wrapper that staggers its Reveal-shaped children as a group. */
export const RevealGroup = ({
  children,
  className = "",
  delay = 0,
  gap = 0.08
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  gap?: number;
}) => (
  <motion.div
    className={className}
    initial="hidden"
    whileInView="show"
    viewport={VIEWPORT}
    variants={stagger(delay, gap)}
  >
    {children}
  </motion.div>
);

/** Child of RevealGroup — inherits the parent's stagger timing. */
export const RevealItem = ({
  children,
  className = "",
  variants = riseIn
}: {
  children: ReactNode;
  className?: string;
  variants?: Variants;
}) => (
  <motion.div className={className} variants={variants} style={{ transformPerspective: 900 }}>
    {children}
  </motion.div>
);

export default Reveal;
