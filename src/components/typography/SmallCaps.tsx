import type { ReactNode } from "react";

/**
 * Render text with OpenType small-caps features. Use for abbreviations
 * and author names in running prose (e.g. <SmallCaps>mises</SmallCaps>).
 */
export function SmallCaps({ children }: { children: ReactNode }) {
  return <span className="sc">{children}</span>;
}
