import type { MetadataRoute } from 'next'
import { navigation } from '../config/navigation'
import { site } from '../config/site'

export const dynamic = 'force-static'
export default function sitemap(): MetadataRoute.Sitemap {
  return ['/', ...navigation.map(({ href }) => href)].map((path) => ({
    url: new URL(path, site.url).href,
  }))
}
