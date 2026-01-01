// eslint.config.js
const tseslint = require('typescript-eslint');
const globals = require('globals');
const prettierConfig = require('eslint-config-prettier');

module.exports = tseslint.config(
  {
    files: ['src/**/*.ts', 'src/**/*.tsx'],
    extends: [
      ...tseslint.configs.recommended,
      prettierConfig,
    ],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-var-requires": "off",
        "@typescript-eslint/no-unused-vars": "warn",
    }
  }
);
