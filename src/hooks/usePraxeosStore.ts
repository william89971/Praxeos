"use client";

import type { LabSlug } from "@/labs/types";
import {
  LEARNING_STORE_KEY,
  type LearningStore,
  emptyLabSession,
  emptyLearningStore,
  migrateLearningStore,
  upsertLabSession,
} from "@/lib/learning-store";
import { useCallback, useEffect, useState } from "react";

const LEGACY_KEYS = [
  "praxeos.learning.v2",
  "praxeos.learning.v1",
  "praxeos.progress.v1",
  "praxeos.module-runs.v1",
];

export function usePraxeosStore() {
  const [store, setStore] = useState<LearningStore>(emptyLearningStore);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const current = window.localStorage.getItem(LEARNING_STORE_KEY);
      const legacy = LEGACY_KEYS.map((key) => window.localStorage.getItem(key)).find(
        Boolean,
      );
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

  const startLabSession = useCallback(
    (labSlug: LabSlug, seed?: string) => {
      const session = emptyLabSession(labSlug, new Date().toISOString(), seed);
      update((current) => upsertLabSession(current, session));
      return session;
    },
    [update],
  );

  const resetLab = useCallback(
    (labSlug: LabSlug) => {
      const session = emptyLabSession(labSlug);
      update((current) => upsertLabSession(current, session));
      return session;
    },
    [update],
  );

  return { store, update, hydrated, startLabSession, resetLab };
}
