/**
 * Signal Orchard — signal propagation.
 *
 * When an actor "acts" at time t, the action emits a pulse that arrives
 * at neighbours after a delay proportional to their graph distance.
 * Each visited node may then re-emit with an attenuation factor. This
 * is a pure simulation; rendering reads the active set per frame.
 */

import type { Link } from "./orchardLayout";

export const ACTION_TTL_S = 2.4;
export const ACTION_HOPS = 3;
export const ACTION_DELAY_PER_HOP_S = 0.32;
export const ATTENUATION = 0.66;

export interface ActiveAction {
  readonly originId: number;
  readonly startedAt: number;
}

export interface ActorPulse {
  /** 0..1 — how brightly this actor is currently emitting. */
  readonly intensity: number;
  /** True if this actor was the origin of the active action. */
  readonly origin: boolean;
}

export function pulsesAt(
  now: number,
  actions: readonly ActiveAction[],
  adjacency: ReadonlyMap<number, readonly number[]>,
  nodeIds: readonly number[],
): ReadonlyMap<number, ActorPulse> {
  const result = new Map<number, ActorPulse>();
  for (const id of nodeIds) result.set(id, { intensity: 0, origin: false });

  for (const action of actions) {
    const elapsed = now - action.startedAt;
    if (elapsed < 0 || elapsed > ACTION_TTL_S) continue;

    // BFS from origin, up to ACTION_HOPS hops.
    const visited = new Map<number, number>(); // id → hop count
    visited.set(action.originId, 0);
    let frontier: readonly number[] = [action.originId];
    for (let hop = 1; hop <= ACTION_HOPS; hop++) {
      const next: number[] = [];
      for (const id of frontier) {
        const nbrs = adjacency.get(id) ?? [];
        for (const n of nbrs) {
          if (!visited.has(n)) {
            visited.set(n, hop);
            next.push(n);
          }
        }
      }
      frontier = next;
    }

    for (const [id, hop] of visited) {
      const arrivesAt = hop * ACTION_DELAY_PER_HOP_S;
      const localElapsed = elapsed - arrivesAt;
      if (localElapsed < 0) continue;
      const window = 0.55;
      if (localElapsed > window) continue;
      const envelope = Math.sin((localElapsed / window) * Math.PI);
      const intensity = envelope * ATTENUATION ** hop;
      const prev = result.get(id);
      if (!prev) continue;
      result.set(id, {
        intensity: Math.max(prev.intensity, intensity),
        origin: prev.origin || hop === 0,
      });
    }
  }

  return result;
}

export function buildAdjacency(
  links: readonly Link[],
): ReadonlyMap<number, readonly number[]> {
  const map = new Map<number, number[]>();
  for (const link of links) {
    const a = map.get(link.from) ?? [];
    const b = map.get(link.to) ?? [];
    a.push(link.to);
    b.push(link.from);
    map.set(link.from, a);
    map.set(link.to, b);
  }
  return map;
}
