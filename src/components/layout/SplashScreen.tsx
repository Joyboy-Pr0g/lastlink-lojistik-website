import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { EASE } from "@/lib/motion";
import { markSplashDone } from "@/lib/splashState";

const SPLASH_VIDEO = "/vid/splash.mp4";
/** The clip is 4.0s; the ceiling covers it plus a little decode slack. */
const MAX_MS = 4400;

/**
 * Full-screen logo reveal played on every page load while the page settles.
 *
 * It is deliberately easy to escape: it self-dismisses when the clip ends, on a
 * hard timeout, on click, or on Escape — and it never appears at all if the
 * video file is missing.
 *
 * `prefers-reduced-motion` intentionally does NOT suppress the splash — it only
 * drops the decorative transitions below. Suppressing it outright meant the
 * splash never appeared for anyone whose OS has animations turned off (on
 * Windows: Settings > Accessibility > Visual effects > Animation effects),
 * which is a system-wide setting plenty of people have on.
 */
const SplashScreen = () => {
  const reduced = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [visible, setVisible] = useState(true);

  const dismiss = useCallback(() => {
    setVisible(false);
    // Released here rather than after the exit animation, so the hero video
    // gets a head start while the splash fades out.
    markSplashDone();
  }, []);

  useEffect(() => {
    if (!visible) return;

    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.defaultMuted = true;
      video.volume = 0;
      video.play().catch(() => undefined);
    }

    const timer = window.setTimeout(dismiss, MAX_MS);
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && dismiss();

    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", onKey);
    };
  }, [visible, dismiss]);

  // The page behind must not scroll while the overlay is up.
  useEffect(() => {
    if (!visible) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="splash"
          role="presentation"
          onClick={dismiss}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="fixed inset-0 z-[100] cursor-pointer overflow-hidden bg-navy-950"
        >
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover"
            src={SPLASH_VIDEO}
            muted
            playsInline
            preload="auto"
            disablePictureInPicture
            aria-hidden
            onEnded={dismiss}
            // No splash video on disk — get out of the visitor's way immediately.
            onError={dismiss}
          />

          {/* Vignette, plus a darker foot so the wordmark stays readable. */}
          <div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(ellipse_70%_70%_at_50%_45%,transparent_35%,rgba(1,9,15,.8)_100%)]"
          />
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-navy-950 via-navy-950/70 to-transparent"
          />

          {/* Anchored to the foot of the screen, clear of the video's subject. */}
          <div className="absolute inset-x-0 bottom-14 flex flex-col items-center gap-5">
            <motion.span
              initial={reduced ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.8, ease: EASE }}
              className="font-display text-2xl font-bold tracking-[-0.02em] text-white"
            >
              Last<span className="text-green">Link</span>
            </motion.span>

            <div className="h-px w-40 overflow-hidden bg-white/15">
              <motion.div
                className="h-full bg-gradient-to-r from-green-dark via-green to-green-light"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: MAX_MS / 1000, ease: "linear" }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
