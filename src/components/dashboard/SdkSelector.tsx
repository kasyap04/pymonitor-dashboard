import { sdkColor } from '@/utils'
import type { SdkSlug } from '@/types'
import styles from '@css/SdkSelector.module.css'

interface Props {
  available: SdkSlug[]
  selected:  SdkSlug[]
  loading:   boolean
  onChange:  (selected: SdkSlug[]) => void
}

export function SdkSelector({ available, selected, loading, onChange }: Props) {
  function toggle(slug: SdkSlug) {
    onChange(
      selected.includes(slug)
        ? selected.filter(s => s !== slug)
        : [...selected, slug],
    )
  }

  return (
    <div className={styles.wrap}>
      <span className={styles.label}>SDKs</span>
      {loading && <span className={styles.loading}>loading services…</span>}
      {!loading && available.length === 0 && (
        <span className={styles.empty}>no services found — is the collector running?</span>
      )}
      {!loading && (
        <div className={styles.chips}>
          {available.map(slug => (
            <button
              key={slug}
              className={styles.chip}
              data-active={selected.includes(slug)}
              onClick={() => toggle(slug)}
            >
              <span
                className={styles.dot}
                style={{ background: sdkColor(slug, available) }}
              />
              {slug}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
