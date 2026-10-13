import { labState, lessonState, recommendNext } from "@/lib/journey";
import type { ActivityRef, ProgressState } from "@/lib/journey";
import { describe, expect, it } from "vitest";

function states(
  progress: Partial<Record<string, ProgressState>>,
): (activity: ActivityRef) => ProgressState {
  return (activity) => progress[`${activity.kind}:${activity.slug}`] ?? "not-started";
}

describe("learning journey", () => {
  it("starts a new learner at lesson 1", () => {
    const next = recommendNext(states({}));
    expect(next).toMatchObject({
      kind: "lesson",
      slug: "what-is-praxeology",
      state: "not-started",
      label: "Begin lesson 1",
    });
  });

  it("resumes an unfinished lesson instead of starting a later one", () => {
    const next = recommendNext(
      states({
        "lesson:what-is-praxeology": "completed",
        "lab:choice-machine": "completed",
        "lesson:man-acts": "in-progress",
      }),
    );
    expect(next).toMatchObject({
      kind: "lesson",
      slug: "man-acts",
      state: "in-progress",
      label: "Resume Action",
    });
  });

  it("resumes an unfinished lab instead of treating a saved session as done", () => {
    const next = recommendNext(
      states({
        "lesson:what-is-praxeology": "completed",
        "lab:choice-machine": "in-progress",
      }),
    );
    expect(next.slug).toBe("choice-machine");
    expect(next.state).toBe("in-progress");
    expect(next.label).toBe("Resume Choice Machine");
  });

  it("does not skip an earlier unfinished lab when a later lesson is open", () => {
    const next = recommendNext(
      states({
        "lesson:what-is-praxeology": "completed",
        "lab:choice-machine": "in-progress",
        "lesson:man-acts": "completed",
      }),
      { kind: "lesson", slug: "ends-and-means" },
    );
    expect(next.slug).toBe("choice-machine");
    expect(next.state).toBe("in-progress");
  });

  it("starts the Choice Machine after lesson 1 when that lab has not been opened", () => {
    const next = recommendNext(states({ "lesson:what-is-praxeology": "completed" }), {
      kind: "lesson",
      slug: "what-is-praxeology",
    });
    expect(next).toMatchObject({
      kind: "lab",
      slug: "choice-machine",
      state: "not-started",
      label: "Start Choice Machine",
    });
  });

  it("opens the notebook only after the path is complete", () => {
    const next = recommendNext(() => "completed");
    expect(next.kind).toBe("notebook");
  });

  it("treats a saved lab without completion as in progress", () => {
    expect(labState(null)).toBe("not-started");
    expect(labState({ completedAt: null })).toBe("in-progress");
    expect(labState({ completedAt: "2026-01-01T00:00:00.000Z" })).toBe("completed");
    expect(lessonState(false, false)).toBe("not-started");
    expect(lessonState(false, true)).toBe("in-progress");
    expect(lessonState(true, true)).toBe("completed");
  });
});
