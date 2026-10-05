'use client'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { useTimeline } from '../history/TimelineContext'
import { Button } from '../../components/ui/Button'
import { Container } from '../../components/ui/Container'
import { CursorToggle } from '../cursor/CursorProvider'
import { CreditRecord, findContribution } from './CreditRecord'
import { resolveTarget, scopeTargets, type ResolvedTarget } from './resolve'
import { Highlight } from './Highlight'
import styles from './inspector.module.css'
type InspectorActions = {
  mode: boolean
  toggle: () => void
  showList: () => void
}
const InspectorContext = createContext<InspectorActions | null>(null)
function useInspector() {
  const value = useContext(InspectorContext)
  if (!value) throw new Error('Inspector controls require ContributionProvider')
  return value
}
export function InspectorBar() {
  const { mode, toggle } = useInspector()
  return (
    <div className={styles.bar} data-inspector-ui>
      <Container className={styles.barInner}>
        <span>Own Your Output. Right-click to see who made it.</span>
        <Button
          contributionId="tools.inspector"
          aria-pressed={mode}
          onClick={toggle}
        >
          Inspect contributions: {mode ? 'on' : 'off'}
        </Button>
      </Container>
    </div>
  )
}
export function InspectorTools() {
  const { mode, toggle, showList } = useInspector()
  return (
    <div data-inspector-ui>
      <div className={styles.tools}>
        <Button
          contributionId="tools.inspector"
          aria-pressed={mode}
          onClick={toggle}
        >
          Inspect contributions: {mode ? 'on' : 'off'}
        </Button>
        <Button onClick={showList}>Page credits ↗</Button>
        <CursorToggle />
      </div>
      <p className={styles.hint}>
        Right-click any part to inspect it. Shift + right-click keeps your
        browser menu. Keyboard: Shift + F10. On touch, turn inspection on and
        tap a part.
      </p>
      <span className={styles.hint} role="status">
        {mode
          ? 'Inspection on. Links are paused while selecting a part. Hover to preview; click to select. Escape clears selection, then exits.'
          : ''}
      </span>
    </div>
  )
}
export function ContributionProvider({ children }: { children: ReactNode }) {
  const { selected: release } = useTimeline()
  const root = useRef<HTMLDivElement>(null)
  const panel = useRef<HTMLDivElement>(null)
  const [preview, setPreview] = useState<ResolvedTarget | null>(null)
  const returnFocus = useRef<HTMLElement | null>(null)
  const [mode, setMode] = useState(false)
  const [selection, setSelection] = useState<ResolvedTarget | null>(null)
  const [choices, setChoices] = useState<ReturnType<
    typeof scopeTargets
  > | null>(null)
  const [list, setList] = useState<ResolvedTarget[] | null>(null)
  const opened = Boolean(selection || list)
  const dismiss = useCallback((restore = false) => {
    setSelection(null)
    setPreview(null)
    setList(null)
    if (restore && returnFocus.current?.isConnected)
      returnFocus.current.focus({ preventScroll: true })
  }, [])
  const select = useCallback(
    (target: ResolvedTarget, preserveFocus = false) => {
      if (!preserveFocus)
        returnFocus.current =
          target.element.closest<HTMLElement>('a,button,summary,[tabindex]') ??
          (document.activeElement instanceof HTMLElement
            ? document.activeElement
            : null)
      setPreview(null)
      setChoices(root.current ? scopeTargets(target, root.current) : null)
      setSelection(target)
      setList(null)
    },
    [],
  )
  const showList = () => {
    returnFocus.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null
    const seen = new Set<string>()
    const records: ResolvedTarget[] = []
    root.current
      ?.querySelectorAll('[data-contribution-id]')
      .forEach((element) => {
        const id = element.getAttribute('data-contribution-id')!
        if (
          !seen.has(id) &&
          !element.closest(
            '[data-credit-panel],[hidden],[inert],[aria-hidden="true"]',
          )
        ) {
          seen.add(id)
          const target = resolveTarget(element, root.current!)
          if (target) records.push(target)
        }
      })
    setPreview(null)
    setSelection(null)
    const candidate = root.current?.querySelector('main')
    const main = candidate?.closest('[hidden],[inert]') ? null : candidate
    const page = main && root.current ? resolveTarget(main, root.current) : null
    if (page && !records.some((item) => item.element === main))
      records.unshift(page)
    setList(records)
  }
  useEffect(() => {
    const scope = root.current
    if (!scope) return
    const contextMenu = (event: MouseEvent) => {
      if (event.shiftKey) return
      const target = resolveTarget(event.target, scope)
      if (target) {
        event.preventDefault()
        select(target)
      }
    }
    const click = (event: MouseEvent) => {
      if (
        !(event.target instanceof Element) ||
        event.target.closest('[data-inspector-ui],[data-credit-panel]')
      )
        return
      // A right-click opens credits, not selection mode. Ordinary clicks must
      // still activate their target unless the visitor explicitly enables it.
      if (mode) {
        const target = resolveTarget(event.target, scope)
        if (target) {
          event.preventDefault()
          event.stopPropagation()
          select(target)
        }
      } else if (opened) dismiss()
    }
    const keydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (opened) {
          event.preventDefault()
          dismiss(true)
        } else {
          setPreview(null)
          setMode(false)
        }
        return
      }
      if (
        event.key === 'ContextMenu' ||
        (event.shiftKey && event.key === 'F10')
      ) {
        const target = resolveTarget(event.target, scope)
        if (target) {
          event.preventDefault()
          select(target)
        }
      }
    }
    const hover = (event: PointerEvent) => {
      if (!mode || opened || event.pointerType === 'touch') return
      const target =
        event.target instanceof Element &&
        !event.target.closest('[data-inspector-ui]')
          ? resolveTarget(event.target, scope)
          : null
      setPreview((previous) =>
        previous?.element === target?.element ? previous : target,
      )
    }
    const leave = () => setPreview(null)
    scope.addEventListener('pointerover', hover)
    scope.addEventListener('pointerleave', leave)
    scope.addEventListener('contextmenu', contextMenu)
    scope.addEventListener('click', click, true)
    document.addEventListener('keydown', keydown)
    return () => {
      scope.removeEventListener('pointerover', hover)
      scope.removeEventListener('pointerleave', leave)
      scope.removeEventListener('contextmenu', contextMenu)
      scope.removeEventListener('click', click, true)
      document.removeEventListener('keydown', keydown)
    }
  }, [mode, opened, list, dismiss, select])
  useLayoutEffect(() => {
    if (!opened || !panel.current) return
    const card = panel.current
    if (!card.contains(document.activeElement))
      card
        .querySelector<HTMLButtonElement>('button')
        ?.focus({ preventScroll: true })
    let frame = 0
    const position = () => {
      if (selection && !selection.element.isConnected) {
        dismiss()
        return
      }
      const viewport = window.visualViewport
      const width = viewport?.width ?? window.innerWidth
      // The shared shell reserves its measured bottom dock height. Archives
      // have no local dock, so the inherited property falls back to zero.
      const dockHeight = root.current
        ? parseFloat(
            getComputedStyle(root.current).getPropertyValue(
              '--timeline-height',
            ),
          ) || 0
        : 0
      const height = Math.max(
        48,
        (viewport?.height ?? window.innerHeight) - dockHeight,
      )
      const left = viewport?.offsetLeft ?? 0
      const top = viewport?.offsetTop ?? 0
      const mobile = width <= 640
      card.style.maxHeight = `${mobile ? Math.min(height - 24, Math.max(160, height * 0.45)) : height - 24}px`
      card.style.width = `${Math.min(280, width - 24)}px`
      const rect = selection?.element.getBoundingClientRect()
      const cardWidth = card.offsetWidth,
        cardHeight = card.offsetHeight
      const clampX = (x: number) =>
        Math.max(left + 12, Math.min(x, left + width - cardWidth - 12))
      const clampY = (y: number) =>
        Math.max(top + 12, Math.min(y, top + height - cardHeight - 12))
      let x = left + width - cardWidth - 12,
        y = top + 12
      if (mobile) {
        x = left + (width - cardWidth) / 2
        y = top + height - cardHeight - 12
      } else if (rect && selection?.scope !== 'page') {
        const candidates = [
          { x: rect.right + 14, y: clampY(rect.top) },
          { x: rect.left - cardWidth - 14, y: clampY(rect.top) },
          { x: clampX(rect.left), y: rect.bottom + 14 },
          { x: clampX(rect.left), y: rect.top - cardHeight - 14 },
        ]
        const fit = candidates.find(
          (p) =>
            p.x >= left + 12 &&
            p.y >= top + 12 &&
            p.x + cardWidth <= left + width - 12 &&
            p.y + cardHeight <= top + height - 12,
        )
        if (fit) {
          x = fit.x
          y = fit.y
        }
      }
      card.style.left = `${clampX(x)}px`
      card.style.top = `${clampY(y)}px`
    }
    const schedule = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(position)
    }
    position()
    const resize = new ResizeObserver(schedule)
    resize.observe(card)
    if (selection) resize.observe(selection.element)
    const mutation = new MutationObserver(() => {
      if (selection && !selection.element.isConnected) dismiss()
    })
    if (root.current)
      mutation.observe(root.current, { childList: true, subtree: true })
    window.addEventListener('resize', schedule)
    window.addEventListener('scroll', schedule, true)
    window.visualViewport?.addEventListener('resize', schedule)
    window.visualViewport?.addEventListener('scroll', schedule)
    return () => {
      cancelAnimationFrame(frame)
      resize.disconnect()
      mutation.disconnect()
      window.removeEventListener('resize', schedule)
      window.removeEventListener('scroll', schedule, true)
      window.visualViewport?.removeEventListener('resize', schedule)
      window.visualViewport?.removeEventListener('scroll', schedule)
    }
  }, [opened, selection, list, dismiss])
  return (
    <InspectorContext
      value={{
        mode,
        toggle: () => {
          dismiss()
          setMode(!mode)
        },
        showList,
      }}
    >
      <div ref={root} data-contribution-id="site.foundation">
        {children}
        {(selection || preview) && (
          <Highlight target={(selection || preview)!} preview={!selection} />
        )}
        {opened && (
          <div
            ref={panel}
            className={styles.panel}
            role="dialog"
            aria-modal="false"
            aria-labelledby="credit-title"
            data-credit-panel
            data-inspector-ui
          >
            <div className={styles.top}>
              <span>Made by</span>
              <Button
                onClick={() => dismiss(true)}
                aria-label="Close contribution credit"
              >
                Close ×
              </Button>
            </div>
            {selection ? (
              <>
                <div
                  className={styles.scopes}
                  role="group"
                  aria-label="Inspection scope"
                >
                  {(['element', 'section', 'page'] as const).map((level) => {
                    const target = choices?.[level] ?? null
                    return (
                      <Button
                        key={level}
                        aria-pressed={selection.scope === level}
                        disabled={!target}
                        onClick={() => {
                          if (target) setSelection(target)
                        }}
                      >
                        {level[0].toUpperCase() + level.slice(1)}
                      </Button>
                    )
                  })}
                </div>
                <p>
                  {selection.scope === 'page'
                    ? 'Page-level credits'
                    : `${selection.scope === 'section' ? 'Section' : 'Element'} credits`}
                </p>
                <CreditRecord
                  key={`${selection.scope}:${selection.id}`}
                  id={selection.id}
                  contentId={selection.contentId}
                  inherited={selection.inherited}
                  scope={selection.scope}
                />
              </>
            ) : (
              <>
                <h2 id="credit-title">Page credits</h2>
                <p>
                  Choose an explicitly recorded part. Other elements may be
                  unrecorded.
                </p>
                <ul className={styles.list}>
                  {list?.map((item) => (
                    <li key={item.id ?? item.scope}>
                      <Button
                        onClick={() => {
                          if (item.scope !== 'page')
                            item.element.scrollIntoView({
                              block: 'center',
                              behavior: 'instant',
                            })
                          select(item, true)
                        }}
                      >
                        {item.scope === 'page'
                          ? 'Whole page'
                          : ((release
                              ? release.credits.find(
                                  (credit) => credit.id === item.id,
                                )?.label
                              : findContribution(item.id)?.label) ??
                            'Unrecorded element')}
                      </Button>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        )}
      </div>
    </InspectorContext>
  )
}
