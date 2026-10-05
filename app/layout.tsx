import {
  TimelineRoute,
  TimelineSkipLink,
} from '../features/history/TimelineRegion'
import { HistoryViewer } from '../features/history/HistoryViewer'
import { InspectorBar } from '../features/contributions/ContributionProvider'
import type { Metadata } from 'next'
import '../styles/tokens.css'
import './globals.css'
import { site } from '../config/site'
import { assets } from '../config/assets'
import { SiteHeader } from '../components/layout/SiteHeader'
import { SiteFooter } from '../components/layout/SiteFooter'
import { InteractionLayer } from '../components/layout/InteractionLayer'
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.name, template: `%s | ${site.name}` },
  description: site.description,
  icons: { icon: assets.cornerstone.path },
}
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <HistoryViewer>
          <InteractionLayer>
            <TimelineSkipLink />
            <SiteHeader />
            <InspectorBar />
            <TimelineRoute>{children}</TimelineRoute>
            <SiteFooter />
          </InteractionLayer>
        </HistoryViewer>
      </body>
    </html>
  )
}
