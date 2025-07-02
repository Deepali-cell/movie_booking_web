import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

// Extend Next.js core and TypeScript recommended configs
const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  // Custom rule overrides
  {
    rules: {
      // Allow explicit "any"
      "@typescript-eslint/no-explicit-any": "off",
      // Temporarily allow unused variables
      "@typescript-eslint/no-unused-vars": "off",
      // Downgrade missing dependency warnings to warning level
      "react-hooks/exhaustive-deps": "warn",
      // Allow unescaped entities in JSX
      "react/no-unescaped-entities": "off",
      // Allow <img> usage
      "@next/next/no-img-element": "off",
    },
  },
];

export default eslintConfig;
