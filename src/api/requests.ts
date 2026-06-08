import { get } from './client'
import type { CollectorEvent, RequestEvent, ExceptionEvent, UnixRange, SdkSlug } from '@/types'

const DEFAULT_WINDOW = 5 * 60

export async function fetchRequests(
  slugs: SdkSlug[],
  range: UnixRange = { since: null, until: null },
): Promise<RequestEvent[]> {
  const since = range.since ?? Math.floor(Date.now() / 1000) - DEFAULT_WINDOW

  const batches = await Promise.all(
    slugs.map(service => {
      const params = new URLSearchParams({
        event_type: 'metric',
        since:      String(since),
        limit:      '500',
        service,
        ...(range.until ? { until: String(range.until) } : {}),
      })
      return get<CollectorEvent[]>(`/api/events?${params}`)
    }),
  )

  return batches
    .flat()
    .filter(e => e.payload?.source === 'request')
    .map(e => ({
      ts:          e.ts,
      service:     e.service,
      method:      (e.payload.method      as string) ?? '—',
      path:        (e.payload.path        as string) ?? '—',
      duration_ms: (e.payload.duration_ms as number) ?? 0,
      cpu_percent: (e.payload.cpu_percent as number) ?? 0,
      mem_mb:      (e.payload.mem_mb      as number) ?? 0,
    }))
    .sort((a, b) => b.ts - a.ts)
}

export async function fetchExceptions(
  slugs: SdkSlug[],
  range: UnixRange = { since: null, until: null },
): Promise<ExceptionEvent[]> {
  const since = range.since ?? Math.floor(Date.now() / 1000) - DEFAULT_WINDOW

  const batches = await Promise.all(
    slugs.map(service => {
      const params = new URLSearchParams({
        event_type: 'exception',
        since:      String(since),
        limit:      '500',
        service,
        ...(range.until ? { until: String(range.until) } : {}),
      })
      return get<CollectorEvent[]>(`/api/events?${params}`)
    }),
  )

  return batches
    .flat()
    .map(e => ({
      ts:          e.ts,
      service:     e.service,
      exc_type:    (e.payload.exc_type    as string) ?? 'UnknownError',
      exc_message: (e.payload.exc_message as string) ?? '',
      path:        (e.payload.path        as string | undefined),
      method:      (e.payload.method      as string | undefined),
    }))
    .sort((a, b) => b.ts - a.ts)
}
