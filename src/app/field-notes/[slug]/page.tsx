import { SiteChrome } from "@/components/layout/SiteChrome";
import { essayMDXComponents } from "@/components/mdx/MDXComponents";
import { DisplayTitle } from "@/components/typography/DisplayTitle";
import { Fleuron } from "@/components/typography/Fleuron";
import { FIELD_NOTES, loadFieldNote } from "@/lib/field-notes";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  return FIELD_NOTES.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const note = FIELD_NOTES.find((n) => n.slug === slug);
  if (!note) return {};
  return {
    title: note.title,
    description: note.subtitle,
    openGraph: {
      title: `${note.title} — Praxeos Field Notes`,
      description: note.subtitle,
      type: "article",
      publishedTime: note.publishedAt,
    },
  };
}

export default async function FieldNoteRoute({ params }: { params: Params }) {
  const { slug } = await params;
  const note = FIELD_NOTES.find((n) => n.slug === slug);
  if (!note) notFound();

  const Body = await loadFieldNote(slug);
  if (!Body) notFound();

  const idx = FIELD_NOTES.findIndex((n) => n.slug === slug);
  const prev = idx > 0 ? FIELD_NOTES[idx - 1] : null;
  const next = idx < FIELD_NOTES.length - 1 ? FIELD_NOTES[idx + 1] : null;

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
            Praxeos · Field note ·{" "}
            {new Date(note.publishedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
            {note.moduleSlug ? ` · ${note.moduleSlug}` : null}
          </p>
          <DisplayTitle subtitle={note.subtitle}>{note.title}</DisplayTitle>
        </header>

        <Fleuron />

        <section
          className="module-essay"
          style={{
            maxWidth: "var(--measure-prose)",
            marginInline: "auto",
            paddingInline: "var(--gutter-inline)",
            paddingBlock: "0 var(--gutter-block)",
          }}
        >
          <Body components={essayMDXComponents} />
        </section>

        <Fleuron variant="rule" />

        <nav
          aria-label="Field note navigation"
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
            <Link href={`/field-notes/${prev.slug}`} className="label">
              ← {prev.title}
            </Link>
          ) : (
            <Link href="/field-notes" className="label">
              ← All notes
            </Link>
          )}
          {next ? (
            <Link href={`/field-notes/${next.slug}`} className="label">
              {next.title} →
            </Link>
          ) : (
            <Link href="/field-notes" className="label">
              All notes ↑
            </Link>
          )}
        </nav>
      </article>
    </SiteChrome>
  );
}
