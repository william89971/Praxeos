/**
 * Halving Garden — layout helpers.
 *
 * Maps a block height to a pixel position on a canvas that has been divided
 * into N horizontal epoch panels. Each panel carries the Hilbert curve
 * over its own block range.
 */

import { EPOCHS, getEpoch, heightWithinEpoch } from "./epochs";
import { type HilbertOrder, d2xy, gridSide } from "./hilbert";

export interface PanelRect {
  x: number;
  y: number;
  width: number;
  height: number;
  epochIndex: number;
}

/**
 * Divide the canvas into N equal horizontal panels. `panels` is the number
 * of epochs to show (usually = EPOCHS.length).
 */
export function computePanels(
  width: number,
  height: number,
  topPadding: number,
  panels = EPOCHS.length,
): PanelRect[] {
  const panelWidth = width / panels;
  const inner: PanelRect[] = [];
  for (let i = 0; i < panels; i++) {
    inner.push({
      x: i * panelWidth,
      y: topPadding,
      width: panelWidth,
      height: height - topPadding,
      epochIndex: i,
    });
  }
  return inner;
}

/**
 * For a given block, compute its canvas coordinate using its epoch's panel
 * and the Hilbert curve within that panel.
 */
export function positionOfBlock(
  height: number,
  panels: PanelRect[],
  order: HilbertOrder = 7,
): { x: number; y: number; panel: PanelRect } | null {
  const epoch = getEpoch(height);
  const panel = panels.find((p) => p.epochIndex === epoch.index);
  if (!panel) return null;

  const within = heightWithinEpoch(height);
  const totalInEpoch = epoch.endHeight - epoch.startHeight + 1;
  const n = gridSide(order);
  const d = Math.min(
    n * n - 1,
    Math.floor((within / Math.max(1, totalInEpoch)) * n * n),
  );
  const [cx, cy] = d2xy(n, d);

  const x = panel.x + (cx / n) * panel.width;
  const y = panel.y + (cy / n) * panel.height;
  return { x, y, panel };
}
