import { assets } from '../config/assets.ts'
import { readFileSync } from 'node:fs'
import { site } from '../config/site.ts'
import { socialProfiles } from '../config/social.ts'
import { contributions, contributors } from '../content/contributions.ts'
import { validateResources } from './resource-validation.ts'
const errors = validateResources(
  process.cwd(),
  assets,
  socialProfiles,
  contributions,
  contributors,
)
const pkg = JSON.parse(readFileSync('package.json', 'utf8'))
const lock = JSON.parse(readFileSync('package-lock.json', 'utf8'))
if (
  pkg.version !== site.version ||
  lock.version !== site.version ||
  lock.packages[''].version !== site.version
)
  errors.push('Public, package and lockfile release versions must match')
if (errors.length) throw new Error(errors.join('\n'))
console.log(
  `Validated ${Object.keys(assets).length} assets and contribution references.`,
)
