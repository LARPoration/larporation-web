import { defineConfig } from '@playwright/test'
import base from './playwright.config'

export default defineConfig({
  ...base,
  testDir: './tests',
  testMatch: ['e2e/**/*.spec.ts', 'pages/**/*.spec.ts'],
  webServer: {
    command: 'node scripts/pages/serve.ts 3100',
    url: 'http://127.0.0.1:3100',
    reuseExistingServer: false,
    timeout: 30_000,
  },
})
