"use client";

import type { CSSProperties } from "react";

/**
 * Fine SVG-noise grain overlaid on dark backgrounds. Pure CSS background,
 * no JS, mix-blend-mode soft-light keeps it from washing the underlying
 * colours. Pointer-events: none — never blocks interaction.
 */
export function GrainOverlay({ opacity = 0.18 }: { readonly opacity?: number }) {
  return <div aria-hidden="true" style={style(opacity)} />;
}

function style(opacity: number): CSSProperties {
  return {
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
    zIndex: 4,
    opacity,
    mixBlendMode: "soft-light",
    backgroundImage: `url("data:image/svg+xml;utf8,${encodeURIComponent(noiseSvg)}")`,
    backgroundSize: "240px 240px",
    backgroundRepeat: "repeat",
  };
}

const noiseSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240">
<filter id="n" x="0" y="0">
  <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/>
  <feColorMatrix values="0 0 0 0 0.95
                         0 0 0 0 0.93
                         0 0 0 0 0.85
                         0 0 0 0.55 0"/>
</filter>
<rect width="100%" height="100%" filter="url(#n)"/>
</svg>`;
