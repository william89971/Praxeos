"use client";

import { type MutableRefObject, createContext, useContext } from "react";
import type { CoordState } from "./distortion";

export interface CoordinationRefs {
  readonly target: MutableRefObject<CoordState>;
  readonly eased: MutableRefObject<CoordState>;
}

export const CoordinationContext = createContext<CoordinationRefs | null>(null);

export function useCoordinationRefs(): CoordinationRefs {
  const ctx = useContext(CoordinationContext);
  if (!ctx)
    throw new Error("useCoordinationRefs must be used inside CoordinationContext");
  return ctx;
}
