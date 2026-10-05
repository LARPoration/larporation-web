import type { ComponentProps } from 'react'
import { attribution, type AttributionProps } from '../../content/contributions'
import styles from './primitives.module.css'
export function Button({
  contributionId = 'ui.action',
  contentContributionId,
  className = '',
  type = 'button',
  ...props
}: ComponentProps<'button'> & AttributionProps) {
  return (
    <button
      {...props}
      type={type}
      {...attribution({ contributionId, contentContributionId })}
      className={`${styles.button} ${className}`}
    />
  )
}
