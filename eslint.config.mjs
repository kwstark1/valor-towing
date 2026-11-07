// ESLint flat config for Next.js 16 + TypeScript.
// Pinned to ESLint 9: eslint-config-next's React/a11y/import plugins don't support ESLint 10 yet.
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // Unmodified shadcn/ui scaffolding (not used by the live site); left as upstream ships it so `shadcn add` diffs stay clean.
    files: ["components/ui/**", "hooks/use-mobile.ts", "hooks/use-toast.ts"],
    rules: {
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/purity": "off",
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
  globalIgnores([
    ".next/**",
    "node_modules/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Retired designs kept for reference; already has known type errors.
    "archive/**",
  ]),
]);
