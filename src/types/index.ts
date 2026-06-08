// ── SDK / service ──────────────────────────────────────────────────────────

/** A slug identifying one installed SDK instance (e.g. "my-api", "worker-1"). */
export type SdkSlug = string

// ── Date range ─────────────────────────────────────────────────────────────

/** datetime-local input values (ISO strings or empty). */
export interface DateRange {
  start: string
  end:   string
}

/** Unix timestamps in seconds (null = use sliding-window default). */
export interface UnixRange {
  since: number | null
  until: number | null
}

// ── Collector event (raw API shape) ────────────────────────────────────────

export interface CollectorEvent {
  id:         number
  ts:         number
  service:    SdkSlug
  event_type: 'metric' | 'exception' | 'log' | 'job'
  payload:    Record<string, unknown>
}

// ── Derived domain models ──────────────────────────────────────────────────

/** One CPU/memory poller sample. */
export interface MetricPoint {
  ts:          number
  service:     SdkSlug
  cpu_percent: number
  mem_mb:      number
}

/** One HTTP request metric event. */
export interface RequestEvent {
  ts:          number
  service:     SdkSlug
  method:      string
  path:        string
  duration_ms: number
  cpu_percent: number
  mem_mb:      number
}

/** One captured exception. */
export interface ExceptionEvent {
  ts:          number
  service:     SdkSlug
  exc_type:    string
  exc_message: string
  path?:       string
  method?:     string
}

/** Aggregated error count per endpoint + SDK. */
export interface ErrorAggregate {
  path:     string
  exc_type: string
  service:  SdkSlug
  count:    number
}

// ── Theme ──────────────────────────────────────────────────────────────────

export type Theme = 'dark' | 'light'

// ── Chart helpers ──────────────────────────────────────────────────────────

/** One row in a multi-SDK line chart. */
export type ChartRow = {
  time: string
  [sdkSlug: string]: number | string
}
