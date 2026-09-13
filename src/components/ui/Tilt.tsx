import { ReactNode, useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { TILT_SPRING } from "@/lib/motion";

type TiltProps = {
  children: ReactNode;
  className?: string;
  /** Max rotation in degrees at the corners of the element. */
  intensity?: number;
  /** How far the content lifts toward the viewer on hover, in px. */
  lift?: number;
  /** Renders the green light that follows the cursor across the surface. */
  glare?: boolean;
};

/**
 * Wraps content in a real 3D tilt that tracks the pointer.
 * The outer element owns the perspective; the inner one does the rotating,
 * so nested `translateZ` children stack correctly in the same 3D space.
 */
const Tilt = ({ children, className = "", intensity = 9, lift = 18, glare = true }: TiltProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  // Normalised pointer position, -0.5 … 0.5 on both axes.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const hovered = useMotionValue(0);

  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [intensity, -intensity]), TILT_SPRING);
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-intensity, intensity]), TILT_SPRING);
  const z = useSpring(useTransform(hovered, [0, 1], [0, lift]), TILT_SPRING);

  const glareOpacity = useSpring(hovered, TILT_SPRING);
  const glareBackground = useTransform([px, py], ([x, y]: number[]) => {
    const left = (x + 0.5) * 100;
    const top = (y + 0.5) * 100;
    return `radial-gradient(320px circle at ${left}% ${top}%, rgba(101,175,2,.22), transparent 65%)`;
  });

  const handleMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const node = ref.current;
    if (!node) return;

    const rect = node.getBoundingClientRect();
    px.set((event.clientX - rect.left) / rect.width - 0.5);
    py.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  const reset = () => {
    px.set(0);
    py.set(0);
    hovered.set(0);
  };

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div ref={ref} className={`scene-3d ${className}`}>
      <motion.div
        className="preserve-3d relative h-full w-full"
        style={{ rotateX, rotateY }}
        onPointerMove={handleMove}
        onPointerEnter={() => hovered.set(1)}
        onPointerLeave={reset}
      >
        <motion.div className="preserve-3d relative h-full w-full" style={{ z }}>
          {children}

          {glare && (
            <motion.span
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-[inherit] mix-blend-screen"
              style={{ opacity: glareOpacity, background: glareBackground }}
            />
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Tilt;
