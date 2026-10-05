export type InspectionScope = 'element' | 'section' | 'page'
export interface ResolvedTarget {
  element: Element
  origin: Element
  id: string | null
  contentId: string | null
  inherited: boolean
  scope: InspectionScope
}
const sectionSelector =
  'section,header,footer,nav,[data-contribution-scope="section"]'
function record(element: Element, origin = element): ResolvedTarget {
  const owner = element.closest('[data-contribution-id]')
  const scope: InspectionScope = element.matches('main')
    ? 'page'
    : element.matches(sectionSelector)
      ? 'section'
      : 'element'
  return {
    element,
    origin,
    scope,
    id: owner?.getAttribute('data-contribution-id') ?? null,
    contentId:
      (element.hasAttribute('data-content-contribution-id')
        ? element
        : owner
      )?.getAttribute('data-content-contribution-id') ?? null,
    inherited: scope !== 'element' || owner !== element,
  }
}
export function resolveTarget(
  target: EventTarget | null,
  root: HTMLElement,
): ResolvedTarget | null {
  if (
    !(target instanceof Element) ||
    !root.contains(target) ||
    target.closest(
      '[data-credit-panel],input,textarea,select,[contenteditable]:not([contenteditable="false"])',
    )
  )
    return null
  // Stop at a concrete control/text boundary before a section's attribution.
  // Nested decorative content can still resolve to its explicitly credited logo/control.
  const owner = target.closest(
    '[data-contribution-id],a,button,summary,h1,h2,h3,p,li,section,main,header,footer,nav',
  )
  return record(owner && root.contains(owner) ? owner : target)
}
export function scopeTargets(
  target: ResolvedTarget,
  root: HTMLElement,
): Record<InspectionScope, ResolvedTarget | null> {
  const origin = target.origin
  const section = origin.closest(sectionSelector)
  const page = root.querySelector('main')
  const original = record(origin)
  return {
    element: original.scope === 'element' ? original : null,
    section: section ? record(section, origin) : null,
    page: page ? record(page, origin) : null,
  }
}
