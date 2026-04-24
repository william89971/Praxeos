export const TILE_SIZE = 512;
export const WORLD_WIDTH = 3_840;
export const WORLD_HEIGHT = 1_600;
export const WORLD_TOP_PADDING = 76;
export const MIN_ZOOM = 0;
export const MAX_ZOOM = 4;

export type GardenView = {
  zoom: number;
  centerX: number;
  centerY: number;
};

export function zoomScale(zoom: number): number {
  return 2 ** zoom;
}

export function clampView(
  view: GardenView,
  viewportWidth: number,
  viewportHeight: number,
): GardenView {
  const zoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, view.zoom));
  const scale = zoomScale(zoom);
  const halfWidth = viewportWidth / (2 * scale);
  const halfHeight = viewportHeight / (2 * scale);

  return {
    zoom,
    centerX: clamp(view.centerX, halfWidth, WORLD_WIDTH - halfWidth),
    centerY: clamp(view.centerY, halfHeight, WORLD_HEIGHT - halfHeight),
  };
}

export function worldRectForView(
  view: GardenView,
  viewportWidth: number,
  viewportHeight: number,
) {
  const clamped = clampView(view, viewportWidth, viewportHeight);
  const scale = zoomScale(clamped.zoom);
  const width = viewportWidth / scale;
  const height = viewportHeight / scale;

  return {
    left: clamped.centerX - width / 2,
    top: clamped.centerY - height / 2,
    width,
    height,
    scale,
  };
}

function clamp(value: number, min: number, max: number): number {
  if (min > max) return (min + max) / 2;
  return Math.min(max, Math.max(min, value));
}
