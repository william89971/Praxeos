import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/**
 * Apple touch icon — full-bleed paper with centered italic "P".
 */
export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#F5F0E6",
        color: "#1C1814",
        fontFamily: '"Times New Roman", "Noto Serif", serif',
        fontSize: 132,
        fontStyle: "italic",
        fontWeight: 500,
        letterSpacing: "-0.04em",
      }}
    >
      P
    </div>,
    size,
  );
}
