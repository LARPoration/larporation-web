/** Same-site timeline data. This is not a deployment or backup manifest. */
export type RegionState =
  | { kind: 'text'; text: string }
  | { kind: 'revision'; revision: string }
  | { kind: 'hidden' }
export interface TimelineCredit {
  id: string
  label: string
  authors: string[]
  approvedBy?: string
  evidence: string[]
}
export interface Release {
  id: string
  label: string
  publishedAt: string
  summary: string
  routes: string[]
  regions: Record<string, RegionState>
  credits: TimelineCredit[]
}
export interface Timeline {
  schemaVersion: 2
  entries: Release[]
}
function object(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value))
    throw new Error('Expected an object')
  return value as Record<string, unknown>
}
function text(value: unknown, max = 2000): string {
  if (typeof value !== 'string' || !value.trim() || value.length > max)
    throw new Error('Invalid text')
  return value
}
export function isRoute(value: unknown): value is string {
  return (
    typeof value === 'string' &&
    /^\/(?:[a-z0-9-]+(?:\/[a-z0-9-]+)*)?$/.test(value)
  )
}
export function parseTimeline(
  value: unknown,
  revisionIds: readonly string[] = [],
): Timeline {
  const data = object(value)
  if (
    data.schemaVersion !== 2 ||
    !Array.isArray(data.entries) ||
    data.entries.length > 1000
  )
    throw new Error('Unsupported timeline')
  const ids = new Set<string>()
  let lastDate = ''
  const entries = data.entries.map((value) => {
    const item = object(value),
      id = text(item.id, 80),
      publishedAt = text(item.publishedAt)
    if (id === 'current' || !/^[a-z0-9][a-z0-9.-]*$/.test(id) || ids.has(id))
      throw new Error('Invalid or duplicate release ID')
    ids.add(id)
    if (
      !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(publishedAt) ||
      !Number.isFinite(Date.parse(publishedAt)) ||
      new Date(publishedAt).toISOString().replace('.000Z', 'Z') !==
        publishedAt ||
      publishedAt <= lastDate
    )
      throw new Error('Release dates must be valid and strictly chronological')
    lastDate = publishedAt
    if (
      !Array.isArray(item.routes) ||
      !item.routes.includes('/') ||
      !item.routes.every(isRoute) ||
      new Set(item.routes).size !== item.routes.length
    )
      throw new Error('Invalid routes')
    const regions: Record<string, RegionState> = Object.create(null)
    for (const [key, value] of Object.entries(object(item.regions))) {
      if (!/^[a-z][a-z0-9.-]*$/.test(key) || key === '__proto__')
        throw new Error('Invalid region ID')
      const state = object(value)
      if (state.kind === 'hidden') regions[key] = { kind: 'hidden' }
      else if (state.kind === 'text')
        regions[key] = { kind: 'text', text: text(state.text, 20000) }
      else if (
        state.kind === 'revision' &&
        revisionIds.includes(String(state.revision))
      )
        regions[key] = { kind: 'revision', revision: String(state.revision) }
      else throw new Error('Unknown region state or unregistered revision')
    }
    if (!Object.keys(regions).length) throw new Error('Missing region states')
    if (!Array.isArray(item.credits)) throw new Error('Missing credits')
    const creditIds = new Set<string>()
    const credits = item.credits.map((value) => {
      const credit = object(value),
        id = text(credit.id, 120)
      if (
        creditIds.has(id) ||
        !Array.isArray(credit.authors) ||
        !Array.isArray(credit.evidence)
      )
        throw new Error('Invalid credits')
      creditIds.add(id)
      return {
        id,
        label: text(credit.label),
        authors: credit.authors.map((v) => text(v)),
        ...(credit.approvedBy ? { approvedBy: text(credit.approvedBy) } : {}),
        evidence: credit.evidence.map((v) => {
          const url = text(v)
          if (new URL(url).protocol !== 'https:')
            throw new Error('Invalid evidence URL')
          return url
        }),
      }
    })
    return {
      id,
      label: text(item.label, 100),
      publishedAt,
      summary: text(item.summary),
      routes: item.routes as string[],
      regions,
      credits,
    }
  })
  return { schemaVersion: 2, entries }
}
export function timelinePosition(value: number, count: number) {
  const position = Math.max(
    0,
    Math.min(count, Number.isFinite(value) ? value : count),
  )
  return {
    position,
    from: Math.floor(position),
    to: Math.ceil(position),
    progress: position % 1,
    selected: Math.round(position),
  }
}
export function displayDate(date: string) {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(date))
}
