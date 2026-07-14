import {
  CHOICE_EXPLORE_ACTIONS,
  CHOICE_GUIDED_ACTIONS,
  DEFAULT_CHOICE_ASSUMPTIONS,
  choiceEngine,
} from "@/labs/choice-machine/engine";
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
});
