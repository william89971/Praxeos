import type { ThinkerSlug } from "@/types/module";
import type { MDXComponents } from "mdx/types";
import type { ComponentType } from "react";

type BioComponent = ComponentType<{ components?: MDXComponents }>;

/**
 * Static import map of thinker bio MDX files.
 * Keeps the dynamic route free of `dynamic()` + Turbopack edge cases.
 */
const THINKER_LOADERS: Record<ThinkerSlug, () => Promise<{ default: BioComponent }>> = {
  menger: () => import("@/content/thinkers/menger.mdx"),
  "bohm-bawerk": () => import("@/content/thinkers/bohm-bawerk.mdx"),
  mises: () => import("@/content/thinkers/mises.mdx"),
  hayek: () => import("@/content/thinkers/hayek.mdx"),
  rothbard: () => import("@/content/thinkers/rothbard.mdx"),
  kirzner: () => import("@/content/thinkers/kirzner.mdx"),
  lachmann: () => import("@/content/thinkers/lachmann.mdx"),
  hoppe: () => import("@/content/thinkers/hoppe.mdx"),
  salerno: () => import("@/content/thinkers/salerno.mdx"),
  ammous: () => import("@/content/thinkers/ammous.mdx"),
};

export async function loadThinkerBio(slug: ThinkerSlug) {
  const loader = THINKER_LOADERS[slug];
  const mod = await loader();
  return mod.default;
}

export interface ThinkerMeta {
  slug: ThinkerSlug;
  name: string;
  dates: string;
  contribution: string;
}

export const THINKERS: readonly ThinkerMeta[] = [
  {
    slug: "menger",
    name: "Carl Menger",
    dates: "1840–1921",
    contribution:
      "Founded the Austrian school. Subjective theory of value; origin of money.",
  },
  {
    slug: "bohm-bawerk",
    name: "Eugen von Böhm-Bawerk",
    dates: "1851–1914",
    contribution:
      "Austrian capital theory; pure time-preference theory of interest; roundaboutness.",
  },
  {
    slug: "mises",
    name: "Ludwig von Mises",
    dates: "1881–1973",
    contribution:
      "Praxeology; economic calculation argument; regression theorem; systematic Austrian economics.",
  },
  {
    slug: "hayek",
    name: "F. A. Hayek",
    dates: "1899–1992",
    contribution:
      "Knowledge problem; spontaneous order; Austrian business-cycle theory; rule of law.",
  },
  {
    slug: "rothbard",
    name: "Murray Rothbard",
    dates: "1926–1995",
    contribution:
      "Systematiser of the tradition; ABCT applied; monetary history; sound money.",
  },
  {
    slug: "kirzner",
    name: "Israel Kirzner",
    dates: "1930–",
    contribution: "Entrepreneurship as alertness; market as process, not state.",
  },
  {
    slug: "lachmann",
    name: "Ludwig Lachmann",
    dates: "1906–1990",
    contribution: "Heterogeneous capital; subjective expectations; kaleidic economy.",
  },
  {
    slug: "hoppe",
    name: "Hans-Hermann Hoppe",
    dates: "1949–",
    contribution:
      "Argumentation ethics; time-preference analysis of political regimes.",
  },
  {
    slug: "salerno",
    name: "Joseph Salerno",
    dates: "1950–",
    contribution: "Reconstruction of Mises; Lange–Lerner critique; sound money.",
  },
  {
    slug: "ammous",
    name: "Saifedean Ammous",
    dates: "1975–",
    contribution:
      "Bitcoin as sound money; stock-to-flow; digital realisation of Mengerian monetary tradition.",
  },
];
