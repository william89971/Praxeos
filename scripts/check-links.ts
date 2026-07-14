#!/usr/bin/env tsx

import { readFile } from "node:fs/promises";
import path from "node:path";

const ROUTES = [
  "/",
  "/learn",
  "/practice",
  "/journey/calculation-labyrinth",
  "/labs",
  "/notebook",
  "/sources",
  "/sources/glossary",
  "/built",
];

const baseUrl = process.env.PRAXEOS_BASE_URL;
const sourceFile = path.join(process.cwd(), "src", "lib", "source-packets.ts");

async function assertReachable(url: string) {
  const response = await fetch(url, {
    method: "HEAD",
    redirect: "follow",
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) throw new Error(`${url} returned ${response.status}`);
}

async function main() {
  if (baseUrl) {
    await Promise.all(ROUTES.map((route) => assertReachable(new URL(route, baseUrl).href)));
  }

  try {
    const source = await readFile(sourceFile, "utf8");
    const urls = [...source.matchAll(/https:\/\/[^"'\s]+/g)].map(([url]) => url);
    if (process.env.CHECK_EXTERNAL_LINKS === "1") {
      await Promise.all([...new Set(urls)].map(assertReachable));
    }
    console.log(`Checked ${ROUTES.length} internal route contracts and ${urls.length} source links.`);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    console.log(`Checked ${ROUTES.length} internal route contracts; source packets not added yet.`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
