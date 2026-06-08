import {
  LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import type { TooltipProps } from 'recharts'
import { buildChartData, sdkColor } from '@/utils'
import type { MetricPoint, SdkSlug } from '@/types'
import styles from '@css/MetricChart.module.css'

interface Props {
  title:    string
  metrics:  MetricPoint[]
  field:    'cpu_percent' | 'mem_mb'
  unit:     string
  domain?:  [number | 'auto', number | 'auto']
  slugs:    SdkSlug[]
  allSlugs: SdkSlug[]
}

function ChartTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null
  return (
    <div className={styles.tooltip}>
      <div className={styles.tooltipTime}>{label}</div>
      {payload.map(p => (
        <div key={p.dataKey} className={styles.tooltipRow} style={{ color: p.color }}>
          {p.dataKey}:&nbsp;<strong>{p.value?.toFixed(1)}</strong>
        </div>
      ))}
    </div>
  )
}

export function MetricChart({ title, metrics, field, unit, domain, slugs, allSlugs }: Props) {
  const data = buildChartData(metrics, field)

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <span className={styles.title}>{title}</span>
        <div className={styles.legend}>
          {slugs.map(slug => (
            <div key={slug} className={styles.legendItem}>
              <span className={styles.legendLine} style={{ background: sdkColor(slug, allSlugs) }} />
              {slug}
            </div>
          ))}
        </div>
      </div>
      <div className={styles.chartWrap}>
        {data.length === 0 ? (
          <div className={styles.empty}>no data yet</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 8, right: 20, left: 0, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis
                dataKey="time"
                tick={{ fill: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 9 }}
                tickLine={false} axisLine={false} interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fill: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 9 }}
                tickLine={false} axisLine={false}
                tickFormatter={v => `${v}${unit}`}
                domain={domain ?? [0, 'auto']}
                width={46}
              />
              <Tooltip content={<ChartTooltip />} cursor={{ stroke: 'var(--border-hi)', strokeWidth: 1 }} />
              {slugs.map(slug => (
                <Line
                  key={slug}
                  type="monotone"
                  dataKey={slug}
                  stroke={sdkColor(slug, allSlugs)}
                  strokeWidth={1.5}
                  dot={false}
                  activeDot={{ r: 3, strokeWidth: 0 }}
                  isAnimationActive={false}
                  connectNulls
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
