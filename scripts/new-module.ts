#!/usr/bin/env tsx
/**
 * Praxeos — new-module scaffolder
 *
 *   npm run new-module <slug>
 *
 * Scaffolds a module from /src/modules/_template/, substitutes placeholders
 * based on interactive prompts, and appends the module to the registry.
 */

import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import readline from "node:readline/promises";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const TEMPLATE_DIR = path.join(ROOT, "src/modules/_template");
const MODULES_DIR = path.join(ROOT, "src/modules");
const REGISTRY_PATH = path.join(ROOT, "src/modules/registry.ts");

const KEBAB_RE = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/;
const RESERVED = new Set(["_template", "registry.ts", "CLAUDE.md"]);

const rawSlug = process.argv[2]?.trim();
if (!rawSlug) {
  console.error("✖ Usage: npm run new-module <slug>");
  console.error("  Example: npm run new-module cantillon-effect");
  process.exit(1);
}
const slug: string = rawSlug;
if (!KEBAB_RE.test(slug)) {
  console.error(`✖ Slug "${slug}" is not valid kebab-case.`);
  console.error("  Use lowercase letters, numbers, and hyphens only.");
  process.exit(1);
}
if (RESERVED.has(slug)) {
  console.error(`✖ "${slug}" is reserved.`);
  process.exit(1);
}

const targetDir = path.join(MODULES_DIR, slug);
if (existsSync(targetDir)) {
  console.error(`✖ Module already exists: ${path.relative(ROOT, targetDir)}`);
  process.exit(1);
}

const isInteractive = process.stdin.isTTY === true;
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: isInteractive,
});

// Buffer piped stdin upfront so we don't rely on question()'s EOF handling.
let pipedLines: string[] | null = null;
if (!isInteractive) {
  let buf = "";
  process.stdin.setEncoding("utf8");
  for await (const chunk of process.stdin) {
    buf += chunk;
  }
  pipedLines = buf.split(/\r?\n/);
}

let pipedIndex = 0;
const ask = async (q: string, fallback?: string): Promise<string> => {
  const prompt = fallback ? `${q} [${fallback}] ` : `${q} `;
  let raw: string;
  if (pipedLines) {
    raw = (pipedLines[pipedIndex++] ?? "").trim();
    process.stdout.write(`${prompt}${raw}\n`);
  } else {
    raw = (await rl.question(prompt)).trim();
  }
  return raw.length > 0 ? raw : (fallback ?? "");
};

console.log(`\n  Praxeos · scaffolding module "${slug}"\n`);
console.log(
  "  Answer each prompt. Defaults are in [brackets] — press enter to accept.\n",
);

const defaultTitle = slug
  .split("-")
  .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
  .join(" ");

const title = await ask("  Title (display):", defaultTitle);
const subtitle = await ask("  Subtitle (one italic sentence):");
const concept = await ask("  Concept tag (lowercase, hyphenated):", slug);
const thinkersRaw = await ask(
  "  Thinkers (comma-separated slugs, e.g. mises,hayek):",
  "mises",
);
const complexityRaw = await ask("  Complexity 1–5:", "3");
const fascicleRaw = await ask("  Fascicle number:", "1");
const moduleNumberRaw = await ask("  Module number within fascicle:", "1");
const bestOn = (await ask("  Best on [any / desktop]:", "any")) as "any" | "desktop";
const readingTimeRaw = await ask("  Reading time in minutes:", "8");

rl.close();

const thinkers = thinkersRaw
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
const complexity = Math.min(5, Math.max(1, Number.parseInt(complexityRaw, 10) || 3));
const fascicle = Number.parseInt(fascicleRaw, 10) || 1;
const moduleNumber = Number.parseInt(moduleNumberRaw, 10) || 1;
const readingTimeMin = Number.parseInt(readingTimeRaw, 10) || 8;
const publishedAt = new Date().toISOString().slice(0, 10);

// --- Copy template recursively and substitute placeholders ---------------
mkdirSync(targetDir, { recursive: true });

function copyTemplate(src: string, dst: string) {
  for (const entry of readdirSync(src, { withFileTypes: true })) {
    if (entry.name === "CLAUDE.md") continue; // don't copy per-template CLAUDE
    const from = path.join(src, entry.name);
    const to = path.join(dst, entry.name);
    if (entry.isDirectory()) {
      mkdirSync(to, { recursive: true });
      copyTemplate(from, to);
    } else {
      const content = readFileSync(from, "utf8");
      writeFileSync(to, substitute(content));
    }
  }
}

function substitute(text: string): string {
  return text
    .replaceAll("__TEMPLATE_SLUG__", slug)
    .replaceAll("__TEMPLATE_TITLE__", title.replaceAll('"', '\\"'))
    .replaceAll("__TEMPLATE_SUBTITLE__", subtitle.replaceAll('"', '\\"'))
    .replaceAll("__TEMPLATE_CONCEPT__", concept)
    .replaceAll("__TEMPLATE_PUBLISHED_AT__", publishedAt)
    .replaceAll(
      'thinkers: ["mises"]',
      `thinkers: [${thinkers.map((t) => `"${t}"`).join(", ")}]`,
    )
    .replaceAll("complexity: 3", `complexity: ${complexity}`)
    .replaceAll("fascicle: 1", `fascicle: ${fascicle}`)
    .replaceAll("moduleNumber: 0", `moduleNumber: ${moduleNumber}`)
    .replaceAll("readingTimeMin: 8", `readingTimeMin: ${readingTimeMin}`)
    .replaceAll('bestOn: "any"', `bestOn: "${bestOn}"`);
}

copyTemplate(TEMPLATE_DIR, targetDir);

// --- Update registry.ts --------------------------------------------------
const registry = readFileSync(REGISTRY_PATH, "utf8");
const insertion = `  {
    slug: "${slug}",
    fascicle: ${fascicle},
    moduleNumber: ${moduleNumber},
    load: () => import("@/modules/${slug}"),
  },
`;
const marker = "// <-- new-module CLI inserts entries here -->";
if (!registry.includes(marker)) {
  console.error(`✖ Registry marker not found in ${path.relative(ROOT, REGISTRY_PATH)}`);
  process.exit(1);
}
const updated = registry.replace(marker, `${insertion}  ${marker}`);
writeFileSync(REGISTRY_PATH, updated);

// --- Report --------------------------------------------------------------
const rel = path.relative(ROOT, targetDir);
console.log(`\n  ✓ Scaffolded ${rel}/\n`);
console.log("  Next steps:");
console.log(`    1. Drop a poster at /public/posters/${slug}.webp`);
console.log(`    2. Fill in src/modules/${slug}/sources.ts with 3–7 primary sources`);
console.log(`    3. Draft src/modules/${slug}/essay.mdx per /docs/VOICE.md`);
console.log(
  `    4. Implement src/modules/${slug}/sketch.tsx per /src/sketches/CLAUDE.md`,
);
console.log("    5. npm run typecheck && npm run lint");
console.log(`    6. npm run dev → open http://localhost:3000/modules/${slug}\n`);
console.log("  Homo agit.\n");
