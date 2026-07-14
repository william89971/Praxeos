"use client";

import { useCallback, useEffect, useState } from "react";
import {
  emptyLearningStore,
  LEARNING_STORE_KEY,
  migrateLearningStore,
  type LearningStore,
} from "@/lib/learning-store";

const LEGACY_KEYS = ["praxeos.learning.v1", "praxeos.progress.v1", "praxeos.module-runs.v1"];

export function usePraxeosStore() {
  const [store, setStore] = useState<LearningStore>(emptyLearningStore);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const current = window.localStorage.getItem(LEARNING_STORE_KEY);
      const legacy = LEGACY_KEYS.map((key) => window.localStorage.getItem(key)).find(Boolean);
      const parsed = current ?? legacy;
      const migrated = migrateLearningStore(parsed ? JSON.parse(parsed) : null);
      window.localStorage.setItem(LEARNING_STORE_KEY, JSON.stringify(migrated));
      setStore(migrated);
    } catch {
      setStore(emptyLearningStore());
    } finally {
      setHydrated(true);
    }
  }, []);

  const update = useCallback((recipe: (current: LearningStore) => LearningStore) => {
    setStore((current) => {
      const next = recipe(current);
      try {
        window.localStorage.setItem(LEARNING_STORE_KEY, JSON.stringify(next));
      } catch {
        // The in-memory journey remains usable when storage is blocked or full.
      }
      return next;
    });
  }, []);

  const resetJourney = useCallback(() => {
    update((current) => ({ ...emptyLearningStore(), completedLessons: current.completedLessons }));
  }, [update]);

  return { store, update, hydrated, resetJourney };
}

