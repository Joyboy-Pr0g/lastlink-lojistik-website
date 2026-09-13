import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  CameraOff,
  Home,
  MapPin,
  PackageCheck,
  PackagePlus,
  Radio,
  Route,
  ScanLine,
  ShieldCheck,
  Thermometer,
  Timer,
  Truck
} from "lucide-react";
import VideoPanel from "@/components/ui/VideoPanel";
import MediaHud from "@/components/journey/MediaHud";
import Tilt from "@/components/ui/Tilt";
import { Reveal } from "@/components/ui/Reveal";
import NetworkBackdrop from "@/components/ui/NetworkBackdrop";
import { useIsDesktop } from "@/lib/useMediaQuery";
import { EASE } from "@/lib/motion";

type Step = { kicker: string; title: string; description: string };

const ICONS = [PackagePlus, Route, Home];

/** Telemetry shown over each step's media. */
const HUD_CHIPS = [
  [
    { Icon: ScanLine, label: "Label scanned" },
    { Icon: Thermometer, label: "4°C hold" },
    { Icon: ShieldCheck, label: "Seal intact" }
  ],
  [
    { Icon: Radio, label: "GPS lock" },
    { Icon: Truck, label: "Lane active" },
    { Icon: Timer, label: "On schedule" }
  ],
  [
    { Icon: MapPin, label: "Geofence hit" },
    { Icon: CameraOff, label: "Proof captured" },
    { Icon: PackageCheck, label: "Delivered" }
  ]
];

const JourneySection = () => {
  const { t } = useTranslation();
  const steps = t("journey.steps", { returnObjects: true }) as Step[];

  const trackRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState(0);
  // Only one of the two layouts mounts, so each video is downloaded once.
  const isDesktop = useIsDesktop();

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"]
  });

  const railScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  // The media follows whichever step block is crossing the middle of the
  // viewport. Deriving it from raw scroll progress instead drifts out of sync,
  // because the pinned media and the taller text column scroll at different rates.
  useEffect(() => {
    if (!isDesktop) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visible) return;

        const index = Number((visible.target as HTMLElement).dataset.step);
        if (!Number.isNaN(index)) setActive((current) => (current === index ? current : index));
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.2, 0.5, 1] }
    );

    stepRefs.current.forEach((node) => node && observer.observe(node));
    return () => observer.disconnect();
  }, [isDesktop, steps.length]);

  const media = [
    <VideoPanel
      key="pickup"
      src="/vid/pickup.mp4"
      poster="/vid/pickup.jpg"
      className="h-full w-full object-cover"
    />,
    <VideoPanel
      key="transit"
      src="/vid/hero.mp4"
      poster="/vid/hero.jpg"
      className="h-full w-full object-cover"
    />,
    <VideoPanel
      key="dropoff"
      src="/vid/dropoff.mp4"
      poster="/vid/dropoff.jpg"
      className="h-full w-full object-cover"
    />
  ];

  /** Media plus its instrument overlay, used by both layouts. */
  const renderMedia = (index: number) => (
    <>
      {media[index]}
      <MediaHud kicker={steps[index]?.kicker ?? ""} chips={HUD_CHIPS[index] ?? []} />
    </>
  );

  return (
    <section id="journey" className="relative border-t border-white/5 py-24 md:py-32">
      <NetworkBackdrop opacity={0.5} seed={53} />
      <div className="shell">
        <Reveal className="max-w-2xl">
          <span className="eyebrow">{t("journey.eyebrow")}</span>
          <h2 className="mt-5 font-display text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            {t("journey.title")}
          </h2>
          <p className="mt-4 text-mist">{t("journey.description")}</p>
        </Reveal>
      </div>

      {/* Desktop: media pinned while the step copy scrolls past it. */}
      {isDesktop && (
      <div ref={trackRef} className="shell mt-16">
        <div className="grid gap-16 lg:grid-cols-2">
          <div className="relative">
            <div className="sticky top-28">
              <Tilt intensity={7} lift={14} glare={false}>
                <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-white/10 shadow-lift">
                  {media.map((_, index) => (
                    <motion.div
                      key={index}
                      className="absolute inset-0"
                      initial={false}
                      animate={{
                        opacity: active === index ? 1 : 0,
                        scale: active === index ? 1 : 1.06
                      }}
                      transition={{ duration: 0.7, ease: EASE }}
                      style={{ pointerEvents: active === index ? "auto" : "none" }}
                    >
                      {renderMedia(index)}
                    </motion.div>
                  ))}
                </div>
              </Tilt>
            </div>
          </div>

          <div className="relative pl-10">
            {/* Progress rail tied directly to scroll position. */}
            <div className="absolute left-0 top-0 h-full w-px bg-white/10">
              <motion.div
                className="h-full w-px origin-top bg-gradient-to-b from-green-light to-green-dark"
                style={{ scaleY: railScale }}
              />
            </div>

            {steps.map((step, index) => {
              const Icon = ICONS[index] ?? PackagePlus;
              const isActive = active === index;

              return (
                <div
                  key={step.title}
                  data-step={index}
                  ref={(node) => {
                    stepRefs.current[index] = node;
                  }}
                  // Each step holds the viewport for roughly one screen of
                  // scrolling, so no step flashes past faster than the others.
                  className="flex min-h-[92vh] flex-col justify-center py-10"
                >
                  <motion.div
                    animate={{ opacity: isActive ? 1 : 0.32 }}
                    transition={{ duration: 0.5, ease: EASE }}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`grid h-11 w-11 place-items-center rounded-2xl border transition-colors duration-500 ${
                          isActive
                            ? "border-green/50 bg-green/15 text-green-light shadow-glow"
                            : "border-white/10 bg-white/5 text-mist-dim"
                        }`}
                      >
                        <Icon className="h-5 w-5" aria-hidden />
                      </span>
                      <span className="text-[11px] font-semibold uppercase tracking-[.2em] text-green-light">
                        {step.kicker}
                      </span>
                    </div>

                    <h3 className="mt-6 font-display text-3xl font-bold tracking-tight xl:text-4xl">
                      {step.title}
                    </h3>
                    <p className="mt-4 max-w-md text-mist">{step.description}</p>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      )}

      {/* Mobile: each step is its own stacked card. */}
      {!isDesktop && (
      <div className="shell mt-12 flex flex-col gap-10">
        {steps.map((step, index) => {
          const Icon = ICONS[index] ?? PackagePlus;

          return (
            <Reveal key={step.title} className="overflow-hidden rounded-3xl border border-white/10">
              <div className="relative aspect-[16/10]">{renderMedia(index)}</div>

              <div className="bg-white/[.03] p-6">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl border border-green/40 bg-green/15 text-green-light">
                    <Icon className="h-4 w-4" aria-hidden />
                  </span>
                  <span className="text-[11px] font-semibold uppercase tracking-[.2em] text-green-light">
                    {step.kicker}
                  </span>
                </div>
                <h3 className="mt-4 font-display text-2xl font-bold">{step.title}</h3>
                <p className="mt-3 text-sm text-mist">{step.description}</p>
              </div>
            </Reveal>
          );
        })}
      </div>
      )}
    </section>
  );
};

export default JourneySection;
