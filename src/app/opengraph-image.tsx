import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt =
  "Praxeos — Explorable explanations for Austrian economics and praxeology.";

/**
 * Homepage OG — the wordmark over a quiet field of typographic ornaments.
 */
export default function HomeOG() {
  // A small grid of ornaments as a visual motif.
  const ornaments = Array.from({ length: 12 }, (_, i) => ({
    x: 80 + (i % 6) * 180 + (i < 6 ? 0 : 90),
    y: 120 + Math.floor(i / 6) * 80,
    ch: ["❧", "⁂", "✦", "§", "¶", "†"][i % 6] ?? "❧",
  }));

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#F5F0E6",
        color: "#1C1814",
        fontFamily: '"Times New Roman", "Noto Serif", "DejaVu Serif", serif',
        padding: "60px 80px",
        position: "relative",
      }}
    >
      {/* Ornament field — kept subtle behind the title */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexWrap: "wrap",
          opacity: 0.14,
          pointerEvents: "none",
        }}
      >
        {ornaments.map((o) => (
          <span
            key={`${o.x}-${o.y}-${o.ch}`}
            style={{
              position: "absolute",
              left: o.x,
              top: o.y,
              fontSize: 48,
              color: "#1C1814",
              fontStyle: "italic",
            }}
          >
            {o.ch}
          </span>
        ))}
      </div>

      {/* Top label strip */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 22,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "#8B8275",
        }}
      >
        <span>Praxeos · Fascicle I</span>
        <span style={{ fontStyle: "italic", textTransform: "none" }}>Homo agit.</span>
      </div>

      {/* Hero title block */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <h1
          style={{
            fontSize: 196,
            lineHeight: 0.95,
            letterSpacing: "-0.04em",
            margin: 0,
            fontWeight: 500,
          }}
        >
          PRAXEOS
        </h1>
        <p
          style={{
            fontSize: 36,
            fontStyle: "italic",
            color: "#5C5348",
            marginTop: 4,
            marginBottom: 0,
            maxWidth: "72ch",
          }}
        >
          Explorable explanations for Austrian economics.
        </p>
      </div>

      {/* Bottom byline */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 20,
          color: "#8B8275",
          letterSpacing: "0.04em",
          textTransform: "uppercase",
        }}
      >
        <span>
          Menger · Mises · Hayek · Rothbard · Kirzner · Lachmann · Hoppe · Salerno ·
          Ammous
        </span>
        <span>praxeos.org</span>
      </div>
    </div>,
    size,
  );
}
