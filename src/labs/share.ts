import {
  LAB_SLUGS,
  type LabMode,
  type LabSlug,
  type ShareEnvelope,
  isLabSlug,
} from "./types";

const MAX_ENCODED_LENGTH = 1800;
const MAX_ACTIONS = 40;
const MAX_ASSUMPTIONS = 16;
const SAFE_ID = /^[a-z0-9][a-z0-9-]{0,63}$/;

export type ShareDecodeResult =
  | { ok: true; envelope: ShareEnvelope }
  | { ok: false; reason: "oversized" | "malformed" | "unknown-version" | "cross-lab" };

export function encodeShareEnvelope(envelope: ShareEnvelope): string {
  const normalized: ShareEnvelope = {
    version: 1,
    labSlug: envelope.labSlug,
    seed: normalizeId(envelope.seed, "praxeos"),
    mode: normalizeMode(envelope.mode),
    assumptionIds: normalizeIds(envelope.assumptionIds, MAX_ASSUMPTIONS),
    actionIds: normalizeIds(envelope.actionIds, MAX_ACTIONS),
  };
  return toBase64Url(JSON.stringify(normalized));
}

export function decodeShareEnvelope(
  encoded: string,
  expectedLab?: LabSlug,
): ShareDecodeResult {
  if (encoded.length > MAX_ENCODED_LENGTH) return { ok: false, reason: "oversized" };
  try {
    const raw = JSON.parse(fromBase64Url(encoded)) as Record<string, unknown>;
    if (raw.version !== 1) return { ok: false, reason: "unknown-version" };
    if (!isLabSlug(raw.labSlug) || !LAB_SLUGS.includes(raw.labSlug)) {
      return { ok: false, reason: "malformed" };
    }
    if (expectedLab && raw.labSlug !== expectedLab) {
      return { ok: false, reason: "cross-lab" };
    }
    if (
      typeof raw.seed !== "string" ||
      !SAFE_ID.test(raw.seed) ||
      (raw.mode !== "guided" && raw.mode !== "explore") ||
      !validIds(raw.assumptionIds, MAX_ASSUMPTIONS) ||
      !validIds(raw.actionIds, MAX_ACTIONS)
    ) {
      return { ok: false, reason: "malformed" };
    }
    return {
      ok: true,
      envelope: {
        version: 1,
        labSlug: raw.labSlug,
        seed: raw.seed,
        mode: raw.mode,
        assumptionIds: raw.assumptionIds,
        actionIds: raw.actionIds,
      },
    };
  } catch {
    return { ok: false, reason: "malformed" };
  }
}

function normalizeMode(mode: LabMode): LabMode {
  return mode === "explore" ? "explore" : "guided";
}

function normalizeId(value: string, fallback: string): string {
  const normalized = value
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "")
    .slice(0, 64);
  return normalized || fallback;
}

function normalizeIds(values: readonly string[], limit: number): string[] {
  return [
    ...new Set(values.map((value) => normalizeId(value, "")).filter(Boolean)),
  ].slice(0, limit);
}

function validIds(value: unknown, limit: number): value is string[] {
  return (
    Array.isArray(value) &&
    value.length <= limit &&
    value.every((item) => typeof item === "string" && SAFE_ID.test(item))
  );
}

function toBase64Url(value: string): string {
  const encoded =
    typeof Buffer !== "undefined"
      ? Buffer.from(value, "utf8").toString("base64")
      : btoa(unescape(encodeURIComponent(value)));
  return encoded.replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

function fromBase64Url(value: string): string {
  const padded = value
    .replaceAll("-", "+")
    .replaceAll("_", "/")
    .padEnd(Math.ceil(value.length / 4) * 4, "=");
  return typeof Buffer !== "undefined"
    ? Buffer.from(padded, "base64").toString("utf8")
    : decodeURIComponent(escape(atob(padded)));
}
