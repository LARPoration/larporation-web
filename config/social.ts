import type { AssetId } from './assets.ts'
export interface SocialProfile {
  id: string
  label: string
  assetId: AssetId
  url: string | null
}
export const socialProfiles: readonly SocialProfile[] = [
  {
    id: 'instagram',
    label: 'Instagram',
    assetId: 'instagram',
    url: 'https://www.instagram.com/larporation/',
  },
  {
    id: 'tiktok',
    label: 'TikTok',
    assetId: 'tiktok',
    url: 'https://www.tiktok.com/@larporation',
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    assetId: 'linkedin',
    url: 'https://www.linkedin.com/company/larporation',
  },
  {
    id: 'github',
    label: 'GitHub',
    assetId: 'github',
    url: 'https://github.com/LARPoration',
  },
]
