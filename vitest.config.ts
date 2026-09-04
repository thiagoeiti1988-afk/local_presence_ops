import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: [
      "packages/*/src/**/*.test.ts",
      "apps/*/lib/**/*.test.ts",
      "apps/*/components/**/*.test.ts",
      "supabase/**/*.test.ts",
    ],
    environment: "node",
  },
});
