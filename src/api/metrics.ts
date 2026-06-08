import { get } from './client'
import type { CollectorEvent, MetricPoint, UnixRange, SdkSlug } from '@/types'

const DEFAULT_WINDOW = 60 * 5 // 5 minutes

export async function fetchMetrics(
  slugs: SdkSlug[],
  range: UnixRange = { since: null, until: null },
): Promise<MetricPoint[]> {
  const since = range.since ?? Math.floor(Date.now() / 1000) - DEFAULT_WINDOW

  // Fetch for all slugs in parallel
  const batches = await Promise.all(
    slugs.map(service => {
      const params = new URLSearchParams({
        event_type: 'metric',
        since:      String(since),
        limit:      '1000',
        service,
        ...(range.until ? { until: String(range.until) } : {}),
      })
      return get<CollectorEvent[]>(`/api/events?${params}`)
    }),
  )

  return batches
    .flat()
    .filter(e => e.payload?.source === 'poller')
    .map(e => ({
      ts:          e.ts,
      service:     e.service,
      cpu_percent: (e.payload.cpu_percent as number) ?? 0,
      mem_mb:      (e.payload.mem_mb      as number) ?? 0,
    }))
    .sort((a, b) => a.ts - b.ts)
}
