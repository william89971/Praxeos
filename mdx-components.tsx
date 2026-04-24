import { useMDXComponents as useEssayComponents } from "@/components/mdx/MDXComponents";
import type { MDXComponents } from "mdx/types";

/**
 * Required by @next/mdx for .mdx page extension routing.
 * Delegates to the canonical Praxeos essay component set.
 */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return useEssayComponents(components);
}
