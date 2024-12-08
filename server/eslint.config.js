import pluginJs from '@eslint/js'
import baseConfig from '@hono/eslint-config'
import tsParser from '@typescript-eslint/parser'
import nodePlugin from 'eslint-plugin-n'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import promisePlugin from 'eslint-plugin-promise'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import sonarPlugin from 'eslint-plugin-sonarjs'
import eslintPluginUnicorn from 'eslint-plugin-unicorn'
import unusedImports from 'eslint-plugin-unused-imports'
import globals from 'globals'
import tsEslint from 'typescript-eslint'

/** @type {import('eslint').Linter.Config[]} */
export default [
  { ignores: ['node_modules'] },
  { files: ['**/*.{js,mjs,cjs,ts}'] },
  {
    languageOptions: {
      parser: tsParser,
      globals: globals.node,
      ecmaVersion: 'latest',
      parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
    },
  },
  pluginJs.configs.recommended,
  eslintPluginUnicorn.configs['flat/recommended'],
  ...tsEslint.configs.recommended,
  ...baseConfig,
  {
    rules: {
      'no-unused-vars': 'off',
      'no-shadow': 'warn',
      'import-x/order': 'off',
      '@typescript-eslint/no-shadow': 'error',
      '@typescript-eslint/no-use-before-define': 'warn',
    },
  }, // tslint-recommended
  {
    plugins: {
      n: nodePlugin,
    },
    rules: {
      // Node.js specific rules
      'n/no-process-env': 'error',
      'n/no-process-exit': 'error',
      'n/no-path-concat': 'error',
      'n/no-unsupported-features/node-builtins': 'error',
      'n/prefer-global/buffer': 'error',
      'n/prefer-global/console': 'error',
    },
  }, // eslint-plugin-n
  {
    plugins: {
      promise: promisePlugin,
    },
    rules: {
      // Comprehensive Promise Rules
      'promise/always-return': 'error',
      'promise/catch-or-return': [
        'error',
        {
          allowFinally: true,
          terminationMethod: ['catch', 'finally'],
        },
      ],

      // Error Handling
      'promise/no-nesting': 'error',
      'promise/no-return-wrap': 'error',

      // Performance Optimization
      'promise/prefer-await-to-then': 'warn',
      'promise/prefer-await-to-callbacks': 'warn',

      // Strict Checks
      'promise/no-multiple-resolved': 'error',
      'promise/valid-params': 'error',
    },
  }, // eslint-plugin-promise
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
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
    },
  }, // simple-import-sort configuration
  {
    ...eslintPluginPrettierRecommended,
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
      'n/no-process-exit': 'off',
      'prettier/prettier': [
        'warn',
        {
          usePrettierrc: true,
        },
      ],
    },
  }, // prettier configuration
  {
    rules: {
      'unicorn/better-regex': 'warn',
      'unicorn/no-null': 'off',
      'unicorn/prevent-abbreviations': 'warn',
      'unicorn/filename-case': [
        'error',
        {
          case: 'kebabCase',
          ignore: ['README.md'],
        },
      ],
    },
  }, // unicorn configuration
  {
    plugins: {
      sonarjs: sonarPlugin,
    },
    rules: {
      // Comprehensive Code Quality Rules
      'sonarjs/cognitive-complexity': ['warn', 10],

      // Duplication Prevention
      'sonarjs/no-duplicate-string': ['warn'],

      // Logical Checks
      'sonarjs/no-all-duplicated-branches': 'error',
      'sonarjs/no-identical-expressions': 'error',

      // Performance and Readability
      'sonarjs/prefer-immediate-return': 'warn',
      'sonarjs/no-nested-template-literals': 'warn',
    },
  }, // eslint-plugin-sonarjs
]
