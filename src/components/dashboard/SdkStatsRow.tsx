import { StatCard } from '@/components/common/StatCard'
import { sdkColor } from '@/utils'
import type { MetricPoint, SdkSlug } from '@/types'
import styles from '@css/SdkStatsRow.module.css'

interface Props {
  slug:     SdkSlug
  metrics:  MetricPoint[]
  allSlugs: SdkSlug[]
}

export function SdkStatsRow({ slug, metrics, allSlugs }: Props) {
  // Latest poller sample for this SDK
  const samples = metrics.filter(m => m.service === slug)
  const latest  = samples.at(-1)

  const cpu = latest ? latest.cpu_percent.toFixed(1) : null
  const mem = latest ? latest.mem_mb.toFixed(0)      : null
  const color = sdkColor(slug, allSlugs)

  return (
    <div className={styles.row}>
      <div className={styles.slug}>
        <span className={styles.slugDot} style={{ background: color }} />
        {slug}
      </div>
      <div className={styles.cards}>
        <StatCard
          label="CPU Usage"
          value={cpu}
          unit="%"
          accent="green"
        />
        <StatCard
          label="Memory"
          value={mem}
          unit="MB"
          accent="blue"
        />
      </div>
    </div>
  )
}
