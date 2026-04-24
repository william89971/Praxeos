import { SiteChrome } from "@/components/layout/SiteChrome";
import { DisplayTitle } from "@/components/typography/DisplayTitle";
import { Fleuron } from "@/components/typography/Fleuron";
import { FIELD_NOTES } from "@/lib/field-notes";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Field notes",
  description:
    "Honest construction logs from building Praxeos — what worked, what didn't, what the trade-offs look like from inside the work.",
};

export default function FieldNotesIndex() {
  const notes = [...FIELD_NOTES].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );

  return (
    <SiteChrome>
      <header
        style={{
          paddingInline: "var(--gutter-inline)",
          paddingBlock: "var(--gutter-block)",
          maxWidth: "var(--measure-wide)",
          marginInline: "auto",
        }}
      >
        <p className="label-mono" style={{ marginBottom: "1rem" }}>
          Praxeos · Field notes
        </p>
        <DisplayTitle subtitle="Short, honest notes from inside the work. What worked, what didn't, what the trade-offs look like.">
          Field notes.
        </DisplayTitle>
      </header>

      <Fleuron />

      <section
        style={{
          maxWidth: "var(--measure-wide)",
          marginInline: "auto",
          paddingInline: "var(--gutter-inline)",
          paddingBlock: "0 var(--gutter-block)",
        }}
      >
        <ul
          style={{
            listStyle: "none",
            margin: 0,
            padding: 0,
            display: "grid",
            gap: "2.5rem",
          }}
        >
          {notes.map((note) => (
            <li
              key={note.slug}
              style={{
                borderBlockStart: "1px solid var(--rule)",
                paddingBlockStart: "1.5rem",
              }}
            >
              <Link
                href={`/field-notes/${note.slug}`}
                style={{ textDecoration: "none", display: "block" }}
              >
                <p
                  className="label-mono"
                  style={{ color: "var(--ink-tertiary)", marginBlock: 0 }}
                >
                  {new Date(note.publishedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                  {note.moduleSlug ? ` · ${note.moduleSlug}` : null}
                </p>
                <h2 style={{ margin: "0.4rem 0 0.5rem" }}>{note.title}</h2>
                <p
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontStyle: "italic",
                    fontSize: "var(--step-1)",
                    color: "var(--ink-secondary)",
                    margin: 0,
                    maxWidth: "var(--measure-prose)",
                  }}
                >
                  {note.subtitle}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </SiteChrome>
  );
}
