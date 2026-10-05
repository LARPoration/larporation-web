import { existsSync, readFileSync } from 'node:fs'
import { resolve, sep } from 'node:path'
import type { Asset } from '../config/assets.ts'
import type { SocialProfile } from '../config/social.ts'
import type { Contribution, Contributor } from '../content/contributions.ts'
export function validateResources(
  root: string,
  assets: Record<string, Asset>,
  socials: readonly SocialProfile[],
  records: readonly Contribution[],
  people: readonly Contributor[],
) {
  const errors: string[] = []
  function unique(ids: string[], label: string) {
    if (new Set(ids).size !== ids.length) errors.push(`Duplicate ${label} ID`)
  }
  unique(
    records.map((r) => r.id),
    'contribution',
  )
  unique(
    people.map((p) => p.id),
    'contributor',
  )
  unique(
    socials.map((s) => s.id),
    'social',
  )
  const recordIds = new Set(records.map((r) => r.id))
  const peopleIds = new Set(people.map((p) => p.id))
  const https = (value: string) => {
    try {
      return new URL(value).protocol === 'https:'
    } catch {
      return false
    }
  }
  for (const record of records) {
    if (record.reviewedBy && !peopleIds.has(record.reviewedBy))
      errors.push(`Unknown reviewer: ${record.reviewedBy}`)
    for (const person of record.contributors)
      if (!peopleIds.has(person.contributorId))
        errors.push(`Unknown contributor: ${person.contributorId}`)
    for (const evidence of record.evidence)
      if (!https(evidence.url))
        errors.push(`Invalid evidence URL: ${record.id}`)
  }
  for (const person of people)
    if (person.profileUrl && !https(person.profileUrl))
      errors.push(`Invalid profile URL: ${person.id}`)
  const publicRoot = resolve(root, 'public')
  for (const [id, asset] of Object.entries(assets)) {
    if (!recordIds.has(asset.contributionId))
      errors.push(`Unknown contribution: ${id}`)
    if (!(asset.width > 0 && asset.height > 0))
      errors.push(`Invalid dimensions: ${id}`)
    const path = resolve(publicRoot, asset.path.slice(1))
    if (
      !asset.path.startsWith('/') ||
      !path.startsWith(publicRoot + sep) ||
      !existsSync(path)
    ) {
      errors.push(`Missing or unsafe asset: ${id}`)
      continue
    }
    const svg = readFileSync(path, 'utf8')
    if (
      !svg.startsWith('<svg') ||
      /<(?!\/?(?:svg|path)\b)|\bon\w+\s*=|href\s*=|url\s*\(|<!/i.test(svg)
    )
      errors.push(`Unsafe SVG: ${id}`)
    const provenance = resolve(root, asset.provenance.split('#')[0])
    if (!provenance.startsWith(resolve(root) + sep) || !existsSync(provenance))
      errors.push(`Missing provenance: ${id}`)
  }
  for (const social of socials) {
    if (!(social.assetId in assets))
      errors.push(`Unknown social asset: ${social.id}`)
    if (social.url !== null && !https(social.url))
      errors.push(`Invalid social URL: ${social.id}`)
  }
  return errors
}
