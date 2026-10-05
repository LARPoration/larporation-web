import { defineConfig, globalIgnores } from 'eslint/config'
import js from '@eslint/js'
import next from '@next/eslint-plugin-next'
import reactHooks from 'eslint-plugin-react-hooks'
import tseslint from 'typescript-eslint'
import prettier from 'eslint-config-prettier/flat'

export default defineConfig([
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: { '@next/next': next, 'react-hooks': reactHooks },
    rules: {
      ...next.configs.recommended.rules,
      ...next.configs['core-web-vitals'].rules,
      ...reactHooks.configs.flat.recommended.rules,
    },
  },
  prettier,
  globalIgnores([
    '.next/**',
    'out/**',
    '.archive/**',
    '.venv/**',
    'playwright-report/**',
    'test-results/**',
    'coverage/**',
    'next-env.d.ts',
  ]),
])
