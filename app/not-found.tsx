import type { Metadata } from 'next'
import { ActionLink } from '../components/ui/ActionLink'
export const metadata: Metadata = { title: 'Page not found' }
export default function NotFound() {
  return (
    <main id="main-content" tabIndex={-1}>
      <h1>404</h1>
      <p>This corner of the company does not exist yet.</p>
      <ActionLink href="/">Back to LARPoration</ActionLink>
    </main>
  )
}
