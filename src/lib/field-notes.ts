import type { MDXComponents } from "mdx/types";
import type { ComponentType } from "react";

/** Published construction logs — one per module built during Fascicle I. */
export interface FieldNoteMeta {
  slug: string;
  title: string;
  moduleSlug?: string;
  publishedAt: string;
  subtitle: string;
}

export const FIELD_NOTES: readonly FieldNoteMeta[] = [
  {
    slug: "halving-garden-tile-bake",
    title: "Tile pyramids, Hilbert curves, and 880,000 blocks",
    moduleSlug: "halving-garden",
    publishedAt: "2026-04-23",
    subtitle:
      "Why the Halving Garden bakes SVG tiles offline instead of rendering live, and what the Hilbert layout decision cost.",
  },
  {
    slug: "calculation-problem-engine",
    title: "A deliberately stupid planner",
    moduleSlug: "calculation-problem",
    publishedAt: "2026-04-23",
    subtitle:
      "Why the socialist panel picks recipes by hash(tick, id) and not by optimisation — and what that commits the model to.",
  },
  {
    slug: "time-preference-forest-lsystems",
    title: "L-systems, eight seconds of collapse",
    moduleSlug: "time-preference-forest",
    publishedAt: "2026-04-23",
    subtitle:
      "Branching grammars, a correction cascade that had to feel earned, and the tension between aesthetic and algebra.",
  },
];

type NoteComponent = ComponentType<{ components?: MDXComponents }>;

const LOADERS: Record<string, () => Promise<{ default: NoteComponent }>> = {
  "halving-garden-tile-bake": () =>
    import("@/content/field-notes/halving-garden-tile-bake.mdx"),
  "calculation-problem-engine": () =>
    import("@/content/field-notes/calculation-problem-engine.mdx"),
  "time-preference-forest-lsystems": () =>
    import("@/content/field-notes/time-preference-forest-lsystems.mdx"),
};

export async function loadFieldNote(slug: string): Promise<NoteComponent | null> {
  const loader = LOADERS[slug];
  if (!loader) return null;
  const mod = await loader();
  return mod.default;
}
