import {
  CHOICE_EXPLORE_ACTIONS,
  CHOICE_GUIDED_ACTIONS,
  CHOICE_PREDICTION_IDS,
  DEFAULT_CHOICE_ASSUMPTIONS,
  choiceActionById,
  choiceEngine,
  choiceStageControl,
} from "@/labs/choice-machine/engine";
import { encodeShareEnvelope } from "@/labs/share";
import { describe, expect, it } from "vitest";

describe("Choice Machine engine", () => {
  it("replays the guided record deterministically", () => {
    const run = () =>
      CHOICE_GUIDED_ACTIONS.reduce(
        (state, action) => choiceEngine.reduce(state, action),
        choiceEngine.create("choice-test", DEFAULT_CHOICE_ASSUMPTIONS),
      );
    expect(run()).toEqual(run());
    expect(run().completed).toBe(true);
    expect(run().guidedStep).toBe(CHOICE_GUIDED_ACTIONS.length);
  });

  it("preserves forgone paths and allows a revised choice", () => {
    const state = CHOICE_GUIDED_ACTIONS.slice(0, 5).reduce(
      (current, action) => choiceEngine.reduce(current, action),
      choiceEngine.create("choice-test", DEFAULT_CHOICE_ASSUMPTIONS),
    );
    expect(state.selectedActivity).toBe("study");
    expect(state.previousSelections).toContain("community-event");
    expect(state.visibleAlternatives).toContain("study");
    expect(state.constraints.time).toBe(2);
  });

  it("changes Explore outcomes without changing Guided progress", () => {
    const base = choiceEngine.create("choice-test", DEFAULT_CHOICE_ASSUMPTIONS);
    const explored = CHOICE_EXPLORE_ACTIONS.reduce(
      (state, action) => choiceEngine.reduce(state, action),
      base,
    );
    expect(explored.guidedStep).toBe(0);
    expect(explored.constraintChanges).toBe(2);
    expect(explored.selectedActivity).toBe("rest");
    expect(choiceEngine.validate(explored)).toEqual([]);
  });

  it("does not infer a permanent ranking from one selection", () => {
    const initialChoice = CHOICE_GUIDED_ACTIONS[1];
    const removeMoney = CHOICE_EXPLORE_ACTIONS[1];
    const chooseRest = CHOICE_EXPLORE_ACTIONS[3];
    if (!initialChoice || !removeMoney || !chooseRest)
      throw new Error("Missing action");
    const first = choiceEngine.reduce(
      choiceEngine.create("choice-test", DEFAULT_CHOICE_ASSUMPTIONS),
      initialChoice,
    );
    const changed = choiceEngine.reduce(first, removeMoney);
    const revised = choiceEngine.reduce(changed, chooseRest);
    expect(first.selectedActivity).toBe("community-event");
    expect(revised.selectedActivity).toBe("rest");
  });

  it("records a predefined prediction before it changes the selected path", () => {
    const inspect = CHOICE_GUIDED_ACTIONS[0];
    if (!inspect) throw new Error("Missing inspect action");
    const inspected = choiceEngine.reduce(
      choiceEngine.create("choice-test", DEFAULT_CHOICE_ASSUMPTIONS),
      inspect,
    );
    const stage = choiceStageControl(inspected);
    expect(stage?.kind).toBe("prediction");
    const prediction = stage?.options[2]?.action;
    if (!prediction) throw new Error("Missing study prediction");
    expect(CHOICE_PREDICTION_IDS).toContain(prediction.id);
    const predicted = choiceEngine.reduce(inspected, prediction);
    expect(predicted.guidedStep).toBe(1);
    expect(predicted.selectedActivity).toBeNull();
    expect(predicted.observations.at(-1)?.title).toBe("Prediction recorded");
    const choosing = choiceStageControl(predicted);
    expect(choosing?.kind).toBe("choice");
    const study = choosing?.options.find(
      (option) => option.action.activity === "study",
    );
    if (!study) throw new Error("Missing study choice");
    const chosen = choiceEngine.reduce(predicted, study.action);
    expect(chosen.selectedActivity).toBe("study");
    expect(chosen.guidedStep).toBe(2);
    expect(chosen.previousSelections).not.toContain("community-event");
  });

  it("replays older Choice Machine links that prescribe the community event and study", () => {
    const legacyIds = [
      "inspect-constraints",
      "choose-community-event",
      "reveal-forgone-paths",
      "lose-two-hours",
      "revise-to-study",
      "complete-choice",
    ];
    const actions = legacyIds.map((id) => {
      const action = choiceActionById(id);
      if (!action) throw new Error(id);
      return action;
    });
    const restored = actions.reduce(
      (state, action) => choiceEngine.reduce(state, action),
      choiceEngine.create("choice-2026", DEFAULT_CHOICE_ASSUMPTIONS),
    );
    expect(restored.previousSelections).toContain("community-event");
    expect(restored.selectedActivity).toBe("study");
    expect(restored.completed).toBe(true);
    const encoded = encodeShareEnvelope({
      version: 1,
      labSlug: "choice-machine",
      seed: "choice-2026",
      mode: "guided",
      assumptionIds: [],
      actionIds: legacyIds,
    });
    const decoded = Buffer.from(
      encoded.replaceAll("-", "+").replaceAll("_", "/"),
      "base64",
    ).toString("utf8");
    expect(decoded).toContain("choose-community-event");
    expect(decoded).toContain("revise-to-study");
    expect(decoded).not.toMatch(/because I feel/);
  });
});
