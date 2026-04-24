"use client";

import { type RefObject, useEffect, useState } from "react";

type Options = {
  /** Fraction of element visible before firing. Default 0.1. */
  threshold?: number;
  /** Root margin — expand observation area. Default "0px". */
  rootMargin?: string;
};

/**
 * Subscribes to the intersection of a ref with the viewport.
 * Returns `true` when visible. Used to pause sketches off-screen.
 */
export function useIsOnScreen<T extends Element>(
  ref: RefObject<T | null>,
  { threshold = 0.1, rootMargin = "0px" }: Options = {},
): boolean {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          setVisible(entry.isIntersecting);
        }
      },
      { threshold, rootMargin },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
    };
  }, [ref, threshold, rootMargin]);

  return visible;
}
