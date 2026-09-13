import { useEffect, useState } from "react";

/**
 * Subscribes to a media query. Used to mount only one of two structurally
 * different layouts, instead of rendering both and hiding one with CSS —
 * which would download the same videos twice.
 */
export const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(
    () => typeof window !== "undefined" && window.matchMedia(query).matches
  );

  useEffect(() => {
    const list = window.matchMedia(query);
    const update = () => setMatches(list.matches);

    update();
    list.addEventListener("change", update);
    return () => list.removeEventListener("change", update);
  }, [query]);

  return matches;
};

export const useIsDesktop = () => useMediaQuery("(min-width: 1024px)");
