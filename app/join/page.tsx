import type { Metadata } from 'next'
import { ContentPage } from '../../components/layout/ContentPage'
import { ActionLink } from '../../components/ui/ActionLink'
import { site } from '../../config/site'
import { socialProfiles } from '../../config/social'
export const metadata: Metadata = {
  alternates: { canonical: '/join' },
  title: 'Join',
  description: 'Introduce yourself and help build LARPoration.',
}
export default function Join() {
  const linkedIn = socialProfiles.find((profile) => profile.id === 'linkedin')

  return (
    <ContentPage
      eyebrow="Join"
      title="0 years of experience required. Obviously."
      contributionId="page.join"
    >
      <p>
        Interested in software, design, marketing, product, recruitment or
        operations? Start a conversation about a useful piece of work you could
        own.
      </p>
      <h2>Intern as a Service. Salary not included.</h2>
      <p>
        <strong>Participation is unpaid. There is no salary.</strong> We have no
        short-term plans to become profitable, and we cannot promise future paid
        work.
      </p>
      <p>
        Infrastructure is currently funded by our financially adventurous
        founder. The cloud has a budget. The founder has instant noodles. Please
        be gentle with both.
      </p>
      <h2>Send a short introduction.</h2>
      <ul>
        <li>What would you like to help build or improve?</li>
        <li>
          What would you like to learn, and how much time could you contribute?
        </li>
        <li>
          Include a work sample or portfolio if you have one. It is not required
          to introduce yourself.
        </li>
      </ul>
      <ActionLink
        href={`mailto:${site.email}?subject=${encodeURIComponent('Joining LARPoration')}`}
        contentContributionId="page.join"
      >
        Introduce yourself by email ↗
      </ActionLink>
      <p>
        Drop us a message{' '}
        {linkedIn?.url && (
          <>
            on <a href={linkedIn.url}>LinkedIn</a> or{' '}
          </>
        )}
        by email at <a href={`mailto:${site.email}`}>{site.email}</a>, and we
        can schedule a chat to get to know each other and discuss how you could
        get involved.
      </p>
      <h2>Agree the work before starting.</h2>
      <p>
        Discuss the task, time commitment, support and any terms with the
        founder before taking it on. An introduction is the start of a
        conversation, not a confirmed role.
      </p>
    </ContentPage>
  )
}
