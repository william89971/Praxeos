import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/**
 * App icon — a monogrammed "P" set in a serif register over warm paper.
 * Used for browser tab favicons and OS home-screen icons.
 */
export default function Icon() {
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
        fontSize: 46,
        fontStyle: "italic",
        fontWeight: 500,
        letterSpacing: "-0.04em",
        borderRadius: 10,
        border: "1px solid #1C1814",
      }}
    >
      P
    </div>,
    size,
  );
}
