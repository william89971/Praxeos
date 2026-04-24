import Link from "next/link";

export function Footer() {
  return (
    <footer
      style={{
        borderBlockStart: "1px solid var(--rule)",
        paddingInline: "var(--gutter-inline)",
        paddingBlock: "var(--gutter-block)",
        background: "var(--paper-elevated)",
        marginBlockStart: "auto",
      }}
    >
      <div
        style={{
          maxWidth: "var(--measure-wide)",
          marginInline: "auto",
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) auto",
          gap: "2rem",
          alignItems: "start",
        }}
      >
        <div>
          <p
            style={{
              fontFamily: "var(--font-serif)",
              fontStyle: "italic",
              fontSize: "var(--step-1)",
              color: "var(--ink-primary)",
              marginBlock: 0,
              marginBlockEnd: "0.5rem",
            }}
          >
            Homo agit.
          </p>
          <p
            className="label-mono"
            style={{ color: "var(--ink-tertiary)", maxWidth: "60ch" }}
          >
            Written and built by William Menjivar. Code MIT. Content CC BY 4.0.
          </p>
        </div>

        <nav
          aria-label="Footer"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            alignItems: "end",
          }}
        >
          <Link href="/manifesto" className="label-mono">
            Manifesto
          </Link>
          <Link href="/colophon" className="label-mono">
            Colophon
          </Link>
          <Link href="/rss.xml" className="label-mono">
            RSS
          </Link>
          <a
            href="https://github.com/william89971/praxeos"
            className="label-mono"
            rel="noopener"
          >
            GitHub
          </a>
        </nav>
      </div>
    </footer>
  );
}
