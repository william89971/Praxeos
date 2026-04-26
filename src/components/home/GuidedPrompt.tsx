"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { CSSProperties, ReactNode } from "react";

interface Props {
  readonly children: ReactNode;
  readonly style?: CSSProperties;
}

/**
 * A quiet, editorial prompt that appears near a decision point.
 * Fades in slowly — never jarring. Used to guide without commanding.
 */
export function GuidedPrompt({ children, style }: Props) {
  const reduced = useReducedMotion();

  const baseStyle: CSSProperties = {
    display: "inline-block",
    fontFamily: "var(--font-sans)",
    fontSize: "var(--step--1)",
    fontWeight: 500,
    letterSpacing: "0.02em",
    color: "var(--ink-tertiary)",
    fontStyle: "italic",
    ...style,
  };

  if (reduced) {
    return <span style={baseStyle}>{children}</span>;
  }

  return (
    <motion.span
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8%" }}
      transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      // biome-ignore lint/suspicious/noExplicitAny: framer-motion MotionStyle vs CSSProperties incompatibility with exactOptionalPropertyTypes
      style={baseStyle as any}
    >
      {children}
    </motion.span>
  );
}
