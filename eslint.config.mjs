import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import tseslint from "@typescript-eslint/eslint-plugin";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [

  {
    ignores: [".next/**", "node_modules/**", "dist/**"],
  },

  ...compat.extends(
    "eslint-config-next/core-web-vitals",
    "eslint-config-next",
    "prettier"
  ),

  {
    plugins: {
      "@typescript-eslint": tseslint,
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "react/no-unescaped-entities": "off",
    },
  },
];
