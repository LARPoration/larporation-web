import { test } from 'node:test'
import assert from 'node:assert/strict'
import { assets } from '../config/assets.ts'
import { socialProfiles } from '../config/social.ts'
import { contributions, contributors } from '../content/contributions.ts'
import { validateResources } from '../scripts/resource-validation.ts'
const validate = (
  overrides = assets,
  records = contributions,
  socials = socialProfiles,
) => validateResources(process.cwd(), overrides, socials, records, contributors)
test('the shipped resource registry is valid', () =>
  assert.deepEqual(validate(), []))

test('reviewer identities must exist in the contributor registry', () => {
  const records = contributions.map((record) => ({
    ...record,
    reviewedBy: 'missing-reviewer',
  }))
  assert.match(
    validateResources(
      process.cwd(),
      assets,
      socialProfiles,
      records,
      contributors,
    ).join(),
    /Unknown reviewer: missing-reviewer/,
  )
})
test('missing assets fail validation', () => {
  const broken = {
    ...assets,
    cornerstone: { ...assets.cornerstone, path: '/brand/missing.svg' },
  }
  assert.match(
    validateResources(
      process.cwd(),
      broken,
      socialProfiles,
      contributions,
      contributors,
    ).join(),
    /Missing or unsafe asset/,
  )
})
test('broken contribution and social references fail validation', () => {
  assert.match(
    validateResources(process.cwd(), assets, socialProfiles, [], []).join(),
    /Unknown contribution/,
  )
  assert.match(
    validateResources(
      process.cwd(),
      {},
      socialProfiles,
      contributions,
      contributors,
    ).join(),
    /Unknown social asset/,
  )
})
test('duplicate IDs and non-HTTPS destinations fail validation', () => {
  assert.match(
    validateResources(
      process.cwd(),
      assets,
      [{ ...socialProfiles[0], url: 'javascript:alert(1)' }],
      [...contributions, contributions[0]],
      [],
    ).join(),
    /Duplicate contribution ID.*Invalid social URL/,
  )
})
