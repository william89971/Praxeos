/**
 * Distortion ref-context — keeps the eased distortion outside React state
 * so per-frame animation does not re-render the tree.
 */

"use client";

import { type MutableRefObject, createContext, useContext } from "react";
import type { GardenState } from "./distortion";

export interface DistortionRefs {
  /** Control target, set by React state. */
  readonly target: MutableRefObject<GardenState>;
  /** Per-frame eased state, updated inside the R3F frame loop. */
  readonly eased: MutableRefObject<GardenState>;
}

export const DistortionContext = createContext<DistortionRefs | null>(null);

export function useDistortionRefs(): DistortionRefs {
  const ctx = useContext(DistortionContext);
  if (!ctx) throw new Error("useDistortionRefs must be used inside DistortionContext");
  return ctx;
}
