import Image from "next/image";

/**
 * Static pre-rendered poster frame for a module's sketch.
 * Shown before the client sketch initializes (for fast LCP), under
 * prefers-reduced-motion, and to screen readers with the description.
 */
export function PosterFallback({
  src,
  alt,
  width = 1600,
  height = 900,
}: {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}) {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: `${width} / ${height}`,
        background: "var(--paper-sunk)",
        overflow: "hidden",
      }}
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority
        sizes="100vw"
        style={{ objectFit: "cover", width: "100%", height: "100%" }}
      />
    </div>
  );
}
