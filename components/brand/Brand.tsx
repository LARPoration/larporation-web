import { AssetImage } from './AssetImage'
import { attribution } from '../../content/contributions'
import styles from './brand.module.css'
export function Brand() {
  return (
    <span
      className={styles.brand}
      data-ui-control
      {...attribution({ contributionId: 'brand.cornerstone' })}
    >
      <AssetImage id="cornerstone" />
      <span>
        <b>LARP</b>oration
      </span>
    </span>
  )
}
