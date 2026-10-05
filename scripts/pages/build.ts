import { spawnSync } from 'node:child_process'
import { existsSync, copyFileSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'

const result = spawnSync(
  process.execPath,
  ['node_modules/next/dist/bin/next', 'build'],
  {
    stdio: 'inherit',
    env: {
      ...process.env,
      NEXT_PUBLIC_BUILD_MODE: 'pages',
      NEXT_TELEMETRY_DISABLED: '1',
    },
  },
)
if (result.status !== 0) process.exit(result.status ?? 1)

// Refuse output containing private configuration or source material.
for (const name of [
  '_archive',
  'source',
  '.env',
  'package.json',
  'package-lock.json',
]) {
  if (existsSync(resolve('out', name)))
    throw new Error(`Unsafe Pages output: ${name}`)
}
if (!existsSync('out/404.html')) throw new Error('Missing static 404 page')
for (const name of readdirSync('config/pages')) {
  copyFileSync(resolve('config/pages', name), resolve('out', name))
}
console.log('Live Pages export ready in out/. Nothing deployed.')
