import type { ContributionId } from '../content/contributions.ts'
export interface Asset {
  path: string
  width: number
  height: number
  contributionId: ContributionId
  provenance: string
}
export const assets = {
  cornerstone: {
    path: '/brand/cornerstone.svg',
    width: 44,
    height: 44,
    contributionId: 'brand.cornerstone',
    provenance: 'docs/assets.md#cornerstone',
  },
  instagram: {
    path: '/social/instagram.svg',
    width: 24,
    height: 24,
    contributionId: 'brand.socials',
    provenance: 'docs/assets.md#social-icons',
  },
  tiktok: {
    path: '/social/tiktok.svg',
    width: 24,
    height: 24,
    contributionId: 'brand.socials',
    provenance: 'docs/assets.md#social-icons',
  },
  linkedin: {
    path: '/social/linkedin.svg',
    width: 24,
    height: 24,
    contributionId: 'brand.socials',
    provenance: 'docs/assets.md#social-icons',
  },
  github: {
    path: '/social/github.svg',
    width: 24,
    height: 24,
    contributionId: 'brand.socials',
    provenance: 'docs/assets.md#social-icons',
  },
  pixelPointer: {
    path: '/cursors/pixel-pointer.svg',
    width: 24,
    height: 30,
    contributionId: 'cursor.pixel',
    provenance: 'docs/assets.md#pixel-cursor',
  },
  pixelArrow: {
    path: '/cursors/pixel-arrow.svg',
    width: 24,
    height: 30,
    contributionId: 'cursor.pixel',
    provenance: 'docs/assets.md#pixel-cursor',
  },
} as const satisfies Record<string, Asset>
export type AssetId = keyof typeof assets
