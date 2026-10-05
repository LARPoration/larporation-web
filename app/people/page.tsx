import type { Metadata } from 'next'
import { ContentPage } from '../../components/layout/ContentPage'
import { ActionLink } from '../../components/ui/ActionLink'
import { contributors } from '../../content/contributions'
export const metadata: Metadata = {
  alternates: { canonical: '/people' },
  title: 'People',
  description: 'People, responsibility and contribution at LARPoration.',
}
export default function People() {
  const people = contributors.filter((person) => person.kind === 'human')
  return (
    <ContentPage
      eyebrow="People"
      title="People behind the work."
      contributionId="page.people"
    >
      <p>
        LARPoration starts with a founder and an invitation to build together.
        Software, design, communication and operations all need people willing
        to take responsibility.
      </p>
      {people.map((person) => (
        <article key={person.id}>
          <h2>{person.name}</h2>
          {person.profileUrl && (
            <a href={person.profileUrl}>Public profile ↗</a>
          )}
        </article>
      ))}
      <h2>Credit belongs with the contribution.</h2>
      <p>
        Use the contribution inspector to explore the records attached to this
        website. A record distinguishes design, writing, implementation and
        review, including AI assistance where recorded.
      </p>
      <h2>Make the next handover easier.</h2>
      <p>
        Explain what you changed, why it matters and how someone else can
        continue. Public profiles and evidence are shared with the contributor’s
        permission.
      </p>
      <ActionLink href="/join" contentContributionId="page.people">
        Build with us ↗
      </ActionLink>
    </ContentPage>
  )
}
