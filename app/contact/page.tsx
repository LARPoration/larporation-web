import type { Metadata } from 'next'
import { ContentPage } from '../../components/layout/ContentPage'
import { site } from '../../config/site'
export const metadata: Metadata = {
  alternates: { canonical: '/contact' },
  title: 'Contact',
  description: 'Get in touch with LARPoration.',
}
export default function Contact() {
  return (
    <ContentPage
      eyebrow="Contact"
      title="Start a conversation."
      contributionId="page.contact"
    >
      <p>For questions, ideas or an introduction, email the founder.</p>
      <p>
        <a href={`mailto:${site.email}`}>{site.email}</a>
      </p>
    </ContentPage>
  )
}
