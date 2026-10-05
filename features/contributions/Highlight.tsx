import { useLayoutEffect, useRef } from 'react'
import type { ResolvedTarget } from './resolve'
import styles from './inspector.module.css'
import { pixelOutline } from './pixel-outline'
export function Highlight({
  target,
  preview,
}: {
  target: ResolvedTarget
  preview: boolean
}) {
  const pixelPath = useRef<SVGPathElement>(null)
  const mark = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    const node = mark.current
    if (!node) return
    let frame = 0
    const measure = () => {
      const rect = target.element.getBoundingClientRect()
      const viewport = window.visualViewport
      const x = viewport?.offsetLeft ?? 0,
        y = viewport?.offsetTop ?? 0
      const width = viewport?.width ?? innerWidth,
        height = viewport?.height ?? innerHeight
      const page = target.scope === 'page'
      node.hidden =
        !target.element.isConnected ||
        (!page &&
          (rect.bottom <= y ||
            rect.top >= y + height ||
            rect.right <= x ||
            rect.left >= x + width))
      const large = rect.width > 380 || rect.height > 160
      node.dataset.shape = page
        ? 'page'
        : target.scope === 'section' || large
          ? 'section'
          : 'element'
      const section = node.dataset.shape === 'section'
      // Room outside the actual target; never alter the page's own layout.
      const paddingX = section ? 16 : 10,
        paddingY = section ? 16 : 9
      if (node.dataset.shape === 'element')
        pixelPath.current?.setAttribute(
          'd',
          pixelOutline(rect.width + paddingX * 2, rect.height + paddingY * 2),
        )
      Object.assign(
        node.style,
        page
          ? {
              left: `${x + 6}px`,
              top: `${y + 6}px`,
              width: `${width - 12}px`,
              height: `${height - 12}px`,
            }
          : {
              left: `${rect.left - paddingX}px`,
              top: `${rect.top - paddingY}px`,
              width: `${rect.width + paddingX * 2}px`,
              height: `${rect.height + paddingY * 2}px`,
            },
      )
    }
    const schedule = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(measure)
    }
    measure()
    const resize = new ResizeObserver(schedule)
    resize.observe(target.element)
    const mutation = new MutationObserver(schedule)
    mutation.observe(document.body, { childList: true, subtree: true })
    window.addEventListener('scroll', schedule, true)
    window.addEventListener('resize', schedule)
    window.visualViewport?.addEventListener('resize', schedule)
    window.visualViewport?.addEventListener('scroll', schedule)
    return () => {
      cancelAnimationFrame(frame)
      resize.disconnect()
      mutation.disconnect()
      window.removeEventListener('scroll', schedule, true)
      window.removeEventListener('resize', schedule)
      window.visualViewport?.removeEventListener('resize', schedule)
      window.visualViewport?.removeEventListener('scroll', schedule)
    }
  }, [target])
  return (
    <div className={styles.overlay} aria-hidden="true">
      <div
        ref={mark}
        className={styles.highlight}
        data-credit-highlight
        data-preview={preview}
        data-scope={target.scope}
      >
        <svg
          className={styles.pixelOutline}
          width="100%"
          height="100%"
          aria-hidden="true"
          shapeRendering="crispEdges"
        >
          <path
            ref={pixelPath}
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
          />
        </svg>
        <span className={styles.scopeLabel}>
          {target.scope === 'page'
            ? 'Page-level credits'
            : preview
              ? `${target.scope} · click to inspect`
              : target.scope}
        </span>
      </div>
    </div>
  )
}
