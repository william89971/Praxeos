/**
 * Halving Garden — CSS-token-driven THREE.Color reader.
 *
 * Reads computed CSS custom properties at hook time and re-runs when the
 * `data-theme` attribute changes on `<html>`. Returns plain `THREE.Color`
 * instances ready to assign to material `color` / `emissive`.
 */

"use client";

import { useEffect, useState } from "react";
import { Color } from "three";

const TOKEN_NAMES = [
  "--paper",
  "--paper-elevated",
  "--paper-sunk",
  "--ink-primary",
  "--ink-secondary",
  "--ink-tertiary",
  "--accent-bitcoin",
  "--accent-action",
  "--accent-capital",
  "--rule",
  "--rule-strong",
] as const;

type TokenName = (typeof TOKEN_NAMES)[number];

export type SceneColors = Readonly<Record<TokenName, Color>>;

const FALLBACK: Record<TokenName, string> = {
  "--paper": "#f5f0e6",
  "--paper-elevated": "#ede6d6",
  "--paper-sunk": "#ebe4d1",
  "--ink-primary": "#1c1814",
  "--ink-secondary": "#5c5348",
  "--ink-tertiary": "#8b8275",
  "--accent-bitcoin": "#e87722",
  "--accent-action": "#8b3a3a",
  "--accent-capital": "#3a5a4a",
  "--rule": "#d8cfbe",
  "--rule-strong": "#b8ad97",
};

function readColors(): SceneColors {
  if (typeof document === "undefined") {
    return TOKEN_NAMES.reduce(
      (acc, name) => {
        acc[name] = new Color(FALLBACK[name]);
        return acc;
      },
      {} as Record<TokenName, Color>,
    );
  }
  const styles = window.getComputedStyle(document.documentElement);
  const out = {} as Record<TokenName, Color>;
  for (const name of TOKEN_NAMES) {
    const raw = styles.getPropertyValue(name).trim() || FALLBACK[name];
    try {
      out[name] = new Color(raw);
    } catch {
      out[name] = new Color(FALLBACK[name]);
    }
  }
  return out;
}

/**
 * Returns the current set of token-derived colors. Re-resolves whenever
 * `data-theme` flips on the root element so the scene re-tints in step
 * with the rest of the UI.
 */
export function useSceneColors(): SceneColors {
  const [colors, setColors] = useState<SceneColors>(() => readColors());

  useEffect(() => {
    if (typeof window === "undefined") return;
    setColors(readColors());

    const root = document.documentElement;
    const observer = new MutationObserver(() => {
      setColors(readColors());
    });
    observer.observe(root, { attributes: true, attributeFilter: ["data-theme"] });

    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => setColors(readColors());
    mql.addEventListener("change", onChange);

    return () => {
      observer.disconnect();
      mql.removeEventListener("change", onChange);
    };
  }, []);

  return colors;
}
