import { TimelineRegion } from '../../features/history/TimelineRegion'
import type { ReactNode } from 'react'
import { attribution, type ContributionId } from '../../content/contributions'
import styles from './content-page.module.css'

export function ContentPage({
  eyebrow,
  title,
  contributionId,
  children,
}: {
  eyebrow: string
  title: string
  contributionId: ContributionId
  children: ReactNode
}) {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className={styles.page}
      {...attribution({ contributionId })}
    >
      <header>
        <TimelineRegion
          as="p"
          region={contributionId + '.eyebrow'}
          className={styles.eyebrow}
        >
          {eyebrow}
        </TimelineRegion>
        <TimelineRegion as="h1" region={contributionId + '.title'}>
          {title}
        </TimelineRegion>
      </header>
      <TimelineRegion region={contributionId + '.body'} className={styles.body}>
        {children}
      </TimelineRegion>
    </main>
  )
}
