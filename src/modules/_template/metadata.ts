import type { ModuleMetadata } from "@/types/module";

/**
 * Module metadata. Fill every field before shipping.
 * The `slug` must match the directory name.
 */
export const metadata: ModuleMetadata = {
  slug: "__TEMPLATE_SLUG__",
  title: "__TEMPLATE_TITLE__",
  subtitle: "__TEMPLATE_SUBTITLE__",
  concept: "__TEMPLATE_CONCEPT__",
  thinkers: ["mises"],
  complexity: 3,
  readingTimeMin: 8,
  publishedAt: "__TEMPLATE_PUBLISHED_AT__",
  fascicle: 1,
  moduleNumber: 0,
  bestOn: "any",
  hasMath: false,
  hasAudio: false,
  posterSrc: "/posters/__TEMPLATE_SLUG__.svg",
  sketchDescription:
    "A static description of what the sketch portrays, for screen readers and reduced-motion visitors. 80–120 words. Describe what changes as parameters change and what the reader should come to see.",
  discussionPrompt:
    "A single open question that leaves the reader with something to chew on after closing the tab.",
};
