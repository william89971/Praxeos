/**
 * Signal Orchard — deterministic layout.
 *
 * Cypresses are arranged in three concentric rings on a circular plot;
 * a sparse network of nearest-neighbour links carries action signals
 * between them. Pure: no DOM, no random, no globals.
 */

import { mulberry32 } from "@/sketches/lib/rng";

export const PLOT_RADIUS = 10;
export const TREE_COUNT = 28;

export interface ActorNode {
  readonly id: number;
  readonly x: number;
  readonly z: number;
  readonly height: number;
  /** A small per-tree phase offset for ambient sway. */
  readonly seed: number;
}

export interface Link {
  readonly from: number;
  readonly to: number;
  readonly distance: number;
}

export function actorNodes(): readonly ActorNode[] {
  const rng = mulberry32(0x37_8a_91_27);
  const out: ActorNode[] = [];
  // Three rings.
  const rings: ReadonlyArray<{ radius: number; count: number }> = [
    { radius: 2.6, count: 6 },
    { radius: 5.4, count: 10 },
    { radius: 8.4, count: 12 },
  ];
  let id = 0;
  for (const ring of rings) {
    for (let i = 0; i < ring.count; i++) {
      const angle = (i / ring.count) * Math.PI * 2 + rng() * 0.18;
      const jitter = (rng() - 0.5) * 0.6;
      out.push({
        id: id++,
        x: Math.cos(angle) * (ring.radius + jitter),
        z: Math.sin(angle) * (ring.radius + jitter),
        height: 1.4 + rng() * 0.9,
        seed: rng(),
      });
    }
  }
  return out;
}

export function neighbourLinks(nodes: readonly ActorNode[], k = 3): readonly Link[] {
  const links: Link[] = [];
  const seen = new Set<string>();
  for (const a of nodes) {
    const dists = nodes
      .filter((n) => n.id !== a.id)
      .map((n) => ({ id: n.id, d: Math.hypot(n.x - a.x, n.z - a.z) }))
      .sort((p, q) => p.d - q.d)
      .slice(0, k);
    for (const { id, d } of dists) {
      const key = a.id < id ? `${a.id}:${id}` : `${id}:${a.id}`;
      if (seen.has(key)) continue;
      seen.add(key);
      links.push({ from: a.id, to: id, distance: d });
    }
  }
  return links;
}
