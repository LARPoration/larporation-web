import type { Metadata } from 'next'
import { ContentPage } from '../../components/layout/ContentPage'
import { ActionLink } from '../../components/ui/ActionLink'
import { roadmap } from '../../content/roadmap'
export const metadata: Metadata = {
  alternates: { canonical: '/projects' },
  title: 'Projects',
  description:
    'The LARPoration roadmap: what we have built and what comes next.',
}
export default function Projects() {
  return (
    <ContentPage
      eyebrow="Projects / Roadmap"
      title="A foundation. Then the next useful thing."
      contributionId="page.projects"
    >
      <p>
        We start with the organisation itself. This roadmap shows our direction;
        priorities develop with the people doing the work.
      </p>
      {roadmap.map((item) => (
        <article key={item.id}>
          <span>{item.status}</span>
          <h2>{item.title}</h2>
          <p>{item.description}</p>
        </article>
      ))}
      <h2>Help shape what comes next.</h2>
      <p>
        Bring a problem you want to solve or a skill you want to practise on
        something useful.
      </p>
      <ActionLink href="/join" contentContributionId="page.projects">
        Get involved ↗
      </ActionLink>
    </ContentPage>
  )
}
