import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { EASE } from "@/lib/motion";

export type HudChip = { Icon: LucideIcon; label: string };

type MediaHudProps = {
  /** Shown top-left, e.g. "STEP 01". */
  kicker: string;
  /** Small telemetry pills along the bottom. */
  chips: HudChip[];
  /** Adds the sweeping scan line. */
  scan?: boolean;
};

const CORNER = "absolute h-7 w-7 border-green/70";

/**
 * Instrument overlay for the journey media: framing corners, a scan sweep and
 * telemetry chips, so each clip reads as a monitored operation rather than
 * decorative footage.
 */
const MediaHud = ({ kicker, chips, scan = true }: MediaHudProps) => (
  <div aria-hidden className="pointer-events-none absolute inset-0">
    {/* Readability wash under the chips. */}
    <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-transparent to-navy-950/45" />

    {/* Framing corners. */}
    <span className={`${CORNER} left-4 top-4 border-l-2 border-t-2 rounded-tl-lg`} />
    <span className={`${CORNER} right-4 top-4 border-r-2 border-t-2 rounded-tr-lg`} />
    <span className={`${CORNER} bottom-4 left-4 border-b-2 border-l-2 rounded-bl-lg`} />
    <span className={`${CORNER} bottom-4 right-4 border-b-2 border-r-2 rounded-br-lg`} />

    {/* Scan sweep. */}
    {scan && (
      <motion.span
        className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-green/70 to-transparent"
        initial={{ top: "8%" }}
        animate={{ top: ["8%", "92%", "8%"] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
    )}

    {/* Step badge. */}
    <div className="absolute left-8 top-8 flex items-center gap-2.5 rounded-full border border-white/12 bg-navy-950/75 px-3.5 py-1.5 backdrop-blur-md">
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green" />
      </span>
      <span className="text-[10px] font-semibold uppercase tracking-[.2em] text-white">
        {kicker}
      </span>
    </div>

    {/* Telemetry chips. */}
    <div className="absolute inset-x-8 bottom-8 flex flex-wrap gap-2">
      {chips.map((chip, index) => (
        <motion.span
          key={chip.label}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.25 + index * 0.12, ease: EASE }}
          className="flex items-center gap-1.5 rounded-lg border border-white/12 bg-navy-950/70 px-2.5 py-1.5 backdrop-blur-md"
        >
          <chip.Icon className="h-3 w-3 text-green" />
          <span className="text-[10px] font-medium uppercase tracking-[.12em] text-mist">
            {chip.label}
          </span>
        </motion.span>
      ))}
    </div>
  </div>
);

export default MediaHud;
