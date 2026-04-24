import { ImageResponse } from "next/og";
import { metadata as moduleMetadata } from "./metadata";

export const runtime = "edge";
export const alt = `${moduleMetadata.title} — Praxeos`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * OG card for the Time Preference Forest.
 * Minimal, woodcut-inspired.
 */
export default function OGImage() {
  // Procedural tree silhouettes. Simple but readable at 1200x630.
  const trees: Array<{ x: number; height: number; depth: number }> = [];
  let seed = 7;
  const rand = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };
  for (let i = 0; i < 9; i++) {
    trees.push({
      x: 100 + i * 115 + rand() * 20,
      height: 220 + rand() * 80,
      depth: 90 + rand() * 50,
    });
  }

  const groundY = 400;

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
        position: "relative",
      }}
    >
      {/* Top strip */}
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
        <span>Praxeos · Fascicle I · Module II</span>
        <span style={{ fontStyle: "italic", textTransform: "none" }}>Homo agit.</span>
      </div>

      {/* Forest silhouettes (SVG) */}
      <div
        style={{
          flex: 1,
          display: "flex",
          position: "relative",
          alignItems: "flex-end",
          justifyContent: "center",
        }}
      >
        <svg
          width="1200"
          height="430"
          viewBox="0 0 1200 430"
          style={{ position: "absolute", bottom: 0, left: 0 }}
        >
          <title>Forest silhouette</title>
          <line
            x1="0"
            y1={groundY}
            x2="1200"
            y2={groundY}
            stroke="#1C1814"
            strokeWidth="1"
          />
          {trees.map((t) => (
            <g key={t.x} stroke="#1C1814" strokeLinecap="round" fill="none">
              {/* trunk */}
              <line
                x1={t.x}
                y1={groundY}
                x2={t.x}
                y2={groundY - t.height}
                strokeWidth="3"
              />
              {/* two branches */}
              <line
                x1={t.x}
                y1={groundY - t.height * 0.55}
                x2={t.x - 40}
                y2={groundY - t.height * 0.85}
                strokeWidth="1.8"
              />
              <line
                x1={t.x}
                y1={groundY - t.height * 0.65}
                x2={t.x + 42}
                y2={groundY - t.height * 0.95}
                strokeWidth="1.8"
              />
              {/* small sub-branches */}
              <line
                x1={t.x - 30}
                y1={groundY - t.height * 0.82}
                x2={t.x - 48}
                y2={groundY - t.height * 0.95}
                strokeWidth="1"
              />
              <line
                x1={t.x + 28}
                y1={groundY - t.height * 0.88}
                x2={t.x + 52}
                y2={groundY - t.height * 1.02}
                strokeWidth="1"
              />
              {/* roots */}
              <line
                x1={t.x}
                y1={groundY}
                x2={t.x - 25}
                y2={groundY + t.depth * 0.8}
                strokeWidth="1.4"
                strokeDasharray="3 3"
              />
              <line
                x1={t.x}
                y1={groundY}
                x2={t.x + 25}
                y2={groundY + t.depth * 0.8}
                strokeWidth="1.4"
                strokeDasharray="3 3"
              />
              <line
                x1={t.x}
                y1={groundY}
                x2={t.x}
                y2={groundY + t.depth}
                strokeWidth="1.4"
                strokeDasharray="3 3"
              />
            </g>
          ))}
        </svg>
      </div>

      {/* Title strip */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "20px 80px 40px",
          borderTop: "1px solid #D8CFBE",
          background: "#F5F0E6",
        }}
      >
        <h1
          style={{
            fontSize: 76,
            lineHeight: 1,
            letterSpacing: "-0.03em",
            margin: 0,
          }}
        >
          The Time Preference Forest
        </h1>
        <p
          style={{
            fontSize: 26,
            fontStyle: "italic",
            color: "#5C5348",
            marginTop: 14,
            marginBottom: 0,
            maxWidth: "80ch",
          }}
        >
          Austrian capital theory as an eighteenth-century woodcut.
        </p>
      </div>
    </div>,
    size,
  );
}
