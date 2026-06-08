import type { DateRange, UnixRange } from '@/types'

const pad = (n: number): string => String(n).padStart(2, '0')

/** Format a Unix timestamp as HH:mm:ss. */
export function formatTime(ts: number): string {
  const d = new Date(ts * 1000)
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

/** Format a Unix timestamp as a full locale string. */
export function formatDateTime(ts: number): string {
  return new Date(ts * 1000).toLocaleString()
}

/** Convert a Date to a datetime-local input string ("YYYY-MM-DDTHH:mm"). */
export function toDatetimeLocal(date: Date): string {
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    `T${pad(date.getHours())}:${pad(date.getMinutes())}`
  )
}

/** Convert DateRange (string) to UnixRange (seconds). */
export function rangeToUnix(range: DateRange): UnixRange {
  return {
    since: range.start ? Math.floor(new Date(range.start).getTime() / 1000) : null,
    until: range.end   ? Math.floor(new Date(range.end).getTime()   / 1000) : null,
  }
}

/** True when the user has selected at least one bound. */
export function isCustomRange(range: DateRange): boolean {
  return Boolean(range.start || range.end)
}
