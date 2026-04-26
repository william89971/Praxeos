"use client";

import { type MutableRefObject, createContext, useContext } from "react";
import type { ActiveAction } from "./signals";

export interface OrchardRefs {
  /** Active actions queue; mutated by parent React, read each frame. */
  readonly actions: MutableRefObject<readonly ActiveAction[]>;
}

export const OrchardContext = createContext<OrchardRefs | null>(null);

export function useOrchardRefs(): OrchardRefs {
  const ctx = useContext(OrchardContext);
  if (!ctx) throw new Error("useOrchardRefs must be used inside OrchardContext");
  return ctx;
}
