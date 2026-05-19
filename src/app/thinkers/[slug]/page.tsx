import { SiteChrome } from "@/components/layout/SiteChrome";
import { essayMDXComponents } from "@/components/mdx/MDXComponents";
import { DisplayTitle } from "@/components/typography/DisplayTitle";
import { Fleuron } from "@/components/typography/Fleuron";
import { THINKERS, loadThinkerBio } from "@/lib/thinkers";
import type { ThinkerSlug } from "@/types/module";
import { THINKER_SLUGS } from "@/types/module";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";

type RouteParams = { slug: string };

export async function generateStaticParams(): Promise<RouteParams[]> {
  return THINKERS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const thinker = THINKERS.find((t) => t.slug === slug);
  if (!thinker) return {};
  return {
    title: thinker.name,
    description: thinker.contribution,
    openGraph: {
      title: `${thinker.name} — Praxeos`,
      description: thinker.contribution,
      type: "profile",
    },
  };
}

function isThinkerSlug(slug: string): slug is ThinkerSlug {
  return (THINKER_SLUGS as readonly string[]).includes(slug);
}

export default async function ThinkerRoute({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { slug } = await params;
  if (!isThinkerSlug(slug)) notFound();

  const thinker = THINKERS.find((t) => t.slug === slug);
  if (!thinker) notFound();

  const Bio = await loadThinkerBio(slug);

  const currentIdx = THINKERS.findIndex((t) => t.slug === slug);
  const prev = currentIdx > 0 ? THINKERS[currentIdx - 1] : null;
  const next = currentIdx < THINKERS.length - 1 ? THINKERS[currentIdx + 1] : null;

  return (
    <SiteChrome>
      <article>
        <header
          style={{
            paddingInline: "var(--gutter-inline)",
            paddingBlock: "var(--gutter-block)",
            maxWidth: "var(--measure-wide)",
            marginInline: "auto",
          }}
        >
          <p className="label-mono" style={{ marginBottom: "1rem" }}>
            Praxeos · Thinkers · {thinker.dates}
          </p>
          <DisplayTitle subtitle={thinker.contribution}>{thinker.name}</DisplayTitle>
        </header>

        <Fleuron />

        <section
          aria-label="Thinker significance"
          style={{
            maxWidth: "var(--measure-wide)",
            marginInline: "auto",
            paddingInline: "var(--gutter-inline)",
            paddingBlock: "0 calc(var(--gutter-block) * 0.75)",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(18rem, 1fr))",
            gap: "1rem",
          }}
        >
          <InfoPanel title="Short History">{thinker.shortHistory}</InfoPanel>
          <InfoPanel title="Praxeology">{thinker.praxeologySignificance}</InfoPanel>
          <InfoPanel title="Why this matters to Praxeos">
            {thinker.praxeosRelevance}
          </InfoPanel>
        </section>

        <section
          style={{
            maxWidth: "var(--measure-wide)",
            marginInline: "auto",
            paddingInline: "var(--gutter-inline)",
            paddingBlock: "0 calc(var(--gutter-block) * 0.75)",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(18rem, 1fr))",
            gap: "1rem",
          }}
        >
          <div style={listPanelStyle}>
            <p className="label-mono" style={panelLabelStyle}>
              Key works
            </p>
            <ul style={plainListStyle}>
              {thinker.keyWorks.map((work) => (
                <li key={work}>{work}</li>
              ))}
            </ul>
          </div>
          <div style={listPanelStyle}>
            <p className="label-mono" style={panelLabelStyle}>
              Primary links
            </p>
            <ul style={plainListStyle}>
              {thinker.primaryLinks.map((source) => (
                <li key={source.url}>
                  <a href={source.url} rel="noopener">
                    {source.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section
          className="module-essay drop-cap"
          style={{
            maxWidth: "var(--measure-prose)",
            marginInline: "auto",
            paddingInline: "var(--gutter-inline)",
            paddingBlock: "0 var(--gutter-block)",
          }}
        >
          <Bio components={essayMDXComponents} />
        </section>

        <Fleuron variant="rule" />

        <nav
          aria-label="Thinker navigation"
          style={{
            maxWidth: "var(--measure-wide)",
            marginInline: "auto",
            paddingInline: "var(--gutter-inline)",
            paddingBlock: "var(--gutter-block)",
            display: "flex",
            justifyContent: "space-between",
            borderBlockStart: "1px solid var(--rule)",
          }}
        >
          {prev ? (
            <Link href={`/thinkers/${prev.slug}`} className="label">
              ← {prev.name}
            </Link>
          ) : (
            <Link href="/thinkers" className="label">
              ← Index
            </Link>
          )}
          {next ? (
            <Link href={`/thinkers/${next.slug}`} className="label">
              {next.name} →
            </Link>
          ) : (
            <Link href="/thinkers" className="label">
              Index ↑
            </Link>
          )}
        </nav>
      </article>
    </SiteChrome>
  );
}

function InfoPanel({
  title,
  children,
}: {
  readonly title: string;
  readonly children: string;
}) {
  return (
    <div style={listPanelStyle}>
      <p className="label-mono" style={panelLabelStyle}>
        {title}
      </p>
      <p
        style={{
          margin: 0,
          fontFamily: "var(--font-serif)",
          fontSize: "var(--step-0)",
          lineHeight: 1.5,
          color: "var(--ink-secondary)",
        }}
      >
        {children}
      </p>
    </div>
  );
}

const listPanelStyle: CSSProperties = {
  display: "grid",
  alignContent: "start",
  gap: "0.7rem",
  padding: "1rem",
  border: "1px solid var(--rule)",
  borderRadius: "var(--radius-sm)",
  background: "var(--paper-elevated)",
};

const panelLabelStyle: CSSProperties = {
  margin: 0,
  color: "var(--ink-tertiary)",
};

const plainListStyle: CSSProperties = {
  margin: 0,
  paddingInlineStart: "1.1rem",
  color: "var(--ink-secondary)",
  lineHeight: 1.65,
};
