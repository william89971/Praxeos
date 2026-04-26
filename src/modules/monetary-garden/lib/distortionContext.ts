/**
 * Distortion ref-context — keeps the eased distortion outside React state
 * so per-frame animation does not re-render the tree.
 */

"use client";

import { type MutableRefObject, createContext, useContext } from "react";

export interface DistortionRefs {
  /** Slider target, set by React state. */
  readonly target: MutableRefObject<number>;
  /** Per-frame eased value, updated inside the R3F frame loop. */
  readonly eased: MutableRefObject<number>;
}

export const DistortionContext = createContext<DistortionRefs | null>(null);

export function useDistortionRefs(): DistortionRefs {
  const ctx = useContext(DistortionContext);
  if (!ctx) throw new Error("useDistortionRefs must be used inside DistortionContext");
  return ctx;
}
