import type { EarlierPraxeosRecord, LabSession, LabSlug } from "@/labs/types";
import { LAB_SLUGS } from "@/labs/types";

export const LEARNING_STORE_KEY = "praxeos.learning.v3";
export const LEARNING_STORE_VERSION = 3 as const;

export const LOCAL_RECORD_NOTE =
  "Saved in this browser only. Praxeos does not copy it to your other devices. Clearing this browser’s site data deletes it.";

export type LessonResponseMode = "answered" | "worked-example" | "continued";

export interface LessonRecord {
  lessonSlug: string;
  responseMode: LessonResponseMode | null;
  selectedChoice: string | null;
  reflection: string;
  updatedAt: string;
}

export interface ConceptSketch {
  id: string;
  lessonSlug: string | null;
  caseSlug: string | null;
  goal: string;
  means: string;
  forgone: string;
  motiveNote: string;
  updatedAt: string;
}

export type StoredLabSession = LabSession<
  Record<string, unknown>,
  Record<string, unknown>,
  Record<string, unknown>
>;

export interface LearningStore {
  version: typeof LEARNING_STORE_VERSION;
  completedLessons: string[];
  labSessions: Record<LabSlug, StoredLabSession[]>;
  activeSessionIds: Partial<Record<LabSlug, string>>;
  earlierRecords: EarlierPraxeosRecord[];
  dismissedLabOnboarding: Partial<Record<LabSlug, boolean>>;
  dismissedRedesignNotice: boolean;
  consentedStudyRecord: boolean;
  lessonRecords: Record<string, LessonRecord>;
  conceptSketches: ConceptSketch[];
}

export function emptyLabSession(
  labSlug: LabSlug,
  now = new Date().toISOString(),
  seed = "praxeos-2026",
): StoredLabSession {
  return {
    version: 3,
    id: `${labSlug}-${now}`,
    labSlug,
    seed,
    mode: "guided",
    guidedStep: 0,
    assumptions: {},
    actionLog: [],
    state: {},
    selectedEvidenceIds: [],
    acknowledgedAssumptionIds: [],
    selfReviewChecks: [],
    initialReasoning: "",
    feedback: [],
    guideTurn: null,
    revision: "",
    reflection: "",
    citationIds: [],
    completedAt: null,
    updatedAt: now,
  };
}

export function emptyLearningStore(): LearningStore {
  return {
    version: 3,
    completedLessons: [],
    labSessions: {
      "choice-machine": [],
      "market-without-a-manager": [],
      "entrepreneurs-discovery": [],
      "money-time-machine": [],
    },
    activeSessionIds: {},
    earlierRecords: [],
    dismissedLabOnboarding: {},
    dismissedRedesignNotice: false,
    consentedStudyRecord: false,
    lessonRecords: {},
    conceptSketches: [],
  };
}

export function migrateLearningStore(
  value: unknown,
  now = new Date().toISOString(),
): LearningStore {
  if (!value || typeof value !== "object") return emptyLearningStore();
  const input = value as Record<string, unknown>;
  if (input.version === 3) return normalizeV3(input);

  const next = emptyLearningStore();
  next.completedLessons = stringArray(input.completedLessons);
  next.earlierRecords = migrateEarlierRecord(input, now);
  return next;
}

export function upsertLabSession(
  store: LearningStore,
  session: StoredLabSession,
): LearningStore {
  const sessions = store.labSessions[session.labSlug];
  const index = sessions.findIndex((item) => item.id === session.id);
  const nextSessions =
    index >= 0
      ? sessions.map((item, itemIndex) => (itemIndex === index ? session : item))
      : [session, ...sessions].slice(0, 12);
  return {
    ...store,
    labSessions: { ...store.labSessions, [session.labSlug]: nextSessions },
    activeSessionIds: { ...store.activeSessionIds, [session.labSlug]: session.id },
  };
}

export function activeLabSession(
  store: LearningStore,
  labSlug: LabSlug,
): StoredLabSession | null {
  const activeId = store.activeSessionIds[labSlug];
  return (
    store.labSessions[labSlug].find((session) => session.id === activeId) ??
    store.labSessions[labSlug][0] ??
    null
  );
}

export function labSessionToMarkdown(session: StoredLabSession): string {
  const lines = [
    `# Praxeos — ${titleFromSlug(session.labSlug)}`,
    "",
    `Status: ${session.completedAt ? `Completed ${session.completedAt}` : "In progress"}`,
    `Mode: ${session.mode}`,
    "",
    "## Initial interpretation",
    "",
    session.initialReasoning || "Not recorded",
    "",
    "## Selected simulation evidence",
    "",
    ...(session.selectedEvidenceIds.length
      ? session.selectedEvidenceIds.map((id) => `- ${id}`)
      : ["- None selected"]),
    "",
    "## Acknowledged assumptions",
    "",
    ...(session.acknowledgedAssumptionIds.length
      ? session.acknowledgedAssumptionIds.map((id) => `- ${id}`)
      : ["- None acknowledged"]),
    "",
    "## Revision",
    "",
    session.revision || "Not recorded",
    "",
    "## Reflection",
    "",
    session.reflection || "Not recorded",
    "",
    "## Sources",
    "",
    ...(session.citationIds.length
      ? session.citationIds.map((id) => `- ${id}`)
      : ["- No citations saved"]),
    "",
    "_This record is not graded._",
    "",
    `_${LOCAL_RECORD_NOTE}_`,
  ];
  return lines.join("\n");
}

function normalizeV3(input: Record<string, unknown>): LearningStore {
  const next = emptyLearningStore();
  next.completedLessons = stringArray(input.completedLessons);
  next.dismissedRedesignNotice = input.dismissedRedesignNotice === true;
  next.consentedStudyRecord = input.consentedStudyRecord === true;
  next.lessonRecords = normalizeLessonRecords(input.lessonRecords);
  next.conceptSketches = normalizeSketches(input.conceptSketches);
  next.earlierRecords = Array.isArray(input.earlierRecords)
    ? input.earlierRecords.filter(isEarlierRecord).slice(0, 12)
    : [];
  const rawSessions = objectValue(input.labSessions);
  for (const slug of LAB_SLUGS) {
    const sessions = rawSessions[slug];
    next.labSessions[slug] = Array.isArray(sessions)
      ? sessions
          .filter((item): item is StoredLabSession => isStoredSession(item, slug))
          .slice(0, 12)
      : [];
  }
  const active = objectValue(input.activeSessionIds);
  for (const slug of LAB_SLUGS) {
    if (typeof active[slug] === "string") next.activeSessionIds[slug] = active[slug];
  }
  return next;
}

function migrateEarlierRecord(
  input: Record<string, unknown>,
  migratedAt: string,
): EarlierPraxeosRecord[] {
  const journey = objectValue(input.journey);
  const initial = objectValue(journey.initial);
  const initialReasoning = Object.entries(initial)
    .filter(
      (entry): entry is [string, string] =>
        typeof entry[1] === "string" && Boolean(entry[1].trim()),
    )
    .map(([field, value]) => `${field}: ${value}`)
    .join("\n");
  const legacyJournal = objectValue(input.journal);
  const reflection =
    typeof journey.finalReflection === "string"
      ? journey.finalReflection
      : typeof legacyJournal.reflection === "string"
        ? legacyJournal.reflection
        : "";
  const revision = typeof journey.revision === "string" ? journey.revision : "";
  const citationIds = stringArray(journey.citations);
  if (!initialReasoning && !revision && !reflection && citationIds.length === 0)
    return [];
  return [
    {
      id: "earlier-calculation-labyrinth",
      sourceLabel: input.journey ? "Calculation Labyrinth" : "Legacy Praxeos",
      initialReasoning,
      revision,
      reflection,
      citationIds,
      originalUpdatedAt:
        typeof journey.updatedAt === "string" ? journey.updatedAt : null,
      migratedAt,
      readOnly: true,
    },
  ];
}

function isStoredSession(value: unknown, slug: LabSlug): value is StoredLabSession {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return item.version === 3 && item.labSlug === slug && typeof item.id === "string";
}

function isEarlierRecord(value: unknown): value is EarlierPraxeosRecord {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return item.readOnly === true && typeof item.id === "string";
}

function objectValue(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

function normalizeLessonRecords(value: unknown): Record<string, LessonRecord> {
  const records: Record<string, LessonRecord> = {};
  if (!value || typeof value !== "object") return records;
  for (const [slug, raw] of Object.entries(value).slice(0, 40)) {
    if (!raw || typeof raw !== "object") continue;
    const item = raw as Record<string, unknown>;
    const mode = item.responseMode;
    records[slug] = {
      lessonSlug: slug,
      responseMode:
        mode === "answered" || mode === "worked-example" || mode === "continued"
          ? mode
          : null,
      selectedChoice:
        typeof item.selectedChoice === "string" ? item.selectedChoice : null,
      reflection:
        typeof item.reflection === "string" ? item.reflection.slice(0, 4000) : "",
      updatedAt: typeof item.updatedAt === "string" ? item.updatedAt : "",
    };
  }
  return records;
}

function normalizeSketches(value: unknown): ConceptSketch[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter(
      (item): item is Record<string, unknown> =>
        Boolean(item) && typeof item === "object",
    )
    .slice(0, 24)
    .map((item, index) => ({
      id: typeof item.id === "string" ? item.id : `sketch-${index}`,
      lessonSlug: typeof item.lessonSlug === "string" ? item.lessonSlug : null,
      caseSlug: typeof item.caseSlug === "string" ? item.caseSlug : null,
      goal: textField(item.goal),
      means: textField(item.means),
      forgone: textField(item.forgone),
      motiveNote: textField(item.motiveNote),
      updatedAt: typeof item.updatedAt === "string" ? item.updatedAt : "",
    }));
}

function textField(value: unknown): string {
  return typeof value === "string" ? value.slice(0, 2000) : "";
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string").slice(0, 100)
    : [];
}

function titleFromSlug(slug: LabSlug): string {
  return {
    "choice-machine": "The Choice Machine",
    "market-without-a-manager": "Market Without a Manager",
    "entrepreneurs-discovery": "The Entrepreneur’s Discovery",
    "money-time-machine": "The Money Time Machine",
  }[slug];
}
