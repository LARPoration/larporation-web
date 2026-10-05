'use client'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
import { CursorProvider } from '../../features/cursor/CursorProvider'
import { ContributionProvider } from '../../features/contributions/ContributionProvider'
export function InteractionLayer({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  // Reset selection/mode and dispose listeners on route changes; preserve cursor preference.
  return (
    <CursorProvider>
      <ContributionProvider key={pathname}>{children}</ContributionProvider>
    </CursorProvider>
  )
}
