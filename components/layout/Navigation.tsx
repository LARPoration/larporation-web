'use client'
import Link from '../ui/SiteLink'
import { usePathname } from 'next/navigation'
import { navigation } from '../../config/navigation'
import { ActionLink } from '../ui/ActionLink'
import styles from './shell.module.css'
export function Navigation() {
  const pathname = usePathname()
  return (
    <div className={styles.links}>
      {navigation.map((item) => {
        const current = pathname === item.href ? ('page' as const) : undefined
        return item.href === '/join' ? (
          <ActionLink
            key={item.href}
            href={item.href}
            aria-current={current}
            aria-label={item.label}
            contributionId="shell.navigation"
          >
            {item.label} us
            <span aria-hidden="true"> ↗</span>
          </ActionLink>
        ) : (
          <Link
            key={item.href}
            href={item.href}
            aria-current={current}
            data-contribution-id="shell.navigation"
          >
            {item.label}
          </Link>
        )
      })}
    </div>
  )
}
