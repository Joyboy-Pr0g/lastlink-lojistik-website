import { useEffect, useState } from "react";

/**
 * Tracks whether the splash screen has finished.
 *
 * The hero video is ~9 MB and used to download while the splash was still
 * playing, so the two competed for bandwidth and the splash stuttered. Heavy
 * media below the splash waits on this instead.
 *
 * Module-level rather than context: it is written once, read by a couple of
 * components, and must survive their mount order.
 */
let done = false;
const listeners = new Set<() => void>();

export const markSplashDone = () => {
  if (done) return;
  done = true;
  listeners.forEach((listener) => listener());
};

export const useSplashDone = () => {
  const [value, setValue] = useState(done);

  useEffect(() => {
    if (done) {
      setValue(true);
      return;
    }

    const listener = () => setValue(true);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  return value;
};
