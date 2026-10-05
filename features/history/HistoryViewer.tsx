'use client'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import {
  parseTimeline,
  timelinePosition,
  displayDate,
  type Timeline,
} from '../../lib/history/contracts'
import { revisionIds } from '../../content/history/revisions'
import { TimelineContext } from './TimelineContext'
import styles from './history.module.css'
import { site } from '../../config/site'

export function HistoryViewer({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const shell = useRef<HTMLDivElement>(null)
  const bar = useRef<HTMLElement>(null)
  const [timeline, setTimeline] = useState<Timeline | null>(null)
  const [error, setError] = useState(false)
  const [position, setPosition] = useState(0)
  const [notice, setNotice] = useState<{
    title: string
    body: string
    direction: string
  } | null>(null)
  const [details, setDetails] = useState(false)
  const entries = timeline?.entries ?? []
  const selectedIndex = timelinePosition(position, entries.length).selected
  const selected = entries[selectedIndex]
  const selectedId = selected?.id

  useEffect(() => {
    if (!bar.current) return
    const observer = new ResizeObserver(([entry]) =>
      shell.current?.style.setProperty(
        '--timeline-height',
        entry.target.getBoundingClientRect().height + 'px',
      ),
    )
    observer.observe(bar.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const abort = new AbortController()
    let loaded: Timeline | null = null
    const restore = () => {
      if (!loaded) return
      const id = new URLSearchParams(location.search).get('release')
      const index = loaded.entries.findIndex((entry) => entry.id === id)
      setPosition(index < 0 ? loaded.entries.length : index)
      setNotice(null)
      setDetails(false)
    }
    fetch('/history/timeline.json', { signal: abort.signal, cache: 'no-cache' })
      .then(async (response) => {
        if (!response.ok) throw new Error('Timeline unavailable')
        loaded = parseTimeline(await response.json(), revisionIds)
        setTimeline(loaded)
        restore()
      })
      .catch(() => {
        if (!abort.signal.aborted) setError(true)
      })
    window.addEventListener('popstate', restore)
    return () => {
      abort.abort()
      window.removeEventListener('popstate', restore)
    }
  }, [])

  // Keep the release on ordinary client navigation; preserve Next's history state.
  useEffect(() => {
    if (!timeline) return
    const url = new URL(location.href)
    if (selectedId) url.searchParams.set('release', selectedId)
    else url.searchParams.delete('release')
    url.searchParams.delete('route')
    history.replaceState(history.state, '', url)
  }, [pathname, selectedId, timeline])

  function select(value: number) {
    const next = timelinePosition(value, entries.length)
    setPosition(next.position)
    if (next.selected === selectedIndex) return
    const release = entries[next.selected]
    const backward = next.position < position
    const missing = release && !release.routes.includes(pathname)
    setDetails(false)
    setNotice({
      direction: backward ? 'backward' : 'forward',
      title: missing
        ? 'This page fades out here.'
        : release
          ? backward
            ? 'Rewinding to ' + release.label
            : release.label + ' arrives.'
          : 'Back to the present.',
      body: release?.summary ?? 'You’re viewing the current website again.',
    })
  }

  return (
    <TimelineContext.Provider value={{ entries, position, selected, select }}>
      <div ref={shell} className={styles.shell}>
        {children}
        {notice && (
          <aside
            key={selectedIndex}
            className={styles.popup}
            data-direction={notice.direction}
            aria-live="polite"
            aria-label="Version update"
            data-inspector-ui
          >
            <span>
              {notice.direction === 'backward' ? 'REWIND ↙' : 'FAST FORWARD ↗'}
            </span>
            <strong>{notice.title}</strong>
            <p>{notice.body}</p>
            <button
              aria-label="Dismiss version update"
              onClick={() => setNotice(null)}
            >
              ×
            </button>
          </aside>
        )}
        {details && selected && (
          <aside
            className={styles.details}
            aria-label="Version contributor credits"
            data-inspector-ui
          >
            <button onClick={() => setDetails(false)}>Close credits ×</button>
            <h2>{selected.label} / Credits</h2>
            {selected.credits.map((credit) => (
              <article key={credit.id}>
                <h3>{credit.label}</h3>
                <p>{credit.authors.join(', ') || 'Author not recorded.'}</p>
                {credit.approvedBy && <p>Approved by {credit.approvedBy}.</p>}
                {credit.evidence.map((url) => (
                  <p key={url}>
                    <a href={url}>Contribution evidence ↗</a>
                  </p>
                ))}
              </article>
            ))}
            {!selected.credits.length && (
              <p>No contributor records included in this version.</p>
            )}
          </aside>
        )}
        <section
          ref={bar}
          className={styles.timeline}
          aria-label="Website history timeline"
          data-inspector-ui
        >
          <div className={styles.identity}>
            <label htmlFor="release-slider">TIME TRAVEL</label>
            <span>
              {selected
                ? selected.label + ' · ' + displayDate(selected.publishedAt)
                : 'Now / v' + site.version}
            </span>
          </div>
          <div className={styles.track}>
            <input
              id="release-slider"
              aria-label="Website version"
              type="range"
              min="0"
              max={Math.max(1, entries.length)}
              step="0.01"
              value={entries.length ? position : 1}
              disabled={!entries.length || error}
              aria-valuetext={selected?.label ?? 'Current website'}
              onChange={(event) => select(Number(event.target.value))}
              onPointerUp={() => select(Math.round(position))}
              onPointerCancel={() => select(Math.round(position))}
              onBlur={() => select(Math.round(position))}
              onKeyDown={(event) => {
                const keys: Record<string, number> = {
                  ArrowLeft: selectedIndex - 1,
                  ArrowDown: selectedIndex - 1,
                  ArrowRight: selectedIndex + 1,
                  ArrowUp: selectedIndex + 1,
                  Home: 0,
                  End: entries.length,
                  PageDown: selectedIndex - 1,
                  PageUp: selectedIndex + 1,
                }
                if (event.key in keys) {
                  event.preventDefault()
                  select(keys[event.key])
                }
              }}
            />
            <div className={styles.ends}>
              <span>
                {error
                  ? 'History unavailable · current site still works'
                  : !timeline
                    ? 'Loading history…'
                    : (entries[0]?.label ?? 'You’re at the first chapter')}
              </span>
              <span>Now</span>
            </div>
          </div>
          <div className={styles.actions}>
            {selected && (
              <button
                aria-expanded={details}
                onClick={() => {
                  setDetails(!details)
                  setNotice(null)
                }}
              >
                Credits
              </button>
            )}
            <button
              disabled={position === entries.length}
              onClick={() => select(entries.length)}
            >
              Back to now ↗
            </button>
          </div>
        </section>
      </div>
    </TimelineContext.Provider>
  )
}
