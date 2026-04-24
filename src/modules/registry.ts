/**
 * Praxeos — Module Registry
 *
 * The canonical list of modules, ordered by fascicle and then module number.
 * `bun run new-module <slug>` appends new entries here.
 *
 * Each entry is a lazy reference to a module's index.tsx so we don't eagerly
 * import every sketch on every route.
 */

import type { ModuleMetadata } from "@/types/module";

type RegistryEntry = {
  slug: string;
  fascicle: number;
  moduleNumber: number;
  title: string;
  subtitle: string;
  /** Lazy loader returning the module's exports. */
  load: () => Promise<{
    metadata: ModuleMetadata;
    sources: ReadonlyArray<import("@/types/module").Source>;
    default: import("react").ComponentType;
  }>;
};

export const MODULE_REGISTRY: readonly RegistryEntry[] = [
  {
    slug: "halving-garden",
    fascicle: 1,
    moduleNumber: 1,
    title: "The Halving Garden",
    subtitle:
      "Every Bitcoin block from genesis to tip, rendered as a living generative manuscript.",
    load: () => import("@/modules/halving-garden"),
  },
  {
    slug: "time-preference-forest",
    fascicle: 1,
    moduleNumber: 2,
    title: "The Time Preference Forest",
    subtitle:
      "Austrian capital theory as an eighteenth-century woodcut. Roots go where saving goes; the canopy is only as real as the roots.",
    load: () => import("@/modules/time-preference-forest"),
  },
  {
    slug: "calculation-problem",
    fascicle: 1,
    moduleNumber: 3,
    title: "The Calculation Problem",
    subtitle:
      "Mises's 1920 argument rendered as a two-panel typographic particle system.",
    load: () => import("@/modules/calculation-problem"),
  },
  // <-- new-module CLI inserts entries here -->
] as const;

export function findModule(slug: string): RegistryEntry | undefined {
  return MODULE_REGISTRY.find((m) => m.slug === slug);
}

export function moduleSlugs(): string[] {
  return MODULE_REGISTRY.map((m) => m.slug);
}

export function adjacentModules(slug: string): {
  prev: RegistryEntry | null;
  next: RegistryEntry | null;
} {
  const index = MODULE_REGISTRY.findIndex((m) => m.slug === slug);
  if (index === -1) return { prev: null, next: null };
  return {
    prev: index > 0 ? (MODULE_REGISTRY[index - 1] ?? null) : null,
    next:
      index < MODULE_REGISTRY.length - 1 ? (MODULE_REGISTRY[index + 1] ?? null) : null,
  };
}
