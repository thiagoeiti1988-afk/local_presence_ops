// Type-aware lint tier, deliberately kept OUT of eslint.config.mjs — see
// docs/prompts/08-eslint-quality-gates-install.md in the vibe-coding-toolkit
// this was copied from. Building a full TypeScript program per package is
// slow enough to make people skip it if it were part of the fast `lint`
// script or a pre-commit hook, so it gets its own script (`lint:types`)
// instead.
import defaultConfig from "./eslint.config.mjs";

export default [
  ...defaultConfig,
  {
    files: ["packages/*/src/**/*.ts", "apps/*/**/*.{ts,tsx}"],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // Every rule here starts at "warn" — none has a known violation count
      // on this codebase yet, so none gets to fail a build sight unseen.
      // Promote to "error" per rule once its count is zero.
      "@typescript-eslint/no-floating-promises": "warn",
      "@typescript-eslint/no-misused-promises": "warn",
      "@typescript-eslint/no-unsafe-assignment": "warn",
      "@typescript-eslint/no-unsafe-member-access": "warn",
      "@typescript-eslint/no-unsafe-call": "warn",
      "@typescript-eslint/no-unsafe-return": "warn",
      "@typescript-eslint/no-unsafe-argument": "warn",
      "@typescript-eslint/only-throw-error": "warn",
      "@typescript-eslint/return-await": ["warn", "in-try-catch"],
      "@typescript-eslint/await-thenable": "warn",
      "@typescript-eslint/unbound-method": "warn",
      "@typescript-eslint/restrict-template-expressions": "warn",
      "@typescript-eslint/restrict-plus-operands": "warn",
      "@typescript-eslint/require-await": "warn",
    },
  },
];
