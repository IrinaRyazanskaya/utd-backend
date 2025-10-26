import js from "@eslint/js";
import ts from "typescript-eslint";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    ignores: ["dist/**"],
  },
  {
    files: ["**/*.{js,cjs,mjs}"],
    extends: [js.configs.recommended],
    languageOptions: {
      globals: globals.node,
    },
  },
  {
    files: ["**/*.ts"],
    extends: [...ts.configs.recommended],
    languageOptions: {
      parser: ts.parser,
      sourceType: "module",
      globals: globals.node,
    },
  },
]);
