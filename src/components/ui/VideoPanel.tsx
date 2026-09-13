import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

type VideoPanelProps = {
  src: string;
  poster?: string;
  className?: string;
  /** Plays only while visible. Off-screen videos are paused to save battery. */
  eager?: boolean;
  /**
   * Blocks the download entirely while true. Used to keep heavy media off the
   * network until the splash screen has finished, so the two don't compete.
   */
  hold?: boolean;
};

/**
 * Background video that only decodes while it is on screen.
 * Falls back to a dark gradient if the file is missing or autoplay is blocked,
 * so the layout never collapses.
 */
const VideoPanel = ({
  src,
  poster,
  className = "",
  eager = false,
  hold = false
}: VideoPanelProps) => {
  const ref = useRef<HTMLVideoElement>(null);
  const inView = useInView(ref, { amount: 0.2, once: false });
  const [failed, setFailed] = useState(false);

  // The source files ship with an audio track. The site is silent by design, so
  // mute is enforced imperatively too — React can attach the `muted` attribute
  // after the element is created, which lets a frame of audio through.
  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.volume = 0;
  }, []);

  useEffect(() => {
    const video = ref.current;
    if (!video || failed) return;

    if (hold) {
      video.pause();
      return;
    }

    if (inView || eager) {
      video.muted = true;
      video.volume = 0;
      // play() rejects when the tab is backgrounded or autoplay is blocked.
      video.play().catch(() => undefined);
    } else {
      video.pause();
    }
  }, [inView, eager, hold, failed]);

  if (failed) {
    return (
      <div
        className={`bg-[radial-gradient(ellipse_at_50%_40%,rgba(10,60,112,.55),#01090f_70%)] ${className}`}
        aria-hidden
      />
    );
  }

  return (
    <video
      ref={ref}
      className={className}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload={hold ? "none" : eager ? "auto" : "metadata"}
      disablePictureInPicture
      aria-hidden
      onError={() => setFailed(true)}
    />
  );
};

export default VideoPanel;
