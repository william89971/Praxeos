import type { MDXComponents } from "mdx/types";
import type { ComponentType } from "react";

/** Published construction logs for the live canon. Dormant notes stay on disk only. */
export interface FieldNoteMeta {
  slug: string;
  title: string;
  moduleSlug?: string;
  publishedAt: string;
  subtitle: string;
}

export const FIELD_NOTES: readonly FieldNoteMeta[] = [];

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
