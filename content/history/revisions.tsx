import type { ComponentType } from 'react'
import { revisionIds } from './revision-ids'
export { revisionIds }
// Type checking requires an implementation for every registered ID.
const implementations = {} satisfies Record<
  (typeof revisionIds)[number],
  ComponentType
>
// Local React components only; JSON cannot execute code or inject HTML.
export const revisions: Readonly<Record<string, ComponentType>> =
  implementations
