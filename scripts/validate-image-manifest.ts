import { access, readFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

interface ManifestEntry {
  id: string;
  sourceFile: string;
  placements: string[];
  altText: string;
  creator: string;
  license: string;
  generation: { prompt: string | null; model: string | null; date: string | null };
  provenanceException: string | null;
  derivatives: Array<{ file: string; width: number; height: number }>;
  review: Record<string, boolean>;
}

const root = process.cwd();
const manifestPath = path.join(root, "public", "images", "attribution.json");
const manifest = JSON.parse(await readFile(manifestPath, "utf8")) as {
  version: number;
  entries: ManifestEntry[];
};
const errors: string[] = [];

if (manifest.version !== 1) errors.push("Manifest version must be 1.");
if (!Array.isArray(manifest.entries) || manifest.entries.length === 0)
  errors.push("Manifest must contain at least one entry.");

for (const entry of manifest.entries) {
  if (!entry.id || !entry.creator || !entry.license)
    errors.push(`${entry.id || "unknown"}: creator and license are required.`);
  if (!entry.altText || entry.altText.length < 24)
    errors.push(`${entry.id}: reviewed alt text must be at least 24 characters.`);
  if (!entry.placements.length)
    errors.push(`${entry.id}: at least one placement is required.`);
  if (
    (!entry.generation.prompt || !entry.generation.model || !entry.generation.date) &&
    !entry.provenanceException
  ) {
    errors.push(
      `${entry.id}: generated provenance or an explicit exception is required.`,
    );
  }
  if (Object.values(entry.review).some((value) => value !== true))
    errors.push(`${entry.id}: every visual-review check must be true.`);

  await checkFile(entry.id, entry.sourceFile);
  for (const derivative of entry.derivatives) {
    const localPath = await checkFile(entry.id, derivative.file);
    if (!localPath) continue;
    const metadata = await sharp(localPath).metadata();
    if (metadata.width !== derivative.width || metadata.height !== derivative.height) {
      errors.push(
        `${entry.id}: ${derivative.file} is ${metadata.width}x${metadata.height}, expected ${derivative.width}x${derivative.height}.`,
      );
    }
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(`Validated ${manifest.entries.length} image records and all derivatives.`);

async function checkFile(id: string, publicPath: string) {
  const localPath = path.join(root, "public", publicPath.replace(/^\//, ""));
  try {
    await access(localPath);
    return localPath;
  } catch {
    errors.push(`${id}: missing ${publicPath}.`);
    return null;
  }
}
