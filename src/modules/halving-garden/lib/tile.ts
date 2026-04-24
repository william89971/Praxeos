import { EPOCHS } from "./epochs";
import { computePanels, positionOfBlock } from "./layout";
import { generateOrganism } from "./organism";
import type { Block } from "./types";
import {
  TILE_SIZE,
  WORLD_HEIGHT,
  WORLD_TOP_PADDING,
  WORLD_WIDTH,
  zoomScale,
} from "./viewport";

const PANELS = computePanels(
  WORLD_WIDTH,
  WORLD_HEIGHT,
  WORLD_TOP_PADDING,
  EPOCHS.length,
);
const BASE_ORGANISM_SCALE = 5.8;

export function tileCounts(zoom: number) {
  const scale = zoomScale(zoom);
  return {
    x: Math.ceil((WORLD_WIDTH * scale) / TILE_SIZE),
    y: Math.ceil((WORLD_HEIGHT * scale) / TILE_SIZE),
  };
}

export function tileBounds(zoom: number, x: number, y: number) {
  const scale = zoomScale(zoom);
  return {
    left: (x * TILE_SIZE) / scale,
    top: (y * TILE_SIZE) / scale,
    width: TILE_SIZE / scale,
    height: TILE_SIZE / scale,
    scale,
  };
}

export function tileIndexForPoint(x: number, y: number, zoom: number) {
  const scale = zoomScale(zoom);
  return {
    x: Math.floor((x * scale) / TILE_SIZE),
    y: Math.floor((y * scale) / TILE_SIZE),
  };
}

export function renderTileSvg(
  zoom: number,
  x: number,
  y: number,
  blocks: readonly Block[],
): string {
  const bounds = tileBounds(zoom, x, y);
  const margin = 72 / bounds.scale;
  const lines: string[] = [];

  lines.push(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${TILE_SIZE} ${TILE_SIZE}" role="img">`,
  );
  lines.push(`<rect width="${TILE_SIZE}" height="${TILE_SIZE}" fill="#f5f0e6" />`);

  for (const panel of PANELS) {
    const dividerX = (panel.x - bounds.left) * bounds.scale;
    if (dividerX > 0 && dividerX < TILE_SIZE) {
      lines.push(
        `<line x1="${dividerX.toFixed(2)}" y1="0" x2="${dividerX.toFixed(2)}" y2="${TILE_SIZE}" stroke="#d8cfbe" stroke-width="1.2" />`,
      );
    }
  }

  const plaqueY = (WORLD_TOP_PADDING - bounds.top) * bounds.scale;
  if (plaqueY > 0 && plaqueY < TILE_SIZE) {
    lines.push(
      `<line x1="0" y1="${plaqueY.toFixed(2)}" x2="${TILE_SIZE}" y2="${plaqueY.toFixed(2)}" stroke="#d8cfbe" stroke-width="1.2" />`,
    );
  }

  for (const block of blocks) {
    const positioned = positionOfBlock(block.height, PANELS, 7);
    if (!positioned) continue;

    const { x: worldX, y: worldY } = positioned;
    if (
      worldX < bounds.left - margin ||
      worldX > bounds.left + bounds.width + margin ||
      worldY < bounds.top - margin ||
      worldY > bounds.top + bounds.height + margin
    ) {
      continue;
    }

    const organism = generateOrganism(block, BASE_ORGANISM_SCALE);
    const screenX = (worldX - bounds.left) * bounds.scale;
    const screenY = (worldY - bounds.top) * bounds.scale;

    if (organism.hasOrangeCore) {
      const radius = organism.radius * bounds.scale * 0.2;
      lines.push(
        `<circle cx="${screenX.toFixed(2)}" cy="${screenY.toFixed(2)}" r="${radius.toFixed(2)}" fill="none" stroke="#e87722" stroke-width="${Math.max(0.8, bounds.scale * 0.7).toFixed(2)}" />`,
      );
    }

    for (const segment of organism.segments) {
      const color =
        segment.kind === 3 && organism.hasOrangeCore ? "#e87722" : "#1c1814";
      const x1 = screenX + segment.x1 * bounds.scale;
      const y1 = screenY + segment.y1 * bounds.scale;
      const x2 = screenX + segment.x2 * bounds.scale;
      const y2 = screenY + segment.y2 * bounds.scale;
      const strokeWidth = Math.max(0.6, segment.weight * bounds.scale * 0.75);
      lines.push(
        `<line x1="${x1.toFixed(2)}" y1="${y1.toFixed(2)}" x2="${x2.toFixed(2)}" y2="${y2.toFixed(2)}" stroke="${color}" stroke-width="${strokeWidth.toFixed(2)}" stroke-linecap="round" opacity="0.84" />`,
      );
    }
  }

  lines.push("</svg>");
  return lines.join("");
}
