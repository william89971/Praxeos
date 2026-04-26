"use client";

/**
 * Loading state for module routes.
 * Shows the module shell while the heavy R3F bundle hydrates.
 */
export default function ModuleLoading() {
  return (
    <div
      style={{
        maxWidth: "var(--measure-wide)",
        marginInline: "auto",
        paddingInline: "var(--gutter-inline)",
        paddingBlock: "var(--gutter-block)",
      }}
    >
      <div style={{ marginBottom: "1rem" }}>
        <div
          style={{
            width: "8rem",
            height: "0.75rem",
            background: "var(--rule)",
            borderRadius: "var(--radius-sm)",
            marginBottom: "1.5rem",
          }}
        />
        <div
          style={{
            width: "60%",
            height: "var(--step-7)",
            background: "var(--rule)",
            borderRadius: "var(--radius-sm)",
            marginBottom: "1rem",
          }}
        />
        <div
          style={{
            width: "40%",
            height: "var(--step-2)",
            background: "var(--rule)",
            borderRadius: "var(--radius-sm)",
          }}
        />
      </div>

      <div
        style={{
          width: "100%",
          height: "min(92vh, 900px)",
          background: "var(--paper-sunk)",
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--rule)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          className="label-mono"
          style={{
            color: "var(--ink-tertiary)",
            animation: "pulse 2s ease-in-out infinite",
          }}
        >
          Loading interactive piece…
        </span>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
