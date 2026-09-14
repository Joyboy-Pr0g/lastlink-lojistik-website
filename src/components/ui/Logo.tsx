import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { EASE } from "@/lib/motion";

const LOGO_VIDEO = "/vid/logo.mp4";

/**
 * Plays the 3D logo reveal when public/vid/logo.mp4 is present, and silently
 * falls back to the static artwork when it is not — so the header is never
 * broken by a missing file.
 */
const LogoMark = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || failed) return;

    // The site is silent by design; enforce it imperatively as well as via the
    // attribute, which React can attach after the element already exists.
    video.muted = true;
    video.defaultMuted = true;
    video.volume = 0;
    video.play().catch(() => undefined);
  }, [failed]);

  if (failed) {
    // The logo's deep navy would vanish against the page, so the original
    // artwork sits on a light chip rather than being recoloured.
    return (
      <span className="grid h-full w-full place-items-center rounded-xl bg-white p-1.5 ring-1 ring-white/70">
        <img src="/logo.svg" alt="" className="h-full w-full object-contain" />
      </span>
    );
  }

  return (
    <video
      ref={videoRef}
      className="h-full w-full rounded-xl object-cover ring-1 ring-white/15"
      src={LOGO_VIDEO}
      muted
      loop
      playsInline
      preload="auto"
      disablePictureInPicture
      aria-hidden
      onError={() => setFailed(true)}
    />
  );
};

/**
 * The brand lockup. The logo file itself is never recoloured — its deep navy
 * would disappear against the dark page, so it sits on a light chip that keeps
 * the original artwork legible and on-brand.
 */
const Logo = ({ className = "", href = "#top" }: { className?: string; href?: string }) => {
  const { t } = useTranslation();

  return (
    <motion.a
      href={href}
      aria-label={t("nav.home")}
      initial="rest"
      whileHover="hover"
      animate="rest"
      className={`scene-3d group flex shrink-0 items-center gap-3 ${className}`}
    >
      <motion.span
        className="preserve-3d relative block h-10 w-10 overflow-hidden rounded-xl shadow-[0_6px_20px_-6px_rgba(0,0,0,.8)]"
        variants={{
          rest: { rotateY: 0, rotateX: 0, scale: 1 },
          hover: { rotateY: 16, rotateX: -8, scale: 1.05 }
        }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        <LogoMark />

        {/* Green halo that blooms behind the chip on hover. */}
        <motion.span
          aria-hidden
          className="absolute inset-0 -z-10 rounded-xl bg-green blur-lg"
          variants={{ rest: { opacity: 0 }, hover: { opacity: 0.55 } }}
          transition={{ duration: 0.5, ease: EASE }}
        />
      </motion.span>

      <span className="font-display text-[17px] font-bold leading-none tracking-[-0.02em] text-white">
        Last<span className="text-green">LinkX</span>
      </span>
    </motion.a>
  );
};

export default Logo;
