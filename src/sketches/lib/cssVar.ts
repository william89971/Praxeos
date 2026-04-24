/**
 * Resolve a CSS custom property at render time and convert to an
 * `rgba(…, alpha)` string. Used by canvas sketches that need to honour
 * the `[data-theme]` switch at the document root.
 *
 * `fallback` is used when not running in a browser (SSR, tests, or the
 * @vercel/og Edge runtime where `document` is absent).
 *
 * Only #RRGGBB hex variables are supported; other forms are returned
 * verbatim. Tokens in `src/styles/tokens.css` are all #RRGGBB today.
 */
export function cssVar(name: string, fallback: string, alpha: number): string {
  const value =
    typeof window !== "undefined"
      ? getComputedStyle(document.documentElement).getPropertyValue(name).trim()
      : "";
  const hex = value || fallback;
  if (hex.startsWith("#") && hex.length === 7) {
    const r = Number.parseInt(hex.slice(1, 3), 16);
    const g = Number.parseInt(hex.slice(3, 5), 16);
    const b = Number.parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  return hex;
}
