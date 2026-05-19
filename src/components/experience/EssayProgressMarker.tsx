"use client";

import { useProgressStore } from "@/hooks/useProgressStore";
import { trackInteraction } from "@/lib/telemetry";
import { useEffect, useRef } from "react";

export function EssayProgressMarker({ slug }: { readonly slug: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const trackedRef = useRef(false);
  const { markEssay } = useProgressStore();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        markEssay(slug);
        if (trackedRef.current) return;
        trackedRef.current = true;
        trackInteraction("essay_reached", { moduleSlug: slug });
      },
      { threshold: 0.2 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [slug, markEssay]);

  return <div ref={ref} aria-hidden="true" style={{ height: 1 }} />;
}
