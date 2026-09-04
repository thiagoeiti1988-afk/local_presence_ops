// @ts-check
import { defineConfig, globalIgnores } from "eslint/config";
import js from "@eslint/js";
import tseslint from "typescript-eslint";

import quality from "./eslint-rules/index.cjs";

export default defineConfig([
  globalIgnores([
    "**/node_modules/**",
    "**/dist/**",
    "**/.next/**",
    "**/out/**",
    "**/coverage/**",
    "**/next-env.d.ts",
    "**/*.tsbuildinfo",
  ]),
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      globals: {
        console: "readonly",
        process: "readonly",
        fetch: "readonly",
        URL: "readonly",
        crypto: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
  // Quality gates from vibe-coding-toolkit (docs/prompts/08). This is a
  // monorepo, not a single src/ tree, so `files` covers every package/app
  // instead of the toolkit example's "src/**". No import-x boundary block
  // was carried over: this project has no established repository/service
  // layering yet, and inventing one just to have something for the linter
  // to enforce would be exactly the kind of speculative abstraction the
  // toolkit's own docs warn against (docs/prompts/09-file-size-refactor.md).
  {
    files: ["**/*.{js,jsx,ts,tsx,mjs,cjs}"],
    plugins: { quality },
    rules: {
      "quality/max-lines": ["error", { max: 350 }],
      // quality/no-direct-data-access is NOT installed: this project has no
      // concrete database client module yet (packages/providers only
      // exposes the abstract ManualDataStore interface — see
      // docs/GOOGLE_API.md and docs/ARCHITECTURE.md). Adding a boundary rule
      // with no real "from" module to guard would just be dead config.
      "quality/no-direct-console": [
        "error",
        { logger: "a structured logger (none exists yet — see below)" },
      ],
    },
  },
  {
    // scripts/demo.ts is a CLI entry point whose entire job is printing
    // human-readable output to stdout — it IS the thing a log adapter would
    // wrap, the same reasoning the toolkit example uses to exempt its own
    // src/server/logger.ts. This block must come after the block that turns
    // the rule on, or flat config would silently keep the "error" (see
    // docs/prompts/08's ordering pitfall).
    files: ["scripts/**/*.ts"],
    rules: {
      "quality/no-direct-console": "off",
    },
  },
  {
    // Test files get the same size budget as production code, at "warn"
    // instead of "error" — see docs/prompts/08-eslint-quality-gates-install.md.
    files: [
      "**/*.test.{ts,tsx}",
      "**/{__tests__,__mocks__,fixtures,mocks}/**/*.{ts,tsx}",
    ],
    plugins: { quality },
    rules: {
      "quality/max-lines": ["warn", { max: 350, includeTests: true }],
    },
  },
  {
    files: ["eslint-rules/**/*.cjs"],
    languageOptions: {
      sourceType: "commonjs",
      globals: { module: "readonly", require: "readonly" },
    },
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
]);
