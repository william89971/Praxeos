import type { Complexity } from "@/types/module";

/**
 * Convert a complexity level (1–5) to a human-readable label.
 */
export function complexityToLabel(
  c: Complexity,
): "Beginner" | "Intermediate" | "Advanced" {
  if (c <= 2) return "Beginner";
  if (c === 3) return "Intermediate";
  return "Advanced";
}

/**
 * Convert a number to a Roman numeral (1–10).
 */
export function toRoman(n: number): string {
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

/**
 * Format a thinker slug into a display name.
 * Falls back to title-casing the slug segments.
 */
export function formatThinker(slug: string): string {
  const map: Record<string, string> = {
    menger: "Carl Menger",
    "bohm-bawerk": "Eugen von Böhm-Bawerk",
    mises: "Ludwig von Mises",
    hayek: "F. A. Hayek",
    rothbard: "Murray Rothbard",
    kirzner: "Israel Kirzner",
    lachmann: "Ludwig Lachmann",
    hoppe: "Hans-Hermann Hoppe",
    salerno: "Joseph Salerno",
    ammous: "Saifedean Ammous",
  };
  return (
    map[slug] ??
    slug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ")
  );
}

/**
 * Derive an accent color from a module concept tag.
 */
export function conceptToAccent(concept: string): "bitcoin" | "action" | "capital" {
  switch (concept) {
    case "sound-money":
    case "cantillon-effect":
    case "regression-theorem":
      return "bitcoin";
    case "economic-calculation":
    case "action-axiom":
    case "knowledge-problem":
    case "regime-uncertainty":
      return "action";
    default:
      return "capital";
  }
}
