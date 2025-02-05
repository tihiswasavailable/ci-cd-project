import globals from "globals";
import pluginJs from "@eslint/js";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.jest,
        ...globals.node,
        ...globals.es2022
      },
      sourceType: "module"
    },
    files: ["**/*.js"],
    ignores: ["node_modules/**", "coverage/**", "dist/**"]
  },
  pluginJs.configs.recommended,
];