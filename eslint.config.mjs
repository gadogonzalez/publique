// Flat ESLint config composed directly from each plugin's native flat
// export. eslint-config-next's bundled legacy configs (consumed via
// @eslint/eslintrc's FlatCompat) currently crash on this dependency
// combination (circular structure in eslint-plugin-react's flat/legacy
// interop) -- tracked upstream. Using the same underlying plugins
// (@next/eslint-plugin-next, typescript-eslint, eslint-plugin-react-hooks)
// directly avoids the shim and gives the same practical coverage.
import nextPlugin from "@next/eslint-plugin-next";
import reactHooks from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";

export default [
  { ignores: [".next/**", "node_modules/**"] },
  ...tseslint.configs.recommended,
  reactHooks.configs.flat.recommended,
  {
    plugins: { "@next/next": nextPlugin },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
    },
  },
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
];
