import { readFileSync } from 'node:fs'
import { parseTimeline } from '../lib/history/contracts.ts'
import { revisionIds } from '../content/history/revision-ids.ts'
const timeline = parseTimeline(
  JSON.parse(readFileSync('public/history/timeline.json', 'utf8')),
  revisionIds,
)
console.log(
  `Validated integrated timeline: ${timeline.entries.length} earlier releases.`,
)
