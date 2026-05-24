import { PathCard } from "@/components/interactive/PathCard";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { complexityToLabel, conceptToAccent } from "@/lib/formatters";
import { MODULE_REGISTRY } from "@/modules/registry";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Legacy Modules",
  description:
    "The original Praxeos visual modules, preserved as a legacy archive while the site shifts toward practical praxeology training.",
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
        <p
          className="label-mono"
          style={{ marginBottom: "1rem", color: "var(--ink-tertiary)" }}
        >
          Praxeos · Legacy archive
        </p>
        <h1 style={{ marginBottom: "1rem" }}>The old visual modules.</h1>
        <p
          className="italic"
          style={{
            fontSize: "var(--step-1)",
            color: "var(--ink-secondary)",
            marginBottom: "3rem",
            maxWidth: "52ch",
          }}
        >
          These interactive art pieces remain available, but they are no longer the main
          learning path. The current direction is the Praxeology study room: short
          scenarios, practice boxes, everyday cases, and saved study notes.
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
