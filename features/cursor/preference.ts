const key = 'larporation:theme-cursor:v1'
const eventName = 'larporation:cursor-preference'
let fallback = true
export function readPreference() {
  try {
    const value = window.localStorage.getItem(key)
    return value === null ? fallback : value !== 'off'
  } catch {
    return fallback
  }
}
export function writePreference(enabled: boolean) {
  fallback = enabled
  try {
    window.localStorage.setItem(key, enabled ? 'on' : 'off')
  } catch {
    /* Private/blocked storage: retain this session's choice. */
  }
  window.dispatchEvent(new Event(eventName))
}
export function subscribePreference(listener: () => void) {
  window.addEventListener('storage', listener)
  window.addEventListener(eventName, listener)
  return () => {
    window.removeEventListener('storage', listener)
    window.removeEventListener(eventName, listener)
  }
}
export function serverPreference() {
  return false
}
