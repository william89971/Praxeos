"use client";

import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { type ReactNode, createContext, useContext, useMemo } from "react";

export type MotionIntent =
  | "sourceReveal"
  | "challengeSuccess"
  | "systemFailure"
  | "navigation";

interface MotionGrammar {
  readonly reduced: boolean;
  readonly duration: (intent: MotionIntent) => number;
  readonly easing: (intent: MotionIntent) => readonly number[];
}

const DEFAULT_GRAMMAR: MotionGrammar = {
  reduced: false,
  duration: () => 0.4,
  easing: () => [0.22, 1, 0.36, 1],
};

const MotionContext = createContext<MotionGrammar>(DEFAULT_GRAMMAR);

export function MotionProvider({ children }: { readonly children: ReactNode }) {
  const reduced = usePrefersReducedMotion();
  const value = useMemo<MotionGrammar>(
    () => ({
      reduced,
      duration: (intent) => {
        if (reduced) return 0;
        switch (intent) {
          case "sourceReveal":
            return 0.65;
          case "challengeSuccess":
            return 0.48;
          case "systemFailure":
            return 0.78;
          case "navigation":
            return 0.42;
        }
      },
      easing: (intent) => {
        switch (intent) {
          case "systemFailure":
            return [0.65, 0, 0.35, 1];
          case "challengeSuccess":
            return [0.16, 1, 0.3, 1];
          case "sourceReveal":
          case "navigation":
            return [0.22, 1, 0.36, 1];
        }
      },
    }),
    [reduced],
  );

  return <MotionContext.Provider value={value}>{children}</MotionContext.Provider>;
}

export function useMotionGrammar() {
  return useContext(MotionContext);
}
