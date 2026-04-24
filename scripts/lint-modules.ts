#!/usr/bin/env tsx

import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { MODULE_REGISTRY } from "@/modules/registry";

async function main() {
  const failures: string[] = [];

  for (const entry of MODULE_REGISTRY) {
    const moduleDir = path.join(process.cwd(), "src", "modules", entry.slug);
    const metadataPath = path.join(moduleDir, "metadata.ts");
    const essayPath = path.join(moduleDir, "essay.mdx");
    const sourcesPath = path.join(moduleDir, "sources.ts");

    await ensureFile(metadataPath, failures);
    await ensureFile(essayPath, failures);
    await ensureFile(sourcesPath, failures);

    const essay = await readFile(essayPath, "utf8");
    if (essay.trim().split(/\s+/).length < 500) {
      failures.push(`${entry.slug}: essay is below 500 words`);
    }

    const mod = await entry.load();
    const posterPath = path.join(
      process.cwd(),
      "public",
      mod.metadata.posterSrc.replace(/^\//, ""),
    );
    await ensureFile(posterPath, failures);
  }

  if (failures.length > 0) {
    for (const failure of failures) {
      console.error(failure);
    }
    process.exitCode = 1;
    return;
  }

  console.log(`Validated ${MODULE_REGISTRY.length} modules.`);
}

async function ensureFile(filePath: string, failures: string[]) {
  try {
    await access(filePath);
  } catch {
    failures.push(`Missing file: ${path.relative(process.cwd(), filePath)}`);
  }
}

void main();
