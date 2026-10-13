"use client";

import { usePraxeosStore } from "@/hooks/usePraxeosStore";
import type { LabSlug } from "@/labs/types";
import { labState, lessonState, recommendNext } from "@/lib/journey";
import type { ActivityRef } from "@/lib/journey";
import { activeLabSession } from "@/lib/learning-store";
import Link from "next/link";

export function StartHere() {
  const { store, hydrated } = usePraxeosStore();
  const next = recommendNext((activity: ActivityRef) => {
    if (activity.kind === "lesson") {
      return lessonState(
        store.completedLessons.includes(activity.slug),
        Boolean(store.lessonRecords[activity.slug]),
      );
    }
    if (activity.kind === "lab") {
      return labState(activeLabSession(store, activity.slug as LabSlug));
    }
    return "not-started";
  });
  const label =
    !hydrated || (next.slug === "what-is-praxeology" && next.state === "not-started")
      ? "Start with the first lesson"
      : next.label;
  const href =
    !hydrated || (next.slug === "what-is-praxeology" && next.state === "not-started")
      ? "/learn/what-is-praxeology"
      : next.href;
  return (
    <Link className="button-primary" href={href}>
      {label}
    </Link>
  );
}
