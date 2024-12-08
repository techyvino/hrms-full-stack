import pluginJs from '@eslint/js'
import baseConfig from '@hono/eslint-config'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import unusedImports from 'eslint-plugin-unused-imports'
import globals from 'globals'
import tsEslint from 'typescript-eslint'

/** @type {import('eslint').Linter.Config[]} */
export default [
  { ignores: ['node_modules'] },
  { files: ['**/*.{js,mjs,cjs,ts}'] },
  {
    languageOptions: {
      globals: globals.node,
      ecmaVersion: 'latest',
      parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
    },
  },
  pluginJs.configs.recommended,
  ...tsEslint.configs.recommended,
  ...baseConfig,
  {
    rules: {
      'no-unused-vars': 'off',
      'no-shadow': 'warn',
      '@typescript-eslint/no-shadow': 'error',
      '@typescript-eslint/no-use-before-define': 'warn',
    },
  },
  {
    plugins: {
      'unused-imports': unusedImports,
    },
    rules: {
      'no-unused-vars': 'off', // or "@typescript-eslint/no-unused-vars": "off",
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
    },
  }, // unused-imports plugin
  {
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'simple-import-sort/imports': 'warn',
      'simple-import-sort/exports': 'warn',
    },
  }, // sort import
  {
    ...eslintPluginPrettierRecommended,
    rules: {
      'no-console': 'warn',
      'prettier/prettier': [
        'warn',
        {
          usePrettierrc: true,
        },
      ],
    },
  },
]
