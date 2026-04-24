/**
 * Teleology — simulation of purposeful agents moving toward chosen ends.
 *
 * Each agent has a current goal (one of a small set of attractors). It
 * accelerates toward the goal with damping, a small amount of wander, and
 * a preference drift so the ensemble does not collapse to a single point.
 * Every ~40–60 seconds the attractor set rearranges — the "dissolution"
 * moment — and new equilibria form.
 *
 * Pure logic; no canvas. Call `step(dt)` each frame, then render from
 * `agents` and `trails`.
 */

import { type RNG, hashSeed, mulberry32, range } from "@/sketches/lib/rng";

export type Agent = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  goalIdx: number;
  /** 0..1 — personal bias toward exploration vs. commitment. */
  restlessness: number;
  /** Pulse — rises when acting, falls when fulfilled. */
  intent: number;
  /** Rolling trail of previous positions (newest first). */
  trail: number[];
};

export type Attractor = {
  x: number;
  y: number;
  /** 0..1 — "pull strength." Pulses softly. */
  strength: number;
};

export type SimParams = {
  width: number;
  height: number;
  agentCount: number;
  attractorCount: number;
  seed: string;
};

const TRAIL_MAX_POINTS = 14;
const REARRANGEMENT_PERIOD_MS = 52_000;
const GOAL_SWITCH_CHANCE = 0.004;

export class TeleologySim {
  agents: Agent[];
  attractors: Attractor[];
  rng: RNG;
  private width: number;
  private height: number;
  private elapsed = 0;
  private lastRearrange = 0;
  private rearrangeProgress = 0;

  constructor(params: SimParams) {
    this.width = params.width;
    this.height = params.height;
    this.rng = mulberry32(hashSeed(params.seed));
    this.attractors = this.makeAttractors(params.attractorCount);
    this.agents = this.makeAgents(params.agentCount);
  }

  resize(width: number, height: number) {
    const scaleX = width / this.width;
    const scaleY = height / this.height;
    this.width = width;
    this.height = height;
    for (const a of this.agents) {
      a.x *= scaleX;
      a.y *= scaleY;
      a.trail = a.trail.map((v, i) => (i % 2 === 0 ? v * scaleX : v * scaleY));
    }
    for (const attr of this.attractors) {
      attr.x *= scaleX;
      attr.y *= scaleY;
    }
  }

  step(dt: number) {
    const dtSec = Math.min(0.066, dt / 1000); // clamp dt to avoid jumps on tab resume
    this.elapsed += dt;

    // Maybe begin a rearrangement cycle.
    if (this.elapsed - this.lastRearrange > REARRANGEMENT_PERIOD_MS) {
      this.beginRearrangement();
      this.lastRearrange = this.elapsed;
    }
    if (this.rearrangeProgress > 0) {
      this.rearrangeProgress = Math.max(0, this.rearrangeProgress - dtSec * 0.5);
    }

    // Attractor pulse.
    for (const attr of this.attractors) {
      attr.strength =
        0.5 + 0.3 * Math.sin((this.elapsed / 1000 + attr.x * 0.001) * 0.8);
    }

    // Agent dynamics.
    const damp = 0.92;
    const maxSpeed = 0.14 * Math.min(this.width, this.height);
    for (const a of this.agents) {
      const target = this.attractors[a.goalIdx];
      if (!target) continue;

      const dx = target.x - a.x;
      const dy = target.y - a.y;
      const distSq = dx * dx + dy * dy;
      const dist = Math.sqrt(distSq) + 1e-3;
      const pull = 0.25 * target.strength;

      // Dissolution noise: when attractors rearrange, agents wander.
      const noiseAmp = 0.12 + this.rearrangeProgress * 0.7;
      const noiseAngle = this.rng() * Math.PI * 2;

      a.vx += ((dx / dist) * pull + Math.cos(noiseAngle) * noiseAmp) * dtSec * 60;
      a.vy += ((dy / dist) * pull + Math.sin(noiseAngle) * noiseAmp) * dtSec * 60;

      a.vx *= damp;
      a.vy *= damp;

      // Speed clamp.
      const speed = Math.hypot(a.vx, a.vy);
      if (speed > maxSpeed) {
        a.vx = (a.vx / speed) * maxSpeed;
        a.vy = (a.vy / speed) * maxSpeed;
      }

      a.x += a.vx * dtSec;
      a.y += a.vy * dtSec;

      // Bounds — soft wrap, kept in play area.
      if (a.x < 0) a.x += this.width;
      else if (a.x > this.width) a.x -= this.width;
      if (a.y < 0) a.y += this.height;
      else if (a.y > this.height) a.y -= this.height;

      // Trail: prepend current position, cap length.
      a.trail.unshift(a.x, a.y);
      if (a.trail.length > TRAIL_MAX_POINTS * 2) {
        a.trail.length = TRAIL_MAX_POINTS * 2;
      }

      // Intent: climb when far, decay when close.
      const desired = Math.min(1, dist / (this.width * 0.25));
      a.intent += (desired - a.intent) * 0.04;

      // Occasional goal switch — lends kaleidic life.
      if (this.rng() < GOAL_SWITCH_CHANCE * (0.5 + a.restlessness)) {
        a.goalIdx = Math.floor(this.rng() * this.attractors.length);
      }
    }
  }

  private beginRearrangement() {
    this.rearrangeProgress = 1;
    // Reposition attractors while preserving count.
    for (const attr of this.attractors) {
      attr.x = range(this.rng, this.width * 0.12, this.width * 0.88);
      attr.y = range(this.rng, this.height * 0.2, this.height * 0.8);
    }
    // Every agent picks a new goal.
    for (const a of this.agents) {
      a.goalIdx = Math.floor(this.rng() * this.attractors.length);
    }
  }

  private makeAttractors(n: number): Attractor[] {
    const attrs: Attractor[] = [];
    for (let i = 0; i < n; i++) {
      attrs.push({
        x: range(this.rng, this.width * 0.12, this.width * 0.88),
        y: range(this.rng, this.height * 0.2, this.height * 0.8),
        strength: range(this.rng, 0.4, 0.9),
      });
    }
    return attrs;
  }

  private makeAgents(n: number): Agent[] {
    const agents: Agent[] = [];
    for (let i = 0; i < n; i++) {
      agents.push({
        x: range(this.rng, 0, this.width),
        y: range(this.rng, 0, this.height),
        vx: range(this.rng, -8, 8),
        vy: range(this.rng, -8, 8),
        goalIdx: Math.floor(this.rng() * this.attractors.length),
        restlessness: range(this.rng, 0.2, 1),
        intent: range(this.rng, 0, 1),
        trail: [],
      });
    }
    return agents;
  }
}
