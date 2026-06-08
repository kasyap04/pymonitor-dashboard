import { useState } from 'react'
import { formatTime, sdkColor, durTier, cpuTier } from '@/utils'
import type { RequestEvent, ExceptionEvent, SdkSlug } from '@/types'
import styles from '@css/RequestsTable.module.css'

type Mode = 'requests' | 'exceptions'

interface Props {
  requests:   RequestEvent[]
  exceptions: ExceptionEvent[]
  allSlugs:   SdkSlug[]
}

export function RequestsTable({ requests, exceptions, allSlugs }: Props) {
  const [mode,     setMode]     = useState<Mode>('requests')
  // Default: all SDKs selected
  const [selected, setSelected] = useState<SdkSlug[]>(allSlugs)

  // Keep selected in sync when allSlugs changes (new SDK comes online)
  const effectiveSelected = selected.length ? selected : allSlugs

  function toggleSdk(slug: SdkSlug) {
    setSelected(prev =>
      prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug],
    )
  }

  const filteredRequests = requests.filter(r => effectiveSelected.includes(r.service))
  const filteredExceptions = exceptions.filter(e => effectiveSelected.includes(e.service))

  return (
    <div className={styles.panel}>
      {/* ── Header ── */}
      <div className={styles.header}>
        <span className={styles.title}>Events</span>

        {/* Mode toggle */}
        <div className={styles.toggle}>
          <button
            className={styles.toggleBtn}
            data-active={mode === 'requests'}
            onClick={() => setMode('requests')}
          >
            Requests ({filteredRequests.length})
          </button>
          <button
            className={styles.toggleBtn}
            data-active={mode === 'exceptions'}
            data-mode="errors"
            onClick={() => setMode('exceptions')}
          >
            Exceptions ({filteredExceptions.length})
          </button>
        </div>

        <div className={styles.spacer} />

        {/* SDK multi-select */}
        {allSlugs.length > 1 && (
          <div className={styles.sdkFilter}>
            <span className={styles.filterLabel}>SDKs:</span>
            {allSlugs.map(slug => (
              <button
                key={slug}
                className={styles.chip}
                data-active={effectiveSelected.includes(slug)}
                onClick={() => toggleSdk(slug)}
              >
                <span
                  className={styles.chipDot}
                  style={{ background: sdkColor(slug, allSlugs) }}
                />
                {slug}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Table ── */}
      <div className={styles.tableWrap}>
        {mode === 'requests' ? (
          <RequestRows rows={filteredRequests} />
        ) : (
          <ExceptionRows rows={filteredExceptions} allSlugs={allSlugs} />
        )}
      </div>
    </div>
  )
}

/* ── Request rows ─────────────────────────────────────────── */

function RequestRows({ rows }: { rows: RequestEvent[] }) {
  if (rows.length === 0) return <Empty />
  return (
    <table>
      <thead>
        <tr>
          <th>Time</th>
          <th>SDK</th>
          <th>Method</th>
          <th>Path</th>
          <th>Duration</th>
          <th>CPU</th>
          <th>Memory</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i}>
            <td className={styles.timeCell}>{formatTime(r.ts)}</td>
            <td className={styles.sdkCell}>{r.service}</td>
            <td><span className={styles.method} data-m={r.method}>{r.method}</span></td>
            <td className={styles.pathCell} title={r.path}>{r.path}</td>
            <td>
              <span className={styles.dur} data-tier={durTier(r.duration_ms)}>
                {r.duration_ms.toFixed(0)}<span className={styles.durUnit}>ms</span>
              </span>
            </td>
            <td><span className={styles.cpu} data-tier={cpuTier(r.cpu_percent)}>{r.cpu_percent.toFixed(1)}%</span></td>
            <td className={styles.timeCell}>{r.mem_mb.toFixed(0)} MB</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

/* ── Exception rows ───────────────────────────────────────── */

function ExceptionRows({ rows, allSlugs }: { rows: ExceptionEvent[]; allSlugs: SdkSlug[] }) {
  if (rows.length === 0) return <Empty />
  return (
    <table>
      <thead>
        <tr>
          <th>Time</th>
          <th>SDK</th>
          <th>Type</th>
          <th>Message</th>
          <th>Path</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((e, i) => (
          <tr key={i}>
            <td className={styles.timeCell}>{formatTime(e.ts)}</td>
            <td>
              <span style={{ color: sdkColor(e.service, allSlugs), fontFamily: 'var(--font-mono)', fontSize: 11 }}>
                {e.service}
              </span>
            </td>
            <td className={styles.excType}>{e.exc_type}</td>
            <td className={styles.excMsg} title={e.exc_message}>{e.exc_message}</td>
            <td className={styles.pathCell}>{e.path ?? '—'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function Empty() {
  return (
    <div className={styles.empty}>
      <span className={styles.emptyIcon}>○</span>
      <span>no events in selected range</span>
    </div>
  )
}
