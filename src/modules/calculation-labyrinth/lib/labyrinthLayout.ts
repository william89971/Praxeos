/**
 * Calculation Labyrinth — maze layout.
 *
 * A square grid maze carved with a deterministic randomized DFS. Cells
 * have walls on N/E/S/W. The "planner" enters at the lower-left, the
 * "production goal" is at the upper-right; price markers float above
 * each junction with a value derived from the canonical shortest path.
 */

import { mulberry32 } from "@/sketches/lib/rng";

export const GRID = 10;
export const CELL = 1.4;
export const PLOT_HALF = (GRID * CELL) / 2;

export interface Cell {
  readonly x: number;
  readonly y: number;
  readonly walls: { N: boolean; E: boolean; S: boolean; W: boolean };
}

export interface MarkerPos {
  readonly x: number;
  readonly z: number;
  /** Canonical price tag — lower = cheaper toward goal. */
  readonly price: number;
}

export interface MazeData {
  readonly grid: readonly (readonly Cell[])[];
  readonly markers: readonly MarkerPos[];
  readonly path: readonly { x: number; z: number }[];
  readonly start: { x: number; z: number };
  readonly goal: { x: number; z: number };
}

export function buildMaze(seed = 0xc4_0a_71_3f): MazeData {
  const rng = mulberry32(seed);
  const grid: Cell[][] = [];
  for (let y = 0; y < GRID; y++) {
    const row: Cell[] = [];
    for (let x = 0; x < GRID; x++) {
      row.push({ x, y, walls: { N: true, E: true, S: true, W: true } });
    }
    grid.push(row);
  }

  // Randomized DFS carving.
  const visited = new Set<string>();
  const stack: Array<[number, number]> = [[0, 0]];
  visited.add("0,0");
  const dx = { N: 0, E: 1, S: 0, W: -1 } as const;
  const dy = { N: 1, E: 0, S: -1, W: 0 } as const;
  const opposite = { N: "S", E: "W", S: "N", W: "E" } as const;

  while (stack.length > 0) {
    const top = stack[stack.length - 1];
    if (!top) break;
    const [cx, cy] = top;
    const directions: Array<keyof typeof dx> = ["N", "E", "S", "W"];
    // Shuffle.
    for (let i = directions.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      const a = directions[i];
      const b = directions[j];
      if (a === undefined || b === undefined) continue;
      directions[i] = b;
      directions[j] = a;
    }
    let carved = false;
    for (const dir of directions) {
      const nx = cx + dx[dir];
      const ny = cy + dy[dir];
      if (nx < 0 || ny < 0 || nx >= GRID || ny >= GRID) continue;
      if (visited.has(`${nx},${ny}`)) continue;
      const a = grid[cy]?.[cx];
      const b = grid[ny]?.[nx];
      if (!a || !b) continue;
      a.walls[dir] = false;
      b.walls[opposite[dir]] = false;
      visited.add(`${nx},${ny}`);
      stack.push([nx, ny]);
      carved = true;
      break;
    }
    if (!carved) stack.pop();
  }

  // Shortest path via BFS from (0,0) to (GRID-1, GRID-1).
  const start: [number, number] = [0, 0];
  const goal: [number, number] = [GRID - 1, GRID - 1];
  const queue: Array<[number, number]> = [start];
  const came = new Map<string, [number, number] | null>();
  came.set("0,0", null);
  while (queue.length > 0) {
    const head = queue.shift();
    if (!head) break;
    const [cx, cy] = head;
    if (cx === goal[0] && cy === goal[1]) break;
    const cell = grid[cy]?.[cx];
    if (!cell) continue;
    for (const dir of ["N", "E", "S", "W"] as const) {
      if (cell.walls[dir]) continue;
      const nx = cx + dx[dir];
      const ny = cy + dy[dir];
      if (nx < 0 || ny < 0 || nx >= GRID || ny >= GRID) continue;
      const key = `${nx},${ny}`;
      if (came.has(key)) continue;
      came.set(key, [cx, cy]);
      queue.push([nx, ny]);
    }
  }

  const path: { x: number; z: number }[] = [];
  let cursor: [number, number] | null = goal;
  while (cursor !== null) {
    const cx: number = cursor[0];
    const cy: number = cursor[1];
    path.unshift(cellToWorld(cx, cy));
    cursor = came.get(`${cx},${cy}`) ?? null;
  }

  // Markers: one above each path step, with price decreasing along path.
  const markers: MarkerPos[] = path.map((p, i) => ({
    x: p.x,
    z: p.z,
    price: 1 - i / Math.max(1, path.length - 1),
  }));

  return {
    grid,
    markers,
    path,
    start: cellToWorld(start[0], start[1]),
    goal: cellToWorld(goal[0], goal[1]),
  };
}

export function cellToWorld(cx: number, cy: number): { x: number; z: number } {
  const x = (cx + 0.5) * CELL - PLOT_HALF;
  const z = (cy + 0.5) * CELL - PLOT_HALF;
  return { x, z };
}
