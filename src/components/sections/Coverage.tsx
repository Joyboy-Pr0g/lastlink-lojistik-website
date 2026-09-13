import { Suspense, lazy } from "react";
import { useTranslation } from "react-i18next";
import { MapPin } from "lucide-react";
import SceneBoundary from "@/components/SceneBoundary";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { useSceneSupport } from "@/lib/capabilities";

const CoverageScene = lazy(() => import("@/components/coverage/CoverageScene"));

type Hub = { name: string; province: string };

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
  const hubs = t("coverage.hubs", { returnObjects: true }) as Hub[];
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

          <RevealGroup className="mt-9" delay={0.15}>
            <p className="text-[11px] font-semibold uppercase tracking-[.18em] text-mist-faint">
              {t("coverage.legend")}
            </p>
            <div className="mt-4 flex flex-wrap gap-2.5">
              {hubs.map((hub) => (
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
    </section>
  );
};

export default Coverage;
