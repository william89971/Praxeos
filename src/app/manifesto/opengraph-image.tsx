import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Ends and Means — The Praxeos Manifesto";

export default function ManifestoOG() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "80px",
        background: "#F5F0E6",
        color: "#1C1814",
        fontFamily: '"Times New Roman", "Noto Serif", "DejaVu Serif", serif',
      }}
    >
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
        <span>Praxeos · Manifesto · § 0</span>
        <span style={{ fontStyle: "italic", textTransform: "none" }}>Homo agit.</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <h1
          style={{
            fontSize: 136,
            lineHeight: 0.95,
            letterSpacing: "-0.03em",
            margin: 0,
            fontStyle: "italic",
            fontWeight: 500,
          }}
        >
          Ends and Means
        </h1>
        <p
          style={{
            fontSize: 34,
            color: "#5C5348",
            marginTop: 0,
            marginBottom: 0,
            maxWidth: "72ch",
          }}
        >
          A manifesto on explorable explanations, the Austrian tradition, and the craft
          of teaching ideas seriously.
        </p>
      </div>
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
        <span>By William Menjivar</span>
        <span>praxeos.org/manifesto</span>
      </div>
    </div>,
    size,
  );
}
