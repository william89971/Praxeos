import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

const LINKS: Array<{ href: string; label: string }> = [
  { href: "/modules", label: "Modules" },
  { href: "/thinkers", label: "Thinkers" },
  { href: "/manifesto", label: "Manifesto" },
  { href: "/colophon", label: "Colophon" },
];

export function Header() {
  return (
    <header
      style={{
        paddingInline: "var(--gutter-inline)",
        paddingBlock: "1.25rem",
        borderBlockEnd: "1px solid var(--rule)",
        background: "var(--paper)",
        position: "sticky",
        top: 0,
        zIndex: 50,
        backdropFilter: "saturate(1.1) blur(6px)",
      }}
    >
      <div
        style={{
          maxWidth: "var(--measure-wide)",
          marginInline: "auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "2rem",
        }}
      >
        <Link
          href="/"
          aria-label="Praxeos home"
          style={{
            textDecoration: "none",
            fontFamily: "var(--font-serif)",
            fontVariationSettings: '"opsz" 36',
            fontWeight: 500,
            fontSize: "var(--step-1)",
            letterSpacing: "-0.01em",
            color: "var(--ink-primary)",
          }}
        >
          Praxeos<span style={{ color: "var(--ink-tertiary)" }}>.</span>
        </Link>

        <nav aria-label="Primary">
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "flex",
              gap: "2rem",
              alignItems: "center",
            }}
          >
            {LINKS.map((link) => (
              <li key={link.href} className="only-desktop">
                <Link
                  href={link.href}
                  className="label-mono"
                  style={{
                    textDecoration: "none",
                    color: "var(--ink-secondary)",
                  }}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <ThemeToggle />
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
