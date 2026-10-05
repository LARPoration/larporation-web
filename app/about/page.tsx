import type { Metadata } from 'next'
import { ContentPage } from '../../components/layout/ContentPage'
export const metadata: Metadata = {
  alternates: { canonical: '/about' },
  title: 'About',
  description: 'Why LARPoration exists and how we build it together.',
}
export default function About() {
  return (
    <ContentPage
      eyebrow="About"
      title="The company is the project."
      contributionId="page.about"
    >
      <p>
        LARPoration exists to give people who lack professional experience a
        real organisation to build, operate and improve — so they leave with
        verifiable work, genuine responsibility and evidence they can take into
        their next opportunity.
      </p>
      <p>
        Companies want experience. People need somewhere to get it. We begin by
        building LARPoration itself: its website, communication, recruitment and
        everyday systems.
      </p>
      <h2>Own Your Output.</h2>
      <p>
        Take responsibility for a useful piece of work. Keep a record of the
        decisions, the review and the result. A title is less useful than
        something you can show.
      </p>
      <h2>Real work, shared learning.</h2>
      <p>
        Work should solve an actual problem. Ask questions, explain your choices
        and leave enough context for the next person to continue.
      </p>
      <h2>The acronym is a joke.</h2>
      <p>
        Intern as a Service is our take on the experience paradox. The work,
        responsibility and credit are real.
      </p>
    </ContentPage>
  )
}
