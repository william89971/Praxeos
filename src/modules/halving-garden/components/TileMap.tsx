"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import { tileCounts } from "../lib/tile";
import type { GardenView } from "../lib/viewport";
import {
  MAX_ZOOM,
  MIN_ZOOM,
  TILE_SIZE,
  clampView,
  worldRectForView,
  zoomScale,
} from "../lib/viewport";

type Props = {
  version: number;
  view: GardenView;
  onViewChange: (view: GardenView) => void;
  children?: ReactNode;
};

export function TileMap({ version, view, onViewChange, children }: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ x: number; y: number; origin: GardenView } | null>(null);
  const [size, setSize] = useState({ width: 1, height: 1 });

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

  const clamped = clampView(view, size.width, size.height);
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
      onWheel={(event) => {
        event.preventDefault();
        const delta = event.deltaY > 0 ? -0.25 : 0.25;
        onViewChange(
          clampView(
            {
              ...clamped,
              zoom: Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, clamped.zoom + delta)),
            },
            size.width,
            size.height,
          ),
        );
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
      {tiles.map((tile) => (
        <img
          key={`${clamped.zoom}-${tile.x}-${tile.y}-${version}`}
          src={`/api/tile/${Math.round(clamped.zoom)}/${tile.x}/${tile.y}?v=${version}`}
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
      ))}

      {children}
    </div>
  );
}
