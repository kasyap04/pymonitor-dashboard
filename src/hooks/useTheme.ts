import { useState, useEffect } from 'react'
import { loadTheme, persistTheme } from '@/utils/theme'
import type { Theme } from '@/types'

export function useTheme(): [Theme, () => void] {
  const [theme, setTheme] = useState<Theme>(loadTheme)

  useEffect(() => {
    persistTheme(theme)
  }, [theme])

  const toggle = () => setTheme(t => (t === 'dark' ? 'light' : 'dark'))

  return [theme, toggle]
}
