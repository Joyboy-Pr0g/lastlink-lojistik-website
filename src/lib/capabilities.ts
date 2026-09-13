import { useEffect, useState } from "react";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const HANDHELD_QUERY = "(hover: none) and (pointer: coarse)";
const MIN_CORES = 4;
const MIN_WIDTH = 768;

const hasWebGL = () => {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
};

const isLowPower = () => {
  const cores = navigator.hardwareConcurrency;

  if (typeof cores === "number" && cores > 0 && cores < MIN_CORES) return true;

  return window.matchMedia(HANDHELD_QUERY).matches && window.innerWidth < MIN_WIDTH;
};

export const canRenderScenes = () => {
  if (typeof window === "undefined") return false;
  if (window.matchMedia(REDUCED_MOTION_QUERY).matches) return false;
  if (isLowPower()) return false;

  return hasWebGL();
};

export const useSceneSupport = () => {
  const [enabled, setEnabled] = useState(canRenderScenes);

  useEffect(() => {
    const motionQuery = window.matchMedia(REDUCED_MOTION_QUERY);
    const handheldQuery = window.matchMedia(HANDHELD_QUERY);
    const update = () => setEnabled(canRenderScenes());

    motionQuery.addEventListener("change", update);
    handheldQuery.addEventListener("change", update);

    return () => {
      motionQuery.removeEventListener("change", update);
      handheldQuery.removeEventListener("change", update);
    };
  }, []);

  return enabled;
};
