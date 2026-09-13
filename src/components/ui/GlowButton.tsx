import { ReactNode, useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { TILT_SPRING } from "@/lib/motion";

type Variant = "primary" | "outline" | "ghost";

type GlowButtonProps = {
  children: ReactNode;
  /** Required: it becomes the whole face of the button on hover. */
  icon: ReactNode;
  href?: string;
  type?: "button" | "submit";
  variant?: Variant;
  className?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  onClick?: () => void;
  "aria-label"?: string;
};

const BASE =
  "group relative inline-flex select-none items-center justify-center overflow-hidden rounded-full px-7 py-3.5 text-sm font-semibold tracking-tight transition-shadow duration-300 disabled:cursor-not-allowed disabled:opacity-50";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-green text-navy-950 shadow-[0_10px_28px_-12px_rgba(101,175,2,.8)] hover:shadow-[0_16px_40px_-12px_rgba(101,175,2,.9)]",
  outline: "border border-white/18 text-white hover:border-white/35",
  ghost: "text-mist hover:text-white"
};

/**
 * Magnetic button whose label is a rotating 3D block. The front face carries
 * the label and its icon; the underside carries the icon alone. Hovering rolls
 * the block forward, so the text turns away and the icon arrives centred.
 */
const GlowButton = ({
  children,
  icon,
  href,
  type = "button",
  variant = "primary",
  className = "",
  disabled,
  fullWidth = false,
  onClick,
  ...rest
}: GlowButtonProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const px = useMotionValue(0);
  const py = useMotionValue(0);

  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [11, -11]), TILT_SPRING);
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-15, 15]), TILT_SPRING);
  const shiftX = useSpring(useTransform(px, [-0.5, 0.5], [-5, 5]), TILT_SPRING);
  const shiftY = useSpring(useTransform(py, [-0.5, 0.5], [-4, 4]), TILT_SPRING);

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
  };

  const face = "flex items-center justify-center gap-2 whitespace-nowrap";

  const inner = (
    <>
      {/* Light sweeping across the face on hover. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-[850ms] ease-out group-hover:translate-x-full"
      />

      {/* The rolling block. 11px is half the 22px line box, so the two faces
          meet exactly at the front-bottom edge and the roll has no seam. */}
      <span className="relative z-10 block leading-[22px] [perspective:420px]">
        <span className="preserve-3d relative block transition-transform duration-[620ms] ease-[cubic-bezier(.62,.03,.31,1)] group-hover:[transform:rotateX(-90deg)]">
          {/* Resting face: label, then icon. */}
          <span className={`${face} [transform:translateZ(11px)]`}>
            {children}
            {icon}
          </span>

          {/* Hover face: the icon alone, centred in the same box. */}
          <span
            aria-hidden
            className={`${face} absolute inset-0 [transform:rotateX(90deg)_translateZ(11px)]`}
          >
            <span className="transition-transform duration-500 ease-out group-hover:scale-125">
              {icon}
            </span>
          </span>
        </span>
      </span>
    </>
  );

  const classes = `${BASE} ${VARIANTS[variant]} ${fullWidth ? "w-full" : ""} ${className}`;

  const control = href ? (
    <a href={href} className={classes} {...rest}>
      {inner}
    </a>
  ) : (
    <button type={type} onClick={onClick} disabled={disabled} className={classes} {...rest}>
      {inner}
    </button>
  );

  if (reduced) return control;

  return (
    <div ref={ref} className={`scene-3d ${fullWidth ? "block w-full" : "inline-block"}`}>
      <motion.div
        className="preserve-3d"
        style={{ rotateX, rotateY, x: shiftX, y: shiftY }}
        whileTap={{ scale: 0.96 }}
        onPointerMove={handleMove}
        onPointerLeave={reset}
      >
        {control}
      </motion.div>
    </div>
  );
};

export default GlowButton;
