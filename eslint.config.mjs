// @ts-check
/**
 * Supplementary ESLint config — Biome owns formatting + 95% of lint;
 * ESLint runs only the jsx-a11y rules Biome does not cover.
 *
 * Usage: `npm run lint:a11y`
 */

import js from "@eslint/js";
import jsxA11y from "eslint-plugin-jsx-a11y";
import tseslint from "typescript-eslint";

export default [
  {
    ignores: [
      "node_modules",
      ".next",
      "out",
      "data",
      "public",
      "coverage",
      "playwright-report",
      "test-results",
      "tests/visual/snapshots",
      "*.md",
      "*.mdx",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    plugins: { "jsx-a11y": jsxA11y },
    rules: {
      // Only pick up a11y rules. Biome handles everything else.
      ...jsxA11y.configs.recommended.rules,
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "no-unused-vars": "off",
      "no-undef": "off",
    },
  },
];
