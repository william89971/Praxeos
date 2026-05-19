"use client";

import {
  BEGINNER_PATH,
  type BeginnerModuleSlug,
  firstUncompletedStep,
} from "@/lib/beginner-path";
import { useCallback, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "praxeos.progress.v1";
const PROGRESS_EVENT = "praxeos-progress";

export interface ModuleProgress {
  readonly visited?: boolean;
  readonly firstInteraction?: boolean;
  readonly challenge?: boolean;
  readonly essay?: boolean;
  readonly insight?: boolean;
  readonly lastInsight?: string;
  readonly updatedAt?: string;
}

export interface PraxeosProgress {
  readonly version: 1;
  readonly modules: Record<string, ModuleProgress>;
  readonly dismissedOnboarding: Record<string, boolean>;
  readonly lastModuleSlug?: string;
}

const DEFAULT_PROGRESS: PraxeosProgress = {
  version: 1,
  modules: {},
  dismissedOnboarding: {},
};

function readProgress(): PraxeosProgress {
  if (typeof window === "undefined") return DEFAULT_PROGRESS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROGRESS;
    const parsed = JSON.parse(raw) as Partial<PraxeosProgress>;
    const next: PraxeosProgress = {
      version: 1,
      modules: parsed.modules ?? {},
      dismissedOnboarding: parsed.dismissedOnboarding ?? {},
    };
    return parsed.lastModuleSlug
      ? { ...next, lastModuleSlug: parsed.lastModuleSlug }
      : next;
  } catch {
    return DEFAULT_PROGRESS;
  }
}

function writeProgress(next: PraxeosProgress) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(PROGRESS_EVENT));
}

export function useProgressStore() {
  const [progress, setProgress] = useState<PraxeosProgress>(DEFAULT_PROGRESS);

  useEffect(() => {
    const sync = () => setProgress(readProgress());
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener(PROGRESS_EVENT, sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(PROGRESS_EVENT, sync);
    };
  }, []);

  const update = useCallback(
    (recipe: (current: PraxeosProgress) => PraxeosProgress) => {
      const next = recipe(readProgress());
      writeProgress(next);
      setProgress(next);
    },
    [],
  );

  const markModule = useCallback(
    (slug: string, patch: ModuleProgress) => {
      update((current) => ({
        ...current,
        lastModuleSlug: slug,
        modules: {
          ...current.modules,
          [slug]: {
            ...current.modules[slug],
            ...patch,
            updatedAt: new Date().toISOString(),
          },
        },
      }));
    },
    [update],
  );

  const dismissOnboarding = useCallback(
    (slug: string) => {
      update((current) => ({
        ...current,
        dismissedOnboarding: {
          ...current.dismissedOnboarding,
          [slug]: true,
        },
      }));
    },
    [update],
  );

  const resetProgress = useCallback(() => {
    writeProgress(DEFAULT_PROGRESS);
    setProgress(DEFAULT_PROGRESS);
  }, []);

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
      markModule(slug, {
        visited: true,
        firstInteraction: true,
        challenge: true,
      }),
    [markModule],
  );
  const markEssay = useCallback(
    (slug: string) =>
      markModule(slug, {
        visited: true,
        essay: true,
      }),
    [markModule],
  );
  const markInsight = useCallback(
    (slug: string, insight: string) =>
      markModule(slug, {
        visited: true,
        insight: true,
        lastInsight: insight,
      }),
    [markModule],
  );

  const completedSlugs = useMemo(
    () =>
      new Set(
        BEGINNER_PATH.filter((step) => progress.modules[step.slug]?.challenge).map(
          (step) => step.slug,
        ),
      ),
    [progress.modules],
  );

  const completedCount = completedSlugs.size;
  const nextStep = firstUncompletedStep(completedSlugs);

  return {
    progress,
    completedCount,
    totalCount: BEGINNER_PATH.length,
    nextStep,
    completedSlugs,
    moduleProgress: (slug: string) => progress.modules[slug] ?? {},
    isOnboardingDismissed: (slug: string) =>
      Boolean(progress.dismissedOnboarding[slug]),
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
  return `/modules/${slug}?path=beginner`;
}
