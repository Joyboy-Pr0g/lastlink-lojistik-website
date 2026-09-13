import { useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform
} from "framer-motion";
import { ArrowDown, PackageCheck, Truck } from "lucide-react";
import GlowButton from "@/components/ui/GlowButton";
import VideoPanel from "@/components/ui/VideoPanel";
import NetworkPanel from "@/components/hero/NetworkPanel";
import Tilt from "@/components/ui/Tilt";
import { EASE, SPRING } from "@/lib/motion";
import { useSplashDone } from "@/lib/splashState";

const LINE_VARIANTS = {
  hidden: { opacity: 0, y: 48, rotateX: -40 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: 0.9, ease: EASE, delay: 0.35 + i * 0.12 }
  })
};

const Hero = () => {
  const { t } = useTranslation();
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  const ticker = t("hero.ticker", { returnObjects: true }) as string[];
  // Hold the 9 MB hero clip off the network until the splash has finished.
  const splashDone = useSplashDone();

  // Scroll drives a slow push-in on the video so the hero feels like a camera move.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]
  });
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.18]);
  const videoY = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "36%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  // Pointer drives a small counter-parallax between the video and the content.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const parallaxX = useSpring(useTransform(mx, [-0.5, 0.5], [18, -18]), SPRING);
  const parallaxY = useSpring(useTransform(my, [-0.5, 0.5], [12, -12]), SPRING);

  const handleMove = (event: React.PointerEvent<HTMLElement>) => {
    if (reduced) return;
    mx.set(event.clientX / window.innerWidth - 0.5);
    my.set(event.clientY / window.innerHeight - 0.5);
  };

  return (
    <section
      id="top"
      ref={sectionRef}
      onPointerMove={handleMove}
      className="relative isolate flex min-h-[100svh] items-center overflow-hidden pb-24 pt-32"
    >
      {/* Layer 1 — the rendered 3D transit loop. */}
      <motion.div
        className="absolute inset-0 -z-30"
        style={{ scale: videoScale, y: videoY, x: reduced ? 0 : parallaxX }}
      >
        <VideoPanel
          src="/vid/hero.mp4"
          poster="/vid/hero.jpg"
          eager
          hold={!splashDone}
          className="h-full w-full object-cover opacity-55"
        />
      </motion.div>

      {/* Layer 2 — darkening so headline contrast never depends on the video frame. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-20 bg-[linear-gradient(to_right,#01090f_0%,rgba(1,9,15,.92)_38%,rgba(1,9,15,.35)_70%,rgba(1,9,15,.8)_100%)]"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 -z-20 h-64 bg-gradient-to-t from-navy-950 to-transparent"
      />

      {/* Layer 3 — technical grid. */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-grid-fade opacity-70" />

      <motion.div
        className="shell relative z-10"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="scene-3d max-w-2xl">
            <motion.span
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.2 }}
              className="eyebrow"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green" />
              </span>
              {t("hero.eyebrow")}
            </motion.span>

            <h1 className="preserve-3d mt-6 font-display text-[2.6rem] font-bold leading-[1.02] tracking-[-0.03em] text-white sm:text-6xl lg:text-7xl">
              {[t("hero.title_a"), t("hero.title_b"), t("hero.title_c")].map((line, i) => (
                <motion.span
                  key={line}
                  custom={i}
                  variants={LINE_VARIANTS}
                  initial="hidden"
                  animate="show"
                  className="block origin-bottom"
                  style={{ transformPerspective: 800 }}
                >
                  {i === 2 ? (
                    <span className="bg-gradient-to-r from-green-light via-green to-green-light bg-clip-text text-transparent text-glow">
                      {line}
                    </span>
                  ) : (
                    line
                  )}
                </motion.span>
              ))}
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.75 }}
              className="mt-7 max-w-xl text-base leading-relaxed text-mist sm:text-lg"
            >
              {t("hero.subtitle")}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.9 }}
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <GlowButton href="#contact" icon={<Truck className="h-4 w-4" aria-hidden />}>
                {t("hero.cta_primary")}
              </GlowButton>
              <GlowButton
                href="#track"
                variant="outline"
                icon={<PackageCheck className="h-4 w-4" aria-hidden />}
              >
                {t("hero.cta_secondary")}
              </GlowButton>
            </motion.div>
          </div>

          {/* Floating status card — the interactive 3D object in the hero. */}
          <motion.div
            initial={{ opacity: 0, y: 60, rotateY: -18 }}
            animate={{ opacity: 1, y: 0, rotateY: 0 }}
            transition={{ duration: 1, ease: EASE, delay: 1 }}
            style={{ y: reduced ? 0 : parallaxY }}
            className="hidden lg:block"
          >
            <Tilt intensity={11} lift={24}>
              <NetworkPanel />
            </Tilt>
          </motion.div>
        </div>

        {/* City ticker along the bottom edge. */}
        <div
          aria-hidden
          className="relative mt-16 flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]"
        >
          <div className="flex shrink-0 animate-marquee items-center gap-10 pr-10">
            {[...ticker, ...ticker].map((city, index) => (
              <span
                key={`${city}-${index}`}
                className="flex shrink-0 items-center gap-3 text-xs font-semibold uppercase tracking-[.2em] text-mist-faint"
              >
                {city}
                <span className="h-1 w-1 rounded-full bg-green/60" />
              </span>
            ))}
          </div>
        </div>
      </motion.div>

      <motion.a
        href="#journey"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.8 }}
        className="absolute bottom-7 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-[10px] font-semibold uppercase tracking-[.25em] text-mist-faint transition hover:text-green-light md:flex"
      >
        {t("hero.scroll")}
        <ArrowDown className="h-3.5 w-3.5 animate-bounce" aria-hidden />
      </motion.a>
    </section>
  );
};

export default Hero;
