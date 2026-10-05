import Link from './SiteLink'
import type { ComponentProps } from 'react'
import { attribution, type AttributionProps } from '../../content/contributions'
import styles from './primitives.module.css'
type Props = ComponentProps<typeof Link> & AttributionProps
// Navigation stays an anchor; future actions must use a native button.
export function ActionLink({
  contributionId = 'ui.action',
  contentContributionId,
  className = '',
  ...props
}: Props) {
  return (
    <Link
      {...props}
      data-ui-control
      {...attribution({ contributionId, contentContributionId })}
      className={`${styles.action} ${className}`}
    />
  )
}
