import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@app": path.resolve(__dirname, "src/app"),
      "@modules": path.resolve(__dirname, "src/modules"),
      "@components": path.resolve(__dirname, "src/components"),
      "@sketches": path.resolve(__dirname, "src/sketches"),
      "@lib": path.resolve(__dirname, "src/lib"),
      "@hooks": path.resolve(__dirname, "src/hooks"),
      "@content": path.resolve(__dirname, "src/content"),
      "@styles": path.resolve(__dirname, "src/styles"),
      "@types": path.resolve(__dirname, "src/types"),
    },
  },
  test: {
    include: ["tests/unit/**/*.test.ts"],
    exclude: ["node_modules", "dist", ".next", "tests/e2e/**"],
    environment: "node",
    reporters: ["default"],
    coverage: {
      provider: "v8",
      include: ["src/modules/**/lib/**/*.ts", "src/sketches/lib/**/*.ts"],
    },
  },
});
