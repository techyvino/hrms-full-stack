import { FlatCompat } from '@eslint/eslintrc'

const compat = new FlatCompat({
  // import.meta.dirname is available after Node.js v20.11.0
  baseDirectory: import.meta.dirname,
})
const eslintConfig = [
  ...compat.config({
    extends: [
      'next/core-web-vitals',
      'next/typescript',
      'plugin:react/recommended',
      'plugin:react-hooks/recommended',
      'plugin:prettier/recommended',
      'plugin:jsx-a11y/recommended',
      'plugin:@next/next/recommended',
      'plugin:tailwindcss/recommended',
    ],
    plugins: [
      '@typescript-eslint',
      '@typescript-eslint/eslint-plugin',
      'unused-imports',
      'tailwindcss',
      'simple-import-sort',
      'react',
      'import',
      'jsx-a11y',
      'prettier',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      'tailwindcss/no-custom-classname': ['off'], // Allow custom class names (not restricted to Tailwind)
      'import/no-extraneous-dependencies': 'warn', // Warn about extraneous dependencies in TypeScript files
      'no-param-reassign': 'warn', // Allow parameter reassignment
      'no-empty-pattern': 'warn', // Allow empty destructuring patterns
      'no-use-before-define': 'warn', // Disable "use before define" for all variables and functions
      'no-shadow': 'warn', // Disable shadowed variable rule
      '@typescript-eslint/no-shadow': 'warn', // Disable shadowed variable rule for TypeScript
      '@typescript-eslint/no-use-before-define': 'warn', // Disable "use before define" for TypeScript
      'import/extensions': 'warn', // Disable import extensions requirement (TypeScript handles this)
      'react/destructuring-assignment': 'warn', // Disable mandatory destructuring in React components
      'react/no-unstable-nested-components': 'warn', // Allow unstable nested components (needed by i18n library)
      '@typescript-eslint/consistent-type-imports': 'error', // Enforce consistent usage of `import type`
      'no-restricted-syntax': [
        'error',
        'ForInStatement', // Disallow `for-in` loops
        'LabeledStatement', // Disallow labeled statements
        'WithStatement', // Disallow `with` statements
      ], // Override Airbnb configuration to restrict specific syntax
      'import/prefer-default-export': 'off', // Allow named exports without preferring default exports
      'simple-import-sort/imports': 'error', // Enforce sorted imports
      'simple-import-sort/exports': 'error', // Enforce sorted exports
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }], // Allow console.warn and console.error
      'react/prop-types': 'off',
      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',
      'react-hooks/exhaustive-deps': 'off',
      'jsx-a11y/click-events-have-key-events': 'warn',
      'jsx-a11y/interactive-supports-focus': 'warn',
      'prettier/prettier': 'warn',
      'no-unused-vars': 'off',
      'unused-imports/no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          args: 'after-used',
          ignoreRestSiblings: false,
          argsIgnorePattern: '^_.*?$',
        },
      ],
      'import/order': 'off',
      'react/self-closing-comp': 'warn',
      'react/jsx-sort-props': [
        'warn',
        {
          callbacksLast: true,
          shorthandFirst: true,
          noSortAlphabetically: false,
          reservedFirst: true,
        },
      ],
      'padding-line-between-statements': [
        'warn',
        { blankLine: 'always', prev: '*', next: 'return' },
        { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
        {
          blankLine: 'any',
          prev: ['const', 'let', 'var'],
          next: ['const', 'let', 'var'],
        },
      ],
    },
    overrides: [
      {
        files: ['app/**/*.{js,ts,tsx}'],
        parser: '@typescript-eslint/parser',
        plugins: ['@typescript-eslint'],
      },
    ],
  }),
]

export default eslintConfig
