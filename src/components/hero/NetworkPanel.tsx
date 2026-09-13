import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { animate, motion, useInView, useReducedMotion } from "framer-motion";
import { Activity, ArrowUpRight, Boxes, Gauge } from "lucide-react";
import { useRef } from "react";
import { EASE } from "@/lib/motion";

/** Deterministic bar heights — an operations readout, not random noise. */
const LOAD = [38, 52, 44, 61, 55, 72, 66, 81, 74, 88, 79, 92];

const METRICS = [
  { key: "in_transit", Icon: Boxes, target: 12480, decimals: 0 },
  { key: "lanes", Icon: Activity, target: 38, decimals: 0 },
  { key: "on_time", Icon: Gauge, target: 99.2, decimals: 1, suffix: "%" }
] as const;

const Metric = ({
  label,
  Icon,
  target,
  decimals,
  suffix = "",
  delay
}: {
  label: string;
  Icon: typeof Boxes;
  target: number;
  decimals: number;
  suffix?: string;
  delay: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduced = useReducedMotion();
  const [value, setValue] = useState(reduced ? target : 0);

  useEffect(() => {
    if (!inView || reduced) return;

    const controls = animate(0, target, {
      duration: 1.8,
      delay,
      ease: EASE,
      onUpdate: setValue
    });

    return () => controls.stop();
  }, [inView, reduced, target, delay]);

  return (
    <div ref={ref} className="flex items-center justify-between gap-4 py-3">
      <span className="flex items-center gap-2.5 text-[12px] text-mist-dim">
        <Icon className="h-3.5 w-3.5 text-green" aria-hidden />
        {label}
      </span>
      <span className="font-display text-[15px] font-bold tabular-nums text-white">
        {value.toLocaleString(undefined, {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals
        })}
        <span className="text-green">{suffix}</span>
      </span>
    </div>
  );
};

/**
 * The hero's floating object: a live network readout. Replaces the single
 * mock tracking number with something that reads as an operations console.
 */
const NetworkPanel = () => {
  const { t } = useTranslation();
  const reduced = useReducedMotion();

  return (
    // Semi-transparent so the hero footage still reads behind it, with a heavy
    // blur underneath so the numbers stay legible over any frame.
    <motion.div
      animate={reduced ? {} : { y: [0, -9, 0] }}
      transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      className="preserve-3d relative overflow-hidden rounded-3xl border border-white/12 bg-navy-950/72 p-6 shadow-lift backdrop-blur-2xl backdrop-saturate-150"
    >
      {/* Header row. */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[.2em] text-mist-faint">
            {t("hero.panel.eyebrow")}
          </p>
          <p className="mt-1.5 font-display text-lg font-bold leading-tight text-white [transform:translateZ(28px)]">
            {t("hero.panel.title")}
          </p>
        </div>

        <span className="flex shrink-0 items-center gap-1.5 rounded-full border border-green/30 bg-green/10 px-2.5 py-1">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green" />
          </span>
          <span className="text-[9px] font-bold uppercase tracking-[.16em] text-green-light">
            {t("hero.panel.live")}
          </span>
        </span>
      </div>

      {/* Throughput bars over the last twelve hours. */}
      <div className="mt-6 flex h-16 items-end gap-1 [transform:translateZ(16px)]">
        {LOAD.map((height, index) => (
          <motion.span
            key={index}
            className="flex-1 rounded-sm bg-gradient-to-t from-green-dark/40 to-green"
            initial={{ height: "8%", opacity: 0 }}
            animate={{ height: `${height}%`, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.15 + index * 0.05, ease: EASE }}
          />
        ))}
      </div>
      <p className="mt-2 text-[10px] uppercase tracking-[.14em] text-mist-faint">
        {t("hero.panel.throughput")}
      </p>

      {/* Metrics. */}
      <div className="mt-4 divide-y divide-white/8 border-t border-white/8">
        {METRICS.map((metric, index) => (
          <Metric
            key={metric.key}
            label={t(`hero.panel.metrics.${metric.key}`)}
            Icon={metric.Icon}
            target={metric.target}
            decimals={metric.decimals}
            suffix={"suffix" in metric ? metric.suffix : ""}
            delay={1.3 + index * 0.15}
          />
        ))}
      </div>

      <a
        href="#coverage"
        className="group mt-4 flex items-center justify-between rounded-xl border border-white/10 bg-white/[.03] px-4 py-3 transition-colors hover:border-green/40"
      >
        <span className="text-[12px] font-medium text-mist">{t("hero.panel.cta")}</span>
        <ArrowUpRight
          className="h-3.5 w-3.5 text-green transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          aria-hidden
        />
      </a>
    </motion.div>
  );
};

export default NetworkPanel;
