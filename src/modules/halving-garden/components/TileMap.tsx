"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import { EPOCHS } from "../lib/epochs";
import { computePanels, positionOfBlock } from "../lib/layout";
import { tileCounts, tileIndexForPoint } from "../lib/tile";
import type { GardenView } from "../lib/viewport";
import {
  MAX_ZOOM,
  MIN_ZOOM,
  TILE_SIZE,
  WORLD_HEIGHT,
  WORLD_TOP_PADDING,
  WORLD_WIDTH,
  clampView,
  worldRectForView,
  zoomScale,
} from "../lib/viewport";

const PANELS = computePanels(
  WORLD_WIDTH,
  WORLD_HEIGHT,
  WORLD_TOP_PADDING,
  EPOCHS.length,
);

type Props = {
  /**
   * Block height of the newest block the parent knows about. Used to
   * invalidate the cache for the one tile that actually changed, while
   * every other visible tile keeps a stable key and benefits from the
   * browser/CDN cache.
   */
  version: number;
  view: GardenView;
  onViewChange: (view: GardenView) => void;
  children?: ReactNode;
};

export function TileMap({ version, view, onViewChange, children }: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ x: number; y: number; origin: GardenView } | null>(null);
  const [size, setSize] = useState({ width: 1, height: 1 });
  // Always-current snapshot of the clamped view for the imperative wheel handler.
  const clampedRef = useRef<GardenView | null>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const observer = new ResizeObserver((entries) => {
      const rect = entries[0]?.contentRect;
      if (!rect) return;
      setSize({
        width: Math.max(1, Math.floor(rect.width)),
        height: Math.max(1, Math.floor(rect.height)),
      });
    });
    observer.observe(wrapper);
    return () => observer.disconnect();
  }, []);

  // React 19 wheel events are passive by default, so event.preventDefault()
  // in the synthetic handler is a no-op. Wire the listener imperatively.
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      const current = clampedRef.current;
      if (!current) return;
      const delta = event.deltaY > 0 ? -0.25 : 0.25;
      onViewChange(
        clampView(
          {
            ...current,
            zoom: Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, current.zoom + delta)),
          },
          size.width,
          size.height,
        ),
      );
    };
    wrapper.addEventListener("wheel", onWheel, { passive: false });
    return () => wrapper.removeEventListener("wheel", onWheel);
  }, [onViewChange, size.width, size.height]);

  const clamped = clampView(view, size.width, size.height);
  clampedRef.current = clamped;
  const rect = worldRectForView(clamped, size.width, size.height);
  const counts = tileCounts(clamped.zoom);
  const tileStartX = Math.max(0, Math.floor((rect.left * rect.scale) / TILE_SIZE) - 1);
  const tileEndX = Math.min(
    counts.x - 1,
    Math.floor(((rect.left + rect.width) * rect.scale) / TILE_SIZE) + 1,
  );
  const tileStartY = Math.max(0, Math.floor((rect.top * rect.scale) / TILE_SIZE) - 1);
  const tileEndY = Math.min(
    counts.y - 1,
    Math.floor(((rect.top + rect.height) * rect.scale) / TILE_SIZE) + 1,
  );

  const tiles: Array<{ x: number; y: number; left: number; top: number }> = [];
  for (let x = tileStartX; x <= tileEndX; x++) {
    for (let y = tileStartY; y <= tileEndY; y++) {
      tiles.push({
        x,
        y,
        left: x * TILE_SIZE - rect.left * rect.scale,
        top: y * TILE_SIZE - rect.top * rect.scale,
      });
    }
  }

  // Compute the single tile affected by the newest block; only that
  // tile gets a version-stamped URL so the rest stay cacheable.
  const zoomInt = Math.round(clamped.zoom);
  const newestBlockPosition = version > 0 ? positionOfBlock(version, PANELS, 7) : null;
  const affectedTile = newestBlockPosition
    ? tileIndexForPoint(newestBlockPosition.x, newestBlockPosition.y, zoomInt)
    : null;

  return (
    <div
      ref={wrapperRef}
      data-interactive
      onPointerDown={(event) => {
        dragRef.current = {
          x: event.clientX,
          y: event.clientY,
          origin: clamped,
        };
        event.currentTarget.setPointerCapture(event.pointerId);
      }}
      onPointerMove={(event) => {
        if (!dragRef.current) return;
        const scale = zoomScale(clamped.zoom);
        const deltaX = (event.clientX - dragRef.current.x) / scale;
        const deltaY = (event.clientY - dragRef.current.y) / scale;
        onViewChange(
          clampView(
            {
              ...dragRef.current.origin,
              centerX: dragRef.current.origin.centerX - deltaX,
              centerY: dragRef.current.origin.centerY - deltaY,
            },
            size.width,
            size.height,
          ),
        );
      }}
      onPointerUp={(event) => {
        dragRef.current = null;
        event.currentTarget.releasePointerCapture(event.pointerId);
      }}
      onPointerLeave={() => {
        dragRef.current = null;
      }}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        background:
          "radial-gradient(circle at 50% 18%, rgba(216, 207, 190, 0.35), transparent 44%), var(--paper)",
        cursor: "grab",
      }}
    >
      {tiles.map((tile) => {
        const isAffected =
          affectedTile !== null &&
          tile.x === affectedTile.x &&
          tile.y === affectedTile.y;
        const src = isAffected
          ? `/api/tile/${zoomInt}/${tile.x}/${tile.y}?v=${version}`
          : `/api/tile/${zoomInt}/${tile.x}/${tile.y}`;
        // Stable key for cached tiles; version-stamped key only for the
        // tile the new block actually touched.
        const key = isAffected
          ? `${zoomInt}-${tile.x}-${tile.y}-${version}`
          : `${zoomInt}-${tile.x}-${tile.y}`;
        return (
          <img
            key={key}
            src={src}
            alt=""
            aria-hidden="true"
            draggable="false"
            style={{
              position: "absolute",
              left: tile.left,
              top: tile.top,
              width: TILE_SIZE,
              height: TILE_SIZE,
              userSelect: "none",
              pointerEvents: "none",
            }}
          />
        );
      })}

      {children}
    </div>
  );
}
