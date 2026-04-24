import type { ReactNode } from "react";

/**
 * Module hero title. Always Fraunces at opsz 144. Never used outside
 * module/essay heroes.
 */
export function DisplayTitle({
  children,
  subtitle,
}: {
  children: ReactNode;
  subtitle?: ReactNode;
}) {
  return (
    <div className="display-title">
      <h1
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: "var(--step-7)",
          fontVariationSettings: '"opsz" 144',
          fontWeight: 420,
          lineHeight: 0.95,
          letterSpacing: "-0.025em",
          marginBlockEnd: subtitle ? "0.4em" : 0,
        }}
      >
        {children}
      </h1>
      {subtitle ? (
        <p
          style={{
            fontFamily: "var(--font-serif)",
            fontStyle: "italic",
            fontSize: "var(--step-2)",
            fontVariationSettings: '"opsz" 72',
            color: "var(--ink-secondary)",
            maxWidth: "48ch",
            marginBlockStart: 0,
          }}
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
