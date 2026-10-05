import Image from 'next/image'
import { assets, type AssetId } from '../../config/assets'
export function AssetImage({
  id,
  className,
}: {
  id: AssetId
  className?: string
}) {
  const asset = assets[id]
  return (
    <Image
      src={asset.path}
      width={asset.width}
      height={asset.height}
      alt=""
      aria-hidden="true"
      draggable={false}
      className={className}
      loading="eager"
      unoptimized
    />
  )
}
