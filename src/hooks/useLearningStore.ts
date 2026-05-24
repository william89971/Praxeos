"use client";

import type { ActionAnalyzerSnapshot } from "@/lib/praxeology";
import { useCallback, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "praxeos.learning.v1";
const LEARNING_EVENT = "praxeos-learning";
const MAX_JOURNAL_ENTRIES = 40;

export interface ActionJournalEntry {
  readonly id: string;
  readonly sourceType: "lesson" | "case" | "practice";
  readonly sourceId: string;
  readonly title: string;
  readonly insight: string;
  readonly snapshot: ActionAnalyzerSnapshot;
  readonly createdAt: string;
}

export interface PraxeosLearningState {
  readonly version: 1;
  readonly completedLessons: Record<string, string>;
  readonly completedCases: Record<string, string>;
  readonly journal: readonly ActionJournalEntry[];
}

const DEFAULT_STATE: PraxeosLearningState = {
  version: 1,
  completedLessons: {},
  completedCases: {},
  journal: [],
};

let memoryState: PraxeosLearningState = DEFAULT_STATE;

function readLearningState(): PraxeosLearningState {
  if (typeof window === "undefined") return memoryState;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return memoryState;
    const parsed = JSON.parse(raw) as Partial<PraxeosLearningState>;

    memoryState = {
      version: 1,
      completedLessons: parsed.completedLessons ?? {},
      completedCases: parsed.completedCases ?? {},
      journal: Array.isArray(parsed.journal) ? parsed.journal : [],
    };
    return memoryState;
  } catch {
    return memoryState;
  }
}

function writeLearningState(next: PraxeosLearningState) {
  memoryState = next;
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Keep the in-memory session usable when localStorage is blocked or full.
  }

  window.dispatchEvent(new Event(LEARNING_EVENT));
}

export function useLearningStore() {
  const [state, setState] = useState<PraxeosLearningState>(DEFAULT_STATE);

  useEffect(() => {
    const sync = () => setState(readLearningState());
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener(LEARNING_EVENT, sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(LEARNING_EVENT, sync);
    };
  }, []);

  const update = useCallback(
    (recipe: (current: PraxeosLearningState) => PraxeosLearningState) => {
      const next = recipe(readLearningState());
      writeLearningState(next);
      setState(next);
    },
    [],
  );

  const markLessonComplete = useCallback(
    (lessonId: string) => {
      update((current) => ({
        ...current,
        completedLessons: {
          ...current.completedLessons,
          [lessonId]: new Date().toISOString(),
        },
      }));
    },
    [update],
  );

  const markCaseComplete = useCallback(
    (caseId: string) => {
      update((current) => ({
        ...current,
        completedCases: {
          ...current.completedCases,
          [caseId]: new Date().toISOString(),
        },
      }));
    },
    [update],
  );

  const saveJournalEntry = useCallback(
    (entry: Omit<ActionJournalEntry, "id" | "createdAt">) => {
      const createdAt = new Date().toISOString();
      const id =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `${entry.sourceId}-${Date.now()}`;

      const nextEntry: ActionJournalEntry = {
        ...entry,
        id,
        createdAt,
      };

      update((current) => ({
        ...current,
        journal: [nextEntry, ...current.journal].slice(0, MAX_JOURNAL_ENTRIES),
      }));

      return nextEntry;
    },
    [update],
  );

  const clearJournal = useCallback(() => {
    update((current) => ({
      ...current,
      journal: [],
    }));
  }, [update]);

  const resetProgress = useCallback(() => {
    update((current) => ({
      ...current,
      completedLessons: {},
      completedCases: {},
    }));
  }, [update]);

  const resetLearning = useCallback(() => {
    writeLearningState(DEFAULT_STATE);
    setState(DEFAULT_STATE);
  }, []);

  const completedLessonCount = useMemo(
    () => Object.keys(state.completedLessons).length,
    [state.completedLessons],
  );
  const completedCaseCount = useMemo(
    () => Object.keys(state.completedCases).length,
    [state.completedCases],
  );

  return {
    state,
    completedLessonCount,
    completedCaseCount,
    completedLessons: new Set(Object.keys(state.completedLessons)),
    completedCases: new Set(Object.keys(state.completedCases)),
    markLessonComplete,
    markCaseComplete,
    saveJournalEntry,
    clearJournal,
    resetProgress,
    resetLearning,
  };
}
