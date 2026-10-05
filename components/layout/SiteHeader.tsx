import Link from '../ui/SiteLink'
import { Brand } from '../brand/Brand'
import { Container } from '../ui/Container'
import { Navigation } from './Navigation'
import styles from './shell.module.css'
export function SiteHeader() {
  return (
    <header className={styles.header}>
      <Container>
        <nav className={styles.navigation} aria-label="Primary">
          <Link
            href="/"
            className={styles.home}
            aria-label="LARPoration"
            draggable={false}
          >
            <Brand />
          </Link>
          <Navigation />
        </nav>
      </Container>
    </header>
  )
}
