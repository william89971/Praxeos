import type { GuideTurn } from "@/lib/guide/types";
import type { RubricFeedback } from "@/lib/reasoning-rubric";

export const LEARNING_STORE_KEY = "praxeos.learning.v2";
export const LEARNING_STORE_VERSION = 2 as const;

export interface LabState {
  priced: boolean;
  path: readonly string[];
  waste: number;
  uncertainty: number;
}

export interface JourneyRecord {
  id: string;
  stage: number;
  initial: Record<string, string>;
  feedback: RubricFeedback[];
  guide: GuideTurn | null;
  revision: string;
  finalReflection: string;
  pricedRun: LabState | null;
  unpricedRun: LabState | null;
  concepts: string[];
  citations: string[];
  completedAt: string | null;
  updatedAt: string;
}

export interface LearningStore {
  version: typeof LEARNING_STORE_VERSION;
  completedLessons: string[];
  journey: JourneyRecord;
  labProgress: Record<
    string,
    {
      visited?: boolean;
      firstInteraction?: boolean;
      challenge?: boolean;
      essay?: boolean;
      insight?: boolean;
      lastInsight?: string;
      updatedAt?: string;
    }
  >;
  dismissedLabOnboarding: Record<string, boolean>;
  labRuns: Array<{
    id: string;
    slug: string;
    state: Record<string, unknown>;
    metrics: Record<string, unknown>;
    completedGoals: string[];
    timestamp: string;
    insight: string;
  }>;
  consentedStudyRecord: boolean;
}

export function emptyJourney(now = new Date().toISOString()): JourneyRecord {
  return {
    id: "calculation-labyrinth",
    stage: 1,
    initial: {},
    feedback: [],
    guide: null,
    revision: "",
    finalReflection: "",
    pricedRun: null,
    unpricedRun: null,
    concepts: ["economic-calculation", "knowledge-problem", "opportunity-cost"],
    citations: [],
    completedAt: null,
    updatedAt: now,
  };
}

export function emptyLearningStore(): LearningStore {
  return {
    version: LEARNING_STORE_VERSION,
    completedLessons: [],
    journey: emptyJourney(),
    labProgress: {},
    dismissedLabOnboarding: {},
    labRuns: [],
    consentedStudyRecord: false,
  };
}

export function migrateLearningStore(value: unknown): LearningStore {
  if (!value || typeof value !== "object") return emptyLearningStore();
  const input = value as Record<string, unknown>;
  if (input.version === LEARNING_STORE_VERSION && input.journey) {
    return {
      ...emptyLearningStore(),
      ...(input as unknown as LearningStore),
      version: 2,
    };
  }

  const legacyProgress = Array.isArray(input.completedLessons)
    ? input.completedLessons.filter((item): item is string => typeof item === "string")
    : [];
  const legacyJournal =
    typeof input.journal === "object" && input.journal
      ? (input.journal as Record<string, unknown>)
      : {};
  const journey = emptyJourney();
  if (typeof legacyJournal.reflection === "string")
    journey.finalReflection = legacyJournal.reflection;

  return {
    ...emptyLearningStore(),
    completedLessons: legacyProgress,
    journey,
    labProgress:
      typeof input.modules === "object" && input.modules
        ? (input.modules as LearningStore["labProgress"])
        : {},
  };
}

export function serializeShareState(state: LabState): string {
  const safe = {
    p: state.priced ? 1 : 0,
    r: state.path.slice(0, 12).map((item) => item.replace(/[^a-z0-9-]/gi, "")),
    w: Math.max(0, Math.min(99, Math.round(state.waste))),
    u: Math.max(0, Math.min(99, Math.round(state.uncertainty))),
  };
  return btoa(JSON.stringify(safe))
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}

export function parseShareState(encoded: string): LabState | null {
  try {
    const padded = encoded
      .replaceAll("-", "+")
      .replaceAll("_", "/")
      .padEnd(Math.ceil(encoded.length / 4) * 4, "=");
    const raw = JSON.parse(atob(padded)) as {
      p?: unknown;
      r?: unknown;
      w?: unknown;
      u?: unknown;
    };
    if (!Array.isArray(raw.r) || !raw.r.every((item) => typeof item === "string"))
      return null;
    return {
      priced: raw.p === 1,
      path: raw.r.slice(0, 12),
      waste: typeof raw.w === "number" ? Math.max(0, Math.min(99, raw.w)) : 0,
      uncertainty: typeof raw.u === "number" ? Math.max(0, Math.min(99, raw.u)) : 0,
    };
  } catch {
    return null;
  }
}

export function journeyToMarkdown(record: JourneyRecord): string {
  const lines = [
    "# Praxeos learning record",
    "",
    `Completed: ${record.completedAt ?? "In progress"}`,
    "",
    "## Initial interpretation",
    "",
    ...Object.entries(record.initial).map(
      ([field, value]) => `- **${field}:** ${value || "Not recorded"}`,
    ),
    "",
    "## Revision",
    "",
    record.revision || "Not recorded",
    "",
    "## Final reflection",
    "",
    record.finalReflection || "Not recorded",
    "",
    "## Sources",
    "",
    ...record.citations.map((citation) => `- ${citation}`),
  ];
  return lines.join("\n");
}
