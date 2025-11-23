import nextPlugin from "@next/eslint-plugin-next";
import reactHooks from "eslint-plugin-react-hooks";
import * as tseslint from "typescript-eslint";

const nextRules = nextPlugin.configs["core-web-vitals"].rules;

export default [
  {
    ignores: ["node_modules", ".next", "dist", "build"],
  },
  tseslint.configs.base,
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      "@next/next": nextPlugin,
      "react-hooks": reactHooks,
    },
    rules: {
      ...nextRules,
      ...reactHooks.configs.recommended.rules,
      "react-hooks/exhaustive-deps": "off",
      "react-hooks/set-state-in-effect": "off",
      "@next/next/no-img-element": "off",
    },
  },
];
