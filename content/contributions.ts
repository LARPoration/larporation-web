export type ContributionRole = 'design' | 'copy' | 'code' | 'review'
export interface Contributor {
  id: string
  name: string
  kind: 'human' | 'ai'
  profileUrl?: string
}
export interface Contribution {
  id: string
  label: string
  status: 'unrecorded' | 'pending' | 'reviewed'
  contributors: { contributorId: string; role: ContributionRole }[]
  reviewedBy?: string
  evidence: { label: string; url: string }[]
}
// No public identities or authorship claims are invented from chat participation.
export const contributors: readonly Contributor[] = [
  { id: 'founder', name: 'Founder', kind: 'human' },
  { id: 'founder-with-codex', name: 'Founder with Codex', kind: 'human' },
]
export const contributions = [
  {
    id: 'site.foundation',
    label: 'Founder website foundation',
    status: 'reviewed',
    reviewedBy: 'founder',
    contributors: [{ contributorId: 'founder-with-codex', role: 'code' }],
    evidence: [],
  },
  {
    id: 'brand.cornerstone',
    label: 'Cornerstone mark',
    status: 'reviewed',
    reviewedBy: 'founder',
    contributors: [{ contributorId: 'founder-with-codex', role: 'code' }],
    evidence: [],
  },
  {
    id: 'shell.navigation',
    label: 'Shared navigation',
    status: 'reviewed',
    reviewedBy: 'founder',
    contributors: [{ contributorId: 'founder-with-codex', role: 'code' }],
    evidence: [],
  },
  {
    id: 'shell.footer',
    label: 'Shared footer',
    status: 'reviewed',
    reviewedBy: 'founder',
    contributors: [{ contributorId: 'founder-with-codex', role: 'code' }],
    evidence: [],
  },
  {
    id: 'brand.socials',
    label: 'Social icon integration',
    status: 'reviewed',
    reviewedBy: 'founder',
    contributors: [{ contributorId: 'founder-with-codex', role: 'code' }],
    evidence: [],
  },
  {
    id: 'cursor.pixel',
    label: 'Pixel cursor artwork',
    status: 'reviewed',
    reviewedBy: 'founder',
    contributors: [{ contributorId: 'founder-with-codex', role: 'code' }],
    evidence: [],
  },
  {
    id: 'home.hero',
    label: 'Homepage introduction',
    status: 'reviewed',
    reviewedBy: 'founder',
    contributors: [{ contributorId: 'founder-with-codex', role: 'code' }],
    evidence: [],
  },
  {
    id: 'home.pitch',
    label: 'IaaS pitch and translation',
    status: 'reviewed',
    reviewedBy: 'founder',
    contributors: [{ contributorId: 'founder-with-codex', role: 'code' }],
    evidence: [],
  },
  {
    id: 'home.faq',
    label: 'Mission and frequently asked questions',
    status: 'reviewed',
    reviewedBy: 'founder',
    contributors: [{ contributorId: 'founder-with-codex', role: 'code' }],
    evidence: [],
  },
  {
    id: 'home.challenge',
    label: 'Founder challenge',
    status: 'reviewed',
    reviewedBy: 'founder',
    contributors: [{ contributorId: 'founder-with-codex', role: 'code' }],
    evidence: [],
  },
  {
    id: 'ui.action',
    label: 'Shared action control',
    status: 'reviewed',
    reviewedBy: 'founder',
    contributors: [{ contributorId: 'founder-with-codex', role: 'code' }],
    evidence: [],
  },
  {
    id: 'tools.inspector',
    label: 'Contribution inspector',
    status: 'reviewed',
    reviewedBy: 'founder',
    contributors: [{ contributorId: 'founder-with-codex', role: 'code' }],
    evidence: [],
  },
  ...(['home', 'about', 'projects', 'people', 'join', 'contact'] as const).map(
    (page) => ({
      id: `page.${page}` as const,
      label: `${page[0].toUpperCase()}${page.slice(1)} page`,
      status: 'reviewed' as const,
      reviewedBy: 'founder',
      contributors: [
        { contributorId: 'founder-with-codex', role: 'code' as const },
      ],
      evidence: [],
    }),
  ),
] as const satisfies readonly Contribution[]
export type ContributionId = (typeof contributions)[number]['id']
export interface AttributionProps {
  contributionId?: ContributionId
  contentContributionId?: ContributionId
}
export function attribution({
  contributionId,
  contentContributionId,
}: AttributionProps) {
  return {
    'data-contribution-id': contributionId,
    'data-content-contribution-id': contentContributionId,
  }
}
