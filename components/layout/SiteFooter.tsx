import { InspectorTools } from '../../features/contributions/ContributionProvider'
import { attribution } from '../../content/contributions'
import { SocialLinks } from '../brand/SocialLinks'
import { AssetImage } from '../brand/AssetImage'
import { Container } from '../ui/Container'
import styles from './shell.module.css'
export function SiteFooter() {
  return (
    <footer
      className={styles.footer}
      {...attribution({ contributionId: 'shell.footer' })}
    >
      <Container>
        <div className={styles.signoff}>
          <div className={styles.footerBrand} data-ui-control>
            <span {...attribution({ contributionId: 'brand.cornerstone' })}>
              <AssetImage id="cornerstone" />
            </span>
            <span>
              LARPoration
              <br />
              Own Your Output.
            </span>
          </div>
          <span>
            IaaS — Intern as a Service.
            <br />
            Corporate cosplay. Real output.
          </span>
        </div>
        <div className={styles.footerBottom}>
          <SocialLinks />
        </div>
        <InspectorTools />
      </Container>
    </footer>
  )
}
