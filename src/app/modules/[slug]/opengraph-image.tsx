import { formatThinker, toRoman } from "@/lib/formatters";
import { findModule } from "@/modules/registry";
import { notFound } from "next/navigation";
import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Praxeos module";

type Params = Promise<{ slug: string }>;

/**
 * Generates an OpenGraph image for a module route.
 * Modules can optionally ship a custom `og.tsx` template;
 * otherwise a generic editorial card is rendered.
 */
export default async function ModuleOG({ params }: { params: Params }) {
  const { slug } = await params;
  const entry = findModule(slug);
  if (!entry) notFound();

  // Try per-module custom OG template
  try {
    const mod = await import(`@/modules/${slug}/og`);
    if (mod.default) {
      return mod.default();
    }
  } catch {
    // No custom og.tsx — fall through to generic card
  }

  const data = await entry.load();

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
        <span>
          Praxeos · Fascicle {toRoman(data.metadata.fascicle)} · Module{" "}
          {data.metadata.moduleNumber}
        </span>
        <span style={{ fontStyle: "italic", textTransform: "none" }}>Homo agit.</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <h1
          style={{
            fontSize: 108,
            lineHeight: 1,
            letterSpacing: "-0.03em",
            margin: 0,
          }}
        >
          {data.metadata.title}
        </h1>
        <p
          style={{
            fontSize: 32,
            fontStyle: "italic",
            color: "#5C5348",
            marginTop: 20,
            maxWidth: "72ch",
          }}
        >
          {data.metadata.subtitle}
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
        <span>{data.metadata.thinkers.slice(0, 3).map(formatThinker).join(" · ")}</span>
        <span>{data.metadata.readingTimeMin}-min read</span>
      </div>
    </div>,
    size,
  );
}
