import { Suspense, lazy } from "react";
import { useTranslation } from "react-i18next";
import { motion, useReducedMotion } from "framer-motion";
import { Check, MapPin, Plane } from "lucide-react";
import SceneBoundary from "@/components/SceneBoundary";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { useSceneSupport } from "@/lib/capabilities";

const CoverageScene = lazy(() => import("@/components/coverage/CoverageScene"));

type Hub = { name: string; province: string };
type Region = { country: string; hubs: Hub[] };
type Corridor = {
  eyebrow: string;
  title: string;
  description: string;
  from: string;
  from_value: string;
  to: string;
  to_value: string;
  modes: string[];
};

/** One end of the cross-border lane: a country label over its gateway cities. */
const Gateway = ({ label, value }: { label: string; value: string }) => (
  <div className="min-w-0">
    <p className="text-[10px] font-semibold uppercase tracking-[.18em] text-mist-faint">{label}</p>
    <p className="mt-1.5 font-display text-sm font-bold text-white sm:text-base">{value}</p>
  </div>
);

/**
 * The Canada ⇄ Saudi Arabia lane. The two countries sit on different maps, so
 * the link between them is drawn as its own band under the map rather than as
 * a route across the Canadian scene.
 */
const CorridorBand = ({ corridor }: { corridor: Corridor }) => {
  const reduced = useReducedMotion();

  return (
    <div className="glass rounded-3xl p-6 sm:p-8">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)] lg:items-center">
        <div>
          <span className="eyebrow">{corridor.eyebrow}</span>
          <h3 className="mt-4 font-display text-2xl font-bold tracking-tight text-white">
            {corridor.title}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-mist-dim">{corridor.description}</p>
        </div>

        <div>
          <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-4">
            <Gateway label={corridor.from} value={corridor.from_value} />

            {/* The lane itself, with a plane shuttling between the two ends.
                Kept LTR so the animation runs the same way in Arabic. */}
            <div dir="ltr" aria-hidden className="relative h-10 w-20 sm:w-40">
              <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 border-t border-dashed border-green/50" />
              <span className="absolute left-0 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-green" />
              <span className="absolute right-0 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-green" />
              <motion.span
                className="absolute top-1/2 -translate-y-1/2"
                initial={{ left: "10%" }}
                animate={reduced ? { left: "45%" } : { left: ["10%", "78%", "10%"] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              >
                <Plane className="h-4 w-4 text-green-light" />
              </motion.span>
            </div>

            <Gateway label={corridor.to} value={corridor.to_value} />
          </div>

          <ul className="mt-7 flex flex-wrap gap-2">
            {corridor.modes.map((mode) => (
              <li
                key={mode}
                className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[.04] px-3 py-1.5 text-xs text-mist"
              >
                <Check className="h-3 w-3 text-green" aria-hidden />
                {mode}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

/** Shown on low-power devices, with reduced motion, or if WebGL fails. */
const MapFallback = () => (
  <img
    src="/hero/canada-map.webp"
    alt=""
    width={802}
    height={504}
    loading="lazy"
    decoding="async"
    className="h-full w-full object-contain"
  />
);

const Coverage = () => {
  const { t } = useTranslation();
  const regions = t("coverage.regions", { returnObjects: true }) as Region[];
  const corridor = t("coverage.corridor", { returnObjects: true }) as Corridor;
  const sceneEnabled = useSceneSupport();

  return (
    <section
      id="coverage"
      className="relative overflow-hidden border-t border-white/5 py-24 md:py-32"
    >
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_70%_50%,rgba(10,60,112,.35),transparent_70%)]"
      />

      <div className="shell relative grid items-center gap-14 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
        <div>
          <Reveal>
            <span className="eyebrow">{t("coverage.eyebrow")}</span>
            <h2 className="mt-5 font-display text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              {t("coverage.title")}
            </h2>
            <p className="mt-4 text-mist">{t("coverage.description")}</p>
          </Reveal>

          <p className="mt-9 text-[11px] font-semibold uppercase tracking-[.18em] text-mist-faint">
            {t("coverage.legend")}
          </p>
          {regions.map((region, index) => (
            <RevealGroup key={region.country} className="mt-5" delay={0.15 + index * 0.1}>
              <p className="text-sm font-semibold text-white">{region.country}</p>
              <div className="mt-3 flex flex-wrap gap-2.5">
                {region.hubs.map((hub) => (
                  <RevealItem key={hub.name}>
                    <span className="group flex items-center gap-2 rounded-full border border-white/10 bg-white/[.04] px-4 py-2 text-sm text-mist transition-colors duration-300 hover:border-green/50 hover:text-white">
                      <MapPin
                        className="h-3.5 w-3.5 text-green transition-transform duration-300 group-hover:-translate-y-0.5"
                        aria-hidden
                      />
                      {hub.name}
                      <span className="text-[11px] text-mist-faint">{hub.province}</span>
                    </span>
                  </RevealItem>
                ))}
              </div>
            </RevealGroup>
          ))}
        </div>

        <Reveal delay={0.1} className="relative">
          <div className="relative aspect-[802/504] w-full">
            {sceneEnabled ? (
              <SceneBoundary fallback={<MapFallback />}>
                <Suspense fallback={<MapFallback />}>
                  <CoverageScene />
                </Suspense>
              </SceneBoundary>
            ) : (
              <MapFallback />
            )}
          </div>
        </Reveal>
      </div>

      <Reveal delay={0.1} className="shell relative mt-14">
        <CorridorBand corridor={corridor} />
      </Reveal>
    </section>
  );
};

export default Coverage;
