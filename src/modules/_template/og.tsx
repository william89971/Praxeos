import { ImageResponse } from "next/og";
import { metadata as moduleMetadata } from "./metadata";

export const runtime = "edge";
export const alt = `${moduleMetadata.title} — Praxeos`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Default OG card for this module. Override by editing this file.
 * Uses system fonts for Edge runtime (next/og cannot read local woff2).
 * Serif metric-compatible fallback preserves the visual register.
 */
export default function OGImage() {
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
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span
          style={{
            fontSize: 22,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#8B8275",
          }}
        >
          Praxeos · Fascicle {toRoman(moduleMetadata.fascicle)}
        </span>
        <span
          style={{
            fontSize: 22,
            fontStyle: "italic",
            color: "#8B8275",
          }}
        >
          Homo agit.
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <h1
          style={{
            fontSize: 120,
            lineHeight: 1,
            letterSpacing: "-0.03em",
            margin: 0,
          }}
        >
          {moduleMetadata.title}
        </h1>
        <p
          style={{
            fontSize: 36,
            fontStyle: "italic",
            color: "#5C5348",
            marginTop: 24,
            maxWidth: "64ch",
          }}
        >
          {moduleMetadata.subtitle}
        </p>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 22,
          color: "#8B8275",
          letterSpacing: "0.04em",
          textTransform: "uppercase",
        }}
      >
        <span>
          {moduleMetadata.thinkers.slice(0, 3).map(formatThinker).join(" · ")}
        </span>
        <span>{moduleMetadata.readingTimeMin}-min read</span>
      </div>
    </div>,
    size,
  );
}

function formatThinker(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function toRoman(n: number): string {
  const map: Array<[number, string]> = [
    [10, "X"],
    [9, "IX"],
    [5, "V"],
    [4, "IV"],
    [1, "I"],
  ];
  let out = "";
  let r = n;
  for (const [v, g] of map) {
    while (r >= v) {
      out += g;
      r -= v;
    }
  }
  return out || "I";
}
