import {
  ARC_ACT_DURATION_MS,
  ARC_TOTAL_MS,
  COMPLEXITY_BY_PHASE,
  IDLE_STATE,
  actProgress,
  beginArc,
  cancelArc,
  tickArc,
  totalProgress,
} from "@/modules/calculation-problem/lib/planner-arc";
import { describe, expect, it } from "vitest";

describe("be-the-planner three-act arc", () => {
  it("idle → act1 on begin", () => {
    const s = beginArc(1000);
    expect(s.phase).toBe("act1");
    expect(s.startedAt).toBe(1000);
    expect(s.elapsedMs).toBe(0);
  });

  it("tick advances phase on each act boundary", () => {
    let s = beginArc(0);
    s = tickArc(s, ARC_ACT_DURATION_MS * 0.5);
    expect(s.phase).toBe("act1");
    s = tickArc(s, ARC_ACT_DURATION_MS * 1.5);
    expect(s.phase).toBe("act2");
    s = tickArc(s, ARC_ACT_DURATION_MS * 2.5);
    expect(s.phase).toBe("act3");
    s = tickArc(s, ARC_TOTAL_MS + 10);
    expect(s.phase).toBe("complete");
  });

  it("complexity ramps per phase", () => {
    expect(COMPLEXITY_BY_PHASE.act1).toBeLessThan(COMPLEXITY_BY_PHASE.act2);
    expect(COMPLEXITY_BY_PHASE.act2).toBeLessThan(COMPLEXITY_BY_PHASE.act3);
    expect(COMPLEXITY_BY_PHASE.act3).toBeGreaterThan(100);
  });

  it("cancel returns to idle", () => {
    let s = beginArc(0);
    s = tickArc(s, 5_000);
    const c = cancelArc();
    expect(c).toEqual(IDLE_STATE);
  });

  it("progress values are bounded to [0, 1]", () => {
    let s = beginArc(0);
    expect(totalProgress(s)).toBe(0);
    s = tickArc(s, ARC_TOTAL_MS + 100);
    expect(totalProgress(s)).toBe(1);
    expect(actProgress(s)).toBe(1);
    expect(actProgress(IDLE_STATE)).toBe(0);
  });
});
