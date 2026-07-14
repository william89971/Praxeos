import { evaluateReasoning, evaluateReasoningSet } from "@/lib/reasoning-rubric";
import { describe, expect, it } from "vitest";

describe("deterministic reasoning rubric", () => {
  it("rejects empty and placeholder text without scoring", () => {
    expect(evaluateReasoning("actor", "test").status).toBe("needs evidence");
    expect(
      evaluateReasoning("actor", "The budget is the actor because it is limited.")
        .status,
    ).toBe("concept mismatch");
  });

  it("requires scenario evidence and accepts multiple grounded phrasings", () => {
    expect(
      evaluateReasoning(
        "actor",
        "The student team decides how to plan the school event.",
      ).status,
    ).toBe("ready to revise");
    expect(
      evaluateReasoning(
        "opportunityCost",
        "They give up a full music plan instead of cutting food.",
      ).status,
    ).toBe("ready to revise");
    expect(evaluateReasoning("interpretation", "Prices are signals.").status).toBe(
      "needs evidence",
    );
    expect(
      evaluateReasoning(
        "interpretation",
        "Price markers helped compare each path and made resource waste less uncertain.",
      ).status,
    ).toBe("ready to revise");
  });

  it("returns field-specific statuses and never a numeric score", () => {
    const results = evaluateReasoningSet({
      actor: "The student team chooses how to plan the event.",
    });
    expect(results).toHaveLength(6);
    expect(JSON.stringify(results)).not.toMatch(/score/i);
  });
});
