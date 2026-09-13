import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  // Ignore generated/non-source directories
  globalIgnores(['dist', 'prompts/**', 'scripts/**', 'node_modules/**']),

  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      // Templates intentionally use `any` for flexibility with dynamic component props.
      // Keeping as a warning so we're aware but it won't block CI.
      '@typescript-eslint/no-explicit-any': 'warn',

      // Template files export both components and helper constants by design.
      // React Fast Refresh only applies in dev — not a production concern.
      'react-refresh/only-export-components': 'warn',

      // Keep these as errors — they are real bugs:
      // 'react-hooks/rules-of-hooks' stays as error (default from preset)
      // 'react-hooks/exhaustive-deps' stays as warning (default from preset)

      // Downgrade other noisy-but-safe rules to warnings
      '@typescript-eslint/ban-ts-comment': 'warn',
      'no-case-declarations': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    },
  },
])
