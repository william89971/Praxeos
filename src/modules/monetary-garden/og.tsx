import { formatThinker, toRoman } from "@/lib/formatters";
import { ImageResponse } from "next/og";
import { metadata as moduleMetadata } from "./metadata";

export const runtime = "edge";
export const alt = `${moduleMetadata.title} — Praxeos`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * OG card. Edge runtime; system fonts only (Edge cannot read local woff2).
 * Subtle palette: paper background, oxblood rule, italic subtitle in Times.
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
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          insetInlineStart: "80px",
          insetBlockStart: "260px",
          width: "240px",
          height: "1px",
          background: "#8B3A3A",
        }}
      />

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span
          style={{
            fontSize: 22,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#8B8275",
          }}
        >
          Praxeos · Fascicle {toRoman(moduleMetadata.fascicle)} · Module{" "}
          {moduleMetadata.moduleNumber}
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
            fontSize: 116,
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
            maxWidth: "62ch",
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
          {moduleMetadata.thinkers.slice(0, 4).map(formatThinker).join(" · ")}
        </span>
        <span>{moduleMetadata.readingTimeMin}-min read</span>
      </div>
    </div>,
    size,
  );
}
