"use client";

import type { CSSProperties } from "react";
import { BLOCKS_PER_EPOCH, EPOCHS } from "../lib/epochs";
import { APPROX_TIP_HEIGHT } from "../lib/sceneLayout";

interface Props {
  readonly epochIndex: number;
  /** Latest block height observed live. Used to compute "issued so far" for the current era. */
  readonly tipHeight: number | null;
}

const POETIC: readonly string[] = [
  "An empty page. The schedule is being written by the first hands.",
  "The first cut. The promise survives its first test.",
  "Inscriptions thicken. The ledger learns its own gravity.",
  "Every coin issued must now be earned twice as patiently.",
  "Rare ink. New issuance approaches its asymptote.",
];

/**
 * Dossier card: surfaces epoch number, block range, reward, approximate
 * BTC issued in that era, and a one-line poetic gloss. Mounted as overlay
 * inside the 3D canvas frame.
 */
export function EpochInfoPanel({ epochIndex, tipHeight }: Props) {
  const epoch = EPOCHS[epochIndex];
  if (!epoch) return null;

  const isCurrent = epochIndex === EPOCHS.length - 1;
  const observedTip = tipHeight ?? APPROX_TIP_HEIGHT;
  const blocksWithin = isCurrent
    ? Math.max(0, Math.min(BLOCKS_PER_EPOCH, observedTip - epoch.startHeight))
    : BLOCKS_PER_EPOCH;
  const issuedBtc = Math.round(blocksWithin * epoch.subsidy).toLocaleString();
  const totalBtcThisEra = (BLOCKS_PER_EPOCH * epoch.subsidy).toLocaleString();

  return (
    <aside aria-label={`Epoch ${epoch.roman} dossier`} style={panelStyle}>
      <div className="label-mono" style={{ color: "var(--ink-tertiary)" }}>
        Epoch {epoch.roman} · {epoch.label}
      </div>
      <div
        style={{
          marginTop: "0.35rem",
          fontFamily: "var(--font-serif)",
          fontSize: "1.18rem",
          lineHeight: 1.2,
          color: "var(--ink-primary)",
          fontStyle: "italic",
        }}
      >
        {POETIC[epochIndex] ?? ""}
      </div>

      <dl style={dlStyle}>
        <Row k="Block range">
          {epoch.startHeight.toLocaleString()} – {epoch.endHeight.toLocaleString()}
        </Row>
        <Row k="Reward">{epoch.subsidy} BTC per block</Row>
        <Row k="Years">
          {epoch.startDate} → {epoch.endDate}
        </Row>
        <Row k={isCurrent ? "Issued so far" : "Issued this era"}>
          {issuedBtc} BTC{isCurrent ? ` · of ${totalBtcThisEra} BTC` : ""}
        </Row>
      </dl>
    </aside>
  );
}

const panelStyle: CSSProperties = {
  position: "absolute",
  insetBlockEnd: "1rem",
  insetInlineEnd: "1rem",
  maxWidth: "min(34ch, calc(100% - 2rem))",
  padding: "0.85rem 1rem",
  background: "color-mix(in oklab, var(--paper-elevated) 88%, transparent)",
  border: "1px solid var(--rule)",
  borderRadius: "var(--radius-sm)",
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
  zIndex: 2,
  pointerEvents: "none",
};

const dlStyle: CSSProperties = {
  margin: "0.7rem 0 0",
  display: "grid",
  gap: "0.3rem",
  gridTemplateColumns: "max-content 1fr",
  fontFamily: "var(--font-mono)",
  fontSize: "var(--step--2)",
  fontVariantNumeric: "tabular-nums",
};

function Row({
  k,
  children,
}: { readonly k: string; readonly children: React.ReactNode }) {
  return (
    <>
      <dt style={{ color: "var(--ink-tertiary)" }}>{k}</dt>
      <dd style={{ margin: 0, color: "var(--ink-secondary)" }}>{children}</dd>
    </>
  );
}
