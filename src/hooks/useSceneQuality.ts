"use client";

import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

export type SceneQuality = "high" | "medium" | "low" | "poster";

export function usePageVisibility(): boolean {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const update = () => setVisible(document.visibilityState !== "hidden");
    update();
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);

  return visible;
}

export function useSceneQuality(): SceneQuality {
  const reducedMotion = usePrefersReducedMotion();
  const [quality, setQuality] = useState<SceneQuality>(() =>
    reducedMotion ? "poster" : "medium",
  );

  useEffect(() => {
    if (reducedMotion) {
      setQuality("poster");
      return;
    }

    const update = () => {
      const width = window.innerWidth;
      const coarse = window.matchMedia("(pointer: coarse)").matches;
      const reducedData = window.matchMedia("(prefers-reduced-data: reduce)").matches;
      const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
      const lowMemory = typeof memory === "number" && memory <= 4;

      if (reducedData || lowMemory || width < 520) {
        setQuality("low");
      } else if (coarse || width < 960) {
        setQuality("medium");
      } else {
        setQuality("high");
      }
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [reducedMotion]);

  return quality;
}

export function dprRangeForQuality(quality: SceneQuality): [number, number] {
  if (quality === "high") return [1, 2];
  if (quality === "medium") return [1, 1.5];
  return [1, 1];
}

export function webglPowerPreference(quality: SceneQuality): WebGLPowerPreference {
  return quality === "high" ? "high-performance" : "default";
}
