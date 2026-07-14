import type { GuideTurn } from "@/lib/guide/types";
import type { ComponentType } from "react";

export type LabSlug =
  | "choice-machine"
  | "market-without-a-manager"
  | "entrepreneurs-discovery"
  | "money-time-machine";

export type LabMode = "guided" | "explore";

export type EvidenceKind =
  | "simulation observation"
  | "assumption"
  | "source claim"
  | "Austrian interpretation"
  | "credible counterargument";

export interface LabExplanation {
  id: string;
  kind: EvidenceKind;
  title: string;
  detail: string;
  sourceId?: string;
}

export interface LabEngine<State, Action, Metrics, Assumptions> {
  create(seed: string, assumptions: Assumptions): State;
  reduce(state: State, action: Action): State;
  derive(state: State): Metrics;
  describeChange(previous: State, next: State, action: Action): LabExplanation[];
  validate(state: State): readonly string[];
}

export type SelfReviewState =
  | "add simulation evidence"
  | "acknowledge an assumption"
  | "revise or confirm"
  | "ready for self-review";

export interface RubricFeedback {
  id: string;
  status: SelfReviewState;
  message: string;
  basedOn: "completion" | "selected evidence" | "acknowledged assumption" | "revision";
}

export interface LabSession<
  State = Record<string, unknown>,
  Action = Record<string, unknown>,
  Assumptions = Record<string, unknown>,
> {
  version: 3;
  id: string;
  labSlug: LabSlug;
  seed: string;
  mode: LabMode;
  guidedStep: number;
  assumptions: Assumptions;
  actionLog: Action[];
  state: State;
  selectedEvidenceIds: string[];
  acknowledgedAssumptionIds: string[];
  selfReviewChecks: string[];
  initialReasoning: string;
  feedback: RubricFeedback[];
  guideTurn: GuideTurn | null;
  revision: string;
  reflection: string;
  citationIds: string[];
  completedAt: string | null;
  updatedAt: string;
}

export interface ShareEnvelope {
  version: 1;
  labSlug: LabSlug;
  seed: string;
  mode: LabMode;
  assumptionIds: string[];
  actionIds: string[];
}

export interface LabRegistryEntry {
  slug: LabSlug;
  position: 1 | 2 | 3 | 4;
  title: string;
  shortTitle: string;
  centralQuestion: string;
  familiarSituation: string;
  duration: string;
  sourceIds: readonly string[];
  lessonSlugs: readonly string[];
  visualAsset: string;
  accent: "action" | "capital" | "money";
  flagship?: boolean;
  load: () => Promise<{ default: ComponentType }>;
}

export interface EarlierPraxeosRecord {
  id: string;
  sourceLabel: "Calculation Labyrinth" | "Legacy Praxeos";
  initialReasoning: string;
  revision: string;
  reflection: string;
  citationIds: string[];
  originalUpdatedAt: string | null;
  migratedAt: string;
  readOnly: true;
}

export const LAB_SLUGS: readonly LabSlug[] = [
  "choice-machine",
  "market-without-a-manager",
  "entrepreneurs-discovery",
  "money-time-machine",
] as const;

export function isLabSlug(value: unknown): value is LabSlug {
  return typeof value === "string" && (LAB_SLUGS as readonly string[]).includes(value);
}
