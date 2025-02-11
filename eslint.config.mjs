import globals from "globals";
import pluginJs from "@eslint/js";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    // enabling variables for specific enviroments
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.jest,
        ...globals.node,
        ...globals.es2022
      },
      // using ES modules instead CommonJS (import/export)
      sourceType: "module"
    },
    // apply ESlint for all files 
    files: ["**/*.js"],
    ignores: ["node_modules/**", "coverage/**", "dist/**"]
  },
  // plugin for rules 
  pluginJs.configs.recommended,
];