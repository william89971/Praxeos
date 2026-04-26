/**
 * Coordination Engine — agent network layout.
 *
 * Concentric rings of agents in 3D, lifted off a central plane so the
 * network feels like a slow-spinning orrery. Edges connect each agent
 * to a few nearest neighbours plus a long-range link for visual depth.
 */

import { mulberry32 } from "@/sketches/lib/rng";

export const RING_RADII = [3.2, 6, 9] as const;
export const RING_COUNTS = [10, 14, 18] as const;
export const RING_HEIGHTS = [0.4, 0.0, -0.4] as const;
export const NODE_COUNT = RING_COUNTS.reduce((a, b) => a + b, 0);

export interface AgentNode {
  readonly id: number;
  readonly x: number;
  readonly y: number;
  readonly z: number;
  readonly ring: number;
  readonly seed: number;
  /** Phase offset for emissive pulse, 0..1. */
  readonly phase: number;
}

export interface Edge {
  readonly from: number;
  readonly to: number;
  /** Per-edge phase modulation, 0..1. */
  readonly seed: number;
}

export function agentNodes(): readonly AgentNode[] {
  const rng = mulberry32(0x18_2c_e1_77);
  const out: AgentNode[] = [];
  let id = 0;
  for (let r = 0; r < RING_RADII.length; r++) {
    const radius = RING_RADII[r];
    const count = RING_COUNTS[r];
    const height = RING_HEIGHTS[r];
    if (radius === undefined || count === undefined || height === undefined) continue;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + r * 0.13 + rng() * 0.06;
      out.push({
        id: id++,
        x: Math.cos(angle) * radius,
        y: height,
        z: Math.sin(angle) * radius,
        ring: r,
        seed: rng(),
        phase: rng(),
      });
    }
  }
  return out;
}

export function edges(nodes: readonly AgentNode[]): readonly Edge[] {
  const out: Edge[] = [];
  const seen = new Set<string>();
  const rng = mulberry32(0x6f_c1_e3_53);

  // Each agent → two nearest neighbours.
  for (const a of nodes) {
    const neighbours = nodes
      .filter((n) => n.id !== a.id)
      .map((n) => ({ id: n.id, d: dist(a, n) }))
      .sort((p, q) => p.d - q.d)
      .slice(0, 2);
    for (const { id } of neighbours) {
      const key = a.id < id ? `${a.id}:${id}` : `${id}:${a.id}`;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push({ from: a.id, to: id, seed: rng() });
    }
  }
  // Long-range cross-links — every 4th outer agent links to a random inner agent.
  const inner = nodes.filter((n) => n.ring === 0);
  const outer = nodes.filter((n) => n.ring === 2);
  for (let i = 0; i < outer.length; i += 4) {
    const a = outer[i];
    const b = inner[Math.floor(rng() * inner.length)];
    if (!a || !b) continue;
    const key = a.id < b.id ? `${a.id}:${b.id}` : `${b.id}:${a.id}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ from: a.id, to: b.id, seed: rng() });
  }
  return out;
}

function dist(a: AgentNode, b: AgentNode): number {
  return Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
}
