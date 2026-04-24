import type { ReactNode } from "react";

/**
 * Inline footnote. On large viewports, floats into the right gutter
 * (shares styling with Marginalia). On narrow viewports, renders inline.
 */
export function Footnote({
  id,
  children,
}: {
  id: string;
  children: ReactNode;
}) {
  return (
    <span className="footnote" id={`fn-${id}`} data-no-print={false}>
      <sup style={{ fontFamily: "var(--font-mono)", fontSize: "0.72em" }}>
        <a href={`#fn-body-${id}`} aria-label={`Footnote ${id}`}>
          ✦
        </a>
      </sup>
      <span className="footnote-body" id={`fn-body-${id}`}>
        {children}
      </span>
    </span>
  );
}
