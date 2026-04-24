import { ExplorePrompt } from "@/components/interactive/ExplorePrompt";
import { KeyIdeaCard } from "@/components/interactive/KeyIdeaCard";
import { Citation } from "@/components/typography/Citation";
import { Fleuron } from "@/components/typography/Fleuron";
import { Footnote } from "@/components/typography/Footnote";
import { Marginalia } from "@/components/typography/Marginalia";
import { PullQuote } from "@/components/typography/PullQuote";
import { SmallCaps } from "@/components/typography/SmallCaps";
import { RoundaboutnessDiagram } from "@/modules/time-preference-forest/components/RoundaboutnessDiagram";
import type { MDXComponents } from "mdx/types";
import type { ComponentPropsWithoutRef } from "react";

/**
 * Typography contract for MDX essays.
 * Import: <MDXProvider components={essayMDXComponents}>
 */
export const essayMDXComponents: MDXComponents = {
  h1: ({ children, ...props }: ComponentPropsWithoutRef<"h1">) => (
    <h1 className="module-essay-h1" {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }: ComponentPropsWithoutRef<"h2">) => (
    <h2 className="module-essay-h2" {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }: ComponentPropsWithoutRef<"h3">) => (
    <h3 className="module-essay-h3" {...props}>
      {children}
    </h3>
  ),
  p: (props: ComponentPropsWithoutRef<"p">) => (
    <p className="module-essay-p" {...props} />
  ),
  blockquote: (props: ComponentPropsWithoutRef<"blockquote">) => (
    <blockquote className="module-essay-quote" {...props} />
  ),
  hr: () => <Fleuron />,
  // Available in all essays
  Citation,
  Fleuron,
  Marginalia,
  PullQuote,
  Footnote,
  SmallCaps,
  // Interactive pedagogical components
  KeyIdeaCard,
  ExplorePrompt,
  // Module-specific inline mini-interactives
  RoundaboutnessDiagram,
};

/**
 * Re-export per @next/mdx convention so pages/components can pick up components
 * implicitly when rendering raw *.mdx files inside the module tree.
 */
export function useMDXComponents(inherited: MDXComponents): MDXComponents {
  return {
    ...inherited,
    ...essayMDXComponents,
  };
}
