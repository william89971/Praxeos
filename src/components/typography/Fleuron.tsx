/**
 * Typographic ornament for section breaks.
 * Variants: asterism (⁂), fleuron (❧), three-dots (· · ·).
 * Default is fleuron.
 */

type Variant = "fleuron" | "asterism" | "dots" | "rule";

const GLYPHS: Record<Exclude<Variant, "rule">, string> = {
  fleuron: "❧",
  asterism: "⁂",
  dots: "· · ·",
};

export function Fleuron({ variant = "fleuron" }: { variant?: Variant }) {
  if (variant === "rule") {
    return (
      <hr
        style={{
          border: "none",
          height: "1px",
          background: "var(--rule)",
          margin: "3em auto",
          width: "6rem",
        }}
      />
    );
  }
  return (
    <div
      aria-hidden="true"
      style={{
        textAlign: "center",
        margin: "3em 0",
        fontFamily: "var(--font-serif)",
        fontSize: "var(--step-2)",
        color: "var(--ink-tertiary)",
        letterSpacing: "0.4em",
      }}
    >
      {GLYPHS[variant]}
    </div>
  );
}
