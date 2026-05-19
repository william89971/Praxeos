export type TelemetryValue =
  | string
  | number
  | boolean
  | null
  | readonly TelemetryValue[]
  | { readonly [key: string]: TelemetryValue };

export type InteractionEventName =
  | "module_viewed"
  | "first_interaction"
  | "control_changed"
  | "challenge_completed"
  | "result_summary_viewed"
  | "essay_reached"
  | "source_opened"
  | "insight_copied"
  | "run_recorded"
  | "webgl_mounted"
  | "canvas_fallback";

export interface InteractionEvent {
  readonly id: string;
  readonly name: InteractionEventName;
  readonly moduleSlug?: string;
  readonly path?: string;
  readonly timestamp: string;
  readonly payload?: Record<string, TelemetryValue>;
}

const STORAGE_KEY = "praxeos.telemetry.v1";
const MAX_EVENTS = 250;

export function trackInteraction(
  name: InteractionEventName,
  options: {
    readonly moduleSlug?: string;
    readonly payload?: Record<string, TelemetryValue>;
  } = {},
): InteractionEvent | null {
  if (typeof window === "undefined") return null;

  const event: InteractionEvent = {
    id: createEventId(),
    name,
    timestamp: new Date().toISOString(),
    ...(options.moduleSlug ? { moduleSlug: options.moduleSlug } : {}),
    ...(window.location?.pathname ? { path: window.location.pathname } : {}),
    ...(options.payload ? { payload: options.payload } : {}),
  };

  const queue = readTelemetryQueue();
  queue.push(event);
  const trimmed = queue.slice(-MAX_EVENTS);
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
    window.dispatchEvent(new CustomEvent("praxeos-telemetry", { detail: event }));
  } catch {
    return event;
  }

  return event;
}

export function readTelemetryQueue(): InteractionEvent[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as InteractionEvent[]) : [];
  } catch {
    return [];
  }
}

export function telemetrySummary(events: readonly InteractionEvent[]) {
  return events.reduce<Record<InteractionEventName, number>>(
    (counts, event) => {
      counts[event.name] = (counts[event.name] ?? 0) + 1;
      return counts;
    },
    {
      module_viewed: 0,
      first_interaction: 0,
      control_changed: 0,
      challenge_completed: 0,
      result_summary_viewed: 0,
      essay_reached: 0,
      source_opened: 0,
      insight_copied: 0,
      run_recorded: 0,
      webgl_mounted: 0,
      canvas_fallback: 0,
    },
  );
}

function createEventId(): string {
  const random =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2);
  return `evt_${random}`;
}
