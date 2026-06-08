import { aggregateErrors, sdkColor } from '@/utils'
import type { ExceptionEvent, SdkSlug } from '@/types'
import styles from '@css/ErrorSummary.module.css'

interface Props {
  exceptions: ExceptionEvent[]
  allSlugs:   SdkSlug[]
}

export function ErrorSummary({ exceptions, allSlugs }: Props) {
  const rows = aggregateErrors(exceptions)

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <span className={styles.title}>⚠ Endpoint Errors</span>
        <span className={styles.count}>{rows.length} unique error{rows.length !== 1 ? 's' : ''}</span>
      </div>
      <div className={styles.tableWrap}>
        {rows.length === 0 ? (
          <div className={styles.empty}>
            <span>✓</span>
            <span>no errors in selected range</span>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Path</th>
                <th>Error type</th>
                <th>SDK</th>
                <th>Count</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => {
                const color = sdkColor(r.service, allSlugs)
                return (
                  <tr key={i}>
                    <td className={styles.pathCell} title={r.path}>{r.path}</td>
                    <td className={styles.excType}>{r.exc_type}</td>
                    <td>
                      <span className={styles.sdkBadge} style={{ color }}>
                        <span className={styles.dot} style={{ background: color }} />
                        {r.service}
                      </span>
                    </td>
                    <td>
                      <span className={styles.countBadge}>{r.count}</span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
