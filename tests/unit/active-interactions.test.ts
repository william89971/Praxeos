import {
  buildMaze,
  costForMove,
  directionToNextPathCell,
  legalMoves,
  moveCell,
} from "@/modules/calculation-labyrinth/lib/labyrinthLayout";
import {
  metricsForState as coordinationMetricsForState,
  paramsForState as coordinationParamsForState,
} from "@/modules/coordination-engine/lib/distortion";
import {
  metricsFor,
  paramsForState as monetaryParamsForState,
} from "@/modules/monetary-garden/lib/distortion";
import { buildAdjacency, pulsesAt } from "@/modules/signal-orchard/lib/signals";
import { describe, expect, it } from "vitest";

describe("active interactions — Monetary Garden", () => {
  it("separates credit boom from correction losses", () => {
    const funded = metricsFor({ credit: 0.25, savings: 0.85, phase: "boom" });
    const unfundedBoom = metricsFor({ credit: 0.9, savings: 0.2, phase: "boom" });
    const correction = metricsFor({ credit: 0.9, savings: 0.2, phase: "correction" });

    expect(unfundedBoom.savings).toBeLessThan(funded.savings);
    expect(correction.malinvestment).toBeGreaterThan(unfundedBoom.malinvestment);
    expect(correction.output).toBeLessThan(unfundedBoom.output);
  });

  it("keeps derived params bounded for extreme query input", () => {
    const params = monetaryParamsForState({
      credit: 2,
      savings: -1,
      phase: "correction",
    });

    expect(params.waterLevel).toBeGreaterThanOrEqual(0);
    expect(params.waterLevel).toBeLessThanOrEqual(1);
    expect(params.signalCorruption).toBeGreaterThanOrEqual(0);
    expect(params.signalCorruption).toBeLessThanOrEqual(1);
  });
});

describe("active interactions — Signal Orchard", () => {
  it("propagates a distinct action kind from origin to neighbors", () => {
    const adjacency = buildAdjacency([
      { from: 0, to: 1, distance: 1 },
      { from: 1, to: 2, distance: 1 },
    ]);

    const origin = pulsesAt(
      0.2,
      [{ originId: 0, startedAt: 0, kind: "discover" }],
      adjacency,
      [0, 1, 2],
    );
    expect(origin.get(0)?.origin).toBe(true);
    expect(origin.get(0)?.kind).toBe("discover");
    expect(origin.get(1)?.intensity).toBe(0);

    const neighbor = pulsesAt(
      0.42,
      [{ originId: 0, startedAt: 0, kind: "discover" }],
      adjacency,
      [0, 1, 2],
    );
    expect(neighbor.get(1)?.kind).toBe("discover");
    expect(neighbor.get(1)?.intensity).toBeGreaterThan(0);
  });
});

describe("active interactions — Calculation Labyrinth", () => {
  it("returns legal moves and costs for deterministic challenges", () => {
    const maze = buildMaze(0xc4_0a_71_3f + 3 * 7919);
    const current = { x: 0, y: 0 };
    const legal = legalMoves(maze, current);

    expect(legal.length).toBeGreaterThan(0);
    const best = directionToNextPathCell(maze, current);
    expect(best).not.toBeNull();
    expect(legal).toContain(best);

    const next = moveCell(current, best ?? "N");
    expect(next).toEqual(maze.pathCells[1]);
    expect(costForMove(maze, current, best ?? "N")).toBeGreaterThanOrEqual(0.05);
  });
});

describe("active interactions — Coordination Engine", () => {
  it("maps reliability and latency to coherence, throughput, and missed plans", () => {
    const coherent = coordinationMetricsForState({
      reliability: 0.95,
      latency: 0.05,
      shock: 0,
    });
    const degraded = coordinationMetricsForState({
      reliability: 0.25,
      latency: 0.85,
      shock: 0.8,
    });

    expect(degraded.coherence).toBeLessThan(coherent.coherence);
    expect(degraded.throughput).toBeLessThan(coherent.throughput);
    expect(degraded.failedLinks).toBeGreaterThan(coherent.failedLinks);
    expect(degraded.missedPlans).toBeGreaterThan(coherent.missedPlans);
  });

  it("keeps params bounded under extreme query input", () => {
    const params = coordinationParamsForState({
      reliability: 2,
      latency: -1,
      shock: 3,
    });

    expect(params.coherence).toBeGreaterThanOrEqual(0);
    expect(params.coherence).toBeLessThanOrEqual(1);
    expect(params.breakage).toBeGreaterThanOrEqual(0);
    expect(params.breakage).toBeLessThanOrEqual(1);
  });
});
