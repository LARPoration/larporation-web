'use client'
import { createContext, useContext } from 'react'
import type { Release } from '../../lib/history/contracts'
export interface TimelineState {
  entries: Release[]
  position: number
  selected: Release | undefined
  select: (position: number) => void
}
export const TimelineContext = createContext<TimelineState>({
  entries: [],
  position: 0,
  selected: undefined,
  select: () => {},
})
export const useTimeline = () => useContext(TimelineContext)
