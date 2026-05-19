import type { Source } from "@/types/module";

export type BeginnerModuleSlug =
  | "signal-orchard"
  | "monetary-garden"
  | "calculation-labyrinth"
  | "coordination-engine";

export type PathAccent = "bitcoin" | "action" | "capital";

export interface BeginnerPathStep {
  readonly slug: BeginnerModuleSlug;
  readonly order: number;
  readonly title: string;
  readonly shortTitle: string;
  readonly idea: string;
  readonly task: string;
  readonly actionLabel: string;
  readonly badge: string;
  readonly sourceThinker: string;
  readonly estimatedMinutes: number;
  readonly accent: PathAccent;
}

export const BEGINNER_PATH: readonly BeginnerPathStep[] = [
  {
    slug: "signal-orchard",
    order: 1,
    title: "The Signal Orchard",
    shortTitle: "Signal Orchard",
    idea: "Private action becomes social order.",
    task: "Tap actors, send signals, and watch coordination form.",
    actionLabel: "Broadcast a signal",
    badge: "Best first",
    sourceThinker: "Hayek",
    estimatedMinutes: 8,
    accent: "capital",
  },
  {
    slug: "monetary-garden",
    order: 2,
    title: "The Monetary Garden",
    shortTitle: "Monetary Garden",
    idea: "Bad money corrupts economic signals.",
    task: "Create an artificial boom, then reveal the correction.",
    actionLabel: "Reveal the correction",
    badge: "Challenge-based",
    sourceThinker: "Mises",
    estimatedMinutes: 9,
    accent: "bitcoin",
  },
  {
    slug: "calculation-labyrinth",
    order: 3,
    title: "The Calculation Labyrinth",
    shortTitle: "Calculation Labyrinth",
    idea: "Prices make alternatives comparable.",
    task: "Reach the exit with prices, then try without them.",
    actionLabel: "Solve the maze",
    badge: "Challenge-based",
    sourceThinker: "Mises",
    estimatedMinutes: 9,
    accent: "action",
  },
  {
    slug: "coordination-engine",
    order: 4,
    title: "The Coordination Engine",
    shortTitle: "Coordination Engine",
    idea: "Order depends on reliable, timely signals.",
    task: "Inject a shock, then restore coherence.",
    actionLabel: "Stabilize the network",
    badge: "Advanced",
    sourceThinker: "Lachmann",
    estimatedMinutes: 9,
    accent: "bitcoin",
  },
] as const;

export const BEGINNER_TOTAL_MINUTES = BEGINNER_PATH.reduce(
  (total, step) => total + step.estimatedMinutes,
  0,
);

const FALLBACK_PATH_STEP: BeginnerPathStep = {
  slug: "coordination-engine",
  order: 4,
  title: "The Coordination Engine",
  shortTitle: "Coordination Engine",
  idea: "Order depends on reliable, timely signals.",
  task: "Inject a shock, then restore coherence.",
  actionLabel: "Stabilize the network",
  badge: "Advanced",
  sourceThinker: "Lachmann",
  estimatedMinutes: 9,
  accent: "bitcoin",
};

export function pathStepFor(slug: string): BeginnerPathStep | null {
  return BEGINNER_PATH.find((step) => step.slug === slug) ?? null;
}

export function nextPathStep(slug: string): BeginnerPathStep | null {
  const current = pathStepFor(slug);
  if (!current) return null;
  return BEGINNER_PATH[current.order] ?? null;
}

export function firstUncompletedStep(completed: ReadonlySet<string>): BeginnerPathStep {
  return BEGINNER_PATH.find((step) => !completed.has(step.slug)) ?? FALLBACK_PATH_STEP;
}

export function sourceTeaser(source: Source | undefined): string {
  if (!source) return "Primary-source-backed";
  return `${source.author}, ${source.year}`;
}
