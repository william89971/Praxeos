import {
  emptyLearningStore,
  journeyToMarkdown,
  migrateLearningStore,
  parseShareState,
  serializeShareState,
} from "@/lib/learning-store";
import { describe, expect, it } from "vitest";

describe("versioned local learning store", () => {
  it("migrates unknown and legacy state without losing a reflection", () => {
    expect(migrateLearningStore(null).version).toBe(emptyLearningStore().version);
    const migrated = migrateLearningStore({
      version: 1,
      completedLessons: ["action"],
      journal: { reflection: "A preserved reflection" },
      modules: { lab: { visited: true } },
    });
    expect(migrated.version).toBe(2);
    expect(migrated.completedLessons).toContain("action");
    expect(migrated.journey.finalReflection).toBe("A preserved reflection");
    expect(migrated.labProgress.lab?.visited).toBe(true);
  });

  it("round-trips only normalized non-sensitive lab state", () => {
    const encoded = serializeShareState({
      priced: false,
      path: ["hall", "<private text>", "local-food"],
      waste: 122,
      uncertainty: -5,
    });
    expect(encoded).not.toContain("private");
    expect(parseShareState(encoded)).toEqual({
      priced: false,
      path: ["hall", "privatetext", "local-food"],
      waste: 99,
      uncertainty: 0,
    });
    expect(parseShareState("not-valid")).toBeNull();
  });

  it("exports a readable learning record", () => {
    const store = emptyLearningStore();
    store.journey.initial.actor = "The student team";
    store.journey.revision = "Price markers made alternatives comparable.";
    expect(journeyToMarkdown(store.journey)).toContain("# Praxeos learning record");
    expect(journeyToMarkdown(store.journey)).toContain("The student team");
  });
});
