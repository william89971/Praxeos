import type { ReactNode } from "react";
import { Footer } from "./Footer";
import { Header } from "./Header";

/**
 * Wraps non-immersive pages with shared Header + Footer chrome.
 * The homepage does NOT use this — its hero is full-bleed.
 */
export function SiteChrome({ children }: { children: ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100dvh" }}>
      <Header />
      <div style={{ flex: 1 }}>{children}</div>
      <Footer />
    </div>
  );
}
