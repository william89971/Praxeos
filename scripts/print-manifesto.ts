import { type ChildProcess, spawn } from "node:child_process";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

async function waitForServer(url: string, timeoutMs: number) {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {}

    await new Promise((resolve) => setTimeout(resolve, 1_000));
  }

  throw new Error(`Timed out waiting for ${url}`);
}

async function main() {
  const port = Number(process.env.PORT ?? 3712);
  const externalBaseUrl = process.env.PLAYWRIGHT_BASE_URL;
  const baseURL = externalBaseUrl ?? `http://127.0.0.1:${port}`;
  const outputDir = path.join(process.cwd(), "public", "press");
  const outputFile = path.join(outputDir, "manifesto.pdf");
  const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
  let server: ChildProcess | null = null;

  await mkdir(outputDir, { recursive: true });

  try {
    if (!externalBaseUrl) {
      server = spawn(
        npmCommand,
        ["run", "dev", "--", "--hostname", "127.0.0.1", "--port", String(port)],
        {
          stdio: "inherit",
          env: process.env,
        },
      );

      await waitForServer(baseURL, 120_000);
    }

    const browser = await chromium.launch();
    const page = await browser.newPage({
      viewport: {
        width: 1280,
        height: 1600,
      },
    });

    await page.goto(`${baseURL}/manifesto-print`, { waitUntil: "networkidle" });
    await page.emulateMedia({ media: "print" });
    await page.pdf({
      path: outputFile,
      format: "A4",
      printBackground: true,
      margin: {
        top: "18mm",
        right: "18mm",
        bottom: "22mm",
        left: "18mm",
      },
    });

    await browser.close();
    console.log(`Wrote ${outputFile}`);
  } finally {
    server?.kill("SIGTERM");
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
