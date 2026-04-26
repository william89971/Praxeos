import { PathCard } from "@/components/interactive/PathCard";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { complexityToLabel, conceptToAccent } from "@/lib/formatters";
import { MODULE_REGISTRY } from "@/modules/registry";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Modules",
  description:
    "Every Praxeos module — explorable explanations of Austrian economics and praxeology.",
};

export default async function ModulesIndexPage() {
  const modules = await Promise.all(
    MODULE_REGISTRY.map(async (entry) => {
      const mod = await entry.load();
      return { entry, meta: mod.metadata };
    }),
  );

  return (
    <SiteChrome>
      <div
        style={{
          maxWidth: "var(--measure-wide)",
          marginInline: "auto",
          paddingInline: "var(--gutter-inline)",
          paddingBlock: "var(--gutter-block)",
        }}
      >
        <p className="label-mono" style={{ marginBottom: "1rem" }}>
          Praxeos · Modules
        </p>
        <h1 style={{ marginBottom: "1rem" }}>The library.</h1>
        <p
          className="italic"
          style={{
            fontSize: "var(--step-1)",
            color: "var(--ink-secondary)",
            marginBottom: "3rem",
            maxWidth: "52ch",
          }}
        >
          Each module pairs an interactive or generative piece with a
          primary-source-backed essay. They can be read in any order; Fascicle I is
          intended to be read together.
        </p>

        {modules.length === 0 ? (
          <p
            style={{
              color: "var(--ink-tertiary)",
              fontStyle: "italic",
              fontSize: "var(--step-1)",
              maxWidth: "48ch",
            }}
          >
            Fascicle I is in preparation. Return soon.
          </p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(18rem, 1fr))",
              gap: "1.5rem",
            }}
          >
            {modules.map(({ entry, meta }) => (
              <PathCard
                key={entry.slug}
                href={`/modules/${entry.slug}`}
                title={meta.title}
                description={meta.subtitle}
                accent={conceptToAccent(meta.concept)}
                meta={`${meta.readingTimeMin}-min read · ${complexityToLabel(meta.complexity)} · ${"◆".repeat(meta.complexity)}`}
              />
            ))}
          </div>
        )}
      </div>
    </SiteChrome>
  );
}
