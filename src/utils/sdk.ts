import type { MetricPoint, ChartRow, ErrorAggregate, ExceptionEvent } from '@/types'
import { formatTime } from './datetime'

/** Ordered colour palette — each SDK gets a stable colour from this list. */
const PALETTE = [
  '#00c896', // green  (accent)
  '#3d8ef0', // blue
  '#e8a838', // amber
  '#a855f7', // purple
  '#ec4899', // pink
  '#e05252', // red
]

/** Return a deterministic colour for a given SDK slug. */
export function sdkColor(slug: string, allSlugs: string[]): string {
  const idx = allSlugs.indexOf(slug)
  return PALETTE[idx >= 0 ? idx % PALETTE.length : 0]
}

/**
 * Transform a flat MetricPoint[] into recharts-ready ChartRow[].
 * Each row represents one timestamp, with one key per SDK slug.
 *
 * @param field  Which metric to pivot ('cpu_percent' | 'mem_mb')
 */
export function buildChartData(
  metrics: MetricPoint[],
  field:   'cpu_percent' | 'mem_mb',
): ChartRow[] {
  const byTime = new Map<string, ChartRow>()

  for (const m of metrics) {
    const time = formatTime(m.ts)
    if (!byTime.has(time)) byTime.set(time, { time })
    const row = byTime.get(time)!
    const prev = row[m.service]
    // Average if two events land in the same second
    row[m.service] = typeof prev === 'number'
      ? Math.round((prev + m[field]) / 2 * 10) / 10
      : Math.round(m[field] * 10) / 10
  }

  return Array.from(byTime.values())
}

/**
 * Aggregate ExceptionEvent[] into ErrorAggregate[].
 * Groups by (service + exc_type + path) and counts occurrences.
 */
export function aggregateErrors(events: ExceptionEvent[]): ErrorAggregate[] {
  const map = new Map<string, ErrorAggregate>()

  for (const e of events) {
    const path = e.path ?? '(no path)'
    const key  = `${e.service}::${e.exc_type}::${path}`
    const existing = map.get(key)
    if (existing) {
      existing.count++
    } else {
      map.set(key, { path, exc_type: e.exc_type, service: e.service, count: 1 })
    }
  }

  return Array.from(map.values()).sort((a, b) => b.count - a.count)
}
