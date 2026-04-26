"use client";

import { type MutableRefObject, createContext, useContext } from "react";

export interface CoordinationRefs {
  readonly target: MutableRefObject<number>;
  readonly eased: MutableRefObject<number>;
}

export const CoordinationContext = createContext<CoordinationRefs | null>(null);

export function useCoordinationRefs(): CoordinationRefs {
  const ctx = useContext(CoordinationContext);
  if (!ctx)
    throw new Error("useCoordinationRefs must be used inside CoordinationContext");
  return ctx;
}
