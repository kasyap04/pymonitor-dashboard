import type { Theme } from '@/types'
import styles from '@css/TopBar.module.css'

interface Props {
  lastUpdate:    Date | null
  theme:         Theme
  onThemeToggle: () => void
  onRefresh:     () => void
}

export function TopBar({ lastUpdate, theme, onThemeToggle, onRefresh }: Props) {
  const time = lastUpdate
    ? lastUpdate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : '—'

  return (
    <header className={styles.bar}>
      <div className={styles.left}>
        <span className={styles.logo}>pymonitor</span>
        <div className={styles.divider} />
      </div>
      <div className={styles.right}>
        <span className={styles.liveDot} />
        <span className={styles.liveLabel}>live</span>
        <span className={styles.updated}>updated {time}</span>
        <button className={styles.btn} onClick={onRefresh}>↻ refresh</button>
        <button
          className={styles.themeBtn}
          onClick={onThemeToggle}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
        >
          {theme === 'dark' ? '☀' : '☾'}
        </button>
      </div>
    </header>
  )
}
