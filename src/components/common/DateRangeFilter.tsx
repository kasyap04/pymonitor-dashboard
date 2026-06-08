import type { DateRange } from '@/types'
import { isCustomRange } from '@/utils'
import styles from '@css/DateRangeFilter.module.css'

interface Props {
  range:    DateRange
  onChange: (range: DateRange) => void
  onClear:  () => void
}

export function DateRangeFilter({ range, onChange, onClear }: Props) {
  const custom = isCustomRange(range)

  return (
    <div className={styles.bar}>
      <span className={styles.label}>Range</span>
      <div className={styles.inputs}>
        <div className={styles.field}>
          <label className={styles.fieldLabel}>From</label>
          <input
            className={styles.input}
            type="datetime-local"
            value={range.start}
            max={range.end || undefined}
            onChange={e => onChange({ ...range, start: e.target.value })}
          />
        </div>
        <span className={styles.arrow}>→</span>
        <div className={styles.field}>
          <label className={styles.fieldLabel}>To</label>
          <input
            className={styles.input}
            type="datetime-local"
            value={range.end}
            min={range.start || undefined}
            onChange={e => onChange({ ...range, end: e.target.value })}
          />
        </div>
      </div>
      {custom
        ? <button className={styles.clearBtn} onClick={onClear}>✕ clear</button>
        : <span className={styles.liveBadge}>live · 5 min</span>
      }
    </div>
  )
}
