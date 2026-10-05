import { test } from 'node:test'
import assert from 'node:assert/strict'
import { parseTimeline, timelinePosition } from '../lib/history/contracts.ts'
const release = {
  id: 'test-one',
  label: 'Test one',
  publishedAt: '2026-10-01T00:00:00Z',
  summary: 'Fixture only',
  routes: ['/'],
  regions: { 'home.hero': { kind: 'text', text: 'Earlier copy' } },
  credits: [
    {
      id: 'home.hero',
      label: 'Earlier hero',
      authors: ['Earlier author'],
      evidence: [],
    },
  ],
}
const data = (entries: unknown[] = [release]) => ({ schemaVersion: 2, entries })
test('accepts an empty first chapter and chronological local content', () => {
  assert.equal(parseTimeline(data([])).entries.length, 0)
  assert.deepEqual(parseTimeline(data()).entries[0].regions['home.hero'], {
    kind: 'text',
    text: 'Earlier copy',
  })
})
test('rejects incompatible schemas, duplicate IDs and invalid chronology', () => {
  for (const value of [
    { schemaVersion: 1, entries: [] },
    data([release, release]),
    data([{ ...release, publishedAt: '2026-02-30T00:00:00Z' }]),
    data([
      release,
      { ...release, id: 'two', publishedAt: '2026-09-01T00:00:00Z' },
    ]),
  ])
    assert.throws(() => parseTimeline(value))
})
test('rich revisions must be registered locally; text is plain data', () => {
  const value = data([
    {
      ...release,
      regions: { hero: { kind: 'revision', revision: 'hero-v1' } },
    },
  ])
  assert.throws(() => parseTimeline(value))
  assert.equal(parseTimeline(value, ['hero-v1']).entries.length, 1)
  assert.throws(() =>
    parseTimeline(
      data([
        {
          ...release,
          regions: { hero: { kind: 'html', html: '<script>bad</script>' } },
        },
      ]),
    ),
  )
})
test('rejects external routes, empty region maps and executable evidence links', () => {
  assert.throws(() =>
    parseTimeline(data([{ ...release, routes: ['/', 'https://example.com'] }])),
  )
  assert.throws(() => parseTimeline(data([{ ...release, regions: {} }])))
  assert.throws(() =>
    parseTimeline(
      data([
        {
          ...release,
          credits: [
            { ...release.credits[0], evidence: ['javascript:alert(1)'] },
          ],
        },
      ]),
    ),
  )
})
test('fractional position resolves both adjacent states without debounce', () => {
  assert.deepEqual(timelinePosition(0.25, 2), {
    position: 0.25,
    from: 0,
    to: 1,
    progress: 0.25,
    selected: 0,
  })
  assert.equal(timelinePosition(0.75, 2).selected, 1)
  assert.equal(timelinePosition(-8, 2).position, 0)
  assert.equal(timelinePosition(99, 2).position, 2)
  assert.equal(timelinePosition(NaN, 2).position, 2)
})
