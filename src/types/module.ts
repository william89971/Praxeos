import type { ComponentType } from "react";

/**
 * Praxeos canonical types.
 * Every module and thinker conforms to these shapes so that the registry,
 * sitemaps, OG generators, and cross-link graph can operate uniformly.
 */

export type Complexity = 1 | 2 | 3 | 4 | 5;

/** Ordered list of Austrian thinkers referenced across the site. */
export const THINKER_SLUGS = [
  "menger",
  "bohm-bawerk",
  "mises",
  "hayek",
  "rothbard",
  "kirzner",
  "lachmann",
  "hoppe",
  "salerno",
  "ammous",
] as const;

export type ThinkerSlug = (typeof THINKER_SLUGS)[number];

/** A primary source citation. Prefer archive.org / mises.org / publisher URLs. */
export interface Source {
  author: string;
  title: string;
  year: number;
  publisher?: string;
  url: string;
  archiveUrl?: string;
  pages?: string;
}

/** Metadata authored in each module's metadata.ts. */
export interface ModuleMetadata {
  slug: string;
  title: string;
  subtitle: string;
  concept: string;
  thinkers: readonly ThinkerSlug[];
  complexity: Complexity;
  readingTimeMin: number;
  publishedAt: string;
  updatedAt?: string;
  fascicle: number;
  moduleNumber: number;
  /** `"desktop"` marks modules that need a real pointer/GPU for best effect. */
  bestOn: "desktop" | "any";
  /** Does this module's essay use KaTeX math? Controls whether math CSS ships. */
  hasMath: boolean;
  /** Does this module have opt-in generative audio? */
  hasAudio: boolean;
  /** Relative path under /public/posters/ for the reduced-motion fallback. */
  posterSrc: string;
  /** Textual description of the sketch for screen readers. 80–120 words. */
  sketchDescription: string;
  /** Open question shown at end of module essay. */
  discussionPrompt: string;
}

/** Fully resolved module record used by the registry and routes. */
export interface ModuleRecord {
  metadata: ModuleMetadata;
  sources: readonly Source[];
  /** The React component that renders the module. */
  Component: ComponentType;
}

/** Module record exported from each module's index.tsx. */
export interface ModuleExport {
  metadata: ModuleMetadata;
  sources: readonly Source[];
  default: ComponentType;
}

/** Concept tag used for cross-linking (see /docs/PHILOSOPHY.md). */
export type Concept =
  | "action-axiom"
  | "time-preference"
  | "subjective-value"
  | "marginal-utility"
  | "economic-calculation"
  | "knowledge-problem"
  | "spontaneous-order"
  | "capital-theory"
  | "roundaboutness"
  | "regression-theorem"
  | "sound-money"
  | "abct"
  | "cantillon-effect"
  | "entrepreneurship"
  | "regime-uncertainty"
  | "says-law";
