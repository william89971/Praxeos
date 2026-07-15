import { spawnSync } from "node:child_process";
import path from "node:path";

if (!process.env.ANTHROPIC_API_KEY) {
  console.error(
    "Live Guide evaluations require ANTHROPIC_API_KEY. No request was sent.",
  );
  process.exit(1);
}

const vitest = path.join(process.cwd(), "node_modules", "vitest", "vitest.mjs");
const result = spawnSync(
  process.execPath,
  [vitest, "run", "tests/evaluations/guide-live.evaluation.test.ts"],
  {
    stdio: "inherit",
    env: { ...process.env, RUN_LIVE_GUIDE_EVALS: "1" },
  },
);

process.exit(result.status ?? 1);
