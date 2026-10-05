'use client'
import {
  createContext,
  useContext,
  useSyncExternalStore,
  type ReactNode,
  type CSSProperties,
} from 'react'
import { assets } from '../../config/assets'
import { Button } from '../../components/ui/Button'
import {
  readPreference,
  writePreference,
  subscribePreference,
  serverPreference,
} from './preference'
import styles from './cursor.module.css'
const CursorContext = createContext(false)
export function CursorProvider({ children }: { children: ReactNode }) {
  const enabled = useSyncExternalStore(
    subscribePreference,
    readPreference,
    serverPreference,
  )
  const variables = {
    '--cursor-arrow': `url("${assets.pixelArrow.path}") 1 1`,
    '--cursor-pointer': `url("${assets.pixelPointer.path}") 9 1`,
  } as CSSProperties
  return (
    <CursorContext value={enabled}>
      <div
        className={styles.scope}
        data-theme-cursor={enabled}
        style={variables}
      >
        {children}
      </div>
    </CursorContext>
  )
}
export function CursorToggle() {
  const enabled = useContext(CursorContext)
  return (
    <Button
      contributionId="cursor.pixel"
      aria-pressed={enabled}
      onClick={() => writePreference(!enabled)}
    >
      Theme cursor: {enabled ? 'on' : 'off'}
    </Button>
  )
}
