import { socialProfiles } from '../../config/social'
import { AssetImage } from './AssetImage'
import { attribution } from '../../content/contributions'
import styles from '../layout/shell.module.css'
export function SocialLinks() {
  const publishedProfiles = socialProfiles.filter((profile) => profile.url)
  if (!publishedProfiles.length) return null
  return (
    <div
      className={styles.socialBlock}
      {...attribution({ contributionId: 'brand.socials' })}
    >
      <ul className={styles.socials} aria-label="Social media">
        {publishedProfiles.map((profile) => (
          <li key={profile.id}>
            <a
              href={profile.url!}
              aria-label={profile.label}
              data-ui-control
              draggable={false}
            >
              <AssetImage id={profile.assetId} />
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
