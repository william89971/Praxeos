import type { Source } from "@/types/module";

/**
 * Primary sources for this module. Aim for 3–7 entries.
 * Prefer archive.org or mises.org links so the URLs outlive publisher churn.
 */
export const sources: readonly Source[] = [
  {
    author: "Ludwig von Mises",
    title: "Human Action: A Treatise on Economics",
    year: 1949,
    publisher: "Yale University Press",
    url: "https://mises.org/library/book/human-action",
    archiveUrl: "https://archive.org/details/humanaction00mise",
    pages: "11–33",
  },
  // Add additional sources here. Every non-trivial claim in essay.mdx
  // should be traceable to one of these.
];
