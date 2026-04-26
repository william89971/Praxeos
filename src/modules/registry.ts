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
    slug: "monetary-garden",
    fascicle: 1,
    moduleNumber: 1,
    title: "The Monetary Garden",
    subtitle: "Watch an economy bloom or decay as the money signal changes.",
    load: () => import("@/modules/monetary-garden"),
  },
  {
    slug: "signal-orchard",
    fascicle: 1,
    moduleNumber: 2,
    title: "The Signal Orchard",
    subtitle: "See how human choices become social coordination.",
    load: () => import("@/modules/signal-orchard"),
  },
  {
    slug: "calculation-labyrinth",
    fascicle: 1,
    moduleNumber: 3,
    title: "The Calculation Labyrinth",
    subtitle: "Try to plan without prices — and watch the map disappear.",
    load: () => import("@/modules/calculation-labyrinth"),
  },
  {
    slug: "coordination-engine",
    fascicle: 1,
    moduleNumber: 4,
    title: "The Coordination Engine",
    subtitle: "Follow the signal layer that lets millions act together.",
    load: () => import("@/modules/coordination-engine"),
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
