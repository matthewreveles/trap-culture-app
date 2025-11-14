// eslint.config.mjs
import next from "eslint-plugin-next";
import globals from "globals";

export default [
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      globals: globals.browser
    },
    plugins: {
      next
    },
    rules: {
      "@next/next/no-html-link-for-pages": "off",
      "@next/next/no-img-element": "off"
    }
  }
];
