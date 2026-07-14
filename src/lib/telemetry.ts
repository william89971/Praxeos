export type TelemetryValue = string | number | boolean | null | readonly TelemetryValue[] | { readonly [key: string]: TelemetryValue };
export type InteractionEventName = "module_viewed" | "first_interaction" | "control_changed" | "challenge_completed" | "result_summary_viewed" | "essay_reached" | "source_opened" | "insight_copied" | "run_recorded" | "webgl_mounted" | "canvas_fallback";
export interface InteractionEvent { readonly id: string; readonly name: InteractionEventName; readonly moduleSlug?: string; readonly path?: string; readonly timestamp: string; readonly payload?: Record<string, TelemetryValue>; }

/** Explicit-consent, ephemeral study instrumentation. No queue is stored or sent. */
export function trackInteraction(name: InteractionEventName, options: { readonly moduleSlug?: string; readonly payload?: Record<string, TelemetryValue> } = {}): InteractionEvent | null {
  if (typeof window === "undefined" || window.localStorage.getItem("praxeos.study-consent") !== "yes") return null;
  const event: InteractionEvent = { id: `study_${crypto.randomUUID()}`, name, timestamp: new Date().toISOString(), ...(options.moduleSlug ? { moduleSlug: options.moduleSlug } : {}), ...(window.location.pathname ? { path: window.location.pathname } : {}), ...(options.payload ? { payload: options.payload } : {}) };
  window.dispatchEvent(new CustomEvent("praxeos-consented-study-event", { detail: event }));
  return event;
}

export function readTelemetryQueue(): InteractionEvent[] { return []; }
export function telemetrySummary(events: readonly InteractionEvent[]) { return events.reduce<Record<string, number>>((counts, event) => ({ ...counts, [event.name]: (counts[event.name] ?? 0) + 1 }), {}); }
