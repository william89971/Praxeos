import { ImageResponse } from "next/og";
import { metadata as moduleMetadata } from "./metadata";

export const runtime = "edge";
export const alt = `${moduleMetadata.title} — Praxeos`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * OG card for the Calculation Problem. Typographic — two halves, two fates.
 */
export default function OGImage() {
  const letters = ["c", "p", "r", "g"];

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "#F5F0E6",
        color: "#1C1814",
        fontFamily: '"Times New Roman", "Noto Serif", "DejaVu Serif", serif',
      }}
    >
      {/* Top label strip */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "40px 80px 20px",
          fontSize: 22,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "#8B8275",
        }}
      >
        <span>Praxeos · Fascicle I · Module III</span>
        <span style={{ fontStyle: "italic", textTransform: "none" }}>Homo agit.</span>
      </div>

      {/* Two-panel letter mosaic */}
      <div style={{ display: "flex", flex: 1 }}>
        <Panel label="MARKET" letters={letters} color="#1C1814" density={60} />
        <div
          style={{
            width: 1,
            background: "#D8CFBE",
            display: "flex",
            alignSelf: "stretch",
          }}
        />
        <Panel label="PLANNED" letters={letters} color="#8B3A3A" density={22} chaotic />
      </div>

      {/* Title */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "20px 80px 40px",
          borderTop: "1px solid #D8CFBE",
        }}
      >
        <h1
          style={{
            fontSize: 84,
            lineHeight: 1,
            letterSpacing: "-0.03em",
            margin: 0,
          }}
        >
          The Calculation Problem
        </h1>
        <p
          style={{
            fontSize: 28,
            fontStyle: "italic",
            color: "#5C5348",
            marginTop: 16,
            marginBottom: 0,
            maxWidth: "72ch",
          }}
        >
          Mises's 1920 argument rendered as a two-panel typographic particle system.
        </p>
      </div>
    </div>,
    size,
  );
}

function Panel({
  label,
  letters,
  color,
  density,
  chaotic = false,
}: {
  label: string;
  letters: string[];
  color: string;
  density: number;
  chaotic?: boolean;
}) {
  // Deterministic layout seed based on label so both OG renders produce
  // identical output.
  const cells: Array<{ x: number; y: number; ch: string }> = [];
  const rng = (seed: number) => {
    let s = seed;
    return () => {
      s = (s * 1103515245 + 12345) & 0x7fffffff;
      return s / 0x7fffffff;
    };
  };
  const r = rng(label.charCodeAt(0) * 991);
  for (let i = 0; i < density; i++) {
    cells.push({
      x: r() * 100,
      y: r() * 100,
      ch: letters[Math.floor(r() * letters.length)] ?? "c",
    });
  }

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      <span
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          fontSize: 18,
          letterSpacing: "0.18em",
          color: "#8B8275",
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          padding: "40px",
          height: "100%",
          width: "100%",
          position: "relative",
        }}
      >
        {cells.map((c, i) => (
          <span
            key={`${label}-${c.x.toFixed(2)}-${c.y.toFixed(2)}-${c.ch}`}
            style={{
              position: "absolute",
              left: `${c.x}%`,
              top: `${c.y}%`,
              fontSize: chaotic ? 32 + (i % 3) * 6 : 30,
              color,
              opacity: chaotic ? 0.55 + (i % 7) * 0.06 : 0.85,
              transform: chaotic ? `rotate(${(i % 9) - 4}deg)` : "rotate(0deg)",
              fontFamily: "serif",
            }}
          >
            {c.ch}
          </span>
        ))}
      </div>
    </div>
  );
}
