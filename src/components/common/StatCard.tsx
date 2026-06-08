import styles from '@css/StatCard.module.css'

type Accent = 'green' | 'blue' | 'amber' | 'red' | 'purple' | 'pink'

interface Props {
  label:  string
  value:  string | number | null
  unit?:  string
  sub?:   string
  accent?: Accent
}

export function StatCard({ label, value, unit, sub, accent = 'green' }: Props) {
  return (
    <div className={styles.card} data-accent={accent}>
      <div className={styles.label}>{label}</div>
      <div className={styles.value}>
        {value ?? '—'}
        {unit && <span className={styles.unit}>{unit}</span>}
      </div>
      {sub && <div className={styles.sub}>{sub}</div>}
    </div>
  )
}
