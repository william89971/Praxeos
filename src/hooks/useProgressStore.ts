"use client";

import { usePraxeosStore } from "@/hooks/usePraxeosStore";
import {
  BEGINNER_PATH,
  type BeginnerModuleSlug,
  firstUncompletedStep,
} from "@/lib/beginner-path";
import type { LearningStore } from "@/lib/learning-store";
import { useCallback, useMemo } from "react";

export type ModuleProgress = LearningStore["labProgress"][string];

export function useProgressStore() {
  const { store, update } = usePraxeosStore();
  const markModule = useCallback(
    (slug: string, patch: ModuleProgress) =>
      update((current) => {
        const existing = current.labProgress[slug] ?? {};
        const changed = Object.entries(patch).some(
          ([key, value]) => existing[key as keyof ModuleProgress] !== value,
        );
        if (!changed) return current;
        return {
          ...current,
          labProgress: {
            ...current.labProgress,
            [slug]: {
              ...existing,
              ...patch,
              updatedAt: new Date().toISOString(),
            },
          },
        };
      }),
    [update],
  );
  const markVisited = useCallback(
    (slug: string) => markModule(slug, { visited: true }),
    [markModule],
  );
  const markFirstInteraction = useCallback(
    (slug: string) => markModule(slug, { visited: true, firstInteraction: true }),
    [markModule],
  );
  const markChallenge = useCallback(
    (slug: string) =>
      markModule(slug, { visited: true, firstInteraction: true, challenge: true }),
    [markModule],
  );
  const markEssay = useCallback(
    (slug: string) => markModule(slug, { visited: true, essay: true }),
    [markModule],
  );
  const markInsight = useCallback(
    (slug: string, insight: string) =>
      markModule(slug, { visited: true, insight: true, lastInsight: insight }),
    [markModule],
  );
  const dismissOnboarding = useCallback(
    (slug: string) =>
      update((current) =>
        current.dismissedLabOnboarding[slug]
          ? current
          : {
              ...current,
              dismissedLabOnboarding: {
                ...current.dismissedLabOnboarding,
                [slug]: true,
              },
            },
      ),
    [update],
  );
  const resetProgress = useCallback(
    () =>
      update((current) => ({
        ...current,
        labProgress: {},
        dismissedLabOnboarding: {},
      })),
    [update],
  );
  const completedSlugs = useMemo(
    () =>
      new Set(
        BEGINNER_PATH.filter((step) => store.labProgress[step.slug]?.challenge).map(
          (step) => step.slug,
        ),
      ),
    [store.labProgress],
  );
  const nextStep = firstUncompletedStep(completedSlugs);
  return {
    progress: {
      modules: store.labProgress,
      dismissedOnboarding: store.dismissedLabOnboarding,
      lastModuleSlug: Object.entries(store.labProgress).sort(([, a], [, b]) =>
        (b.updatedAt ?? "").localeCompare(a.updatedAt ?? ""),
      )[0]?.[0],
    },
    completedCount: completedSlugs.size,
    totalCount: BEGINNER_PATH.length,
    nextStep,
    completedSlugs,
    moduleProgress: (slug: string) => store.labProgress[slug] ?? {},
    isOnboardingDismissed: (slug: string) =>
      Boolean(store.dismissedLabOnboarding[slug]),
    markVisited,
    markFirstInteraction,
    markChallenge,
    markEssay,
    markInsight,
    dismissOnboarding,
    resetProgress,
  };
}

export function pathHref(slug: BeginnerModuleSlug): string {
  return `/labs/${slug}?path=beginner`;
}
