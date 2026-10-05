import NextLink from 'next/link'
import type { ComponentProps } from 'react'

type Props = Omit<ComponentProps<'a'>, 'href'> & { href: string }

export default function SiteLink(props: Props) {
  return <NextLink {...props} />
}
