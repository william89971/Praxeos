"use client";

import Link from "next/link";
import { useState } from "react";
import { ThemeToggle } from "./ThemeToggle";

const LINKS: Array<{ href: string; label: string }> = [
  { href: "/modules", label: "Modules" },
  { href: "/thinkers", label: "Thinkers" },
  { href: "/glossary", label: "Glossary" },
  { href: "/manifesto", label: "Manifesto" },
  { href: "/built", label: "Built" },
  { href: "/colophon", label: "Colophon" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

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

        {/* Desktop nav */}
        <nav aria-label="Primary" className="only-desktop">
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
              <li key={link.href}>
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

        {/* Mobile controls */}
        <div
          className="only-mobile"
          style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
        >
          <ThemeToggle />
          <button
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            onClick={() => setMobileOpen((v) => !v)}
            style={{
              background: "none",
              border: "none",
              padding: "0.5rem",
              cursor: "pointer",
              color: "var(--ink-primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <HamburgerIcon open={mobileOpen} />
          </button>
        </div>
      </div>

      {/* Mobile nav panel */}
      {mobileOpen ? (
        <nav
          id="mobile-nav"
          aria-label="Mobile primary"
          className="only-mobile"
          style={{
            marginBlockStart: "1rem",
            paddingBlockStart: "1rem",
            borderBlockStart: "1px solid var(--rule)",
          }}
        >
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
            }}
          >
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="label-mono"
                  onClick={() => setMobileOpen(false)}
                  style={{
                    textDecoration: "none",
                    color: "var(--ink-secondary)",
                    display: "block",
                    paddingBlock: "0.35rem",
                  }}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}

function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="22"
      height="16"
      viewBox="0 0 22 16"
      fill="none"
      aria-hidden="true"
      style={{
        transition: "transform var(--dur-micro) var(--ease-organic)",
      }}
    >
      {open ? (
        <>
          <path
            d="M2 2 L20 14"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M2 14 L20 2"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </>
      ) : (
        <>
          <path
            d="M1 2 L21 2"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M1 8 L21 8"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M1 14 L21 14"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </>
      )}
    </svg>
  );
}
