import { ImageResponse } from "next/og";
import { metadata as moduleMetadata } from "./metadata";

export const runtime = "edge";
export const alt = `${moduleMetadata.title} — Praxeos`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Haeckel-inspired silhouette grid. Four panels, each with a cluster of
 * botanical forms rendered via SVG path, plus HTML-flex plaques for text
 * (Edge runtime Satori does not support SVG text elements).
 */
export default function OGImage() {
  const panelLabels = ["I", "II", "III", "IV"];
  const panelCount = panelLabels.length;
  const panelWidth = 1200 / panelCount;
  const plaqueBottom = 66;

  let seed = 17;
  const rand = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };

  type Organism = {
    cx: number;
    cy: number;
    size: number;
    rotation: number;
    petals: number;
    orange: boolean;
  };
  const organisms: Organism[] = [];
  for (let p = 0; p < panelCount; p++) {
    const count = 6 + Math.floor(rand() * 4);
    for (let i = 0; i < count; i++) {
      organisms.push({
        cx: p * panelWidth + 40 + rand() * (panelWidth - 80),
        cy: plaqueBottom + 30 + rand() * (410 - plaqueBottom - 40),
        size: 22 + rand() * 22,
        rotation: rand() * Math.PI * 2,
        petals: 4 + Math.floor(rand() * 5),
        orange: rand() < 0.1,
      });
    }
  }

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
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "40px 80px 16px",
          fontSize: 22,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "#8B8275",
        }}
      >
        <span>Praxeos · Fascicle I · Module I</span>
        <span style={{ fontStyle: "italic", textTransform: "none" }}>Homo agit.</span>
      </div>

      <div
        style={{
          display: "flex",
          height: 48,
          alignItems: "center",
          borderBottom: "1px solid #D8CFBE",
        }}
      >
        {panelLabels.map((roman, i) => (
          <div
            key={roman}
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
              fontStyle: "italic",
              color: "#1C1814",
              borderLeft: i > 0 ? "1px solid #D8CFBE" : "none",
            }}
          >
            — {roman} —
          </div>
        ))}
      </div>

      <div style={{ position: "relative", flex: 1, display: "flex" }}>
        <svg
          width="1200"
          height="410"
          viewBox="0 0 1200 410"
          style={{ position: "absolute", top: 0, left: 0 }}
        >
          <title>Botanical field</title>
          {[1, 2, 3].map((i) => (
            <line
              key={`div-${i}`}
              x1={i * panelWidth}
              y1={0}
              x2={i * panelWidth}
              y2={410}
              stroke="#D8CFBE"
              strokeWidth="1"
            />
          ))}

          {organisms.map((o) => (
            <g
              key={`${o.cx.toFixed(1)}-${o.cy.toFixed(1)}-${o.size.toFixed(1)}`}
              transform={`translate(${o.cx - 34} ${o.cy - 66}) rotate(${
                (o.rotation * 180) / Math.PI
              })`}
              stroke="#1C1814"
              strokeLinecap="round"
              strokeWidth="1.2"
              fill="none"
            >
              <circle
                cx={0}
                cy={0}
                r={2}
                fill={o.orange ? "#E87722" : "#1C1814"}
                stroke="none"
              />
              {Array.from({ length: o.petals }, (_, p) => {
                const angle = (p / o.petals) * Math.PI * 2;
                const tipX = Math.cos(angle) * o.size;
                const tipY = Math.sin(angle) * o.size;
                const cx1 = Math.cos(angle + 0.3) * o.size * 0.5;
                const cy1 = Math.sin(angle + 0.3) * o.size * 0.5;
                const d = `M 0 0 Q ${cx1} ${cy1} ${tipX} ${tipY}`;
                return <path key={d} d={d} />;
              })}
            </g>
          ))}
        </svg>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "18px 80px 34px",
          borderTop: "1px solid #D8CFBE",
          background: "#F5F0E6",
        }}
      >
        <h1
          style={{
            fontSize: 78,
            lineHeight: 1,
            letterSpacing: "-0.03em",
            margin: 0,
          }}
        >
          The Halving Garden
        </h1>
        <p
          style={{
            fontSize: 26,
            fontStyle: "italic",
            color: "#5C5348",
            marginTop: 12,
            marginBottom: 0,
            maxWidth: "80ch",
          }}
        >
          Bitcoin's history as an illuminated manuscript.
        </p>
      </div>
    </div>,
    size,
  );
}
