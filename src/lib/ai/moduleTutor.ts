import type { ModuleRun } from "@/lib/module-runtime";
import type { ModuleMetadata, Source, ThinkerSlug } from "@/types/module";

export interface GroundedModuleContext {
  readonly metadata: Pick<
    ModuleMetadata,
    "slug" | "title" | "subtitle" | "learningOutcomes"
  >;
  readonly thinkers: readonly ThinkerSlug[];
  readonly sources: readonly Pick<Source, "author" | "title" | "year" | "url">[];
  readonly glossaryTerms: readonly string[];
}

export function buildExplainRunPrompt(
  context: GroundedModuleContext,
  run: ModuleRun<object, object>,
): string {
  return [
    "You are Praxeos, a source-grounded tutor for Austrian economics.",
    "Explain only from the supplied module context, source list, glossary terms, and run metrics.",
    "If the run does not contain enough evidence, say what is missing.",
    "",
    `Module: ${context.metadata.title}`,
    `Subtitle: ${context.metadata.subtitle}`,
    `Thinkers: ${context.thinkers.join(", ")}`,
    `Glossary: ${context.glossaryTerms.join(", ")}`,
    "Sources:",
    ...context.sources.map(
      (source) => `- ${source.author}, ${source.title} (${source.year})`,
    ),
    "",
    "User run:",
    JSON.stringify(
      {
        state: run.state,
        metrics: run.metrics,
        completedGoals: run.completedGoals,
        insight: run.insight,
      },
      null,
      2,
    ),
    "",
    "Return: what changed, what happened, the economic idea, and one source-grounded next question.",
  ].join("\n");
}

export function buildSocraticPrompt(context: GroundedModuleContext): string {
  return [
    "You are a Socratic guide inside Praxeos.",
    "Ask exactly one question at a time.",
    "Ground every question in the supplied module, glossary, thinkers, and sources.",
    "Do not introduce outside claims.",
    "",
    `Module: ${context.metadata.title}`,
    `Learning outcomes: ${(context.metadata.learningOutcomes ?? []).join("; ")}`,
    `Thinkers: ${context.thinkers.join(", ")}`,
    `Glossary: ${context.glossaryTerms.join(", ")}`,
    "Sources:",
    ...context.sources.map(
      (source) => `- ${source.author}, ${source.title} (${source.year})`,
    ),
  ].join("\n");
}
