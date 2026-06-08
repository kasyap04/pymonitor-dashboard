import type { Theme } from '@/types'

const STORAGE_KEY = 'pymonitor-theme'

export function loadTheme(): Theme {
  return (localStorage.getItem(STORAGE_KEY) as Theme | null) ?? 'dark'
}

export function persistTheme(theme: Theme): void {
  localStorage.setItem(STORAGE_KEY, theme)
  document.documentElement.setAttribute('data-theme', theme)
}
