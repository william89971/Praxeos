"use client";

import { useCallback, useMemo } from "react";
import { usePraxeosStore } from "@/hooks/usePraxeosStore";
import { BEGINNER_PATH, type BeginnerModuleSlug, firstUncompletedStep } from "@/lib/beginner-path";
import type { LearningStore } from "@/lib/learning-store";

export type ModuleProgress = LearningStore["labProgress"][string];

export function useProgressStore() {
  const { store, update } = usePraxeosStore();
  const markModule = useCallback((slug: string, patch: ModuleProgress) => update((current) => ({ ...current, labProgress: { ...current.labProgress, [slug]: { ...current.labProgress[slug], ...patch, updatedAt: new Date().toISOString() } } })), [update]);
  const completedSlugs = useMemo(() => new Set(BEGINNER_PATH.filter((step) => store.labProgress[step.slug]?.challenge).map((step) => step.slug)), [store.labProgress]);
  const nextStep = firstUncompletedStep(completedSlugs);
  return {
    progress: {
      modules: store.labProgress,
      dismissedOnboarding: store.dismissedLabOnboarding,
      lastModuleSlug: Object.entries(store.labProgress)
        .sort(([, a], [, b]) => (b.updatedAt ?? "").localeCompare(a.updatedAt ?? ""))[0]?.[0],
    },
    completedCount: completedSlugs.size,
    totalCount: BEGINNER_PATH.length,
    nextStep,
    completedSlugs,
    moduleProgress: (slug: string) => store.labProgress[slug] ?? {},
    isOnboardingDismissed: (slug: string) => Boolean(store.dismissedLabOnboarding[slug]),
    markVisited: (slug: string) => markModule(slug, { visited: true }),
    markFirstInteraction: (slug: string) => markModule(slug, { visited: true, firstInteraction: true }),
    markChallenge: (slug: string) => markModule(slug, { visited: true, firstInteraction: true, challenge: true }),
    markEssay: (slug: string) => markModule(slug, { visited: true, essay: true }),
    markInsight: (slug: string, insight: string) => markModule(slug, { visited: true, insight: true, lastInsight: insight }),
    dismissOnboarding: (slug: string) => update((current) => ({ ...current, dismissedLabOnboarding: { ...current.dismissedLabOnboarding, [slug]: true } })),
    resetProgress: () => update((current) => ({ ...current, labProgress: {}, dismissedLabOnboarding: {} })),
  };
}

export function pathHref(slug: BeginnerModuleSlug): string { return `/labs/${slug}?path=beginner`; }
