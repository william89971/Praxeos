"use client";

import type { CSSProperties } from "react";
import {
  type CellCoord,
  type Direction,
  type MazeData,
  costForMove,
  directionToNextPathCell,
  legalMoves,
} from "../lib/labyrinthLayout";

interface Props {
  readonly priced: boolean;
  readonly onPricedChange: (priced: boolean) => void;
  readonly maze: MazeData;
  readonly current: CellCoord;
  readonly waste: number;
  readonly onMove: (direction: Direction) => void;
  readonly onReset: () => void;
  readonly onNewChallenge: () => void;
}

const DIRECTIONS: readonly Direction[] = ["N", "E", "S", "W"];
const LABELS: Record<Direction, string> = {
  N: "North",
  E: "East",
  S: "South",
  W: "West",
};

export function ModeToggle({
  priced,
  onPricedChange,
  maze,
  current,
  waste,
  onMove,
  onReset,
  onNewChallenge,
}: Props) {
  const legal = legalMoves(maze, current);
  const best = directionToNextPathCell(maze, current);
  const goalCell = maze.pathCells[maze.pathCells.length - 1];
  const atGoal = current.x === goalCell?.x && current.y === goalCell?.y;

  return (
    <aside style={panelStyle} aria-live="polite">
      <div style={topRowStyle}>
        <div className="label-mono" style={{ color: "var(--ink-tertiary)" }}>
          Calculation Labyrinth · {priced ? "Prices visible" : "Prices absent"}
        </div>
        <div aria-label="Price mode" style={{ display: "flex", gap: "0.45rem" }}>
          <Button active={priced} onClick={() => onPricedChange(true)}>
            Prices
          </Button>
          <Button active={!priced} onClick={() => onPricedChange(false)}>
            No prices
          </Button>
        </div>
      </div>

      <p style={headlineStyle}>
        {atGoal
          ? "The target is reached because each step could be compared."
          : priced
            ? "Choose among priced alternatives."
            : "Now choose without a common unit of calculation."}
      </p>
      <p style={sublineStyle}>
        {priced
          ? "The cheapest exit is legible. A wrong legal turn is possible, but it is visibly costly."
          : "The same maze remains. What disappears is the ranking of alternatives, so waste accumulates as guesses replace calculation."}
      </p>

      <div style={moveGridStyle} aria-label="Planner moves">
        {DIRECTIONS.map((dir) => {
          const enabled = legal.includes(dir) && !atGoal;
          const cost = costForMove(maze, current, dir);
          return (
            <button
              key={dir}
              type="button"
              data-interactive
              disabled={!enabled}
              className="label-mono"
              onClick={() => onMove(dir)}
              style={moveButtonStyle(enabled, priced && best === dir)}
            >
              <span>{LABELS[dir]}</span>
              <span style={{ color: "var(--ink-tertiary)" }}>
                {enabled ? (priced ? cost.toFixed(2) : "unknown") : "wall"}
              </span>
            </button>
          );
        })}
      </div>

      <div style={bottomRowStyle}>
        <span className="label-mono" style={{ color: "var(--accent-action)" }}>
          Waste {waste}
        </span>
        <div style={{ display: "flex", gap: "0.45rem", flexWrap: "wrap" }}>
          <Button active={false} onClick={onReset}>
            Reset
          </Button>
          <Button active={false} onClick={onNewChallenge}>
            New maze
          </Button>
        </div>
      </div>
    </aside>
  );
}

function Button({
  active,
  onClick,
  children,
}: {
  readonly active: boolean;
  readonly onClick: () => void;
  readonly children: string;
}) {
  return (
    <button
      type="button"
      data-interactive
      className="label-mono"
      aria-pressed={active}
      onClick={onClick}
      style={{
        padding: "0.36rem 0.68rem",
        border: `1px solid ${active ? "var(--ink-secondary)" : "var(--rule)"}`,
        borderRadius: "var(--radius-sm)",
        background: active ? "var(--paper)" : "transparent",
        color: active ? "var(--ink-primary)" : "var(--ink-secondary)",
      }}
    >
      {children}
    </button>
  );
}

function moveButtonStyle(enabled: boolean, recommended: boolean): CSSProperties {
  return {
    minHeight: "3.5rem",
    display: "grid",
    gap: "0.2rem",
    alignContent: "center",
    padding: "0.5rem",
    borderRadius: "var(--radius-sm)",
    border: `1px solid ${recommended ? "var(--accent-bitcoin)" : "var(--rule)"}`,
    background: recommended ? "var(--accent-bitcoin-wash)" : "var(--paper)",
    color: enabled ? "var(--ink-primary)" : "var(--ink-tertiary)",
    cursor: enabled ? "pointer" : "not-allowed",
    opacity: enabled ? 1 : 0.55,
  };
}

const panelStyle: CSSProperties = {
  display: "grid",
  gap: "0.7rem",
  padding: "0.95rem 1.1rem",
  background: "color-mix(in oklab, var(--paper-elevated) 85%, transparent)",
  border: "1px solid var(--rule)",
  borderRadius: "var(--radius-sm)",
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
  maxWidth: "min(50ch, 100%)",
};

const topRowStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "1rem",
  flexWrap: "wrap",
};

const headlineStyle: CSSProperties = {
  margin: "0.2rem 0 0",
  fontFamily: "var(--font-serif)",
  fontStyle: "italic",
  fontSize: "clamp(1.05rem, 1.6vw, 1.3rem)",
  lineHeight: 1.25,
  color: "var(--ink-primary)",
};

const sublineStyle: CSSProperties = {
  margin: 0,
  fontFamily: "var(--font-serif)",
  fontSize: "var(--step--1)",
  lineHeight: 1.55,
  color: "var(--ink-secondary)",
};

const moveGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
  gap: "0.45rem",
};

const bottomRowStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "0.75rem",
  flexWrap: "wrap",
};
