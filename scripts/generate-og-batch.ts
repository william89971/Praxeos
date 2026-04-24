#!/usr/bin/env tsx

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { MODULE_REGISTRY } from "@/modules/registry";

async function main() {
  const manifest = {
    generatedAt: new Date().toISOString(),
    routes: [
      "/opengraph-image",
      "/manifesto/opengraph-image",
      ...MODULE_REGISTRY.map((entry) => `/modules/${entry.slug}/opengraph-image`),
    ],
  };

  await mkdir(path.join(process.cwd(), "data"), { recursive: true });
  await writeFile(
    path.join(process.cwd(), "data", "og-manifest.json"),
    `${JSON.stringify(manifest, null, 2)}\n`,
    "utf8",
  );

  console.log(`Prepared OG manifest for ${manifest.routes.length} routes.`);
}

void main();
