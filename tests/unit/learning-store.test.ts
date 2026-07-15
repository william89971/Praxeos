import { evaluateSelfReview } from "@/labs/feedback";
import { decodeShareEnvelope, encodeShareEnvelope } from "@/labs/share";
import {
  emptyLabSession,
  emptyLearningStore,
  labSessionToMarkdown,
  migrateLearningStore,
  upsertLabSession,
} from "@/lib/learning-store";
import { describe, expect, it } from "vitest";

describe("versioned local learning store", () => {
  it("migrates Calculation Labyrinth writing into a read-only earlier record", () => {
    const migrated = migrateLearningStore(
      {
        version: 2,
        completedLessons: ["action"],
        journey: {
          initial: { actor: "The student team", interpretation: "Prices helped." },
          revision: "The comparison changed my reasoning.",
          finalReflection: "A preserved reflection",
          citations: ["mises-calculation-1920"],
          updatedAt: "2026-07-13T00:00:00.000Z",
        },
      },
      "2026-07-14T00:00:00.000Z",
    );
    expect(migrated.version).toBe(3);
    expect(migrated.completedLessons).toContain("action");
    expect(migrated.earlierRecords[0]).toMatchObject({
      sourceLabel: "Calculation Labyrinth",
      readOnly: true,
      reflection: "A preserved reflection",
    });
  });

  it("stores multiple sessions and exports a readable, non-scored record", () => {
    const session = emptyLabSession("choice-machine", "2026-07-14T00:00:00.000Z");
    session.initialReasoning = "I chose focused study with limited energy.";
    const store = upsertLabSession(emptyLearningStore(), session);
    expect(store.labSessions["choice-machine"]).toHaveLength(1);
    expect(labSessionToMarkdown(session)).toContain("The Choice Machine");
    expect(labSessionToMarkdown(session)).toContain("does not assign a semantic score");
  });
});

describe("private share envelope", () => {
  it("round-trips bounded simulation IDs without learner prose", () => {
    const encoded = encodeShareEnvelope({
      version: 1,
      labSlug: "market-without-a-manager",
      seed: "market-42",
      mode: "explore",
      assumptionIds: ["five-participants"],
      actionIds: ["offer-apple-for-bread"],
    });
    expect(encoded).not.toContain("learner");
    expect(decodeShareEnvelope(encoded, "market-without-a-manager")).toMatchObject({
      ok: true,
      envelope: { seed: "market-42", mode: "explore" },
    });
    expect(decodeShareEnvelope(encoded, "choice-machine")).toEqual({
      ok: false,
      reason: "cross-lab",
    });
    expect(decodeShareEnvelope("not-valid")).toEqual({
      ok: false,
      reason: "malformed",
    });
  });

  it("rejects oversized, unknown-version, and cross-Lab state", () => {
    expect(decodeShareEnvelope("x".repeat(1_801))).toEqual({
      ok: false,
      reason: "oversized",
    });
    const unknownVersion = Buffer.from(
      JSON.stringify({
        version: 99,
        labSlug: "choice-machine",
        seed: "choice-1",
        mode: "guided",
        assumptionIds: [],
        actionIds: [],
      }),
    ).toString("base64url");
    expect(decodeShareEnvelope(unknownVersion)).toEqual({
      ok: false,
      reason: "unknown-version",
    });
    const market = encodeShareEnvelope({
      version: 1,
      labSlug: "market-without-a-manager",
      seed: "market-1",
      mode: "guided",
      assumptionIds: [],
      actionIds: [],
    });
    expect(decodeShareEnvelope(market, "money-time-machine")).toEqual({
      ok: false,
      reason: "cross-lab",
    });
  });

  it("normalizes unsafe and repeated identifiers without adding prose fields", () => {
    const encoded = encodeShareEnvelope({
      version: 1,
      labSlug: "entrepreneurs-discovery",
      seed: "Discovery Notes!",
      mode: "explore",
      assumptionIds: ["fixed-costs", "fixed-costs"],
      actionIds: ["test users", "test-users"],
    });
    expect(decodeShareEnvelope(encoded)).toMatchObject({
      ok: true,
      envelope: {
        seed: "discoverynotes",
        assumptionIds: ["fixed-costs"],
        actionIds: ["testusers", "test-users"],
      },
    });
    expect(Buffer.from(encoded, "base64url").toString("utf8")).not.toMatch(
      /reasoning|reflection|guide/i,
    );
  });
});

describe("deterministic feedback boundary", () => {
  it("uses only explicit completion, evidence, assumptions, and revision state", () => {
    const feedback = evaluateSelfReview({
      guidedComplete: true,
      initialReasoning: "price signal spontaneous order correct mastery", // semantic bait
      selectedEvidenceIds: [],
      acknowledgedAssumptionIds: [],
      revision: "",
      selfReviewChecks: [],
    });
    expect(feedback.map((item) => item.status)).toEqual([
      "add simulation evidence",
      "acknowledge an assumption",
      "revise or confirm",
    ]);
    expect(JSON.stringify(feedback)).not.toMatch(/correct|mastery|score/i);
  });
});
