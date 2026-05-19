"use client";

import {
  type ModuleRuntimeAdapter,
  type RuntimeUpdateOptions,
  evaluateChallenges,
  goalsFor,
  recordModuleRun,
  runtimeSearchParams,
  sameCompletedIds,
  telemetryPayloadForState,
} from "@/lib/module-runtime";
import { trackInteraction } from "@/lib/telemetry";
import { usePathname, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type RuntimeStateUpdate<State extends object> = State | ((current: State) => State);

export function useModuleRuntime<State extends object, Metrics extends object>(
  adapter: ModuleRuntimeAdapter<State, Metrics>,
) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialState = useMemo(
    () => adapter.deserialize(searchParams),
    [adapter, searchParams],
  );
  const [state, setState] = useState<State>(initialState);
  const [completedIds, setCompletedIds] = useState<readonly string[]>([]);
  const runKeyRef = useRef("");

  useEffect(() => {
    setState(initialState);
  }, [initialState]);

  useEffect(() => {
    trackInteraction("module_viewed", {
      moduleSlug: adapter.slug,
      payload: telemetryPayloadForState(initialState),
    });
  }, [adapter.slug, initialState]);

  const metrics = useMemo(() => adapter.deriveMetrics(state), [adapter, state]);
  const completedSet = useMemo(() => new Set(completedIds), [completedIds]);

  useEffect(() => {
    const next = evaluateChallenges(adapter, state, metrics, completedSet);
    if (sameCompletedIds(completedIds, next)) return;

    const newlyCompleted = [...next].filter((id) => !completedSet.has(id));
    for (const id of newlyCompleted) {
      trackInteraction("challenge_completed", {
        moduleSlug: adapter.slug,
        payload: { challengeId: id },
      });
    }
    setCompletedIds([...next]);
  }, [adapter, state, metrics, completedSet, completedIds]);

  const goals = useMemo(() => goalsFor(adapter, completedSet), [adapter, completedSet]);
  const allComplete =
    adapter.challenges.length > 0 && completedIds.length === adapter.challenges.length;
  const insight = adapter.insight(state, metrics);
  const summaryRows = adapter.summaryRows(state, metrics);
  const currentHint = adapter.currentHint(state, metrics);

  useEffect(() => {
    if (!allComplete) return;
    const runKey = `${adapter.slug}:${completedIds.join(",")}:${JSON.stringify(
      adapter.serialize(state),
    )}`;
    if (runKeyRef.current === runKey) return;
    runKeyRef.current = runKey;
    recordModuleRun({
      slug: adapter.slug,
      state,
      metrics,
      completedGoals: completedIds,
      insight,
    });
  }, [adapter, allComplete, completedIds, insight, metrics, state]);

  const updateState = useCallback(
    (update: RuntimeStateUpdate<State>, options: RuntimeUpdateOptions = {}) => {
      setState((current) => {
        const next =
          typeof update === "function"
            ? (update as (current: State) => State)(current)
            : update;

        if (options.syncUrl !== false) {
          const params = runtimeSearchParams(adapter, next, searchParams);
          const query = params.toString();
          window.history.replaceState(
            null,
            "",
            query ? `${pathname}?${query}` : pathname,
          );
        }

        if (options.eventName) {
          trackInteraction(options.eventName, {
            moduleSlug: adapter.slug,
            payload: options.payload ?? telemetryPayloadForState(next),
          });
        }

        return next;
      });
    },
    [adapter, pathname, searchParams],
  );

  return {
    state,
    metrics,
    completedIds,
    goals,
    allComplete,
    insight,
    summaryRows,
    currentHint,
    sourceLabel: adapter.sourceLabel,
    updateState,
  };
}
