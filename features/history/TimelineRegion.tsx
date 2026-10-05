'use client'
import { type HTMLAttributes, type ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import {
  timelinePosition,
  displayDate,
  type RegionState,
} from '../../lib/history/contracts'
import { revisions } from '../../content/history/revisions'
import { useTimeline } from './TimelineContext'
import styles from './history.module.css'

/** Stable IDs connect current regions to earlier data or local React revisions. */
export function TimelineRegion({
  region,
  as: Tag = 'div',
  children,
  ...props
}: HTMLAttributes<HTMLElement> & {
  region: string
  as?:
    | 'div'
    | 'section'
    | 'article'
    | 'aside'
    | 'header'
    | 'footer'
    | 'h1'
    | 'h2'
    | 'p'
    | 'span'
  children: ReactNode
}) {
  const { entries, position } = useTimeline()
  const { from, to, progress } = timelinePosition(position, entries.length)
  const resolve = (index: number): RegionState | undefined =>
    entries[index]
      ? (entries[index].regions[region] ?? { kind: 'hidden' })
      : undefined
  const before = resolve(from),
    after = resolve(to)
  const render = (state: RegionState | undefined): ReactNode => {
    if (!state) return children
    if (state.kind === 'hidden') return null
    if (state.kind === 'text') return state.text
    const Revision = revisions[state.revision]
    return Revision ? <Revision /> : null
  }
  const identical = JSON.stringify(before) === JSON.stringify(after)
  const absent = before?.kind === 'hidden' && after?.kind === 'hidden'
  const Inline = ['h1', 'h2', 'p', 'span'].includes(Tag) ? 'span' : 'div'
  return (
    <Tag
      {...props}
      data-timeline-region={region}
      hidden={absent || props.hidden}
    >
      {identical ? (
        render(before)
      ) : (
        <Inline className={styles.blend}>
          <Inline
            className={styles.layer}
            style={{
              opacity: 1 - progress,
              transform: 'translateY(' + -8 * progress + 'px)',
              pointerEvents: progress >= 0.5 ? 'none' : undefined,
            }}
            inert={progress >= 0.5}
            aria-hidden={progress >= 0.5}
          >
            {render(before)}
          </Inline>
          <Inline
            className={styles.layer}
            style={{
              opacity: progress,
              transform: 'translateY(' + 8 * (1 - progress) + 'px)',
              pointerEvents: progress < 0.5 ? 'none' : undefined,
            }}
            inert={progress < 0.5}
            aria-hidden={progress < 0.5}
          >
            {render(after)}
          </Inline>
        </Inline>
      )}
    </Tag>
  )
}

/** Keep global navigation and interactions mounted when a route did not exist. */
export function TimelineRoute({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const { entries, position, selected, select } = useTimeline()
  const { from, to, progress } = timelinePosition(position, entries.length)
  const exists = (index: number) =>
    !entries[index] || entries[index].routes.includes(pathname)
  const visibility =
    exists(from) === exists(to)
      ? Number(exists(from))
      : exists(to)
        ? progress
        : 1 - progress
  const missing = selected && !selected.routes.includes(pathname)
  const first = entries.find((entry) => entry.routes.includes(pathname))
  return (
    <div className={styles.route}>
      <div
        hidden={visibility === 0}
        inert={Boolean(missing)}
        aria-hidden={Boolean(missing)}
        style={{ opacity: visibility }}
        className={styles.routeContent}
      >
        {children}
      </div>
      {visibility < 1 && (
        <section
          id="timeline-unavailable"
          role="main"
          tabIndex={-1}
          className={styles.empty}
          style={{ opacity: 1 - visibility }}
          inert={!missing}
          aria-hidden={!missing}
        >
          <h1>
            {first && selected && first.publishedAt <= selected.publishedAt
              ? 'This page isn’t in this version.'
              : 'Shhhhh… this isn’t here yet.'}
          </h1>
          <p>
            {first
              ? 'First appeared ' +
                displayDate(first.publishedAt) +
                '. Come back then to see it.'
              : 'This page belongs to the current website. Its release date hasn’t been recorded yet.'}
          </p>
          {first && (
            <button onClick={() => select(entries.indexOf(first))}>
              Jump to {first.label} →
            </button>
          )}
          <button onClick={() => select(entries.length)}>
            Return to current page
          </button>
        </section>
      )}
    </div>
  )
}

export function TimelineSkipLink() {
  const pathname = usePathname()
  const { selected } = useTimeline()
  const missing = selected && !selected.routes.includes(pathname)
  return (
    <a
      className="skip-link"
      href={missing ? '#timeline-unavailable' : '#main-content'}
    >
      Skip to content
    </a>
  )
}
