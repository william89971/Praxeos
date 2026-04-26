"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { CSSProperties, ReactNode } from "react";

interface Props {
  readonly children: ReactNode;
  readonly delay?: number;
  readonly style?: CSSProperties;
  readonly id?: string;
  readonly className?: string;
}

/**
 * Section wrapper with a quiet entrance animation. Slides up + fades in
 * once the section enters the viewport. Respects `prefers-reduced-motion`
 * by disabling animation entirely.
 */
export function ScrollSection({ children, delay = 0, style, id, className }: Props) {
  const reduced = useReducedMotion();

  if (reduced) {
    return (
      <section id={id} className={className} style={style}>
        {children}
      </section>
    );
  }

  return (
    <motion.section
      id={id}
      className={className}
      style={style as Record<string, string | number>}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12%" }}
      transition={{ duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.section>
  );
}
