import { useTimeline } from '../history/TimelineContext'
import {
  contributions,
  contributors,
  type Contribution,
} from '../../content/contributions'
export function findContribution(id: string | null): Contribution | undefined {
  return contributions.find((record) => record.id === id)
}
export function CreditRecord({
  id,
  contentId,
  inherited,
  scope = 'element',
}: {
  id: string | null
  contentId: string | null
  inherited: boolean
  scope?: 'element' | 'section' | 'page'
}) {
  const { selected } = useTimeline()
  if (selected) {
    const credit = selected.credits.find((record) => record.id === id)
    const content = selected.credits.find((record) => record.id === contentId)
    return (
      <>
        <h2 id="credit-title">{credit?.label ?? 'Unrecorded ' + scope}</h2>
        <p>{selected.label} / Historical attribution</p>
        <dl>
          <dt>Author</dt>
          <dd>
            {credit?.authors.join(', ') || 'Not recorded in this version.'}
          </dd>
        </dl>
        {credit?.approvedBy && <p>Approved by {credit.approvedBy}.</p>}
        {contentId && (
          <p>
            Content credit: {content?.label ?? 'Unrecorded'}.{' '}
            {content?.authors.join(', ') || 'Not recorded in this version.'}
          </p>
        )}
        {credit?.evidence.map((url) => (
          <p key={url}>
            <a href={url}>Contribution evidence ↗</a>
          </p>
        ))}
        <p>Record: {id ?? 'none'}</p>
      </>
    )
  }
  const record = findContribution(id)
  const content = findContribution(contentId)
  return (
    <>
      <h2 id="credit-title">{record?.label ?? `Unrecorded ${scope}`}</h2>
      {inherited && (
        <p>
          {scope === 'page'
            ? 'Page-level attribution. Sections and individual elements may have different authors.'
            : 'Section or group attribution. Individual elements may have different authors.'}
        </p>
      )}
      <dl>
        <dt>Author</dt>
        <dd>
          {record?.contributors.length
            ? record.contributors.map((person) => {
                const identity = contributors.find(
                  (p) => p.id === person.contributorId,
                )
                return (
                  <div key={`${person.contributorId}-${person.role}`}>
                    {identity?.name ?? 'Unrecorded'} (
                    {identity?.kind ?? 'unknown'}, {person.role})
                  </div>
                )
              })
            : 'Not recorded yet.'}
        </dd>
      </dl>
      {record?.reviewedBy && (
        <p>
          Approved by{' '}
          {contributors.find((person) => person.id === record.reviewedBy)
            ?.name ?? 'Unknown reviewer'}
          .
        </p>
      )}
      {contentId && (
        <p>
          Content credit: {content?.label ?? 'Unrecorded'}.{' '}
          {content?.contributors.length
            ? content.contributors
                .map(
                  (person) =>
                    `${contributors.find((p) => p.id === person.contributorId)?.name ?? 'Unrecorded'} (${person.role})`,
                )
                .join(', ')
            : 'Author not recorded yet.'}
        </p>
      )}
      <details>
        <summary>Evidence &amp; review</summary>
        <p>Status: {record?.status ?? 'unrecorded'}</p>
        {record?.evidence.length ? (
          <ul>
            {record.evidence.map((item) => (
              <li key={item.url}>
                <a href={item.url}>{item.label}</a>
              </li>
            ))}
          </ul>
        ) : (
          <p>No verified evidence linked yet.</p>
        )}
        {content?.evidence.map((item) => (
          <p key={item.url}>
            <a href={item.url}>{item.label}</a>
          </p>
        ))}
        <p>Record: {id ?? 'none'}</p>
      </details>
    </>
  )
}
