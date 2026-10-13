import { LAB_REGISTRY } from "@/labs/registry";
import type { LabSlug } from "@/labs/types";
import { PRAXEOLOGY_101 } from "@/lib/praxeology";

export type ProgressState = "not-started" | "in-progress" | "completed";

export interface ActivityRef {
  kind: "lesson" | "lab" | "notebook";
  slug: string;
  title: string;
  href: string;
}

export interface Recommendation extends ActivityRef {
  state: ProgressState;
  label: string;
}

export function lessonState(completed: boolean, hasRecord: boolean): ProgressState {
  if (completed) return "completed";
  if (hasRecord) return "in-progress";
  return "not-started";
}

export function labState(
  session: { completedAt: string | null } | null | undefined,
): ProgressState {
  if (!session) return "not-started";
  if (session.completedAt) return "completed";
  return "in-progress";
}

export function learningPath(): ActivityRef[] {
  const seenLabs = new Set<string>();
  const path: ActivityRef[] = [];
  for (const lesson of PRAXEOLOGY_101) {
    path.push({
      kind: "lesson",
      slug: lesson.slug,
      title: lesson.shortTitle,
      href: `/learn/${lesson.slug}`,
    });
    for (const lab of LAB_REGISTRY) {
      if (!lab.lessonSlugs.includes(lesson.slug) || seenLabs.has(lab.slug)) continue;
      seenLabs.add(lab.slug);
      path.push({
        kind: "lab",
        slug: lab.slug,
        title: lab.shortTitle,
        href: `/labs/${lab.slug}`,
      });
    }
  }
  for (const lab of LAB_REGISTRY) {
    if (seenLabs.has(lab.slug)) continue;
    path.push({
      kind: "lab",
      slug: lab.slug,
      title: lab.shortTitle,
      href: `/labs/${lab.slug}`,
    });
  }
  path.push({
    kind: "notebook",
    slug: "notebook",
    title: "Notebook",
    href: "/notebook",
  });
  return path;
}

export function recommendNext(
  stateOf: (activity: ActivityRef) => ProgressState,
  from?: { kind: "lesson" | "lab"; slug: string },
): Recommendation {
  const path = learningPath();
  const work = path.filter((activity) => activity.kind !== "notebook");
  const notebook = path[path.length - 1];
  if (!notebook) {
    throw new Error("Learning path is missing the notebook.");
  }

  if (!from) {
    return (
      recommendMatching(work, stateOf, "in-progress") ??
      recommendMatching(work, stateOf, "not-started") ??
      asRecommendation(notebook, "not-started")
    );
  }

  const index = work.findIndex(
    (activity) => activity.kind === from.kind && activity.slug === from.slug,
  );
  const after = index >= 0 ? work.slice(index + 1) : work;
  const before = index > 0 ? work.slice(0, index) : [];
  return (
    recommendMatching(after, stateOf, "in-progress") ??
    recommendMatching(before, stateOf, "in-progress") ??
    recommendMatching(after, stateOf, "not-started") ??
    recommendMatching(before, stateOf, "not-started") ??
    asRecommendation(notebook, "not-started")
  );
}

export function activityForLab(slug: LabSlug): ActivityRef {
  const lab = LAB_REGISTRY.find((entry) => entry.slug === slug);
  return {
    kind: "lab",
    slug,
    title: lab?.shortTitle ?? slug,
    href: `/labs/${slug}`,
  };
}

function recommendMatching(
  activities: readonly ActivityRef[],
  stateOf: (activity: ActivityRef) => ProgressState,
  expected: ProgressState,
): Recommendation | null {
  const match = activities.find((activity) => stateOf(activity) === expected);
  return match ? asRecommendation(match, expected) : null;
}

function asRecommendation(activity: ActivityRef, state: ProgressState): Recommendation {
  return { ...activity, state, label: labelFor(activity, state) };
}

function labelFor(activity: ActivityRef, state: ProgressState): string {
  if (activity.kind === "notebook") return "Open your notebook";
  if (
    activity.kind === "lesson" &&
    activity.slug === "what-is-praxeology" &&
    state === "not-started"
  ) {
    return "Begin lesson 1";
  }
  if (state === "in-progress") return `Resume ${activity.title}`;
  if (state === "completed") return `Revisit ${activity.title}`;
  return `Start ${activity.title}`;
}
