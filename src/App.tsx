import { useCallback, useEffect, useRef, useState } from 'react'
import { TopBar }         from '@/components/layout/TopBar'
import { DateRangeFilter } from '@/components/common/DateRangeFilter'
import { SdkSelector }    from '@/components/dashboard/SdkSelector'
import { SdkStatsRow }    from '@/components/dashboard/SdkStatsRow'
import { MetricChart }    from '@/components/dashboard/MetricChart'
import { ErrorSummary }   from '@/components/dashboard/ErrorSummary'
import { RequestsTable }  from '@/components/dashboard/RequestsTable'
import { usePoller }      from '@/hooks/usePoller'
import { useTheme }       from '@/hooks/useTheme'
import { fetchMetrics, fetchRequests, fetchExceptions, fetchServices } from '@/api'
import { rangeToUnix, isCustomRange } from '@/utils'
import type { DateRange, SdkSlug } from '@/types'
import styles from '@css/App.module.css'

const LIVE_POLL_MS   = 5_000
const CUSTOM_POLL_MS = 30_000

export default function App() {
  const [theme, toggleTheme] = useTheme()

  // ── SDK selection ────────────────────────────────────────────────────────
  const [availableSlugs, setAvailableSlugs] = useState<SdkSlug[]>([])
  const [selectedSlugs,  setSelectedSlugs]  = useState<SdkSlug[]>([])
  const [servicesLoading, setServicesLoading] = useState(true)

  useEffect(() => {
    fetchServices()
      .then(slugs => {
        setAvailableSlugs(slugs)
        setSelectedSlugs(slugs)           // select all by default
      })
      .catch(() => {
        // Collector unreachable — leave empty, error shown in errorBar
      })
      .finally(() => setServicesLoading(false))
  }, [])

  // ── Date range ───────────────────────────────────────────────────────────
  const [range, setRange] = useState<DateRange>({ start: '', end: '' })
  const custom  = isCustomRange(range)
  const pollMs  = custom ? CUSTOM_POLL_MS : LIVE_POLL_MS
  const unixRange = rangeToUnix(range)

  // ── Data pollers ─────────────────────────────────────────────────────────
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  const metricsFn = useCallback(async () => {
    if (selectedSlugs.length === 0) return []
    const data = await fetchMetrics(selectedSlugs, unixRange)
    setLastUpdate(new Date())
    return data
  }, [selectedSlugs, unixRange])   // intentional: new ref when deps change

  const requestsFn = useCallback(
    () => (selectedSlugs.length ? fetchRequests(selectedSlugs, unixRange) : Promise.resolve([])),
    [selectedSlugs, unixRange],
  )

  const exceptionsFn = useCallback(
    () => (selectedSlugs.length ? fetchExceptions(selectedSlugs, unixRange) : Promise.resolve([])),
    [selectedSlugs, unixRange],
  )

  const { data: metrics,    error: metricsErr,    refresh: refreshMetrics    } = usePoller(metricsFn,    pollMs)
  const { data: requests,   error: requestsErr,   refresh: refreshRequests   } = usePoller(requestsFn,   pollMs)
  const { data: exceptions, error: exceptionsErr, refresh: refreshExceptions } = usePoller(exceptionsFn, pollMs)

  // Re-fetch immediately when deps change
  const prevKey = useRef('')
  const currentKey = JSON.stringify({ selectedSlugs, range })
  useEffect(() => {
    if (prevKey.current && prevKey.current !== currentKey) {
      refreshMetrics()
      refreshRequests()
      refreshExceptions()
    }
    prevKey.current = currentKey
  }, [currentKey, refreshMetrics, refreshRequests, refreshExceptions])

  function refresh() {
    refreshMetrics()
    refreshRequests()
    refreshExceptions()
  }

  const hasError = metricsErr || requestsErr || exceptionsErr

  return (
    <div className={styles.shell}>
      <TopBar
        lastUpdate={lastUpdate}
        theme={theme}
        onThemeToggle={toggleTheme}
        onRefresh={refresh}
      />

      <main className={styles.main}>
        {hasError && (
          <div className={styles.errorBar}>
            ⚠ {metricsErr || requestsErr || exceptionsErr}
          </div>
        )}

        {/* ── SDK selector ── */}
        <SdkSelector
          available={availableSlugs}
          selected={selectedSlugs}
          loading={servicesLoading}
          onChange={setSelectedSlugs}
        />

        {/* ── Date range filter ── */}
        <DateRangeFilter
          range={range}
          onChange={setRange}
          onClear={() => setRange({ start: '', end: '' })}
        />

        {/* ── Per-SDK stat tiles ── */}
        {selectedSlugs.length > 0 && (
          <div className={styles.sdkSection}>
            {selectedSlugs.map(slug => (
              <SdkStatsRow
                key={slug}
                slug={slug}
                metrics={metrics ?? []}
                allSlugs={availableSlugs}
              />
            ))}
          </div>
        )}

        {/* ── Charts (all selected SDKs overlaid) ── */}
        {selectedSlugs.length > 0 && (
          <div className={styles.chartsRow}>
            <MetricChart
              title="CPU Usage"
              metrics={metrics ?? []}
              field="cpu_percent"
              unit="%"
              domain={[0, 100]}
              slugs={selectedSlugs}
              allSlugs={availableSlugs}
            />
            <MetricChart
              title="Memory Usage"
              metrics={metrics ?? []}
              field="mem_mb"
              unit=" MB"
              slugs={selectedSlugs}
              allSlugs={availableSlugs}
            />
          </div>
        )}

        {/* ── Error aggregation ── */}
        <ErrorSummary
          exceptions={exceptions ?? []}
          allSlugs={availableSlugs}
        />

        {/* ── Events table ── */}
        <RequestsTable
          requests={requests ?? []}
          exceptions={exceptions ?? []}
          allSlugs={availableSlugs}
        />
      </main>
    </div>
  )
}
