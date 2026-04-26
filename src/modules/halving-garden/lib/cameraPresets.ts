/**
 * Halving Garden — camera presets.
 *
 * Each preset is a (position, target) pair in world space. Used by both
 * Guided mode (step transitions) and Explore mode (reset / focus actions).
 */

import { EPOCHS } from "./epochs";
import {
  EPOCH_DEPTH,
  type EpochLayout,
  HALL_TOTAL_DEPTH,
  gateZ,
  getEpochLayouts,
} from "./sceneLayout";

export type Vec3 = readonly [number, number, number];

export interface CameraPreset {
  readonly position: Vec3;
  readonly target: Vec3;
  readonly fov: number;
}

const LAYOUTS: readonly EpochLayout[] = getEpochLayouts("desktop");

function layoutAt(index: number): EpochLayout {
  const layout = LAYOUTS[index];
  if (!layout) throw new Error(`No epoch layout at index ${index}`);
  return layout;
}

export function overviewPreset(): CameraPreset {
  return {
    position: [0, 11, -22],
    target: [0, 0, HALL_TOTAL_DEPTH * 0.5],
    fov: 36,
  };
}

export function epochPreset(epochIndex: number): CameraPreset {
  const layout = layoutAt(epochIndex);
  return {
    position: [0, 3.6, layout.zNear - 7],
    target: [0, -0.4, layout.zCenter + EPOCH_DEPTH * 0.15],
    fov: 38,
  };
}

export function boundaryPreset(leftEpochIndex: number): CameraPreset {
  const z = gateZ(leftEpochIndex);
  if (z === null) return epochPreset(leftEpochIndex);
  return {
    position: [3.5, 2.8, z - 5.5],
    target: [-0.5, 0, z + 1.5],
    fov: 42,
  };
}

export function focusTodayPreset(): CameraPreset {
  return epochPreset(EPOCHS.length - 1);
}

export type FocusKind =
  | { readonly kind: "overview" }
  | { readonly kind: "epoch"; readonly epochIndex: number }
  | { readonly kind: "boundary"; readonly leftEpochIndex: number };

export function presetFor(focus: FocusKind): CameraPreset {
  if (focus.kind === "overview") return overviewPreset();
  if (focus.kind === "epoch") return epochPreset(focus.epochIndex);
  return boundaryPreset(focus.leftEpochIndex);
}

export interface TourStep {
  readonly id: string;
  readonly label: string;
  readonly title: string;
  readonly body: string;
  readonly focus: FocusKind;
}

export const TOUR_STEPS: readonly TourStep[] = [
  {
    id: "field",
    label: "I. The hall",
    title: "A manuscript of every block",
    body: "The hall stretches across Bitcoin's monetary epochs. Each mark you see is one block — a confirmed batch of transactions stamped into the ledger.",
    focus: { kind: "overview" },
  },
  {
    id: "block",
    label: "II. The block",
    title: "Each block is a confirmed batch",
    body: "Roughly every ten minutes the network agrees on one. Newly arrived blocks ghost in first, then settle into the page as part of the permanent record.",
    focus: { kind: "epoch", epochIndex: EPOCHS.length - 1 },
  },
  {
    id: "halving",
    label: "III. The threshold",
    title: "At each gate, new issuance is halved",
    body: "Every 210,000 blocks, the subsidy is cut in half. The gates are not metaphorical — the schedule is enforced in code, on every node, with every block.",
    focus: { kind: "boundary", leftEpochIndex: EPOCHS.length - 2 },
  },
  {
    id: "why",
    label: "IV. The argument",
    title: "Scarcity is a rule, not a policy",
    body: "No committee votes on these drops. Bitcoin treats issuance as a discoverable rule, not a revisable preference. The garden gets denser as new coins get rarer.",
    focus: { kind: "epoch", epochIndex: EPOCHS.length - 1 },
  },
] as const;
